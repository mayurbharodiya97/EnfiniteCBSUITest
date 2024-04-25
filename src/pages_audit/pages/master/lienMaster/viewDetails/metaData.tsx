export const metaData = {
  form: {
    name: "Line Master Config",
    label: "Line Master",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
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
      name: "LEAN_CD",
      label: "Code",
      placeholder: "Code",  
      maxLength: 4,
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["code is Required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
       __EDIT__: {isReadOnly:true},
    },
    {
      render: { componentType: "select" },
      name: "PARENT_TYPE",
      placeholder: "select parent type",
      label: "Parent_Type",
      options: [
        { label: "NORMAL ", value: "00  "},
        { label: "NO TRANSACTION", value: "99  "},
        { label: "NO DEBIT ", value: "44  "},
        { label: "NO CREDIT", value: "11  "},
        { label: "AMT RESTRICT", value: "05  "},
        { label: "AMT ALERT", value: "06  "}, 
        { label: "NO CASH RECEIPT", value: "66  "},
        { label: "NO CASH PAYMENT", value: "77  "},
      ],
      _optionsKey: "Parent type",
      defaultValue:"00  ",
      required: true,
      type: "text",
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 6, xl:6 },
      fullWidth: true,
      autoComplete: "on",
      //@ts-ignore
      isFieldFocused: false,
      __EDIT__: {isReadOnly:true},
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Please Select Parent Type"] },
        ],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LEAN_NM",
      label: "Description",
      placeholder: "Description",
      maxLength: 40,
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is Required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
     
    },
    
  ],
};
