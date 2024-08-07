import React, { useContext, useRef } from "react";
import { Dialog, CircularProgress } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns/esm";
import { useMutation } from "react-query";
import { RetrievalParameterFormMetaData } from "./paySlipMetadata";
import * as API from "./api";
import {
  GradientButton,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
export const DataRetrival = ({ closeDialog, open, onUpload }) => {
  const formRef = useRef(null);
  const { authState } = useContext(AuthContext);

  const mutation = useMutation(API.getRetrievalDateWise, {
    onSuccess: (data) => {
      console.log(data);
      onUpload(data);
      closeDialog();
    },
    onError: () => {},
  });

  const onSubmitHandler = (data, displayData, endSubmit, setFieldError) => {
    endSubmit(true);

    const payload = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      TRAN_CD: data?.DESCRIPTION,
      FROM_DT: format(new Date(data?.FROM_DT), "dd/MMM/yyyy"),
      TO_DT: format(new Date(data?.TO_DT), "dd/MMM/yyyy"),
      USER_LEVEL: authState?.role,
      GD_DATE: authState?.workingDate,
    };

    mutation.mutate(payload);
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
                Ok
              </GradientButton>
              <GradientButton onClick={() => closeDialog()}>
                Cancel
              </GradientButton>
            </>
          )}
        </FormWrapper>
      </Dialog>
    </>
  );
};
