export const ViewMasterMetadata = {
  form: {
    name: "viewmaster",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    allowColumnHiding: true,
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
          spacing: 2,
        },
      },
    },
    componentProps: {
      textField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_VAL",
      label: "BranchCode",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE_VAL",
      label: "AccountType",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "accountCode",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "OP_DATE",
      label: "OpeningDate",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "MASKING_PAN_NO",
      label: "PAN",
      type: "text",
      required: false,
      schemaValidation: {},
      dependentFields: ["FORM_60"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (
          dependentFieldsValues?.FORM_60?.value === "N" ||
          String(dependentFieldsValues?.FORM_60?.value)?.trim() === ""
        ) {
          return false;
        } else {
          return true;
        }
      },
      textFieldStyle: {
        "& .MuiInputBase-input": {
          color: "rgb(255, 0, 0) !important",
          "-webkit-text-fill-color": "rgb(255, 0, 0) !important",
        },
      },
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "FORM_60",
      fullWidth: true,
      label: "",
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (
          currentField?.value === "N" ||
          String(currentField?.value)?.trim() === ""
        ) {
          return true;
        } else {
          return false;
        }
      },
      textFieldStyle: {
        "& .MuiInputBase-input": {
          color: "rgb(255, 0, 0) !important",
          "-webkit-text-fill-color": "rgb(255, 0, 0) !important",
        },
      },
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "BIRTH_DT",
      label: "BirthDate",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "MODE_VAL",
      label: "Mode",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CATEGORY_VAL",
      label: "Category",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "ShadowBalance",
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Address1",
      type: "text",
      GridProps: { xs: 12, sm: 4.5, md: 3, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Address2",
      type: "text",
      GridProps: { xs: 12, sm: 4.5, md: 3, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "AREA_NM",
      label: "Area",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CITY_NM",
      label: "City",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER1",
      GridProps: {
        xs: 0,
        sm: 0,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "PIN_CODE",
      label: "PinCode",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "MASKING_CONTACT1",
      label: "phone",
      type: "text",
      GridProps: { xs: 12, sm: 2.4, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "MASKING_CONTACT2",
      label: "MobileNo",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER2",
      GridProps: {
        xs: 0,
        sm: 0,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "TDS_DEDUCT_FLAG",
      label: "ExplicitDeductTDS",
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          color: "rgb(168, 0, 0) !important",
          "-webkit-text-fill-color": "rgb(168, 0, 0) !important",
        },
      },
      GridProps: { xs: 12, sm: 2.8, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "CONF_BAL",
      label: "CurBalance",
      GridProps: {
        xs: 12,
        sm: 2.8,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "FIN_INT_AMT",
      label: "FinancialInterestAmount",
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "FIN_TDS",
      label: "TDSDeductedCurrentFinancialYear",
      type: "text",
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "LIABLE",
      label: "TDSLiableTaxable",
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          color: "rgb(168, 0, 0) !important",
          "-webkit-text-fill-color": "rgb(168, 0, 0) !important",
        },
      },
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remark",
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          color: "rgb(168, 0, 0) !important",
          "-webkit-text-fill-color": "rgb(168, 0, 0) !important",
        },
      },
      GridProps: { xs: 12, sm: 6, md: 5, lg: 5, xl: 5 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "TDSExemFormDtl",
      label: "TDSExemptionFormDetail",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "FORM_NM",
      label: "FormName",
      type: "text",
      GridProps: { xs: 12, sm: 3.5, md: 3, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "TDS_EXEMPTION_DT",
      label: "TillDate",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 12, sm: 3.5, md: 2, lg: 1.7, xl: 1.7 },
    },
  ],
};