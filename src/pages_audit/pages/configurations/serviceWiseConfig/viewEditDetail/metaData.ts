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
  ],
};
