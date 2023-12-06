import { GeneralAPI } from "registry/fns/functions";
export const footerFormMetaData = {
  form: {
    name: "footerForm",
    label: "footer form",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",

    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 2,
          md: 2,
        },
        container: {
          direction: "row",
          spacing: 0.8,
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
        componentType: "branchCode",
      },
      name: "Branch",
      label: "Branch",
      placeholder: "Branch",
      type: "text",
      required: true,
      // options: GeneralAPI.getTRXList,
      _optionsKey: "",
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["TRX is required."] }],
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "Type",
      label: "Account Type",
      placeholder: "Type",
      type: "text",
      required: true,
      options: GeneralAPI.getAccountTypeList,
      _optionsKey: "getAccountTypeList",
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1.5 },
      enableDefaultOption: true,
      defaultValue: "6",
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Type is required."] }],
      // },
    },

    {
      render: {
        componentType: "textField",
      },
      isReadOnly: true,
      name: "acc",
      label: "A/C No.",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
    },

    {
      render: {
        componentType: "select",
      },
      name: "TRX",
      label: "TRX",
      placeholder: "TRX",
      type: "text",
      required: true,
      options: GeneralAPI.getTRXList,
      _optionsKey: "getTRXList",
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["TRX is required."] }],
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Scroll",
      label: "Scroll",
      placeholder: "",
      type: "text",
      dependentFields: ["TRX"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRX?.value == "4") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
    },

    {
      render: {
        componentType: "select",
      },
      name: "SDC",
      label: "SDC",
      placeholder: "SDC",
      type: "text",
      required: true,
      options: GeneralAPI.getSDCList,
      _optionsKey: "getSDCList",
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
      enableDefaultOption: true,
      defaultValue: "6",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["SDC is required."] }],
      },
      dependentFields: ["Remarks"],
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field.value) {
          console.log(field?.optionData[0]?.DESCRIPTION, "field");
          console.log(dependentFieldsValues, "dependentFieldsValues");
          return {
            Remarks: { value: field?.optionData[0]?.DESCRIPTION ?? "" },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Remarks",
      label: "Remarks",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1.2 },
      dependentFields: ["SDC"],
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   console.log("dependentFields", dependentFields);
      //   return dependentFields?.SDC?.name;
      // },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CHQ No",
      label: "CHQ No",
      placeholder: "",
      type: "text",
      required: true,
      dependentFields: ["TRX"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRX?.value == "4" ||
          dependentFieldsValues?.TRX?.value === "5" ||
          dependentFieldsValues?.TRX?.value === "6"
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "CHQ_date",
      defaultValue: new Date(),
      label: "CHQ Date",
      placeholder: "date",
      dependentFields: ["TRX"],
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1.3 },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRX?.value == "4" ||
          dependentFieldsValues?.TRX?.value === "5" ||
          dependentFieldsValues?.TRX?.value === "6"
        ) {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "Debit",
      label: "Debit",
      placeholder: "",
      type: "text",
      required: true,
      dependentFields: ["TRX"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRX?.value == "4" ||
          dependentFieldsValues?.TRX?.value === "5" ||
          dependentFieldsValues?.TRX?.value === "6"
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "Credit",
      label: "Credit",
      placeholder: "",
      type: "text",
      required: true,
      dependentFields: ["TRX"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRX?.value === "1" ||
          dependentFieldsValues?.TRX?.value === "2" ||
          dependentFieldsValues?.TRX?.value === "3"
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "VNo",
      label: "VNo.",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 1 },
    },
  ],
};
