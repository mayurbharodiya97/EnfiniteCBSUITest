import { ClearCacheProvider } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, useContext, useRef, useState } from "react";
import { extractMetaData, utilFunction } from "components/utils";
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
import { Button, CircularProgress, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Toolbar, Tooltip, Typography } from "@mui/material";
import { useDialogStyles } from "components/detailPopupGridData";
import { EMICalculateMetaData, EMICalculatorSecondPartMetaData } from "./metaData";
import { MasterDetailsForm } from "components/formcomponent";
import {  MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { cloneDeep } from "lodash";

const EMICalculatorForm = () => {

  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [apiData, setApiData] = useState<any>(null);
  const [open, setOpen] = useState(false)
  const [formMode, setFormMode] = useState("add");
  const [isData,setIsData]=useState({});
let a=1;
  const [emiDetail, setEmiDetail] = useState<any>({
    EMI_DETAIL1: [
      {  INST_START_DATE:authState.workingDate,
        DISBURSE_DATE:authState.workingDate
      },
    ],
  });
  const [emi,setEmi]=useState<any>({
    EMI_DETAIL2: [
      {  
        SR_NO : a++,
        //@ts-ignore
        EMI_RS:isData?.EMI_RS,
        //@ts-ignore
        FROM_INST:isData?.FROM_INST,
        //@ts-ignore
        TO_INST:isData?.TO_INST,
      },
    ],
  })

  let currentPath = useLocation().pathname;
  const label = utilFunction.getDynamicLabel(currentPath, authState?.menulistdata, true);
  EMICalculateMetaData.form.label = label;


  const resetData = () => {
    let event: any = { preventDefault: () => { } };
    myMasterRef?.current?.handleFormReset(event, "Clear");
    setApiData(null);
  }
console.log(isData)
  return (
    <Fragment>
      <FormWrapper
        key={"EMICalculateMetaData" + formMode}
        metaData={
          extractMetaData(
            EMICalculateMetaData,
            formMode
          ) as MetaDataType
        }
        formStyle={{
          background: "white",
        }}
        ref={myMasterRef}
        initialValues={apiData || emiDetail}
        formState={{
          MessageBox: MessageBox,
          docCd: "RPT/1199"
        }}
        setDataOnFieldChange={(action, payload) => {
          if (action === "EMI_SCHEDULE") {
            setIsData({
              TO_INST: payload?.validateData.TO_INST,
              FROM_INST: payload?.validateData.FROM_INST,
              REM_INST: payload?.validateData.REM_INST,
              EMI_RS: payload?.validateData.EMI_RS,
            })
            console.log(payload);
          }
        }}
        onFormButtonClickHandel={()=>{setOpen(true)}}
      >
          <>
        <GradientButton>Calculate</GradientButton>
        <GradientButton onClick={resetData}>Clear</GradientButton>
      </>
      </FormWrapper> 
      <FormWrapper
        key={"EMICalculateMetaData" + formMode+isData}
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
        initialValues={emi}
        formState={{
          MessageBox: MessageBox,
          docCd: "RPT/1199"
        }}
      > 
    </FormWrapper>
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
        initialValues={isData}
        formState={{
          MessageBox: MessageBox,
          docCd: "RPT/1199"
        }}
      >       <GradientButton onClick={()=>{setOpen(false)}} color={"primary"}>
      Close
    </GradientButton>
    </FormWrapper>
      </Dialog>        
    </Fragment>
  )
};

export const EMICalculatorFormWrapper = () => {
  return (
    <ClearCacheProvider>
      <EMICalculatorForm />
    </ClearCacheProvider>
  );
};