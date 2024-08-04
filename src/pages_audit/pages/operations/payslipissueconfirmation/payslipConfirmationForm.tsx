import { ClearCacheProvider } from 'cache';
import { AuthContext } from 'pages_audit/auth';
import { useContext, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { commonDataRetrive, getJointDetailsList, headerDataRetrive } from '../payslip-issue-entry/api';
import FormWrapper, { MetaDataType } from 'components/dyanmicForm';
import { extractMetaData } from 'components/utils';
import { DraftdetailsFormMetaData, TotaldetailsFormMetaData } from '../payslip-issue-entry/paySlipMetadata';
import { LoadingTextAnimation } from 'components/common/loader';
import { Dialog, Paper } from '@mui/material';
import JointDetails from '../payslip-issue-entry/JointDetails';
import { usePopupContext } from 'components/custom/popupContext';
import { GradientButton } from 'components/styledComponent/button';
import { DeleteDialog } from '../payslip-issue-entry/deleteDialog';
import { LoaderPaperComponent } from 'components/common/loaderPaper';
import { AccdetailsFormMetaData, PayslipdetailsFormMetaData } from './AccdetailsFormMetaData';
import {t} from "i18next";
import { OpenWithSharp } from '@mui/icons-material';
import { ConFirmedHistory } from './conFirmedHistory';
import { format } from 'date-fns';
import * as API from './api';
import { enqueueSnackbar } from 'notistack';
import { RemarksAPIWrapper } from 'components/custom/Remarks';
function PayslipConfirmationForm({defaultView,closeDialog,slipdataRefetch}) {

    const [formMode, setFormMode] = useState(defaultView);
  const { authState } = useContext(AuthContext);
  const [jointDtl, setjointDtl] = useState(false);
  const [openConfmHistory, setopenConfmHistory] = useState(false);
  const [jointDtlData, setjointDtlData] = useState([]);
  const { state: rows } = useLocation();
  const myChequeFormRef = useRef<any>(null);
  const [openDltDialogue, setopenDltDialogue] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [isDeleteRemark, SetDeleteRemark] = useState(false);

    const requestData = {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState.user.branchCode,
        TRAN_CD: (rows)?.[0]?.data.TRAN_CD
      };
    const { data: acctDtlData, isLoading: isAcctDtlLoading } = useQuery(["headerData", requestData], () => headerDataRetrive(requestData), {
      });
      const { data: draftDtlData, isLoading: isdraftDtlLoading } = useQuery(["draftdata", requestData], () => commonDataRetrive(requestData), {
      });

   
      const jointDetailMutation = useMutation(getJointDetailsList,
        {
          onError: async (error: any) => {
    
            const btnName = await MessageBox({
              message: error?.error_msg,
              messageTitle: "error",
              buttonNames: ["Ok"],
            });
    
          },
          onSuccess: async (data) => {
            setjointDtlData(data)
          },
        }
      );
      const confirmMutation = useMutation(
        "confirmMutation",
        API.getEntryConfirmed,
        {
          onSuccess: (data) => {
            enqueueSnackbar(data, {
              variant: "success",
            });
            CloseMessageBox();
          },
          onError: (error: any) => {
            CloseMessageBox();
          },
        }
      );
      const rejectMutaion = useMutation(
        "rejectMutaion",
        API.getEntryReject,
        {
          onSuccess: (data) => {
            enqueueSnackbar(data, {
              variant: "success",
            });
            CloseMessageBox();
          },
          onError: (error: any) => {
            CloseMessageBox();
          },
        }
      );
  return (
    <>
         <Dialog
        fullWidth
        maxWidth="xl"
        open={true}
        style={{ height: "100%" }}
        PaperProps={{ style: { width: "100%" } }}
    
        >
    {!isdraftDtlLoading && !isAcctDtlLoading ? (
          <>
            <FormWrapper
              ref={myChequeFormRef}
              key={`basicinfoform${formMode}`}
              metaData={extractMetaData(PayslipdetailsFormMetaData, formMode) as MetaDataType}
              displayMode={formMode}
              onSubmitHandler={()=>{}}
              hideHeader={false}
              initialValues={{
                TRAN_DT:  (rows)?.[0]?.data.TRAN_DT,
                SLIP_CD:  (rows)?.[0]?.data?.SLIP_CD,
                PENDING_FLAG: (rows)?.[0]?.data.CONFIRMED==="Y"?"Confirmed":"Pending",
              }}
              formStyle={{ background: "white" }}
            >
                 <GradientButton
                  color={"primary"}
                  onClick={async(event) => {
                     if (rows?.RESTRICT_CNFIRM_MSG !=="") {
                      await MessageBox({
                        messageTitle: t("ValidationFailed"),
                        message: rows?.RESTRICT_CNFIRM_MSG,
                        buttonNames: ["Ok"],
                      });
                    }
                    else if (
                      !(
                        format(
                          new Date(rows?.TRAN_DT),
                          "dd/MMM/yyyy"
                        ) ===
                        format(
                          new Date(authState?.workingDate),
                          "dd/MMM/yyyy"
                        )
                      )
                    ) {
                      await MessageBox({
                        messageTitle: t("ValidationFailed"),
                        message: t("CannotConfirmBackDatedEntry"),
                        buttonNames: ["Ok"],
                      });
                    } else if (authState?.user?.id === rows?.ENTERED_BY) {
                      await MessageBox({
                        messageTitle: t("ValidationFailed"),
                        message: t("ConfirmRestrictMsg"),
                        buttonNames: ["Ok"],
                      });
                    }
                    else {
                      const buttonName = await MessageBox({
                        messageTitle: t("Confirmation"),
                        message: t("DoYouWantToAllowTheTransaction"),
                        buttonNames: ["No", "Yes"],
                        loadingBtnName: ["Yes"],
                      });
                      if (buttonName === "Yes") {
                        confirmMutation.mutate({
                          ...rows
                        })
                      }
                             
                  }
                }}
                  >
                        {t("Confirm")}
                    </GradientButton>
                    <GradientButton color={"primary"} onClick={(event) => {
                        setopenDltDialogue(true);
                    }}>
                        {t("Reject")}
                    </GradientButton>
                    <GradientButton color={"primary"} onClick={(event) => {
                     setopenConfmHistory(true)
                    }}>
                        {t("ConfHistory")}
                    </GradientButton>

                <GradientButton onClick={closeDialog} color={"primary"}>
                {t("Close")}
                </GradientButton>
            </FormWrapper>
          
  
            <FormWrapper
              key={`accdetailsformst${formMode}`}
              metaData={
                extractMetaData(
                    AccdetailsFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={() => { }}
              onFormButtonClickHandel={async (id) => {
                let startIndex = id.indexOf("[") + 1;
                let endIndex = id.indexOf("]");
                let btnIndex = parseInt(id.substring(startIndex, endIndex)); // 
                const formDadata = await myChequeFormRef?.current?.getFieldData();
                if (formDadata && formDadata.PAYSLIP_MST_DTL) {
                  let arrayIndex = formDadata.PAYSLIP_MST_DTL.length - 1 - btnIndex;
                  if (arrayIndex >= 0 && arrayIndex < formDadata.PAYSLIP_MST_DTL.length) {
                    const selectedObject = formDadata ? formDadata.PAYSLIP_MST_DTL[arrayIndex] : [];
                    const retrivedObj = acctDtlData ? acctDtlData[btnIndex] : [];
                    const ACCT_CD = formMode === "add" ? selectedObject.ACCT_CD : retrivedObj.ACCT_CD;
                    const ACCT_TYPE = formMode === "add" ? selectedObject.ACCT_TYPE : retrivedObj.ACCT_TYPE
                    jointDetailMutation.mutate({
                      ACCT_CD,
                      ACCT_TYPE,
                      COMP_CD: authState?.companyID,
                      BRANCH_CD: authState.user.branchCode,
                    });

                    setjointDtl(true);
                  }
                }
              }}

              initialValues={{
                PAYSLIP_MST_DTL:acctDtlData ?? [],
              }}
              hideHeader={true}
              formStyle={{ background: "white", height: "31vh", overflow: "scroll" }}
              formState={{ MessageBox: MessageBox, Mode: formMode }}
            />

            <FormWrapper
              key={`draftmstdetails${formMode}`}
              metaData={
                extractMetaData(
                  DraftdetailsFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={() => { }}
              initialValues={{
                PAYSLIP_DRAFT_DTL:draftDtlData ?? [],
              }}


              hideHeader={true}
              formStyle={{ background: "white", height: "40vh", overflow: "scroll" }}
            />


            <FormWrapper
              key={`totaldetaisformst${formMode}}`}
              metaData={extractMetaData(TotaldetailsFormMetaData, formMode) as MetaDataType}
              displayMode={formMode}
              onSubmitHandler={() => { }}
              initialValues={{}}
              hideHeader={true}
              formStyle={{ background: "white", height: "auto" }}
            />

          </>
        ) : <Paper sx={{ display: "flex", justifyContent: "center" }}>
          <LoaderPaperComponent />
        </Paper>}
        <Dialog
          open={jointDtl}
          fullWidth
          maxWidth="lg"
        >
          <JointDetails
            data={jointDtlData}
            loading={jointDetailMutation.isLoading}
            onClose={async (result) => {
              setjointDtl(result);
            }}
          />

        </Dialog>
        <DeleteDialog
        closeDialog={closeDialog}
        open={openDltDialogue}
        rowData={{
          ...(rows?.[0]?.data || {}),
          draftDtlData: draftDtlData,
          acctDtlData: acctDtlData,
          SCREEN_REF:"RPT/15"
        }}
        slipdataRefetch={slipdataRefetch}
      />
        </Dialog>
        {isDeleteRemark && (
                      <RemarksAPIWrapper
                        TitleText={
                          "Enter Removal Remarks For PAYSLP ISSUE CONFIRMATION RPT/15"
                        }
                        onActionNo={() => SetDeleteRemark(false)}
                        onActionYes={async (val, rows) => {
                          const buttonName = await MessageBox({
                            messageTitle: t("Confirmation"),
                            message: t("DoYouWantDeleteRow"),
                            buttonNames: ["Yes", "No"],
                            defFocusBtnName: "Yes",
                            loadingBtnName: ["Yes"],
                          });
                          if (buttonName === "Yes") {
                            let deleteReqPara = {
                              REQ_FLAG: "A",
                              TRAN_TYPE: "Delete",
                              COMP_CD: acctDtlData[0].ENTERED_COMP_CD,
                              BRANCH_CD: acctDtlData[0].ENTERED_BRANCH_CD,
                              ACCT_CD: rows.ACCT_CD,
                              ACCT_TYPE: rows.ACCT_TYPE,
                              AMOUNT: rows.AMOUNT,
                              REMARKS: acctDtlData[0].REMARKS,
                              SCREEN_REF: "RPT/15",
                              CONFIRMED: rows.CONFIRMED,
                              USER_DEF_REMARKS: val,
                              TRAN_CD: rows.TRAN_CD,
                              ENTERED_BY: rows.draftDtlData[0].ENTERED_BY,
                              PAYSLIP_NO: rows.PAYSLIP_NO,
                              _isNewRow: false,                             
                            
                             
                            };
                            rejectMutaion.mutate(deleteReqPara);
                          }
                        }}
                        isEntertoSubmit={true}
                        AcceptbuttonLabelText="Ok"
                        CanceltbuttonLabelText="Cancel"
                        open={isDeleteRemark}
                        defaultValue={"WRONG ENTRY FROM PAYSLIP ISSUE ENTRY CONFIRMATION (RPT/15)"
                        }
                        rows={rows}
                      />
                    )}
        {
          openConfmHistory?(
          <ConFirmedHistory
          open={openConfmHistory}
          close={()=>setopenConfmHistory(false)}
          />
          ):""
        }
    </>
  )
}


export const PayslipConfirmationFormDetails = ({ defaultView, closeDialog, slipdataRefetch }) => {
    return (
     
      <ClearCacheProvider>
        <PayslipConfirmationForm
          defaultView={defaultView}
          closeDialog={closeDialog}
          slipdataRefetch={slipdataRefetch}
        />
      </ClearCacheProvider>
    );
  };