import { utilFunction } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";

export const StopPayEntryMetadata = {
  form: {
    name: "PRIORITY",
    label: "Cheque Stop Entry",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
    componentProps: {
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
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
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        postValidationSetCrossFieldValues: async (field) => {
          if (field?.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
              CHEQUE_FROM: { value: "" },
              CHEQUE_TO: { value: "" },
              AMOUNT: { value: "" },
              SERVICE_TAX: { value: "" },
              CHEQUE_DT: { value: "" },
              CHEQUE_AMOUNT: { value: "" },
            };
          }
        },
      },
      accountTypeMetadata: {
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "ETRN/048",
          });
        },
        _optionsKey: "get_Account_Type",
        postValidationSetCrossFieldValues: async (field) => {
          if (field?.value) {
            return {
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
              CHEQUE_FROM: { value: "" },
              CHEQUE_TO: { value: "" },
              AMOUNT: { value: "" },
              SERVICE_TAX: { value: "" },
              CHEQUE_DT: { value: "" },
              CHEQUE_AMOUNT: { value: "" },
            };
          }
        },
      },
      accountCodeMetadata: {
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          if (
            field?.value &&
            dependentValue?.BRANCH_CD?.value &&
            dependentValue?.ACCT_TYPE?.value
          ) {
            let otherAPIRequestPara = {
              COMP_CD: authState?.companyID,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              SCREEN_REF: "ETRN/048",
            };
            let postData = await GeneralAPI.getAccNoValidation(
              otherAPIRequestPara
            );

            if (postData?.RESTRICTION) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData?.RESTRICTION,
              });
              return {
                ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
                TRAN_BAL: { value: "" },
                TRAN_DT: { value: "" },
              };
            } else if (postData?.MESSAGE1) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: true,
              });
              formState.MessageBox({
                messageTitle: "Risk Category Alert",
                message: postData?.MESSAGE1,
                buttonNames: ["Ok"],
              });
              return {
                ACCT_CD: {
                  value: field.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                TRAN_DT: {
                  value: authState?.workingDate ?? "",
                },
                ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
                TRAN_BAL: {
                  value: postData?.WIDTH_BAL ?? "",
                },
              };
            } else {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: true,
              });
              return {
                ACCT_CD: {
                  value: field.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                TRAN_DT: {
                  value: authState?.workingDate ?? "",
                },
                ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
                TRAN_BAL: {
                  value: postData?.WIDTH_BAL ?? "",
                },
              };
            }
          } else if (!field?.value) {
            formState.setDataOnFieldChange("IS_VISIBLE", { IS_VISIBLE: false });
            return {
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }
          return {};
        },
        runPostValidationHookAlways: true,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Balance",
      isReadOnly: true,
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "FLAG",
      label: "Cheque Stop Type",
      defaultValue: "P",
      placeholder: "Select one",
      options: () => {
        return [
          { value: "P", label: "Stop Payment" },
          { value: "S", label: "Surrender Cheque" },
          { value: "D", label: "PDC" },
        ];
      },
      _optionsKey: "FLAG",
      postValidationSetCrossFieldValues: async (field) => {
        if (field?.value) {
          return {
            CHEQUE_FROM: { value: "" },
            CHEQUE_TO: { value: "" },
            AMOUNT: { value: "" },
            SERVICE_TAX: { value: "" },
            CHEQUE_DT: { value: "" },
            CHEQUE_AMOUNT: { value: "" },
          };
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Intimate Date",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "S") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "SURR_DT",
      label: "Surrender Date",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "S") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_FROM",
      label: "Cheque From",
      placeholder: "Enter Cheque-From No.",
      dependentFields: ["ACCT_TYPE", "BRANCH_CD", "ACCT_CD", "FLAG"],
      FormatProps: {
        isAllowed: (values, dependentFields, formState) => {
          if (values.floatValue === 0 || values.floatValue === "-") {
            return false;
          }
          return true;
        },
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (
          field?.value &&
          dependentValue?.BRANCH_CD?.value &&
          dependentValue?.ACCT_TYPE?.value &&
          dependentValue?.ACCT_CD?.value
        ) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            ACCT_CD: dependentValue?.ACCT_CD?.value,
            SCREEN_REF: "ETRN/048",
            CHEQUE_FROM: field?.value,
            CHEQUE_TO: "",
            CHQ_SERIES: true,
            CHRG_CAL: false,
            FLAG: dependentValue?.FLAG?.value,
          };
          let postData = await API.chequeValidate(apiReq);
          console.log("<<<postdata", postData);

          if (postData?.[0]?.ERR_CODE !== "0" && postData?.[0]?.ERR_MSG) {
            formState.MessageBox({
              messageTitle: "cheque Validation",
              message: postData?.[0]?.ERR_MSG,
            });
            return {
              CHEQUE_FROM: { value: "" },
              SERVICE_TAX: { value: "" },
              AMOUNT: { value: "" },
            };
          } else {
            return {
              CHEQUE_TO: { value: field?.value },
            };
          }
        }
        return {};
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["From Cheque No. is required."] }],
      },
      required: true,
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_TO",
      label: "Cheque To",
      placeholder: "Enter Cheque-To No.",
      dependentFields: [
        "ACCT_TYPE",
        "BRANCH_CD",
        "ACCT_CD",
        "FLAG",
        "CHEQUE_FROM",
      ],
      validate: (field, dependentFields, formState) => {
        console.log("<<<valdate", dependentFields);
        if (
          field?.value.length <= 0 ||
          dependentFields?.CHEQUE_FROM?.value < field?.value
        ) {
          return "";
        } else if (dependentFields?.CHEQUE_FROM?.value > field?.value) {
          return "Please enter a value greater than the Check-From value";
        }
        return "";
      },
      FormatProps: {
        isAllowed: (values, dependentFields, formState) => {
          if (values.floatValue === 0 || values.floatValue === "-") {
            return false;
          }
          return true;
        },
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (
          field?.value &&
          dependentValue?.BRANCH_CD?.value &&
          dependentValue?.ACCT_TYPE?.value &&
          dependentValue?.ACCT_CD?.value
          // && field?.value !== dependentValue?.CHEQUE_FROM?.value
        ) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            ACCT_CD: dependentValue?.ACCT_CD?.value,
            SCREEN_REF: "ETRN/048",
            CHEQUE_FROM: dependentValue?.CHEQUE_FROM?.value,
            CHEQUE_TO: field?.value,
            CHQ_SERIES: true,
            CHRG_CAL: true,
            FLAG: dependentValue?.FLAG?.value,
          };
          let postData = await API.chequeValidate(apiReq);

          if (postData?.[0]?.ERR_CODE !== "0" && postData?.[0]?.ERR_MSG) {
            formState.MessageBox({
              messageTitle: "cheque Validation",
              message: postData?.[0]?.ERR_MSG,
            });
            return {
              CHEQUE_TO: { value: "" },
              SERVICE_TAX: { value: "" },
              AMOUNT: { value: "" },
            };
          } else {
            return {
              SERVICE_C_FLAG: {
                value: postData?.[0]?.FLAG_ENABLE_DISABLE ?? "",
              },
              ROUND_OFF_FLAG: {
                value: postData?.[0]?.GST_ROUND ?? "",
              },
              GST: {
                value: postData?.[0]?.TAX_RATE ?? "",
              },
              SERVICE_TAX: {
                value: postData?.[0]?.CHRG_AMT ?? "",
              },
              AMOUNT: {
                value: postData?.[0]?.GST_AMT,
              },
            };
          }
        }
        return {};
      },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["To Cheque No. is required."] }],
      },
      required: true,
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "REASON_CD",
      label: "Reason",

      placeholder: "Select Reason",
      disableCaching: true,
      dependentFields: ["FLAG", "BRANCH_CD"],
      options: (dependentValue, formState, any, authState) => {
        if (dependentValue?.BRANCH_CD?.value && dependentValue?.FLAG?.value) {
          return API.reasonDropdown({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            RETURN_TYPE:
              dependentValue?.FLAG?.value === "P"
                ? "STOP"
                : dependentValue?.FLAG?.value === "S"
                ? "SURR"
                : dependentValue?.FLAG?.value === "D"
                ? "PDC"
                : null,
          });
        }
        return [];
      },
      _optionsKey: "reasonDropdown",
      GridProps: {
        xs: 12,
        md: 4.8,
        sm: 4.8,
        lg: 4.8,
        xl: 4.8,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_TAX",
      label: "Charge Amount",
      placeholder: "Enter Charge Amount",
      dependentFields: ["FLAG", "ROUND_OFF_FLAG", "GST", "SERVICE_C_FLAG"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        console.log("<<<dependentFieldsValues", dependentFieldsValues);
        if (dependentFieldsValues?.SERVICE_C_FLAG?.value === "N") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          return {
            AMOUNT: {
              value:
                dependentValue?.ROUND_OFF_FLAG?.value === "3"
                  ? Math.floor(
                      (parseInt(field?.value) *
                        parseInt(dependentValue?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentValue?.ROUND_OFF_FLAG?.value === "2"
                  ? Math.ceil(
                      (parseInt(field?.value) *
                        parseInt(dependentValue?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentValue?.ROUND_OFF_FLAG?.value === "1"
                  ? Math.round(
                      (parseInt(field?.value) *
                        parseInt(dependentValue?.GST?.value)) /
                        100
                    ) ?? ""
                  : (parseInt(field?.value) *
                      parseInt(dependentValue?.GST?.value)) /
                      100 ?? "",
            },
          };
        }
        return {};
      },
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "P") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "GST-Amount",
      isReadOnly: true,
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "P") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "CHEQUE_AMOUNT",
      label: "Cheque Amount",
      placeholder: "Cheque Amount",
      dependentFields: ["FLAG"],
      shouldExclude(fieldData, dependentFields, formState) {
        if (dependentFields?.FLAG?.value === "S") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "INFAVOUR_OF",
      label: "Infavour",
      type: "text",
      placeholder: "Infavour",
      GridProps: {
        xs: 12,
        md: 4.8,
        sm: 4.8,
        lg: 4.8,
        xl: 4.8,
      },
    },
    {
      render: {
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "Enter Remarks",
      GridProps: {
        xs: 12,
        md: 4.8,
        sm: 4.8,
        lg: 4.8,
        xl: 4.8,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "SERVICE_C_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "GST",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ROUND_OFF_FLAG",
    },
  ],
};
