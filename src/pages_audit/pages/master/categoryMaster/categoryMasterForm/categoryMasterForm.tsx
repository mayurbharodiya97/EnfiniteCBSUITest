import { CircularProgress, Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { GradientButton } from "components/styledComponent/button";
import { CategoryMasterFormMetaData } from "./metaData";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { extractMetaData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "../api";
import { usePopupContext } from "components/custom/popupContext";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { useTranslation } from "react-i18next";

const CategoryMasterForm = ({
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

  const mutation = useMutation(API.categoryMasterDML, {
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
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    let newData = {
      ...data,
    };

    let oldData = { ...rows?.[0]?.data };
    let upd = utilFunction.transformDetailsData(newData, oldData);

    if (upd._UPDATEDCOLUMNS.length > 0) {
      upd._UPDATEDCOLUMNS = upd._UPDATEDCOLUMNS.filter(
        (field) =>
          field !== "Surcharge" &&
          field !== "TDSPayable" &&
          field !== "TDSReceivable"
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
  };

  return (
    <>
      {gridData ? (
        <FormWrapper
          key={"categoryMasterForm" + formMode}
          metaData={
            extractMetaData(
              CategoryMasterFormMetaData,
              formMode
            ) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={
            formMode === "new"
              ? {
                  ...rows?.[0]?.data,
                  BRANCH_CD: authState?.user?.branchCode,
                }
              : { ...(rows?.[0]?.data as InitialValuesType) }
          }
          formStyle={{
            background: "white",
          }}
          formState={{
            MessageBox: MessageBox,
            gridData: gridData,
            rows: rows?.[0]?.data,
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

export const CategoryMasterFormWrapper = ({
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
      <CategoryMasterForm
        closeDialog={closeDialog}
        defaultView={defaultView}
        isDataChangedRef={isDataChangedRef}
        gridData={gridData}
      />
    </Dialog>
  );
};
