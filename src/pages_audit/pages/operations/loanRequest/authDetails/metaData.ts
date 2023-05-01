export const AUTHDetailMetadata = {
  form: {
    name: "authDetail",
    label: "Loan Approval Detail",
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
        componentType: "typography",
      },
      name: "AUTHVIEW",
      label: "Loan Approval Request Details",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "APPLICANT_NM",
      label: "Applicant Name",
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
      name: "FILE_NO",
      label: "File Reference No.",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "FD_BALANCE",
      label: "Security Value/TD Amount",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "FD_ACCOUNT",
      label: "TD Account Number",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "PROFESSION",
      label: "Profession",
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
      name: "EMI_ACCOUNT",
      label: "Account for Encash EMI",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "DBR_USER_ID",
      label: "Assessed by/DBR ID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "DBR_NAME",
      label: "Assessed by/DBR Name",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "DBR_ENTERED_DATE",
      label: "Assessed Date",
      placeholder: "",
      //type: "date",
      format: "dd/MM/yyyy HH:mm",
      isReadOnly: true,
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
      name: "SAN_LOAN_AMOUNT",
      label: "Loan Amount",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "LTV_PERC",
      label: "LTV%",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "MONTHLY_INCOME",
      label: "Net Monthly Income",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "APPCUSTOMER_ID",
      label: "Customer ID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "LOAN_TENURE",
      label: "Tenor",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      FormatProps: {
        format: "####",
      },
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
      name: "OTHER_LOAN_EMI",
      label: "Other Loan Installment",
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
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "Rate of Interest",
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
      name: "CC_LIM_AMOUNT",
      label: "Credit Card limit",
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
      name: "SAN_INST_AMT",
      label: "EMI",
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
      name: "DBR_AMT",
      label: "DBR",
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
      name: "SOL_ID",
      label: "SOL ID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "FINAL_LOAN_AMOUNT",
      label: "Final Loan Amount",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "CIB_STATUS",
      label: "CIB Status",
      placeholder: "",
      type: "text",
      isReadOnly: true,
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
      name: "CIB_REMARKS",
      label: "CIB Remarks",
      placeholder: "",
      multiline: true,
      isReadOnly: true,
      minRows: 2,
      maxRows: 2,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DBR_REMARKS",
      label: "Message from DBR",
      placeholder: "DBR Remarks",
      multiline: true,
      isReadOnly: true,
      minRows: 2,
      maxRows: 2,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "AUTH_REMARKS",
      label: "Message From Approval",
      placeholder: "Message From Approval",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Message From Approval is required."] },
        ],
      },
      multiline: true,
      minRows: 2,
      maxRows: 2,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 4,
      },
    },
  ],
};
