import * as API from "./api";

export const InwardClearingRetrievalMetadata = {
  form: {
    name: "InwardClearingForm",
    label: "Parameters",
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
        componentType: "radio",
      },
      name: "A_RETRIEVE",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "E",
      options: [
        {
          label: "Ent.Branch",
          value: "E",
        },
        { label: "A/C Branch", value: "A" },
      ],

      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "radio",
      },
      name: "A_FLAG",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "N",
      options: [
        {
          label: "Only Error",
          value: "N",
        },
        { label: "All", value: "Y" },
      ],

      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
        lg: 6,
        xl: 6,
      },
    },
  ],
};
