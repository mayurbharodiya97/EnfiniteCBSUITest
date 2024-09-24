import { FC, useEffect, useRef, useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { queryClient, ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { Theme, Dialog, Button, CircularProgress } from "@mui/material";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { AddNewBankMasterFormMetadata } from "./metaData";
import { useTranslation } from "react-i18next";


export const useDialogStyles = makeStyles((theme: Theme) => ({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

export const AddNewBankMasterForm: FC<{
  isOpen?: any;
  onClose?: any;
  // setBankDetail?: any;
}> = ({ isOpen, onClose }) => {
  const isErrorFuncRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();

  const mutation = useMutation(API.clearingBankMasterConfigDML, {
    onError: (error: any, { endSubmit }) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      endSubmit(false, errorMsg, error?.error_detail ?? "");
      // enqueueSnackbar(errorMsg, { variant: "error" });
    },
    onSuccess: (data) => {
      console.log("data", data);
      enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
      onClose();
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["clearingBankMasterConfigDML"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);
    data["EXCLUDE"] = Boolean(data["EXCLUDE"]) ? "Y" : "N";
    data["CTS"] = Boolean(data["CTS"]) ? "Y" : "N";

    isErrorFuncRef.current = {
      data: {
        ...data,
        _isNewRow: true,
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
      },
      displayData,
      endSubmit,
      setFieldError,
    };
    mutation.mutate(isErrorFuncRef?.current?.data);
  };

  return (
    <>
      <Dialog
        key="ClearingBankMasterDialog"
        open={true}
        maxWidth="md"
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
      >
        <FormWrapper
          key={"ClearingBankMasterForm"}
          metaData={AddNewBankMasterFormMetadata as MetaDataType}
          // displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={[]}
          // hideHeader={true}
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Button
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                endIcon={
                  mutation?.isLoading ? <CircularProgress size={20} /> : null
                }
                color={"primary"}
              >
                {t("Save")}
              </Button>

              <Button
                onClick={onClose}
                //disabled={isSubmitting}
                color={"primary"}
              >
                {t("Close")}
              </Button>
            </>
          )}
        </FormWrapper>
      </Dialog>
      {/* )} */}
    </>
  );
};
