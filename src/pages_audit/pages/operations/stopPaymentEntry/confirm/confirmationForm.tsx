import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { stopPayconfirmFormMetaData } from "./confirmFormMetadata";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "components/custom/popupContext";
import { queryClient } from "cache";
import { stopPaymentConfirm } from "../api";
import { enqueueSnackbar } from "notistack";
import { Alert } from "components/common/alert";

export const StopPayConfirmationForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

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
          enqueueSnackbar("Data has been successfully confirmed", {
            variant: "success",
          });
        } else if (!Boolean(variables?.IS_CONFIMED)) {
          enqueueSnackbar("Data has been successfully Rejected", {
            variant: "success",
          });
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["stopPaymentConfirm"]);
    };
  }, []);

  useEffect(() => {
    if (rows?.[0]?.data) {
      stopPayconfirmFormMetaData.form.label = `Confirmation Detail \u00A0\u00A0 
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
          metaData={stopPayconfirmFormMetaData}
          initialValues={rows?.[0]?.data ?? []}
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
            console.log("isSubmitting, handleSubmit", isSubmitting);
            return (
              <>
                <Button
                  color="primary"
                  onClick={async () => {
                    let buttonName = await MessageBox({
                      messageTitle: "Confirmation",
                      message: `Are you sure to Confirm `,
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
                  Confirm
                </Button>
                <Button
                  color="primary"
                  onClick={async () => {
                    let buttonName = await MessageBox({
                      messageTitle: "Confirmation",
                      message: `Are you sure to Confirm `,
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
                  }}
                >
                  Reject
                </Button>
                <Button color="primary" onClick={() => closeDialog()}>
                  close
                </Button>
              </>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
