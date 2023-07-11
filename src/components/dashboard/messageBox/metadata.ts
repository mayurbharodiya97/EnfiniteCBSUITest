export const MessageDescriptionMetadata = {
  form: {
    name: "MessageDescriptionMetadata",
    // label: "MessageBox Description",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
        componentType: "textField",
      },
      name: "C_TYPE",
      label: "CircularType",
      placeholder: "",
      defaultValue: "",
      isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "IDENTITY_NO",
      label: "No",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",

      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "EFFECTIVE_DT",
      label: "OpenDate",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",

      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ENTERED_DATE",
      label: "ExpiryDate",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",

      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },

    // {
    //   render: {
    //     componentType: "datePicker",
    //   },
    //   name: "ENTERED_DATE",
    //   label: "ExpiryDate",
    //   placeholder: "",
    //   fullWidth: true,
    //   format: "dd/MM/yyyy",

    //   GridProps: {
    //     xs: 12,
    //     md: 6,
    //     sm: 6,
    //   },
    // },

    {
      render: {
        componentType: "textField",
      },
      name: "PID_DESCRIPTION",
      label: "Purpose",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      __EDIT__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    // {
    //   render: { componentType: "checkbox" },
    //   name: "ACTIVE",
    //   label: "Active",
    //   // defaultValue: true,
    //   GridProps: { xs: 12, md: 4, sm: 4 },
    //   // __EDIT__: { render: { componentType: "checkbox" } },
    // },
    // {
    //   render: { componentType: "checkbox" },
    //   name: "SMTP_PASS_AUTH",
    //   label: "PassAuth",
    //   defaultValue: true,
    //   GridProps: { xs: 12, md: 3, sm: 3 },
    //   // __EDIT__: { render: { componentType: "checkbox" } },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "DAILY_AMT",
    //   label: "DailyLimit",
    //   placeholder: "",
    //   type: "text",
    //   required: true,
    //   // validate: "getValidateValue",
    //   GridProps: {
    //     xs: 12,
    //     md: 4,
    //     sm: 4,
    //   },
    // },
    // {
    //   render: {
    //     componentType: "numberFormat",
    //   },
    //   className: "textInputFromRight",
    //   name: "VAT_PER",
    //   label: "VATPercentage",
    //   placeholder: "",
    //   type: "text",
    //   GridProps: {
    //     xs: 12,
    //     md: 4,
    //     sm: 4,
    //   },
    //   maxLength: 3,
    //   showMaxLength: false,
    //   required: true,
    //   // validate: "getValidateValue",
    //   FormatProps: {
    //     allowNegative: false,
    //     allowLeadingZeros: true,
    //     decimalScale: 0,
    //     isAllowed: (values) => {
    //       if (values?.value?.length > 3) {
    //         return false;
    //       }
    //       if (values?.value > 100) {
    //         return false;
    //       }
    //       return true;
    //     },
    //   },
    // },
    // {
    //   render: {
    //     componentType: "numberFormat",
    //   },
    //   className: "textInputFromRight",
    //   name: "COOL_PERIOD",
    //   label: "CoolDownPeriodInMinute",
    //   placeholder: "0.00",
    //   FormatProps: {
    //     allowNegative: false,
    //     allowLeadingZeros: false,
    //     decimalScale: 2,
    //     isAllowed: (values) => {
    //       if (values?.value?.length > 4) {
    //         return false;
    //       }
    //       if (values.floatValue === 0) {
    //         return false;
    //       }
    //       return true;
    //     },
    //   },
    //   GridProps: {
    //     xs: 12,
    //     md: 4,
    //     sm: 4,
    //   },
    // },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "VERSION_NO",
    //   label: "Version",
    //   placeholder: "",
    //   type: "text",
    //   fullWidth: true,
    //   required: true,

    //   GridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //   },
    //   __EDIT__: { isReadOnly: true },
    // },
    // {
    //   render: {
    //     componentType: "select",
    //   },
    //   name: "TRAN_TIME",
    //   label: "Execution",
    //   placeholder: "",
    //   // defaultValue: "A",
    //   defaultOptionLabel: "Execution",
    //   options: [
    //     { label: "24/7/365", value: "24" },
    //     { label: "Working Days", value: "W" },
    //     { label: "All Days", value: "A" },
    //   ],
    //   _optionsKey: "GetExecution",
    //   // required: true,
    //   //validate: "getValidateValue",
    //   // schemaValidation: {
    //   //   type: "string",
    //   //   rules: [
    //   //     { name: "required", params: ["Execution is required."] },
    //   //     { name: "CIB_STATUS", params: ["Please select Execution."] },
    //   //   ],
    //   // },
    //   GridProps: {
    //     xs: 12,
    //     md: 4,
    //     sm: 4,
    //   },
    // },
    // {
    //   render: {
    //     componentType: "select",
    //   },
    //   name: "CHANNEL",
    //   label: "channel",
    //   placeholder: "Select",
    //   defaultOptionLabel: "Channel",
    //   options: [
    //     { label: "Internet Banking", value: "I" },
    //     { label: "Mobile Banking", value: "M" },
    //   ],
    //   GridProps: { xs: 10, md: 10, sm: 4 },
    // },
    // {
    //   render: {
    //     componentType: "checkbox",
    //   },
    //   name: "IS_BANGLA_QR",
    //   label: "Allow Bangla QR",
    //   GridProps: { xs: 12, md: 3, sm: 3 },
    // },
  ],
};
