import { Button, Dialog } from "@mui/material";
import { t } from "i18next";
import React, { useState } from "react";
import { CardDetailsMetaData } from "./cardDetailsMetadata";
import { useLocation } from "react-router-dom";
import {
  LoaderPaperComponent,
  usePopupContext,
  GradientButton,
  SubmitFnType,
  extractMetaData,
  utilFunction,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";

export const CardDetails = ({ navigate, setIsData, parameter }) => {
  const {
    state: { rows, retrieveData },
  }: any = useLocation();
  const [idNumber, setIdNumber] = useState(1);
  const { MessageBox } = usePopupContext();
  console.log("<<<rrr", rows, retrieveData);

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
          setIdNumber((old) => old + 1);
          setIsData((old) => {
            const updatedGridData =
              rows?.[0]?.data?.TRAN_CD || rows?.[0]?.data?.ID_NO
                ? old?.gridData.map((item) =>
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
