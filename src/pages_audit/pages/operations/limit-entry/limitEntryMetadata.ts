import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { utilFunction } from "components/utils";

export const limitEntryMetaData = {
  form: {
    name: "limit-Entry",
    label: "LimitEntry",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    hideHeader: true,
    formStyle: {
      background: "white",
      height: "calc(100vh - 390px)",
      overflowY: "auto",
      overflowX: "hidden",
    },
    render: {
      ordering: "auto",
      // ordering: "sequence",
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
          height: "35vh",
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
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        postValidationSetCrossFieldValues: async (field, formState) => {
          if (field?.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
            };
          } else if (!field.value) {
            formState.setDataOnFieldChange("NSC_FD_BTN", { NSC_FD_BTN: false });
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
              SECURITY_CD: { value: "" },
            };
          }
        },
        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        isFieldFocused: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "TRN/046",
          });
        },
        // _optionsKey: "get_Account_Type",
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          formState.setDataOnFieldChange("NSC_FD_BTN", { NSC_FD_BTN: false });
          return {
            PARENT_TYPE: field?.optionData?.[0]?.PARENT_TYPE.trim(),
            ACCT_CD: { value: "" },
            SECURITY_CD: { value: "" },
            ACCT_NM: { value: "" },
            ACCT_BAL: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
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
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              GD_TODAY_DT: authState?.workingDate,
              SCREEN_REF: "EMST/046",
            };
            let postData = await API.getLimitEntryData(otherAPIRequestPara);

            if (postData?.length) {
              formState.setDataOnFieldChange("NSC_FD_BTN", {
                NSC_FD_BTN: postData?.[0]?.RESTRICTION ? false : true,
                HDN_CHARGE_AMT: postData?.[0]?.CHARGE_AMT,
                HDN_GST_AMT: postData?.[0]?.GST_AMT,
                HDN_GST_ROUND: postData?.[0]?.GST_ROUND,
                HDN_TAX_RATE: postData?.[0]?.TAX_RATE,
              });
            }

            if (postData?.[0]?.RESTRICTION) {
              let res = await formState.MessageBox({
                messageTitle: "ValidationFailed",
                message: postData?.[0]?.RESTRICTION,
                buttonNames: ["Ok"],
                defFocusBtnName: "Ok",
              });
              if (res === "Ok") {
                return {
                  ACCT_CD: { value: "", isFieldFocused: true },
                  ACCT_NM: { value: "" },
                  TRAN_BAL: { value: "" },
                  SANCTIONED_AMT: { value: "" },
                };
              }
            } else if (postData?.[0]?.MESSAGE1) {
              let res = await formState.MessageBox({
                messageTitle: "RiskCategoryAlert",
                message: postData?.[0]?.MESSAGE1,
                buttonNames: ["Ok"],
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
                  ACCT_NM: {
                    value: postData?.[0]?.ACCT_NM,
                  },
                  TRAN_BAL: {
                    value: postData?.[0]?.TRAN_BAL,
                  },
                  SANCTIONED_AMT: {
                    value: postData?.[0]?.SANCTIONED_AMT,
                  },
                  BRANCH_CD: {
                    value: postData?.[0]?.BRANCH_CD,
                  },
                };
              }
            } else {
              return {
                ACCT_CD: {
                  value: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentValue?.ACCT_TYPE?.optionData
                  ),
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                ACCT_NM: {
                  value: postData?.[0]?.ACCT_NM,
                },
                TRAN_BAL: {
                  value: postData?.[0]?.TRAN_BAL,
                },
                SANCTIONED_AMT: {
                  value: postData?.[0]?.SANCTIONED_AMT,
                },
              };
            }
          } else if (!field?.value) {
            formState.setDataOnFieldChange("NSC_FD_BTN", { NSC_FD_BTN: false });
            return {
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
              SANCTIONED_AMT: { value: "" },
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
      placeholder: "Account Name",
      type: "text",
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
      label: "TranBalance",
      placeholder: "TranBalance",
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
      name: "SANCTIONED_AMT",
      label: "SanctionedLimit",
      placeholder: "SanctionedLimit",
      isReadOnly: true,
      sequence: 0,
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
      name: "LIMIT_TYPE",
      label: "LimitType",
      placeholder: "LimitType",
      defaultValue: "Normal",
      options: () => {
        return [
          { value: "Normal", label: "Normal Limit" },
          { value: "Hoc", label: "Ad-hoc Limit" },
        ];
      },
      _optionsKey: "limitTypeList",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_CD",
      label: "SecurityCode",
      placeholder: "SecurityCode",
      dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
      options: (dependentValue, formState, _, authState) => {
        if (
          dependentValue?.ACCT_TYPE?.optionData.length &&
          dependentValue?.BRANCH_CD?.value
        ) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            A_PARENT_TYPE:
              dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE.trim(),
          };
          return API.getSecurityListData(apiReq);
        }
        return [];
      },
      disableCaching: true,
      _optionsKey: "getSecurityListData",
      postValidationSetCrossFieldValues: async (field, formState) => {
        if (field?.optionData?.[0]?.SECURITY_TYPE && field?.value) {
          formState.setDataOnFieldChange("SECURITY_CODE", {
            SECURITY_CD: field?.value,
            SECURITY_TYPE: field?.optionData?.[0]?.SECURITY_TYPE.trim(),
          });
        }

        return {
          // FD_BRANCH_CD: { error: "" },
          // FD_TYPE: { error: "" },
          // FD_ACCT_CD: { value: "" },
          // FD_NO: { value: "" },
          // EXPIRY_DT: { value: "" },
          // SEC_AMT: { value: "" },
          // SEC_INT_AMT: { value: "" },
          // SECURITY_VALUE: { value: "" },
          // INT_AMT: { value: "" },
          // INT_RATE: { value: "" },
          // PENAL_RATE: { value: "" },
        };
      },

      // validate: (currField) => {
      //   if (!Boolean(currField?.value)) {
      //     return "Security Code is required.";
      //   }
      //   return "";
      // },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
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
      name: "PARENT_TYPE",
    },
  ],
};
