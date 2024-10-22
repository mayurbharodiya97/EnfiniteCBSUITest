// import { GetMiscValue } from "../../staticReports/api";
import { isValid } from "date-fns/esm";
import { GetMiscValue } from "../../api";
import { t } from "i18next";
export const FundTrfRetrievalMetadata = {
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
      required: true,
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
        componentType: "amountField",
      },
      name: "A_FR_AMT",
      label: "FromAmounts",
      fullWidth: true,
      placeholder: "0.00",
      autoComplete: "off",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "A_TO_AMT",
      label: "ToAmounts",
      fullWidth: true,
      placeholder: "0.00",
      autoComplete: "off",
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
      name: "A_TRN_TYPE",
      label: "TransactionType",
      placeholder: "",
      defaultOptionLabel: "SelectTransactionType",
      enableDefaultOption: true,
      options: () => GetMiscValue("FUND_TRAN"),
      _optionsKey: "GetMiscValue",
      defaultValue: "",
      fullWidth: true,
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
      label: "TransactionStatus",
      fullWidth: true,
      placeholder: "",
      defaultOptionLabel: "SelectTransactionStatus",
      type: "text",
      defaultValue: "ALL",
      options: [
        { label: "ALL", value: "ALL" },
        { label: "SUCCESS", value: "Y" },
        { label: "PENDING", value: "P" },
        { label: "FAILED", value: "F" },
        { label: "PROCESSING", value: "S" },
        { label: "AUTHORIZED", value: "A" },
      ],
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "loginID",
      },
      name: "A_CUSTOM_USER_NM",
      label: "LoginID",
      fullWidth: true,
      placeholder: "EnterLoginID",
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
