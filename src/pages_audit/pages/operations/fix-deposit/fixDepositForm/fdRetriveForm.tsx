import { CircularProgress, Dialog } from "@mui/material";
import { useContext, useRef } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { GradientButton } from "components/styledComponent/button";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "components/custom/popupContext";
import { useTranslation } from "react-i18next";
import { FDRetriveMetadata } from "./metaData/fdRetriveMetaData";
import { FDContext } from "../context/fdContext";

export const FDRetriveForm = ({ closeDialog, getFDViewDtlMutation }) => {
  const {
    FDState,
    updateRetrieveFormData,
    handleDisableButton,
    updateFDParaDetailData,
    updateAcctNoData,
  } = useContext(FDContext);
  const { MessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    endSubmit(true);
    updateRetrieveFormData(data);
    const reqParam = {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: data?.BRANCH_CD ?? "",
      ACCT_TYPE: data?.ACCT_TYPE ?? "",
      ACCT_CD: data?.ACCT_CD ?? "",
      WORKING_DT: authState?.workingDate ?? "",
    };
    getFDViewDtlMutation?.mutate(reqParam);
  };

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
      <FormWrapper
        key={"fdRetriveForm"}
        metaData={FDRetriveMetadata as MetaDataType}
        onSubmitHandler={onSubmitHandler}
        formState={{
          MessageBox: MessageBox,
          handleDisableButton: handleDisableButton,
          docCD: "RPT/401",
        }}
        formStyle={{
          background: "white",
        }}
        controlsAtBottom={true}
        setDataOnFieldChange={(action, payload) => {
          if (action === "GET_PARA_DATA") {
            updateFDParaDetailData(payload);
          }
          if (action === "ACCT_NO_DATA") {
            updateAcctNoData(payload);
          }
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              onClick={handleSubmit}
              endIcon={
                getFDViewDtlMutation?.isLoading ? (
                  <CircularProgress size={20} />
                ) : null
              }
              disabled={
                isSubmitting ||
                getFDViewDtlMutation?.isFetching ||
                FDState?.disableButton
              }
              color={"primary"}
            >
              Ok
            </GradientButton>
            <GradientButton onClick={() => closeDialog()}>Close</GradientButton>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
