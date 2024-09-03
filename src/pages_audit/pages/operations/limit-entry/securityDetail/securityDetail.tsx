import { Button, Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useTranslation } from "react-i18next";
import { securityDetailMetaData } from "./securityDetailFormMetaData";

export const SecurityDetailForm = ({ navigate, myMasterRef, reqDataRef }) => {
  const [data, setData] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    myMasterRef?.current?.getFieldData().then((res) => {
      setData(res);
    });
  }, [myMasterRef]);
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1000px",
        },
      }}
    >
      <>
        <FormWrapper
          key={"security-detail" + data}
          metaData={securityDetailMetaData as MetaDataType}
          initialValues={data ?? {}}
          onSubmitHandler={(data: any, displayData, endSubmit) => {
            reqDataRef.current.securityDetails = data;
            navigate(".");
            //@ts-ignore
            endSubmit(true);
          }}
          formStyle={{
            background: "white",
            height: "calc(100vh - 450px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <Button
                  color="primary"
                  onClick={(e) => handleSubmit(e, "Save")}
                >
                  {t("Save")}
                </Button>
                <Button color="primary" onClick={() => navigate(".")}>
                  {t("Cancel")}
                </Button>
              </>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
