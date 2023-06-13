export const MessageDescriptionMetadata = {
  form: {
    name: "MessageDescriptionMetadata",
    // label: "MessageBox Description",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
        componentType: "select",
      },
      name: "PID_KEY",
      label: "Circular Type",
      placeholder: "",
      defaultValue: "",
      type: "text",
      // allowToggleVisiblity: true,
      // maxLength: 10,
      // required: true,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 6,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PID_DESCRIPTIO",
      label: "No.",
      placeholder: "",
      fullWidth: true,
      type: "text",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "BR_OPEN_DT",
      label: "Open Date",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 6,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "PID_DESCRIPTION",
      label: "Purpose",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "PID_DESCRIPTION",
    //   label: "Description",
    //   placeholder: "",
    //   type: "text",
    //   GridProps: {
    //     xs: 12,
    //     md: 8,
    //     sm: 8,
    //   },
    // },
  ],
};
