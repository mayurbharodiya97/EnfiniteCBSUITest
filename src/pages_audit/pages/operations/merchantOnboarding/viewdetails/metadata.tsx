export const MerchantOnboardingMetadata = {
  form: {
    name: "merchantOnboarding",
    label: "Merchant Onboarding Configuration",
    resetFieldOnUmnount: false,
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
        componentType: "select",
      },
      name: "MERCHANT_ID_DISP",
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
        componentType: "select",
      },
      name: "TERMINAL_ID_DISP",
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
        componentType: "textField",
      },
      name: "PID",
      label: "Gateway Username",
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
      name: "PID_KEY",
      label: "Gateway Password",
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
      name: "TO_EMAIL",
      label: "Gateway Email",
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
      name: "TRAN_LIMIT",
      label: "Per Transaction Limit",
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
      name: "VAT_PER",
      label: "Percentage of VAT",
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
      name: "TO_ACCT_NO",
      label: "To Account Number",
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
      name: "URL_PATH",
      label: "URL",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 5,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "ACTIVE",
      label: "Active",
      __EDIT__: { render: { componentType: "checkbox" } },
      GridProps: { xs: 10, md: 10, sm: 1 },
    },
  ],
};
