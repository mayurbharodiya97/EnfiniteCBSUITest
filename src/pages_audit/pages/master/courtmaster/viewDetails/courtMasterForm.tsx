import { CircularProgress, Dialog } from "@mui/material";
import { usePopupContext } from "components/custom/popupContext";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import { useSnackbar } from "notistack";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { Transition } from "pages_audit/common";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import * as API from "../api";
import { CourtMasterFormMetadata } from "./metaData";
import { LoaderPaperComponent } from "components/common/loaderPaper";

const CourtMasterForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
}) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const [formMode, setFormMode] = useState(defaultView);
  const { t } = useTranslation();

  const mutation = useMutation(API.updateCourtMasterData, {
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

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    // @ts-ignore
    endSubmit(true);

    let newData = { ...data, COUNTRY_CD: null, STATE_CD: null, DIST_CD: null };
    let oldData = {
      ...rows?.[0]?.data,
      COUNTRY_CD: null,
      STATE_CD: null,
      DIST_CD: null,
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);
    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user.branchCode,
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
        key={"courtMasterForm" + formMode}
        metaData={
          extractMetaData(CourtMasterFormMetadata, formMode) as MetaDataType
        }
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={{
          ...(rows?.[0]?.data ?? {}),
        }}
        formStyle={{
          background: "white",
          margin: "10px 0",
        }}
        formState={{
          MessageBox: MessageBox,
          PinCode: rows?.[0]?.data?.PIN_CODE,
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
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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

export const CourtMasterWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
}) => {
  return (
    <Dialog
      open={true}
      // @ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      {gridData ? (
        <CourtMasterForm
          isDataChangedRef={isDataChangedRef}
          closeDialog={closeDialog}
          defaultView={defaultView}
          gridData={gridData}
        />
      ) : (
        <LoaderPaperComponent />
      )}
    </Dialog>
  );
};
