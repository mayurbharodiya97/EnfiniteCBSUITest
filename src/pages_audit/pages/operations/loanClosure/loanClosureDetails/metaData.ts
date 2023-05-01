export const loanClosureDetailMetadata = {
  form: {
    name: "loanClsDetail",
    label: "Loan Closure Request",
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
    // {
    //   render: {
    //     componentType: "typography",
    //   },
    //   name: "CIBVIEW",
    //   label: "CIB Calculation | View",
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
      name: "USER_ID",
      label: "User ID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "APPLICANT_NM",
      label: "Customer Name",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "TRAN_DT",
      label: "Closure Date",
      placeholder: "",
      //type: "text",
      format: "dd/MM/yyyy",
      isReadOnly: true,
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
      name: "LOAN_ACCT_CD",
      label: "Loan Account",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "FROM_ACCT_NO",
      label: "Credit Account",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Loan amount",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "OUTSTANDING",
      label: "Outstanding",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CLOSURE_FEE",
      label: "Closing Fee",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "VAT",
      label: "VAT",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_AMT",
      label: "TOTAL AMOUNT",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
  ],
};
