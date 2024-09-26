import { Button, Dialog } from "@mui/material";
import React from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { nscDetailFormMetaData } from "./nscFormDetailMetaData";
import { useTranslation } from "react-i18next";

export const NSCFormDetail = ({ navigate }) => {
  const { state: rows }: any = useLocation();
  const { t } = useTranslation();
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
          metaData={nscDetailFormMetaData}
          initialValues={rows?.[0]?.data ?? []}
          formStyle={{
            background: "white",
            height: "calc(100vh - 466px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <Button color="primary" onClick={() => navigate(".")}>
                {t("Close")}
              </Button>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
