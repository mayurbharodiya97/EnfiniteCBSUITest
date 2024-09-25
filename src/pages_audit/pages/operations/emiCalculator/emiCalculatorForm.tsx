import { ClearCacheProvider } from "@acuteinfo/common-base";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import { Fragment, useContext, useRef, useState } from "react";
import { extractMetaData, utilFunction } from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { useLocation } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import * as API from "./api";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { format } from "date-fns";
import { PrintButton } from "components/common/printButton";
import { GradientButton } from "components/styledComponent/button";
import { makeStyles } from "@mui/styles";
import logo from "assets/images/logo.jpg";
import {
  Button,
  CircularProgress,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDialogStyles } from "components/detailPopupGridData";
import {
  EMICalculateMetaData,
  EMICalculatorSecondPartMetaData,
} from "./metaData";
import { MasterDetailsForm } from "components/formcomponent";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { cloneDeep } from "lodash";

import {
  Button,
  CircularProgress,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  EMICalculateMetaData,
  EMICalculatorSecondPartMetaData,
} from "./metaData";
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
  // const [draftState, setDraftState] = useState<any>({
  //   PAYSLIP_DRAFT_DTL: [{ TO_DT: authState?.workingDate ?? "" }],
  // });

  const [emiDetail, setEmiDetail] = useState<any>({
    DISBURS_DTL: [
      {
        SR_NO: 1,
        INST_START_DT: authState.workingDate,
        DISBURSE_DATE: authState.workingDate,
        EMI_DETAIL2: [
          {
            SR_NO: 1,
          },
        ],
      },
    ],
    EMI_DETAIL2: [
      {
        SR_NO: 1,
      },
    ],
  });
  const [disburseAdd, setDisburseAdd] = useState<any>(emiDetail);
  let currentPath = useLocation().pathname;
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
  };

  const previousData1 = async () => {
    const formdata = await myMasterRef?.current?.getFieldData();
    if (formdata?.EMI_DETAIL2 && Array.isArray(formdata.EMI_DETAIL2)) {
      let arrayIndex = formdata.EMI_DETAIL2.length;
      const selectedObject = formdata
        ? formdata.EMI_DETAIL2[arrayIndex - 1]
        : [];
      myMasterFromInstRef.current = selectedObject;
    }
  };
  previousData1();
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
        key={`EMICalculateMetaData${formMode}${disburseAdd?.DISBURS_DTL?.length}`}
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
          refID: myMasterDisburseRef,
          fromRefId: myMasterFromInstRef,
        }}
        setDataOnFieldChange={(action, payload) => {
          if (action === "EMI_SCHEDULE") {
            previousData();
          }
          // else if (action === "EMI_SCHEDULE1") {
          //   previousData();
          // }
        }}
        onFormButtonClickHandel={async (id) => {
          console.log(id);
          if (id === "clear") {
            resetData();
          }
          if (id === "DISBURS_DTL[0].UPDOWN") {
            setOpen(true);
          }
        }}
      ></FormWrapper>

      <Dialog
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
          // initialValues={""}
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
      </Dialog>
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
