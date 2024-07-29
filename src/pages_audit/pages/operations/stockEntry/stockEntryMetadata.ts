import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { utilFunction } from "components/utils";
import { t } from "i18next";

export const StockEntryMetaData = {
  form: {
    name: "Stock-entry",
    label: "stockEntry",
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
        isReadOnly: true,
        postValidationSetCrossFieldValues: (field, formState) => {
          if (field?.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
              ACCT_MST_LIMIT: { value: "" },
              SECURITY_CD: { value: "" },
            };
          } else if (!field.value) {
            formState.setDataOnFieldChange("IS_VISIBLE", { IS_VISIBLE: false });
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
              ACCT_MST_LIMIT: { value: "" },
              SECURITY_CD: { value: "" },
            };
          }
        },
        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        isFieldFocused: true,
        options: (depen, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "TRN/047",
          });
        },
        _optionsKey: "get_Account_Type",
        postValidationSetCrossFieldValues: (field, formState) => {
          formState.setDataOnFieldChange("IS_VISIBLE", {
            IS_VISIBLE: false,
          });
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
            TRAN_BAL: { value: "" },
            ACCT_MST_LIMIT: { value: "" },
            SECURITY_CD: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        render: {
          componentType: "textField",
        },
        validate: (columnValue) => {
          let regex = /^[^!&]*$/;
          if (!regex.test(columnValue.value)) {
            return "Special Characters (!, &) not Allowed";
          }
          return "";
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
              SCREEN_REF: "TRN/047",
            };
            let postData = await GeneralAPI.getAccNoValidation(
              otherAPIRequestPara
            );

            if (postData?.RESTRICTION) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
              let res = await formState.MessageBox({
                messageTitle: t("ValidationFailed"),
                message: postData?.RESTRICTION,
              });
              if (res === "Ok") {
                return {
                  ACCT_CD: {
                    value: "",
                    isFieldFocused: true,
                  },
                  ACCT_NM: { value: "" },
                  TRAN_BAL: { value: "" },
                  TRAN_DT: { value: "" },
                };
              }
            } else if (postData?.MESSAGE1) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: true,
              });
              let res = await formState.MessageBox({
                messageTitle: t("RiskCategoryAlert"),
                message: postData?.MESSAGE1,
              });
              if (res === "Ok") {
                return {
                  ACCT_CD: {
                    value: utilFunction.getPadAccountNumber(
                      field?.value,
                      dependentValue?.ACCT_TYPE?.optionData
                    ),
                    ignoreUpdate: true,
                    isFieldFocused: false,
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
                  ACCT_MST_LIMIT: {
                    value: postData?.LIMIT_AMT ?? "",
                  },
                };
              }
            } else {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: true,
              });
              return {
                ACCT_CD: {
                  value: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentValue?.ACCT_TYPE?.optionData
                  ),
                  ignoreUpdate: true,
                  isFieldFocused: false,
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
                ACCT_MST_LIMIT: {
                  value: postData?.LIMIT_AMT ?? "",
                },
              };
            }
          } else if (!field?.value) {
            formState.setDataOnFieldChange("IS_VISIBLE", { IS_VISIBLE: false });
            return {
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
              ACCT_MST_LIMIT: { value: "" },
              SECURITY_CD: { value: "" },
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
      label: "AccountName",
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
      name: "ACCT_MST_LIMIT",
      label: "AccountLimitAmt",
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
        componentType: "autocomplete",
      },
      name: "SECURITY_CD",
      label: "Security",
      disableCaching: true,
      _optionsKey: "securityListDD",
      dependentFields: ["ACCT_TYPE", "ACCT_CD", "BRANCH_CD", "ACCT_MST_LIMIT"],
      options: (dependentValue, formState, _, authState) => {
        if (
          dependentValue?.ACCT_TYPE?.value &&
          dependentValue?.ACCT_CD?.value &&
          dependentValue?.ACCT_CD?.value.length > 10
        ) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            ACCT_CD: dependentValue?.ACCT_CD?.value,
          };
          return API.securityListDD(apiReq);
        }
        return [];
      },

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          formState.setDataOnFieldChange("SECURITY_CD", {
            COMP_CD: authState?.companyID,
            SECURITY_CD: field?.value,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            ACCT_MST_LIMIT: dependentValue?.ACCT_MST_LIMIT?.value,
            STOCK_MARGIN: field?.optionData?.[0]?.STOCK_MARGIN,
            STK_MRG_DISABLE: field?.optionData?.[0]?.STK_MRG_DISABLE,
            WORKING_DATE: authState?.workingDate,
          });
        }
        return {
          STOCK_MONTH: { value: field?.optionData?.[0]?.STOCK_MONTH },
        };
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "STMT_DT_FLAG",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "STOCK_MONTH",
    },
  ],
};
