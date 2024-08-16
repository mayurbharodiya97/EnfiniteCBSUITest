export const forceExpireStockMetaData = {
  form: {
    name: "stock-force-exp",
    label: "ForceExpStock",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    hideHeader: true,
    formStyle: {
      background: "white",
      height: "calc(100vh - 390px)",
      overflowY: "auto",
      overflowX: "hidden",
    },
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
        componentType: "hidden",
      },
      name: "BRANCH_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_TYPE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_NM",
    },

    {
      render: {
        componentType: "textField",
      },
      name: "TRAN_BAL",
      label: "Balance",
      isReadOnly: true,
      fullWidth: true,
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
      name: "ACCT_MST_LIMIT",
      fullWidth: true,
      label: "AccountLimitAmt",
      isReadOnly: true,
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
      fullWidth: true,
      name: "SECURITY_CD",
      label: "Security",
      isReadOnly: true,
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
      fullWidth: true,
      name: "TRAN_DT",
      isReadOnly: true,
      label: "StatementDate",
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
      name: "ASON_DT",
      fullWidth: true,
      isReadOnly: true,
      label: "StatementValidTillDate",
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
      name: "SCRIPT_CD",
      fullWidth: true,
      label: "Script",
      isReadOnly: true,
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
      name: "NO_OF_SHARE",
      fullWidth: true,
      label: "NoOfShare",
      isReadOnly: true,
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
      name: "STOCK_VALUE",
      fullWidth: true,
      label: "StockValue",
      isReadOnly: true,
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
        componentType: "rateOfInt",
      },
      name: "MARGIN",
      fullWidth: true,
      label: "Margin%",
      dependentFields: ["PARENT_TYPE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const newValue = dependentFields.PARENT_TYPE.value.trim();
        if (newValue === "SOD") {
          return 100;
        }
      },
      isReadOnly: true,
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
      name: "RECEIVED_DT",
      label: "RecievedDate",
      fullWidth: true,
      isReadOnly: true,
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
      name: "STOCK_DESC",
      label: "StockDescription",
      // defaultValue: "STOCK FORCEFULLY EXPIRED",

      dependentFields: ["PARENT_TYPE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const newValue = dependentFields.PARENT_TYPE.value.trim();
        if (newValue !== "SOD") {
          return "STOCK FORCEFULLY EXPIRED";
        }
      },
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 3.2,
        sm: 3.2,
        lg: 3.2,
        xl: 3.2,
      },
    },
    {
      render: {
        componentType: "Remark",
      },
      name: "REMARKS",
      fullWidth: true,
      label: "Remarks",
      type: "text",
      placeholder: "Enter Remarks",
      GridProps: {
        xs: 12,
        md: 3.2,
        sm: 3.2,
        lg: 3.2,
        xl: 3.2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      fullWidth: true,
      name: "DRAWING_POWER",
      label: "DrawingPower",
      DefaultValue: "0",
      dependentFields: ["PARENT_TYPE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        // const newValue = dependentFields.PARENT_TYPE.value.trim();
        // if (newValue === "SOD") {
        // }
        return 0;
      },
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3.2,
        sm: 3.2,
        lg: 3.2,
        xl: 3.2,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "WITHDRAW_DT",
      label: "ExpireDate",
      isWorkingDate: true,
      fullWidth: true,
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
        componentType: "hidden",
      },
      name: "PARENT_TYPE",
    },
  ],
};
