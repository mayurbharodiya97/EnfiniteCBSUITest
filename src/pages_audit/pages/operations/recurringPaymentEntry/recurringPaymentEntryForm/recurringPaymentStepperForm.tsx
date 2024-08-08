import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  Stack,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
  Theme,
  Chip,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { GradientButton } from "components/styledComponent/button";
import { RecurringContext } from "../context/recurringPaymentContext";
import { RecurringPaymentEntryForm } from "./recurringPaymentEntryForm";
import { RecurringPaymentTransferForm } from "./recurringPaymentTransferForm";
import { makeStyles } from "@mui/styles";
import { useMutation } from "react-query";
import * as API from "../api";
import { usePopupContext } from "components/custom/popupContext";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import {
  ColorlibConnector,
  ColorlibStepIconRoot,
} from "components/dyanmicForm/stepperForm/style";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";
import { PayslipAndDDForm } from "../payslipAndNEFT/payslipAndDDForm";
import { BeneficiaryAcctDetailsForm } from "../payslipAndNEFT/beneficiaryAcctDetailsForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import ClosingAdvice from "../closingAdvice";
import { isValidDate } from "components/utils/utilFunctions/function";
import { format } from "date-fns";
import { queryClient } from "cache";
import { utilFunction } from "components/utils";
import { useLocation } from "react-router-dom";
import CommonSvgIcons from "assets/icons/commonSvg/commonSvgIcons";

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
  formHeaderTitle: {
    margin: "0",
    fontWeight: "500",
    fontSize: "1.25rem",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
    color: "var(--theme-color2)",
  },
}));

const RecurringPaymentStepperForm = ({
  closeDialog,
  defaultView,
  isDataChangedRef,
  entryScreenFlagData,
}) => {
  const { t } = useTranslation();
  const {
    rpState,
    setActiveStep,
    resetAllData,
    setIsBackButton,
    updateRecurPmtEntryData,
    updateSaveValidationData,
    updateBeneficiaryAcctData,
    updatePayslipAndDDData,
    updateClosingAdviceData,
    updateDataForJasperParam,
    updateRecurPmtTransferData,
  } = useContext(RecurringContext);
  const { authState } = useContext(AuthContext);
  const [steps, setSteps] = useState([
    t("RecurringPaymentEntry"),
    t("RecurringPaymentTransfer"),
  ]);
  const recPmtEntryRef: any = useRef(null);
  const recPmtTransferRef: any = useRef(null);
  const payslipAndDDRef: any = useRef(null);
  const beneficiaryAcctRef: any = useRef(null);
  const headerClasses = useTypeStyles();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const saveDataRef = useRef<any>(null);
  let currentPath = useLocation().pathname;
  const [openClosingAdvice, setOpenClosingAdvice] = useState(false);

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    //Stepper icons
    const icons: { [index: string]: React.ReactElement } = {
      1: <CommonSvgIcons iconName={"DISBDTL"} />,
      2: <CommonSvgIcons iconName={"ACHOW"} />,
      3: Boolean(rpState?.recurPmtEntryData?.PAYSLIP) ? (
        <CommonSvgIcons iconName={"CHQ"} />
      ) : (
        <CommonSvgIcons iconName={"TEMPOD"} />
      ),
    };
    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  //Initial values For Beneficiary Form
  const accountDetailsForBen = {
    BENEFIACCTDTL: [
      {
        AMOUNT:
          Number(rpState?.recurPmtEntryData?.TOTAL_AMOUNT ?? 0) -
            Number(rpState?.recurPmtEntryData?.PAYMENT_AMT ?? 0) ?? 0,
        REMARKS: `Recurring A/c Payment ${authState?.companyID?.trim() ?? ""}${
          rpState?.recurPmtEntryData?.BRANCH_CD?.trim() ?? ""
        }${rpState?.recurPmtEntryData?.ACCT_TYPE?.trim() ?? ""}${
          rpState?.recurPmtEntryData?.ACCT_CD?.trim() ?? ""
        }`,
      },
    ],
    PAYMENT_AMOUNT:
      Number(rpState?.recurPmtEntryData?.TOTAL_AMOUNT ?? 0) -
        Number(rpState?.recurPmtEntryData?.PAYMENT_AMT ?? 0) ?? 0,
    ACCT_TYPE: rpState?.recurPmtEntryData?.ACCT_TYPE ?? "",
    BRANCH_CD: rpState?.recurPmtEntryData?.BRANCH_CD ?? "",
    ACCT_CD: rpState?.recurPmtEntryData?.ACCT_CD ?? "",
    ENTRY_TYPE: "NEFT",
    SCREEN_NAME: t("BeneficiaryACDetails"),
  };

  //Initial values for Payslip Form
  const accountDetailsForPayslip = {
    PAYSLIPDD: [
      {
        INSTRUCTION_REMARKS: `REC PAYMENT:-${
          rpState?.recurPmtEntryData?.BRANCH_CD?.trim() ?? ""
        }-${rpState?.recurPmtEntryData?.ACCT_TYPE?.trim() ?? ""}-${
          rpState?.recurPmtEntryData?.ACCT_CD?.trim() ?? ""
        }`,
        FROM_CERTI_NO: "",
      },
    ],
    PAYMENT_AMOUNT:
      Number(rpState?.recurPmtEntryData?.TOTAL_AMOUNT) -
        Number(rpState?.recurPmtEntryData?.PAYMENT_AMT) ?? 0,
    ACCT_TYPE: rpState?.recurPmtEntryData?.ACCT_TYPE ?? "",
    BRANCH_CD: rpState?.recurPmtEntryData?.BRANCH_CD ?? "",
    ACCT_CD: rpState?.recurPmtEntryData?.ACCT_CD ?? "",
    SCREEN_REF: "TRN/053",
    SCREEN_NAME: t("PayslipAndDemandDraft"),
    COMP_CD: authState?.companyID ?? "",
  };

  //Set data into ref for insert api
  saveDataRef.current = {
    data: {
      isNewRow: true,
      ...rpState?.recurPmtEntryData,
      CASH_AMT:
        Number(rpState?.recurPmtEntryData?.CASH_AMT) > 0
          ? rpState?.recurPmtEntryData?.CASH_AMT
          : 0,
      COMP_CD: authState?.companyID ?? "",
      DD_AMT:
        (Boolean(rpState?.recurPmtEntryData?.PAYSLIP) ||
          Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT)) &&
        Number(rpState?.recurPmtEntryData?.TOTAL_AMOUNT) -
          Number(rpState?.recurPmtEntryData?.PAYMENT_AMT) >
          0
          ? Number(rpState?.recurPmtEntryData?.TOTAL_AMOUNT) -
            Number(rpState?.recurPmtEntryData?.PAYMENT_AMT)
          : "",
      TRF_AMT:
        Number(rpState?.recurPmtEntryData?.TRF_AMT) > 0
          ? rpState?.recurPmtEntryData?.TRF_AMT
          : "0",
      PAYSLIP: Boolean(rpState?.recurPmtEntryData?.PAYSLIP) ? "Y" : "N",
      RTGS_NEFT: Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT) ? "Y" : "N",
      INT_FROM_DT: isValidDate(rpState?.recurPmtEntryData?.INT_FROM_DT)
        ? format(
            new Date(rpState?.recurPmtEntryData?.INT_FROM_DT),
            "yyyy-MMM-dd"
          ) ?? ""
        : format(new Date(), "yyyy-MMM-dd") ?? "",
      INT_TO_DT: isValidDate(rpState?.recurPmtEntryData?.INT_TO_DT)
        ? format(
            new Date(rpState?.recurPmtEntryData?.INT_TO_DT),
            "yyyy-MMM-dd"
          ) ?? ""
        : format(new Date(), "yyyy-MMM-dd") ?? "",
      SCREEN_REF: "TRN/053",
      COMM_TYPE_CD: "",
      TOT_DD_NEFT_AMT:
        Number(rpState?.recurPmtEntryData?.TOTAL_AMOUNT) -
          Number(rpState?.recurPmtEntryData?.PAYMENT_AMT) ?? "",
      PAY_FOR: "",
      SDC: "",
      DD_NEFT: Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT)
        ? "NEFT"
        : Boolean(rpState?.recurPmtEntryData?.PAYSLIP)
        ? "DD"
        : "",
      REQUEST_CD: "0",
      THROUGH_CHANNEL: "",
      REMARKS: "",
      DD_NEFT_PAY_AMT:
        Number(rpState?.recurPmtEntryData?.TOTAL_AMOUNT) -
          Number(rpState?.recurPmtEntryData?.PAYMENT_AMT) ?? "",
    },
  };

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

  //Mutation for Insert Data
  const recurringPaymentEntrySaveMutation = useMutation(
    API.recurringPaymentEntryDML,
    {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "Error",
          message: errorMsg ?? "",
        });
        CloseMessageBox();
      },
      onSuccess: async (data) => {
        for (const obj in data[0]) {
          if (obj === "NEFT_DD_MSG") {
            for (const ddNeftObj of data[0][obj] ?? []) {
              if (ddNeftObj.O_STATUS === "999") {
                await MessageBox({
                  messageTitle: "ValidationFailed",
                  message: ddNeftObj.O_MESSAGE ?? "",
                });
              } else if (ddNeftObj.O_STATUS === "9") {
                await MessageBox({
                  messageTitle: "Alert",
                  message: ddNeftObj.O_MESSAGE ?? "",
                });
              } else if (ddNeftObj.O_STATUS === "99") {
                const buttonName = await MessageBox({
                  messageTitle: "Confirmation",
                  message: ddNeftObj.O_MESSAGE ?? "",
                  buttonNames: ["Yes", "No"],
                  defFocusBtnName: "Yes",
                });
                if (buttonName === "No") {
                  break;
                }
              }
            }
          } else if (obj === "B_VOUCHER_MSG") {
            for (const voucherMsg of data[0][obj] ?? []) {
              if (voucherMsg.O_STATUS === "999") {
                await MessageBox({
                  messageTitle: "ValidationFailed",
                  message: voucherMsg.O_MESSAGE ?? "",
                });
              } else if (voucherMsg.O_STATUS === "9") {
                await MessageBox({
                  messageTitle: "VouchersConfirmation",
                  message: voucherMsg.O_MESSAGE ?? "",
                });
              } else if (voucherMsg.O_STATUS === "99") {
                const buttonName = await MessageBox({
                  messageTitle: "Confirmation",
                  message: voucherMsg.O_MESSAGE ?? "",
                  buttonNames: ["Yes", "No"],
                  defFocusBtnName: "Yes",
                });
                if (buttonName === "No") {
                  resetAllData();
                  closeDialog();
                  break;
                }
              } else if (voucherMsg.O_STATUS === "0") {
                let reqParam = {
                  COMP_CD: authState?.companyID ?? "",
                  BRANCH_CD: rpState?.recurPmtEntryData?.BRANCH_CD ?? "",
                  ACCT_TYPE: rpState?.recurPmtEntryData?.ACCT_TYPE ?? "",
                  ACCT_CD: rpState?.recurPmtEntryData?.ACCT_CD ?? "",
                  INT_RATE: rpState?.recurPmtEntryData?.INT_RATE ?? "",
                  INT_AMOUNT: rpState?.recurPmtEntryData?.INT_AMOUNT ?? "",
                  REC_PENALTY_AMT:
                    rpState?.recurPmtEntryData?.REC_PENALTY_AMT ?? "",
                  PENAL_RATE: rpState?.recurPmtEntryData?.PENAL_RATE ?? "",
                  PAYMENT_TYPE: rpState?.recurPmtEntryData?.PREMATURE_VAL ?? "",
                  TRAN_CD: rpState?.onSaveValidationData?.[0]?.TRAN_CD ?? "",
                };
                isDataChangedRef.current = true;
                updateDataForJasperParam(reqParam);
                setOpenClosingAdvice(true);
                closingAdviceDtlMutation.mutate(reqParam);
              }
            }
          }
        }
        isDataChangedRef.current = true;
        CloseMessageBox();
      },
    }
  );

  //Mutation for Validation mutation for Entry form handler
  const onSaveValidationMutation: any = useMutation(
    "onSaveRecurValueValidation",
    API.onSaveRecurValueValidation,
    {
      onSuccess: () => {},
      onError: async (error: any) => {
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
    }
  );

  const handleCloseAdviceDetails = () => {
    setOpenClosingAdvice(false);
    resetAllData();
    closeDialog();
  };

  //Entry form submit handler
  const recurEntrySubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    let recurData = data;
    endSubmit(true);
    updateRecurPmtEntryData(data);
    updateRecurPmtTransferData([
      {
        TRANS_ACCT_NM: "",
      },
    ]);
    await onSaveValidationMutation.mutate(
      {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        PAYSLIP: Boolean(data?.PAYSLIP) ? "Y" : "N",
        RTGS_NEFT: Boolean(data?.RTGS_NEFT) ? "Y" : "N",
        INT_RATE: data?.INT_RATE ?? "",
        TRAN_BAL: data?.TRAN_BAL ?? "",
        CASH_AMT: data?.CASH_AMT ?? "",
        TRF_AMT: data?.TRF_AMT ?? "0",
        PROV_INT_AMT: data?.PROV_INT_AMT ?? "",
        INT_AMOUNT: data?.INT_AMOUNT ?? "",
        TDS_AMT: data?.TDS_AMT ?? "",
        TOKEN_NO: data?.TOKEN_NO ?? "",
        CR_AMT: data?.CR_AMT ?? "",
        CR_INT_AMT: data?.CR_INT_AMT ?? "",
        REC_PENALTY_AMT: data?.REC_PENALTY_AMT ?? "",
        PREMATURE: data?.PREMATURE_VAL ?? "",
        SCREEN_REF: "TRN/053",
        TYPE: "C",
        STATUS: data?.STATUS ?? "",
      },
      {
        onSuccess: async (data, variables) => {
          let saveData = data;
          for (const obj of saveData) {
            if (saveData?.[0]?.O_STATUS === "0") {
              const buttonName = await MessageBox({
                messageTitle: "Confirmation",
                message: "Proceed?",
                buttonNames: ["Yes", "No"],
                defFocusBtnName: "Yes",
                loadingBtnName: ["Yes"],
              });
              if (buttonName === "Yes") {
                updateSaveValidationData(saveData);
                if (
                  Number(recurData?.CASH_AMT) ===
                  Number(recurData?.TOTAL_AMOUNT)
                ) {
                  recurringPaymentEntrySaveMutation.mutate({
                    ...saveDataRef.current?.data,
                    TRAN_CD: saveData?.[0]?.TRAN_CD ?? "",
                    CONFIRMED: saveData?.[0]?.CONFIRMED ?? "",
                    SCROLL1: saveData?.[0]?.SCROLL1 ?? "",
                    ACCOUNT_CLOSE: saveData?.[0]?.ACCOUNT_CLOSE ?? "",
                    PAY_SLIP_NEFT_DTL: [],
                    PAYSLIP_NO: "",
                    REC_DTL: [],
                  });
                } else {
                  setActiveStep(rpState.activeStep + 1);
                  CloseMessageBox();
                }
              }
            } else if (saveData?.[0]?.O_STATUS === "9") {
              await MessageBox({
                messageTitle: "validationAlert",
                message: saveData?.[0]?.O_MESSAGE,
              });
            } else if (saveData?.[0]?.O_STATUS === "99") {
              const buttonName = await MessageBox({
                messageTitle: "Confirmation",
                message: saveData?.[0]?.O_MESSAGE,
                buttonNames: ["Yes", "No"],
              });
              if (buttonName === "Yes") {
                updateSaveValidationData({
                  ...saveData,
                  ACCOUNT_CLOSE: "Y",
                });
                if (
                  Number(recurData?.CASH_AMT) ===
                  Number(recurData?.TOTAL_AMOUNT)
                ) {
                  recurringPaymentEntrySaveMutation.mutate({
                    ...saveDataRef.current?.data,
                    TRAN_CD: saveData?.[0]?.TRAN_CD ?? "",
                    CONFIRMED: saveData?.[0]?.CONFIRMED ?? "",
                    SCROLL1: saveData?.[0]?.SCROLL1 ?? "",
                    ACCOUNT_CLOSE: saveData?.[0]?.ACCOUNT_CLOSE ?? "",
                    PAY_SLIP_NEFT_DTL: [],
                    PAYSLIP_NO: "",
                    REC_DTL: [],
                  });
                } else {
                  setActiveStep(rpState.activeStep + 1);
                }
              }
              if (buttonName === "No") {
                updateSaveValidationData({
                  ...saveData,
                  ACCOUNT_CLOSE: "N",
                });
                if (
                  Number(recurData?.CASH_AMT) ===
                  Number(recurData?.TOTAL_AMOUNT)
                ) {
                  recurringPaymentEntrySaveMutation.mutate({
                    ...saveDataRef.current?.data,
                    TRAN_CD: saveData?.[0]?.TRAN_CD ?? "",
                    CONFIRMED: saveData?.[0]?.CONFIRMED ?? "",
                    SCROLL1: saveData?.[0]?.SCROLL1 ?? "",
                    ACCOUNT_CLOSE: saveData?.[0]?.ACCOUNT_CLOSE ?? "",
                    PAY_SLIP_NEFT_DTL: [],
                    PAYSLIP_NO: "",
                    REC_DTL: [],
                  });
                } else {
                  setActiveStep(rpState.activeStep + 1);
                }
              }
            } else if (saveData?.[0]?.O_STATUS === "999") {
              await MessageBox({
                messageTitle: "ValidationFailed",
                message: saveData?.[0]?.O_MESSAGE,
              });
            }
          }
        },
      }
    );
  };

  //Payslip and Beneficiary form submit handler
  const paysBenefSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    endSubmit(true);
    if (Boolean(rpState?.recurPmtEntryData?.PAYSLIP)) {
      if (Number(data?.TOTAL_AMOUNT) !== Number(data?.PAYMENT_AMOUNT)) {
        await MessageBox({
          messageTitle: "PaymentAmountNotTally",
          message: "PayslipAmountShouldTallyWithPaymentAmount",
        });
        return;
      } else {
        const buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: "AreYouSureToContinue",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          updatePayslipAndDDData([...data?.PAYSLIPDD]);
          recurringPaymentEntrySaveMutation.mutate({
            ...saveDataRef.current?.data,
            TRAN_CD: rpState?.onSaveValidationData?.[0]?.TRAN_CD ?? "",
            CONFIRMED: rpState?.onSaveValidationData?.[0]?.CONFIRMED ?? "",
            SCROLL1: rpState?.onSaveValidationData?.[0]?.SCROLL1 ?? "",
            ACCOUNT_CLOSE: rpState?.onSaveValidationData?.ACCOUNT_CLOSE ?? "",
            REC_DTL: [...rpState?.recurPmtTransferData.RECPAYTRANS],
            PAY_SLIP_NEFT_DTL: [...data?.PAYSLIPDD],
            PAYSLIP_NO: data?.PAYSLIPDD?.[0]?.PAYSLIP_NO
              ? (data?.PAYSLIPDD[data?.PAYSLIPDD?.length - 1]).PAYSLIP_NO
              : "",
          });
        }
      }
    } else if (Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT)) {
      if (Number(data?.TOTAL_AMOUNT) !== Number(data?.PAYMENT_AMOUNT)) {
        await MessageBox({
          message: "NEFTAmountShouldTallyWithPaymentAmount",
          messageTitle: "PaymentAmountNotTally",
        });
        return;
      } else {
        const buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: "AreYouSureToContinue",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          updateBeneficiaryAcctData([...data?.BENEFIACCTDTL]);
          recurringPaymentEntrySaveMutation.mutate({
            ...saveDataRef.current?.data,
            TRAN_CD: rpState?.onSaveValidationData?.[0]?.TRAN_CD ?? "",
            CONFIRMED: rpState?.onSaveValidationData?.[0]?.CONFIRMED ?? "",
            SCROLL1: rpState?.onSaveValidationData?.[0]?.SCROLL1 ?? "",
            ACCOUNT_CLOSE: rpState?.onSaveValidationData?.ACCOUNT_CLOSE ?? "",
            REC_DTL: [...rpState?.recurPmtTransferData.RECPAYTRANS],
            PAY_SLIP_NEFT_DTL: [...data?.BENEFIACCTDTL],
            PAYSLIP_NO: "",
          });
        }
      }
    }
  };

  //Call submit handler based on conditions
  const handleComplete = (e) => {
    if (rpState.activeStep === 0) {
      recPmtEntryRef.current?.handleSubmit(e);
    } else if (rpState.activeStep === 1) {
      if (
        Boolean(rpState?.recurPmtEntryData?.PAYSLIP) &&
        rpState?.recurPmtEntryData?.TRF_AMT <= 0
      ) {
        payslipAndDDRef.current?.handleSubmit(e);
      } else if (
        Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT) &&
        rpState?.recurPmtEntryData?.TRF_AMT <= 0
      ) {
        beneficiaryAcctRef.current?.handleSubmit(e);
      } else {
        recPmtTransferRef.current?.handleSubmit(e);
      }
    } else if (rpState.activeStep === 2) {
      if (Boolean(rpState?.recurPmtEntryData?.PAYSLIP)) {
        payslipAndDDRef.current?.handleSubmit(e);
      } else if (Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT)) {
        beneficiaryAcctRef.current?.handleSubmit(e);
      }
    }
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getRecurAdviceDtl"]);
    };
  }, []);

  //Set form's name in stepper based on index
  useEffect(() => {
    if (
      Boolean(rpState?.recurPmtEntryData?.PAYSLIP) &&
      rpState?.recurPmtEntryData?.TRF_AMT <= 0
    ) {
      setSteps([t("RecurringPaymentEntry"), t("PayslipAndDemandDraft")]);
    } else if (
      Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT) &&
      rpState?.recurPmtEntryData?.TRF_AMT <= 0
    ) {
      setSteps([t("RecurringPaymentEntry"), t("BeneficiaryACDetails")]);
    } else if (
      Boolean(rpState?.recurPmtEntryData?.PAYSLIP) &&
      rpState?.recurPmtEntryData?.TRF_AMT > 0
    ) {
      setSteps([
        t("RecurringPaymentEntry"),
        t("RecurringPaymentTransfer"),
        t("PayslipAndDemandDraft"),
      ]);
    } else if (
      Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT) &&
      rpState?.recurPmtEntryData?.TRF_AMT > 0
    ) {
      setSteps([
        t("RecurringPaymentEntry"),
        t("RecurringPaymentTransfer"),
        t("BeneficiaryACDetails"),
      ]);
    } else {
      setSteps([t("RecurringPaymentEntry"), t("RecurringPaymentTransfer")]);
    }
  }, [rpState]);

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
            position: "relative",
            padding: "10px",
          },
        }}
        maxWidth="xl"
      >
        <>
          <AppBar position="relative" style={{ marginBottom: "10px" }}>
            <Toolbar variant="dense" className={headerClasses.root}>
              <Typography
                component="span"
                variant="h5"
                className={headerClasses.title}
              >
                {utilFunction.getDynamicLabel(
                  currentPath,
                  authState?.menulistdata,
                  false
                )}
              </Typography>

              <GradientButton onClick={closeDialog}>
                {t("Close")}
              </GradientButton>
            </Toolbar>
          </AppBar>
          <Stack
            sx={{
              width: "100%",
              position: "relative",
            }}
            spacing={4}
          >
            <Stepper
              alternativeLabel
              activeStep={rpState?.activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconComponent={ColorlibStepIcon}
                    componentsProps={{
                      label: {
                        style: {
                          marginTop: "2px",
                          color: "var(--theme-color1)",
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <div
              style={{
                marginTop: "0px",
              }}
            >
              {rpState?.activeStep === 0 ? (
                <RecurringPaymentEntryForm
                  ref={recPmtEntryRef}
                  defaultView={defaultView}
                  recurEntrySubmitHandler={recurEntrySubmitHandler}
                  entryScreenFlagData={entryScreenFlagData}
                />
              ) : rpState?.activeStep === 1 ? (
                Boolean(rpState?.recurPmtEntryData?.PAYSLIP) &&
                rpState?.recurPmtEntryData?.TRF_AMT <= 0 ? (
                  <>
                    <AppBar
                      position="relative"
                      style={{ marginBottom: "10px" }}
                    >
                      <Toolbar variant="dense" className={headerClasses.root}>
                        <Typography
                          component="div"
                          variant="h5"
                          className={headerClasses.formHeaderTitle}
                        >
                          {`${
                            accountDetailsForPayslip?.SCREEN_NAME
                          }\u00A0\u00A0 ${t("Branch")}: ${
                            accountDetailsForPayslip?.BRANCH_CD ?? ""
                          }\u00A0\u00A0   ${t("AcctType")}: ${
                            accountDetailsForPayslip?.ACCT_TYPE ?? ""
                          }\u00A0\u00A0   ${t("ACNo")}: ${
                            accountDetailsForPayslip?.ACCT_CD ?? ""
                          }\u00A0\u00A0`}
                          <Chip
                            variant="outlined"
                            color="primary"
                            size="small"
                            label={`${defaultView} mode`}
                          />
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <PayslipAndDDForm
                      ref={payslipAndDDRef}
                      defaultView={defaultView}
                      accountDetailsForPayslip={accountDetailsForPayslip}
                      onSubmitHandler={paysBenefSubmitHandler}
                    />
                  </>
                ) : Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT) &&
                  rpState?.recurPmtEntryData?.TRF_AMT <= 0 ? (
                  <>
                    <AppBar
                      position="relative"
                      style={{ marginBottom: "10px" }}
                    >
                      <Toolbar variant="dense" className={headerClasses.root}>
                        <Typography
                          component="span"
                          variant="h5"
                          className={headerClasses.formHeaderTitle}
                        >
                          {`${
                            accountDetailsForBen?.SCREEN_NAME
                          }\u00A0\u00A0 ${t("Branch")}: ${
                            accountDetailsForBen?.BRANCH_CD ?? ""
                          }\u00A0\u00A0   ${t("AcctType")}: ${
                            accountDetailsForBen?.ACCT_TYPE ?? ""
                          }\u00A0\u00A0   ${t("ACNo")}: ${
                            accountDetailsForBen?.ACCT_CD ?? ""
                          }\u00A0\u00A0`}
                          <Chip
                            variant="outlined"
                            color="primary"
                            size="small"
                            label={`${defaultView} mode`}
                          />
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <BeneficiaryAcctDetailsForm
                      ref={beneficiaryAcctRef}
                      onSubmitHandler={paysBenefSubmitHandler}
                      accountDetailsForBen={accountDetailsForBen}
                      defaultView={defaultView}
                    />
                  </>
                ) : (
                  <RecurringPaymentTransferForm
                    ref={recPmtTransferRef}
                    defaultView={defaultView}
                    recurringPaymentEntrySaveMutation={
                      recurringPaymentEntrySaveMutation
                    }
                    saveDataRef={saveDataRef}
                  />
                )
              ) : rpState?.activeStep === 2 ? (
                Boolean(rpState?.recurPmtEntryData?.PAYSLIP) &&
                rpState?.recurPmtEntryData?.TRF_AMT > 0 ? (
                  <>
                    <AppBar
                      position="relative"
                      style={{ marginBottom: "10px" }}
                    >
                      <Toolbar variant="dense" className={headerClasses.root}>
                        <Typography
                          component="span"
                          variant="h5"
                          className={headerClasses.formHeaderTitle}
                        >
                          {`${
                            accountDetailsForPayslip?.SCREEN_NAME
                          }\u00A0\u00A0 ${t("Branch")}: ${
                            accountDetailsForPayslip?.BRANCH_CD ?? ""
                          }\u00A0\u00A0  ${t("AcctType")}: ${
                            accountDetailsForPayslip?.ACCT_TYPE ?? ""
                          }\u00A0\u00A0   ${t("ACNo")}: ${
                            accountDetailsForPayslip?.ACCT_CD ?? ""
                          }\u00A0\u00A0`}
                          <Chip
                            variant="outlined"
                            color="primary"
                            size="small"
                            label={`${defaultView} mode`}
                          />
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <PayslipAndDDForm
                      ref={payslipAndDDRef}
                      defaultView={defaultView}
                      accountDetailsForPayslip={accountDetailsForPayslip}
                      onSubmitHandler={paysBenefSubmitHandler}
                    />
                  </>
                ) : Boolean(rpState?.recurPmtEntryData?.RTGS_NEFT) &&
                  rpState?.recurPmtEntryData?.TRF_AMT > 0 ? (
                  <>
                    <AppBar
                      position="relative"
                      style={{ marginBottom: "10px" }}
                    >
                      <Toolbar variant="dense" className={headerClasses.root}>
                        <Typography
                          component="span"
                          variant="h5"
                          className={headerClasses.formHeaderTitle}
                        >
                          {`${
                            accountDetailsForBen?.SCREEN_NAME
                          }\u00A0\u00A0 ${t("Branch")}: ${
                            accountDetailsForBen?.BRANCH_CD ?? ""
                          }\u00A0\u00A0   ${t("AcctType")}: ${
                            accountDetailsForBen?.ACCT_TYPE ?? ""
                          }\u00A0\u00A0   ${t("ACNo")}: ${
                            accountDetailsForBen?.ACCT_CD ?? ""
                          }\u00A0\u00A0`}
                          <Chip
                            variant="outlined"
                            color="primary"
                            size="small"
                            label={`${defaultView} mode`}
                          />
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <BeneficiaryAcctDetailsForm
                      ref={beneficiaryAcctRef}
                      onSubmitHandler={paysBenefSubmitHandler}
                      accountDetailsForBen={accountDetailsForBen}
                      defaultView={defaultView}
                    />
                  </>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                margin: "0px !important",
              }}
            >
              {rpState?.activeStep !== steps.length && (
                <>
                  {rpState?.activeStep !== steps.length - 1 ? (
                    <GradientButton
                      onClick={handleComplete}
                      endIcon={
                        onSaveValidationMutation?.isLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                      disabled={
                        onSaveValidationMutation?.isLoading ||
                        rpState?.disableButton
                      }
                    >
                      {t("Next")}
                    </GradientButton>
                  ) : (
                    <GradientButton
                      disabled={rpState?.disableButton}
                      onClick={handleComplete}
                    >
                      {t("Finish")}
                    </GradientButton>
                  )}
                </>
              )}
              {rpState?.activeStep === 0 ? null : (
                <GradientButton
                  onClick={() => {
                    setIsBackButton(true);
                    setActiveStep(rpState?.activeStep - 1);
                  }}
                >
                  {t("Back")}
                </GradientButton>
              )}
            </Box>
          </Stack>
        </>
      </Dialog>

      {/*Open Closing Advice component */}
      {openClosingAdvice ? (
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              width: "100%",
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
    </>
  );
};
export default RecurringPaymentStepperForm;
