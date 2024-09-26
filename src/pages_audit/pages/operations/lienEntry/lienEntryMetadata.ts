import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { isValid } from "date-fns";
import { t } from "i18next";
import { lessThanDate, utilFunction } from "@acuteinfo/common-base";

export const LienEntryMetadata = {
  form: {
    name: "Lien-entry",
    label: "LienEntry",
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
        postValidationSetCrossFieldValues: (field, formState) => {
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
          } else if (!field.value) {
            formState.setDataOnFieldChange("IS_VISIBLE", { IS_VISIBLE: false });
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
        runPostValidationHookAlways: true,
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 2,
          xl: 2,
        },
      },
      accountTypeMetadata: {
        isFieldFocused: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "TRN/652",
          });
        },
        _optionsKey: "get_Account_Type",
        postValidationSetCrossFieldValues: (field, formState) => {
          formState.setDataOnFieldChange("IS_VISIBLE", { IS_VISIBLE: false });

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
        },
        runPostValidationHookAlways: true,
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 2,
          xl: 2,
        },
      },
      accountCodeMetadata: {
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: true,
          isAllowed: (values) => {
            if (values?.value?.length > 20) {
              return false;
            }
            if (values?.value.includes(".")) {
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
              SCREEN_REF: "TRN/048",
            };
            let postData = await GeneralAPI.getAccNoValidation(
              otherAPIRequestPara
            );

            let apiRespMSGdata = postData?.MSG;
            let isReturn;
            const messagebox = async (msgTitle, msg, buttonNames, status) => {
              let buttonName = await formState.MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
              });
              return { buttonName, status };
            };
            if (apiRespMSGdata?.length) {
              for (let i = 0; i < apiRespMSGdata?.length; i++) {
                if (apiRespMSGdata[i]?.O_STATUS !== "0") {
                  let btnName = await messagebox(
                    apiRespMSGdata[i]?.O_STATUS === "999"
                      ? "validation fail"
                      : "ALert message",
                    apiRespMSGdata[i]?.O_MESSAGE,
                    apiRespMSGdata[i]?.O_STATUS === "99"
                      ? ["Yes", "No"]
                      : ["Ok"],
                    apiRespMSGdata[i]?.O_STATUS
                  );

                  if (btnName.buttonName === "No" || btnName.status === "999") {
                    formState.setDataOnFieldChange("IS_VISIBLE", {
                      IS_VISIBLE: false,
                    });
                    return {
                      ACCT_CD: { value: "", isFieldFocused: true },
                      ACCT_NM: { value: "" },
                      TRAN_BAL: { value: "" },
                    };
                  } else {
                    formState.setDataOnFieldChange("IS_VISIBLE", {
                      IS_VISIBLE: true,
                    });
                    isReturn = true;
                  }
                } else {
                  formState.setDataOnFieldChange("IS_VISIBLE", {
                    IS_VISIBLE: true,
                  });
                  isReturn = true;
                }
              }
            }
            if (Boolean(isReturn)) {
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
                  value: postData?.ACCT_NM ?? "",
                },
                TRAN_BAL: {
                  value: postData?.WIDTH_BAL ?? "",
                },
                LIEN_CD: {
                  isFieldFocused: true,
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
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
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
        md: 3.6,
        sm: 3.6,
        lg: 3.6,
        xl: 3.6,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LIEN_STATUS",
      label: "LienStatus",
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
        md: 1.9,
        sm: 1.9,
        lg: 1.9,
        xl: 1.9,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LIEN_CD",
      label: "LienCode",
      placeholder: "SelectLienCode",
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
            PARENT_CD: {
              value:
                field?.optionData?.[0]?.PARENT_TYPE +
                field?.optionData?.[0]?.PARENT_NM,
            },
          };
        }
        return {};
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "PARENT_CD",
      label: "ParentCodeName",
      isReadOnly: true,
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
        componentType: "amountField",
      },
      name: "LIEN_AMOUNT",
      label: "LienAmount",
      FormatProps: {
        allowNegative: false,
      },
      GridProps: {
        xs: 12,
        md: 1.8,
        sm: 1.8,
        lg: 1.8,
        xl: 1.8,
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
      label: "EffectiveDate",
      GridProps: {
        xs: 12,
        md: 1.8,
        sm: 1.8,
        lg: 1.8,
        xl: 1.8,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REMOVAL_DT",
      label: "RemovalDate",
      // isMinWorkingDate: true,
      dependentFields: ["EFECTIVE_DT"],
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return t("Mustbeavaliddate");
        }
        if (
          lessThanDate(
            currentField?.value,
            dependentField?.EFECTIVE_DT?.value,
            {
              ignoreTime: true,
            }
          )
        ) {
          return t("RemovalDtShouldBeGreterThanEqualToEffDT");
        }
        return "";
      },
      GridProps: {
        xs: 12,
        md: 1.9,
        sm: 1.9,
        lg: 1.9,
        xl: 1.9,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LIEN_REASON_CD",
      label: "Reason",
      placeholder: "SelectReason",
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
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      required: true,
      placeholder: "EnterRemarks",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      validate: (columnValue) => {
        let regex = /^[^!&]*$/;
        if (!regex.test(columnValue.value)) {
          return "Special Characters not Allowed in Remarks";
        }
        return "";
      },
      GridProps: {
        xs: 12,
        md: 4.3,
        sm: 4.3,
        lg: 4.3,
        xl: 4.3,
      },
    },
  ],
};
