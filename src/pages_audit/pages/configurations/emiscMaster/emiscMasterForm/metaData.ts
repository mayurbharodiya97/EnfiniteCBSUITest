export const EmiscMasterFormMetadata = {
  form: {
    name: "EmiscForm",
    label: "Miscellaneous Master",
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
      name: "CATEGORY_CD",
      label: "Category Name",
      placeholder: "",
      type: "text",
      maxLength: 50,
      required: true,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Category Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Category Name."] },
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
      name: "DATA_VALUE",
      label: "Data Value",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 50,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Data Value is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Data Value."] },
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
      name: "DISPLAY_VALUE",
      label: "Display Value",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Display Value is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Display Value."] },
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
      name: "REMARKS",
      label: "Remark",
      placeholder: "",
      maxLength: 100,
      type: "text",
      required: false,
      showMaxLength: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
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
  ],
};
