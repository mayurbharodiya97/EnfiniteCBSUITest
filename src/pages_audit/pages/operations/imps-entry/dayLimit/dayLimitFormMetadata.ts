export const dayLimitFormMetaData = {
  form: {
    name: "day-limit-metadata",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
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
          spacing: 1,
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
      render: { componentType: "datetimePicker" },
      name: "EFF_DATE",
      type: "date",
      label: "Effective Date",
      format: "dd/MM/yyyy HH:mm:ss",
      required: true,
      isReadOnly: true,
      isWorkingDate: true,
      GridProps: { xs: 12, md: 2.5, sm: 2.5, lg: 2.5, xl: 2.5 },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This field is required"] }],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      isReadOnly: true,
      label: "BranchCode",
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      isReadOnly: true,
      label: "AccountType",
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      label: "AccountNumber",
      name: "ACCT_CD",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      label: "AccountName",
      name: "ACCT_NM",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 5.5,
        sm: 5.5,
        lg: 5.5,
        xl: 5.5,
      },
    },
    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "IFT",
      label: "IFT",
      defaultValue: false,
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },

    {
      render: { componentType: "amountField" },
      name: "PERDAY_IFT_LIMIT",
      type: "text",
      label: "IFT/Daily Limit",
      dependentFields: ["IFT"],
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      // required: true,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["This field is required"] }],
      // },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["IFT"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "IFT_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["IFT"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["IFT"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },
    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "RTGS",
      label: "RTGS",
      defaultValue: false,

      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_RTGS_LIMIT",
      type: "text",
      label: "RTGS/Day Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["RTGS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["RTGS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "RTGS_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["RTGS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["RTGS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },
    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "NEFT",
      label: "NEFT",
      defaultValue: false,
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_NEFT_LIMIT",
      type: "text",
      label: "NEFT/Day Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["NEFT"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["NEFT"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "NEFT_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["NEFT"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["NEFT"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },

    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "OWN_ACT",
      label: "Own A/c",
      defaultValue: false,
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_OWN_LIMIT",
      type: "text",
      label: "OWN/Day Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["OWN_ACT"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["OWN_ACT"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "OWN_ACT_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["OWN_ACT"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["OWN_ACT"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },

    // {
    //   render: {
    //     componentType: "spacer",
    //   },
    //   name: "SPACER_ST",
    //   GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
    // },

    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "BBPS",
      label: "BBPS",
      defaultValue: false,
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_BBPS_LIMIT",
      type: "text",
      label: "BBPS/Day Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["BBPS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["BBPS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "BBPS_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      label: " ",
      dependentFields: ["BBPS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["BBPS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },
    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "PG_TRN",
      defaultValue: false,
      label: "Payment Gateway",
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_PG_AMT",
      type: "text",
      label: "P.Gateway/Daily Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["PG_TRN"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["PG_TRN"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "PG_TRN_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["PG_TRN"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["PG_TRN"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },

    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "ATM",
      defaultValue: false,
      label: "ATM",
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_ATM_LIMIT",
      type: "text",
      label: "ATM/Daily Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["ATM"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["ATM"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "ATM_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["ATM"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["ATM"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },

    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "POS",
      defaultValue: false,
      label: "POS",
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_POS_LIMIT",
      type: "text",
      label: "POS/Daily Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["POS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["POS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "POS_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["POS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["POS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },

    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "ECOM",
      defaultValue: false,
      label: "ECOM",
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_ECOM_LIMIT",
      type: "text",
      label: "ECOM/Daily Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["ECOM"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["ECOM"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "ECOM_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["ECOM"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["ECOM"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },

    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "UPI",
      defaultValue: false,
      label: "UPI",
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_UPI_LIMIT",
      type: "text",
      label: "UPI/Daily Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["UPI"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["UPI"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "UPI_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["UPI"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["UPI"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },
    {
      render: { componentType: "checkbox" },
      type: "checkbox",
      name: "IMPS",
      label: "IMPS",
      defaultValue: false,
      GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_P2P_LIMIT",
      type: "text",
      label: "IMPS P2P Day Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["IMPS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["IMPS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "IMPS_LIMIT_SPACER",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["IMPS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["IMPS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },
    {
      render: { componentType: "amountField" },
      name: "PERDAY_P2A_LIMIT",
      type: "text",
      label: "IMPR P2A Day Limit",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      FormatProps: {
        thousandSeparator: false,
        thousandsGroupStyle: "",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["IMPS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["IMPS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "IMPS_LIMIT_SPACER2",
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
      defaultValue: "",
      dependentFields: ["IMPS"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        const dependentValue = dependentFieldsValues?.["IMPS"]?.value
          .toString()
          .trim();
        if (dependentValue === "Y" || dependentValue === "true") {
          return true;
        }
        return false;
      },
    },
  ],
};
