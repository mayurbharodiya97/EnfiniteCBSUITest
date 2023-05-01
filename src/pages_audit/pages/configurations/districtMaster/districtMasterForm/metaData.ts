export const DistMasterFormMetadata = {
  form: {
    name: "distMSTForm",
    label: "District Master",
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
        componentType: "textField",
      },
      name: "DIST_CD",
      label: "District Code",
      placeholder: "",
      type: "text",
      maxLength: 4,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["District Code is required."] },
          { name: "DATATYPE_CD", params: ["Please enter District Code."] },
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
      name: "DIST_NM",
      label: "District Name",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: false,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["District Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter District Name."] },
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
        componentType: "textField",
      },
      name: "DIVISION_CD",
      label: "Division Code",
      placeholder: "",
      maxLength: 4,
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Division Code is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Division Code."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DIVISION_NM",
      label: "Division Name",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: false,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Division Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Division Name."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GEOCODE",
      label: "Geo Code",
      placeholder: "",
      maxLength: 4,
      type: "text",
      schemaValidation: {
        type: "string",
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
      name: "NEW_DIST_CD",
      label: "New District Code",
      placeholder: "",
      type: "text",
      maxLength: 4,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["New District Code is required."] },
          { name: "DATATYPE_CD", params: ["Please enter New District Code."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
  ],
};
