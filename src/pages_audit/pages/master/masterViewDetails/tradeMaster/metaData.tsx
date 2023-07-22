import { getpMiscData } from "../api";

export const TradeMasterMetaData = {
  form: {
    name: "Trade Master",
    label: "Trade Master",
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
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "CODE",
    //   label: "Code",
    //   placeholder: "Code",
    //   defaultValue: "",
    //   type: "text",

    //   // allowToggleVisiblity: true,
    //   // maxLength: 10,
    //   // required: true,
    //   fullWidth: true,
    //   schemaValidation: {
    //     type: "string",
    //   },
    //   GridProps: {
    //     xs: 12,
    //     md: 4,
    //     sm: 4,
    //   },
    //   // __EDIT__: { isReadOnly: true },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "TRADE_NM",
      label: "Description",
      placeholder: "",
      type: "text",
      // isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "CKYC_OCCUPATION",
      label: "C-kyc Group",
      options: () => getpMiscData("CKYC_OCCUPATION"),
      _optionsKey: "getpMiscData",
      placeholder: "",
      defaultValue: "",
      type: "text",

      // allowToggleVisiblity: true,
      // maxLength: 10,
      // required: true,
      fullWidth: true,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "C_KYC_OCCUPATION_NM",
      label: "C-kyc Group Name",
      placeholder: "",
      defaultValue: "",
      type: "text",

      // allowToggleVisiblity: true,
      // maxLength: 10,
      // required: true,
      fullWidth: true,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "CONSTITUTION_TYPE",
      label: "Constitution",
      options: () => getpMiscData("BANK_CONS_TYPE"),
      _optionsKey: "getpMiscData",
      placeholder: "",
      type: "text",
      // isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONSTITUTION_TYPE_NM",
      label: "Constitution Name",
      placeholder: "",
      type: "text",
      // isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ENTERED_BY",
      label: "Enter By",
      placeholder: "",
      type: "text",
      // isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
  ],
};
