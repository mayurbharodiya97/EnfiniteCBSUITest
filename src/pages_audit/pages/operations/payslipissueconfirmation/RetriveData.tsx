import React, { useContext, useRef } from "react";
import { Dialog, CircularProgress } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns/esm";
import { useMutation } from "react-query";
import { RetrievalParameterFormMetaData } from "./RetriveGridMetadata";
import * as API from "./api";
import { enqueueSnackbar } from "notistack";
import {
  FormWrapper,
  MetaDataType,
  GradientButton,
  usePopupContext,
} from "@acuteinfo/common-base";
import { t } from "i18next";

export const DataRetrival = ({ closeDialog, open, onUpload }) => {
  const formRef = useRef(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const mutation = useMutation(API.getPayslipCnfRetrieveData, {
    onSuccess: (data) => {
      onUpload(data);
      closeDialog();
    },
    onError: async (error: any) => {
      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      closeDialog();
    },
  });

  const onSubmitHandler = (data, displayData, endSubmit, setFieldError) => {
    endSubmit(true);

    const payload = {
      ENT_COMP_CD: authState?.companyID,
      ENT_BRANCH_CD: authState?.user?.branchCode,
      FROM_DT: format(new Date(data?.FROM_DT), "dd/MMM/yyyy"),
      TO_DT: format(new Date(data?.TO_DT), "dd/MMM/yyyy"),
      GD_DATE: authState?.workingDate,
      FLAG: "P",
      A_LANG: "en",
    };

    // mutation.mutate(payload);
    onUpload(payload);
    closeDialog();
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        PaperProps={{
          style: {
            width: "auto",
            height: "auto",
          },
        }}
      >
        <FormWrapper
          key={"retrievalParameterForm"}
          metaData={RetrievalParameterFormMetaData as MetaDataType}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
          }}
          initialValues={{}}
          controlsAtBottom
          containerstyle={{ padding: "10px" }}
          ref={formRef}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={handleSubmit}
                endIcon={
                  mutation.isLoading ? <CircularProgress size={20} /> : null
                }
              >
                {t("Ok")}
              </GradientButton>
              <GradientButton onClick={() => closeDialog()}>
                {t("Close")}
              </GradientButton>
            </>
          )}
        </FormWrapper>
      </Dialog>
    </>
  );
};
