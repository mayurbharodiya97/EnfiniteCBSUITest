import {
  calculateDBRAmount,
  calculateDBRPerc,
  calculateFinalLoanAmt,
  calculateLTVPerc,
  calculateSanInstAmt,
} from "registry/fns/functions/calculation";

export const DBRDetailMetadata = {
  form: {
    name: "dbrDetail",
    label: "DBR Loan Request Check",
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
      name: "PERC_CARD_LIMIT",
    },
    // {
    //   render: {
    //     componentType: "typography",
    //   },
    //   name: "DBRVIEW",
    //   label: "DBR Details | View",
    //   GridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //   },
    // },
    {
      render: {
        componentType: "typography",
      },
      name: "DBRCUSTDTL",
      label: "Customer Loan Request Information",
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
        sm: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LOAN_AMOUNT",
      label: "Applied Loan amount",
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
        sm: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "MONTHLY_INCOME",
      label: "Net Monthly Income (A)",
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
      className: "textInputFromRight",
      name: "LOAN_TENURE",
      label: "Tenor(Month)",
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
      label: "TD Amount (C)",
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
      className: "textInputFromRight",
      name: "INT_RATE",
      label: "Rate of Interest",
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
      name: "TRAN_DT",
      label: "Request Date",
      placeholder: "",
      format: "dd/MM/yyyy HH:mm:ss",
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
      name: "EMI_AMOUNT",
      label: "EMI (B)",
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
        componentType: "amountField",
      },
      name: "DBR_AMT",
      label: "DBR (B/A)",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      dependentFields: ["EMI_AMOUNT", "MONTHLY_INCOME"],
      setValueOnDependentFieldsChange: calculateDBRAmount,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "DBRINFO",
      label: "Loan Request Recommended Information",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SAN_LOAN_AMOUNT",
      label: "Loan Amount (D)",
      placeholder: "",
      defaultValue: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Loan Amount is required."] }],
      },
      dependentFields: ["LOAN_AMOUNT"],
      runValidationOnDependentFieldsChange: true,
      validate: {
        conditions: {
          all: [
            {
              fact: "dependentFields",
              path: "$.LOAN_AMOUNT.value",
              operator: "greaterThanInclusiveString",
              value: { fact: "currentField", path: "$.value" },
            },
          ],
        },
        success: "",
        failure: "Loan Amount is not greaten then Customer loan amount.",
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
      name: "SAN_LOAN_TENURE",
      label: "Tenor(Month)",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Tenor(Month) is required."] }],
      },
      dependentFields: ["LOAN_TENURE"],
      runValidationOnDependentFieldsChange: true,
      validate: {
        conditions: {
          all: [
            {
              fact: "dependentFields",
              path: "$.LOAN_TENURE.value",
              operator: "greaterThanInclusiveString",
              value: { fact: "currentField", path: "$.value" },
            },
          ],
        },
        success: "",
        failure: "Tenure Should be less than or equal to FD tenor.",
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
      name: "SAN_INT_RATE",
      label: "Rate of Interest",
      placeholder: "0.00",
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          if (!(Number.parseFloat(values?.value ?? 0) < 100)) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Rate of Interest is required."] },
        ],
      },
      dependentFields: ["INT_RATE"],
      runValidationOnDependentFieldsChange: true,
      validate: {
        conditions: {
          all: [
            {
              fact: "dependentFields",
              path: "$.INT_RATE.value",
              operator: "lessThanInclusiveString",
              value: { fact: "currentField", path: "$.value" },
            },
          ],
        },
        success: "",
        failure:
          "Rate of Interest Should be greater than or equal to FD Interest Rate.",
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
      label: "Other Loan Inst. (F)",
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
      label: "Credit Card limit (G)",
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
      className: "textInputFromRight",
      name: "DBR_PERC",
      label: "DBR% ((F + 5% of G)/A)*100",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      dependentFields: [
        "OTHER_LOAN_EMI",
        "CC_LIM_AMOUNT",
        "PERC_CARD_LIMIT",
        "MONTHLY_INCOME",
      ],
      setValueOnDependentFieldsChange: calculateDBRPerc,
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
      label: "EMI (E)",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      dependentFields: ["SAN_LOAN_AMOUNT", "SAN_LOAN_TENURE", "SAN_INT_RATE"],
      setValueOnDependentFieldsChange: calculateSanInstAmt,
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
      name: "LTV_PERC",
      label: "LTV% (D/C)",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      dependentFields: ["SAN_LOAN_AMOUNT", "FD_BALANCE"],
      setValueOnDependentFieldsChange: calculateLTVPerc,
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
      name: "FINAL_LOAN_AMT",
      label: "Final Loan Amount (LTV * C)",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      dependentFields: ["SAN_LOAN_AMOUNT", "FD_BALANCE"],
      setValueOnDependentFieldsChange: calculateFinalLoanAmt,
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
      name: "FILE_NAME",
      label: "CIB Attachment",
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
        sm: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DBR_REMARKS",
      label: "Message from DBR",
      placeholder: "DBR Remarks",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Message from DBR is required."] },
        ],
      },
      multiline: true,
      minRows: 2,
      maxRows: 2,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
  ],
};
