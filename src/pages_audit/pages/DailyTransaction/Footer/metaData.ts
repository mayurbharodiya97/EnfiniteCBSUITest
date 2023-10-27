import { GeneralAPI } from "registry/fns/functions";
export const footerForm = {
  form: {
    name: "footerForm",
    label: "footer form1",
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
          spacing: 0,
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
      name: "Branch",
      label: "Branch",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "Type",
      label: "Type",
      placeholder: "Type",
      type: "text",
      required: true,
      options: GeneralAPI.getAccountTypeList,
      _optionsKey: "getAccountTypeList",
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Type is required."] }],
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "acc",
      label: "A/C No.",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
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
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
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
      fullWidth: false,
      dependentFields: ["TRX"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRX?.value == "4") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
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
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["SDC is required."] }],
      },
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
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
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
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "CHQ_date",
      // sequence: 9,
      label: "CHQ Date",
      placeholder: "date",

      GridProps: {
        xs: 1.3,
        md: 1.3,
        sm: 1.3,
        lg: 1.3,
        xl: 1.3,
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
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
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
          dependentFieldsValues?.TRX?.value == "1" ||
          dependentFieldsValues?.TRX?.value === "2" ||
          dependentFieldsValues?.TRX?.value === "3"
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
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
      GridProps: {
        xs: 1,
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
    },
  ],
};
