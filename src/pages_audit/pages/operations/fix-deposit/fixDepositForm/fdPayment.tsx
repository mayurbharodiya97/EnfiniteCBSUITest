import { CircularProgress, Dialog } from "@mui/material";
import { useContext, useEffect, useState } from "react";
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
  FormWrapper,
  GradientButton,
  InitialValuesType,
  LoaderPaperComponent,
  MetaDataType,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";

export const FDPayment = ({ handleDialogClose, screenFlag }) => {
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
  const { state: rows }: any = useLocation();
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

  //Mutation for get Payment/Renew and Int payment form data
  const getFDPaymentDtlMutation: any = useMutation(
    "getFDPaymentDtl",
    API.getFDPaymentDtl,
    {
      onError: async (error: any) => {
        setOpenPayment(false);
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
              CM_TDS_FROM: utilFunction.isValidDate(data.CM_TDS_FROM)
                ? format(new Date(data.CM_TDS_FROM), "dd/MMM/yyyy")
                : "",
              FROM_DT: utilFunction.isValidDate(data.FROM_DT)
                ? format(new Date(data.FROM_DT), "dd/MMM/yyyy")
                : "",
              INT_PAID_DT: utilFunction.isValidDate(data.INT_PAID_DT)
                ? format(new Date(data.INT_PAID_DT), "dd/MMM/yyyy")
                : "",
              PAID_DT: utilFunction.isValidDate(data.PAID_DT)
                ? format(new Date(data.PAID_DT), "dd/MMM/yyyy")
                : "",
              PROV_DT: utilFunction.isValidDate(data.PROV_DT)
                ? format(new Date(data.PROV_DT), "dd/MMM/yyyy")
                : "",
              TDS_DT: utilFunction.isValidDate(data.TDS_DT)
                ? format(new Date(data.TDS_DT), "dd/MMM/yyyy")
                : "",
              TRAN_DT: utilFunction.isValidDate(data.TRAN_DT)
                ? format(new Date(data.TRAN_DT), "dd/MMM/yyyy")
                : "",
              MATURITY_DT: utilFunction.isValidDate(data.MATURITY_DT)
                ? format(new Date(data.MATURITY_DT), "dd/MMM/yyyy")
                : "",
              RTGS_NEFT: Boolean(data?.RTGS_NEFT) ? "Y" : "N",
              PAYSLIP: Boolean(data?.PAYSLIP) ? "Y" : "N",
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
          {Object.keys(FDState?.fdPaymentData).length <= 0 ? (
            <LoaderPaperComponent />
          ) : (
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
            // onSubmitHandler={finalOnSubmitHandler}
            // ref={sourceAcctformRef}
          />
        </Dialog>
      ) : null}
    </>
  );
};
