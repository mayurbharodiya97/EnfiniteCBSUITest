export const metaData = {
  form: {
    name: "AC Period Master",
    label: "AC Period Master",
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
      name: "PERIOD_CD",
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
      render: {
        componentType: "textField",
      },
      name: "PERIOD_NM",
      label: "Period Name",
      placeholder: "Period Name",
      maxLength: 40,
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Period Name is Required"] }],
      },
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 6, xl:6 },
     
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromLeft",
      name: "INST_NO",
      label: "Inst. No.",
      placeholder: "Inst. No.",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 6, xl:6 },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Inst. No. is Required"] },
          // { name: "max", params: [10, "Inst. No. should be 5 digit."] },
        ],
      },
    },
    {
      render: { componentType: "select" },
      name: "INSTALLMENT_TYPE",
      placeholder: "Select Installment Period",
      label: "Installment Period",
      options: [
        { label: "Daily ", value: "D"},
        { label: "Monthly", value: "M"},
        { label: "Quarterly", value: "Q"},
        { label: "Half-Yearly", value: "H"},
        { label: "Yearly", value: "Y"},
        { label: "On Expiry", value: "E"},
      ],
      _optionsKey: "Installment_period",
      defaultOptionLabel: "Select Installment Period",
      defaultValue:"M",
      required: true,
      type: "text",
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 6, xl:6 },
      fullWidth: true,
      autoComplete: "on",
      //@ts-ignore
      isFieldFocused: false,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Please Select Installment Period"] },
        ],
      
      },
    },
  ],
};
