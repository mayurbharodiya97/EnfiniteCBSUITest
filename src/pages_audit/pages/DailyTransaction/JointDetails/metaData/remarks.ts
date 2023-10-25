import { GeneralAPI } from "registry/fns/functions";
export const remarks = {
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
      name: "Remarks",
      label: "Remarks",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: {
        xs: 4,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CKYC",
      label: "CKYC No",
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
  ],
};
