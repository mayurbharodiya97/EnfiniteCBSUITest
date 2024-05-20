export const stopPayconfirmFormMetaData = {
  form: {
    name: "stopPay-confirmation-form",
    label: "ConfirmationDetail",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    hideHeader: true,
    render: {
      ordering: "auto",
      // ordering: "sequence",
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
          height: "35vh",
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
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Balance",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "FLAG",
      label: "ChequeStopType",
      defaultValue: "P",
      placeholder: "Select one",
      options: () => {
        return [
          { value: "P", label: "Stop Payment" },
          { value: "S", label: "Surrender Cheque" },
          { value: "D", label: "PDC" },
        ];
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "IntimateDate",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "S") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "SURR_DT",
      label: "SurrenderDate",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "S") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_FROM",
      label: "FromChequeNo",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_TO",
      label: "ToChequeNo",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REASON_CD",
      label: "Reason",
      GridProps: {
        xs: 12,
        md: 4.8,
        sm: 4.8,
        lg: 4.8,
        xl: 4.8,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_TAX",
      label: "ChargeAmount",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "P") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "GSTAmount",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "P") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "ChequeDate",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "CHEQUE_AMOUNT",
      label: "ChequeAmount",
      placeholder: "ChequeAmount",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "S") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "Enter Remarks",
      GridProps: {
        xs: 12,
        md: 4.8,
        sm: 4.8,
        lg: 4.8,
        xl: 4.8,
      },
    },
  ],
};
