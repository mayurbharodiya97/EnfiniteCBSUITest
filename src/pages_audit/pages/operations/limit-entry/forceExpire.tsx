import { Button, Dialog } from "@mui/material";
import React from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { forceExpireMetaData } from "./forceExpireFormMetadata";

export const ForceExpire = ({ navigate }) => {
  const { state: rows }: any = useLocation();

  console.log("<<<row2222s", rows);
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1150px",
        },
      }}
    >
      <>
        <FormWrapper
          key={"nscdetailForm"}
          metaData={forceExpireMetaData}
          initialValues={rows?.[0]?.data ?? []}
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
