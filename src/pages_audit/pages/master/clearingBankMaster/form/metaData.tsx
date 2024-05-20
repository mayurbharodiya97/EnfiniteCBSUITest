export const ClearingBankMstFormMetaData = {
  form: {
    name: "clearingBankMaster",
    label: "Clearing Bank Master",
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
      checkbox: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "RBI_CD",
      label: "RBI Code",
      placeholder: "Enter RBI Code",
      maxLength: 10,
      required: true,
      type: "text",
      __EDIT__: { isReadOnly: true },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["RBI Code is required"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_CD",
      label: "Code",
      placeholder: "Enter Code",
      maxLength: 10,
      required: true,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: {
        dependentFields: ["RBI_CD"],
        runValidationOnDependentFieldsChange: true,
        setValueOnDependentFieldsChange: (dependentFields) => {
          return dependentFields?.RBI_CD?.value ?? "";
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
      label: "Bank Name",
      placeholder: "Enter Bank Name",
      maxLength: 50,
      required: true,
      type: "text",
      txtTransform: "uppercase",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Bank Name is required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "EXCLUDE",
      label: "Exclude",
      defaultValue: false,
      GridProps: { xs: 3, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "CTS",
      label: "CTS",
      defaultValue: false,
      GridProps: { xs: 3, sm: 2, md: 2, lg: 2, xl: 2 },
    },
  ],
};
