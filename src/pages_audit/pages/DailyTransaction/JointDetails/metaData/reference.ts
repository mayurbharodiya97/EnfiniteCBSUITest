import { GeneralAPI } from "registry/fns/functions";
export const reference = {
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
          sm: 4,
          md: 4,
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
      name: "CustType",
      label: "CustType",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: {
        xs: 2,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "date",
      label: "Date",
      placeholder: "",

      GridProps: {
        xs: 2,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor ",
      label: "Introductor A/C",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: {
        xs: 2,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor2",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: {
        xs: 2,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor3",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: {
        xs: 2,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor4",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: {
        xs: 2,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "formbutton", group: 0 },
      name: "ok",
      sequence: 4,
      label: "ok",
      maxLength: 20,
      GridProps: { xs: 12, md: 2, sm: 2 },
      fullWidth: true,
      // __VIEW__: { isReadOnly: true },
      // __EDIT__: { isReadOnly: false },
    },
    {
      render: { componentType: "formbutton", group: 0 },
      name: "cancel",
      sequence: 4,
      label: "cancel",
      maxLength: 20,
      GridProps: { xs: 12, md: 2, sm: 2 },
      fullWidth: true,
      // __VIEW__: { isReadOnly: true },
      // __EDIT__: { isReadOnly: false },
    },
  ],
};
