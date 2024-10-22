import { isValid } from "date-fns/esm";
import { t } from "i18next";

export const CustomerGlobalLimitRetrievalMetadata = {
  form: {
    name: "enterRetrievalParamaters",
    label: "EnterRetrievalParameters",
    resetFieldOnUnmount: false,
    // validationRun: "onChange",
    validationRun: "all",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "datePicker",
      },
      name: "A_TO_DT",
      label: "AsonDate",
      placeholder: "",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      isFieldFocused: true,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
      onFocus: (date) => {
        date.target.select();
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return t("Mustbeavaliddate");
        }
        return "";
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "A_FREQUENCY",
      label: "Frequency",
      defaultValue: "D",
      options: [
        { label: "Daily", value: "D" },
        { label: "Weekly", value: "W" },
        { label: "Monthly", value: "M" },
      ],
      fullWidth: true,
      placeholder: "",
      type: "text",
      // validate: "getValidateValue",
      // required: true,
      defaultOptionLabel: "SelectFrequency",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "A_CUSTOM_USER_NM",
      label: "LoginID",
      fullWidth: true,
      placeholder: "EnterLoginID",
      // validate: "getValidateValue",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      required: true,
      type: "text",
      autoComplete: "off",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
  ],
};
