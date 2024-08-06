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
export const ReturnChequeForm = ({open,onclose})=>
{
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { state: rows }: any = useLocation();


  const returnChequeMutation = useMutation(API.getCheckDuplicate, {
    onSuccess: async (data) => {
        enqueueSnackbar("Sucess", {
            variant: "success",
          });
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
      },
  });

    const onSubmitHandler: SubmitFnType = async (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
      ) => {
      
        data = {
          ...data,
          COMP_CD: authState.companyID,
          BRANCH_CD: authState.user.branchCode,
        };
    
        returnChequeMutation.mutate(data);
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
                    Save
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