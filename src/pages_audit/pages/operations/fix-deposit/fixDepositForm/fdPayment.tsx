import {
  AppBar,
  CircularProgress,
  Dialog,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import { FDContext } from "../context/fdContext";
import {
  FDPaymentMetadata,
  PaymentRenewBtnsMetadata,
} from "./metaData/fdPaymentMetadata";
import { useMutation } from "react-query";
import * as API from "../api";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { TransferAcctDetailForm } from "./trnsAcctDtlForm";
import {
  Alert,
  FormWrapper,
  GradientButton,
  InitialValuesType,
  LoaderPaperComponent,
  MetaDataType,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { useTranslation } from "react-i18next";
import { PayslipAndDDForm } from "../../recurringPaymentEntry/payslipAndNEFT/payslipAndDDForm";
import { makeStyles } from "@mui/styles";
import { BeneficiaryAcctDetailsForm } from "../../recurringPaymentEntry/payslipAndNEFT/beneficiaryAcctDetailsForm";

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

export const FDPayment = ({
  handleDialogClose,
  screenFlag,
  isDataChangedRef,
}) => {
  const {
    FDState,
    handleDisableButton,
    updateFDPaymentData,
    updateFdSavedPaymentData,
    updateSourceAcctFormData,
    updateRenewTrnsFormData,
  } = useContext(FDContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const [openPayment, setOpenPayment] = useState(false);
  const [openRenew, setOpenRenew] = useState(false);
  const [openTrnsForm, setOpenTrnsForm] = useState(false);
  const [openRenewTrnsForm, setOpenRenewTrnsForm] = useState(false);
  const [openNeftForm, setOpenNeftForm] = useState(false);
  const [openPayslipForm, setOpenPayslipForm] = useState(false);
  const [renewTrnsVal, setRenewTrnsVal] = useState(false);
  const sourceAcctformRef: any = useRef(null);
  const { state: rows }: any = useLocation();
  const headerClasses = useTypeStyles();
  const { t } = useTranslation();
  let reqParam = {
    A_LOGIN_BR: authState?.user?.branchCode ?? "",
    A_COMP_CD: authState?.companyID ?? "",
    A_BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
    A_ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
    A_ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
    A_FD_NO: rows?.[0]?.data?.FD_NO ?? "",
    A_IS_PREMATURE: FDState?.checkAllowFDPayApiData?.IS_PREMATURE ?? "",
    A_PRE_RATE:
      FDState?.checkAllowFDPayApiData?.IS_PREMATURE === "Y"
        ? FDState?.prematureRateData?.INT_RATE
        : "",
    A_SPL_AMT: FDState?.fdParaDetailData?.SPL_AMT ?? "",
    A_TDS_METHOD: FDState?.fdParaDetailData?.TDS_METHOD ?? "",
    WORKING_DATE: authState?.workingDate ?? "",
    A_INT_RATE: "",
    A_PAID_DT: "",
  };

  //Initial values for Payslip Form
  const accountDetailsForPayslip = {
    PAYSLIPDD: [
      {
        INSTRUCTION_REMARKS: `FD PAYMENT:-${
          rows?.[0]?.data?.BRANCH_CD?.trim() ?? ""
        }-${rows?.[0]?.data?.ACCT_TYPE?.trim() ?? ""}-${
          rows?.[0]?.data?.ACCT_CD?.trim() ?? ""
        }`,
        FROM_CERTI_NO: "",
      },
    ],
    PAYMENT_AMOUNT:
      Number(FDState?.fdSavedPaymentData?.TOTAL_AMOUNT ?? 0) -
      Number(FDState?.fdSavedPaymentData?.PAYMENT_AMT ?? 0),
    ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
    BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
    ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
    SCREEN_REF: "RPT/401",
    SCREEN_NAME: t("PayslipAndDemandDraft"),
    COMP_CD: authState?.companyID ?? "",
  };

  //Initial values For Beneficiary Form
  const accountDetailsForBen = {
    BENEFIACCTDTL: [
      {
        AMOUNT:
          Number(FDState?.fdSavedPaymentData?.TOTAL_AMOUNT ?? 0) -
          Number(FDState?.fdSavedPaymentData?.PAYMENT_AMT ?? 0),
        REMARKS: `FD PAYMENT ${authState?.companyID?.trim() ?? ""}${
          rows?.[0]?.data?.BRANCH_CD?.trim() ?? ""
        }${rows?.[0]?.data?.ACCT_TYPE?.trim() ?? ""}${
          rows?.[0]?.data?.ACCT_CD?.trim() ?? ""
        }`,
      },
    ],
    PAYMENT_AMOUNT:
      Number(FDState?.fdSavedPaymentData?.TOTAL_AMOUNT ?? 0) -
      Number(FDState?.fdSavedPaymentData?.PAYMENT_AMT ?? 0),
    ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
    BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
    ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
    ENTRY_TYPE: "NEFT",
    SCREEN_NAME: t("BeneficiaryACDetails"),
  };

  //Common function for format date
  const formatDate = (date) =>
    date ? format(new Date(date), "dd/MMM/yyyy") : "";

  //Mutation for get Payment/Renew and Int payment form data
  const getFDPaymentDtlMutation: any = useMutation(
    "getFDPaymentDtl",
    API.getFDPaymentDtl,
    {
      onError: () => {},
      // async (error: any) => {

      // setOpenPayment(false);
      // setOpenRenew(false);
      // let errorMsg = "Unknownerroroccured";
      // if (typeof error === "object") {
      //   errorMsg = error?.error_msg ?? errorMsg;
      // }
      // await MessageBox({
      //   messageTitle: "ERROR",
      //   message: errorMsg ?? "",
      //   icon: "ERROR",
      // });
      // CloseMessageBox();
      // },
      onSuccess: async (data) => {
        for (const response of data?.[0]?.MSG ?? []) {
          if (response?.O_STATUS === "999") {
            await MessageBox({
              messageTitle: "ValidationFailed",
              message: response?.O_MESSAGE ?? "",
              icon: "ERROR",
            });
          } else if (response?.O_STATUS === "9") {
            await MessageBox({
              messageTitle: "Alert",
              message: response?.O_MESSAGE ?? "",
              icon: "WARNING",
            });
          } else if (response?.O_STATUS === "99") {
            const buttonName = await MessageBox({
              messageTitle: "Confirmation",
              message: response?.O_MESSAGE ?? "",
              buttonNames: ["Yes", "No"],
              defFocusBtnName: "Yes",
            });
            if (buttonName === "No") {
              break;
            }
          } else if (response?.O_STATUS === "0") {
            updateFDPaymentData(data?.[0]);
          }
        }
        CloseMessageBox();
      },
    }
  );

  //Mutation for Validate Payment/Renew and Int payment entry
  const validatePaymetEntry: any = useMutation(
    "validatePaymetEntry",
    API.validatePaymetEntry,
    {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "ERROR",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },

      onSuccess: () => {},
    }
  );

  useEffect(() => {
    const formName = Boolean(openRenew)
      ? "Renew"
      : screenFlag === "intPayment"
      ? "Interest Payment"
      : "Payment";
    const label2 = `${formName} of A/c No.: ${
      FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
    }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
      FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
    } ${
      FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""
    }\u00A0\u00A0\u00A0\u00A0${formName} for FD No.: ${rows?.[0]?.data?.FD_NO}`;
    FDPaymentMetadata.form.label = label2;
  }, [openRenew, screenFlag]);

  useEffect(() => {
    if (screenFlag === "intPayment") {
      getFDPaymentDtlMutation.mutate({
        ...reqParam,
        A_FLAG: "I",
      });
    }
  }, []);

  //Mutation for Save FD payment details
  const saveFDPaymentDtlsMutation = useMutation(API.saveFDPaymentDtls, {
    onError: async (error: any) => {
      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      await MessageBox({
        messageTitle: "Error",
        message: errorMsg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      for (const response of data ?? []) {
        if (response?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
            icon: "ERROR",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: "Alert",
            message: response?.O_MESSAGE ?? "",
            icon: "WARNING",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
          });
        } else if (response?.O_STATUS === "0") {
          const buttonName = await MessageBox({
            messageTitle: "Voucher(s) Confirmation",
            message: response?.VOUCHER_MSG ?? "",
            buttonNames: ["Ok"],
          });
          if (buttonName === "Ok") {
            isDataChangedRef.current = true;
            CloseMessageBox();
            handleDialogClose();
            updateSourceAcctFormData([
              {
                ACCT_NAME: "",
              },
            ]);
          }
        }
      }
    },
  });

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    const formData = data;
    updateFdSavedPaymentData(data);

    if (
      Number(data?.PROV_INT_AMT) ===
        Number(data?.INT_CASH) + Number(data?.INT_TRF) &&
      Number(data?.INT_REST) ===
        Number(data?.INT_REST_CASH) + Number(data?.INT_REST_TRF) &&
      Number(data?.BAL_AMT) === Number(data?.PAY_CASH) + Number(data?.PAY_TRF)
    ) {
      const btnName = await MessageBox({
        messageTitle: "Confirmation",
        message: "Proceed?",
        buttonNames: ["Yes", "No"],
        loadingBtnName: ["Yes"],
      });
      if (btnName === "Yes") {
        validatePaymetEntry.mutate(
          {
            A_COMP_CD: authState?.companyID ?? "",
            A_BRANCH_CD: authState?.user?.branchCode ?? "",
            A_DATA: {
              ...data,
              CM_TDS_FROM: formatDate(data.CM_TDS_FROM),
              FROM_DT: formatDate(data.FROM_DT),
              INT_PAID_DT: formatDate(data.INT_PAID_DT),
              PAID_DT: formatDate(data.PAID_DT),
              PROV_DT: formatDate(data.PROV_DT),
              TDS_DT: formatDate(data.TDS_DT),
              TRAN_DT: formatDate(data.TRAN_DT),
              MATURITY_DT: formatDate(data.MATURITY_DT),
              RTGS_NEFT: Boolean(data?.RTGS_NEFT) ? "Y" : "N",
              PAYSLIP: Boolean(data?.PAYSLIP) ? "Y" : "N",
              TOT_AMT: rows?.[0]?.data?.TOT_AMT ?? "",
            },
            A_FLAG:
              screenFlag === "intPayment"
                ? "I"
                : Boolean(openPayment)
                ? "P"
                : Boolean(openRenew)
                ? "R"
                : "",
            A_TDS_METHOD: data?.TDS_METHOD ?? "",
            WORKING_DATE: authState?.workingDate ?? "",
            A_SCREEN_REF: "RPT/401",
            USERNAME: authState?.user?.id ?? "",
            USERROLE: authState?.role ?? "",
          },
          {
            onSuccess: async (data) => {
              for (const response of data ?? []) {
                if (response?.O_STATUS === "999") {
                  await MessageBox({
                    messageTitle: "ValidationFailed",
                    message: response?.O_MESSAGE ?? "",
                    icon: "ERROR",
                  });
                } else if (response?.O_STATUS === "9") {
                  await MessageBox({
                    messageTitle: "Alert",
                    message: response?.O_MESSAGE ?? "",
                    icon: "WARNING",
                  });
                } else if (response?.O_STATUS === "99") {
                  const buttonName = await MessageBox({
                    messageTitle: "Confirmation",
                    message: response?.O_MESSAGE ?? "",
                    buttonNames: ["Yes", "No"],
                    defFocusBtnName: "Yes",
                  });
                  if (buttonName === "No") {
                    break;
                  }
                } else if (response?.O_STATUS === "0") {
                  if (Number(formData?.TRANSFER_TOTAL) <= 0) {
                    // const buttonName = await MessageBox({
                    //   messageTitle: "Confirmation",
                    //   message: "Proceed?",
                    //   buttonNames: ["Yes", "No"],
                    //   defFocusBtnName: "Yes",
                    //   loadingBtnName: ["Yes"],
                    // });
                    // if (buttonName === "Yes") {
                    saveFDPaymentDtlsMutation.mutate({
                      TRANSACTION_DTL: [],
                      FD_DETAIL_DATA: {
                        ...formData,
                        COMP_CD: authState?.companyID ?? "",
                        INT_RATE: FDState?.fdPaymentData.INT_RATE ?? "",
                        TOT_AMT: FDState?.fdPaymentData.TOT_AMT ?? "",
                        TERM_CD: FDState?.fdParaDetailData.TERM_CD ?? "",
                        TDS_APPLICABLE:
                          FDState?.fdPaymentData.TDS_APPLICABLE ?? "",
                        TDS_RATE: FDState?.fdPaymentData.TDS_RATE ?? "",
                        CATEG_CD: FDState?.fdPaymentData.CATEG_CD ?? "",
                        CM_TDS_FROM: formatDate(formData?.CM_TDS_FROM),
                        FROM_DT: formatDate(formData?.FROM_DT),
                        INT_PAID_DT: formatDate(formData?.INT_PAID_DT),
                        PAID_DT: formatDate(formData?.PAID_DT),
                        PROV_DT: formatDate(formData?.PROV_DT),
                        TDS_DT: formatDate(formData?.TDS_DT),
                        TRAN_DT: formatDate(formData?.TRAN_DT),
                        MATURITY_DT: formatDate(formData?.MATURITY_DT),
                      },
                      SCREEN_REF: "RPT/401",
                      FLAG: Boolean(openPayment)
                        ? "P"
                        : Boolean(openRenew)
                        ? "R"
                        : "",
                    });
                    // }
                  } else if (Boolean(openPayment)) {
                    if (Boolean(formData?.PAYSLIP)) {
                      setOpenPayslipForm(true);
                    } else if (Boolean(formData?.RTGS_NEFT)) {
                      setOpenNeftForm(true);
                    } else {
                      setOpenTrnsForm(true);
                    }
                  } else if (Boolean(openRenew)) {
                    setOpenRenewTrnsForm(true);
                  }
                }
              }
              CloseMessageBox();
            },
          }
        );
      }
    } else {
      await MessageBox({
        messageTitle: "ValidationFailed",
        message: "Total amount should be tally.",
        icon: "ERROR",
      });
      return;
    }
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
    if (Boolean(FDState?.fdSavedPaymentData?.PAYSLIP)) {
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
          // recurringPaymentEntrySaveMutation.mutate({
          //   ...saveDataRef.current?.data,
          //   TRAN_CD: rpState?.onSaveValidationData?.[0]?.TRAN_CD ?? "",
          //   CONFIRMED: rpState?.onSaveValidationData?.[0]?.CONFIRMED ?? "",
          //   SCROLL1: rpState?.onSaveValidationData?.[0]?.SCROLL1 ?? "",
          //   ACCOUNT_CLOSE: rpState?.onSaveValidationData?.ACCOUNT_CLOSE ?? "",
          //   REC_DTL: [...rpState?.recurPmtTransferData.RECPAYTRANS],
          //   PAY_SLIP_NEFT_DTL: [...data?.PAYSLIPDD],
          //   PAYSLIP_NO: data?.PAYSLIPDD?.[0]?.PAYSLIP_NO
          //     ? (data?.PAYSLIPDD[data?.PAYSLIPDD?.length - 1]).PAYSLIP_NO
          //     : "",
          // });
        }
      }
    } else if (Boolean(FDState?.fdSavedPaymentData?.RTGS_NEFT)) {
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
          // updateBeneficiaryAcctData([...data?.BENEFIACCTDTL]);
          // recurringPaymentEntrySaveMutation.mutate({
          //   ...saveDataRef.current?.data,
          //   TRAN_CD: rpState?.onSaveValidationData?.[0]?.TRAN_CD ?? "",
          //   CONFIRMED: rpState?.onSaveValidationData?.[0]?.CONFIRMED ?? "",
          //   SCROLL1: rpState?.onSaveValidationData?.[0]?.SCROLL1 ?? "",
          //   ACCOUNT_CLOSE: rpState?.onSaveValidationData?.ACCOUNT_CLOSE ?? "",
          //   REC_DTL: [...rpState?.recurPmtTransferData.RECPAYTRANS],
          //   PAY_SLIP_NEFT_DTL: [...data?.BENEFIACCTDTL],
          //   PAYSLIP_NO: "",
          // });
        }
      }
    }
  };

  const finalPaySubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);

    if (Boolean(openTrnsForm)) {
      const newData = data?.TRNDTLS?.map(
        ({ CHEQUE_DATE, TRAN_BAL, STATUS, TYPE_CD, CHEQUE_NO, ...rest }) => rest
      );

      if (parseFloat(data?.TOTAL_DR_AMOUNT) <= 0) {
        MessageBox({
          messageTitle: t("ValidationFailed"),
          message: "Total credit amount can't be Zero/Negative.",
          icon: "ERROR",
        });
      } else if (
        parseFloat(data?.TOTAL_DR_AMOUNT) !== parseFloat(data?.TOTAL_FD_AMOUNT)
      ) {
        MessageBox({
          messageTitle: t("ValidationFailed"),
          message: "Total credit amount should be equal to total FD amount.",
          icon: "ERROR",
        });
      } else if (parseFloat(data?.DIFF_AMOUNT) === 0) {
        const buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: "Proceed?",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          saveFDPaymentDtlsMutation.mutate({
            TRANSACTION_DTL: [...newData],
            FD_DETAIL_DATA: {
              ...FDState?.fdSavedPaymentData,
              COMP_CD: authState?.companyID ?? "",
              INT_RATE: FDState?.fdPaymentData.INT_RATE ?? "",
              TOT_AMT: FDState?.fdPaymentData.TOT_AMT ?? "",
              TERM_CD: FDState?.fdParaDetailData.TERM_CD ?? "",
              TDS_APPLICABLE: FDState?.fdPaymentData.TDS_APPLICABLE ?? "",
              TDS_RATE: FDState?.fdPaymentData.TDS_RATE ?? "",
              CATEG_CD: FDState?.fdPaymentData.CATEG_CD ?? "",
              CM_TDS_FROM: formatDate(FDState?.fdSavedPaymentData.CM_TDS_FROM),
              FROM_DT: formatDate(FDState?.fdSavedPaymentData.FROM_DT),
              INT_PAID_DT: formatDate(FDState?.fdSavedPaymentData.INT_PAID_DT),
              PAID_DT: formatDate(FDState?.fdSavedPaymentData.PAID_DT),
              PROV_DT: formatDate(FDState?.fdSavedPaymentData.PROV_DT),
              TDS_DT: formatDate(FDState?.fdSavedPaymentData.TDS_DT),
              TRAN_DT: formatDate(FDState?.fdSavedPaymentData.TRAN_DT),
              MATURITY_DT: formatDate(FDState?.fdSavedPaymentData.MATURITY_DT),
              RENEW_AMT: FDState?.renewTrnsFormData.RENEW_AMT ?? "",
            },
            SCREEN_REF: "RPT/401",
            FLAG: Boolean(openPayment) ? "P" : Boolean(openRenew) ? "R" : "",
          });
        }
      }
    } else if (Boolean(openRenewTrnsForm)) {
      if (
        parseFloat(data?.PAYMENT_AMOUNT ?? 0) > parseFloat(data?.RENEW_AMT ?? 0)
      ) {
        updateRenewTrnsFormData(data);
        const buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: `Are you sure to renew less than ${data?.PAYMENT_AMOUNT}?`,
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          if (Boolean(FDState?.fdSavedPaymentData?.PAYSLIP)) {
            setOpenPayslipForm(true);
          } else if (Boolean(FDState?.fdSavedPaymentData?.RTGS_NEFT)) {
            setOpenNeftForm(true);
          } else {
            setOpenTrnsForm(true);
            setRenewTrnsVal(true);
          }
          CloseMessageBox();
        }
        return {};
      } else {
        saveFDPaymentDtlsMutation.mutate({
          TRANSACTION_DTL: [{}],
          FD_DETAIL_DATA: {
            ...FDState?.fdSavedPaymentData,
            COMP_CD: authState?.companyID ?? "",
            INT_RATE: FDState?.fdPaymentData.INT_RATE ?? "",
            TOT_AMT: FDState?.fdPaymentData.TOT_AMT ?? "",
            TERM_CD: FDState?.fdParaDetailData.TERM_CD ?? "",
            TDS_APPLICABLE: FDState?.fdPaymentData.TDS_APPLICABLE ?? "",
            TDS_RATE: FDState?.fdPaymentData.TDS_RATE ?? "",
            CATEG_CD: FDState?.fdPaymentData.CATEG_CD ?? "",
            CM_TDS_FROM: formatDate(FDState?.fdSavedPaymentData.CM_TDS_FROM),
            FROM_DT: formatDate(FDState?.fdSavedPaymentData.FROM_DT),
            INT_PAID_DT: formatDate(FDState?.fdSavedPaymentData.INT_PAID_DT),
            PAID_DT: formatDate(FDState?.fdSavedPaymentData.PAID_DT),
            PROV_DT: formatDate(FDState?.fdSavedPaymentData.PROV_DT),
            TDS_DT: formatDate(FDState?.fdSavedPaymentData.TDS_DT),
            TRAN_DT: formatDate(FDState?.fdSavedPaymentData.TRAN_DT),
            MATURITY_DT: formatDate(FDState?.fdSavedPaymentData.MATURITY_DT),
            RENEW_AMT: data?.RENEW_AMT ?? "",
          },
          SCREEN_REF: "RPT/401",
          FLAG: Boolean(openPayment) ? "P" : Boolean(openRenew) ? "R" : "",
        });
      }
    }
  };

  const handlePaymentClose = () => {
    updateFDPaymentData({});
    handleDialogClose();
  };

  const handleTrnsferFormClose = () => {
    updateSourceAcctFormData([
      {
        ACCT_NAME: "",
      },
    ]);
    setOpenTrnsForm(false);
    setOpenRenewTrnsForm(false);
    setOpenPayslipForm(false);
    setOpenNeftForm(false);
  };

  return (
    <>
      {screenFlag !== "intPayment" ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="xs"
        >
          <FormWrapper
            key={"paymentrenewbtns"}
            metaData={PaymentRenewBtnsMetadata as MetaDataType}
            onSubmitHandler={() => {}}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={async (flag) => {
              if (flag === "FD_PAYMENT") {
                setOpenPayment(true);
                getFDPaymentDtlMutation.mutate({
                  ...reqParam,
                  A_FLAG: "P",
                });
              }
              if (flag === "RENEW_FD") {
                setOpenRenew(true);
                getFDPaymentDtlMutation.mutate({
                  ...reqParam,
                  A_FLAG: "R",
                });
              }
            }}
            formState={{
              MessageBox: MessageBox,
            }}
          >
            <GradientButton onClick={() => handleDialogClose()}>
              Close
            </GradientButton>
          </FormWrapper>
        </Dialog>
      ) : null}

      {Boolean(openPayment) ||
      Boolean(openRenew) ||
      screenFlag === "intPayment" ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "scroll",
            },
          }}
          maxWidth="xl"
        >
          {getFDPaymentDtlMutation?.isLoading ? (
            <LoaderPaperComponent />
          ) : (
            <>
              {getFDPaymentDtlMutation?.isError && (
                <Alert
                  severity="error"
                  errorMsg={
                    getFDPaymentDtlMutation?.error?.error_msg ??
                    t("Somethingwenttowrong")
                  }
                  errorDetail={getFDPaymentDtlMutation?.error?.error_detail}
                  color="error"
                />
              )}
              <FormWrapper
                key={"fdpayment"}
                metaData={FDPaymentMetadata as MetaDataType}
                onSubmitHandler={onSubmitHandler}
                initialValues={
                  {
                    ...FDState?.fdPaymentData,
                    PAYSLIP: false,
                    RTGS_NEFT: false,
                    BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
                    ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
                    ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
                    FD_NO: rows?.[0]?.data?.FD_NO ?? "",
                    IS_PREMATURE:
                      FDState?.checkAllowFDPayApiData?.IS_PREMATURE ?? "",
                    SPL_AMT: FDState?.fdParaDetailData?.SPL_AMT ?? "",
                    PRE_RATE:
                      FDState?.checkAllowFDPayApiData?.IS_PREMATURE === "Y"
                        ? FDState?.prematureRateData?.INT_RATE
                        : "",
                    TDS_METHOD: FDState?.fdParaDetailData?.TDS_METHOD ?? "",
                  } as InitialValuesType
                }
                formState={{
                  MessageBox: MessageBox,
                  handleDisableButton: handleDisableButton,
                  screenFlag: screenFlag,
                  getFDPaymentDtlMutation: getFDPaymentDtlMutation,
                  reqParam: reqParam,
                  openPayment: openPayment,
                  openRenew: openRenew,
                  intRateIniValue: FDState?.fdPaymentData?.INT_RATE_REST ?? "",
                  paidDateIniValue: FDState?.fdPaymentData?.PAID_DT ?? "",
                  isChangePaidDate: false,
                  isChangeIntRate: false,
                }}
                formStyle={{
                  background: "white",
                  minWidth: "1200px",
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    <GradientButton
                      onClick={handleSubmit}
                      // endIcon={
                      //   getFDViewDtlMutation?.isLoading ? (
                      //     <CircularProgress size={20} />
                      //   ) : null
                      // }
                      // disabled={
                      //   isSubmitting ||
                      //   getFDViewDtlMutation?.isFetching ||
                      //   FDState?.disableButton
                      // }
                      color={"primary"}
                    >
                      Save
                    </GradientButton>
                    <GradientButton onClick={handlePaymentClose}>
                      Close
                    </GradientButton>
                  </>
                )}
              </FormWrapper>
            </>
          )}
        </Dialog>
      ) : null}

      {Boolean(openTrnsForm) ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
          fullWidth={true}
        >
          <TransferAcctDetailForm
            screenFlag="paymentTransfer"
            handleTrnsferFormClose={handleTrnsferFormClose}
            onSubmitHandler={finalPaySubmitHandler}
            ref={sourceAcctformRef}
            openTrnsForm={openTrnsForm}
            renewTrnsVal={renewTrnsVal}
          />
        </Dialog>
      ) : null}

      {Boolean(openRenewTrnsForm) ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
          fullWidth={true}
        >
          <TransferAcctDetailForm
            handleTrnsferFormClose={handleTrnsferFormClose}
            onSubmitHandler={finalPaySubmitHandler}
            ref={sourceAcctformRef}
            openRenewTrnsForm={openRenewTrnsForm}
            renewTrnsVal={renewTrnsVal}
          />
        </Dialog>
      ) : null}

      {Boolean(openPayslipForm) ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
          fullWidth={true}
        >
          <PayslipAndDDForm
            defaultView="new"
            accountDetailsForPayslip={accountDetailsForPayslip}
            onSubmitHandler={paysBenefSubmitHandler}
            handleDialogClose={handleTrnsferFormClose}
            hideHeader={false}
          />
        </Dialog>
      ) : null}

      {Boolean(openNeftForm) ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
          fullWidth={true}
        >
          <BeneficiaryAcctDetailsForm
            defaultView="new"
            onSubmitHandler={paysBenefSubmitHandler}
            accountDetailsForBen={accountDetailsForBen}
            hideHeader={false}
            handleDialogClose={handleTrnsferFormClose}
          />
        </Dialog>
      ) : null}
    </>
  );
};
