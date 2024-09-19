import { CircularProgress, Dialog } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "components/custom/popupContext";
import { FDContext } from "../context/fdContext";
import {
  FDPaymentMetadata,
  PaymentRenewBtnsMetadata,
} from "./metaData/fdPaymentMetadata";
import { useMutation } from "react-query";
import * as API from "../api";
import { InitialValuesType } from "packages/form";
import { useLocation } from "react-router-dom";
import { LoaderPaperComponent } from "components/common/loaderPaper";

export const FDPayment = ({ handleDialogClose }) => {
  const { FDState, handleDisableButton, updateFDPaymentData } =
    useContext(FDContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const [openPayment, setOpenPayment] = useState(false);
  const { state: rows }: any = useLocation();

  console.log(" FDstateeee rows", rows);

  //Mutation for get View Detail grid data
  const getFDViewDtlMutation: any = useMutation(
    "getFDViewDtl",
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
      onSuccess: (data) => {
        updateFDPaymentData(data?.[0]);
        CloseMessageBox();
      },
    }
  );

  useEffect(() => {
    const label2 = `Payment of A/c No.: ${
      FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
    }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
      FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
    } ${
      FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""
    }\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Payment Of FD : ${
      rows?.[0]?.data?.FD_NO
    }`;
    FDPaymentMetadata.form.label = label2;
  }, []);

  console.log("FDstateeee", FDState);

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
          formState={{
            MessageBox: MessageBox,
          }}
          formStyle={{
            background: "white",
          }}
          onFormButtonClickHandel={async (flag) => {
            if (flag === "FD_PAYMENT") {
              setOpenPayment(true);
              getFDViewDtlMutation.mutate({
                A_LOGIN_BR: authState?.user?.branchCode ?? "",
                A_COMP_CD: authState?.companyID ?? "",
                A_BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
                A_ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
                A_ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
                A_FD_NO: rows?.[0]?.data?.FD_NO ?? "",
                A_FLAG: "P",
                A_IS_PREMATURE:
                  FDState?.checkAllowFDPayApiData?.IS_PREMATURE ?? "",
                A_PRE_RATE: "",
                A_SPL_AMT: FDState?.fdParaDetailData?.SPL_AMT ?? "",
                A_TDS_METHOD: FDState?.fdParaDetailData?.TDS_METHOD ?? "",
                WORKING_DATE: authState?.workingDate ?? "",
              });
            }
            if (flag === "RENEW_FD") {
            }
          }}
        >
          <GradientButton onClick={() => handleDialogClose()}>
            Close
          </GradientButton>
        </FormWrapper>
      </Dialog>

      {Boolean(openPayment) ? (
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
              //   onSubmitHandler={onSubmitHandler}
              initialValues={
                {
                  ...FDState?.fdPaymentData,
                } as InitialValuesType
              }
              formState={{
                MessageBox: MessageBox,
                handleDisableButton: handleDisableButton,
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
                    Ok
                  </GradientButton>
                  <GradientButton onClick={() => handleDialogClose()}>
                    Close
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          )}
        </Dialog>
      ) : null}
    </>
  );
};
