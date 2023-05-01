import { MetaDataType } from "components/dyanmicForm";

export const UserBlockConfigMetadata: MetaDataType = {
  form: {
    name: "userBlockConfigForm",
    label: "User Block Configuration",
    resetFieldOnUmnount: false,
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
        componentType: "textField",
      },
      name: "CONFIG_TYPE",
      label: "Config Type",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Config Type is required."] },
          { name: "CONFIG_TYPE", params: ["Please enter Config Type."] },
        ],
      },
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
      name: "CONFIG_DESC",
      label: "Description",
      placeholder: "",
      type: "text",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Description is required."] },
          { name: "CONFIG_DESC", params: ["Please enter Description."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 8,
        sm: 8,
      },
    },
    {
      render: { componentType: "numberFormat" },
      name: "FAIL_ATTEMPT",
      label: "Fail Attempt",
      placeholder: "",
      required: true,
      maxLength: 8,
      showMaxLength: false,
      GridProps: { xs: 6, md: 4, sm: 4 },
      fullWidth: true,
      autoComplete: "off",
      className: "textInputFromRight",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },
    {
      render: { componentType: "numberFormat" },
      name: "BLOCK_MINUTE",
      label: "Minutes Of Block",
      placeholder: "",
      className: "textInputFromRight",
      required: true,
      maxLength: 8,
      showMaxLength: false,
      GridProps: { xs: 6, md: 4, sm: 4 },
      fullWidth: true,
      autoComplete: "off",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "AUTO_RELEASE",
      label: "Auto Release",
      defaultValue: false,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
  ],
};
