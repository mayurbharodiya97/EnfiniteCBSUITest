import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { utilFunction } from "components/utils";

export const limitEntryMetaData = {
  form: {
    name: "limitEntry",
    label: "Limit Entry",
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
        postValidationSetCrossFieldValues: async (field) => {
          if (field?.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
            };
          }
        },
      },
      accountTypeMetadata: {
        // disableCaching: true,
        dependentFields: ["ACCT_TYPE"],
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "ETRN/046",
          });
        },
        // _optionsKey: "get_Account_Type",

        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          if (field?.value) {
            return {
              PARENT_TYPE: {
                value:
                  dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE.trim(),
              },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
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

            if (postData?.[0]?.RESTRICTION) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData?.[0]?.RESTRICTION,
                buttonNames: ["Ok"],
              });
              return {
                ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
                TRAN_BAL: { value: "" },
                SANCTIONED_AMT: { value: "" },
              };
            } else if (postData?.[0]?.MESSAGE1) {
              formState.setDataOnFieldChange("NSC_FD_BTN", {
                NSC_FD_BTN: true,
              });

              formState.MessageBox({
                messageTitle: "Risk Category Alert",
                message: postData?.[0]?.MESSAGE1,
                buttonNames: ["Ok"],
              });
              return {
                ACCT_CD: {
                  value: field.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
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
                HIDDEN_CHARGE_AMT: {
                  value: postData?.[0]?.CHARGE_AMT,
                },
                HIDDEN_GST_AMT: {
                  value: postData?.[0]?.GST_AMT,
                },
                HIDDEN_GST_ROUND: {
                  value: postData?.[0]?.GST_ROUND,
                },
                HIDDEN_TAX_RATE: {
                  value: postData?.[0]?.TAX_RATE,
                },
              };
            } else {
              formState.setDataOnFieldChange("NSC_FD_BTN", {
                NSC_FD_BTN: true,
              });
              return {
                ACCT_CD: {
                  value: field.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
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
                HIDDEN_CHARGE_AMT: {
                  value: postData?.[0]?.CHARGE_AMT,
                },
                HIDDEN_GST_AMT: {
                  value: postData?.[0]?.GST_AMT,
                },
                HIDDEN_GST_ROUND: {
                  value: postData?.[0]?.GST_ROUND,
                },
                HIDDEN_TAX_RATE: {
                  value: postData?.[0]?.TAX_RATE,
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
        componentType: "hidden",
      },
      name: "HIDDEN_CHARGE_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_GST_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_GST_ROUND",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_TAX_RATE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_CHARGE_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_GST_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_GST_ROUND",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_TAX_RATE",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "PARENT_TYPE",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
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
      label: "Tran. Balance",
      placeholder: "Balance",
      type: "text",
      isReadOnly: true,
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
        componentType: "amountField",
      },
      name: "SANCTIONED_AMT",
      label: "Sanctioned Limit",
      placeholder: "San. limit",
      isReadOnly: true,
      type: "text",
      sequence: 0,
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
      name: "LIMIT_TYPE",
      label: "Limit Type",
      placeholder: "Limit Type",
      type: "text",
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
      label: "Security Code",
      placeholder: "Security",
      type: "text",
      dependentFields: [
        "PARENT_TYPE",
        "ACCT_CD",
        "BRANCH_CD",
        "ACCT_TYPE",
        "SECURITY_CD",
        "HIDDEN_CHARGE_AMT",
        "HIDDEN_GST_AMT",
        "HIDDEN_GST_ROUND",
        "HIDDEN_TAX_RATE",
      ],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !dependentFieldsValues?.ACCT_CD?.value ||
          dependentFieldsValues?.ACCT_CD?.error
        ) {
          return true;
        } else {
          return false;
        }
      },
      options: (dependentValue, formState, _, authState) => {
        if (
          dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE ??
          dependentValue?.PARENT_TYPE?.value
        ) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            A_PARENT_TYPE:
              dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE.trim() ??
              dependentValue?.PARENT_TYPE?.value,
          };
          return API.getSecurityListData(apiReq);
        }
        return [];
      },
      disableCaching: true,
      _optionsKey: "getSecurityListData",
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          console.log("<<<sectype", dependentValue);

          if (dependentValue?.SECURITY_CD?.optionData?.[0]?.SECURITY_TYPE) {
            formState.setDataOnFieldChange("SECURITY_CODE", {
              SECURITY_CD: field?.value,
              SECURITY_TYPE:
                dependentValue?.SECURITY_CD?.optionData?.[0]?.SECURITY_TYPE.trim(),
              HDN_CHARGE_AMT: dependentValue?.HIDDEN_CHARGE_AMT?.value,
              HDN_GST_AMT: dependentValue?.HIDDEN_GST_AMT?.value,
              HDN_GST_ROUND: dependentValue?.HIDDEN_GST_ROUND?.value,
              HDN_TAX_RATE: dependentValue?.HIDDEN_TAX_RATE?.value,
            });
          }
          // return {
          // FD_BRANCH_CD: { isErrorBlank: true },
          // };
        }
        return {};
      },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Security Type is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
    },
  ],
};
