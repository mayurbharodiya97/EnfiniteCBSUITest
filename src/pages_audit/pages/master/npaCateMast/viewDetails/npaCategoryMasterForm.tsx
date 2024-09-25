import { CircularProgress, Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { Transition } from "@acuteinfo/common-base";
import { useContext, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import * as API from "../api";
import { NpaCategoryMasterFormMetadata } from "./metaData";
import { useTranslation } from "react-i18next";

import {
  LoaderPaperComponent,
  usePopupContext,
  GradientButton,
  SubmitFnType,
  extractMetaData,
  utilFunction,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
export const NpaCategoryMasterForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const [formMode, setFormMode] = useState(defaultView);
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();

  const mutation = useMutation(API.updateNpaCategoryMasterData, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        messageTitle: "ValidationFailed",
        message: error?.error_msg ?? "",
        icon: "ERROR",
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

    let newData = { ...data };
    let oldData = { ...rows?.[0]?.data };
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
          data: { ...isErrorFuncRef.current?.data },
        });
      }
    }
  };

  return (
    <>
      <FormWrapper
        key={"npaCategoryMasterForm" + formMode}
        metaData={
          extractMetaData(
            NpaCategoryMasterFormMetadata,
            formMode
          ) as MetaDataType
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

export const NpaCategoryMasterWrapper = ({
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
          width: "auto",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      {gridData ? (
        <NpaCategoryMasterForm
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
