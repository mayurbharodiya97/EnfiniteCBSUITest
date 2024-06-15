import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { stopPayconfirmFormMetaData } from "./confirmFormMetadata";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "components/custom/popupContext";
import { queryClient } from "cache";
import { crudStopPayment, stopPaymentConfirm } from "../api";
import { enqueueSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import { useTranslation } from "react-i18next";
import { RemarksAPIWrapper } from "components/custom/Remarks";

export const StopPayConfirmationForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const [isDelete, setIsDelete] = useState(false);

  const stopPaymentCfm: any = useMutation(
    "stopPaymentConfirm",
    stopPaymentConfirm,
    {
      onError: () => {
        CloseMessageBox();
      },
      onSuccess: (data, variables) => {
        CloseMessageBox();
        closeDialog();
        result.mutate({
          screenFlag: "stopPaymentCFM",
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
    }
  );
  const crudStopPay: any = useMutation("crudStopPayment", crudStopPayment, {
    onSuccess: () => {
      setIsDelete(false);
      result.mutate({
        screenFlag: "stopPaymentCFM",
        COMP_CD: authState.companyID,
        BRANCH_CD: authState?.user?.branchCode,
      });
      enqueueSnackbar(t("DataRejectMessage"), { variant: "success" });
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["stopPaymentConfirm"]);
    };
  }, []);

  useEffect(() => {
    if (rows?.[0]?.data) {
      stopPayconfirmFormMetaData.form.label = `${t(
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
          maxWidth: "1035px",
        },
      }}
    >
      <>
        {stopPaymentCfm.isError && (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={stopPaymentCfm?.error?.error_msg ?? "Unknow Error"}
              errorDetail={stopPaymentCfm?.error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        )}
        <FormWrapper
          key={"stopPay-confirmation-Form"}
          metaData={stopPayconfirmFormMetaData as MetaDataType}
          initialValues={rows?.[0]?.data ?? {}}
          displayMode="view"
          hideDisplayModeInTitle={true}
          formStyle={{
            background: "white",
            height: "calc(100vh - 483px)",
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
                      message: "AreYouSureToConfirm",
                      buttonNames: ["No", "Yes"],
                      defFocusBtnName: "Yes",
                      loadingBtnName: "Yes",
                    });
                    if (buttonName === "Yes") {
                      stopPaymentCfm.mutate({
                        IS_CONFIMED: true,
                        COMP_CD: authState?.companyID,
                        FLAG: "Y",
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
                  onClick={async () => {
                    if (rows?.[0]?.data?.RELEASE_DATE === "") {
                      setIsDelete(true);
                    } else {
                      let buttonName = await MessageBox({
                        messageTitle: "confirmation",
                        message: "AreYouSureToConfirm",
                        buttonNames: ["No", "Yes"],
                        defFocusBtnName: "Yes",
                        loadingBtnName: "Yes",
                      });
                      if (buttonName === "Yes") {
                        stopPaymentCfm.mutate({
                          IS_CONFIMED: false,
                          COMP_CD: authState?.companyID,
                          FLAG: "N",
                          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
                          TRAN_CD: rows?.[0]?.data?.TRAN_CD,
                          ENTERED_BY: rows?.[0]?.data?.ENTERED_BY,
                        });
                      }
                    }
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

        {isDelete && (
          <RemarksAPIWrapper
            TitleText={"deleteTitle"}
            onActionNo={() => setIsDelete(false)}
            onActionYes={(val, rows) => {
              let deleteReqPara = {
                _isNewRow: false,
                _isDeleteRow: true,
                BRANCH_CD: rows.BRANCH_CD,
                TRAN_CD: rows.TRAN_CD,
                ACCT_TYPE: rows.ACCT_TYPE,
                ACCT_CD: rows.ACCT_CD,
                TRAN_AMOUNT: rows.CHEQUE_AMOUNT,
                TRAN_DT: rows.TRAN_DT,
                CONFIRMED: rows.CONFIRMED,
                USER_DEF_REMARKS: val
                  ? val
                  : "WRONG ENTRY FROM STOP PAYMENT ENTRY (TRN/048)",

                ACTIVITY_TYPE: "STOP PAYMENT ENTRY SCREEN",
                ENTERED_BY: rows.ENTERED_BY,
              };
              crudStopPay.mutate(deleteReqPara);
            }}
            isLoading={crudStopPay?.isLoading}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={isDelete}
            rows={rows?.[0]?.data}
            defaultValue={"WRONG ENTRY FROM STOP PAYMENT ENTRY (TRN/048)"}
          />
        )}
      </>
    </Dialog>
  );
};
