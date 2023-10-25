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
        componentType: "select",
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
      isReadOnly: true,
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
        rules: [{ name: "required", params: ["Type is required."] }],
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
      // options: () => {
      //   return GeneralAPI.GetMiscValue("USER_SUB_TYPE");
      // },
      // enableDefaultOption: true,
      // _optionsKey: "GetSubTypeMiscValue",
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
      name: "Debit",
      label: "Debit",
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
        componentType: "numberFormat",
      },
      name: "Credit",
      label: "Credit",
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
