export const GuessPwdMasterFormMetadata = {
  form: {
    name: "GuessPwdForm",
    label: "Guessable Password Entry",
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
      name: "WORD_TEXT",
      label: "Guessable Password",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 10,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Guessable Password is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Guessable Password."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
  ],
};
