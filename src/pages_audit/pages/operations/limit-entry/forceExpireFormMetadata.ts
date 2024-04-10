export const forceExpireMetaData = {
  form: {
    name: "limit-force-exp",
    label: "Force-Expire Limit",
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
      name: "TRAN_CD",
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "Limit Amount",
      isReadOnly: true,
      // textFieldStyle: {
      //   "& .MuiInputBase-input": {
      //     textAlign: "right",
      //     background: "var(--theme-color7)",
      //   },
      //   // "& .MuiInputLabel-formControl": {
      //   //   right: "0",
      //   //   left: "auto",
      //   // },
      // },
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
      name: "SECURITY_CD",
      label: "Security Code",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "SECURITY",
    //   label: "Security ",
    //   isReadOnly: true,
    //   GridProps: {
    //     xs: 12,
    //     md: 3,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "FD_BRANCH_CD",
      label: "FD-Branch Code",
      // textFieldStyle: {
      //   "& .MuiInputBase-input": {
      //     textAlign: "right",
      //     background: "var(--theme-color7)",
      //   },
      //   // "& .MuiInputLabel-formControl": {
      //   //   right: "0",
      //   //   left: "auto",
      //   // },
      // },
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
      name: "FD_TYPE",
      label: "FD-Type",
      // textFieldStyle: {
      //   "& .MuiInputBase-input": {
      //     textAlign: "right",
      //     background: "var(--theme-color7)",
      //   },
      //   // "& .MuiInputLabel-formControl": {
      //   //   right: "0",
      //   //   left: "auto",
      //   // },
      // },
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
      name: "FD_ACCT_CD",
      label: "FD-Account No",
      isReadOnly: true,
      // textFieldStyle: {
      //   "& .MuiInputBase-input": {
      //     textAlign: "right",
      //     background: "var(--theme-color7)",
      //   },
      //   "& .MuiInputLabel-formControl": {
      //     right: "0",
      //     left: "auto",
      //   },
      // },
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
      name: "FD_NO",
      label: "FD Number",
      isReadOnly: true,
      // textFieldStyle: {
      //   "& .MuiInputBase-input": {
      //     textAlign: "right",
      //     background: "var(--theme-color7)",
      //   },
      //   // "& .MuiInputLabel-formControl": {
      //   //   right: "0",
      //   //   left: "auto",
      //   // },
      // },
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
        componentType: "datePicker",
      },
      name: "ENTRY_DT",
      label: "Entry Date",
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
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Effective Date",
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
        componentType: "datePicker",
      },
      name: "EXPIRY_DT",
      label: "Expiry Date",
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
      name: "SECURITY_VALUE",
      label: "Security Value",
      isReadOnly: true,
      // textFieldStyle: {
      //   "& .MuiInputBase-input": {
      //     textAlign: "right",
      //     background: "var(--theme-color7)",
      //   },
      //   // "& .MuiInputLabel-formControl": {
      //   //   right: "0",
      //   //   left: "auto",
      //   // },
      // },
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
      name: "SECURITY",
      label: "Security Description",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "MARGIN",
      label: "Margin",
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
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "Int. Rate",
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
        componentType: "rateOfInt",
      },
      name: "PENAL_RATE",
      label: "Penal Rate",
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
      name: "DRAWING_POWER",
      label: "Drawing Power",
      defaultValue: "0",
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
      name: "REMARKS",
      label: "Remarks",
      placeholder: "Enter Remarks",
      dependentFields: ["ALLOW_FORCE_EXP"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.ALLOW_FORCE_EXP?.value === "Y") {
          return false;
        } else {
          return true;
        }
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "RESOLUTION_DATE",
      label: "Resolution Date",
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
        componentType: "datePicker",
      },
      name: "FORCE_EXP_DT",
      label: "Forced Expired Date",
      placeholder: "Forced Expired Date",
      dependentFields: ["ALLOW_FORCE_EXP"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.ALLOW_FORCE_EXP?.value === "Y") {
          return false;
        } else {
          return true;
        }
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Force Expired Date is required."] },
        ],
      },
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
        componentType: "hidden",
      },
      name: "ALLOW_FORCE_EXP",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "EXPIRED_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FORCE_EXP_VERIFIED_BY",
    },
  ],
};
