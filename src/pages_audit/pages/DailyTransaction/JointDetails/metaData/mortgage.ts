import { GeneralAPI } from "registry/fns/functions";
export const mortgage = {
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
      name: "Description",
      label: "Description",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: {
        xs: 3,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Mort",
      label: "Mort Type",
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
      name: "cost",
      label: "Cost/Value",
      placeholder: "",
      type: "text",
      required: true,
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
      name: "Security",
      label: "Security Type",
      placeholder: "",
      type: "text",
      fullWidth: false,
      isReadOnly: true,
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
      name: "Security",
      label: "Security ",
      placeholder: "",
      type: "text",
      fullWidth: false,
      isReadOnly: true,
      GridProps: {
        xs: 2,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
  ],
};
