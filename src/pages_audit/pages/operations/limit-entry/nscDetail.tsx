import { Button, Dialog } from "@mui/material";
import React from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { NSC_FormMetaData } from "./limit_NSC_FD_Metadata";

export const NSCFormDetail = ({ navigate }) => {
  const { state: rows }: any = useLocation();
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "950px",
        },
      }}
    >
      <>
        <FormWrapper
          key={"nscdetailForm"}
          metaData={NSC_FormMetaData}
          initialValues={rows?.[0]?.data ?? []}
          formStyle={{
            background: "white",
            height: "calc(100vh - 367px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            console.log("isSubmitting, handleSubmit", isSubmitting);
            return (
              <Button color="primary" onClick={() => navigate(".")}>
                close
              </Button>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
