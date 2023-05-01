export const ParaDetailMetadata = {
  form: {
    name: "paraDetail",
    label: "Parameter Master",
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
    // {
    //   render: {
    //     componentType: "typography",
    //   },
    //   name: "AUTHVIEW",
    //   label: "Loan Approval Request Details",
    //   GridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //   },
    // },
    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARA_CD",
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
      name: "PARA_NM",
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
    {
      render: {
        componentType: "select",
      },
      name: "DATATYPE_CD",
      label: "Data Type",
      placeholder: "",
      options: [
        { label: "NUM/DECIMAL", value: "N" },
        { label: "CHARACTER/STRING", value: "C" },
        { label: "DATE", value: "D" },
      ],
      isReadOnly: true,
      defaultValue: "",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Data Type is required."] },
          { name: "DATATYPE_CD", params: ["Please select Data Type."] },
        ],
      },
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
      name: "PARA_VALUE",
      label: "Value",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Value is required."] },
          { name: "PARA_VALUE", params: ["Please enter Value."] },
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
