import { utilFunction } from "@acuteinfo/common-base";
import * as API from "../../api";

export const atmentrymetadata = {
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
      fullWidth: true,
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
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      fullWidth: true,
      // isFieldFocused: true,
      placeholder: "Enter Customer Id",
      dependentFields: ["PARA_602", "PARA_946"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          let apiRequest = {
            ACCT_CD: "",
            ACCT_TYPE: "",
            BRANCH_CD: "",
            PARA_602: dependentValue?.PARA_602?.value,
            PARA_946: dependentValue?.PARA_946?.value,
            SCREEN_REF: "MST/846",
            CUSTOMER_ID: field?.value,
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
          console.log("<<<postdata", postData);
          if (apiRespMSGdata?.length) {
            for (let i = 0; i < apiRespMSGdata?.length; i++) {
              if (apiRespMSGdata[i]?.O_STATUS !== "0") {
                let btnName = await messagebox(
                  apiRespMSGdata[i]?.O_STATUS === "999"
                    ? "validation fail"
                    : "ALert message",
                  apiRespMSGdata[i]?.O_MESSAGE,
                  apiRespMSGdata[i]?.O_STATUS === "99" ? ["Yes", "No"] : ["Ok"],
                  apiRespMSGdata[i]?.O_STATUS
                );

                console.log("<<<buttnnama", btnName);
                if (btnName.buttonName === "No" || btnName.status === "999") {
                  formState.setDataOnFieldChange("RES_DATA", {});
                  return {
                    CUSTOMER_ID: { value: "", isFieldFocused: true },
                    MOBILE_NO: { value: "" },
                    ORGINAL_NM: { value: "" },
                    ACCT_NM: { value: "" },
                    SMS_ALERT: { value: "" },
                    DISABLE_SMS_ALERT: { value: "" },
                  };
                } else {
                  formState.setDataOnFieldChange("RES_DATA", {
                    validateData: {
                      ...postData?.[0],
                    },
                  });
                  isReturn = true;
                }
              } else {
                formState.setDataOnFieldChange("RES_DATA", {
                  validateData: {
                    ...postData?.[0],
                  },
                });
                isReturn = true;
              }
            }
          }
          if (Boolean(isReturn)) {
            return {
              ACCT_CD: {
                value: field?.value,
                ignoreUpdate: true,
                isFieldFocused: false,
              },
              ORGINAL_NM: { value: postData?.[0]?.ORGINAL_NM },
              ACCT_NM: { value: postData?.[0]?.ACCT_NM },
              MOBILE_NO: { value: postData?.[0]?.MOBILE_NO },
              SMS_ALERT: { value: postData?.[0]?.SMS_ALERT },
              DISABLE_SMS_ALERT: { value: postData?.[0]?.DISABLE_SMS_ALERT },
            };
          }
        } else if (!field?.value) {
          return {
            MOBILE_NO: { value: "" },
            ORGINAL_NM: { value: "" },
            ACCT_NM: { value: "" },
            SMS_ALERT: { value: "" },
            DISABLE_SMS_ALERT: { value: "" },
          };
        }
        return {};
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
    {
      render: {
        componentType: "textField",
      },
      name: "ORGINAL_NM",
      label: "AcctOrignalName",
      isReadOnly: true,
      fullWidth: true,
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
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "NameOnCard",
      required: true,
      fullWidth: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      //   maxLength: 18,
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
        componentType: "numberFormat",
      },
      name: "MOBILE_NO",
      fullWidth: true,
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
      fullWidth: true,
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
        md: 1,
        sm: 1,
        lg: 1,
        xl: 1,
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "CARD_PRINT",
      label: "CardPrinting",
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        validationRun: "onChange",
        fullWidth: true,
        label: "SBAccountBranch",
        name: "SB_BRANCH_CD",
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
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
            };
          } else if (!field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
            };
          }
        },

        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        label: "SBAccountType",
        fullWidth: true,
        name: "SB_ACCT_TYPE",
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        validationRun: "onChange",
        options: (dependentValue, formState, _, authState) => {
          return API.acctTypeList({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "SB",
          });
        },
        _optionsKey: "SBacctTypeList",
        postValidationSetCrossFieldValues: (field, formState) => {
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
            CUSTOMER_ID: { value: "" },
            MOBILE_NO: { value: "" },
            ORGINAL_NM: { value: "" },
            SMS_ALERT: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        label: "SBAccountCode",
        name: "SB_ACCT_CD",
        fullWidth: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        // disableCaching: true,
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

        dependentFields: [
          "SB_BRANCH_CD",
          "SB_ACCT_TYPE",
          "PARA_946",
          "PARA_602",
        ],
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          if (
            field?.value &&
            dependentValue?.SB_BRANCH_CD?.value &&
            dependentValue?.SB_ACCT_TYPE?.value
          ) {
            let apiRequest = {
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.SB_ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.SB_BRANCH_CD?.value,
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
            console.log("<<<postdata", postData);
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

                  console.log("<<<buttnnama", btnName);
                  if (btnName.buttonName === "No" || btnName.status === "999") {
                    return {
                      SB_ACCT_CD: { value: "", isFieldFocused: true },
                      SB_ACCT_NM: { value: "" },
                    };
                  } else {
                    isReturn = true;
                  }
                } else {
                  isReturn = true;
                }
              }
            }
            if (Boolean(isReturn)) {
              return {
                SB_ACCT_CD: {
                  value: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentValue?.ACCT_TYPE?.optionData
                  ),
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                SB_ACCT_NM: { value: postData?.[0]?.ACCT_NM },
              };
            }
          } else if (!field?.value) {
            return {
              ACCT_NM: { value: "" },
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
      name: "SB_ACCT_NM",
      label: "SBAccountName",
      type: "text",
      fullWidth: true,
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
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        label: "CAAccountBranch",
        name: "CA_BRANCH_CD",
        fullWidth: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
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
            };
          } else if (!field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
            };
          }
        },

        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        label: "CAAccountType",
        name: "CA_TYPE_CD",
        fullWidth: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        validationRun: "onChange",
        options: (dependentValue, formState, _, authState) => {
          return API.acctTypeList({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "CA",
          });
        },
        _optionsKey: "CAacctTypeList",
        postValidationSetCrossFieldValues: (field, formState) => {
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        fullWidth: true,
        // disableCaching: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        label: "CAAccountCode",
        name: "CA_ACCT_CD",
        render: {
          componentType: "textField",
        },
        dependentFields: [
          "CA_BRANCH_CD",
          "CA_ACCT_TYPE",
          "PARA_946",
          "PARA_602",
        ],
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
            dependentValue?.CA_BRANCH_CD?.value &&
            dependentValue?.CA_ACCT_TYPE?.value
          ) {
            let apiRequest = {
              CA_ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.CA_ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.CA_ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.CA_BRANCH_CD?.value,
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
            console.log("<<<postdata", postData);
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

                  console.log("<<<buttnnama", btnName);
                  if (btnName.buttonName === "No" || btnName.status === "999") {
                    return {
                      CA_ACCT_CD: { value: "", isFieldFocused: true },
                      CA_ACCT_NM: { value: "" },
                    };
                  } else {
                    isReturn = true;
                  }
                } else {
                  isReturn = true;
                }
              }
            }
            if (Boolean(isReturn)) {
              return {
                CA_ACCT_CD: {
                  value: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentValue?.CA_ACCT_TYPE?.optionData
                  ),
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                CA_ACCT_NM: { value: postData?.[0]?.ACCT_NM },
              };
            }
          } else if (!field?.value) {
            return {
              ACCT_NM: { value: "" },
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
      name: "CA_ACCT_NM",
      label: "CAAccountName",
      type: "text",
      fullWidth: true,
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
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        label: "ODAccountBranch",
        fullWidth: true,
        name: "CC_BRANCH_CD",
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
        validationRun: "onChange",
        postValidationSetCrossFieldValues: (field, formState) => {
          if (field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              CUSTOMER_ID: { value: "" },
              MOBILE_NO: { value: "" },
              ORGINAL_NM: { value: "" },
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
              SMS_ALERT: { value: "" },
            };
          }
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
      accountTypeMetadata: {
        label: "ODAccountType",
        name: "CC_ACCT_TYPE",
        fullWidth: true,
        validationRun: "onChange",
        options: (dependentValue, formState, _, authState) => {
          return API.acctTypeList({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "OD",
          });
        },
        _optionsKey: "CCacctTypeList",
        postValidationSetCrossFieldValues: (field, formState) => {
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
            CUSTOMER_ID: { value: "" },
            MOBILE_NO: { value: "" },
            ORGINAL_NM: { value: "" },
            SMS_ALERT: { value: "" },
          };
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
      accountCodeMetadata: {
        fullWidth: true,
        // disableCaching: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        label: "ODAccountCode",
        name: "CC_ACCT_CD",
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
        dependentFields: [
          "CC_BRANCH_CD",
          "CC_ACCT_TYPE",
          "PARA_946",
          "PARA_602",
        ],
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          if (
            field?.value &&
            dependentValue?.CC_BRANCH_CD?.value &&
            dependentValue?.CC_ACCT_TYPE?.value
          ) {
            let apiRequest = {
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.CC_ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.CC_ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.CC_BRANCH_CD?.value,
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
            console.log("<<<postdata", postData);
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

                  console.log("<<<buttnnama", btnName);
                  if (btnName.buttonName === "No" || btnName.status === "999") {
                    return {
                      CC_ACCT_CD: { value: "", isFieldFocused: true },
                      CC_ACCT_NM: { value: "" },
                    };
                  } else {
                    isReturn = true;
                  }
                } else {
                  isReturn = true;
                }
              }
            }
            if (Boolean(isReturn)) {
              return {
                CC_ACCT_CD: {
                  value: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentValue?.CC_ACCT_TYPE?.optionData
                  ),
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                CC_ACCT_NM: { value: postData?.[0]?.ACCT_NM },
              };
            }
          } else if (!field?.value) {
            return {
              CC_ACCT_NM: { value: "" },
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
      name: "CC_ACCT_NM",
      label: "ODAccountName",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
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
  ],
};
