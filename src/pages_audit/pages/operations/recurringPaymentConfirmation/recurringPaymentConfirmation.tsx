import { useContext, useState } from "react";
import { usePopupContext } from "components/custom/popupContext";
import { utilFunction } from "components/utils";
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
import { GradientButton } from "components/styledComponent/button";
import { RecurringContext } from "../recurringPaymentEntry/context/recurringPaymentContext";
import { makeStyles } from "@mui/styles";
import { RecurringPaymentEntryForm } from "../recurringPaymentEntry/recurringPaymentEntryForm/recurringPaymentEntryForm";
import { VouchersDetailsGrid } from "./vouchersDetailsGrid";
import { useMutation } from "react-query";
import * as API from "../recurringPaymentEntry/api";
import { enqueueSnackbar } from "notistack";
import ClosingAdvice from "../recurringPaymentEntry/closingAdvice";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { recurringPmtConfirmation } from "./api";
import PhotoSignWithHistory from "components/custom/photoSignWithHistory/photoSignWithHistory";

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
  const { updateClosingAdviceData, updateDataForJasperParam } =
    useContext(RecurringContext);
  const [openClosingAdvice, setOpenClosingAdvice] = useState(false);
  const [openPhotoSign, setOpenPhotoSign] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  let currentPath = useLocation().pathname;
  const headerClasses = useTypeStyles();

  //Mutation for Closing Advice
  const closingAdviceDtlMutation = useMutation(
    "getRecurAdviceDtl",
    API.getRecurAdviceDtl,
    {
      onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        updateClosingAdviceData(data);
        CloseMessageBox();
      },
    }
  );

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
          TRAN_CD: rows?.[0]?.data?.TRAN_CD,
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

  const handleCloseAdviceDetails = () => {
    setOpenClosingAdvice(false);
    updateClosingAdviceData([]);
  };

  //Closing Advice handler
  const openClosingAdviceHandler = () => {
    if (
      authState?.companyID &&
      rows?.[0]?.data?.BRANCH_CD &&
      rows?.[0]?.data?.ACCT_TYPE &&
      rows?.[0]?.data?.ACCT_CD
    ) {
      setOpenClosingAdvice(true);
      let reqParam = {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
        ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
        INT_RATE: rows?.[0]?.data?.INT_RATE ?? "",
        INT_AMOUNT: rows?.[0]?.data?.INT_AMOUNT ?? "",
        REC_PENALTY_AMT: rows?.[0]?.data?.REC_PENALTY_AMT ?? "",
        PENAL_RATE: rows?.[0]?.data?.PENAL_RATE ?? "",
        PAYMENT_TYPE: rows?.[0]?.data?.PREMATURE ?? "",
        TRAN_CD: rows?.[0]?.data?.TRAN_CD,
      };
      updateDataForJasperParam(reqParam);
      closingAdviceDtlMutation?.mutate(reqParam);
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
              {`\u00A0\u00A0 ${t("EnteredBy")}: ${
                rows?.[0]?.data?.ENTERED_BY ?? ""
              }\u00A0\u00A0 ${t("Status")}: ${
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
            <GradientButton onClick={openClosingAdviceHandler}>
              {t("PrintAdvice")}
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

        <Typography
          component="div"
          variant="h5"
          className={headerClasses.footerTypoG}
        >
          {t("PaymentThroughDDWillConfirmFromDDIssueConfirmationScreen")}
        </Typography>
      </Dialog>

      {/*Open Closing Advice component */}
      {openClosingAdvice ? (
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
              padding: "10px 0",
            },
          }}
          maxWidth="xl"
        >
          {closingAdviceDtlMutation?.isLoading ? (
            <LoaderPaperComponent />
          ) : (
            <ClosingAdvice
              handleCloseAdviceDetails={handleCloseAdviceDetails}
            />
          )}
        </Dialog>
      ) : null}

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
                Number(rows?.[0]?.data?.TRAN_BAL) +
                  Number(rows?.[0]?.data?.PROV_INT_AMT) +
                  Number(rows?.[0]?.data?.INT_AMOUNT) -
                  Number(rows?.[0]?.data?.TDS_AMT) ?? "",
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
