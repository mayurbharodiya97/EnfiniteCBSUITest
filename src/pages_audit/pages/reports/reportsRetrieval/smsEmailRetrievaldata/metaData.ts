import { isValid } from "date-fns/esm";
import { t } from "i18next";

export const SmsEmailRetrievalMetadata = {
  form: {
    name: "enterRetrievalParamaters",
    label: "EnterRetrievalParameters",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
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
      name: "A_FROM_DT",
      label: "FromDates",
      placeholder: "",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      // __EDIT__: { isReadOnly: true },
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
      isFieldFocused: true,
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "A_TO_DT",
      label: "ToDates",
      placeholder: "",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return t("Mustbeavaliddate");
        }
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.A_FROM_DT?.value)
        ) {
          return t("ToDateshouldbegreaterthanorequaltoFromDate");
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["A_FROM_DT"],
      runValidationOnDependentFieldsChange: true,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "A_STATUS",
      label: "Status",
      fullWidth: true,
      placeholder: "",
      defaultOptionLabel: "SelectStatus",
      type: "text",
      defaultValue: "ALL",
      options: [
        { label: "ALL", value: "ALL" },
        { label: "PENDING", value: "P" },
        { label: "SUCCCESS", value: "Y" },
        { label: "REJECTED", value: "R" },
      ],
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "A_FLAG",
      label: "OTPType",
      defaultValue: "S",
      defaultOptionLabel: "SelectOTPType",
      options: [
        { label: "SMS", value: "S" },
        { label: "EMAIL", value: "E" },
      ],
      validationRun: "onChange",
      postValidationSetCrossFieldValues: (field) => {
        return {
          A_FILTER_VALUE: {
            value: "",
          },
        };
      },
      fullWidth: true,
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "mobileNo",
      },
      name: "MOBILE_NO",
      label: "MobileNumber",
      fullWidth: true,
      autoComplete: "off",
      placeholder: "EnterMobileNumber",
      type: "text",
      dependentFields: ["A_FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_FLAG?.value === "S") {
          return false;
        } else {
          return true;
        }
      },
      validationRun: "onChange",
      postValidationSetCrossFieldValues: (field) => {
        return {
          A_FILTER_VALUE: {
            value: field?.value ?? "",
          },
        };
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "EMAIL_ID",
      label: "EmailID",
      fullWidth: true,
      placeholder: "EnterEmailID",
      type: "text",
      maxLength: 300,
      showMaxLength: true,
      dependentFields: ["A_FLAG"],
      autoComplete: "off",
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_FLAG?.value === "E") {
          return false;
        } else {
          return true;
        }
      },
      validationRun: "onChange",
      postValidationSetCrossFieldValues: (field) => {
        return {
          A_FILTER_VALUE: {
            value: field?.value ?? "",
          },
        };
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "email", params: ["EmailIDisinvalid"] }],
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "A_PAGE_NO",
      label: "PageNumber",
      fullWidth: true,
      placeholder: "EnterPageNumber",
      type: "text",
      defaultValue: 1,
      autoComplete: "off",
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
      name: "A_PAGE_SIZE",
      label: "PageSize",
      fullWidth: true,
      placeholder: "EnterPageSize",
      type: "text",
      defaultValue: 100,
      autoComplete: "off",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "A_FILTER_VALUE",
      label: "Default Value",
    },
  ],
};
