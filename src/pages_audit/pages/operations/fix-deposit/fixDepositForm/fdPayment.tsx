import { CircularProgress, Dialog } from "@mui/material";
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
  } = useContext(FDContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const [openPayment, setOpenPayment] = useState(false);
  const [openRenew, setOpenRenew] = useState(false);
  const [opentrnsForm, setOpentrnsForm] = useState(false);
  const sourceAcctformRef: any = useRef(null);
  const { state: rows }: any = useLocation();
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

  console.log("FDState", FDState);

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
      console.log("data saveFDPaymentDtls", data);

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
          const buttonName = await MessageBox({
            messageTitle: "Voucher(s) Confirmation",
            message: response?.VOUCHER_MSG ?? "",
            buttonNames: ["Ok"],
          });
          if (buttonName === "Ok") {
            isDataChangedRef.current = true;
            CloseMessageBox();
            handleDialogClose();
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
            A_FLAG: screenFlag === "intPayment" ? "I" : "P",
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
                  setOpentrnsForm(true);
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

  const finalPaySubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);

    console.log("data", data);

    const newData = data?.TRNDTLS?.map(
      ({ CHEQUE_DATE, TRAN_BAL, STATUS, TYPE_CD, CHEQUE_NO, ...rest }) => rest
    );

    console.log("newData", newData);

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
    setOpentrnsForm(false);
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

      {Boolean(opentrnsForm) ? (
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
          />
        </Dialog>
      ) : null}
    </>
  );
};
