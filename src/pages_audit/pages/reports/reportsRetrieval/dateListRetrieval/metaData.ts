import { isValid } from "date-fns/esm";
import { t } from "i18next";

export const PaymentDetailsRetrievalMetadata = {
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
        componentType: "datePicker",
      },
      name: "FROM_DT",
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
      // dependentFields: ["TO_DT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: {
      //   conditions: {
      //     all: [
      //       {
      //         fact: "dependentFields",
      //         path: "TO_DT.datePicker",
      //         operator: "greaterThanInclusiveDate",
      //         value: { fact: "currentField", path: "TO_DT.datePicker" },
      //       },
      //     ],
      //   },
      //   success: "",
      //   failure: "From Date should be less than or equal To Date.",
      // },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TO_DT",
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
          new Date(dependentField?.FROM_DT?.value)
        ) {
          return t("ToDateshouldbegreaterthanorequaltoFromDate");
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["FROM_DT"],
      runValidationOnDependentFieldsChange: true,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
  ],
};
