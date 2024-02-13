import { GeneralAPI } from "registry/fns/functions";
import * as API from "../api";

export const FixDepositParaFormMetadata = {
  form: {
    name: "fixDepositParameter",
    label: "Fix Deposit Entry",
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
        componentType: "select",
      },
      name: "FD_TYPE",
      label: "FD Operation",
      options: [
        { label: "Fresh FD Account", value: "F" },
        { label: "Existing FD Account", value: "E" },
        { label: "FD Payment", value: "P" },
        { label: "FD Payment Instruction", value: "I" },
      ],
      defaultValue: "E",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["FD Type is required."] },
          { name: "FD_TYPE", params: ["Please select FD Type"] },
        ],
      },
      validationRun: "all",
      postValidationSetCrossFieldValues: async (field, formState) => {
        if (formState?.isSubmitting) return {};
        formState.setDataOnFieldChange("FD_TYPE", field?.value);
        return {
          CUSTOMER_ID: { value: "" },
          CUSTOMER_NAME: { value: "" },
        };
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TRAN_MODE",
      label: "Mode",
      options: [
        { label: "Clearing", value: "2" },
        { label: "Transfer", value: "3" },
        { label: "Cash", value: "4" },
      ],
      defaultValue: "3",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Mode is required."] },
          { name: "TRAN_MODE", params: ["Please select Mode"] },
        ],
      },
      validationRun: "all",
      postValidationSetCrossFieldValues: async (field, formState) => {
        if (formState?.isSubmitting) return {};
        formState.setDataOnFieldChange("TRAN_MODE", field?.value);
        return {
          CUSTOMER_ID: { value: "" },
          CUSTOMER_NAME: { value: "" },
        };
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      maxLength: 12,
      required: true,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
        isValidation: "no",
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["CustomerIDisrequired"] },
          {
            name: "max",
            params: [12, "CustomerIDShouldNotBeLessThan12Digits"],
          },
        ],
      },
      dependentFields: ["FD_TYPE", "TRAN_MODE"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentField
      ) => {
        if (formState?.isSubmitting) return {};
        if (dependentField?.FD_TYPE?.value === "E") {
          formState.setDataOnFieldChange("CUSTOMER_ID_FEFORE");
          let Apireq = {
            COMP_CD: auth?.companyID ?? "",
            CUSTOMER_ID: field?.value ?? "",
          };

          let resData = await API.getFDAccountsDetail(Apireq);
          resData = resData?.[0];
          if (resData?.CONFIRMED === "Y") {
            let fdAccounts = resData?.FD_ACCOUNTS;
            formState.setDataOnFieldChange("CUSTOMER_ID", {
              ...field,
              FD_ACCTS: fdAccounts,
            });
            if (fdAccounts?.length) {
              return {
                CUSTOMER_NAME: {
                  value: resData?.ACCT_NM ?? "",
                },
                FDACCTS: {
                  value: fdAccounts,
                },
              };
              // }
            } else {
              return {
                CUSTOMER_ID: {
                  error: "FD Accounts not found for this Customer ID.",
                },
                CUSTOMER_NAME: { value: "" },
              };
            }
          } else {
            return {
              CUSTOMER_ID: {
                error:
                  "Customer ID is not Confirmed. \n\rLast Modified User: " +
                  (resData?.LAST_ENTERED_BY ?? "") +
                  "\n\rLast Modified Branch: " +
                  (resData?.LAST_ENTERED_BRANCH_CD ?? ""),
              },
              CUSTOMER_NAME: { value: "" },
            };
          }
        }
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CUSTOMER_NAME",
      label: "Customer Name",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3.5 },
    },
  ],
};

export const FixDepositAccountsFormMetadata = {
  form: {
    name: "fixDepositAccounts",
    label: "Fix Deposit Entry",
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
        componentType: "arrayField",
      },
      name: "FDACCTS",
      removeRowFn: "deleteFormArrayFieldData",
      fixedRows: true,
      isCustomStyle: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_CD",
          label: "Branch Code",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_TYPE",
          label: "Account Type",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1.5 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "ACCT_CD",
          label: "Account Number",
          type: "text",
          fullWidth: true,
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCOUNT_LIST",
            "USER_TYPE_ALLOWED",
            "LEAN_FLAG",
          ],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          disableCaching: true,
          options: (...arg) => {
            let accountList = arg?.[2]?.["FDACCTS.ACCOUNT_LIST"]?.value ?? "";
            accountList = accountList.split(",");
            accountList = accountList.filter((item) => Boolean(item.trim()));
            const acctCode = accountList.map((item) => ({
              value: item,
              label: item.trim(),
            }));
            return acctCode;
          },
          postValidationSetCrossFieldValues: async (...arg) => {
            const companyCode = arg?.[3]?.["FDACCTS.COMP_CD"]?.value ?? "";
            const branchCode = arg?.[3]?.["FDACCTS.BRANCH_CD"]?.value ?? "";
            const accountType = arg?.[3]?.["FDACCTS.ACCT_TYPE"]?.value ?? "";
            const accountCode = arg?.[0]?.value ?? "";
            if (
              Boolean(companyCode) &&
              Boolean(branchCode) &&
              Boolean(accountType) &&
              accountCode
            ) {
              const apiResponse = await API.validateAccountAndGetDetail(
                companyCode,
                branchCode,
                accountType,
                accountCode,
                "FD_ACT"
              );
              if (apiResponse?.status === "0") {
                if (Boolean(apiResponse?.message)) {
                  arg?.[1]?.MessageBox(
                    "Information",
                    apiResponse?.message.startsWith("\n")
                      ? apiResponse?.message?.slice(1)
                      : apiResponse?.message
                  );
                }
                return {
                  ACCT_NM: { value: apiResponse?.data?.[0]?.ACCT_NM ?? "" },
                };
              } else {
                return {
                  ACCT_CD: { value: "", error: apiResponse?.message ?? "" },
                  ACCT_NM: { value: "" },
                };
              }
            }
          },
          GridProps: { xs: 12, sm: 1, md: 1, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NM",
          label: "Account Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "FD_AMOUNT",
          label: "New FD Amount",
          placeholder: "",
          dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          className: "textInputFromRight",
          name: "FD_UNIT",
          label: "No. of FD",
          defaultValue: 1,
          dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          FormatProps: {
            allowNegative: false,
            isAllowed: (values) => {
              if (values?.value?.length > 5) {
                return false;
              }
              if (parseInt(values?.value) > 100) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TOTAL_AMT",
          label: "Total FD Amount",
          placeholder: "",
          isReadOnly: true,
          dependentFields: [
            "FD_AMOUNT",
            "FD_UNIT",
            "USER_TYPE_ALLOWED",
            "LEAN_FLAG",
          ],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          setValueOnDependentFieldsChange: (dependentFields) => {
            const fdAmount = Number(
              dependentFields["FDACCTS.FD_AMOUNT"]?.value
            );
            const numberOfFD = Number(
              dependentFields["FDACCTS.FD_UNIT"]?.value
            );

            const total = fdAmount * numberOfFD;
            return total.toFixed(2);
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "CR_BRANCH_CD",
            label: "Credit Branch",
            dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
            shouldExclude(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                  "Y" &&
                dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
              ) {
                return false;
              } else {
                return true;
              }
            },
            required: false,
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "CR_ACCT_TYPE",
            label: "Credit A/c Type",
            required: false,
            dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
            shouldExclude(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                  "Y" &&
                dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
              ) {
                return false;
              } else {
                return true;
              }
            },
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "CR_ACCT_CD",
            label: "Credit A/c No.",
            // required: false,
            dependentFields: [
              "COMP_CD",
              "CR_BRANCH_CD",
              "CR_ACCT_TYPE",
              "USER_TYPE_ALLOWED",
              "LEAN_FLAG",
            ],
            shouldExclude(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                  "Y" &&
                dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
              ) {
                return false;
              } else {
                return true;
              }
            },
            required: true,
            type: "text",
            validation: (value, data) => {
              console.log(">>value", value);
              if (!Boolean(value)) {
                return "";
              }
              return "";
            },
            postValidationSetCrossFieldValues: async (...arg) => {
              const companyCode = arg?.[3]?.["FDACCTS.COMP_CD"]?.value ?? "";
              const branchCode =
                arg?.[3]?.["FDACCTS.CR_BRANCH_CD"]?.value ?? "";
              const accountType =
                arg?.[3]?.["FDACCTS.CR_ACCT_TYPE"]?.value ?? "";
              const accountCode = arg?.[0]?.value ?? "";
              if (
                Boolean(companyCode) &&
                Boolean(branchCode) &&
                Boolean(accountType) &&
                accountCode
              ) {
                const apiResponse = await API.validateAccountAndGetDetail(
                  companyCode,
                  branchCode,
                  accountType,
                  accountCode,
                  "FD_CR_ACT"
                );
                if (apiResponse?.status === "0") {
                  if (Boolean(apiResponse?.message)) {
                    arg?.[1]?.MessageBox(
                      "Information",
                      apiResponse?.message.startsWith("\n")
                        ? apiResponse?.message?.slice(1)
                        : apiResponse?.message
                    );
                  }
                  return {
                    CR_ACCT_NM: {
                      value: apiResponse?.data?.[0]?.ACCT_NM ?? "",
                    },
                  };
                } else {
                  return {
                    CR_ACCT_CD: {
                      value: "",
                      error: apiResponse?.message ?? "",
                    },
                    CR_ACCT_NM: { value: "" },
                  };
                }
              }
            },
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CR_ACCT_NM",
          label: "Credit Account Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "MATURE_INST",
          label: "Mature Instruction",
          type: "text",
          dependentFields: [
            "BRANCH_CD",
            "ACCT_TYPE",
            "USER_TYPE_ALLOWED",
            "LEAN_FLAG",
          ],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          disableCaching: true,
          options: "getMatureInstDetail",
          fullWidth: true,
          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NOMINEE_NM",
          label: "Nominee",
          type: "text",
          dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Rate is Required."] },
            ],
          },
          fullWidth: true,
          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "USER_TYPE_ALLOWED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "LEAN_FLAG",
          label: "LEAN_FLAG",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "COMP_CD",
          label: "COMP_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "ACCOUNT_LIST",
          label: "ACCOUNT_LIST",
        },
        {
          render: {
            componentType: "typography",
          },
          name: "VALIDATEMSG",
          label: "",
          defaultValue: "Account is not Confirmed.",
          dependentFields: ["USER_TYPE_ALLOWED", "LEAN_FLAG"],
          TypographyProps: {
            style: {
              color: "red",
              whiteSpace: "pre-line",
              fontSize: "1rem",
              // position: "absolute",
              // bottom: 0,
            },
          },
          setValueOnDependentFieldsChange: (dependentFields) => {
            if (dependentFields["FDACCTS.USER_TYPE_ALLOWED"]?.value !== "Y") {
              return "You do have not access to this Account Type.";
            } else if (dependentFields["FDACCTS.LEAN_FLAG"]?.value === "Y") {
              return "A/c Type Lien Marked. New FD deposit not allowed.";
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDACCTS.USER_TYPE_ALLOWED"]?.value ===
                "Y" &&
              dependentFieldsValues?.["FDACCTS.LEAN_FLAG"]?.value === "N"
            ) {
              return true;
            } else {
              return false;
            }
          },
          GridProps: {
            xs: 4,
            md: 4,
            sm: 4,
            style: { alignSelf: "center" },
          },
        },
      ],
    },
  ],
};