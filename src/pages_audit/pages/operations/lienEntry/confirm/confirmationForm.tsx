import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { lienconfirmFormMetaData } from "./confirmFormMetadata";
import { lienConfirmation } from "../api";
import { usePopupContext } from "components/custom/popupContext";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import { RemarksAPIWrapper } from "components/custom/Remarks";

export const LienConfirmationForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const { t } = useTranslation();
  console.log("<<<rrrr", rows);

  const lienConfirm: any = useMutation("lienConfirmation", lienConfirmation, {
    onError: () => {
      CloseMessageBox();
    },
    onSuccess: () => {
      CloseMessageBox();
      closeDialog();
      result.mutate({
        screenFlag: "lienCFM",
        COMP_CD: authState.companyID,
        BRANCH_CD: authState?.user?.branchCode,
      });
      enqueueSnackbar(t("DataConfirmMessage"), {
        variant: "success",
      });
    },
  });

  //account number and name set to inside the header
  useEffect(() => {
    if (rows?.[0]?.data) {
      lienconfirmFormMetaData.form.label = `${t(
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
        {lienConfirm.isError && (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={lienConfirm?.error?.error_msg ?? "Unknow Error"}
              errorDetail={lienConfirm?.error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        )}
        <FormWrapper
          key={"lien-confirmation-Form"}
          metaData={lienconfirmFormMetaData as MetaDataType}
          initialValues={rows?.[0]?.data ?? []}
          displayMode="view"
          hideDisplayModeInTitle={true}
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
                <Button
                  color="primary"
                  onClick={async () => {
                    let buttonName = await MessageBox({
                      messageTitle: t("confirmation"),
                      message: t("AreYouSureToConfirm"),
                      buttonNames: ["No", "Yes"],
                      defFocusBtnName: "Yes",
                      loadingBtnName: ["Yes"],
                    });
                    if (buttonName === "Yes") {
                      lienConfirm.mutate({
                        IS_CONFIMED: true,
                        COMP_CD: authState?.companyID,
                        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
                        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
                        ACCT_CD: rows?.[0]?.data?.ACCT_CD,
                        LIEN_STATUS: rows?.[0]?.data?.LIEN_STATUS,
                        ENTERED_BY: rows?.[0]?.data?.ENTERED_BY,
                        SR_CD: rows?.[0]?.data?.SR_CD,
                        REMOVAL_DT: rows?.[0]?.data?.REMOVAL_DT,
                        CONFIRMED: rows?.[0]?.data?.CONFIRMED,
                        USER_DEF_REMARKS:
                          "WRONG ENTRY FROM LIEN CONFIRMATION  (TRN/665)",
                        ACTIVITY_TYPE: "LIEN CONFIRMATION SCREEN",
                        LIEN_AMOUNT: rows?.[0]?.data?.LIEN_AMOUNT,
                        EFECTIVE_DT: rows?.[0]?.data?.EFECTIVE_DT,
                      });
                    }
                  }}
                >
                  {t("Confirm")}
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setIsDelete(true);
                    // if (rows?.[0]?.data?.LIEN_STATUS === "A") {
                    // } else if (rows?.[0]?.data?.LIEN_STATUS === "E") {
                    //   let buttonName = await MessageBox({
                    //     messageTitle: t("confirmation"),
                    //     message: t("AreYouSureToConfirm"),
                    //     buttonNames: ["No", "Yes"],
                    //     defFocusBtnName: "Yes",
                    //     loadingBtnName: ["Yes"],
                    //   });
                    //   if (buttonName === "Yes") {
                    //     lienConfirm.mutate({
                    //       IS_CONFIMED: false,
                    //       COMP_CD: authState?.companyID,
                    //       BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
                    //       ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
                    //       ACCT_CD: rows?.[0]?.data?.ACCT_CD,
                    //       LIEN_STATUS: rows?.[0]?.data?.LIEN_STATUS,
                    //       ENTERED_BY: rows?.[0]?.data?.ENTERED_BY,
                    //       SR_CD: rows?.[0]?.data?.SR_CD,
                    //       REMOVAL_DT: rows?.[0]?.data?.REMOVAL_DT,
                    //       CONFIRMED: rows?.[0]?.data?.CONFIRMED,
                    //       USER_DEF_REMARKS:
                    //         "WRONG ENTRY FROM LIEN CONFIRMATION  (TRN/665)",
                    //       ACTIVITY_TYPE: "LIEN CONFIRMATION SCREEN",
                    //       LIEN_AMOUNT: rows?.[0]?.data?.LIEN_AMOUNT,
                    //       EFECTIVE_DT: rows?.[0]?.data?.EFECTIVE_DT,
                    //     });
                    //   }
                    // }
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

      {isDelete && (
        <RemarksAPIWrapper
          TitleText={"RemovalRemarksChequebook"}
          label={"RemovalRemarks"}
          onActionNo={() => setIsDelete(false)}
          onActionYes={(val, rows) => {
            let deleteReqPara = {
              IS_CONFIMED: false,
              COMP_CD: authState?.companyID,
              BRANCH_CD: rows?.BRANCH_CD,
              ACCT_TYPE: rows?.ACCT_TYPE,
              ACCT_CD: rows?.ACCT_CD,
              LIEN_STATUS: rows?.LIEN_STATUS,
              ENTERED_BY: rows?.ENTERED_BY,
              SR_CD: rows?.SR_CD,
              USER_DEF_REMARKS: val
                ? val
                : "WRONG ENTRY FROM LIEN CONFIRMATION (TRN/655)",

              REMOVAL_DT: rows?.REMOVAL_DT,
              CONFIRMED: rows?.CONFIRMED,
              ACTIVITY_TYPE: "LIEN CONFIRMATION SCREEN",
              LIEN_AMOUNT: rows?.LIEN_AMOUNT,
              EFECTIVE_DT: rows?.EFECTIVE_DT,
            };

            lienConfirm.mutate(deleteReqPara);
          }}
          isLoading={lienConfirm?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isDelete}
          rows={rows?.[0]?.data}
          defaultValue={"WRONG ENTRY FROM LIEN CONFIRMATION (TRN/655)"}
        />
      )}
    </Dialog>
  );
};
