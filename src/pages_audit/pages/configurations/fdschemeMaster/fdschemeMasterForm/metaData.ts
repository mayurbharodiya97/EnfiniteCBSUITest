export const FdschemeMasterFormMetadata = {
  form: {
    name: "FdschemeForm",
    label: "FD Scheme Configuration",
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
        componentType: "textField",
      },
      name: "NATURE_OF_ACCOUNT",
      label: "Nature of Account",
      placeholder: "",
      type: "text",
      maxLength: 10,
      required: true,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Nature of Account is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Nature of Account."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CURRENCY",
      label: "CCY",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 10,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["CCY is required."] },
          { name: "DATATYPE_CD", params: ["Please enter CCY."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FDR_ACCT_TYPE",
      label: "Fd Account Type",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 20,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Fd Account Type is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Fd Account Type."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TENOR_TYPE_FINACLE",
      label: "Tenure Type Finacle",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 20,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Tenure Type Finacle is required."] },
          {
            name: "DATATYPE_CD",
            params: ["Please enter Tenure Type Finacle."],
          },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TENOR",
      label: "Tenure",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 10,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Tenure is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Tenure."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TENOR_TYPE_RATE",
      label: "Tenure Type Rate",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 20,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Tenure Type Rate is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Tenure Type Rate."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "RENEWAL",
      label: "Renewal",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 10,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Renewal is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Renewal."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MATURITY_INST",
      label: "Maturity Inst.",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Maturity Inst. is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Maturity Inst.."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "spacer",
      },

      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "SCHEME_CODE",
      label: "Scheme Code",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 10,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Scheme Code is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Scheme Code."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SCHEME_DESC",
      label: "Scheme Description",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Scheme Description is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Scheme Description."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FD_MOD_AMT",
      label: "TD Mod Amount",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 12,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["TD Mod Amount is required."] },
          { name: "DATATYPE_CD", params: ["Please enter TD Mod Amount."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",

      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
  ],
};
