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
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { enqueueSnackbar } from "notistack";

export const ActionDialog = ({open, setOpen, closeForm, action, REQUEST_CD
    // isLoading, setIsLoading, data, mt
  }) => {
    const { authState } = useContext(AuthContext);
    const {state, handleUpdatectx, handleFormModalClosectx} = useContext(CkycContext);
    const confirmFormRef = useRef<any>("");
    let initialVal = {}
    const confirmed = action === "confirm" 
                                  ? "Y" 
                                  : action === "query" 
                                    ? "M"
                                    : action === "reject" && "R";
    const successMsg = action === "confirm"
      ? `Request ID ${REQUEST_CD} confirmed Successfully.`
      :  action === "query"
        ? `Request ID ${REQUEST_CD} sent for modificaction successfully.`
        : action === "reject" && 
          `Request ID ${REQUEST_CD} rejected successfully.`
    const mutation: any = useMutation(API.ConfirmPendingCustomers, {
        onSuccess: (data) => {
            // console.log("data o n save", data)
            handleFormModalClosectx()
            closeForm()
            enqueueSnackbar(successMsg, { variant: "success"});
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
  
    return <RemarksAPIWrapper
      TitleText={"Confirmation"}
      onActionNo={() => setOpen(false)}
      onActionYes={(val, rows) => {
        // console.log(val, "weiuifuhiwuefefgwef", rows)
        mutation.mutate({
            REQUEST_CD: REQUEST_CD ?? "",
            REMARKS: val ?? "",
            CONFIRMED: confirmed
        })
      }}
      isLoading={mutation.isLoading || mutation.isFetching}
      isEntertoSubmit={true}
      AcceptbuttonLabelText="Ok"
      CanceltbuttonLabelText="Cancel"
      open={open}
      rows={{}}
      isRequired={confirmed === "Y" ? false : true}
      defaultValue={""}
    />
  }