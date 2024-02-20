import React, { useContext, useRef } from "react";
import { CkycContext } from "../../CkycContext";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "../../api";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { ckyc_confirmation_form_metadata } from "../formDetails/metadata/confirmation";
import { GradientButton } from "components/styledComponent/button";
import { Alert } from "components/common/alert";

export const ActionDialog = ({open, onClose, closeForm, action
    // isLoading, setIsLoading, data, mt
  }) => {
    const { authState } = useContext(AuthContext);
    const {state, handleUpdatectx, handleFormModalClosectx} = useContext(CkycContext);
    const confirmFormRef = useRef<any>("");
    let initialVal = {}
    const confirmed = action == "confirm" 
                                  ? "Y" 
                                  : action == "query" 
                                    ? "M"
                                    : action == "reject" && "R"
    const mutation: any = useMutation(API.ConfirmPendingCustomers, {
        onSuccess: (data) => {
            // console.log("data o n save", data)
            handleFormModalClosectx()
            closeForm()
        },
        onError: (error: any) => {
            // console.log("data o n error", error)
            // setIsUpdated(true)
        },
    });
  
    const onAction = (e) => {
      confirmFormRef.current.handleSubmitError(e, "save")
    }
  
    const onSubmitFormHandler = (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag,
      hasError
    ) => {
      if(data && !hasError) {
            mutation.mutate({
              REQUEST_CD: state?.req_cd_ctx ?? "",
              REMARKS: data.REMARKS ?? "",
              CONFIRMED: confirmed
          })
      }
    };
  
    return <Dialog open={open} maxWidth="sm"
        PaperProps={{
            style: {
                minWidth: "40%",
                width: "40%",
            }
        }}
    >
        <DialogTitle
            sx={{
                background: "var(--theme-color3)",
                color: "var(--theme-color2)",
                letterSpacing: "1.3px",
                boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                fontWeight: 500,
                borderRadius: "inherit",
                minWidth: "450px",
                py: 1,
            }}
            id="responsive-dialog-title"
        >
            Confirmation
            {/* {isLoading ? "Updating..." : "Updated Successfully"} */}
            {/* {"Updating..."} */}
        </DialogTitle>
        <DialogContent>
          {mutation.isError && (
            <Alert
              severity={mutation.error?.severity ?? "error"}
              errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
              errorDetail={mutation.error?.error_detail}
              color="error"
            />
          )}
          <FormWrapper
            ref={confirmFormRef}
            key={"pod-form-kyc" + initialVal}
            metaData={ckyc_confirmation_form_metadata as MetaDataType}
            // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
            initialValues={initialVal}
            formStyle={{}}
            hideHeader={true}
            onSubmitHandler={onSubmitFormHandler}
            formState={{confirmed:confirmed}}
          />
        </DialogContent>
        <DialogActions>
            <GradientButton
                autoFocus
                onClick={onAction}
            >
                {action && action == "confirm" 
                  ? "CONFIRM" 
                  : action == "query" 
                    ? "RAISE QUERY"
                    : action == "reject" && "REJECT"
                }
            </GradientButton>
            <GradientButton
                autoFocus
                onClick={onClose}
            >
                CANCEL
            </GradientButton>
        </DialogActions> 
    </Dialog>
  }