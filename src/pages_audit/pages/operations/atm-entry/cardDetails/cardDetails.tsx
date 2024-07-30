import { Button, Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { t } from "i18next";
import React from "react";
import { CardDetailsMetaData } from "./cardDetailsMetadata";
import { useLocation } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";

export const CardDetails = ({ navigate, setIsData }) => {
  const { state: rows }: any = useLocation();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1004px",
          padding: "5px",
        },
      }}
    >
      <FormWrapper
        key={"atm-reg-entry"}
        metaData={CardDetailsMetaData as MetaDataType}
        initialValues={rows?.[0]?.data ?? {}}
        displayMode={rows?.length ? "view" : "add"}
        hideDisplayModeInTitle={true}
        formState={{ MessageBox: MessageBox }}
        onSubmitHandler={(data: any, displayData, endSubmit) => {
          // @ts-ignore
          endSubmit(true);
          setIsData((old) => ({ ...old, gridData: [...old.gridData, data] }));
          navigate(".");
        }}
        formStyle={{
          background: "white",
          height: "calc(100vh - 442px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            {!rows?.length && (
              <Button
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                color={"primary"}
              >
                {t("Add")}
              </Button>
            )}

            <Button onClick={() => navigate(".")} color={"primary"}>
              {t("close")}
            </Button>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
