import { utilFunction } from "components/utils";
import * as API from "../../api";

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

// FD Payment form metadata
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
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_CASH",
      label: "",
      dependentFields: ["PROV_INT_AMT", "INT_TRF"],
      // setValueOnDependentFieldsChange: (dependentFieldsValues) => {
      //   let value =
      //     Number(dependentFieldsValues?.PROV_INT_AMT?.value ?? 0) -
      //     Number(dependentFieldsValues?.INT_TRF?.value ?? 0);
      //   return Boolean(dependentFieldsValues?.INT_TRF?.value?.trim())
      //     ? value
      //     : "0";
      // },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_TRF",
      label: "",
      dependentFields: ["PROV_INT_AMT", "INT_CASH"],
      // setValueOnDependentFieldsChange: (dependentFieldsValues) => {
      //   let value =
      //     Number(dependentFieldsValues?.PROV_INT_AMT?.value ?? 0) -
      //     Number(dependentFieldsValues?.INT_CASH?.value ?? 0);
      //   return Boolean(dependentFieldsValues?.INT_CASH?.value?.trim())
      //     ? value
      //     : "0";
      // },
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
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_PAID_DT",
    },

    {
      render: {
        componentType: "textField",
      },
      name: "AFT_MAT_INT_TYPE",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "MAT_INT_RATE",
      label: "Mat Int Rate :",
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
      name: "AFT_MAT_INT_RATE",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "AFT_MAT_INT_AMT",
      label: "",
      isReadOnly: true,
      fullWidth: true,
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
      dependentFields: ["DISABLE_PAID_DT"],
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
      dependentFields: ["DISABLE_INT_RATE"],
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
        componentType: "hidden",
      },
      name: "DISABLE_INT_RATE",
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
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_INT_AMT",
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_REST_CASH",
      label: "",
      dependentFields: ["INT_REST_TRF", "INT_REST"],
      // setValueOnDependentFieldsChange: (dependentFieldsValues) => {
      //   let value =
      //     Number(dependentFieldsValues?.INT_REST?.value ?? 0) -
      //     Number(dependentFieldsValues?.INT_REST_TRF?.value ?? 0);
      //   return Boolean(dependentFieldsValues?.INT_REST_TRF?.value?.trim())
      //     ? value
      //     : "0";
      // },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_REST_TRF",
      label: "",
      dependentFields: ["INT_REST_CASH", "INT_REST"],
      // setValueOnDependentFieldsChange: (dependentFieldsValues) => {
      //   let value =
      //     Number(dependentFieldsValues?.INT_REST?.value ?? 0) -
      //     Number(dependentFieldsValues?.INT_REST_CASH?.value ?? 0);
      //   return Boolean(dependentFieldsValues?.INT_REST_CASH?.value?.trim())
      //     ? value
      //     : "0";
      // },
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
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "BALANCE_TYPO",
      label: "Balance :",
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
      render: { componentType: "checkbox" },
      name: "PAYSLIP",
      label: "By Payslip",
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: { componentType: "checkbox" },
      name: "RTGS_NEFT",
      label: "By NEFT",
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "BAL_AMT",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PAY_CASH",
      label: "",
      dependentFields: ["PAY_TRF", "BAL_AMT"],
      // setValueOnDependentFieldsChange: (dependentFieldsValues) => {
      //   let value =
      //     Number(dependentFieldsValues?.BAL_AMT?.value ?? 0) -
      //     Number(dependentFieldsValues?.PAY_TRF?.value ?? 0);
      //   return Boolean(dependentFieldsValues?.PAY_TRF?.value?.trim())
      //     ? value
      //     : "0";
      // },
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PAY_TRF",
      label: "",
      dependentFields: ["PAY_CASH", "BAL_AMT"],
      // setValueOnDependentFieldsChange: (dependentFieldsValues) => {
      //   let value =
      //     Number(dependentFieldsValues?.BAL_AMT?.value ?? 0) -
      //     Number(dependentFieldsValues?.PAY_CASH?.value ?? 0);
      //   return Boolean(dependentFieldsValues?.PAY_CASH?.value?.trim())
      //     ? value
      //     : "0";
      // },
      fullWidth: true,
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
      fullWidth: true,
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
        componentType: "textField",
      },
      name: "SCROLL_NO",
      label: "",
      isReadOnly: true,
      fullWidth: true,
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
      GridProps: { xs: 1.6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_TOT_AMT",
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
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_AMT_TT",
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
      fullWidth: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_AMT_TOTAL",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 1.8, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "FD_REM_TYPO",
      label: "FD Remark :",
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
        componentType: "textField",
      },
      name: "FD_REMARK",
      label: "",
      fullWidth: true,
      GridProps: { xs: 11, sm: 11, md: 11, lg: 11, xl: 11 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_TDS",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "TDS_APPLICABLE",
    },
  ],
};
