import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { stockconfirmFormMetaData } from "./confirmFormMetadata";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "components/custom/popupContext";
import { queryClient } from "cache";
import { crudStockData, stockConfirm } from "../api";
import { enqueueSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { useTranslation } from "react-i18next";

export const StockConfirmationForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const [deletePopup, setDeletePopup] = useState<boolean>(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const stockCfm: any = useMutation("stockConfirm", stockConfirm, {
    onError: () => {
      CloseMessageBox();
    },
    onSuccess: () => {
      CloseMessageBox();
      closeDialog();
      result.mutate({
        screenFlag: "stockCFM",
        COMP_CD: authState.companyID,
        BRANCH_CD: authState?.user?.branchCode,
      });
      enqueueSnackbar(t("DataConfirmMessage"), {
        variant: "success",
      });
    },
  });

  const stockDataCRUD: any = useMutation("crudStockData", crudStockData, {
    onSuccess: () => {
      closeDialog();
      setDeletePopup(false);
      result.mutate({
        screenFlag: "stockCFM",
        COMP_CD: authState.companyID,
        BRANCH_CD: authState?.user?.branchCode,
      });
      enqueueSnackbar(t("DataRejectMessage"), {
        variant: "success",
      });
    },
    onError: () => {
      setDeletePopup(false);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["stockConfirm"]);
      queryClient.removeQueries(["crudStockData"]);
    };
  }, []);

  //account number and name set to inside the header
  useEffect(() => {
    if (rows?.[0]?.data) {
      stockconfirmFormMetaData.form.label = `${t(
        "ConfirmationDetail"
      )}\u00A0\u00A0 
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
        {stockCfm.isError ||
          (stockDataCRUD?.isError && (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={
                  stockCfm?.error?.error_msg ??
                  stockDataCRUD?.error?.error_msg ??
                  "Unknow Error"
                }
                errorDetail={
                  stockCfm?.error?.error_detail ??
                  stockDataCRUD?.error?.error_detail ??
                  ""
                }
                color="error"
              />
            </AppBar>
          ))}
        <FormWrapper
          key={"stock-confirmation-Form"}
          metaData={stockconfirmFormMetaData as MetaDataType}
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
                      stockCfm.mutate({
                        IS_CONFIMED: true,
                        COMP_CD: authState?.companyID,
                        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
                        TRAN_CD: rows?.[0]?.data?.TRAN_CD,
                        ENTERED_BY: rows?.[0]?.data?.ENTERED_BY,
                      });
                    }
                  }}
                >
                  {t("Confirm")}
                </Button>
                <Button color="primary" onClick={() => setDeletePopup(true)}>
                  {t("Reject")}
                </Button>
                <Button color="primary" onClick={() => closeDialog()}>
                  {t("Close")}
                </Button>
              </>
            );
          }}
        </FormWrapper>

        {deletePopup && (
          <RemarksAPIWrapper
            TitleText={t("StockConfirmDeleteTitle")}
            onActionNo={() => setDeletePopup(false)}
            onActionYes={(val, rows) => {
              let deleteReqPara = {
                _isNewRow: false,
                _isDeleteRow: true,
                BRANCH_CD: rows.BRANCH_CD,
                TRAN_CD: rows.TRAN_CD,
                ACCT_TYPE: rows.ACCT_TYPE,
                ACCT_CD: rows.ACCT_CD,
                TRAN_AMOUNT: rows.TRAN_BAL,
                TRAN_DT: rows.TRAN_DT,
                CONFIRMED: rows.CONFIRMED,
                USER_DEF_REMARKS: val
                  ? val
                  : "WRONG ENTRY FROM STOCK CONFIRMATION (ETRN/377)",

                ACTIVITY_TYPE: "STOCK ENTRY SCREEN",
                ENTERED_BY: rows.ENTERED_BY,
                ACCT_MST_LIMIT: rows?.ACCT_MST_LIMIT,
              };
              stockDataCRUD.mutate(deleteReqPara);
            }}
            isLoading={stockDataCRUD?.isLoading}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={deletePopup}
            rows={rows?.[0]?.data}
            defaultValue={"WRONG ENTRY FROM STOCK CONFIRMATION (ETRN/377)"}
          />
        )}
      </>
    </Dialog>
  );
};
