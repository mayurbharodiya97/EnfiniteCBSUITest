import { CircularProgress, Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { GradientButton } from "components/styledComponent/button";
import { AgentMasterFormMetaData } from "./metaData";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { extractMetaData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "../api";
import { usePopupContext } from "components/custom/popupContext";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { useTranslation } from "react-i18next";

const AgentMasterForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
}) => {
  const [formMode, setFormMode] = useState(defaultView);
  const [disableButton, setDisableButton] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const mutation = useMutation(API.agentMasterDML, {
    onError: (error: any) => {
      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      isDataChangedRef.current = true;
      CloseMessageBox();
      closeDialog();
    },
  });

  const codeArr = gridData?.map((ele: any) => ele?.AGENT_CD);
  const filterNumbers = codeArr?.filter((ele) => !isNaN(ele));
  const codeIncrement =
    filterNumbers?.length > 0 ? Math.max(...filterNumbers) + 1 : "";
  const codeIncreByOne =
    String(codeIncrement)?.length < 5 ? String(codeIncrement) : "";

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    let newData = {
      ...data,
    };
    let oldData = {
      ...rows?.[0]?.data,
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);

    if (
      Number(newData?.SECURITY_AMT) !== 0 &&
      Number(newData?.SECURITY_PER) !== 0
    ) {
      await MessageBox({
        message: "SecurityAmtPerValidation",
        messageTitle: "Alert",
        buttonNames: ["Ok"],
      });
      return;
    } else {
      if (upd._UPDATEDCOLUMNS.length > 0) {
        upd._UPDATEDCOLUMNS = upd._UPDATEDCOLUMNS.filter(
          (field) =>
            field !== "AgentAccount" &&
            field !== "SecurityAccount" &&
            field !== "OtherAccount" &&
            field !== "ProfessionalTaxAccount" &&
            field !== "HandHeldMachine"
        );

        isErrorFuncRef.current = {
          data: {
            ...newData,
            ...upd,
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            _isNewRow: defaultView === "new" ? true : false,
          },
          displayData,
          endSubmit,
          setFieldError,
        };

        if (isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
          setFormMode("view");
        } else {
          const btnName = await MessageBox({
            message: "SaveData",
            messageTitle: "Confirmation",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (btnName === "Yes") {
            mutation.mutate({
              ...isErrorFuncRef.current?.data,
            });
          }
        }
      } else {
        setFormMode("view");
      }
    }
  };

  const handleButtonDisable = (disable) => {
    setDisableButton(disable);
  };

  return (
    <>
      {gridData ? (
        <FormWrapper
          key={"agentMasterForm" + formMode}
          metaData={
            extractMetaData(AgentMasterFormMetaData, formMode) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={
            formMode === "new"
              ? {
                  ...rows?.[0]?.data,
                  AGENT_CD: codeIncreByOne,
                }
              : { ...(rows?.[0]?.data as InitialValuesType) }
          }
          formState={{
            MessageBox: MessageBox,
            gridData: gridData,
            rows: rows?.[0]?.data,
            handleButtonDisable: handleButtonDisable,
          }}
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "edit" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting || disableButton}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    {t("Save")}
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      setFormMode("view");
                    }}
                    color={"primary"}
                  >
                    {t("Cancel")}
                  </GradientButton>
                </>
              ) : formMode === "new" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting || disableButton}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    {t("Save")}
                  </GradientButton>

                  <GradientButton onClick={closeDialog} color={"primary"}>
                    {t("Close")}
                  </GradientButton>
                </>
              ) : (
                <>
                  <GradientButton
                    onClick={() => {
                      setFormMode("edit");
                    }}
                    color={"primary"}
                  >
                    {t("Edit")}
                  </GradientButton>
                  <GradientButton onClick={closeDialog} color={"primary"}>
                    {t("Close")}
                  </GradientButton>
                </>
              )}
            </>
          )}
        </FormWrapper>
      ) : (
        <LoaderPaperComponent />
      )}
    </>
  );
};

export const AgentMasterFormWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
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
      maxWidth="xl"
    >
      <AgentMasterForm
        closeDialog={closeDialog}
        defaultView={defaultView}
        isDataChangedRef={isDataChangedRef}
        gridData={gridData}
      />
    </Dialog>
  );
};
