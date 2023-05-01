import { utilFunction } from "components/utils/utilFunctions";

export const PasswordChangeMetaData = {
  form: {
    name: "passwordChange",
    label: "Change Password",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
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
    },
  },
  fields: [
    {
      render: { componentType: "passwordField", group: 0 },
      name: "currentPassword",
      sequence: 1,
      type: "text",
      label: "Current Password",
      placeholder: "Current Password",
      GridProps: { xs: 12, md: 12, sm: 12 },
      fullWidth: true,
      required: true,
      autoComplete: "off",
      allowToggleVisiblity: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
    },
    {
      render: { componentType: "passwordField", group: 0 },
      name: "password",
      sequence: 2,
      type: "password",
      label: "New Password",
      placeholder: "New Password",
      GridProps: { xs: 12, md: 12, sm: 12 },
      fullWidth: true,
      required: true,
      autoComplete: "off",
      allowToggleVisiblity: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
      dependentFields: ["currentPassword"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields) => {
        if (
          Boolean(currentField?.value) &&
          currentField?.value === dependentFields?.currentPassword?.value
        ) {
          return "The new password cannot be the same as the old password";
        }
        return utilFunction.ValidatePassword(currentField?.value);
      },
    },
    {
      render: { componentType: "passwordField", group: 0 },
      name: "confirmPassword",
      sequence: 3,
      type: "password",
      label: "Confirm Password",
      placeholder: "Confirm Password",
      GridProps: { xs: 12, md: 12, sm: 12 },
      fullWidth: true,
      required: true,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
      dependentFields: ["password"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields) => {
        if (currentField?.value !== dependentFields?.password?.value) {
          return "New Password and Confirm Password did not matched";
        } else {
          return "";
        }
      },
    },
  ],
};
