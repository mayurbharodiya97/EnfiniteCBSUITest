export const LienReasonMstFormMetaData = {
  form: {
    name: "lienReasonMaster",
    label: "Lien Reason Master",
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
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "REASON_CD",
      label: "Code",
      placeholder: "Enter Code",
      maxLength: 4,
      required: true,
      type: "text",
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REASON_NM",
      label: "Description",
      placeholder: "Enter Description",
      maxLength: 50,
      required: true,
      type: "text",
      autoComplete: "off",
      txtTransform: "uppercase",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
  ],
};
