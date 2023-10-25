import { GeneralAPI } from "registry/fns/functions";
export const personalDetail = {
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
      name: "Person",
      label: "Person Name",
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
      name: "Gender",
      label: "Gender",
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
      name: "Designation",
      label: "Designation",
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
      name: "Designation",
      label: "Line1",
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
      name: "Designation",
      label: "Line2",
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
      name: "Designation",
      label: "Line3",
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
      name: "Mobile",
      label: "Mobile No.",
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
      name: "Phone",
      label: "Phone",
      placeholder: "",
      type: "text",
      fullWidth: false,
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
      name: "UniqueId",
      label: "Unique ID",
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
      name: "form",
      label: "Form 60/61",
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
      name: "din",
      label: "DIN",
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
  ],
};
