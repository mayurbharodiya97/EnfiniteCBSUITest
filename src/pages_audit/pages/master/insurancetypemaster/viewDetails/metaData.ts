import { getPMISCData } from "../api";
export const InsuTypeMasterFormMetadata = {
  form: {
    name: "insuranceTypeMaster",
    label: "Insurance Type Master",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "INSURANCE_TYPE_CD",
      label: "Code",
      required: true,
      maxLength: 4,
      placeholder: "Enter Code",
      txtTransform: "uppercase",
      __EDIT__: { isReadOnly: true },
      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }
        return "";
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required."] }],
      },
      isFieldFocused: true,
      GridProps: {
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      required: true,
      maxLength: 75,
      placeholder: "Enter Description",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is required."] }],
      },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "SECURITY_TYPE",
      label: "Security Type",
      defaultOptionLabel: "Select option",
      options: getPMISCData,
      _optionsKey: "getInsuSecureType",
      defaultValue: "BCC",
      __VIEW__: {
        SelectProps: { IconComponent: () => null },
      },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },
  ],
};
