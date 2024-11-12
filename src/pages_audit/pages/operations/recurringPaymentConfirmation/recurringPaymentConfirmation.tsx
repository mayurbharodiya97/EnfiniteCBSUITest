import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import {
  AppBar,
  Paper,
  Dialog,
  Theme,
  Toolbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import { RecurringPaymentEntryForm } from "../recurringPaymentEntry/recurringPaymentEntryForm/recurringPaymentEntryForm";
import { VouchersDetailsGrid } from "./vouchersDetailsGrid";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { recurringPmtConfirmation } from "./api";
import {
  usePopupContext,
  GradientButton,
  utilFunction,
} from "@acuteinfo/common-base";
import PhotoSignWithHistory from "components/common/custom/photoSignWithHistory/photoSignWithHistory";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  footerTypoG: {
    color: "var(--theme-color1)",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0px 0px 5px 10px",
  },
}));

export const RecurringPaymentConfirmation = ({
  screenFlag,
  handleDialogClose,
  setDeleteMessageBox,
  isDataChangedRef,
}) => {
  const [openPhotoSign, setOpenPhotoSign] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  let currentPath = useLocation().pathname;
  const headerClasses = useTypeStyles();

  //Mutation for Confirm Entry
  const recurringPmtConfMutation = useMutation(
    "recurringPmtConfirmation",
    recurringPmtConfirmation,
    {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: errorMsg ?? "",
        });
        CloseMessageBox();
      },
      onSuccess: async (data) => {
        enqueueSnackbar(data?.[0]?.O_MESSAGE, {
          variant: "success",
        });
        if (Boolean(rows?.[0]?.data?.PAYSLIP)) {
          await MessageBox({
            messageTitle: "Information",
            message:
              "PayslipDraftNeedToConfirmFromPayslipDraftIssueConfirmationScreen",
          });
        } else if (Boolean(rows?.[0]?.data?.RTGS_NEFT)) {
          await MessageBox({
            messageTitle: "Information",
            message: "NEFTNeedToConfirmFromRTGSNEFTConfirmationScreen",
          });
        } else {
          CloseMessageBox();
        }
        isDataChangedRef.current = true;
        CloseMessageBox();
        handleDialogClose();
      },
    }
  );

  const entryConfirmHandler = async () => {
    if (rows?.[0]?.data?.ENTERED_BY === authState?.user?.id) {
      await MessageBox({
        messageTitle: "InvalidConfirmation",
        message: "ConfirmRestrictMsg",
      });
    } else {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: "DoYouWantToAllowTheTransaction",
        buttonNames: ["Yes", "No"],
      });
      if (buttonName === "Yes") {
        let reqParam = {
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
          ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
          TRAN_CD: rows?.[0]?.data?.TRAN_CD ?? "",
          SCREEN_REF: "TRN/385",
          ACCOUNT_CLOSE: "",
          ENTERED_BY: rows?.[0]?.data?.ENTERED_BY ?? "",
          ENTERED_COMP_CD: rows?.[0]?.data?.ENTERED_COMP_CD ?? "",
          ENTERED_BRANCH_CD: rows?.[0]?.data?.ENTERED_BRANCH_CD ?? "",
        };
        const buttonName = await MessageBox({
          messageTitle: "AccountClose",
          message: "DoYouWantToCloseAccount",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes", "No"],
        });
        if (buttonName === "Yes") {
          reqParam = { ...reqParam, ACCOUNT_CLOSE: "Y" };
        }
        if (buttonName === "No") {
          reqParam = { ...reqParam, ACCOUNT_CLOSE: "N" };
        }
        recurringPmtConfMutation.mutate(reqParam);
      }
    }
  };

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            width: "100%",
            height: "100vh",
          },
        }}
        maxWidth="xl"
      >
        <AppBar position="relative" style={{ marginBottom: "10px" }}>
          <Toolbar className={headerClasses.root} variant="dense">
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h5"}
              component="div"
            >
              {utilFunction.getDynamicLabel(
                currentPath,
                authState?.menulistdata,
                false
              )}
              {`\u00A0\u00A0${t("EnteredBy")}: ${
                rows?.[0]?.data?.ENTERED_BY ?? ""
              }\u00A0\u00A0${t("Status")}: ${
                rows?.[0]?.data?.CONF_STATUS ?? ""
              }\u00A0\u00A0`}
            </Typography>

            <GradientButton
              endIcon={
                recurringPmtConfMutation?.isLoading ? (
                  <CircularProgress size={20} />
                ) : null
              }
              onClick={entryConfirmHandler}
              disabled={
                recurringPmtConfMutation?.isLoading ||
                rows?.[0]?.data?.ALLOW_CONFIRM !== "Y"
              }
            >
              {t("Confirm")}
            </GradientButton>
            <GradientButton onClick={() => setDeleteMessageBox(true)}>
              {t("Reject")}
            </GradientButton>
            <GradientButton
              style={{ minWidth: "110px" }}
              onClick={() => setOpenPhotoSign(true)}
            >
              {t("ViewSignature")}
            </GradientButton>
            <GradientButton onClick={handleDialogClose}>Close</GradientButton>
          </Toolbar>
        </AppBar>

        <Paper
          sx={{
            height: "66vh",
            overflow: "auto",
            margin: "0 10px",
            border: "1px solid var(--theme-color4)",
            boxShadow: "none",
          }}
        >
          <RecurringPaymentEntryForm
            closeDialog={handleDialogClose}
            defaultView={"view"}
            screenFlag={screenFlag}
          />
        </Paper>
        <Paper
          sx={{
            height: "34vh",
            overflow: "auto",
            padding: "5px 10px 0px 10px",
            border: "none",
            boxShadow: "none",
          }}
        >
          <VouchersDetailsGrid />
        </Paper>
      </Dialog>

      {/*Open Photo Signature */}
      {openPhotoSign ? (
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
        >
          <PhotoSignWithHistory
            data={{
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
              ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
              ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
              AMOUNT:
                Number(rows?.[0]?.data?.TRAN_BA ?? 0) +
                Number(rows?.[0]?.data?.PROV_INT_AMT ?? 0) +
                Number(rows?.[0]?.data?.INT_AMOUNT ?? 0) -
                Number(rows?.[0]?.data?.TDS_AMT ?? 0),
            }}
            onClose={() => {
              setOpenPhotoSign(false);
            }}
            screenRef={"TRN/385"}
          />
        </Dialog>
      ) : null}
    </>
  );
};
