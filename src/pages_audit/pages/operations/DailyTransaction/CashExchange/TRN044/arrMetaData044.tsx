export const ArrFieldMetaData044 = {
  form: {
    name: "ArrFieldMetaData044",
    label: "array field 044",
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
        componentType: "arrayField",
      },
      name: "DDW_OPTION",
      // removeRowFn: "deleteFormArrayFieldData",
      // arrayFieldIDName: "DDW_OPTION",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },

      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "label",
          label: "Display Value",
          placeholder: "Display Value",
          GridProps: { xs: 12, sm: 3, md: 4, lg: 6, xl: 2.5 },
          maxLength: 40,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Display Value is required."] },
            ],
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "value",
          label: "Data Value",
          placeholder: "Data Value",
          maxLength: 40,
          GridProps: { xs: 12, sm: 3, md: 4, lg: 6, xl: 2.5 },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Data Value is required."] }],
          },
        },
      ],
    },
  ],
};
