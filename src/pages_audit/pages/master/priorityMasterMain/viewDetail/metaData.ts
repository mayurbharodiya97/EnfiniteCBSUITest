import { Placeholder } from 'reactstrap';
import * as API from '../api'
export const Viewformmetadata = {
  form: {
    name: "Priority main master",
    label: "",
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
          lg: 12,
          xl: 12
        },
        container: {
          direction: "row",
          // spacing: 2,
          width: 200,
          maxwidth: 300
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
      devider: {
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
      isReadOnly: false,
      maxLength: 5,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["codeisRequired"] }],
      },
      preventSpecialCharInput:true,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      __EDIT__: { isReadOnly: true }
    },
    {
      render: { componentType: "autocomplete" },
      name: "PARENT_GROUP",
      label: "ParentGroup",
      placeholder:"ParentGroup",
      options: API.getParentPriority,
      _optionsKey: "getParentPriority",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      __VIEW__: { isReadOnly: true },
 
    },

    {
      render: { componentType: "autocomplete" },
      name: "SUB_PRIORITY_CD",
      enableDefaultOption: false,
      label: "SubPriority",
      options: API.getSubPriority,
      _optionsKey: "getSubPriority",
      placeholder:"SubPriority",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      __VIEW__: { isReadOnly: true },

    },
    {
      render: { componentType: "textField" },
      name: "PRIORITY_NM",
      label: "Description",
      type: "text",
      required: true,
      placeholder: "Description",
      preventSpecialCharInput: true,
      maxLength: 50,
      multiline: true,
      isFieldFocused: false,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["DescriptionisRequired"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "SanctionLimit",
      label: "Sanction Limit",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "currency",
      },
      name: "FROM_LIMIT",
      label: "FromLimit",
      placeholder:"FromLimit",
      maxLength: 12,
      type: "text",
      fullWidth: true,
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      enableNumWords: false,
      isFieldFocused: false,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "currency",
      },
      name: "TO_LIMIT",
      label: "ToLimit",
      placeholder:"ToLimit",
      type: "text",
      maxLength: 12,
      fullWidth: true,
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      enableNumWords: false,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      dependentFields: ["FROM_LIMIT"],
      runValidationOnDependentFieldsChange: true,
      validate: (fieldValue, dependentFields) => {
        if (fieldValue && fieldValue.value !== null &&
          dependentFields["FROM_LIMIT"] && dependentFields["FROM_LIMIT"].value !== null) {
          const toLimit = parseFloat(fieldValue.value);
          const fromLimit = parseFloat(dependentFields["FROM_LIMIT"].value);

          if (!isNaN(toLimit) && !isNaN(fromLimit)) {
            if (toLimit < fromLimit) {
              return "ToLimitValidation";
            }
          }
        }
      }
    },
    {
      render: {
        componentType: "divider",
      },
      name: "ProvisionPer",
      label: "Provision %",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "currency",
      },
      name: "SECURE_PROV_PERC",
      label: "Secured",
      placeholder:"Secured",
      type: "text",
      fullWidth: true,
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      enableNumWords: false,
      isFieldFocused: false,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "currency",
      },
      name: "UNSECURE_PROV_PERC",
      label: "UnSecured",
      placeholder:"UnSecured",
      type: "text",
      fullWidth: true,
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      enableNumWords: false,
      isFieldFocused: false,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },

    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "ACTIVE_FLAG",
      label: "Active",
      defaultValue: true,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_PRIORITY_CD",
    },
  ],
};
