import { AppBar, Button, Dialog, LinearProgress } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";

import { useLocation } from "react-router-dom";
import { confirmFormMetaData } from "./confirmationFormMetadata";
import { useMutation } from "react-query";
import { chequeBookCfm, validateCheqbkCfm } from "../api";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import {
  usePopupContext,
  Alert,
  FormWrapper,
  MetaDataType,
  queryClient,
} from "@acuteinfo/common-base";

export const ChequebookCfmForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const buttonRef: any = useRef<any>(null);
  console.log("<<<rows", rows);

  // API calling function for validate data before confirm or reject
  const chequeBkValidateCfm: any = useMutation(
    "validateCheqbkCfm",
    validateCheqbkCfm
  );

  // API calling function for data confirm od reject
  const chequeBkCfm: any = useMutation("chequeBookCfm", chequeBookCfm, {
    onError: () => {
      CloseMessageBox();
    },
    onSuccess: (data, variables) => {
      CloseMessageBox();
      closeDialog();

      const resultData = {
        screenFlag: "chequebookCFM",
        COMP_CD: authState?.companyID,
        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        FROM_DATE: result?.variables?.FROM_DATE ?? authState.workingDate,
        TO_DATE: result?.variables?.TO_DATE ?? authState.workingDate,
        FLAG: variables?.FLAG ?? "",
      };

      if (data?.[0]?.STATUS === "999") {
        MessageBox({
          messageTitle: "InvalidConfirmation",
          message: data?.message || data?.[0]?.MESSAGE,
          icon: "ERROR",
        });
      } else {
        result.mutate(resultData);
        enqueueSnackbar(
          t(
            variables?.IS_CONFIMED ? "DataConfirmMessage" : "DataRejectMessage"
          ),
          { variant: "success" }
        );
      }
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["chequeBookCfm"]);
    };
  }, []);

  const handelChange = async (isConfirm) => {
    chequeBkValidateCfm.mutate(
      {
        AUTO_CHQBK_FLAG: rows?.[0]?.data?.AUTO_CHQBK_FLAG,
        AUTO_CHQBK_PRINT_FLAG: rows?.[0]?.data?.AUTO_CHQBK_PRINT_FLAG,
        FLAG: rows?.[0]?.data?.REQ_FLAG,
        SCREEN_REF: "TRN/371",
      },
      {
        onSuccess: async (data) => {
          console.log("<<<dara", data);
          const messagebox = async (msgTitle, msg, buttonNames) => {
            let buttonName = await MessageBox({
              messageTitle: msgTitle,
              message: msg,
              buttonNames: buttonNames,
            });
            return buttonName;
          };

          if (data?.length) {
            for (let i = 0; i < data?.length; i++) {
              let btnName = await messagebox(
                data[i]?.O_STATUS === "999"
                  ? "validation fail"
                  : data[i]?.O_STATUS === "0"
                  ? "confirmation"
                  : "ALert message",
                data[i]?.O_STATUS === "0"
                  ? "Are you sure to proceed"
                  : data[i]?.O_MESSAGE,
                data[i]?.O_STATUS === "99" || data[i]?.O_STATUS === "0"
                  ? ["Yes", "No"]
                  : ["Ok"]
              );
              if (btnName === "No") {
                break;
              } else if (btnName === "Ok" && data[i]?.O_STATUS === "0") {
                let apiReq = {
                  IS_CONFIMED: isConfirm === "C" ? true : false,
                  FLAG: rows?.[0]?.data?.REQ_FLAG,
                  COMP_CD: authState?.companyID,
                  BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
                  TRAN_CD: rows?.[0]?.data?.TRAN_CD,
                  AUTO_CHQBK_PRINT_FLAG: rows?.[0]?.data?.AUTO_CHQBK_PRINT_FLAG,
                  LAST_ENTERED_BY: rows?.[0]?.data?.LAST_ENTERED_BY,
                };
                let res = await MessageBox({
                  messageTitle: t("confirmation"),
                  message:
                    isConfirm === "C"
                      ? t("AreYouSureToConfirm")
                      : t("AreYouSureToReject"),
                  buttonNames: ["No", "Yes"],
                  defFocusBtnName: "Yes",
                  loadingBtnName: ["Yes"],
                });
                if (res === "Yes") {
                  chequeBkCfm.mutate(apiReq);
                }
              }
            }
          }
        },
      }
    );
  };

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1300px",
        },
      }}
    >
      <>
        {chequeBkValidateCfm.isLoading ? (
          <LinearProgress color="inherit" />
        ) : chequeBkCfm.isError || chequeBkValidateCfm.isError ? (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={
                chequeBkCfm?.error?.error_msg ??
                chequeBkValidateCfm?.error?.error_msg ??
                "Unknow Error"
              }
              errorDetail={
                chequeBkCfm?.error?.error_detail ??
                chequeBkValidateCfm?.error?.error_detail ??
                ""
              }
              color="error"
            />
          </AppBar>
        ) : (
          <LinearProgressBarSpacer />
        )}

        <FormWrapper
          key={"confirmation-Form"}
          metaData={confirmFormMetaData as MetaDataType}
          initialValues={rows?.[0]?.data ?? {}}
          displayMode="view"
          hideDisplayModeInTitle={true}
          onSubmitHandler={() => {}}
          formStyle={{
            background: "white",
            height: "calc(100vh - 490px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                {rows?.[0]?.data?.CONFIRMED !== "N" && (
                  <>
                    <Button
                      color="primary"
                      ref={buttonRef}
                      onClick={() => handelChange("C")}
                    >
                      {t("Confirm")}
                    </Button>
                    <Button color="primary" onClick={() => handelChange("R")}>
                      {t("Reject")}
                    </Button>
                  </>
                )}
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
