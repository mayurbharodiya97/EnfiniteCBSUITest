export const ServiceWiseConfigMetadata = {
  form: {
    name: "serviceConfig",
    label: "Service Wise Configuration",
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
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRN_TYPE",
    },
    // {
    //   render: {
    //     componentType: "typography",
    //   },
    //   name: "AUTHVIEW",
    //   label: "Loan Approval Request Details",
    //   GridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //   },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      placeholder: "",
      type: "text",
      required: true,
      validate: "getValidateValue",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "DAILY_AMT",
      label: "Daily Limit",
      placeholder: "",
      type: "text",
      required: true,
      validate: "getValidateValue",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "WEEKLY_AMT",
      label: "Weekly Limit",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      dependentFields: ["DAILY_AMT"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields) => {
        if (
          Number(dependentFields?.DAILY_AMT?.value) >
          Number(currentField?.value)
        ) {
          return "Weekly Limit should greater than or equal to Daily Limit";
        } else {
          return "";
        }
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "MONTHLY_AMT",
      label: "Monthly Limit",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      dependentFields: ["DAILY_AMT", "WEEKLY_AMT"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields) => {
        if (
          Number(dependentFields?.DAILY_AMT?.value) >
          Number(currentField?.value)
        ) {
          return "Monthly Limit should greater than or equal to Daily Limit";
        } else if (
          Number(dependentFields?.WEEKLY_AMT?.value) >
          Number(currentField?.value)
        ) {
          return "Monthly Limit should greater than or equal to Weekly Limit";
        } else {
          return "";
        }
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "MIN_AMT",
      label: "Minimum Amount",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      required: true,
      validate: "getValidateValue",
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "MAX_AMT",
      label: "Maximum Amount",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      runValidationOnDependentFieldsChange: true,
      dependentFields: ["MIN_AMT"],
      validate: (currentField, dependentFields) => {
        if (!currentField?.value) {
          return "This field is required";
        } else if (
          Number(dependentFields?.MIN_AMT?.value) > Number(currentField?.value)
        ) {
          return "Maximum Amount should greater than or equal to Minimum Amount";
        } else {
          return "";
        }
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CARD_MIN_AMT",
      label: "Card Minimum Amount",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      required: true,
      validate: "getValidateValue",
    },
    {
      render: {
        componentType: "select",
      },
      name: "TRAN_TIME",
      label: "Execution",
      placeholder: "",
      defaultValue: "",
      options: [
        { label: "24/7/365", value: "24" },
        { label: "Working Days", value: "W" },
        { label: "All Days", value: "A" },
      ],
      required: true,
      //validate: "getValidateValue",
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Execution is required."] },
          { name: "CIB_STATUS", params: ["Please select Execution."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "timePicker",
      },
      name: "START_TIME",
      label: "Start Time",
      placeholder: "",
      format: "HH:mm",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      runValidationOnDependentFieldsChange: true,
      dependentFields: ["TRAN_TIME"],
      validate: (currentField, dependentFields) => {
        if (
          dependentFields?.TRAN_TIME?.value !== "24" &&
          !currentField?.value
        ) {
          return "This field is required";
        } else {
          return "";
        }
      },
    },
    {
      render: {
        componentType: "timePicker",
      },
      name: "END_TIME",
      label: "End Time",
      placeholder: "",
      format: "HH:mm",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      runValidationOnDependentFieldsChange: true,
      dependentFields: ["TRAN_TIME", "START_TIME"],
      validate: (currentField, dependentFields) => {
        if (
          dependentFields?.TRAN_TIME?.value !== "24" &&
          !currentField?.value
        ) {
          return "This field is required";
        } else if (
          dependentFields?.TRAN_TIME?.value !== "24" &&
          new Date(dependentFields?.START_TIME?.value).getTime() >=
            new Date(currentField?.value).getTime()
        ) {
          return "End Time should greater than Start Time";
        } else {
          return "";
        }
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromRight",
      name: "VAT_PER",
      label: "VAT Percentage",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      maxLength: 3,
      showMaxLength: false,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          if (values?.value > 100) {
            return false;
          }
          return true;
        },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MERCHANT_ID",
      label: "Merchant ID",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TERMINAL_ID",
      label: "Terminal ID",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "WEEK_START",
      label: "Working Day Start From",
      placeholder: "",
      defaultValue: "",
      options: [
        { label: "Sunday", value: "sunday" },
        { label: "Monday", value: "monday" },
        { label: "Tuesday", value: "tuesday" },
        { label: "Wednesday", value: "wednesday" },
        { label: "Thursday", value: "thursday" },
        { label: "Friday", value: "friday" },
        { label: "Saturday", value: "saturday" },
      ],
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
      required: true,
      validate: "getValidateValue",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromRight",
      name: "COOL_PERIOD",
      label: "Cool Down Period (In Minute)",
      placeholder: "0.00",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 4) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromRight",
      name: "MAX_DAY_CNT",
      label: "Max Daily Count",
      placeholder: "0.00",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
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
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromRight",
      name: "MAX_MONTH_CNT",
      label: "Max Monthly Count",
      placeholder: "0.00",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
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
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_BY",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_DATE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "MACHINE_NM",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LAST_ENTERED_BY",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LAST_MODIFIED_DATE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LAST_MACHINE_NM",
    },
  ],
};
