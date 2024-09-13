import { ClearCacheProvider } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { extractMetaData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { useLocation } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import { GradientButton } from "components/styledComponent/button";
import { Dialog } from "@mui/material";
import {
  EMICalculateMetaData,
  EMICalculatorSecondPartMetaData,
} from "./metaData";
import { SubmitFnType } from "packages/form";

const EMICalculatorForm = () => {
  const myMasterRef = useRef<any>(null);
  const myMasterSecRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [apiData, setApiData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const isErrorFuncRef = useRef<any>(null);
  const [emiDetail, setEmiDetail] = useState<any>({
    DISBURS_DTL: [
      {
        SR_NO: 1,
        INST_START_DT: authState.workingDate,
        DISBURSE_DATE: authState.workingDate,
      },
      // EMI_DETAIL2: [
      //   {
      //     SR_NO:1,
      //   }
      // ],
    ],
  });

  let currentPath = useLocation().pathname;
  const label = utilFunction.getDynamicLabel(
    currentPath,
    authState?.menulistdata,
    true
  );
  EMICalculateMetaData.form.label = label;

  const resetData = async () => {
    let event: any = { preventDefault: () => {} };
    // myMasterRef?.current?.handleFormReset(event, "Clear");
    // setApiData(null);
  };
  const previousData = async () => {
    const formdata = await myMasterRef?.current?.getFieldData();
    if (formdata?.DISBURS_DTL && Array.isArray(formdata.DISBURS_DTL)) {
      let arrayIndex = formdata.DISBURS_DTL.length;
      const selectedObject = formdata
        ? formdata.DISBURS_DTL[arrayIndex - 2]
        : [];
      myMasterSecRef.current = selectedObject;
    }
  };

  //   const calculate = async()=>{
  //     const data = await myMasterRef?.current.getFieldData()
  //     console.log(data);
  //     const para = {
  //     A_INST_NO: "1",
  //     A_LOAN_AMT: "500",
  //     DISBURSE_DATE: "11/SEP/2024",
  //     INST_START_DT: "11/SEP/2025",
  //     LIMIT_AMOUNT: "1000.00",
  //     INST_NO: "12",
  //     INT_RATE: "12.00",
  //     A_INST_PERIOD: "2",
  //     TYPE_CD: "1",
  //     DISBURSEMENT_DT: "12/SEP/2024",
  //     INT_SKIP_FLAG: "Y",
  //     DISBURS_DTL: [
  //         {
  //             "TOT_LOAN_AMT": "10.00",
  //             "LOAN_AMT": "1000.00",
  //             "INST_START_DT": "24/SEP/2024",
  //             "DISBURSEMENT_DT": "12/SEP/2024"
  //         }
  //     ],
  //     "SCHEDULE_DTL": [
  //         {
  //             "NO_OF_INST": "12",
  //             "EMI_RS": "88.00",
  //             "TOT_INST": "12"
  //         }
  //     ],
  //     "SCREEN_REF": "RPT/1199"
  // }
  //   }

  return (
    <Fragment>
      <FormWrapper
        key={"EMICalculateMetaData" + formMode}
        metaData={
          extractMetaData(EMICalculateMetaData, formMode) as MetaDataType
        }
        formStyle={{
          background: "white",
        }}
        onSubmitHandler={() => {}}
        ref={myMasterRef}
        initialValues={apiData || emiDetail}
        formState={{
          MessageBox: MessageBox,
          docCd: "RPT/1199",
          refID: myMasterSecRef,
        }}
        // setDataOnFieldChange={(action, payload) => {
        //   if (action === "EMI_SCHEDULE") {
        //     previousData();
        //   }
        // }}
        onFormButtonClickHandel={() => {
          setOpen(true);
        }}
      >
        <>
          <GradientButton>Calculate </GradientButton>
          <GradientButton onClick={resetData}> Clear </GradientButton>
        </>
      </FormWrapper>
      {/* <FormWrapper
      key={"EMICalculateMetaData" + formMode + isData}
      hideHeader={true}
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
      initialValues={emi}
      formState={{
        MessageBox: MessageBox,
        docCd: "RPT/1199",
      }}
    ></FormWrapper> */}
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
          onSubmitHandler={() => { }}
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
          initialValues={isData}
          formState={{
            MessageBox: MessageBox,
            docCd: "RPT/1199",
          }}
        >
          {" "}
          < GradientButton
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
