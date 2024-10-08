import {
  ClearCacheProvider,
  LoaderPaperComponent,
  PDFViewer,
  SubmitFnType,
} from "@acuteinfo/common-base";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { extractMetaData, utilFunction } from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { useLocation } from "react-router-dom";
import { GradientButton, usePopupContext } from "@acuteinfo/common-base";
import { Dialog } from "@mui/material";
import * as API from "./api";
import {
  EMICalculateMetaData,
  EMICalculatorSecondPartMetaData,
} from "./metaData";
import { useMutation } from "react-query";
import { t } from "i18next";
import { format } from "date-fns";
const EMICalculatorForm = () => {
  const myMasterRef = useRef<any>(null);
  const myMasterDisburseRef = useRef<any>(null);
  const myMasterFromInstRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [apiData, setApiData] = useState<any>(null);
  const [formMode, setFormMode] = useState("add");
  const isErrorFuncRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [fileBlob, setFileBlob] = useState<any>(null);
  const [openPrint, setOpenPrint] = useState<any>(null);
  const [emiDetail, setEmiDetail] = useState<any>({
    DISBURS_DTL: [
      {
        SR_NO: 1,
        INST_START_DT: authState.workingDate,
        DISBURSEMENT_DT: authState.workingDate,
        SCHEDULE_DTL: [
          {
            SR_NO: 1,
          },
        ],
      },
    ],
    SCHEDULE_DTL: [
      {
        SR_NO: 1,
      },
    ],
  });
  let currentPath = useLocation().pathname;
  let reqPara;
  const label = utilFunction.getDynamicLabel(
    currentPath,
    authState?.menulistdata,
    true
  );
  EMICalculateMetaData.form.label = label;

  const resetData = async () => {
    let event: any = { preventDefault: () => {} };
    myMasterRef?.current?.handleFormReset(event, "Clear");
    setApiData(null);
  };
  const previousData = async () => {
    const formdata = await myMasterRef?.current?.getFieldData();
    if (formdata?.DISBURS_DTL && Array.isArray(formdata.DISBURS_DTL)) {
      let arrayIndex = formdata.DISBURS_DTL.length;
      const selectedObject = formdata
        ? formdata.DISBURS_DTL[arrayIndex - 2]
        : [];
      myMasterDisburseRef.current = selectedObject;
    }
    if (formdata?.SCHEDULE_DTL && Array.isArray(formdata.SCHEDULE_DTL)) {
      let arrayIndex = formdata.SCHEDULE_DTL.length;
      const selectedObject = formdata
        ? formdata.SCHEDULE_DTL[arrayIndex - 2]
        : [];
      myMasterFromInstRef.current = selectedObject;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      previousData();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const generateRequestParams = (data) => {
    const filteredDisburseData: any[] = [];
    const filteredInstallmentData: any[] = [];

    for (let i = 0; i < data?.DISBURS_DTL.length; i++) {
      const draft = data?.DISBURS_DTL[i];
      if (draft && typeof draft === "object") {
        if ("DISBURSEMENT_DT" in draft && draft.DISBURSEMENT_DT) {
          const formattedDisburseDate = format(
            new Date(draft.DISBURSEMENT_DT),
            "dd/MMM/yyyy"
          ).toUpperCase();
          draft.DISBURSEMENT_DT = formattedDisburseDate;
        }
        if ("INST_START_DT" in draft && draft.INST_START_DT) {
          const formattedInstStartDate = format(
            new Date(draft.INST_START_DT),
            "dd/MMM/yyyy"
          ).toUpperCase();
          draft.INST_START_DT = formattedInstStartDate;
        }
        if ("SR_NO" in draft) {
          delete draft.SR_NO;
        }

        filteredDisburseData.push(draft);
      }
    }
    for (let i = 0; i < data?.SCHEDULE_DTL.length; i++) {
      const draft = data?.SCHEDULE_DTL[i];
      if (draft && typeof draft === "object") {
        if ("FROM_INST" in draft) {
          delete draft.FROM_INST;
        }
        if ("TO_INST" in draft) {
          delete draft.TO_INST;
        }
        if ("SR_NO" in draft) {
          delete draft.SR_NO;
        }

        filteredInstallmentData.push(draft);
      }
    }

    return {
      A_INST_NO: data?.INSTALLMENT_NO,
      INST_NO: data?.INSTALLMENT_NO,
      DISBURSEMENT_DT: format(
        new Date(data?.DISBURSE_DATE1),
        "dd/MMM/yyyy"
      ).toUpperCase(),
      INST_START_DT: format(
        new Date(data?.INST_START_DT1),
        "dd/MMM/yyyy"
      ).toUpperCase(),
      LIMIT_AMOUNT: data?.LOAN_AMT_MAIN,
      INT_RATE: data?.INT_RATE,
      A_INST_PERIOD: data?.INST_PERIOD,
      TYPE_CD: data?.INST_TYPE,
      INT_SKIP_FLAG: data?.DATA_VAL,
      DISBURS_DTL: data?.DISBURS_DTL,
      SCHEDULE_DTL: data?.SCHEDULE_DTL,
      SCREEN_REF: "RPT/1199",
    };
  };
  const reqData = async () => {
    const data = await myMasterRef?.current?.getFieldData();
    reqPara = generateRequestParams(data);
  };
  const mutation = useMutation(API.emiCalculateData, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        messageTitle: "ERROR",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      let btn99;
      for (let i = 0; i < data?.length; i++) {
        if (data[i]?.O_STATUS === "999") {
          const btnName = await MessageBox({
            messageTitle: t("ValidationFailed"),
            message: data[0]?.O_MESSAGE,
          });
          return {};
        } else if (data[i]?.O_STATUS === "99") {
          const btnName = await MessageBox({
            messageTitle: t("Confirmation"),
            message: data[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
          });
          btn99 = btnName;
          if (btnName === "No") {
            return {};
          }
        } else if (data[i]?.O_STATUS === "9") {
          if (btn99 !== "No") {
            const btnName = await MessageBox({
              messageTitle: t("Alert"),
              message: data[i]?.O_MESSAGE,
            });
          }
          return {};
        } else if (data[0].V_MSG[0].O_STATUS === "0") {
          ReportMutation?.mutate(reqPara);
        }
      }
      CloseMessageBox();
    },
  });
  const ReportMutation = useMutation(API.emiReportData, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        messageTitle: "ERROR",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      let blobData = utilFunction.blobToFile(data, "");
      if (blobData) {
        setFileBlob(blobData);
        setOpenPrint(true);
      }
    },
  });
  const handleButtonClick = async (id: string) => {
    let event: any = { preventDefault: () => {} };
    if (id === "clear") {
      resetData();
    } else if (id === "UPDOWN") {
      setOpen(true);
    } else if (id === "calculate") {
      let event: any = { preventDefault: () => {} };
      myMasterRef?.current?.handleSubmit(event, "BUTTON_CLICK");
      reqData();
    }
  };
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    const reqPara = generateRequestParams(data);
    isErrorFuncRef.current = {
      data: reqPara,

      displayData,
      endSubmit,
      setFieldError,
    };

    mutation.mutate({
      ...isErrorFuncRef.current?.data,
    });
  };
  return (
    <Fragment>
      <FormWrapper
        key={`EMICalculateMetaData${formMode}`}
        metaData={
          extractMetaData(EMICalculateMetaData, formMode) as MetaDataType
        }
        formStyle={{
          background: "white",
        }}
        onSubmitHandler={onSubmitHandler}
        ref={myMasterRef}
        initialValues={apiData || emiDetail}
        formState={{
          MessageBox: MessageBox,
          docCd: "RPT/1199",
          refID: myMasterDisburseRef,
          fromRefId: myMasterFromInstRef,
        }}
        // setDataOnFieldChange={(action, payload) => {
        //   if (action === "EMI_SCHEDULE") {
        //     previousData();
        //   }
        // }}
        onFormButtonClickHandel={handleButtonClick}
      ></FormWrapper>
      {ReportMutation?.isLoading ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              overflow: "auto",
              padding: "10px",
              width: "600px",
              height: "100px",
            },
          }}
          maxWidth="md"
        >
          <LoaderPaperComponent />
        </Dialog>
      ) : (
        Boolean(fileBlob && fileBlob?.type?.includes("pdf")) &&
        Boolean(openPrint) && (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
                overflow: "auto",
                padding: "10px",
                height: "100%",
              },
            }}
            maxWidth="xl"
          >
            <PDFViewer
              blob={fileBlob}
              fileName={`${"EMI Calculator"}`}
              onClose={() => setOpenPrint(false)}
            />
          </Dialog>
        )
      )}
      {/* <Dialog
        open={open}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        maxWidth="lg"
      >
        <FormWrapper
          key={"EMICalculateMetaData" + formMode}
          metaData={
            extractMetaData(
              EMICalculatorSecondPartMetaData,
              formMode
            ) as MetaDataType
          }
          formStyle={{
            background: "white",
          }}
          // ref={myMasterRef}
          onSubmitHandler={() => {}}
          initialValues={emiDetail}
          formState={{
            MessageBox: MessageBox,
            docCd: "RPT/1199",
          }}
        >
          <GradientButton
            onClick={() => {
              setOpen(false);
            }}
            color={"primary"}
          >
            Close
          </GradientButton>
        </FormWrapper>
      </Dialog> */}
    </Fragment>
  );
};

export const EMICalculatorFormWrapper = () => {
  return (
    <ClearCacheProvider>
      <EMICalculatorForm />
    </ClearCacheProvider>
  );
};
