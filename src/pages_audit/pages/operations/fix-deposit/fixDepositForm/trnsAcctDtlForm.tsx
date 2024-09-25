import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext, useEffect, useState } from "react";
import { TransferAcctDetailFormMetadata } from "./metaData/trnsAcctDtlMetaData";
import { InitialValuesType } from "packages/form";
import { usePopupContext } from "components/custom/popupContext";
import { FDContext } from "../context/fdContext";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { GradientButton } from "components/styledComponent/button";
import { CircularProgress } from "@mui/material";

export const TransferAcctDetailForm = forwardRef<any, any>(
  ({ onSubmitHandler, screenFlag, handleTrnsferFormClose }, ref: any) => {
    const { FDState, updateSourceAcctFormData } = useContext(FDContext);
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const [trnsDtlRefresh, setTrnsDtlRefresh] = useState(0);
    const { t } = useTranslation();

    let totalFDAmt =
      screenFlag === "paymentTransfer"
        ? FDState?.fdSavedPaymentData?.TOT_AMT -
          FDState?.fdSavedPaymentData?.TDS_UPTO_TOTAL
        : (Array.isArray(FDState?.fdDetailFormData?.FDDTL)
            ? FDState?.fdDetailFormData?.FDDTL
            : []
          ).reduce(
            (accum, obj) =>
              accum + Number(obj?.CASH_AMT ?? 0) + Number(obj?.TRSF_AMT ?? 0),
            0
          );

    useEffect(() => {
      if (screenFlag === "paymentTransfer") {
        if (
          TransferAcctDetailFormMetadata.fields[5]._fields &&
          TransferAcctDetailFormMetadata.fields[5]._fields[5] &&
          TransferAcctDetailFormMetadata.fields[1] &&
          TransferAcctDetailFormMetadata.fields[5]._fields[0] &&
          TransferAcctDetailFormMetadata.fields[5]._fields[0]
            .accountCodeMetadata
        ) {
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { lg: 2.5, md: 2.5, sm: 2.5, xl: 1.3, xs: 12 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { lg: 2.5, md: 2.5, sm: 2.5, xl: 1.3, xs: 12 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { lg: 2.5, md: 2.5, sm: 2.5, xl: 1.3, xs: 12 };
          TransferAcctDetailFormMetadata.fields[5]._fields[5].label =
            "Credit Amount";
          TransferAcctDetailFormMetadata.fields[1].label =
            "Total Credit Amount";
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
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 };
          TransferAcctDetailFormMetadata.fields[5]._fields[0].accountCodeMetadata.GridProps =
            { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 };
          TransferAcctDetailFormMetadata.fields[5]._fields[5].label =
            "Debit Amount";
          TransferAcctDetailFormMetadata.fields[1].label = "Total Debit Amount";
        }
      }
    }, [screenFlag]);

    return (
      <Fragment>
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
                    !Boolean(item.BRANCH_CD.trim()) ||
                    !Boolean(item.ACCT_TYPE.trim()) ||
                    !Boolean(item.ACCT_CD.trim()) ||
                    !Boolean(item.CHEQUE_NO.trim())
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
            docCD: "FDINSTRCRTYPE",
          }}
          formState={{ MessageBox: MessageBox, screenFlag: screenFlag }}
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
      </Fragment>
    );
  }
);
