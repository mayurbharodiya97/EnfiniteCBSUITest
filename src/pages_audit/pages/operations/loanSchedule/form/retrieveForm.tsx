import { Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { SubmitFnType } from "packages/form";
import { useTranslation } from "react-i18next";
import { usePopupContext } from "components/custom/popupContext";
import { AuthContext } from "pages_audit/auth";
import { RetrievalFormMetaData } from "./retrieveFormMetadata";

export const RetrievalForm = ({ closeDialog, retrievalParaValues }) => {
  const { t } = useTranslation();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const retrieveDataRef = useRef<any>(null);
  const [disableButton, setDisableButton] = useState(false);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);
    if (Boolean(data)) {
      retrieveDataRef.current = data;
      retrievalParaValues({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: retrieveDataRef?.current?.BRANCH_CD ?? "",
        ACCT_TYPE: retrieveDataRef?.current?.ACCT_TYPE ?? "",
        ACCT_CD: retrieveDataRef?.current?.ACCT_CD ?? "",
      });
    }
  };

  const handleButtonDisable = (disable) => {
    setDisableButton(disable);
  };

  return (
    <>
      <FormWrapper
        key={"retrievalParameterForm"}
        metaData={RetrievalFormMetaData as MetaDataType}
        initialValues={{}}
        onSubmitHandler={onSubmitHandler}
        isLoading={true}
        //@ts-ignore
        formStyle={{
          background: "white",
        }}
        formState={{
          MessageBox: MessageBox,
          handleButtonDisable: handleButtonDisable,
        }}
        controlsAtBottom={true}
        containerstyle={{ padding: "10px" }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting || disableButton}
              color={"primary"}
            >
              {t("Ok")}
            </GradientButton>
            <GradientButton onClick={closeDialog} color={"primary"}>
              {t("Close")}
            </GradientButton>
          </>
        )}
      </FormWrapper>
    </>
  );
};

export const RetrievalFormWrapper = ({ closeDialog, retrievalParaValues }) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="md"
    >
      <RetrievalForm
        closeDialog={closeDialog}
        retrievalParaValues={retrievalParaValues}
      />
    </Dialog>
  );
};
