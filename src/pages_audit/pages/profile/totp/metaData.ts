import { t } from "i18next";

export const PasswordVerifyMetaData = {
  form: {
    name: "passwordVerify",
    label: "PasswordVerify",
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
      label: "CurrentPassword",
      placeholder: "CurrentPassword",
      GridProps: { xs: 12, md: 12, sm: 12, xl: 12, lg: 12 },
      fullWidth: true,
      required: true,
      autoComplete: "off",
      allowToggleVisiblity: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
      validate: (currentField, value) => {
        if (!Boolean(currentField?.value)) {
          return t("ThisFieldisrequired");
        } else if (
          currentField?.value.length < 8 ||
          currentField?.value.length > 16
        ) {
          return t("EnterPasswordValid");
        } else if (
          !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s)/.test(
            currentField?.value
          )
        ) {
          return t("EnterPasswordPolicy");
        }
        return "";
      },
    },
  ],
};
