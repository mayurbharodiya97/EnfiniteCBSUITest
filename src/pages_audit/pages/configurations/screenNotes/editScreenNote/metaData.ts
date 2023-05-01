export const ScreenNoteEditMetadata = {
  form: {
    name: "screenNote",
    label: "Screen Note Configuration",
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
      name: "SCREEN_ID",
      label: "Code",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SCREEN_NM",
      label: "Description",
      placeholder: "",
      type: "text",
      required: true,
      isReadOnly: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Description is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Description."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
    },
  ],
};
