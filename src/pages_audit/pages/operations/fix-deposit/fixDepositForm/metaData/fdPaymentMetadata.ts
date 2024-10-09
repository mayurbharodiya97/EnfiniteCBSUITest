import * as API from "../../api";
import { checkTokenValidate } from "pages_audit/pages/operations/recurringPaymentEntry/api";
import { format } from "date-fns";
import { utilFunction } from "@acuteinfo/common-base";

//FD Payment/Renew buttons form metadata
export const PaymentRenewBtnsMetadata = {
  form: {
    name: "paymentbtns",
    label: "FD Payment/Renew",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    allowColumnHiding: true,
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 4,
          md: 4,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
    componentProps: {
      formbutton: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "formbutton",
      },
      name: "FD_PAYMENT",
      label: "FD Payment",
      endIcon: "CircularProgress",
      GridProps: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "RENEW_FD",
      label: "Renew FD",
      endIcon: "CircularProgress",
      GridProps: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
    },
  ],
};

// FD Payment/Renew and Int payment form metadata
export const FDPaymentMetadata = {
  form: {
    name: "FDPayment",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    allowColumnHiding: true,
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 4,
          md: 4,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
    componentProps: {
      textField: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      inputMask: {
        fullWidth: true,
      },
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_HEADER",
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "DATE_HEADER",
      label: "Date",
      ignoreInSubmit: true,
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "10px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
          background: "lightblue",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "FIN_START_DATE_HEADER",
      label: "Financial Start Date",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "10px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
          background: "lightblue",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "AMOUNT_HEADER",
      label: "Amount",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "10px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
          background: "lightblue",
        },
      },
      fullWidth: true,
      GridProps: { xs: 3.6, sm: 3.6, md: 3.6, lg: 3.6, xl: 3.6 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "TDS_AND_SURCH_HEADER",
      label: "TDS & Surcharge",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "10px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
          background: "lightblue",
        },
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "TOTAL_HEADER",
      label: "Total",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "10px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
          background: "lightblue",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "TDS_UPTO_TYPO",
      label: "TDS Up To :",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "TDS_DT",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACE_CM_TDS_FROM",
      dependentFields: ["TDS_APPLICABLE"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "CM_TDS_FROM",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",
      isReadOnly: true,
      dependentFields: ["TDS_APPLICABLE"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return false;
        } else {
          return true;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_INT_AMT",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACE_INT_TDS_REST",
      dependentFields: ["TDS_APPLICABLE"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "INT_TDS_REST",
      label: "",
      isReadOnly: true,
      dependentFields: ["TDS_APPLICABLE"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return false;
        } else {
          return true;
        }
      },
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACE_TDS_INT_TRF",
      dependentFields: ["TDS_APPLICABLE"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_INT_TRF",
      label: "",
      dependentFields: ["DISABLE_TDS", "TDS_APPLICABLE"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DISABLE_TDS?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return false;
        } else {
          return true;
        }
      },
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACE_SUR_TDS_TRF",
      dependentFields: ["TDS_APPLICABLE"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SUR_TDS_TRF",
      label: "",
      dependentFields: ["DISABLE_TDS", "TDS_APPLICABLE"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DISABLE_TDS?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.TDS_APPLICABLE?.value?.trim() === "Y") {
          return false;
        } else {
          return true;
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_UPTO_TOTAL",
      label: "",
      dependentFields: ["TDS_INT_TRF", "SUR_TDS_TRF"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.TDS_INT_TRF?.value ?? 0) +
          Number(dependentFieldsValues?.SUR_TDS_TRF?.value ?? 0);
        return value;
      },
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "INT_PAID_TYPO",
      label: "Int Paid :",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "INT_PAID_DT",
      label: "",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACE_INT_PAID_ONE",
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_PAID_AMT",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "CASH_TYPO",
      label: "Cash",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "TRANSFER_TYPO",
      label: "Transfer",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "AFT_MATURE_INT",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "INT_PROV_TYPO",
      label: "Int Prov. :",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "PROV_DT",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOT_TDS_RECO_INT_AMT",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PROV_INT_AMT",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_CASH",
      label: "",
      dependentFields: ["PROV_INT_AMT"],
      runPostValidationHookAlways: true,
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (Number(dependentFieldsValues?.PROV_INT_AMT?.value) >= 0) {
          if (
            Number(currentField?.value) < 0 ||
            Number(currentField?.value) >
              Number(dependentFieldsValues?.PROV_INT_AMT?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Invalid Amount",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                INT_CASH: {
                  value: "",
                  ignoreUpdate: true,
                  isFieldFocused: true,
                },
              };
            }
          } else {
            let value =
              Number(dependentFieldsValues?.PROV_INT_AMT?.value ?? 0) -
              Number(currentField?.value ?? 0);
            return {
              INT_TRF: {
                value: value,
                ignoreUpdate: true,
              },
            };
          }
        } else {
          let value =
            Number(dependentFieldsValues?.PROV_INT_AMT?.value ?? 0) -
            Number(currentField?.value ?? 0);
          return {
            INT_TRF: {
              value: value,
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_TRF",
      label: "",
      dependentFields: ["PROV_INT_AMT"],
      runPostValidationHookAlways: true,
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (Number(dependentFieldsValues?.PROV_INT_AMT?.value) >= 0) {
          if (
            Number(currentField?.value) < 0 ||
            Number(currentField?.value) >
              Number(dependentFieldsValues?.PROV_INT_AMT?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Invalid Amount",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                INT_TRF: {
                  value: "",
                  ignoreUpdate: true,
                  isFieldFocused: true,
                },
              };
            }
          } else if (
            Number(currentField?.value) < 0 ||
            Number(currentField?.value) >
              Number(dependentFieldsValues?.PROV_INT_AMT?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Invalid Amount",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                INT_TRF: {
                  value: "",
                  ignoreUpdate: true,
                  isFieldFocused: true,
                },
              };
            }
          } else {
            let value =
              Number(dependentFieldsValues?.PROV_INT_AMT?.value ?? 0) -
              Number(currentField?.value ?? 0);
            return {
              INT_CASH: {
                value: value,
                ignoreUpdate: true,
              },
            };
          }
        } else {
          let value =
            Number(dependentFieldsValues?.PROV_INT_AMT?.value ?? 0) -
            Number(currentField?.value ?? 0);
          return {
            INT_CASH: {
              value: value,
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_PROV_TOTAL",
      label: "",
      isReadOnly: true,
      dependentFields: ["INT_TRF", "INT_CASH"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.INT_TRF?.value ?? 0) +
          Number(dependentFieldsValues?.INT_CASH?.value ?? 0);
        return value;
      },
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "INT_FROM_TYPO",
      label: "Int From :",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "FROM_DT",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "DAYS_DTL",
      label: "",
      placeholder: "",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 2.7, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_DAYS_DTL",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 2.7, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "AFT_MAT_INT_TYPE",
      label: "",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.4, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_AFT_MAT_INT_TYPE",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1.4, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "MAT_INT_RATE",
      label: "Mat Int Rate :",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.3 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_MAT_INT_RATE",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.3 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "AFT_MAT_INT_RATE",
      label: "",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_AFT_MAT_INT_RATE",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "AFT_MAT_INT_AMT",
      label: "",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_AFT_MAT_INT_AMT",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "TO",
      label: "To :",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "PAID_DT",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",
      dependentFields: [
        "DISABLE_INT_RATE",
        "DISABLE_PAID_DT",
        "INT_RATE_REST",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "FD_NO",
        "IS_PREMATURE",
        "SPL_AMT",
        "TDS_METHOD",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};

        const formattedCurField = currentField?.value
          ? format(new Date(currentField?.value), "dd/MMM/yyyy")
          : "";

        const formattedFormStVal = formState.paidDateIniValue
          ? format(new Date(formState.paidDateIniValue), "dd/MMM/yyyy")
          : "";

        if (
          formattedCurField === formattedFormStVal &&
          !formState.isChangePaidDate
        ) {
          if (!formState.isChangePaidDate) {
            formState.isChangePaidDate = true;
            return {};
          }
        }

        if (currentField?.value) {
          const reqParameters = {
            A_LOGIN_BR: authState?.user?.branchCode ?? "",
            A_COMP_CD: authState?.companyID ?? "",
            A_BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
            A_ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
            A_ACCT_CD: dependentFieldValues?.ACCT_CD?.value ?? "",
            A_FD_NO: dependentFieldValues?.FD_NO?.value ?? "",
            A_FLAG: Boolean(formState?.openPayment)
              ? "P"
              : Boolean(formState?.openRenew)
              ? "R"
              : "I",
            A_IS_PREMATURE: dependentFieldValues?.IS_PREMATURE?.value ?? "",
            A_PRE_RATE: "",
            A_SPL_AMT: dependentFieldValues?.SPL_AMT?.value ?? "",
            A_TDS_METHOD: dependentFieldValues?.TDS_METHOD?.value ?? "",
            WORKING_DATE: authState?.workingDate ?? "",
            A_INT_RATE: dependentFieldValues?.INT_RATE_REST?.value ?? "",
            A_PAID_DT: currentField?.value
              ? format(new Date(currentField?.value), "dd/MMM/yyyy")
              : "",
          };
          const postData = await API.getFDPaymentDtl(reqParameters);

          for (const response of postData?.[0]?.MSG ?? []) {
            if (response?.O_STATUS === "999") {
              await formState?.MessageBox({
                messageTitle: "ValidationFailed",
                message: response?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
            } else if (response?.O_STATUS === "9") {
              await formState?.MessageBox({
                messageTitle: "Alert",
                message: response?.O_MESSAGE ?? "",
                icon: "WARNING",
              });
            } else if (response?.O_STATUS === "99") {
              const buttonName = await formState?.MessageBox({
                messageTitle: "Confirmation",
                message: response?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
                defFocusBtnName: "Yes",
              });
              if (buttonName === "No") {
                break;
              }
            } else if (response?.O_STATUS === "0") {
              return Object.keys(postData?.[0] || {}).reduce((acc, key) => {
                if (key !== "PAID_DT") {
                  acc[key] = {
                    value: postData[0][key] ?? "",
                    ignoreUpdate: true,
                  };
                }
                return acc;
              }, {});
            }
          }
        }
        return {};
      },
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DISABLE_PAID_DT?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "RATE%",
      label: "Rate :",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 0.8, sm: 0.8, md: 0.8, lg: 0.8, xl: 0.8 },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE_REST",
      label: "",
      dependentFields: [
        "DISABLE_INT_RATE",
        "PAID_DT",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "FD_NO",
        "IS_PREMATURE",
        "SPL_AMT",
        "TDS_METHOD",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};

        const formattedValue = parseFloat(
          formState?.intRateIniValue || 0
        ).toFixed(2);

        if (
          Number(currentField?.value) === Number(formattedValue) &&
          !formState.isChangeIntRate
        ) {
          if (!formState.isChangeIntRate) {
            formState.isChangeIntRate = true;
            return {};
          }
        }

        if (currentField?.value) {
          let reqParameters = {
            A_LOGIN_BR: authState?.user?.branchCode ?? "",
            A_COMP_CD: authState?.companyID ?? "",
            A_BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
            A_ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
            A_ACCT_CD: dependentFieldValues?.ACCT_CD?.value ?? "",
            A_FD_NO: dependentFieldValues?.FD_NO?.value ?? "",
            A_FLAG: Boolean(formState?.openPayment)
              ? "P"
              : Boolean(formState?.openRenew)
              ? "R"
              : "I",

            A_PRE_RATE: "",
            A_IS_PREMATURE: dependentFieldValues?.IS_PREMATURE?.value ?? "",
            A_SPL_AMT: dependentFieldValues?.SPL_AMT?.value ?? "",
            A_TDS_METHOD: dependentFieldValues?.TDS_METHOD?.value ?? "",
            WORKING_DATE: authState?.workingDate ?? "",
            A_INT_RATE: currentField?.value ?? "",
            A_PAID_DT: dependentFieldValues?.PAID_DT?.value
              ? format(
                  new Date(dependentFieldValues?.PAID_DT?.value),
                  "dd/MMM/yyyy"
                )
              : "",
          };
          const buttonName = await formState?.MessageBox({
            messageTitle: "Confirmation",
            message: "Ason Calculation Required?",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
          });
          if (buttonName === "Yes") {
            reqParameters = { ...reqParameters, A_IS_PREMATURE: "Y" };
          }
          if (buttonName === "No") {
            reqParameters = { ...reqParameters, A_IS_PREMATURE: "N" };
          }
          const postData = await API.getFDPaymentDtl(reqParameters);

          for (const response of postData?.[0]?.MSG ?? []) {
            if (response?.O_STATUS === "999") {
              await formState?.MessageBox({
                messageTitle: "ValidationFailed",
                message: response?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
            } else if (response?.O_STATUS === "9") {
              await formState?.MessageBox({
                messageTitle: "Alert",
                message: response?.O_MESSAGE ?? "",
                icon: "WARNING",
              });
            } else if (response?.O_STATUS === "99") {
              const buttonName = await formState?.MessageBox({
                messageTitle: "Confirmation",
                message: response?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
                defFocusBtnName: "Yes",
              });
              if (buttonName === "No") {
                break;
              }
            } else if (response?.O_STATUS === "0") {
              return Object.keys(postData?.[0] || {}).reduce((acc, key) => {
                if (key !== "INT_RATE_REST") {
                  acc[key] = {
                    value: postData[0][key] ?? "",
                    ignoreUpdate: true,
                  };
                }
                return acc;
              }, {});
            }
          }
          return {};
        }
        return {};
      },
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DISABLE_INT_RATE?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      GridProps: {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_REST",
      label: "",
      dependentFields: ["DISABLE_INT_AMT"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DISABLE_INT_AMT?.value?.trim() === "Y") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_REST_CASH",
      label: "",
      dependentFields: ["INT_REST"],
      runPostValidationHookAlways: true,
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (Number(dependentFieldsValues?.INT_REST?.value) >= 0) {
          if (
            Number(currentField?.value) < 0 ||
            Number(currentField?.value) >
              Number(dependentFieldsValues?.INT_REST?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Invalid Amount",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                INT_REST_CASH: {
                  value: "",
                  ignoreUpdate: true,
                  isFieldFocused: true,
                },
              };
            }
          } else {
            let value =
              Number(dependentFieldsValues?.INT_REST?.value ?? 0) -
              Number(currentField?.value ?? 0);
            return {
              INT_REST_TRF: {
                value: value,
                ignoreUpdate: true,
              },
            };
          }
        } else {
          let value =
            Number(dependentFieldsValues?.INT_REST?.value ?? 0) -
            Number(currentField?.value ?? 0);
          return {
            INT_REST_TRF: {
              value: value,
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_REST_TRF",
      label: "",
      dependentFields: ["INT_REST"],
      runPostValidationHookAlways: true,
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (Number(dependentFieldsValues?.INT_REST?.value) >= 0) {
          if (
            Number(currentField?.value) < 0 ||
            Number(currentField?.value) >
              Number(dependentFieldsValues?.INT_REST?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Invalid Amount",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                INT_REST_TRF: {
                  value: "",
                  ignoreUpdate: true,
                  isFieldFocused: true,
                },
              };
            }
          } else {
            let value =
              Number(dependentFieldsValues?.INT_REST?.value ?? 0) -
              Number(currentField?.value ?? 0);
            return {
              INT_REST_CASH: {
                value: value,
                ignoreUpdate: true,
              },
            };
          }
        } else {
          let value =
            Number(dependentFieldsValues?.INT_REST?.value ?? 0) -
            Number(currentField?.value ?? 0);
          return {
            INT_REST_CASH: {
              value: value,
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_TO_TOTAL",
      label: "",
      dependentFields: ["INT_REST_CASH", "INT_REST_TRF"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.INT_REST_CASH?.value ?? 0) +
          Number(dependentFieldsValues?.INT_REST_TRF?.value ?? 0);
        return value;
      },
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "BALANCE_TYPO",
      label: "Balance :",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_BALANCE_TYPO",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 3.6, sm: 3.6, md: 3.6, lg: 3.6, xl: 3.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "BAL_AMT",
      label: "",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      isReadOnly: true,
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_BAL_AMT",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PAY_CASH",
      label: "",
      dependentFields: ["BAL_AMT"],
      runPostValidationHookAlways: true,
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (Number(dependentFieldsValues?.BAL_AMT?.value) >= 0) {
          if (
            Number(currentField?.value) < 0 ||
            Number(currentField?.value) >
              Number(dependentFieldsValues?.BAL_AMT?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Invalid Amount",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                PAY_CASH: {
                  value: "",
                  ignoreUpdate: true,
                  isFieldFocused: true,
                },
              };
            }
          } else {
            let value =
              Number(dependentFieldsValues?.BAL_AMT?.value ?? 0) -
              Number(currentField?.value ?? 0);
            return {
              PAY_TRF: {
                value: value,
                ignoreUpdate: true,
              },
            };
          }
        } else {
          let value =
            Number(dependentFieldsValues?.BAL_AMT?.value ?? 0) -
            Number(currentField?.value ?? 0);
          return {
            PAY_TRF: {
              value: value,
              ignoreUpdate: true,
            },
          };
        }
      },
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_PAY_CASH",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PAY_TRF",
      label: "",
      dependentFields: ["BAL_AMT"],
      runPostValidationHookAlways: true,
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (Number(dependentFieldsValues?.BAL_AMT?.value) >= 0) {
          if (
            Number(currentField?.value) < 0 ||
            Number(currentField?.value) >
              Number(dependentFieldsValues?.BAL_AMT?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Invalid Amount",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                PAY_TRF: {
                  value: "",
                  ignoreUpdate: true,
                  isFieldFocused: true,
                },
              };
            }
          } else {
            let value =
              Number(dependentFieldsValues?.BAL_AMT?.value ?? 0) -
              Number(currentField?.value ?? 0);
            return {
              PAY_CASH: {
                value: value,
                ignoreUpdate: true,
              },
            };
          }
        }
        return {};
      },
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_PAY_TRF",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "BAL_TOTAL",
      label: "",
      isReadOnly: true,
      dependentFields: ["PAY_CASH", "PAY_TRF"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.PAY_CASH?.value ?? 0) +
          Number(dependentFieldsValues?.PAY_TRF?.value ?? 0);
        return value;
      },
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_BAL_TOTAL",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "TOTAL_AMT_TYPO",
      label: "Total Amt. :",
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "TOKEN_NO_TYPO",
      label: "Token No. :",
      dependentFields: ["CASH_TOTAL"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.CASH_TOTAL?.value)) {
          return false;
        } else {
          return true;
        }
      },
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_TOKEN_NO_TYPO",
      dependentFields: ["CASH_TOTAL"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.CASH_TOTAL?.value)) {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "TOKEN_NO",
      label: "",
      className: "textInputFromRight",
      FormatProps: {
        allowLeadingZeros: false,
        allowNegative: false,
        placeholder: "Enter Token Number",
        isAllowed: (values) => {
          if (values?.value?.length > 10) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["CASH_TOTAL", "ACCT_TYPE", "ACCT_CD", "BRANCH_CD"],
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (
          currentField?.value &&
          dependentFieldsValues?.ACCT_TYPE?.value &&
          dependentFieldsValues?.BRANCH_CD?.value &&
          dependentFieldsValues?.ACCT_CD?.value &&
          dependentFieldsValues?.CASH_TOTAL?.value
        ) {
          let reqParameters = {
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value ?? "",
            ACCT_CD: dependentFieldsValues?.ACCT_CD?.value ?? "",
            TOKEN_NO: currentField?.value ?? "",
            SCREEN_REF: "RPT/401",
          };
          let postData = await checkTokenValidate(reqParameters);

          postData = postData.sort(
            (a, b) => parseInt(b.O_STATUS) - parseInt(a.O_STATUS)
          );

          let btn99, returnVal;

          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.O_STATUS === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "ValidationFailed",
                message: postData[i]?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Confirmation",
                message: postData[i]?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
              });
              btn99 = btnName;
              if (btnName === "No") {
                returnVal = "";
              }
            } else if (postData[i]?.O_STATUS === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Alert",
                  message: postData[i]?.O_MESSAGE ?? "",
                });
              }
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "0") {
              if (btn99 !== "No") {
                returnVal = currentField?.value;
              } else {
                returnVal = "";
              }
            }
          }
          btn99 = 0;
          return {
            TOKEN_NO: {
              value: returnVal ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {
            TOKEN_NO: { value: "", ignoreUpdate: true },
          };
        }
        return {};
      },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.CASH_TOTAL?.value)) {
          return false;
        } else {
          return true;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_TOKEN_NO",
      dependentFields: ["CASH_TOTAL"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.CASH_TOTAL?.value)) {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PROV_AMT",
      label: "",
      isReadOnly: true,
      dependentFields: ["PROV_INT_AMT", "INT_REST", "BAL_AMT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.PROV_INT_AMT?.value ?? 0) +
          Number(dependentFieldsValues?.INT_REST?.value ?? 0) +
          Number(dependentFieldsValues?.BAL_AMT?.value ?? 0);
        return value;
      },
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "CASH_TOTAL",
      label: "",
      isReadOnly: true,
      dependentFields: ["INT_CASH", "INT_REST_CASH", "PAY_CASH"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.INT_CASH?.value ?? 0) +
          Number(dependentFieldsValues?.INT_REST_CASH?.value ?? 0) +
          Number(dependentFieldsValues?.PAY_CASH?.value ?? 0);
        return value;
      },
      runValidationOnDependentFieldsChange: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (Number(currentField?.value) <= 0) {
          return {
            TOKEN_NO: {
              value: "",
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TRANSFER_TOTAL",
      label: "",
      isReadOnly: true,
      dependentFields: ["INT_TRF", "INT_REST_TRF", "PAY_TRF"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.INT_TRF?.value ?? 0) +
          Number(dependentFieldsValues?.INT_REST_TRF?.value ?? 0) +
          Number(dependentFieldsValues?.PAY_TRF?.value ?? 0);
        return value;
      },
      runValidationOnDependentFieldsChange: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (Number(currentField?.value) <= 0) {
          return {
            PAYSLIP: {
              value: false,
              ignoreUpdate: true,
            },
            RTGS_NEFT: {
              value: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowNegative: true,
      },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "FINAL_TOT_AMT",
      label: "",
      isReadOnly: true,
      dependentFields: ["TRANSFER_TOTAL", "CASH_TOTAL"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.TRANSFER_TOTAL?.value ?? 0) +
          Number(dependentFieldsValues?.CASH_TOTAL?.value ?? 0);
        return value;
      },
      fullWidth: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "FD_REM_TYPO",
      label: "FD Remark :",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      fullWidth: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_FD_REM_TYPO",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FD_REMARK",
      label: "",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "intPayment") {
          return true;
        } else {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 },
    },

    {
      render: { componentType: "checkbox" },
      name: "PAYSLIP",
      label: "By Payslip",
      dependentFields: ["TRANSFER_TOTAL", "RTGS_NEFT"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (Number(dependentFieldsValues?.TRANSFER_TOTAL?.value) > 0) {
          return false;
        } else {
          return true;
        }
      },
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (
          Boolean(dependentFieldsValues?.RTGS_NEFT?.value) ||
          formState?.flag === "FDCNF"
        ) {
          return true;
        } else {
          return false;
        }
      },
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        if (Number(dependentFieldsValues?.TRANSFER_TOTAL?.value) <= 0) {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },

    {
      render: { componentType: "checkbox" },
      name: "RTGS_NEFT",
      label: "By NEFT",
      dependentFields: ["TRANSFER_TOTAL", "PAYSLIP"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (Number(dependentFieldsValues?.TRANSFER_TOTAL?.value) > 0) {
          return false;
        } else {
          return true;
        }
      },
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (
          Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
          formState?.flag === "FDCNF"
        ) {
          return true;
        } else {
          return false;
        }
      },
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        if (Number(dependentFieldsValues?.TRANSFER_TOTAL?.value) <= 0) {
          return false;
        }
      },
      fullWidth: true,
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_PAYSLIP",
      dependentFields: ["RTGS_NEFT"],
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (Boolean(dependentFieldsValues?.RTGS_NEFT?.value)) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER_NEFT",
      dependentFields: ["PAYSLIP"],
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (Boolean(dependentFieldsValues?.PAYSLIP?.value)) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_PAID_DT",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_INT_AMT",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_TDS",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TDS_APPLICABLE",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_INT_RATE",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "BRANCH_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_TYPE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FD_NO",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "IS_PREMATURE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TDS_METHOD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SPL_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PRE_RATE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_DT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "MATURITY_DT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "MATURITY_AMT",
    },
  ],
};
