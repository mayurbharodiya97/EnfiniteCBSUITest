import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { tempODConfirmFormMetaData } from "./confirmFormMetadata";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { tempODConfirmation } from "../api";
import {
  Alert,
  usePopupContext,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
export const TempODConfirmationForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const tempODConfirm: any = useMutation(
    "lienConfirmation",
    tempODConfirmation,
    {
      onError: () => {
        CloseMessageBox();
      },
      onSuccess: (data, variables) => {
        CloseMessageBox();
        closeDialog();
        result.mutate({
          screenFlag: "tempOdCFM",
          COMP_CD: authState.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        });
        if (Boolean(variables?._isNewRow)) {
          enqueueSnackbar(t("DataConfirmMessage"), {
            variant: "success",
          });
        } else if (!Boolean(variables?._isNewRow)) {
          enqueueSnackbar(t("DataRejectMessage"), {
            variant: "success",
          });
        }
      },
    }
  );

  //account number and name set to inside the header
  useEffect(() => {
    if (rows?.[0]?.data) {
      tempODConfirmFormMetaData.form.label = `${t(
        "ConfirmationDetail"
      )} \u00A0\u00A0 
      ${(
        rows?.[0]?.data?.COMP_CD +
        rows?.[0]?.data?.BRANCH_CD +
        rows?.[0]?.data?.ACCT_TYPE +
        rows?.[0]?.data?.ACCT_CD
      ).replace(/\s/g, "")}   \u00A0\u00A0   ${rows?.[0]?.data?.ACCT_NM}   `;
    }
  }, [rows?.[0]?.data]);

  const handleChange = async (Flag) => {
    let buttonName = await MessageBox({
      messageTitle: t("confirmation"),
      message:
        Flag === "C" ? t("AreYouSureToConfirm") : t("AreYouSureToReject"),
      buttonNames: ["Yes", "No"],
      defFocusBtnName: "Yes",
      loadingBtnName: ["Yes"],
    });
    if (buttonName === "Yes") {
      tempODConfirm.mutate({
        COMP_CD: authState?.companyID,
        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
        ACCT_CD: rows?.[0]?.data?.ACCT_CD,
        SR_CD: rows?.[0]?.data?.SR_CD,
        _isNewRow: Flag === "C" ? true : false,
        _isDeleteRow: Flag === "C" ? false : true,
        LAST_ENTERED_BY: rows?.[0]?.data?.LAST_ENTERED_BY,
        FORCE_EXP_DT: rows?.[0]?.data?.FORCE_EXP_DT,
        FORCE_EXP_BY: rows?.[0]?.data?.FORCE_EXP_BY,
      });
    }
  };

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1035px",
        },
      }}
    >
      <>
        {tempODConfirm.isError && (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={tempODConfirm?.error?.error_msg ?? "Unknow Error"}
              errorDetail={tempODConfirm?.error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        )}
        <FormWrapper
          key={"tempOD-confirmation-Form"}
          metaData={tempODConfirmFormMetaData as MetaDataType}
          initialValues={rows?.[0]?.data ?? {}}
          displayMode="view"
          hideDisplayModeInTitle={true}
          onSubmitHandler={() => {}}
          formStyle={{
            background: "white",
            height: "calc(100vh - 552px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <Button color="primary" onClick={() => handleChange("C")}>
                  {t("Confirm")}
                </Button>
                <Button color="primary" onClick={() => handleChange("R")}>
                  {t("Reject")}
                </Button>
                <Button color="primary" onClick={() => closeDialog()}>
                  {t("Close")}
                </Button>
              </>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
