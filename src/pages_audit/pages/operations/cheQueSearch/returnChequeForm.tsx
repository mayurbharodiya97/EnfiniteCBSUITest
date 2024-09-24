import { CircularProgress, Dialog } from "@mui/material"
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, useContext } from "react"
import { returnChequeFormMetaData } from "./formMetaData";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { useMutation } from "react-query";
import { usePopupContext } from "components/custom/popupContext";
import * as API from "./api";
import { enqueueSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { GradientButton } from "components/styledComponent/button";
import {t} from "i18next";
import { format } from "date-fns";
export const ReturnChequeForm = ({open,onclose})=>
{
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { state: rows }: any = useLocation();


  const returnChequeMutation = useMutation(API.cheQueReturn, {
    onSuccess: async (data) => {
        enqueueSnackbar("Sucess", {
            variant: "success",
          });
          CloseMessageBox();
          onclose();
   
    },
    onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
        onclose();
      },
  });


    const onSubmitHandler: SubmitFnType = async (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
      ) => {
      
      const reqPara:any= {
          // ...data,
          COMP_CD: rows[0]?.data?.COMP_CD,
          BRANCH_CD: rows[0]?.data?.BRANCH_CD,
          ACCT_CD:data?.ACCT_CD,
          ACCT_TYPE:data?.ACCT_TYPE,
          TRAN_CD:rows[0]?.data?.TRAN_CD,
          AMOUNT:rows[0]?.data?.AMOUNT,
          CHEQUE_NO:data?.CHEQUE_NO,
          CHEQUE_DATE: format(new Date(rows[0]?.data?.CHEQUE_DATE), "dd/MMM/yyyy"),
          BANK_CD:rows[0]?.data?.BANK_CD,
          TRAN_TYPE:rows[0]?.data?.TRAN_TYPE,
          ZONE:data?.ZONE_CD,
          REASON:data?.REASON,
          CHQ_MICR_CD:rows[0]?.data?.CHQ_MICR_CD,
          ACCT_NM:data?.ACCT_NM,
          SLIP_CD:rows[0]?.data?.SLIP_CD,
          BRANCH:rows[0]?.data?.BRANCH,
          OW_ENT_BR:rows[0]?.data?.ENTERED_BRANCH_CD,
          DTL2_SR_CD:rows[0]?.data?.DTL2_SR_CD,
          DESCRIPTION:data?.DESCRIPTION,
          RBI_CLG_TRAN:"0",
          SCREEN_REF:"TRN/038",


        };
    
        returnChequeMutation.mutate(reqPara);
        endSubmit(true);
      };
    
    return(
     <Fragment>
           <Dialog
        open={open}
        PaperProps={{
        style: {
        width: "60%",
        overflow: "auto",
        },
        }}
        maxWidth="lg"
    >

        <FormWrapper
        key="retrieveForm"
        metaData={returnChequeFormMetaData as MetaDataType}
        initialValues={{
          ...rows?.[0]?.data,
          ZONE_TRAN_TYPE:rows?.[0]?.data?.TRAN_TYPE
        }}
        onSubmitHandler={onSubmitHandler}
        controlsAtBottom={true}
        formStyle={{
        background: "white",
        }}
        >
              {({ isSubmitting, handleSubmit }) => (
                <>   
               <GradientButton
                    onClick={async(event) => {
                      const btnName = await MessageBox({
                        message: "SaveData",
                        messageTitle: "Confirmation",
                        buttonNames: ["Yes", "No"],
                        loadingBtnName: ["Yes"],
                      });
                      if (btnName === "Yes") {
                        handleSubmit(event, "Save");
                      }
                    }}
                    disabled={isSubmitting}
                    endIcon={returnChequeMutation.isLoading ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Ok
                  </GradientButton>
                 <GradientButton
                 onClick={() => {
                  onclose();
                 }}
                 color={"primary"}
               >
                 Cancel
               </GradientButton>
                </>
                 
               )}

        </FormWrapper>
    </Dialog>
     </Fragment>
    )
}