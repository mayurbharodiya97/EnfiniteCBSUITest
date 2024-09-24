import { Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { ResponseParameterFormMetaData } from "./metadata";
import {
  usePopupContext,
  SubmitFnType,
  GradientButton,
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
export const ResponseParametersForm = ({
  closeDialog,
  retrievalParaValues,
}) => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const retrieveDataRef = useRef<any>(null);
  const [disableButton, setDisableButton] = useState(false);

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    if (Boolean(data)) {
      retrieveDataRef.current = data;
      retrievalParaValues({
        FLAG: retrieveDataRef?.current?.FLAG,
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        FROM_DATE:
          utilFunction.isValidDate(retrieveDataRef?.current?.FROM_DATE) &&
          retrieveDataRef.current?.FLAG === "D"
            ? format(
                new Date(retrieveDataRef?.current?.FROM_DATE),
                "dd/MMM/yyyy"
              ) ?? ""
            : "",
        TO_DATE:
          utilFunction.isValidDate(retrieveDataRef?.current?.TO_DATE) &&
          retrieveDataRef.current?.FLAG === "D"
            ? format(
                new Date(retrieveDataRef?.current?.TO_DATE),
                "dd/MMM/yyyy"
              ) ?? ""
            : "",
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD:
          retrieveDataRef.current?.FLAG === "A"
            ? retrieveDataRef?.current?.BRANCH_CD ?? ""
            : "",
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
        key={"responseParameterForm"}
        metaData={ResponseParameterFormMetaData as MetaDataType}
        initialValues={{}}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        formStyle={{
          background: "white",
        }}
        controlsAtBottom={true}
        containerstyle={{ padding: "10px" }}
        formState={{
          MessageBox: MessageBox,
          handleButtonDisable: handleButtonDisable,
        }}
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
            <GradientButton
              onClick={closeDialog}
              disabled={isSubmitting}
              color={"primary"}
            >
              {t("Close")}
            </GradientButton>
          </>
        )}
      </FormWrapper>
    </>
  );
};

export const ResponseParametersFormWrapper = ({
  closeDialog,
  retrievalParaValues,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="sm"
    >
      <ResponseParametersForm
        closeDialog={closeDialog}
        retrievalParaValues={retrievalParaValues}
      />
    </Dialog>
  );
};
