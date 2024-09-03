import { format, isValid } from "date-fns";
import { t } from "i18next";
import {
  getDueDate,
  getFinalInstallment,
  getLoanInterestAmount,
  getNoOfInstallment,
  getRescheduleDropDown,
  getRescheduleLoanInterestAmount,
} from "../api";

export const LoanRegenerateFormMetaData = {
  form: {
    name: "loanRegenerateForm",
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
      amountField: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "amountField",
      },
      name: "SANCTIONED_AMT",
      label: "Sanctioned Amount",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 4, md: 3.5, lg: 3.5, xl: 3.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "Disbursed Amount",
      type: "text",
      maxLength: 15,
      fullWidth: true,
      isFieldFocused: true,
      dependentFields: ["INT_RATE", "INST_NO", "TYPE_CD", "INSTALLMENT_TYPE"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        const formattedValue = parseFloat(
          formState?.dtlData?.LIMIT_AMOUNT || 0
        ).toFixed(2);

        if (formattedValue === currentField?.value) {
          if (!formState.flag) {
            formState.flag = true;
            return {};
          }
        }
        if (currentField?.displayValue.trim() === "") {
          return {};
        }
        if (
          currentField?.value &&
          dependentFieldsValues?.["INT_RATE"]?.value &&
          dependentFieldsValues?.["INST_NO"]?.value &&
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value &&
          formState?.flag === true
        ) {
          const reqParams = {
            LIMIT_AMOUNT: currentField?.value ?? "",
            INT_RATE: dependentFieldsValues?.["INT_RATE"]?.value ?? "",
            INST_NO: dependentFieldsValues?.["INST_NO"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          formState?.handleInterestAmountFlag(true);
          const getApiData = await getLoanInterestAmount(reqParams);

          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {};
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3.5, lg: 3.5, xl: 3.5 },
    },
    {
      render: { componentType: "datePicker" },
      name: "INS_START_DT",
      label: "Installment Start Date",
      placeholder: "",
      validate: (currentField, dependentFields, formState) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "Interest Rate",
      fullWidth: true,
      required: true,
      maxLength: 5,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Interest Rate is Required"] }],
      },
      dependentFields: [
        "LIMIT_AMOUNT",
        "INST_NO",
        "TYPE_CD",
        "INSTALLMENT_TYPE",
      ],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.displayValue.trim() === "") {
          return {};
        }
        if (
          currentField?.value &&
          dependentFieldsValues?.["LIMIT_AMOUNT"]?.value &&
          dependentFieldsValues?.["INST_NO"]?.value &&
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value
        ) {
          const reqParams = {
            INT_RATE: currentField?.value ?? "",
            LIMIT_AMOUNT: dependentFieldsValues?.["LIMIT_AMOUNT"]?.value ?? "",
            INST_NO: dependentFieldsValues?.["INST_NO"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          const getApiData = await getLoanInterestAmount(reqParams);
          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {};
        }
      },
      FormatProps: {
        isAllowed: (values) => {
          //@ts-ignore
          if (values.floatValue > 99.99) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "datePicker" },
      name: "INST_DUE_DT",
      label: "Due Date",
      placeholder: "",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4.5, md: 3, lg: 3, xl: 3 },
    },
    {
      render: { componentType: "datePicker" },
      name: "RATE_WEF",
      label: "W.E.F.",
      placeholder: "",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4.5, md: 3, lg: 3, xl: 3 },
    },
    {
      render: { componentType: "numberFormat" },
      name: "INST_NO",
      label: "No. of Installment",
      placeholder: "",
      fullWidth: true,
      maxLength: 5,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["No. of Installment is Required"] },
        ],
      },
      dependentFields: [
        "LIMIT_AMOUNT",
        "INT_RATE",
        "TYPE_CD",
        "INSTALLMENT_TYPE",
        "INS_START_DT",
      ],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.displayValue.trim() === "") {
          return {};
        }
        if (
          currentField?.value &&
          dependentFieldsValues?.["INT_RATE"]?.value &&
          dependentFieldsValues?.["LIMIT_AMOUNT"]?.value &&
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value &&
          dependentFieldsValues?.["INS_START_DT"]?.value
        ) {
          const reqParams = {
            INST_NO: currentField?.value ?? "",
            INT_RATE: dependentFieldsValues?.["INT_RATE"]?.value ?? "",
            LIMIT_AMOUNT: dependentFieldsValues?.["LIMIT_AMOUNT"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          const getApiData = await getLoanInterestAmount(reqParams);
          const reqestParams = {
            INST_NO: currentField?.value ?? "",
            INST_START_DATE: dependentFieldsValues?.["INS_START_DT"]?.value
              ? format(
                  new Date(dependentFieldsValues?.["INS_START_DT"]?.value),
                  "dd/MMM/yyyy"
                )
              : "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          const getDataForDueDate = await getDueDate(reqestParams);
          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
            INST_DUE_DT: {
              value: getDataForDueDate?.[0]?.DUE_DATE ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {};
        }
      },

      GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: { componentType: "amountField" },
      name: "INST_RS",
      label: "Installment Amount",
      placeholder: "",
      fullWidth: true,
      maxLength: 15,
      required: true,
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (formState?.rows?.[0]?.REG_INST_AMT_DISABLE === "Y") {
          return true;
        } else {
          return false;
        }
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Installment Amount is Required"] },
        ],
      },
      GridProps: { xs: 12, sm: 6, md: 3.5, lg: 3.5, xl: 3.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "INSTALLMENT_TYPE",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
      label: "",
      placeholder: "",
    },
  ],
};

export const LoanRescheduleFormMetaData = {
  form: {
    name: "loanRescheduleForm",
    label: "Account Loan Schedule Rate Change",
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
      amountField: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "datePicker",
      },
      name: "INST_START_DT",
      label: "Installment Start Date",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "RATE_WEF",
      label: "Effective Date",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "INST_DUE_DT",
      label: "Due Date",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "OVERDUE_AMT",
      label: "Over Due",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "OUTSTANDING_BAL",
      label: "Outstanding",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "IDEAL_BALANCE",
      label: "Ideal Balance",
      fullWidth: true,
      isReadOnly: true,
      FormatProps: {
        allowNegative: true,
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
      },
      label: "",
      name: "loanReschedule",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "EMI_AMT_CHANGE",
      label: "Change Tenure",
      defaultValue: false,
      fullWidth: true,
      isFieldFocused: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
      },
      validationRun: "onChange",
      GridProps: { xs: 6, sm: 3, md: 2.5, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "Interest Rate",
      fullWidth: true,
      required: true,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Interest Rate is Required"] }],
      },
      dependentFields: [
        "IDEAL_ACTUAL",
        "IDEAL_BALANCE",
        "OUTSTANDING_BAL",
        "OUT_SUBSIDY",
        "TYPE_CD",
        "FINAL_INST_NO",
        "INSTALLMENT_TYPE",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (currentField?.value === "") {
          formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
        }
        if (currentField?.displayValue.trim() === "") {
          return {};
        }
        const formattedValue = parseFloat(
          formState?.headerData[0]?.INT_RATE || 0
        ).toFixed(2);

        if (formattedValue === currentField?.value) {
          if (!formState.flag) {
            formState.flag = true;
            return {};
          }
        }

        formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
        if (
          currentField?.value &&
          dependentFieldsValues?.["IDEAL_ACTUAL"]?.value &&
          dependentFieldsValues?.["IDEAL_BALANCE"]?.value &&
          dependentFieldsValues?.["OUTSTANDING_BAL"]?.value &&
          dependentFieldsValues?.["OUT_SUBSIDY"]?.value &&
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["FINAL_INST_NO"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value
        ) {
          const reqParams = {
            IDEAL_ACTUAL: dependentFieldsValues?.["IDEAL_ACTUAL"]?.value ?? "",
            IDEAL_BALANCE:
              dependentFieldsValues?.["IDEAL_BALANCE"]?.value ?? "",
            OUTSTANDING_BAL:
              dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
            OUT_SUBSIDY: dependentFieldsValues?.["OUT_SUBSIDY"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            FINAL_INST_NO:
              dependentFieldsValues?.["FINAL_INST_NO"]?.value ?? "",
            INT_RATE: currentField?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          formState.handleInterestRateFlag(true);
          const getApiData = await getRescheduleLoanInterestAmount(reqParams);
          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
            VALIDATE_INT_AMT: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
          return {};
        }
      },
      maxLength: 5,
      FormatProps: {
        isAllowed: (values) => {
          //@ts-ignore
          if (values.floatValue > 99.99) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      options: () => getRescheduleDropDown(),
      _optionsKey: "getRescheduleDropDown",
      defaultValue: "O",
      name: "IDEAL_ACTUAL",
      label: "Reschedule With",
      fullWidth: true,
      dependentFields: [
        "IDEAL_BALANCE",
        "OUTSTANDING_BAL",
        "OUT_SUBSIDY",
        "TYPE_CD",
        "FINAL_INST_NO",
        "INT_RATE",
        "INSTALLMENT_TYPE",
      ],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.displayValue.trim() === "") {
          return {};
        }
        if (
          currentField?.value &&
          dependentFieldsValues?.["INT_RATE"]?.value &&
          dependentFieldsValues?.["IDEAL_BALANCE"]?.value &&
          dependentFieldsValues?.["OUTSTANDING_BAL"]?.value &&
          dependentFieldsValues?.["OUT_SUBSIDY"]?.value &&
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["FINAL_INST_NO"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value
        ) {
          const reqParams = {
            INT_RATE: dependentFieldsValues?.["INT_RATE"]?.value ?? "",
            IDEAL_BALANCE:
              dependentFieldsValues?.["IDEAL_BALANCE"]?.value ?? "",
            OUTSTANDING_BAL:
              dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
            OUT_SUBSIDY: dependentFieldsValues?.["OUT_SUBSIDY"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            FINAL_INST_NO:
              dependentFieldsValues?.["FINAL_INST_NO"]?.value ?? "",
            IDEAL_ACTUAL: currentField?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          const getApiData = await getRescheduleLoanInterestAmount(reqParams);
          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {};
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 3, xl: 3 },
    },
    {
      render: { componentType: "amountField" },
      name: "INST_RS",
      label: "Installment Amount",
      placeholder: "",
      fullWidth: true,
      // maxLength: 15,
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Installment Amount is Required"] },
        ],
      },
      dependentFields: [
        "EMI_AMT_CHANGE",
        "VALIDATE_INT_AMT",
        "OUTSTANDING_BAL",
        "INT_RATE",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.value === "") {
          formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
        }
        const formattedValue = parseFloat(
          dependentFieldsValues?.["VALIDATE_INT_AMT"]?.value || 0
        ).toFixed(2);
        if (formattedValue === currentField?.value) {
          if (!formState.flag) {
            formState.flag = true;
            return {};
          }
        }
        formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
        if (
          Number(currentField?.value?.trim()) <
            Number(dependentFieldsValues?.["VALIDATE_INT_AMT"]?.value.trim()) &&
          !Boolean(dependentFieldsValues?.["EMI_AMT_CHANGE"]?.value)
        ) {
          const buttonName = await formState.MessageBox({
            messageTitle: "Validation Failed",
            message: "Installment Amount can not be reduced.",
            buttonNames: ["Ok"],
          });
          if (buttonName === "Ok") {
            return {
              INST_RS: {
                value: dependentFieldsValues?.["VALIDATE_INT_AMT"]?.value,
                ignoreUpdate: true,
              },
            };
          }
        } else if (Boolean(dependentFieldsValues?.["EMI_AMT_CHANGE"]?.value)) {
          const reqParams = {
            INST_RS: currentField?.value ?? "",
            OUTSTANDING_BAL:
              dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
            INT_RATE: dependentFieldsValues?.["INT_RATE"]?.value ?? "",
          };
          formState.handleInterestRateFlag(true);
          const getApiData = await getNoOfInstallment(reqParams);
          return {
            INST_NO: {
              value: getApiData?.[0]?.INST_NO ?? "",
              ignoreUpdate: true,
            },
            FINAL_INST_NO: {
              value: getApiData?.[0]?.INST_NO ?? "",
              ignoreUpdate: true,
            },
            VALIDATE_INT_AMT: {
              value: currentField?.value,
            },
          };
        } else {
          formState.setDataOnFieldChange("DELETE_DATA", {
            DELETE_DATA: true,
          });
          return {
            VALIDATE_INT_AMT: {
              value: currentField?.value,
            },
          };
        }
      },
      AlwaysRunPostValidationSetCrossFieldValues: (args) => {
        return {
          alwaysRun: Boolean(args["EMI_AMT_CHANGE"]?.value) ? false : true,
          touchAndValidate: Boolean(args["EMI_AMT_CHANGE"]?.value)
            ? false
            : true,
        };
      },
      GridProps: { xs: 12, sm: 3, md: 2.5, lg: 2.5, xl: 3 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "INST_NO",
      label: "No. of Installment",
      // maxLength: 5,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
      placeholder: "",
      type: "text",
      fullWidth: true,
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["No. of Installment is Required"] },
        ],
      },
      dependentFields: [
        "FINAL_INST_NO",
        "REMAINING_INST_NO",
        "IDEAL_ACTUAL",
        "IDEAL_BALANCE",
        "OUTSTANDING_BAL",
        "OUT_SUBSIDY",
        "TYPE_CD",
        "INT_RATE",
        "INSTALLMENT_TYPE",
      ],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.value === "") {
          formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
        }

        if (currentField?.displayValue.trim() === "") {
          return {};
        }
        formState.setDataOnFieldChange("DELETE_DATA", {
          DELETE_DATA: true,
        });
        if (
          currentField?.value &&
          dependentFieldsValues?.["REMAINING_INST_NO"]?.value &&
          dependentFieldsValues?.["IDEAL_ACTUAL"]?.value &&
          dependentFieldsValues?.["IDEAL_BALANCE"]?.value &&
          dependentFieldsValues?.["OUTSTANDING_BAL"]?.value &&
          dependentFieldsValues?.["OUT_SUBSIDY"]?.value &&
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value &&
          dependentFieldsValues?.["INT_RATE"]?.value
        ) {
          const reqParams = {
            INST_NO: currentField?.value ?? "",
            REMAINING_INST_NO:
              dependentFieldsValues?.["REMAINING_INST_NO"]?.value ?? "",
            ORG_INST_NO: formState?.headerData[0]?.INST_NO ?? "",
          };
          const getFinalInstallmentData = await getFinalInstallment(reqParams);
          const getFinalInstNumber = Boolean(
            getFinalInstallmentData?.[0]?.FINAL_INST_NO
          )
            ? getFinalInstallmentData?.[0]?.FINAL_INST_NO ?? ""
            : dependentFieldsValues?.["FINAL_INST_NO"]?.value ?? "";
          const installmentParams = {
            IDEAL_ACTUAL: dependentFieldsValues?.["IDEAL_ACTUAL"]?.value ?? "",
            IDEAL_BALANCE:
              dependentFieldsValues?.["IDEAL_BALANCE"]?.value ?? "",
            OUTSTANDING_BAL:
              dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
            OUT_SUBSIDY: dependentFieldsValues?.["OUT_SUBSIDY"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            FINAL_INST_NO: getFinalInstNumber ?? "",
            INT_RATE: dependentFieldsValues?.["INT_RATE"]?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };

          const getApiData = await getRescheduleLoanInterestAmount(
            installmentParams
          );

          return {
            FINAL_INST_NO: {
              value: getFinalInstallmentData?.[0]?.FINAL_INST_NO ?? "",
              ignoreUpdate: true,
            },
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          formState.setDataOnFieldChange("DELETE_DATA", {
            DELETE_DATA: true,
          });
          return {};
        }
      },
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "Enter Remarks",
      type: "text",
      required: true,
      txtTransform: "uppercase",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Remarks is Required"] }],
      },
      autoComplete: "off",
      GridProps: { xs: 12, sm: 9, md: 4.5, lg: 4, xl: 4 },
    },
    {
      render: { componentType: "numberFormat" },
      name: "FINAL_INST_NO",
      label: "Final Installment",
      placeholder: "",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "RESOLUTION_NO",
      label: "Resolution No.",
      type: "text",
      fullWidth: true,
      txtTransform: "uppercase",
      // maxLength: 25,
      autoComplete: "off",
      GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: { componentType: "amountField" },
      name: "SUBSIDY_AMT",
      label: "Subsidy",
      placeholder: "",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 2.5, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "PROCEED",
      label: "Proceed",
      type: "text",
      placeholder: "",
      iconStyle: {
        fontSize: "25px !important",
      },
      GridProps: { xs: 3, sm: 3, md: 2, lg: 1.5, xl: 1.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "OUT_SUBSIDY",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "INSTALLMENT_TYPE",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "VALIDATE_INT_AMT",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "REMAINING_INST_NO",
      label: "",
      placeholder: "",
    },
  ],
};
