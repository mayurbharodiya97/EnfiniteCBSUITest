import { Button, Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { t } from "i18next";
import React, { useState } from "react";
import { CardDetailsMetaData } from "./cardDetailsMetadata";
import { useLocation } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import { format } from "date-fns";

export const CardDetails = ({ navigate, setIsData, parameter, myRef }) => {
  const {
    state: { rows, retrieveData },
  }: any = useLocation();
  const { MessageBox } = usePopupContext();

  console.log("<<<rrrrrr", rows);
  const formatDate = (date) =>
    date ? format(new Date(date), "dd/MMM/yyyy") : "";

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
        initialValues={rows?.[0]?.data ?? {}}
        formState={{
          MessageBox: MessageBox,
          setIsData: setIsData,
          reqData: {
            PARA_602: parameter?.PARA_602,
            PARA_946: parameter?.PARA_946,
            PARA_200: parameter?.PARA_200,
            PARA_320: parameter?.PARA_320,
            PARA_604: parameter?.PARA_604,
            OLD_STATUS: rows?.[0]?.data?.OLD_STATUS,
            CONFIRMED: rows?.[0]?.data?.CONFIRMED,
            ENTERED_BRANCH_CD: retrieveData?.ENTERED_BRANCH_CD,
            ENTERED_COMP_CD: retrieveData?.ENTERED_COMP_CD,
            LAST_MODIFIED_DATE: retrieveData?.LAST_MODIFIED_DATE,
            ENTERED_DATE: retrieveData?.ENTERED_DATE,
            ISSUE_DT: retrieveData?.ISSUE_DT,
          },
        }}
        onSubmitHandler={(data: any, displayData, endSubmit) => {
          // @ts-ignore
          endSubmit(true);
          data = {
            ...data,
            REQ_DT: formatDate(data?.REQ_DT),
            ISSUE_DT: formatDate(data?.ISSUE_DT),
            EXPIRE_DT: formatDate(data?.EXPIRE_DT),
            DEACTIVE_DT: formatDate(data?.DEACTIVE_DT),
          };
          myRef.current?.setGridData((old) => {
            let oldRowData = old.map((item) => {
              return {
                ...item,
                REQ_DT: formatDate(item?.REQ_DT),
                ISSUE_DT: formatDate(item?.ISSUE_DT),
                EXPIRE_DT: formatDate(item?.EXPIRE_DT),
                DEACTIVE_DT: formatDate(item?.DEACTIVE_DT),
              };
            });
            const updatedGridData =
              rows?.[0]?.data?.SR_CD || rows?.[0]?.data?.ID_NO
                ? oldRowData?.map((item) => {
                    if (
                      item.SR_CD === rows?.[0]?.data?.SR_CD ||
                      (item.ID_NO && item.ID_NO === rows?.[0]?.data?.ID_NO)
                    ) {
                      const changedValues = {};
                      const changedDataValues = {};

                      // Iterate through keys of new data
                      Object.keys(data).forEach((key) => {
                        // Compare each key's value with old object
                        if (item[key] !== data[key]) {
                          changedDataValues[key] = data[key];
                          changedValues[key] = true;
                        }
                      });

                      return {
                        ...item,
                        ...data,
                        _oldData: {
                          ...changedDataValues,
                        },
                        _isTouchedCol: {
                          ...changedValues,
                        },
                      };
                    }
                    return item;
                  })
                : [
                    ...oldRowData,
                    {
                      ...data,
                      ID_NO: Date.now(),
                      _isNewRow: true,
                    },
                  ];
            return updatedGridData;
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
