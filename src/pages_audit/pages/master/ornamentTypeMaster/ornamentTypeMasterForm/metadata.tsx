export const OrnamentTypeMasterFormMetaData = {
  form: {
    name: "ornamentTypeMaster",
    label: "Ornament Type Master",
    validationRun: "onBlur",
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
      rateOfInt: {
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
      maxLength: 4,
      isFieldFocused: true,
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required."] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 3 },
      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "Special character '!' and '&' not allowed";
        }
        return "";
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      placeholder: "Enter Description",
      maxLength: 50,
      type: "text",
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is required."] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 6 },
      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "Special character '!' and '&' not allowed";
        }
        return "";
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "ORN_MARGIN",
      label: "Margin",
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Margin is required."] }],
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        xl: 3,
      },
      FormatProps: {
        isAllowed: (values) => {
          //@ts-ignore
          if (parseFloat(values?.value) >= 100.01) {
            return false;
          }
          return true;
        },
      },
    },
  ],
};
