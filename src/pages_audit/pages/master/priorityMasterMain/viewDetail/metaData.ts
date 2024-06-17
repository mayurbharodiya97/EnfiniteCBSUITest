import * as API from '../api'
export const Viewformmetadata = {
  form: {
    name: "Priority main master",
    label: "Priority Master - Main",
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
        rules: [{ name: "required", params: ["code is Required"] }],
      },
      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "Special character '!' and '&' not allowed";
        }
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      __EDIT__: { isReadOnly: true }
    },
    {
      render: { componentType: "autocomplete" },
      name: "PARENT_GROUP",
      label: "ParentGroup",
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
      maxLength: 50,
      multiline: true,
      isFieldFocused: false,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is Required"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "Divider",
      },
      name: "SanctionLimit",
      dividerText: "Sanction Limit"
    },
    {
      render: {
        componentType: "currency",
      },
      name: "FROM_LIMIT",
      label: "FromLimit",
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
              return "To Limit should be greater than or equal to From Limit";
            }
          }
        }
      }
    },
    {
      render: {
        componentType: "Divider",
      },
      name: "ProvisionPer",
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
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
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
