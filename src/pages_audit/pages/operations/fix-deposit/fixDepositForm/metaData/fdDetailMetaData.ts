import { format, isValid } from "date-fns";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "../../api";
import {
  greaterThanDate,
  utilFunction,
  lessThanInclusiveDate,
} from "@acuteinfo/common-base";
import { validateHOBranch } from "components/utilFunction/function";

export const FixDepositDetailFormMetadata = {
  form: {
    name: "fixDepositDetail",
    label: "",
    resetFieldOnUnmount: false,
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
        componentType: "spacer",
      },
      name: "TOTAL_FIELD_SPACE",
      GridProps: { xs: 2.2, sm: 7, md: 8, lg: 10, xl: 10 },
      __NEW__: {
        GridProps: { xs: 12, sm: 5, md: 6.2, lg: 9, xl: 9 },
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_FD_AMOUNT",
      label: "Total FD Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      dependentFields: ["FDDTL"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let amount = (
          Array.isArray(dependentFieldsValues?.["FDDTL"])
            ? dependentFieldsValues?.["FDDTL"]
            : []
        ).reduce(
          (accum, obj) =>
            accum +
            Number(obj?.CASH_AMT?.value ?? 0) +
            Number(obj?.TRSF_AMT?.value ?? 0),
          0
        );
        return amount ?? "0";
      },
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      GridProps: { xs: 9.8, sm: 5, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "ADDNEWROW",
      label: "AddRow",
      placeholder: "",
      iconStyle: {
        fontSize: "25px !important",
      },
      shouldExclude: () => {
        return true;
      },
      __NEW__: {
        shouldExclude: () => {
          return false;
        },
        GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1, xl: 1 },
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DOUBLE_FAC",

      __VIEW__: {
        ignoreInSubmit: true,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",
      __VIEW__: {
        ignoreInSubmit: true,
      },
    },
    {
      render: {
        componentType: "arrayField",
      },
      __NEW__: {
        isDisplayCount: true,
        isScreenStyle: true,
        isRemoveButton: true,
      },
      name: "FDDTL",
      fixedRows: true,
      isDisplayCount: false,
      isScreenStyle: false,
      isRemoveButton: false,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            isReadOnly: true,
            options: () => {},
            _optionsKey: "",
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2, xl: 1.5 },
          },
          accountTypeMetadata: {
            options: () => {},
            _optionsKey: "",
            isReadOnly: true,
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2, xl: 1.5 },
          },
          accountCodeMetadata: {
            postValidationSetCrossFieldValues: () => {},
            isReadOnly: true,
            fullWidth: true,
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2, xl: 1.5 },
          },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "FD_NO",
          label: "FD Number",
          className: "textInputFromRight",
          placeholder: "",
          autoComplete: "off",
          maxLength: 10,
          dependentFields: ["FD_NO_DISABLED"],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.FD_NO_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          FormatProps: {
            allowNegative: false,
            isAllowed: (values) => {
              if (values?.value?.length > 10) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2, xl: 1.5 },
        },

        {
          render: {
            componentType: "datePicker",
          },
          name: "TRAN_DT",
          label: "AsOn Date",
          placeholder: "",
          type: "text",
          autoComplete: "off",
          format: "dd/MM/yyyy",
          defaultValue: new Date(),
          fullWidth: true,
          maxDate: new Date(),
          required: true,
          dependentFields: [
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "PERIOD_NO",
            "PERIOD_CD",
            "TRSF_AMT",
            "TRAN_DT_DISABLED",
            "FROM_TRAN_DT",
            "MATURITY_DT",
            "CASH_AMT",
          ],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.TRAN_DT_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            if (formState?.isSubmitting) return {};
            let postData = await API.getFDIntRate(
              currField,
              dependentFields,
              auth
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["AsOn Date is required."] },
              { name: "TRAN_DT", params: ["AsOn Date is required."] },
            ],
          },
          validate: (currentField, dependentFields, formState) => {
            if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
              return "Mustbeavaliddate";
            }
            let currentFieldDate = currentField?.value
              ? format(new Date(currentField?.value), "dd/MMM/yyyy")
              : "";
            let workingDt = formState?.workingDate
              ? format(new Date(formState?.workingDate), "dd/MMM/yyyy")
              : "";
            if (currentFieldDate > workingDt) {
              return "AsOn date should be less than or equal to working date.";
            }
            return "";
          },
          FormatProps: {
            allowNegative: false,
          },
          __VIEW__: {
            isReadOnly: true,
            validate: () => {},
            postValidationSetCrossFieldValues: () => {},
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.9, xl: 1.5 },
        },

        {
          render: {
            componentType: "select",
          },
          name: "PERIOD_CD",
          label: "Period/Tenor",
          dependentFields: [
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_NO",
            "TRSF_AMT",
            "MATURITY_DT",
            "CASH_AMT",
          ],
          options: (dependentValue, formState, _, authState) => {
            if (
              authState?.companyID &&
              formState?.docCD &&
              formState?.ACCT_TYPE &&
              formState?.BRANCH_CD
            ) {
              return API.getPeriodDDWData({
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: formState?.BRANCH_CD ?? "",
                ACCT_TYPE: formState?.ACCT_TYPE ?? "",
                SCREEN_REF: formState?.docCD ?? "",
              });
            }
            return [];
          },
          _optionsKey: "getPeriodDDWData",
          defaultValueKey: "tenorDefaultVal",
          required: true,
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            if (formState?.isSubmitting) return {};
            let postData = await API.getFDIntRate(
              currField,
              dependentFields,
              auth
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Period/Tenor is required."] },
              { name: "PERIOD_CD", params: ["Please select Period/Tenor"] },
            ],
          },
          __VIEW__: {
            isReadOnly: true,
            schemaValidation: {},
            postValidationSetCrossFieldValues: () => {},
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.1, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PERIOD_NO",
          label: "Tenor",
          className: "textInputFromRight",
          placeholder: "Enter Tenor",
          autoComplete: "off",
          maxLength: 5,
          FormatProps: {
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
          required: true,
          dependentFields: [
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_CD",
            "TRSF_AMT",
            "MATURITY_DT",
            "CASH_AMT",
          ],
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            if (formState?.isSubmitting) return {};
            let postData = await API.getFDIntRate(
              currField,
              dependentFields,
              auth
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Tenor is Required."] }],
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.2, xl: 1.5 },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "INT_RATE",
          label: "Interest Rate",
          required: true,
          type: "text",
          autoComplete: "off",
          dependentFields: [
            "INT_RATE_DISABLED",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_CD",
            "TRSF_AMT",
            "MATURITY_DT",
            "CASH_AMT",
            "TERM_CD",
            "PERIOD_NO",
          ],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.INT_RATE_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            if (formState?.isSubmitting) return {};
            let postData = await API.getFDMaturityAmt(
              currField,
              dependentFields,
              auth
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Rate is Required."] },
            ],
          },
          FormatProps: {
            placeholder: "0.00",
            isAllowed: (values) => {
              if (values?.floatValue > 100) {
                return false;
              }
              if (values?.value?.length > 6) {
                return false;
              }
              return true;
            },
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.7, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "TERM_CD",
          label: "Interest Term",
          options: API.getFDIntTermDDWData,
          _optionsKey: "getFDIntTermDDWData",
          required: true,
          dependentFields: [
            "TERM_CD_DISABLED",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_CD",
            "TRSF_AMT",
            "MATURITY_DT",
            "CASH_AMT",
            "INT_RATE",
            "PERIOD_NO",
          ],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.TERM_CD_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            if (formState?.isSubmitting) return {};
            let postData = await API.getFDMaturityAmt(
              currField,
              dependentFields,
              auth
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Term is required."] },
              { name: "TERM_CD", params: ["Please select Interest Term"] },
            ],
          },
          __VIEW__: {
            isReadOnly: true,
            schemaValidation: {},
            postValidationSetCrossFieldValues: () => {},
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.7, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MONTHLY_INT",
          label: "Month Interest",
          dependentFields: ["TERM_CD"],
          isReadOnly: true,
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (dependentFieldsValues?.["FDDTL.TERM_CD"]?.value === "M") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.9, xl: 1.5 },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "MONTHLY_INT_EXCLUDE",
          dependentFields: ["TERM_CD"],
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (dependentFieldsValues?.["FDDTL.TERM_CD"]?.value === "M") {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.9, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "MATURITY_DT",
          label: "Maturity Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.9, xl: 1.5 },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "CASH_AMT",
          label: "Cash",
          placeholder: "",
          type: "text",
          autoComplete: "off",
          dependentFields: [
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "MATURITY_DT",
            "TRAN_DT",
            "PERIOD_CD",
            "PERIOD_NO",
            "SPL_AMT",
            "DEP_FAC",
            "TRSF_AMT",
            "AGG_DEP_CUSTID",
          ],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};

            if (
              Number(dependentFieldsValues?.["FDDTL.AGG_DEP_CUSTID"]?.value) >
                0 ||
              dependentFieldsValues?.["FDDTL.SPL_AMT"]?.value?.trim() === "Y"
            ) {
              if (
                dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value &&
                dependentFieldsValues?.["FDDTL.ACCT_TYPE"]?.value &&
                dependentFieldsValues?.["FDDTL.ACCT_CD"]?.value
              ) {
                const reqParameters = {
                  A_COMP_CD: authState?.companyID ?? "",
                  A_BRANCH_CD:
                    dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value ?? "",
                  A_ACCT_TYPE:
                    dependentFieldsValues?.["FDDTL.ACCT_TYPE"]?.value ?? "",
                  A_ACCT_CD:
                    dependentFieldsValues?.["FDDTL.ACCT_CD"]?.value ?? "",
                  A_BASE_BRANCH: authState?.user?.branchCode ?? "",
                  A_CATEG_CD:
                    dependentFieldsValues?.["FDDTL.CATEG_CD"]?.value ?? "",
                  A_MATURITY_DT: dependentFieldsValues?.["FDDTL.MATURITY_DT"]
                    ?.value
                    ? format(
                        dependentFieldsValues?.["FDDTL.MATURITY_DT"]?.value,
                        "dd-MMM-yyyy"
                      )
                    : "",
                  A_TRAN_DT: dependentFieldsValues?.["FDDTL.TRAN_DT"]?.value
                    ? format(
                        dependentFieldsValues?.["FDDTL.TRAN_DT"]?.value,
                        "dd-MMM-yyyy"
                      )
                    : "",
                  A_PERIOD_CD:
                    dependentFieldsValues?.["FDDTL.PERIOD_CD"]?.value ?? "",
                  A_PERIOD_NO:
                    dependentFieldsValues?.["FDDTL.PERIOD_NO"]?.value ?? "",
                  A_CASH_AMT: currentField?.value ?? "",
                  A_TRSF_AMT:
                    dependentFieldsValues?.["FDDTL.TRSF_AMT"]?.value ?? "",
                  A_SPL_AMT:
                    dependentFieldsValues?.["FDDTL.SPL_AMT"]?.value ?? "",
                  A_DEP_FAC:
                    dependentFieldsValues?.["FDDTL.DEP_FAC"]?.value ?? "",
                  A_AGG_DEP_CUSTID:
                    dependentFieldsValues?.["FDDTL.AGG_DEP_CUSTID"]?.value ??
                    "",
                  WORKING_DATE: authState?.workingDate,
                };
                const postData = await API.validateFDDepAmt(reqParameters);
                if (postData?.[0]?.O_STATUS === "999") {
                  return {
                    INT_RATE: { value: "" },
                    CASH_AMT: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                } else if (postData?.[0]?.O_STATUS === "0") {
                  return {
                    INT_RATE: {
                      value: postData?.[0]?.INT_RATE ?? "",
                    },
                    CASH_AMT: {
                      value: currentField?.value,
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
            }
            return {};
          },
          isReadOnly(_, dependentFieldsValues, formState) {
            return Boolean(formState?.openDepositForRenew) ? true : false;
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TRSF_AMT",
          label: "Transfer Amount",
          placeholder: "",
          autoComplete: "off",
          type: "text",
          dependentFields: [
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "MATURITY_DT",
            "TRAN_DT",
            "PERIOD_CD",
            "PERIOD_NO",
            "SPL_AMT",
            "DEP_FAC",
            "CASH_AMT",
            "AGG_DEP_CUSTID",
          ],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};

            if (
              Number(dependentFieldsValues?.["FDDTL.AGG_DEP_CUSTID"]?.value) >
                0 ||
              dependentFieldsValues?.["FDDTL.SPL_AMT"]?.value?.trim() === "Y"
            ) {
              if (
                dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value &&
                dependentFieldsValues?.["FDDTL.ACCT_TYPE"]?.value &&
                dependentFieldsValues?.["FDDTL.ACCT_CD"]?.value
              ) {
                const reqParameters = {
                  A_COMP_CD: authState?.companyID ?? "",
                  A_BRANCH_CD:
                    dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value ?? "",
                  A_ACCT_TYPE:
                    dependentFieldsValues?.["FDDTL.ACCT_TYPE"]?.value ?? "",
                  A_ACCT_CD:
                    dependentFieldsValues?.["FDDTL.ACCT_CD"]?.value ?? "",
                  A_BASE_BRANCH: authState?.user?.branchCode ?? "",
                  A_CATEG_CD:
                    dependentFieldsValues?.["FDDTL.CATEG_CD"]?.value ?? "",
                  A_MATURITY_DT: dependentFieldsValues?.["FDDTL.MATURITY_DT"]
                    ?.value
                    ? format(
                        dependentFieldsValues?.["FDDTL.MATURITY_DT"]?.value,
                        "dd-MMM-yyyy"
                      )
                    : "",
                  A_TRAN_DT: dependentFieldsValues?.["FDDTL.TRAN_DT"]?.value
                    ? format(
                        dependentFieldsValues?.["FDDTL.TRAN_DT"]?.value,
                        "dd-MMM-yyyy"
                      )
                    : "",
                  A_PERIOD_CD:
                    dependentFieldsValues?.["FDDTL.PERIOD_CD"]?.value ?? "",
                  A_PERIOD_NO:
                    dependentFieldsValues?.["FDDTL.PERIOD_NO"]?.value ?? "",
                  A_CASH_AMT:
                    dependentFieldsValues?.["FDDTL.CASH_AMT"]?.value ?? "",
                  A_TRSF_AMT: currentField?.value ?? "",
                  A_SPL_AMT:
                    dependentFieldsValues?.["FDDTL.SPL_AMT"]?.value ?? "",
                  A_DEP_FAC:
                    dependentFieldsValues?.["FDDTL.DEP_FAC"]?.value ?? "",
                  A_AGG_DEP_CUSTID:
                    dependentFieldsValues?.["FDDTL.AGG_DEP_CUSTID"]?.value ??
                    "",
                  WORKING_DATE: authState?.workingDate,
                };
                const postData = await API.validateFDDepAmt(reqParameters);
                if (postData?.[0]?.O_STATUS === "999") {
                  return {
                    INT_RATE: { value: "" },
                    TRSF_AMT: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                } else if (postData?.[0]?.O_STATUS === "0") {
                  return {
                    INT_RATE: {
                      value: postData?.[0]?.INT_RATE ?? "",
                    },
                    TRSF_AMT: {
                      value: currentField?.value,
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
            }
            return {};
          },
          FormatProps: {
            allowNegative: false,
          },
          isReadOnly(_, dependentFieldsValues, formState) {
            return Boolean(formState?.openDepositForRenew) ? true : false;
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.8, xl: 1.5 },
        },

        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "CR_BRANCH_CD",
            label: "Credit A/c Branch",
            required: false,
            schemaValidation: {},
            validationRun: "onChange",
            runPostValidationHookAlways: true,
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              const isHOBranch = await validateHOBranch(
                currentField,
                formState?.MessageBox,
                authState
              );
              if (isHOBranch) {
                return {
                  CR_BRANCH_CD: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: false,
                  },
                };
              }
              return {
                CR_ACCT_TYPE: { value: "" },
                CR_ACCT_CD: { value: "", ignoreUpdate: false },
                CR_ACCT_NM: { value: "" },
              };
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (formState?.screenFlag === "openLienForm") {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "CR_ACCT_TYPE",
            label: "Credit A/c Type",
            required: false,
            validationRun: "onChange",
            schemaValidation: {},
            options: (dependentValue, formState, _, authState) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                USER_NAME: authState?.user?.id ?? "",
                DOC_CD: "FDINSTRCRTYPE",
              });
            },
            _optionsKey: "getCreditAccountType",
            runPostValidationHookAlways: true,
            dependentFields: ["CR_BRANCH_CD"],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              if (
                currentField?.value &&
                dependentFieldValues?.["FDDTL.CR_BRANCH_CD"]?.value?.length ===
                  0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: "Enter Account Branch.",
                  buttonNames: ["Ok"],
                  icon: "ERROR",
                });

                if (buttonName === "Ok") {
                  return {
                    CR_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                    CR_BRANCH_CD: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
              return {
                CR_ACCT_CD: { value: "", ignoreUpdate: false },
                CR_ACCT_NM: { value: "" },
              };
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (formState?.screenFlag === "openLienForm") {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "CR_ACCT_CD",
            label: "Credit A/c No.",
            required: false,
            schemaValidation: {},
            autoComplete: "off",
            dependentFields: ["CR_BRANCH_CD", "CR_ACCT_TYPE"],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              if (formState?.isSubmitting) return {};
              if (
                currentField?.value &&
                dependentFieldsValues?.["FDDTL.CR_ACCT_TYPE"]?.value?.length ===
                  0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: "Enter Account Type.",
                  buttonNames: ["Ok"],
                  icon: "ERROR",
                });

                if (buttonName === "Ok") {
                  return {
                    CR_ACCT_CD: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: false,
                    },
                    CR_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (
                currentField?.value &&
                dependentFieldsValues?.["FDDTL.CR_BRANCH_CD"]?.value &&
                dependentFieldsValues?.["FDDTL.CR_ACCT_TYPE"]?.value
              ) {
                const reqParameters = {
                  BRANCH_CD:
                    dependentFieldsValues?.["FDDTL.CR_BRANCH_CD"]?.value ?? "",
                  COMP_CD: authState?.companyID ?? "",
                  ACCT_TYPE:
                    dependentFieldsValues?.["FDDTL.CR_ACCT_TYPE"]?.value ?? "",
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    currentField?.value,
                    dependentFieldsValues?.["FDDTL.CR_ACCT_TYPE"]?.optionData ??
                      ""
                  ),
                  SCREEN_REF: "FD_CR_ACT",
                };
                let postData = await API.validateAccountAndGetDetail(
                  reqParameters
                );

                let btn99, returnVal;
                const getButtonName = async (obj) => {
                  let btnName = await formState.MessageBox(obj);
                  return { btnName, obj };
                };
                for (let i = 0; i < postData?.[0]?.MSG?.length; i++) {
                  if (postData?.[0]?.MSG?.[i]?.O_STATUS === "999") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE?.length
                        ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                        : "ValidationFailed",
                      message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                      icon: "ERROR",
                    });
                    returnVal = "";
                  } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "9") {
                    if (btn99 !== "No") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                          ?.length
                          ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                          : "Alert",
                        message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                        icon: "WARNING",
                      });
                    }
                    returnVal = postData[0];
                  } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "99") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE?.length
                        ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                        : "Confirmation",
                      message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                      icon: "CONFIRM",
                    });

                    btn99 = btnName;
                    if (btnName === "No") {
                      returnVal = "";
                    }
                  } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "0") {
                    if (btn99 !== "No") {
                      returnVal = postData[0];
                    } else {
                      returnVal = "";
                    }
                  }
                }
                btn99 = 0;
                return {
                  CR_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldsValues?.CR_ACCT_TYPE?.optionData
                          ),
                          isFieldFocused: false,
                          ignoreUpdate: true,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: false,
                        },
                  CR_ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                  },
                };
              } else if (!currentField?.value) {
                return {
                  CR_ACCT_NM: { value: "" },
                };
              }
              return {};
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (formState?.screenFlag === "openLienForm") {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 3, md: 1.8, lg: 2, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CR_ACCT_NM",
          label: "Credit A/c Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 5, md: 3.5, lg: 4, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MATURITY_AMT",
          label: "Maturity Amount",
          type: "text",
          autoComplete: "off",
          required: true,
          FormatProps: {
            allowNegative: false,
          },
          dependentFields: ["MATURITY_AMT_DISABLED"],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.MATURITY_AMT_DISABLED"]?.value ===
                "Y" ||
              formState?.screenFlag === "openLienForm"
            ) {
              return true;
            } else {
              return false;
            }
          },
          validate: (columnValue) => {
            if (!Boolean(columnValue.value)) {
              return "Maturity Amount is Required.";
            } else if (columnValue.value <= 0) {
              return "Maturity Amount must be greater than zero.";
            }
            return "";
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 4, md: 2.6, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "MATURE_INST",
          label: "Mature Instruction",
          options: (dependentValue, formState, _, authState) => {
            if (
              authState?.companyID &&
              authState?.user?.baseBranchCode &&
              formState?.ACCT_TYPE
            ) {
              return API.getMatureInstDDWData({
                COMP_CD: authState?.companyID ?? "",
                BASE_BRANCH_CD: authState?.user?.baseBranchCode ?? "",
                ACCT_TYPE: formState?.ACCT_TYPE ?? "",
              });
            }
            return [];
          },
          _optionsKey: "getMatureInstDDWData",
          defaultValueKey: "matureInstDefaultVal",
          fullWidth: true,
          schemaValidation: {
            type: "string",
            rules: [
              {
                name: "required",
                params: ["FD Mature Instruction is required."],
              },
              {
                name: "MATURE_INST",
                params: ["Please select FD Mature Instruction"],
              },
            ],
          },
          isReadOnly(fieldData, dependentFieldsValues, formState) {
            if (formState?.screenFlag === "openLienForm") {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 12, md: 4.1, lg: 4, xl: 2.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "FD_REMARK",
          label: "FD Remark",
          type: "text",
          autoComplete: "off",
          placeholder: "Enter FD Remark",
          isReadOnly(fieldData, dependentFieldsValues, formState) {
            if (formState?.screenFlag === "openLienForm") {
              return true;
            } else {
              return false;
            }
          },
          FormatProps: {
            allowNegative: false,
            isAllowed: (values) => {
              if (values?.value?.length < 5) {
                return false;
              }
              return true;
            },
          },
          fullWidth: true,
          GridProps: { xs: 12, sm: 12, md: 8, lg: 4, xl: 4 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NOMINEE_NM",
          label: "Nominee Name",
          type: "text",
          placeholder: "Enter Nominee Name",
          fullWidth: true,
          autoComplete: "off",
          GridProps: { xs: 12, sm: 12, md: 4, lg: 4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CATEG_CD",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "AGG_DEP_CUSTID",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "SPL_AMT",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "INT_RATE_DISABLED",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "MATURITY_AMT_DISABLED",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FD_NO_DISABLED",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TRAN_DT_DISABLED",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TERM_CD_DISABLED",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FROM_TRAN_DT",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TO_TRAN_DT",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "SPL_AMT",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "AGG_DEP_CUSTID",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "DOUBLE_TRAN",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "MIN_AMT",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "MAX_AMT",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "MIN_DAYS",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "MAX_DAYS",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "DEP_FAC",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "COMP_CD",
          __VIEW__: {
            ignoreInSubmit: true,
          },
        },

        {
          render: {
            componentType: "divider",
          },
          name: "LienSection",
          label: "Lien",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },

        {
          render: { componentType: "select" },
          name: "LIEN_FLAG",
          label: "Lien",
          options: [
            { label: "No", value: "V" },
            { label: "Yes", value: "S" },
            { label: "N/A", value: "Y" },
          ],
          defaultValue: "S",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 0.8, xl: 0.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMARK",
          label: "Remark",
          type: "text",
          fullWidth: true,
          autoComplete: "off",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 5, md: 5, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "LEAN_COMP_CD",
          label: "Bank Code",
          type: "text",
          isReadOnly: true,
          autoComplete: "off",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 0.7, xl: 0.7 },
        },
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            name: "LEAN_BRANCH_CD",
            fullWidth: true,
            isFieldFocused: true,
            runPostValidationHookAlways: true,
            validationRun: "onChange",
            dependentFields: ["LIEN_FLAG"],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              const isHOBranch = await validateHOBranch(
                currentField,
                formState?.MessageBox,
                authState
              );
              if (isHOBranch) {
                return {
                  LEAN_BRANCH_CD: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: false,
                  },
                };
              }
              return {
                LEAN_ACCT_TYPE: { value: "" },
                LEAN_ACCT_CD: { value: "", ignoreUpdate: false },
                ACCT_NM: { value: "" },
              };
            },
            shouldExclude: (_, dependentFieldsValues, formState) => {
              if (formState?.screenFlag === "openLienForm") {
                return false;
              } else {
                return true;
              }
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDDTL.LIEN_FLAG"]?.value === "V" ||
                dependentFieldsValues?.["FDDTL.LIEN_FLAG"]?.value === "Y"
              ) {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "LEAN_ACCT_TYPE",
            dependentFields: ["LEAN_BRANCH_CD", "LIEN_FLAG"],
            options: (dependentValue, formState, _, authState) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                USER_NAME: authState?.user?.id ?? "",
                DOC_CD: "FD_LIEN",
              });
            },
            _optionsKey: "getCreditAccountType",
            runPostValidationHookAlways: true,
            validationRun: "onChange",
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              if (
                currentField?.value &&
                dependentFieldValues?.["FDDTL.LEAN_BRANCH_CD"]?.value
                  ?.length === 0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: "Enter Account Branch.",
                  buttonNames: ["Ok"],
                  icon: "ERROR",
                });

                if (buttonName === "Ok") {
                  return {
                    LEAN_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                    LEAN_BRANCH_CD: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
              return {
                LEAN_ACCT_CD: { value: "", ignoreUpdate: false },
                ACCT_NM: { value: "" },
              };
            },
            fullWidth: true,
            shouldExclude: (_, dependentFieldsValues, formState) => {
              if (formState?.screenFlag === "openLienForm") {
                return false;
              } else {
                return true;
              }
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDDTL.LIEN_FLAG"]?.value === "V" ||
                dependentFieldsValues?.["FDDTL.LIEN_FLAG"]?.value === "Y"
              ) {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "LEAN_ACCT_CD",
            autoComplete: "off",
            dependentFields: ["LEAN_ACCT_TYPE", "LEAN_BRANCH_CD", "LIEN_FLAG"],
            runPostValidationHookAlways: true,
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              if (formState?.isSubmitting) return {};

              if (
                currentField.value &&
                dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]?.value
                  ?.length === 0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: "Enter Account Type.",
                  buttonNames: ["Ok"],
                  icon: "ERROR",
                });

                if (buttonName === "Ok") {
                  return {
                    LEAN_ACCT_CD: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: false,
                    },
                    LEAN_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (
                currentField?.value &&
                dependentFieldsValues?.["FDDTL.LEAN_BRANCH_CD"]?.value &&
                dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]?.value
              ) {
                const reqParameters = {
                  BRANCH_CD:
                    dependentFieldsValues?.["FDDTL.LEAN_BRANCH_CD"]?.value ??
                    "",
                  COMP_CD: authState?.companyID ?? "",
                  ACCT_TYPE:
                    dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]?.value ??
                    "",
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    currentField?.value,
                    dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]?.optionData
                  ),
                  SCREEN_REF: "FD_LIEN",
                };
                let postData = await GeneralAPI.getAccNoValidation(
                  reqParameters
                );

                let btn99, returnVal;
                const getButtonName = async (obj) => {
                  let btnName = await formState.MessageBox(obj);
                  return { btnName, obj };
                };
                for (let i = 0; i < postData?.MSG?.length; i++) {
                  if (postData?.MSG?.[i]?.O_STATUS === "999") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: postData?.MSG?.[i]?.O_MSG_TITLE?.length
                        ? postData?.MSG?.[i]?.O_MSG_TITLE
                        : "ValidationFailed",
                      message: postData?.MSG?.[i]?.O_MESSAGE ?? "",
                      icon: "ERROR",
                    });
                    returnVal = "";
                  } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                    if (btn99 !== "No") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: postData?.MSG?.[i]?.O_MSG_TITLE?.length
                          ? postData?.MSG?.[i]?.O_MSG_TITLE
                          : "Alert",
                        message: postData?.MSG?.[i]?.O_MESSAGE ?? "",
                        icon: "WARNING",
                      });
                    }
                    returnVal = postData;
                  } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: postData?.MSG?.[i]?.O_MSG_TITLE?.length
                        ? postData?.MSG?.[i]?.O_MSG_TITLE
                        : "Confirmation",
                      message: postData?.MSG?.[i]?.O_MESSAGE ?? "",
                      buttonNames: ["Yes", "No"],
                      icon: "CONFIRM",
                    });

                    btn99 = btnName;
                    if (btnName === "No") {
                      returnVal = "";
                    }
                  } else if (postData?.MSG?.[i]?.O_STATUS === "0") {
                    if (btn99 !== "No") {
                      returnVal = postData;
                    } else {
                      returnVal = "";
                    }
                  }
                }
                btn99 = 0;
                return {
                  LEAN_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]
                              ?.optionData
                          ),
                          isFieldFocused: false,
                          ignoreUpdate: true,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: false,
                        },
                  LEAN_ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                  },
                };
              } else if (!currentField?.value) {
                return {
                  LEAN_ACCT_NM: { value: "" },
                };
              }
              return {};
            },
            fullWidth: true,
            shouldExclude: (_, dependentFieldsValues, formState) => {
              if (formState?.screenFlag === "openLienForm") {
                return false;
              } else {
                return true;
              }
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDDTL.LIEN_FLAG"]?.value === "V" ||
                dependentFieldsValues?.["FDDTL.LIEN_FLAG"]?.value === "Y"
              ) {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
          },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "LEAN_ACCT_NM",
          label: "AccountName",
          type: "text",
          isReadOnly: true,
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
        },
      ],
    },
  ],
};
