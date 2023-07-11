export const PasswordVerifyMetaData = {
  form: {
    name: "passwordVerify",
    label: "Password Verify",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
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
    },
  },
  fields: [
    {
      render: { componentType: "passwordField", group: 0 },
      name: "currentPassword",
      sequence: 1,
      type: "text",
      label: "Current Password",
      placeholder: "Current Password",
      GridProps: { xs: 12, md: 12, sm: 12 },
      fullWidth: true,
      required: true,
      autoComplete: "off",
      allowToggleVisiblity: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
    },
  ],
};
