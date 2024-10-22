// import { GetMiscValue } from "../../staticReports/api";

import { isValid } from "date-fns/esm";
import { GetMiscValue } from "../../api";
import { t } from "i18next";

export const VirtualCardReqRetrievalMetadata = {
  form: {
    name: "enterVirtualCardRetrievalPara",
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
        componentType: "radio",
      },
      name: "A_PRODUCT_TYPE",
      label: "ProductType",
      RadioGroupProps: { row: true },
      defaultValue: "BOTH",
      options: [
        {
          label: "Both",
          value: "BOTH",
        },
        { label: "Debit Card", value: "DEBIT CARD" },
        { label: "Prepaid Card", value: "PREPAID CARD" },
      ],
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
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
  ],
};
