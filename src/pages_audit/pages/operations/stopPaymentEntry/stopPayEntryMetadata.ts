import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { t } from "i18next";

export const StopPayEntryMetadata = {
  form: {
    name: "Cheque-stop-entry",
    label: "ChequeStopEntry",
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
        validationRun: "onChange",
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
        validationRun: "onChange",
        isFieldFocused: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "TRN/048",
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
        AlwaysRunPostValidationSetCrossFieldValues: {
          alwaysRun: true,
          touchAndValidate: false,
        },
        inputProps: {
          onInput: (event) => {
            if (event.target.value.length > 20) {
              return;
            }
          },
        },
        maxLength: 20,
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
                  value: postData?.TRAN_BAL ?? "",
                },
              };
            }
          } else if (!field?.value) {
            formState.setDataOnFieldChange("IS_VISIBLE", { IS_VISIBLE: false });
            return {
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
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
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
      name: "FLAG",
      label: "ChequeStopType",
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
      validationRun: "onChange",
      postValidationSetCrossFieldValues: async (field) => {
        // if (field?.value) {
        return {
          CHEQUE_FROM: { value: "", error: "" },
          CHEQUE_TO: { value: "", error: "" },
          AMOUNT: { value: "" },
          SERVICE_TAX: { value: "" },
          CHEQUE_DT: { value: "" },
          CHEQUE_AMOUNT: { value: "" },
          REASON_CD: { value: "" },
        };
        // }
      },
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
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "IntimateDate",
      isWorkingDate: true,
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
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "SURR_DT",
      label: "SurrenderDate",
      isWorkingDate: true,
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
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_FROM",
      label: "FromChequeNo",
      placeholder: "EnterFromChequeNo",
      dependentFields: ["ACCT_TYPE", "BRANCH_CD", "ACCT_CD", "FLAG", "TYPE_CD"],
      FormatProps: {
        isAllowed: (values, dependentFields, formState) => {
          if (
            values.floatValue === 0 ||
            values.value === "-" ||
            values?.value?.length > 10
          ) {
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
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            ACCT_CD: dependentValue?.ACCT_CD?.value,
            SCREEN_REF: "ETRN/048",
            CHEQUE_FROM: field?.value,
            CHEQUE_TO: "",
            CHQ_SERIES: true,
            CHRG_CAL: false,
            FLAG: dependentValue?.FLAG?.value,
            TYPE_CD: dependentValue?.TYPE_CD?.value,
            ENTERED_COMP_CD: authState?.companyID,
            ENTERED_BRANCH_CD: authState?.user?.branchCode,
          };
          let postData = await API.chequeValidate(apiReq);

          if (postData?.[0]?.ERR_CODE !== "0" && postData?.[0]?.ERR_MSG) {
            let res = await formState.MessageBox({
              messageTitle: "ChequeValidationFailed",
              message: postData?.[0]?.ERR_MSG,
            });
            if (res === "Ok") {
              return {
                CHEQUE_FROM: { value: "", isFieldFocused: true },
                SERVICE_TAX: { value: "" },
                AMOUNT: { value: "" },
                CHEQUE_TO: {
                  value: "",
                  isFieldFocused: false,
                },
              };
            }
          } else {
            return {
              CHEQUE_TO: { value: field?.value },
              SERVICE_TAX: { value: "" },
              AMOUNT: { value: "" },
              SERVICE_C_FLAG: { value: "" },
              ROUND_OFF_FLAG: { value: "" },
              GST: { value: "" },
            };
          }
        } else if (!field?.value) {
          return {
            CHEQUE_TO: { value: "", isErrorBlank: true },
            SERVICE_TAX: { value: "" },
            AMOUNT: { value: "" },
            SERVICE_C_FLAG: { value: "" },
            ROUND_OFF_FLAG: { value: "" },
            GST: { value: "" },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FromChequenorequired"] }],
      },
      required: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_TO",
      label: "ToChequeNo",
      placeholder: "EnterToChequeNo",
      dependentFields: [
        "ACCT_TYPE",
        "BRANCH_CD",
        "ACCT_CD",
        "FLAG",
        "CHEQUE_FROM",
        "TYPE_CD",
      ],
      validate: (field, dependentFields) => {
        if (!field?.value) {
          return "ToChequenorequired";
        } else if (
          Number(dependentFields?.CHEQUE_FROM?.value) > Number(field?.value)
        ) {
          return t("ChequeToValidateMsg");
        }
        return "";
      },
      FormatProps: {
        isAllowed: (values, dependentFields, formState) => {
          if (
            values.floatValue === 0 ||
            values.value === "-" ||
            values?.value?.length > 10
          ) {
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
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            ACCT_CD: dependentValue?.ACCT_CD?.value,
            SCREEN_REF: "ETRN/048",
            CHEQUE_FROM: dependentValue?.CHEQUE_FROM?.value,
            CHEQUE_TO: field?.value,
            CHQ_SERIES: true,
            CHRG_CAL: true,
            FLAG: dependentValue?.FLAG?.value,
            TYPE_CD: dependentValue?.TYPE_CD?.value,
            ENTERED_COMP_CD: authState?.companyID,
            ENTERED_BRANCH_CD: authState?.user?.branchCode,
          };
          let postData = await API.chequeValidate(apiReq);

          if (postData?.[0]?.ERR_CODE !== "0" && postData?.[0]?.ERR_MSG) {
            let res = await formState.MessageBox({
              messageTitle: "ChequeValidationFailed",
              message: postData?.[0]?.ERR_MSG,
            });

            if (res === "Ok") {
              return {
                CHEQUE_TO: { value: "", isFieldFocused: true },
                SERVICE_TAX: { value: "" },
                AMOUNT: { value: "" },
                SERVICE_C_FLAG: { value: "" },
                ROUND_OFF_FLAG: { value: "" },
                GST: { value: "" },
              };
            }
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
                value: postData?.[0]?.GST_AMT ?? "",
              },
              AMOUNT: {
                value: postData?.[0]?.CHRG_AMT ?? "",
              },
            };
          }
        } else if (!field?.value) {
          return {
            CHEQUE_TO: { value: dependentValue?.CHEQUE_FROM?.value },
            SERVICE_TAX: { value: "" },
            AMOUNT: { value: "" },
            SERVICE_C_FLAG: { value: "" },
            ROUND_OFF_FLAG: { value: "" },
            GST: { value: "" },
          };
        }
        return {};
      },
      // runPostValidationHookAlways: true,
      required: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "REASON_CD",
      label: "Reason",
      placeholder: "SelectReason",
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
        md: 5,
        sm: 5,
        lg: 5,
        xl: 5,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      FormatProps: {
        allowNegative: false,
        isAllowed: (values) => {
          if (values?.value?.length > 7) {
            return false;
          }
          return true;
        },
      },
      label: "ChargeAmount",
      dependentFields: ["FLAG", "ROUND_OFF_FLAG", "GST", "SERVICE_C_FLAG"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.SERVICE_C_FLAG?.value === "Y") {
          return true;
        } else {
          return false;
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
            SERVICE_TAX: {
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
                    100,
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
      name: "SERVICE_TAX",
      label: "GSTAmount",
      isReadOnly: true,

      FormatProps: {
        allowNegative: false,
      },
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
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "ChequeDate",
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
      name: "CHEQUE_AMOUNT",
      label: "ChequeAmount",
      placeholder: "Cheque Amount",
      FormatProps: {
        allowNegative: false,
      },
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
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
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
      validate: (columnValue) => {
        let regex = /^[^!&]*$/;
        if (!regex.test(columnValue.value)) {
          return t("SpecialCharactersNotAllowedRemarks");
        }
        return "";
      },
      inputProps: {
        onInput: (event) => {
          if (event.target.value.length > 100) {
            return;
          }
        },
      },
      maxLength: 100,
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
      placeholder: "Enter Remarks",
      validate: (columnValue) => {
        let regex = /^[^!&]*$/;
        if (!regex.test(columnValue.value)) {
          return t("SpecialCharactersNotAllowedRemarks");
        }
        return "";
      },
      inputProps: {
        onInput: (event) => {
          if (event.target.value.length > 100) {
            return;
          }
        },
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
    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
    },
  ],
};
