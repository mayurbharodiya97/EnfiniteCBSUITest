import { Placeholder } from 'reactstrap';
import * as API from '../api'
export const Viewformmetadata = {
  form: {
    name: "Priority main master",
    label: "Priority Main Master",
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
          // spacing: 2,
          width:200,
          maxwidth:300
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
      devider:{
        fullWidth: true,
      }
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "PRIORITY_CD",
      label: "Code",
      placeholder: "Code",
      type: "text",
      isReadOnly:false,
      maxLength:7,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["code is Required"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl:6  },
      __EDIT__:{isReadOnly:true}
    },
    {
      render: { componentType: "autocomplete" },
      name: "PARENT_GROUP",
      label: "Parent Group",
      enableDefaultOption: false,
      options: API.getParentPriority,
      _optionsKey: "getParentPriority",
      defaultValue: "Dynamic SQL",
      type: "text",
      GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl:6 },
      fullWidth: true,
      autoComplete: "off",
      //@ts-ignore
      isFieldFocused: true,
    },

    {
        render: { componentType: "autocomplete" },
        name: "SUB_PRIORITY_CD",
        enableDefaultOption: false,
        label: "Sub Priority",
        options: API.getSubPriority,
        _optionsKey: "getSubPriority",
        type: "text",
        GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl:6 },
        fullWidth: true,
        autoComplete: "off",
        isFieldFocused: false,
   },
    {
      render: { componentType: "textField" },
      name: "PRIORITY_NM",
      label: "Description",
      type: "text",
      required: true, 
      placeholder: "Description",
      maxLength:50,
      multiline:true,
      isFieldFocused: false,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is Required"] }],
      },
      GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl:6 },
    },
    {render: {
      componentType: "Divider",
    },
    dividerText: "Sanction Limit"
  },
    {
        render: {
          componentType: "currency",
        },
        name: "FROM_LIMIT",
        label: "From Limit",
        maxLength:12,
        type: "text",
        fullWidth: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        fixedDecimalScale: true,
        enableNumWords: false,
        isFieldFocused: false,
        GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl:6  },
      },
      {
        render: {
          componentType: "currency",
        },
        name: "TO_LIMIT",
        label: "To Limit",
        type: "text",
        maxLength:12,
        fullWidth: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        fixedDecimalScale: true,
        enableNumWords: false,
        isFieldFocused: false,
        GridProps: {   xs: 12, sm: 6, md: 6, lg: 6, xl:6   },
      },
      {render: {
        componentType: "Divider",
      },
      dividerText: "Provision %"
    },
      {
        render: {
          componentType: "currency",
        },
        name: "SECURE_PROV_PERC",
        label: "Secured",
        type: "text",
        fullWidth: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        fixedDecimalScale: true,
        enableNumWords: false,
        isFieldFocused: false,
        GridProps: {   xs: 12, sm: 6, md: 6, lg: 6, xl:6  },
      },
      {
        render: {
          componentType: "currency",
        },
        name: "UNSECURE_PROV_PERC",
        label: "UnSecured",
        type: "text",
        fullWidth: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        fixedDecimalScale: true,
        enableNumWords: false,
        isFieldFocused: false,
        GridProps: {    xs: 12, sm: 6, md: 6, lg: 6, xl:6   },
      
      },
      {
        render: {
          componentType: "checkbox",
        },
        name: "ACTIVE_FLAG",
        label: "Active",                         
        defaultValue:true,
        GridProps: {  xs: 12, sm: 6, md: 6, lg: 6, xl:6   },
      },
  ],
};
