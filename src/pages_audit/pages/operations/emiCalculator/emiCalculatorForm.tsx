import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import {
  FormWrapper,
  utilFunction,
  SubmitFnType,
  usePopupContext,
  MetaDataType,
  LoaderPaperComponent,
  PDFViewer,
  Alert,
} from "@acuteinfo/common-base";

import { CustomGridTable } from "./emiScheduleSection";
import { Dialog } from "@mui/material";
import { format } from "date-fns";
import { useMutation } from "react-query";
import { emiCalculateData, emiReportData } from "./api";
import { EmiCalculatorFormMetadata } from "./emiCalculatorMetadata";
import { CustomRowTable } from "./emiDisbursementSec";
export const CounterContext = createContext<any>(null);

export const EMICalculatorForm = () => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const emiCalRef = useRef<any>(null);
  const dataRef = useRef<any>(null);
  const emiHeaderRef = useRef<any>(null);
  const [disburseData, setDisburseData] = useState<any>(null);
  const [refreshForm, setRefreshForm] = useState<number>(0);
  const [disbursementFlag, setDisbursementFlag] = useState<boolean>(false);
  const scheduleDtlref = useRef<any>({});
  const calculateData = useRef<any>({});
  const [open, setOpen] = useState(false);
  const [mergedData, setMergedData] = useState<any>([]);
  const [fileBlob, setFileBlob] = useState<any>(null);
  const [openPrint, setOpenPrint] = useState<any>(null);
  const [resetDaa, setResetData] = useState<any>(false);
  const [emiCalFormIniVal, setEmiCalFormIniVal] = useState<any>({
    DISBURS_DTL: [
      {
        SR_NO: 1,
        INST_START_DT: authState.workingDate ?? "",
        DISBURSEMENT_DT: authState.workingDate ?? "",
        LOAN_AMT: "",
      },
    ],
  });

  const dataref = useRef({
    DISBURS_DTL: [
      {
        SR_NO: 1,
        INST_START_DT: authState.workingDate ?? "",
        DISBURSEMENT_DT: authState.workingDate ?? "",
        LOAN_AMT: "",
      },
    ],
  });

  let currentPath = useLocation().pathname;
  const label = utilFunction.getDynamicLabel(
    currentPath,
    authState?.menulistdata,
    true
  );
  EmiCalculatorFormMetadata.form.label = label;
  const saveData = (values) => {
    calculateData.current = values;
  };
  const resetData = async () => {
    let event: any = { preventDefault: () => {} };
    emiHeaderRef?.current?.handleFormReset(event, "Clear");
    setEmiCalFormIniVal({
      DISBURS_DTL: [
        {
          SR_NO: 1,
          INST_START_DT: authState.workingDate ?? "",
          DISBURSEMENT_DT: authState.workingDate ?? "",
          LOAN_AMT: "",
        },
      ],
    });
  };

  const mutation = useMutation(emiCalculateData, {
    onError: (error: any) => {},
    onSuccess: (data, variables) => {},
  });

  const ReportMutation = useMutation(emiReportData, {
    onError: async (error: any) => {
      await MessageBox({
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

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    const requestData = {
      LIMIT_AMOUNT: data?.LOAN_AMT_MAIN ?? "0",
      A_INST_NO: data?.INSTALLMENT_NO ?? "0",
      INST_NO: data?.INSTALLMENT_NO ?? "0",
      INT_RATE: data?.INT_RATE ?? "",
      A_INST_PERIOD: data?.INST_PERIOD ?? "",
      TYPE_CD: data?.INST_TYPE ?? "",
      INST_START_DT: Boolean(calculateData.current[0]?.INST_START_DT)
        ? calculateData.current[0]?.INST_START_DT
        : authState?.workingDate,
      DISBURSEMENT_DT: Boolean(calculateData.current[0]?.DISBURSEMENT_DT)
        ? calculateData.current[0]?.DISBURSEMENT_DT
        : authState?.workingDate,
      INT_SKIP_FLAG: data?.DATA_VAL ?? "",
      DISBURS_DTL: calculateData.current[1] ?? [],
      SCHEDULE_DTL:
        calculateData.current[0]?.length === 1
          ? [calculateData.current[3]]
          : calculateData.current[0],
      A_GD_DATE: authState?.workingDate ?? "",
      SCREEN_REF: "RPT/1199",
    };
    mutation.mutate(requestData, {
      onSuccess: async (data) => {
        ReportMutation.mutate(requestData);
        // for (let i = 0; i < data?.length; i++) {
        //   if (data[i]?.O_STATUS === "999") {
        //     const btnName = await MessageBox({
        //       messageTitle: data[i]?.O_MSG_TITLE || "ValidationFailed",
        //       message: data[i]?.O_MESSAGE,
        //       buttonNames: ["Ok"],
        //       icon: "ERROR",
        //     });
        //   } else if (data[i]?.O_STATUS === "9") {
        //     const btnName = await MessageBox({
        //       messageTitle: data[i]?.O_MSG_TITLE || "Alert",
        //       message: data[i]?.O_MESSAGE,
        //       icon: "WARNING",
        //     });
        //   } else if (data[i]?.O_STATUS === "99") {
        //     const btnName = await MessageBox({
        //       messageTitle: data[i]?.O_MSG_TITLE || "Confirmation",
        //       message: data[i]?.O_MESSAGE,
        //       buttonNames: ["Yes", "No"],
        //       icon: "CONFIRM",
        //     });
        //     if (btnName === "No") {
        //       break;
        //     }
        //   } else if (
        //     Boolean(data[i]?.V_MSG) &&
        //     data[i]?.V_MSG[0].O_STATUS === "0"
        //   ) {
        //     ReportMutation.mutate(requestData);
        //   }
        // }
      },
      onError: (data) => {},
    });
  };
  const handleSetDisburseData = (payload: any) => {
    setDisburseData(payload);
  };
  useEffect(() => {
    if (disburseData) {
      setRefreshForm((prevVal) => prevVal + 1);
    }
  }, [disburseData]);

  return (
    <>
      {mutation.isError && (
        <Alert
          severity="error"
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      )}
      <FormWrapper
        key={"EMICalculatorForm"}
        metaData={EmiCalculatorFormMetadata as MetaDataType}
        onSubmitHandler={onSubmitHandler}
        initialValues={{}}
        formStyle={{
          background: "white",
        }}
        formState={{
          MessageBox: MessageBox,
        }}
        ref={emiHeaderRef}
        onFormButtonClickHandel={async (id) => {
          if (id === "CLEAR") {
            await resetData();
            setResetData(true);
            setRefreshForm((prevVal) => prevVal + 1);

            setTimeout(() => {
              setResetData(false);
            }, 1000);
          }
          if (id === "CALCULATE") {
            let event: any = { preventDefault: () => {} };
            emiHeaderRef?.current?.handleSubmit(event, "BUTTON_CLICK");
          }
        }}
        setDataOnFieldChange={async (action, payload) => {
          if (action === "RESET_DATA" && Boolean(payload?.RESET_DATA)) {
            let event: any = { preventDefault: () => {} };
            // await emiCalRef?.current?.handleFormReset(event, "Clear");
            // setEmiCalFormIniVal({
            //   DISBURS_DTL: [
            //     {
            //       SR_NO: 1,
            //       INST_START_DT: authState.workingDate ?? "",
            //       DISBURSEMENT_DT: authState.workingDate ?? "",
            //       LOAN_AMT: "",
            //     },
            //   ],
            // });
            // scheduleDtlref.current = {};
            setResetData(true);
            setTimeout(() => {
              setResetData(false);
            }, 1000);
            // setRefreshForm((prevVal) => prevVal + 1);
          } else if (action === "GET_DATA") {
            handleSetDisburseData(payload);
          }
        }}
      ></FormWrapper>
      <CounterContext.Provider value={{ mergedData, saveData }}>
        <CustomRowTable
          initialRows={[{ ...disburseData }]}
          totalInstallment={0}
          resetDaa={resetDaa}
        />
      </CounterContext.Provider>
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
    </>
  );
};
