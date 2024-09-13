import { format, isValid } from "date-fns";
import { t } from "i18next";
import {
  getDueDate,
  getFinalInstallment,
  getLoanInterestAmount,
  getNoOfInstallment,
  getRescheduleDropDown,
  getRescheduleLoanInterestAmount,
  updateInterestRate,
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
        componentType: "hidden",
      },
      name: "VALIDATE_LIMIT_AMT",
      label: "",
      placeholder: "",
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
      dependentFields: [
        "INT_RATE",
        "INST_NO",
        "TYPE_CD",
        "INSTALLMENT_TYPE",
        "SANCTIONED_AMT",
        "VALIDATE_LIMIT_AMT",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        const formattedValue = parseFloat(
          formState?.dtlData?.LIMIT_AMOUNT || 0
        ).toFixed(2);
        if (formattedValue === currentField?.value && !formState.flag) {
          return {};
        }
        if (
          Number(currentField?.value) >
          Number(dependentFieldsValues?.["SANCTIONED_AMT"]?.value)
        ) {
          const buttonName = await formState.MessageBox({
            messageTitle: "Validation Failed",
            message:
              "Disburse Amount can not be greater than Sanctioned Amount.",
            buttonNames: ["Ok"],
          });
          if (buttonName === "Ok") {
            return {
              LIMIT_AMOUNT: {
                value: dependentFieldsValues?.["VALIDATE_LIMIT_AMT"]?.value,
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
        } else if (
          currentField?.value &&
          Number(currentField?.value) <=
            Number(dependentFieldsValues?.["SANCTIONED_AMT"]?.value) &&
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value
        ) {
          const reqParams = {
            LIMIT_AMOUNT: currentField?.value ?? "",
            INT_RATE: dependentFieldsValues?.["INT_RATE"]?.value ?? "",
            INST_NO: dependentFieldsValues?.["INST_NO"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          const getApiData = await getLoanInterestAmount(reqParams);
          formState.flag = true;
          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
            VALIDATE_INT_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
            },
            VALIDATE_LIMIT_AMT: {
              value: currentField?.value ?? "",
            },
          };
        } else if (!currentField?.value) {
          return {
            INST_RS: {
              value: "",
              ignoreUpdate: true,
            },
            VALIDATE_LIMIT_AMT: {
              value: currentField?.value ?? "",
            },
          };
        }
      },
      FormatProps: {
        allowNegative: false,
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
        "RATE_WEF",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        const formattedValue = parseFloat(
          formState?.dtlData?.INT_RATE || 0
        ).toFixed(2);
        if (formattedValue === currentField?.value && !formState.intRateFlag) {
          return {};
        }
        if (
          currentField?.value &&
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
          formState.intRateFlag = true;
          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
            VALIDATE_INT_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
            },
            RATE_WEF: {
              value: authState?.workingDate
                ? format(new Date(authState?.workingDate), "dd/MMM/yyyy")
                : "",
            },
          };
        } else if (!currentField?.value) {
          return {
            INST_RS: {
              value: "",
              ignoreUpdate: true,
            },
            VALIDATE_INT_RS: {
              value: "",
            },
            RATE_WEF: {
              value: authState?.workingDate
                ? format(new Date(authState?.workingDate), "dd/MMM/yyyy")
                : "",
            },
          };
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
      autoComplete: "off",
      maxLength: 5,
      FormatProps: {
        allowNegative: false,
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
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (
          formState?.dtlData?.INST_NO === currentField?.value &&
          !formState.noOfInstFlag
        ) {
          return {};
        }
        formState.noOfInstFlag = true;
        if (
          dependentFieldsValues?.["TYPE_CD"]?.value &&
          dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value
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
            VALIDATE_INT_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
            },
            INST_DUE_DT: {
              value: getDataForDueDate?.[0]?.DUE_DATE ?? "",
              ignoreUpdate: true,
            },
          };
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
      dependentFields: ["VALIDATE_INT_RS"],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (
          Number(currentField?.value) <
          Number(dependentFieldsValues?.["VALIDATE_INT_RS"]?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "ValidationFailed",
            message: "Installment Amount can not be reduced.",
            buttonNames: ["Ok"],
          });
          if (buttonName === "Ok") {
            return {
              INST_RS: {
                value: dependentFieldsValues?.["VALIDATE_INT_RS"]?.value ?? "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
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
      name: "VALIDATE_INT_RS",
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
        componentType: "hidden",
      },
      name: "VALIDATE",
      label: "",
      placeholder: "",
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
      isFieldFocused: true,
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
        formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
        const formattedValue = parseFloat(
          formState?.headerData?.[0]?.INT_RATE || 0
        ).toFixed(2);
        if (formattedValue === currentField?.value && !formState.flag) {
          return {};
        }
        if (currentField?.value) {
          const reqParams = {
            IDEAL_ACTUAL: dependentFieldsValues?.["IDEAL_ACTUAL"]?.value ?? "",
            IDEAL_BALANCE:
              dependentFieldsValues?.["IDEAL_BALANCE"]?.value ?? "",
            OUTSTANDING_BAL:
              dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
            OUT_SUBSIDY: dependentFieldsValues?.["OUT_SUBSIDY"]?.value ?? "",
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
            FINAL_INST_NO:
              Number(dependentFieldsValues?.["FINAL_INST_NO"]?.value) > 0
                ? dependentFieldsValues?.["FINAL_INST_NO"]?.value
                : "0",
            INT_RATE:
              Number(currentField?.value) > 0 ? currentField?.value : "0",
            INSTALLMENT_TYPE:
              dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          };
          const getApiData = await getRescheduleLoanInterestAmount(reqParams);
          formState.flag = true;
          return {
            INST_RS: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
              // isFieldFocused: false,
            },
            VALIDATE_INT_AMT: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
            IDEAL_ACTUAL: {
              isFieldFocused: true,
              ignoreUpdate: true,
            },
            VALIDATE: {
              value: getApiData?.[0]?.INST_RS ?? "",
              ignoreUpdate: true,
            },
          };
        } else {
          return {
            INST_RS: {
              value: "",
              ignoreUpdate: true,
            },
            VALIDATE_INT_AMT: {
              value: "",
            },
            IDEAL_ACTUAL: {
              isFieldFocused: true,
              ignoreUpdate: true,
            },
            VALIDATE: {
              value: "",
              ignoreUpdate: true,
            },
          };
        }
      },
      maxLength: 5,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 2,
        fixedDecimalScale: true,
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
        if (currentField?.displayValue.trim() === "") {
          return {};
        }
        const reqParams = {
          INT_RATE:
            Number(dependentFieldsValues?.["INT_RATE"]?.value) > 0
              ? dependentFieldsValues?.["INT_RATE"]?.value
              : "0",
          IDEAL_BALANCE: dependentFieldsValues?.["IDEAL_BALANCE"]?.value ?? "",
          OUTSTANDING_BAL:
            dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
          OUT_SUBSIDY: dependentFieldsValues?.["OUT_SUBSIDY"]?.value ?? "",
          TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
          FINAL_INST_NO:
            Number(dependentFieldsValues?.["FINAL_INST_NO"]?.value) > 0
              ? dependentFieldsValues?.["FINAL_INST_NO"]?.value
              : "0",
          IDEAL_ACTUAL: currentField?.value ?? "",
          INSTALLMENT_TYPE:
            dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
        };
        const getApiData = await getRescheduleLoanInterestAmount(reqParams);
        return {
          INST_RS: {
            value: getApiData?.[0]?.INST_RS ?? "",
            ignoreUpdate: true,
            isFieldFocused: true,
          },
          VALIDATE_INT_AMT: {
            value: getApiData?.[0]?.INST_RS ?? "",
            ignoreUpdate: true,
          },
          VALIDATE: {
            value: getApiData?.[0]?.INST_RS ?? "",
            ignoreUpdate: true,
          },
        };
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 3, xl: 3 },
    },
    {
      render: { componentType: "amountField" },
      name: "INST_RS",
      label: "Installment Amount",
      placeholder: "",
      fullWidth: true,
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
        "VALIDATE",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (
          currentField?.value ===
          parseFloat(dependentFieldsValues?.["VALIDATE"]?.value).toFixed(2)
        ) {
          return {};
        }
        const formattedValue = parseFloat(
          formState?.headerData?.[0]?.INST_RS || 0
        ).toFixed(2);
        if (formattedValue === currentField?.value && !formState.instAmtFlag) {
          return {};
        }
        if (
          Number(currentField?.value) <
            Number(dependentFieldsValues?.["VALIDATE_INT_AMT"]?.value) &&
          !Boolean(dependentFieldsValues?.["EMI_AMT_CHANGE"]?.value)
        ) {
          const buttonName = await formState.MessageBox({
            messageTitle: "Validation Failed",
            message: "Installment Amount can not be reduced.",
            buttonNames: ["Ok"],
          });
          formState.instAmtFlag = true;
          if (buttonName === "Ok") {
            return {
              INST_RS: {
                value: dependentFieldsValues?.["VALIDATE_INT_AMT"]?.value,
              },
              VALIDATE: {
                value: currentField?.value,
              },
            };
          }
        } else if (Boolean(dependentFieldsValues?.["EMI_AMT_CHANGE"]?.value)) {
          const reqParams = {
            INST_RS: currentField?.value ?? "0",
            OUTSTANDING_BAL:
              dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
            INT_RATE: dependentFieldsValues?.["INT_RATE"]?.value ?? "",
          };
          const getApiData = await getNoOfInstallment(reqParams);
          formState.instAmtFlag = true;
          return {
            INST_NO: {
              value: getApiData?.[0]?.INST_NO ?? "",
              ignoreUpdate: true,
            },
            FINAL_INST_NO: {
              value: getApiData?.[0]?.INST_NO ?? "",
            },
            VALIDATE_INT_AMT: {
              value: currentField?.value,
            },
            VALIDATE: {
              value: currentField?.value,
            },
            VALIDATE_INST_NO: {
              value: getApiData?.[0]?.INST_NO ?? "",
              ignoreUpdate: true,
            },
          };
        } else {
          return {
            VALIDATE_INT_AMT: {
              value: currentField?.value ?? "",
            },
            VALIDATE: {
              value: currentField?.value,
            },
            VALIDATE_INST_NO: {
              value: "",
              ignoreUpdate: true,
            },
          };
        }
      },
      GridProps: { xs: 12, sm: 3, md: 2.5, lg: 2.5, xl: 3 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "VALIDATE_INST_NO",
      label: "",
      placeholder: "",
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
        "REMAINING_INST_NO",
        "IDEAL_ACTUAL",
        "IDEAL_BALANCE",
        "OUTSTANDING_BAL",
        "OUT_SUBSIDY",
        "TYPE_CD",
        "INT_RATE",
        "INSTALLMENT_TYPE",
        "INST_START_DT",
        "VALIDATE_INST_NO",
      ],
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (
          currentField?.value ===
            dependentFieldsValues?.["VALIDATE_INST_NO"]?.value &&
          currentField?.value !== ""
        ) {
          return {};
        }
        if (
          formState?.headerData?.[0]?.INST_NO === currentField?.value &&
          !formState.noOfInstFlag
        ) {
          return {};
        }
        const reqParams = {
          INST_NO: Number(currentField?.value) > 0 ? currentField?.value : "0",
          REMAINING_INST_NO:
            dependentFieldsValues?.["REMAINING_INST_NO"]?.value ?? "",
          ORG_INST_NO: formState?.headerData[0]?.INST_NO ?? "",
        };
        const getFinalInstallmentData = await getFinalInstallment(reqParams);
        formState.noOfInstFlag = true;
        const getFinalInstNumber = Boolean(
          getFinalInstallmentData?.[0]?.FINAL_INST_NO
        )
          ? getFinalInstallmentData?.[0]?.FINAL_INST_NO ?? ""
          : "";
        const installmentParams = {
          IDEAL_ACTUAL: dependentFieldsValues?.["IDEAL_ACTUAL"]?.value ?? "",
          IDEAL_BALANCE: dependentFieldsValues?.["IDEAL_BALANCE"]?.value ?? "",
          OUTSTANDING_BAL:
            dependentFieldsValues?.["OUTSTANDING_BAL"]?.value ?? "",
          OUT_SUBSIDY: dependentFieldsValues?.["OUT_SUBSIDY"]?.value ?? "",
          TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value ?? "",
          FINAL_INST_NO: getFinalInstNumber ?? "",
          INT_RATE:
            Number(dependentFieldsValues?.["INT_RATE"]?.value) > 0
              ? dependentFieldsValues?.["INT_RATE"]?.value
              : "0",
          INSTALLMENT_TYPE:
            dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
        };
        const getInstallmentAmtData = await getRescheduleLoanInterestAmount(
          installmentParams
        );
        const dueDatePara = {
          INSTALLMENT_TYPE:
            dependentFieldsValues?.["INSTALLMENT_TYPE"]?.value ?? "",
          INST_START_DATE: dependentFieldsValues?.["INST_START_DT"]?.value
            ? format(
                new Date(dependentFieldsValues?.["INST_START_DT"]?.value),
                "dd/MMM/yyyy"
              )
            : "",
          INST_NO: Number(currentField?.value) > 0 ? currentField?.value : "0",
        };
        const getDueDateData = await getDueDate(dueDatePara);

        return {
          FINAL_INST_NO: {
            value: getFinalInstallmentData?.[0]?.FINAL_INST_NO ?? "",
            ignoreUpdate: true,
          },
          INST_DUE_DT: {
            value: getDueDateData?.[0]?.DUE_DATE ?? "",
            ignoreUpdate: true,
          },
          INST_RS: {
            value: getInstallmentAmtData?.[0]?.INST_RS ?? "",
            ignoreUpdate: true,
          },
          VALIDATE_INT_AMT: {
            value: getInstallmentAmtData?.[0]?.INST_RS ?? "",
          },
          VALIDATE: {
            value: getInstallmentAmtData?.[0]?.INST_RS ?? "",
            ignoreUpdate: true,
          },
          VALIDATE_INST_NO: {
            value: currentField?.value,
            ignoreUpdate: true,
          },
        };
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
      maxLength: 32,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Remarks is Required"] }],
      },
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
      },
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
      maxLength: 50,
      autoComplete: "off",
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        formState.setDataOnFieldChange("DELETE_DATA", { DELETE_DATA: true });
      },
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
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (Boolean(formState?.disableButton)) {
          return true;
        } else {
          return false;
        }
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

export const LoanReviseMetaData = {
  masterForm: {
    form: {
      name: "loanReviseFormMetadata",
      label: "",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
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
        numberFormat: {
          fullWidth: true,
        },
      },
    },
    fields: [
      {
        render: {
          componentType: "datePicker",
        },
        name: "INS_START_DT",
        label: "Installment Start Date",
        isReadOnly: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 1.75, xl: 1.75 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "BEGIN_BAL",
        label: "Beginning Balance",
        type: "text",
        isReadOnly: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 1.75, xl: 1.75 },
      },
      {
        render: {
          componentType: "rateOfInt",
        },
        name: "INT_RATE",
        label: "Interest Rate",
        type: "text",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Interest Rate is Required"] }],
        },
        // When interest rate update pass null installment amount
        dependentFields: [
          "INS_START_DT",
          "BEGIN_BAL",
          "PRIN_DEMAND_AMT",
          "INSTALLMENT_TYPE",
          "INST_NO",
          "TYPE_CD",
          "REPAY_PRIN_AMT",
          "SR_CD",
          "TOTAL_RECORDS",
        ],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldsValues
        ) => {
          if (currentField?.displayValue === "") {
            return {};
          }
          const date = new Date(dependentFieldsValues["INS_START_DT"]?.value);
          const formattedDate = format(date, "dd/MMM/yyyy").toUpperCase();
          const reqPara = {
            INT_RATE: currentField?.value ?? "",
            INST_RS: "",
            INS_START_DT: formattedDate ?? "",
            BEGIN_BAL: dependentFieldsValues["BEGIN_BAL"]?.value ?? "",
            PRIN_DEMAND_AMT:
              dependentFieldsValues["PRIN_DEMAND_AMT"]?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues["INSTALLMENT_TYPE"]?.value ?? "",
            INST_NO: dependentFieldsValues["TOTAL_RECORDS"]?.value ?? "",
            TYPE_CD: dependentFieldsValues["TYPE_CD"]?.value ?? "",
            REPAY_PRIN_AMT:
              dependentFieldsValues["REPAY_PRIN_AMT"]?.value ?? "",
            CM_INST_NO: dependentFieldsValues["SR_CD"]?.value ?? "",
            SCREEN_REF: "MST/006",
          };
          const getApiData = await updateInterestRate(reqPara);
          formState.setDataOnFieldChange("GRID_DATA", {
            ...getApiData,
            INT_RATE: currentField?.value,
          });
        },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "INST_RS",
        label: "Installment Amount",
        type: "text",
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Installment Amount is Required"] },
          ],
        },
        dependentFields: [
          "INT_RATE",
          "INS_START_DT",
          "BEGIN_BAL",
          "PRIN_DEMAND_AMT",
          "INSTALLMENT_TYPE",
          "INST_NO",
          "TYPE_CD",
          "REPAY_PRIN_AMT",
          "SR_CD",
          "TOTAL_RECORDS",
        ],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldsValues
        ) => {
          if (currentField?.displayValue === "") {
            return {};
          }
          const date = new Date(dependentFieldsValues["INS_START_DT"]?.value);
          const formattedDate = format(date, "dd/MMM/yyyy").toUpperCase();
          const reqPara = {
            INST_RS: currentField?.value ?? "",
            INT_RATE: dependentFieldsValues["INT_RATE"]?.value ?? "",
            INS_START_DT: formattedDate ?? "",
            BEGIN_BAL: dependentFieldsValues["BEGIN_BAL"]?.value ?? "",
            PRIN_DEMAND_AMT:
              dependentFieldsValues["PRIN_DEMAND_AMT"]?.value ?? "",
            INSTALLMENT_TYPE:
              dependentFieldsValues["INSTALLMENT_TYPE"]?.value ?? "",
            INST_NO: dependentFieldsValues["TOTAL_RECORDS"]?.value ?? "",
            TYPE_CD: dependentFieldsValues["TYPE_CD"]?.value ?? "",
            REPAY_PRIN_AMT:
              dependentFieldsValues["REPAY_PRIN_AMT"]?.value ?? "",
            CM_INST_NO: dependentFieldsValues["SR_CD"]?.value ?? "",
            SCREEN_REF: "MST/006",
          };
          const getApiData = await updateInterestRate(reqPara);
          formState.setDataOnFieldChange("GRID_DATA", {
            ...getApiData,
            INT_RATE: currentField?.value,
          });
        },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 1.75, xl: 1.75 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "PRIN_DEMAND_AMT",
        label: "Principal Demand",
        type: "text",
        isReadOnly: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 1.75, xl: 1.75 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "INT_DEMAND_AMT",
        label: "Interest Demand",
        type: "text",
        isReadOnly: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 1.75, xl: 1.75 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "END_BAL",
        label: "Ending Balance",
        type: "text",
        isReadOnly: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 1.75, xl: 1.75 },
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
        name: "INST_NO",
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
        name: "REPAY_PRIN_AMT",
        label: "",
        placeholder: "",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "SR_CD",
        label: "",
        placeholder: "",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "TOTAL_RECORDS",
        label: "",
        placeholder: "",
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Loan schedule",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: {
        width: 350,
        minWidth: 300,
        maxWidth: 400,
      },
      allowColumnReordering: true,
      disableSorting: false,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      disableLoader: false,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "SrNo",
        sequence: 1,
        alignment: "left",
        componentType: "default",
        width: 70,
        minWidth: 60,
        maxWidth: 100,
      },
      {
        accessor: "INST_START_DT",
        columnName: "Installment Start Date",
        sequence: 2,
        alignment: "left",
        componentType: "datePicker",
        width: 150,
        minWidth: 140,
        maxWidth: 200,
      },
      {
        accessor: "BEGIN_BAL",
        columnName: "Beginning Balance",
        sequence: 3,
        alignment: "left",
        componentType: "default",
        width: 150,
        minWidth: 140,
        maxWidth: 200,
      },
      {
        accessor: "INT_RATE",
        columnName: "Interest Rate(%)",
        sequence: 4,
        alignment: "right",
        componentType: "default",
        width: 150,
        minWidth: 140,
        maxWidth: 200,
      },
      {
        accessor: "INST_RS",
        columnName: "Installment Amount",
        sequence: 5,
        alignment: "right",
        componentType: "default",
        width: 150,
        minWidth: 140,
        maxWidth: 200,
        isDisplayTotal: true,
        totalDecimalCount: 2,
      },
      {
        accessor: "PRIN_DEMAND_AMT",
        columnName: "Principal Demand",
        sequence: 6,
        alignment: "right",
        componentType: "default",
        width: 180,
        minWidth: 160,
        maxWidth: 200,
        isDisplayTotal: true,
        totalDecimalCount: 2,
      },
      {
        accessor: "INT_DEMAND_AMT",
        columnName: "Interest Demand",
        sequence: 7,
        alignment: "right",
        componentType: "default",
        width: 180,
        minWidth: 160,
        maxWidth: 200,
        isDisplayTotal: true,
        totalDecimalCount: 2,
      },
      {
        accessor: "END_BAL",
        columnName: "Ending Balance",
        sequence: 8,
        alignment: "right",
        componentType: "default",
        width: 200,
        minWidth: 150,
        maxWidth: 250,
      },
    ],
  },
};
