export const chargeTempMasterEditViewMetadata = {
  form: {
    name: "chargeTempMasterEdit",
    label: "Edit Charge Template",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
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
          spacing: 2,
        },
      },
    },
  },
  fields: [
    {
      render: { componentType: "hidden" },
      name: "transactionID",
    },
    {
      render: { componentType: "datePicker" },
      name: "effectiveDate",
      label: "Effective Date",
      //placeholder: "Enter Checklist Name",
      format: "dd/MM/yyyy",
      required: true,
      //validate: "getValidateValue",
      maxLength: 150,
      //showMaxLength: false,
      GridProps: { xs: 12, md: 3, sm: 3 },
      fullWidth: true,
    },
    {
      render: { componentType: "textField" },
      name: "description",
      label: "Description",
      placeholder: "Enter Description",
      required: true,
      //validate: "getValidateValue",
      maxLength: 300,
      //showMaxLength: false,
      GridProps: { xs: 12, md: 3, sm: 9 },
      fullWidth: true,
    },
    // {
    //   render: {
    //     componentType: "spacer",
    //   },
    //   GridProps: { xs: 12, md: 6, sm: 6 },
    // },
    // {
    //   render: {
    //     componentType: "checkbox",
    //   },
    //   name: "active",
    //   label: "Active",
    //   GridProps: { xs: 12, md: 3, sm: 3 },
    //   fullWidth: true,
    // },
  ],
};
