export const CardBinImageEntryMetaData = {
  form: {
    name: "CardBinImage",
    label: "Card Bin Image Upload",
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
      name: "CARD_BIN",
      sequence: 1,
      label: "Card Bin Number",
      placeholder: "Enter Card Bin Number",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Card Bin Number is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Card Bin Number."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "IMAGE_PATH",
      sequence: 2,
      label: "Card Bin Image Path",
      placeholder: "Enter Card Bin Image Path",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Card Bin Image Path is required."] },
          {
            name: "DATATYPE_CD",
            params: ["Please enter Card Bin Image Path."],
          },
        ],
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
  ],
};
