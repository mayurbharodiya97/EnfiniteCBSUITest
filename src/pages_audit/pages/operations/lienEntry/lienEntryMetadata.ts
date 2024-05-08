import { utilFunction } from "components/utils";
import React from "react";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";

export const LienEntryMetadata = {
  form: {
    name: "Lien-entry",
    label: "Lien Entry",
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
            DOC_CD: "ETRN/652",
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
      name: "LIEN_CD",
      label: "Lien Code",
      placeholder: "Select Lien Code",
      disableCaching: true,
      required: true,
      dependentFields: ["BRANCH_CD"],
      options: (dependentValue, formState, any, authState) => {
        if (dependentValue?.BRANCH_CD?.value) {
          return API.lienCodeDropdown({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
          });
        }
        return [];
      },
      _optionsKey: "LIEN_CD",
      postValidationSetCrossFieldValues: async (field) => {
        if (field?.value) {
          return {
            PARENT_CD: { value: field?.optionData?.[0]?.PARENT_NM },
          };
        }
        return {};
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Lien Code is required."] }],
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
      name: "LIEN_AMOUNT",
      label: "Lien Amount",
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
      name: "LIEN_STATUS",
      label: "Lien Status",
      isReadOnly: true,
      required: true,
      defaultValue: "A",
      options: () => {
        return [
          { value: "A", label: "Active" },
          { value: "E", label: "Expired" },
        ];
      },
      _optionsKey: "LIEN_STATUS",
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
      name: "PARENT_CD",
      label: "Parent Code/Name",
      isReadOnly: true,
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
        componentType: "datePicker",
      },
      name: "EFECTIVE_DT",
      isReadOnly: true,
      required: true,
      isWorkingDate: true,
      label: "Effective Date",
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
      name: "REMOVAL_DT",
      label: "Removal Date",
      isMinWorkingDate: true,
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
      name: "LIEN_REASON_CD",
      label: "Reason",
      placeholder: "Select Reason",
      disableCaching: true,
      dependentFields: ["BRANCH_CD"],
      options: (dependentValue, formState, any, authState) => {
        if (dependentValue?.BRANCH_CD?.value) {
          return API.reasonDropdown({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
          });
        }
        return [];
      },
      _optionsKey: "LIEN_REASON_CD",
      GridProps: {
        xs: 12,
        md: 3.6,
        sm: 3.6,
        lg: 3.6,
        xl: 3.6,
      },
    },

    {
      render: {
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      required: true,
      placeholder: "Enter Remarks",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Remarks is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 3.6,
        sm: 3.6,
        lg: 3.6,
        xl: 3.6,
      },
    },
  ],
};
