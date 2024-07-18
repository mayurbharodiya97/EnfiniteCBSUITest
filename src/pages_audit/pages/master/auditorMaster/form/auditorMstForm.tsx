import { Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { AuditorMstFormMetaData } from "./metaData";
import { utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { useTranslation } from "react-i18next";

export const AuditorMstForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const mutation = useMutation(API.auditorMstDataDML, {
    onError: (error: any) => {
      let errorMsg = t("Unknownerroroccured");
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

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    let newData = {
      ...data,
    };
    let oldData = {
      ...rows?.[0]?.data,
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);
    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
        BRANCH_CD: authState?.user?.branchCode,
        COMP_CD: authState?.companyID,
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
  };

  return (
    <>
      <FormWrapper
        key={"auditorMstForm" + formMode}
        metaData={AuditorMstFormMetaData as MetaDataType}
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={rows?.[0]?.data as InitialValuesType}
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
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    setFormMode("view");
                  }}
                  color={"primary"}
                  disabled={isSubmitting}
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
    </>
  );
};

export const AuditorMstFormWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "50%",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      <AuditorMstForm
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
      />
    </Dialog>
  );
};
