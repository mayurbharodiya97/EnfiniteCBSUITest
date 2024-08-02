import { ClearCacheProvider } from 'cache';
import { AuthContext } from 'pages_audit/auth';
import { useContext, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
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
import { GeneralAPI } from 'registry/fns/functions';

function PayslipConfirmationForm({defaultView,closeDialog,slipdataRefetch}) {

    const [formMode, setFormMode] = useState(defaultView);
  const { authState } = useContext(AuthContext);
  const [jointDtl, setjointDtl] = useState(false);
  const [jointDtlData, setjointDtlData] = useState([]);
  const { state: rows } = useLocation();
  const myChequeFormRef = useRef<any>(null);
  const [openDltDialogue, setopenDltDialogue] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();

    const requestData = {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState.user.branchCode,
        TRAN_CD: (rows)?.[0]?.data.TRAN_CD
      };
    const { data: acctDtlData, isLoading: isAcctDtlLoading } = useQuery(["headerData", requestData], () => headerDataRetrive(requestData), {
        // enabled: formMode !== "add",
      });
      const { data: draftDtlData, isLoading: isdraftDtlLoading } = useQuery(["draftdata", requestData], () => commonDataRetrive(requestData), {
        // enabled: formMode !== "add",
      });
      // const { data: acctData, isLoading: isacctDataLoading } = useQuery(
      //   ["draftdata"],
      //   () => GeneralAPI.getAccNoValidation({
      //     COMP_CD: authState?.companyID,
      //     BRANCH_CD: authState.user.branchCode,
      //     ACCT_TYPE: acctDtlData ? acctDtlData[0]?.ACCT_TYPE : "",
      //     ACCT_CD: acctDtlData ? acctDtlData[0]?.ACCT_CD : "",
      //     SCREEN_REF: "RPT/15",
      //   }),
      //   {
      //     enabled: formMode !== "add",
      //   }
      // );
      
   
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
  return (
  <Fragment>
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
                <GradientButton color={"primary"}>
                        Confirm
                    </GradientButton>
                    <GradientButton color={"primary"} onClick={(event) => {
                        setopenDltDialogue(true);
                    }}>
                        Reject
                    </GradientButton>

                <GradientButton onClick={closeDialog} color={"primary"}>
                Close
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
  </Fragment>
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