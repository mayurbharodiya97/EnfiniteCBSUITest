import { Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AdvocateMstFormMetaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
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
} from "@acuteinfo/common-base";
import { format } from "date-fns";
export const AdvocateMstForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
}) => {
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const mutation = useMutation(API.advocateMstDataDML, {
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
    if (Boolean(data["INACTIVE_DATE"])) {
      data["INACTIVE_DATE"] = format(
        new Date(data["INACTIVE_DATE"]),
        "dd/MMM/yyyy"
      );
    }
    let newData = {
      ...data,
      STATUS: Boolean(data?.STATUS) ? "I" : "A",
    };
    let oldData = {
      ...rows?.[0]?.data,
      STATUS: Boolean(rows?.[0]?.data?.STATUS) ? "I" : "A",
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);
    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
        BRANCH_CD: authState.user.branchCode,
        COMP_CD: authState.companyID,
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

  const gridValue = gridData?.map((val: any) => val.CODE);
  const filterCode = gridValue?.filter((val) => !isNaN(val));
  const incrementCode =
    filterCode?.length > 0 ? Math.max(...filterCode) + 1 : "";
  const incrementCodeByOne =
    String(incrementCode)?.length < 5 ? String(incrementCode) : "";

  return (
    <>
      {gridData ? (
        <FormWrapper
          key={"advocateMstForm" + formMode}
          metaData={
            extractMetaData(AdvocateMstFormMetaData, formMode) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={
            formMode === "new"
              ? { ...rows?.[0]?.data, CODE: incrementCodeByOne }
              : { ...(rows?.[0]?.data as InitialValuesType) }
          }
          formStyle={{
            background: "white",
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
      ) : (
        <LoaderPaperComponent />
      )}
    </>
  );
};

export const AdvocateMstFormWrapper = ({
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
          overflow: "auto",
          width: "70%",
        },
      }}
      maxWidth="lg"
    >
      <AdvocateMstForm
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        gridData={gridData}
      />
    </Dialog>
  );
};
