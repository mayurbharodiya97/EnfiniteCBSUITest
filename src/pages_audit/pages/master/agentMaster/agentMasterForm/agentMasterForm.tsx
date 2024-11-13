import { CircularProgress, Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AgentMasterFormMetaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "../api";
import { useTranslation } from "react-i18next";
import {
  LoaderPaperComponent,
  usePopupContext,
  GradientButton,
  InitialValuesType,
  SubmitFnType,
  extractMetaData,
  utilFunction,
  FormWrapper,
  MetaDataType,
  Alert,
} from "@acuteinfo/common-base";

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
    onError: async (error: any) => {
      CloseMessageBox();
    },
    onSuccess: (msg, data) => {
      enqueueSnackbar(
        Boolean(data?._isNewRow)
          ? t("RecordInsertedMsg")
          : t("RecordUpdatedMsg"),
        {
          variant: "success",
        }
      );
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
      SECURITY_PER: data?.SECURITY_PER
        ? parseFloat(data?.SECURITY_PER).toFixed(2)
        : "",
    };
    let oldData = {
      ...rows?.[0]?.data,
      SECURITY_PER: rows?.[0]?.data?.SECURITY_PER
        ? parseFloat(rows?.[0]?.data?.SECURITY_PER).toFixed(2)
        : "",
    };

    let upd = utilFunction.transformDetailsData(
      newData,
      defaultView === "new" ? {} : oldData
    );

    if (
      Number(newData?.SECURITY_AMT) !== 0 &&
      Number(newData?.SECURITY_PER) !== 0
    ) {
      await MessageBox({
        messageTitle: "ValidationFailed",
        message: "SecurityAmtPerValidation",
        buttonNames: ["Ok"],
        icon: "ERROR",
      });
      return;
    } else {
      if (upd._UPDATEDCOLUMNS.length > 0) {
        isErrorFuncRef.current = {
          data: {
            ...newData,
            ...upd,
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState?.user?.branchCode ?? "",
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
            icon: "CONFIRM",
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
      {mutation.isError && (
        <Alert
          severity="error"
          errorMsg={mutation?.error?.error_msg || t("Somethingwenttowrong")}
          errorDetail={mutation?.error?.error_detail ?? ""}
          color="error"
        />
      )}
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
            docCD: "MST/041",
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
