import * as API from '../api';
export const TradeMasterMetaData = {
  form: {
    name: "Trade Master",
    label: "Trade Master",
    resetFieldOnUnmount: true,
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
          lg:12,
          xl:12
        },
        container: {
          direction: "row",
          spacing: 2,
          width:200,
          maxwidth:500
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
      autocomplete: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "TRADE_CD",
      label: "Code",
      placeholder: "Code",
      type: "text",
      isReadOnly:false,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["code is Required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl:12  },
      __EDIT__:{isReadOnly:true}
    },
    {
      render: { componentType: "textField" },
      name: "TRADE_NM",
      label: "Description",
      type: "text",
      required: true, 
      placeholder: "Description",
      maxLength:100,
      multiline:true,
      isFieldFocused: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is Required"] }],
      },
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 12, xl:12 },
    },
    {
      render: { componentType: "autocomplete" },
      name: "DATA_VALUE",
      label: "C-KYC Group", 
      enableDefaultOption: false,
      options:()=> API.getPMISCData("CKYC_OCCUPATION"),
      _optionsKey: "getDataForCkycGroup",
      defaultValue: "Dynamic SQL",
      type: "text",
      GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl:6},
      fullWidth: true,
      autoComplete: "off",
      isFieldFocused: false,
    },
    {
      render: { componentType: "select" },
      name: "CONSTITUTION_TYPE",
      label: "Constitution",
      enableDefaultOption: false,
      options: () => API.getPMISCData("BANK_CONS_TYPE"),
      _optionsKey: "getDataForConstitution",
      defaultValue:"Both", 
      type: "text",
      GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      fullWidth: true,
      isFieldFocused: false,
    },
  ],
};

