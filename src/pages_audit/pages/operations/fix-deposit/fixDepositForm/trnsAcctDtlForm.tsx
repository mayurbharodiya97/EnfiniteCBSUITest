import { Fragment, forwardRef, useContext, useEffect, useState } from "react";
import {
  RenewTransferMetadata,
  TransferAcctDetailFormMetadata,
} from "./metaData/trnsAcctDtlMetaData";
import {
  usePopupContext,
  InitialValuesType,
  FormWrapper,
  MetaDataType,
  GradientButton,
} from "@acuteinfo/common-base";
import { FDContext } from "../context/fdContext";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { CircularProgress, Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";

export const TransferAcctDetailForm = forwardRef<any, any>(
  (
    { onSubmitHandler, screenFlag, handleTrnsferFormClose, openRenewTrnsForm },
    ref: any
  ) => {
    const { FDState, updateSourceAcctFormData } = useContext(FDContext);
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const [trnsDtlRefresh, setTrnsDtlRefresh] = useState(0);
    const { t } = useTranslation();
    const { state: rows }: any = useLocation();

    let totalFDAmt =
      screenFlag === "paymentTransfer" || Boolean(openRenewTrnsForm)
        ? FDState?.fdSavedPaymentData?.TRANSFER_TOTAL
        : (Array.isArray(FDState?.fdDetailFormData?.FDDTL)
            ? FDState?.fdDetailFormData?.FDDTL
            : []
          ).reduce(
            (accum, obj) =>
              accum + Number(obj?.CASH_AMT ?? 0) + Number(obj?.TRSF_AMT ?? 0),
            0
          );

    useEffect(() => {
      if (screenFlag === "paymentTransfer" || Boolean(openRenewTrnsForm)) {
        if (
          TransferAcctDetailFormMetadata.fields[5]._fields &&
          TransferAcctDetailFormMetadata.fields[5]._fields[5] &&
          TransferAcctDetailFormMetadata.fields[1] &&
          TransferAcctDetailFormMetadata.fields[5]._fields[0] &&
          TransferAcctDetailFormMetadata.fields[5]._fields[0]
            .accountCodeMetadata
        ) {
          TransferAcctDetailFormMetadata.fields[5]._fields[0].branchCodeMetadata.GridProps =
            { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountTypeMetadata.GridProps =
            { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 };
          TransferAcctDetailFormMetadata.fields[5]._fields[1].GridProps = {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3.5,
            xl: 3.5,
          };
          TransferAcctDetailFormMetadata.fields[5]._fields[2].GridProps = {
            xs: 12,
            sm: 3,
            md: 3,
            lg: 2,
            xl: 2,
          };
          TransferAcctDetailFormMetadata.fields[5]._fields[5].GridProps = {
            xs: 12,
            sm: 3,
            md: 3,
            lg: 2,
            xl: 2,
          };
          TransferAcctDetailFormMetadata.fields[5]._fields[5].label =
            "Credit Amount";
          TransferAcctDetailFormMetadata.fields[1].label =
            "Total Credit Amount";

          TransferAcctDetailFormMetadata.form.label = `A/c No.: ${
            rows?.[0]?.data?.BRANCH_CD?.trim() ?? ""
          }-${rows?.[0]?.data?.ACCT_TYPE?.trim() ?? ""}-${
            rows?.[0]?.data?.ACCT_CD?.trim() ?? ""
          } ${
            FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""
          }\u00A0\u00A0\u00A0\u00A0FD No.: ${rows?.[0]?.data?.FD_NO}`;
        }
      } else {
        if (
          TransferAcctDetailFormMetadata.fields[5]._fields &&
          TransferAcctDetailFormMetadata.fields[5]._fields[5] &&
          TransferAcctDetailFormMetadata.fields[1] &&
          TransferAcctDetailFormMetadata.fields[5]._fields[0] &&
          TransferAcctDetailFormMetadata.fields[5]._fields[0]
            .accountCodeMetadata
        ) {
          TransferAcctDetailFormMetadata.fields[5]._fields[0].branchCodeMetadata.GridProps =
            { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountTypeMetadata.GridProps =
            { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 };
          TransferAcctDetailFormMetadata.fields[5]._fields[1].GridProps = {
            xs: 12,
            sm: 4.5,
            md: 4.5,
            lg: 4.5,
            xl: 2.6,
          };
          TransferAcctDetailFormMetadata.fields[5]._fields[2].GridProps = {
            xs: 12,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 1.5,
          };
          TransferAcctDetailFormMetadata.fields[5]._fields[5].GridProps = {
            xs: 12,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 1.5,
          };
          TransferAcctDetailFormMetadata.fields[5]._fields[5].label =
            "Debit Amount";
          TransferAcctDetailFormMetadata.fields[1].label = "Total Debit Amount";

          TransferAcctDetailFormMetadata.form.label = `A/c No.: ${
            FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
          }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
            FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
          } ${
            FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""
          }\u00A0\u00A0\u00A0\u00A0FD No.: ${rows?.[0]?.data?.FD_NO}`;
        }
      }
    }, [screenFlag]);

    useEffect(() => {
      RenewTransferMetadata.form.label = `A/c No.: ${
        rows?.[0]?.data?.BRANCH_CD?.trim() ?? ""
      }-${rows?.[0]?.data?.ACCT_TYPE?.trim() ?? ""}-${
        rows?.[0]?.data?.ACCT_CD?.trim() ?? ""
      } ${
        FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""
      }\u00A0\u00A0\u00A0\u00A0FD No.: ${rows?.[0]?.data?.FD_NO}`;
    }, []);

    return (
      <Fragment>
        {Boolean(openRenewTrnsForm) ? (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
                overflow: "auto",
              },
            }}
            maxWidth="md"
            fullWidth={true}
          >
            <FormWrapper
              key={"renewTransferForm"}
              metaData={RenewTransferMetadata as MetaDataType}
              onSubmitHandler={onSubmitHandler}
              formStyle={{
                background: "white",
              }}
              initialValues={
                {
                  PAYMENT_AMOUNT: totalFDAmt,
                  RENEW_AMT: totalFDAmt,
                } as InitialValuesType
              }
              ref={ref}
              formState={{
                MessageBox: MessageBox,
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    // disabled={isSubmitting || disableButton}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    {t("Save")}
                  </GradientButton>

                  <GradientButton
                    onClick={handleTrnsferFormClose}
                    color={"primary"}
                  >
                    {t("Close")}
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          </Dialog>
        ) : (
          <FormWrapper
            key={
              "TransferAcctDetail" +
              FDState?.sourceAcctFormData?.TRNDTLS?.length +
              trnsDtlRefresh
            }
            metaData={TransferAcctDetailFormMetadata as MetaDataType}
            initialValues={
              {
                ...FDState?.sourceAcctFormData,
                TOTAL_FD_AMOUNT: totalFDAmt,
              } as InitialValuesType
            }
            onSubmitHandler={onSubmitHandler}
            hideHeader={screenFlag === "paymentTransfer" ? false : true}
            onFormButtonClickHandel={async (id) => {
              if (id === "ADDNEWROW") {
                const data = await ref?.current?.getFieldData();
                // let event: any = { preventDefault: () => {} };
                // ref?.current?.handleSubmit(event);

                const dataArray = Array.isArray(data?.TRNDTLS)
                  ? data?.TRNDTLS
                  : [];

                if (dataArray?.length === 0) {
                  updateSourceAcctFormData([
                    {
                      ACCT_NAME: "",
                    },
                  ]);
                  setTrnsDtlRefresh((prevVal) => prevVal + 1);
                } else if (
                  parseFloat(data?.TOTAL_FD_AMOUNT) > 0 &&
                  dataArray?.length > 0
                ) {
                  for (let i = 0; i < dataArray?.length; i++) {
                    const item = dataArray[0];

                    if (
                      !Boolean(item?.BRANCH_CD?.trim()) ||
                      !Boolean(item?.ACCT_TYPE?.trim()) ||
                      !Boolean(item?.ACCT_CD?.trim())
                    ) {
                      return await MessageBox({
                        messageTitle: t("ValidationFailed"),
                        message: "Required value missing.",
                        icon: "ERROR",
                      });
                    } else {
                      updateSourceAcctFormData([{}, ...data?.TRNDTLS]);
                      setTrnsDtlRefresh((prevVal) => prevVal + 1);
                    }
                  }
                }
              }
            }}
            formStyle={{
              background: "white",
              padding: "5px",
              border: "1px solid var(--theme-color4)",
              borderRadius: "10px",
            }}
            formState={{
              MessageBox: MessageBox,
              screenFlag: screenFlag,
              docCD: "FDINSTRCRTYPE",
            }}
            ref={ref}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  // disabled={isSubmitting || disableButton}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>

                <GradientButton
                  onClick={handleTrnsferFormClose}
                  color={"primary"}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        )}
      </Fragment>
    );
  }
);
