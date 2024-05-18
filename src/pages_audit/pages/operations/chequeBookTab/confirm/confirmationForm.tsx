import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { confirmFormMetaData } from "./confirmationFormMetadata";
import { useMutation } from "react-query";
import { chequeBookCfm } from "../api";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { useTranslation } from "react-i18next";

export const ChequebookCfmForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const chequeBkCfm: any = useMutation("chequeBookCfm", chequeBookCfm, {
    onError: () => {
      CloseMessageBox();
    },
    onSuccess: (data, variables) => {
      CloseMessageBox();
      closeDialog();

      if (data?.status === "99") {
        MessageBox({
          messageTitle: "InvalidConfirmation",
          message: data?.message,
          icon: "WARNING",
        });
      } else {
        result.mutate({
          screenFlag: "chequebookCFM",
          COMP_CD: authState?.companyID,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
          FROM_DATE: result?.variables?.FROM_DATE,
          TO_DATE: result?.variables?.TO_DATE,
          FLAG: variables?.FLAG ?? "",
        });
        if (Boolean(variables?.IS_CONFIMED)) {
          enqueueSnackbar(t("DataConfirmMessage"), {
            variant: "success",
          });
        } else if (!Boolean(variables?.IS_CONFIMED)) {
          enqueueSnackbar(t("DataRejectMessage"), {
            variant: "success",
          });
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["chequeBookCfm"]);
    };
  }, []);

  useEffect(() => {
    if (rows?.[0]?.data) {
      confirmFormMetaData.form.label = `${t("ConfirmationDetail")} \u00A0\u00A0 
      ${(
        rows?.[0]?.data?.COMP_CD +
        rows?.[0]?.data?.BRANCH_CD +
        rows?.[0]?.data?.ACCT_TYPE +
        rows?.[0]?.data?.ACCT_CD
      ).replace(/\s/g, "")}   \u00A0\u00A0   ${rows?.[0]?.data?.ACCT_NM}   `;
    }
  }, [rows?.[0]?.data]);

  const handelChange = async (isConfirm) => {
    let apiReq = {
      IS_CONFIMED: isConfirm === "C" ? true : false,
      FLAG: rows?.[0]?.data?.REQ_FLAG,
      COMP_CD: authState?.companyID,
      BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
      TRAN_CD: rows?.[0]?.data?.TRAN_CD,
      AUTO_CHQBK_PRINT_FLAG: rows?.[0]?.data?.AUTO_CHQBK_PRINT_FLAG,
      ENTERED_BY: rows?.[0]?.data?.ENTERED_BY,
    };
    let res = await MessageBox({
      messageTitle: t("confirmation"),
      message:
        isConfirm === "C" ? t("AreYouSureToConfirm") : t("AreYouSureToReject"),
      buttonNames: ["No", "Yes"],
      defFocusBtnName: "Yes",
      loadingBtnName: "Yes",
    });

    if (res === "Yes") {
      chequeBkCfm.mutate(apiReq);
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
        {chequeBkCfm.isError && (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={chequeBkCfm?.error?.error_msg ?? "Unknow Error"}
              errorDetail={chequeBkCfm?.error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        )}

        <FormWrapper
          key={"confirmation-Form"}
          metaData={confirmFormMetaData}
          initialValues={rows?.[0]?.data ?? []}
          displayMode="view"
          hideDisplayModeInTitle={true}
          formStyle={{
            background: "white",
            height: "calc(100vh - 543px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <Button color="primary" onClick={() => handelChange("C")}>
                  {t("Confirm")}
                </Button>
                <Button color="primary" onClick={() => handelChange("R")}>
                  {t("Reject")}
                </Button>
                <Button color="primary" onClick={closeDialog}>
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
