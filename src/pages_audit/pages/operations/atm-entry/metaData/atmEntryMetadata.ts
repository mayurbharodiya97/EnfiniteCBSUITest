import { GeneralAPI } from "registry/fns/functions";
import { utilFunction } from "@acuteinfo/common-base";
import * as API from "../api";

export const AtmEntryMetaData = {
  form: {
    name: "atm-registration-metadata602",
    label: "ATMRegistrationEntryMST846",
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
          spacing: 1.5,
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
        componentType: "typography",
      },
      name: "TOTAL",
      label: "",
      shouldExclude: (field) => {
        if (field?.value) {
          return false;
        }
        return true;
      },
      TypographyProps: { variant: "subtitle2" },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
        pt: "6px !important",
      },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        validationRun: "onChange",
        dependentFields: ["PARA_311"],
        isReadOnly: (fieldData, dependentFieldsValues, formState) => {
          if (
            Number(formState?.auth?.role) <
            Number(dependentFieldsValues?.PARA_311?.value)
          ) {
            return true;
          } else {
            return false;
          }
        },
        postValidationSetCrossFieldValues: (field, formState) => {
          if (field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              CUSTOMER_ID: { value: "" },
              MOBILE_NO: { value: "" },
              ORGINAL_NM: { value: "" },
              ACCOUNT_NAME: { value: "" },
              SMS_ALERT: { value: "" },
            };
          } else if (!field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              CUSTOMER_ID: { value: "" },
              MOBILE_NO: { value: "" },
              ORGINAL_NM: { value: "" },
              ACCOUNT_NAME: { value: "" },
              SMS_ALERT: { value: "" },
            };
          }
        },
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 2,
          xl: 2,
        },

        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 2,
          xl: 2,
        },
        validationRun: "onChange",
        isFieldFocused: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "MST/846",
          });
        },
        _optionsKey: "securityDropDownListType",
        postValidationSetCrossFieldValues: (field, formState) => {
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
            CUSTOMER_ID: { value: "" },
            MOBILE_NO: { value: "" },
            ORGINAL_NM: { value: "" },
            ACCOUNT_NAME: { value: "" },
            SMS_ALERT: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        // disableCaching: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
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
        dependentFields: ["BRANCH_CD", "ACCT_TYPE", "PARA_946", "PARA_602"],
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
            let apiRequest = {
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              PARA_602: dependentValue?.PARA_602?.value,
              PARA_946: dependentValue?.PARA_946?.value,
              SCREEN_REF: "MST/846",
              CUSTOMER_ID: "",
            };

            let postData = await API.validateAcctAndCustId(apiRequest);
            let apiRespMSGdata = postData?.[0]?.MSG;
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
                    formState.setDataOnFieldChange("RES_DATA", {});
                    return {
                      ACCT_CD: { value: "", isFieldFocused: true },
                      ACCT_NM: { value: "" },
                      CUSTOMER_ID: { value: "" },
                      MOBILE_NO: { value: "" },
                      ORGINAL_NM: { value: "" },
                      ACCOUNT_NAME: { value: "" },
                      SMS_ALERT: { value: "" },
                    };
                  } else {
                    formState.setDataOnFieldChange("RES_DATA", {
                      validateData: {
                        ...postData?.[0],
                        COMP_CD: authState?.companyID,
                        BRANCH_CD: dependentValue?.BRANCH_CD?.value,
                        ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
                        ACCT_CD: field?.value,
                      },
                      isVisible: true,
                    });
                    isReturn = true;
                  }
                } else {
                  formState.setDataOnFieldChange("RES_DATA", {
                    validateData: {
                      ...postData?.[0],
                      COMP_CD: authState?.companyID,
                      BRANCH_CD: dependentValue?.BRANCH_CD?.value,
                      ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
                      ACCT_CD: field?.value,
                    },
                    isVisible: true,
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
                ACCT_NM: { value: postData?.[0]?.ACCT_NM },
                CUSTOMER_ID: { value: postData?.[0]?.CUSTOMER_ID },
                MOBILE_NO: { value: postData?.[0]?.MOBILE_NO },
                ORGINAL_NM: { value: postData?.[0]?.ORGINAL_NM },
                ACCOUNT_NAME: { value: postData?.[0]?.ACCOUNT_NAME },
                SMS_ALERT: {
                  value: postData?.[0]?.SMS_ALERT === "Y" ? true : false,
                },
                DISABLE_SMS_ALERT: { value: postData?.[0]?.DISABLE_SMS_ALERT },
              };
            }
          } else if (!field?.value) {
            return {
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
              CUSTOMER_ID: { value: "" },
              MOBILE_NO: { value: "" },
              ORGINAL_NM: { value: "" },
              ACCOUNT_NAME: { value: "" },
              SMS_ALERT: { value: "" },
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
      type: "text",
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
        componentType: "formbutton",
      },
      name: "CARD_PRINT",
      label: "CardPrinting",
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
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
        componentType: "textField",
      },
      name: "ORGINAL_NM",
      label: "AcctOrignalName",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 4.5,
        sm: 4.5,
        lg: 4.5,
        xl: 4.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCOUNT_NAME",
      label: "NameOnCard",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      maxLength: 18,
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
        componentType: "spacer",
      },
      name: "SPACER",
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "MOBILE_NO",
      isReadOnly: true,
      label: "MobileNo",
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
        componentType: "checkbox",
      },
      name: "SMS_ALERT",
      label: "SMSAlert",
      dependentFields: ["DISABLE_SMS_ALERT"],
      isReadOnly: (fieldData, dependentFieldsValues) => {
        if (dependentFieldsValues?.DISABLE_SMS_ALERT?.value === "Y") {
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
        componentType: "hidden",
      },
      name: "DISABLE_SMS_ALERT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_602",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_946",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_311",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SB_ACCT_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CA_ACCT_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CC_ACCT_CD",
    },
  ],
};
