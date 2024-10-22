import { isValid } from "date-fns/esm";
import {
  getDynamicBillerList,
  getDynamicbillerSubCategorylist,
} from "../../staticReports/api";
import { t } from "i18next";
export const utilityRetrievalMetadata = {
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
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
      required: true,
      isFieldFocused: true,
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
      onFocus: (date) => {
        date.target.select();
      },
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
      name: "SUB_CATEGORY_ID",
      label: "Category",
      placeholder: "",
      defaultOptionLabel: "SelectCategory",
      enableDefaultOption: true,
      options: () => getDynamicbillerSubCategorylist(),
      _optionsKey: "getDynamicbillerSubCategorylist",
      defaultValue: "",
      fullWidth: true,
      postValidationSetCrossFieldValues: (currentField) => {
        if (Boolean(currentField?.value)) {
          return {
            BILLER_ID: { value: "" },
          };
        }
      },
      // validate: "getValidateValue",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: { componentType: "select" },
      name: "BILLER_ID",
      label: "BillerName",
      defaultOptionLabel: "SelectBillerName",
      enableDefaultOption: true,
      fullWidth: true,
      options: (value) => {
        if (value?.SUB_CATEGORY_ID?.value) {
          return getDynamicBillerList(value?.SUB_CATEGORY_ID?.value);
        }
        return [];
      },
      _optionsKey: "getDynamicBillerList",
      dependentFields: ["SUB_CATEGORY_ID"],
      disableCaching: true,
      maxLength: 300,
      showMaxLength: false,
      GridProps: { xs: 12, md: 6, sm: 6 },
      autoComplete: "off",
    },
    {
      render: {
        componentType: "select",
      },
      name: "A_STATUS",
      label: "TrnStatus",
      fullWidth: true,
      placeholder: "",
      defaultOptionLabel: "SelectTrnStatus",
      type: "text",
      defaultValue: "ALL",
      options: [
        { label: "ALL", value: "ALL" },
        { label: "SUCCCESS", value: "Y" },
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
      name: "USER_NAME",
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
