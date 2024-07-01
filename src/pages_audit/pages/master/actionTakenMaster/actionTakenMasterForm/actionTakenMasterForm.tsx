import React, { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData, utilFunction } from "components/utils";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { ActionTakenMasterFormMetaData } from "./metaData";
import { CircularProgress, Dialog } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { useTranslation } from "react-i18next";

const ActionTakenMasterForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
}) => {
  const [formMode, setFormMode] = useState(defaultView);
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const mutation = useMutation(API.actionTakenMasterDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
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

  const codeArr = gridData?.map((ele: any) => ele?.ACTION_TAKEN_CD);
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
      LEGAL_PROCESS: Boolean(data?.LEGAL_PROCESS) ? "Y" : "N",
    };
    let oldData = {
      ...rows?.[0]?.data,
      LEGAL_PROCESS: Boolean(rows?.[0]?.data?.LEGAL_PROCESS) ? "Y" : "N",
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);

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
        message: "Do you want to save this Request?",
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
  };

  return (
    <>
      {gridData ? (
        <FormWrapper
          key={"actionTakenMasterForm" + formMode}
          metaData={
            extractMetaData(
              ActionTakenMasterFormMetaData,
              formMode
            ) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={
            formMode === "new"
              ? {
                  ...rows?.[0]?.data,
                  ACTION_TAKEN_CD: codeIncreByOne,
                }
              : { ...(rows?.[0]?.data as InitialValuesType) }
          }
          formState={{ gridData: gridData, rows: rows?.[0]?.data }}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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

export const ActionTakenMasterFormWrapper = ({
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
      maxWidth="lg"
    >
      <ActionTakenMasterForm
        closeDialog={closeDialog}
        defaultView={defaultView}
        gridData={gridData}
        isDataChangedRef={isDataChangedRef}
      />
    </Dialog>
  );
};
