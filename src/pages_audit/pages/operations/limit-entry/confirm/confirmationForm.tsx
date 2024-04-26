import { Button, Dialog } from "@mui/material";
import React, { useEffect } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { limitconfirmFormMetaData } from "./confirmFormMetadata";

export const LimitConfirmationForm = ({ closeDialog }) => {
  const { state: rows }: any = useLocation();

  useEffect(() => {
    if (rows?.[0]?.data) {
      limitconfirmFormMetaData.form.label = `Confirmation Detail \u00A0\u00A0 
      ${(
        rows?.[0]?.data?.COMP_CD +
        rows?.[0]?.data?.BRANCH_CD +
        rows?.[0]?.data?.ACCT_TYPE +
        rows?.[0]?.data?.ACCT_CD
      ).replace(/\s/g, "")}   \u00A0\u00A0   ${rows?.[0]?.data?.ACCT_NM}   `;
    }
  }, [rows?.[0]?.data]);

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1335px",
        },
      }}
    >
      <>
        <FormWrapper
          key={"limit-confirmation-Form"}
          metaData={limitconfirmFormMetaData}
          initialValues={rows?.[0]?.data ?? []}
          displayMode="view"
          hideDisplayModeInTitle={true}
          //   formStyle={{
          //     background: "white",
          //     height: "calc(100vh - 543px)",
          //     overflowY: "auto",
          //     overflowX: "hidden",
          //   }}
        >
          {({ isSubmitting, handleSubmit }) => {
            console.log("isSubmitting, handleSubmit", isSubmitting);
            return (
              <>
                <Button color="primary" onClick={handleSubmit}>
                  Confirm
                </Button>
                <Button color="primary" onClick={() => closeDialog()}>
                  Reject
                </Button>
                <Button color="primary" onClick={() => closeDialog()}>
                  close
                </Button>
              </>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
