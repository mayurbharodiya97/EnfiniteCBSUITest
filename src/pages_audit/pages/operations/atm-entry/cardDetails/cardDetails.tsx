import { Button, Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { t } from "i18next";
import React, { useState } from "react";
import { CardDetailsMetaData } from "./cardDetailsMetadata";
import { useLocation } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";

export const CardDetails = ({ navigate, setIsData, parameter }) => {
  const { state: rows }: any = useLocation();
  const [idNumber, setIdNumber] = useState(1);
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
        key={"atm-card-details"}
        metaData={CardDetailsMetaData as MetaDataType}
        initialValues={
          rows?.[0]?.data ?? {
            PARA_602: parameter?.PARA_602,
            PARA_946: parameter?.PARA_946,
            PARA_200: parameter?.PARA_200,
          }
        }
        formState={{ MessageBox: MessageBox }}
        onSubmitHandler={(data: any, displayData, endSubmit) => {
          // @ts-ignore
          endSubmit(true);
          setIdNumber((old) => old + 1);
          setIsData((old) => {
            const updatedGridData =
              rows?.[0]?.data?.TRAN_CD || rows?.[0]?.data?.ID_NO
                ? old.gridData.map((item) =>
                    item.TRAN_CD === rows?.[0]?.data?.TRAN_CD ||
                    item.ID_NO === rows?.[0]?.data?.ID_NO
                      ? { ...item, ...data }
                      : item
                  )
                : [...old.gridData, { ...data, ID_NO: idNumber }];

            return {
              ...old,
              gridData: updatedGridData,
            };
          });

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
            <Button
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              color={"primary"}
            >
              {rows?.length ? t("Update") : t("Add")}
            </Button>

            <Button onClick={() => navigate(".")} color={"primary"}>
              {t("Close")}
            </Button>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
