import * as API from '../api';
export const prioritymastersubformmetadata = {
  form: {
    name: "Priority Master - Sub",
    label: "Priority Master - Sub",
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
      name: "SUB_PRIORITY_CD",
      label: "Code",
      placeholder: "Code",
      type: "text",
      maxLength:4,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["code is Required"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl:6  },
    },
    {
      render: { componentType: "autocomplete" },
      name: "PARENT_WEAKER_NM",
      label: "Parent Weaker",
      enableDefaultOption: false,
      options:()=> API.getPMISCData("WEAKER_PARENT"),
      _optionsKey: "getPMISCData",
      GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl:6},
      __VIEW__: { isReadOnly: true },
    },
    {
      render: { componentType: "textField" },
      name: "DESCRIPTION",
      label: "Description",
      type: "text",
      required: true, 
      placeholder: "Description",
      maxLength:50,
      multiline:true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is Required"] }],
      },
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 12, xl:12 },
    },
    
  ],
};
