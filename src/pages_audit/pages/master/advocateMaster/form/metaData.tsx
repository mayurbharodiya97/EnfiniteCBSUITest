export const AdvocateMstFormMetaData = {
  form: {
    name: "advocateMaster",
    label: "Advocate Master",
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
      phoneNumberOptional: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "CODE",
      label: "Code",
      placeholder: "Enter Code",
      type: "text",
      required: true,
      maxLength: 4,
      autoComplete: "off",
      __EDIT__: { isReadOnly: true },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required"] }],
      },
      validate: (columnValue) => {
        let regex = /^[^~`!@#$%^&*()\-+_=\\"';:?/<>,.{}[\]|]+$/;
        if (columnValue.value && !regex.test(columnValue.value)) {
          return "Special character is not allowed";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Advocate Name",
      placeholder: "Enter Advocate Name",
      type: "text",
      autoComplete: "off",
      required: true,
      maxLength: 100,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Advocate Name is required"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "CONTACT1",
      label: "Mobile No.",
      placeholder: "Enter Mobile No.",
      required: true,
      maxLength: 10,
      fullWidth: true,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Mobile No. is required"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Address",
      placeholder: "Enter Address",
      autoComplete: "off",
      type: "text",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "EMAIL",
      label: "Email ID",
      placeholder: "Enter Email ID",
      type: "text",
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "email", params: ["Invalid Email ID"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
  ],
};
