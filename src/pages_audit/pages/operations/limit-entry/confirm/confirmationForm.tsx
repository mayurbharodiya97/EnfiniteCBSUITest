import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { limitconfirmFormMetaData } from "./confirmFormMetadata";
import { useMutation } from "react-query";
import { limitConfirm } from "../api";
import { queryClient } from "cache";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { usePopupContext } from "components/custom/popupContext";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export const LimitConfirmationForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const [deletePopup, setDeletePopup] = useState<any>(false);
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const limitCfm: any = useMutation("limitConfirm", limitConfirm, {
    onError: () => {
      CloseMessageBox();
      setDeletePopup(false);
    },
    onSuccess: (data, variables) => {
      closeDialog();
      CloseMessageBox();
      setDeletePopup(false);
      result.mutate({
        screenFlag: "limitCFM",
        COMP_CD: authState.companyID,
        BRANCH_CD: authState?.user?.branchCode,
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
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["limitConfirm"]);
    };
  }, []);

  useEffect(() => {
    if (rows?.[0]?.data) {
      limitconfirmFormMetaData.form.label = `${t(
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

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1335px",
        },
      }}
    >
      <>
        {limitCfm.isError && (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={limitCfm?.error?.error_msg ?? "Unknow Error"}
              errorDetail={limitCfm?.error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        )}
        <FormWrapper
          key={"limit-confirmation-Form"}
          metaData={limitconfirmFormMetaData}
          initialValues={rows?.[0]?.data ?? []}
          displayMode="view"
          hideDisplayModeInTitle={true}
          formStyle={{
            background: "white",
            height: "calc(100vh - 380px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <Button
                  color="primary"
                  onClick={async () => {
                    let buttonName = await MessageBox({
                      messageTitle: "confirmation",
                      message: `AreYouSureToConfirm`,
                      buttonNames: ["No", "Yes"],
                      defFocusBtnName: "Yes",
                      loadingBtnName: "Yes",
                    });
                    if (buttonName === "Yes") {
                      limitCfm.mutate({
                        IS_CONFIMED: true,
                        COMP_CD: authState?.companyID,
                        FLAG: rows?.[0]?.data?.STATUS_FLAG,
                        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
                        TRAN_CD: rows?.[0]?.data?.TRAN_CD,
                        ENTERED_BY: rows?.[0]?.data?.ENTERED_BY,
                      });
                    }
                  }}
                >
                  {t("Confirm")}
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setDeletePopup(true);
                  }}
                >
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

      {deletePopup && (
        <RemarksAPIWrapper
          TitleText={"RemovalRemarksLimit"}
          label={"RemovalRemarks"}
          onActionNo={() => setDeletePopup(false)}
          onActionYes={(val, rows) => {
            limitCfm.mutate({
              IS_CONFIMED: false,
              FLAG: rows?.STATUS_FLAG,
              COMP_CD: authState?.companyID,
              BRANCH_CD: rows?.BRANCH_CD,
              TRAN_CD: rows?.TRAN_CD,
              ENTERED_BY: rows?.ENTERED_BY,
              ACCT_TYPE: rows?.ACCT_TYPE,
              ACCT_CD: rows?.ACCT_CD,
              LIMIT_AMOUNT: rows?.LIMIT_AMOUNT,
              CONFIRMED: "N",
              ACTIVITY_TYPE: "LIMIT CONFIRMATION",
              TRAN_DT: rows?.TRAN_DT
                ? format(new Date(rows?.TRAN_DT), "dd-MMM-yyyy")
                : "",
              USER_DEF_REMARKS: val
                ? val
                : "WRONG ENTRY FROM LIMIT CONFIRMATION (TRN/048) ",
              FORCE_EXP_DT: rows?.FORCE_EXP_DT
                ? format(new Date(rows?.FORCE_EXP_DT), "dd-MMM-yyyy")
                : "",
            });
          }}
          isLoading={limitCfm?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={deletePopup}
          rows={rows?.[0]?.data}
          defaultValue={"WRONG ENTRY FROM LIMIT CONFIRMATION (TRN/374)"}
        />
      )}
    </Dialog>
  );
};
