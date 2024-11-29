import { Dialog } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import { FDContext } from "../context/fdContext";
import { PaymentRenewBtnsMetadata } from "./metaData/fdPaymentMetadata";
import { useMutation } from "react-query";
import * as API from "../api";
import { useLocation } from "react-router-dom";
import {
  Alert,
  FormWrapper,
  GradientButton,
  MetaDataType,
  usePopupContext,
} from "@acuteinfo/common-base";
import FDPaymentStepperForm from "./fdPaymentStepper";
import { useTranslation } from "react-i18next";

type FDPaymentProps = {
  handleDialogClose?: any;
  isDataChangedRef?: any;
  openIntPayment?: boolean;
};

export const FDPaymentBtns: React.FC<FDPaymentProps> = ({
  handleDialogClose,
  isDataChangedRef,
}) => {
  const { FDState, updateFDPaymentData } = useContext(FDContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const [openPayment, setOpenPayment] = useState(false);
  const [openRenew, setOpenRenew] = useState(false);
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

  //Mutation for get Payment/Renew and Int payment form data
  const getFDPaymentDtlMutation: any = useMutation(
    "getFDPaymentDtl",
    API.getFDPaymentDtl,
    {
      onError: (error: any) => {},
      onSuccess: async (data) => {
        for (const response of data?.[0]?.MSG ?? []) {
          if (response?.O_STATUS === "999") {
            await MessageBox({
              messageTitle: response?.O_MSG_TITLE?.length
                ? response?.O_MSG_TITLE
                : "ValidationFailed",
              message: response?.O_MESSAGE ?? "",
              icon: "ERROR",
            });
          } else if (response?.O_STATUS === "9") {
            await MessageBox({
              messageTitle: response?.O_MSG_TITLE?.length
                ? response?.O_MSG_TITLE
                : "Alert",
              message: response?.O_MESSAGE ?? "",
              icon: "WARNING",
            });
          } else if (response?.O_STATUS === "99") {
            const buttonName = await MessageBox({
              messageTitle: response?.O_MSG_TITLE?.length
                ? response?.O_MSG_TITLE
                : "Confirmation",
              message: response?.O_MESSAGE ?? "",
              buttonNames: ["Yes", "No"],
              defFocusBtnName: "Yes",
              icon: "CONFIRM",
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

  return (
    <>
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
            {t("Close")}
          </GradientButton>
        </FormWrapper>
      </Dialog>

      {Boolean(openPayment) || Boolean(openRenew) ? (
        <FDPaymentStepperForm
          handleDialogClose={handleDialogClose}
          isDataChangedRef={isDataChangedRef}
          openPayment={openPayment}
          openRenew={openRenew}
          fdPmtDtlMutError={getFDPaymentDtlMutation}
        />
      ) : null}
    </>
  );
};
