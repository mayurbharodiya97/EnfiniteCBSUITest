import { MetaDataType } from "@acuteinfo/common-base";

export const reportConfigMetadata: MetaDataType = {
  form: {
    name: "otpSmsConfigForm",
    label: "Mobile OTP SMS Configuration",
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
      render: { componentType: "spacer" },
      name: "SPACER1",
      GridProps: { xs: 2, md: 2, sm: 2, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "checkbox" },
      name: "PAGINATION_ENABLE",
      label: "Enable Pagination",
      dependentFields: ["PAGINATION_ENABLE"],

      GridProps: { xs: 6, md: 2, sm: 2, lg: 4, xl: 4 },
    },
    {
      render: { componentType: "checkbox" },
      name: "FILTER_ENABLE",
      label: "Default Filter",

      GridProps: { xs: 6, md: 2, sm: 2, lg: 4, xl: 4 },
    },
  ],
};
