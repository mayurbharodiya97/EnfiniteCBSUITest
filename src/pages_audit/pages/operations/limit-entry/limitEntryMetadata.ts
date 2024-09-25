import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { utilFunction } from "@acuteinfo/common-base";

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
            DOC_CD: "TRN/046",
          });
        },
        // _optionsKey: "get_Account_Type",
        postValidationSetCrossFieldValues: async (field, formState) => {
          formState.setDataOnFieldChange("NSC_FD_BTN", { NSC_FD_BTN: false });
          return {
            PARENT_TYPE: field?.optionData?.[0]?.PARENT_TYPE.trim(),
            ACCT_CD: { value: "" },
            SECURITY_CD: { value: "", isFieldFocused: false },
            ACCT_NM: { value: "" },
            ACCT_BAL: { value: "" },
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
            let responseData: any = [];
            const messagebox = async (msgTitle, msg, buttonNames) => {
              let buttonName = await formState.MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
              });
              return buttonName;
            };
            if (postData?.length) {
              for (let i = 0; i < postData?.length; i++) {
                if (postData[i]?.O_STATUS !== "0") {
                  let btnName = await messagebox(
                    postData[i]?.O_STATUS === "999"
                      ? "validation fail"
                      : "ALert message",
                    postData[i]?.O_MESSAGE,
                    postData[i]?.O_STATUS === "99" ? ["Yes", "No"] : ["Ok"]
                  );
                  if (btnName === "No" || postData[i]?.O_STATUS === "999") {
                    formState.setDataOnFieldChange("NSC_FD_BTN", {
                      NSC_FD_BTN: false,
                      HDN_CHARGE_AMT: "",
                      HDN_GST_AMT: "",
                      HDN_GST_ROUND: "",
                      HDN_TAX_RATE: "",
                    });
                    return {
                      ACCT_CD: { value: "", isFieldFocused: true },
                      ACCT_NM: { value: "" },
                      TRAN_BAL: { value: "" },
                      SANCTIONED_AMT: { value: "" },
                    };
                  }
                } else {
                  responseData.push(postData[i]);
                }
              }
            }
            if (responseData?.length) {
              formState.setDataOnFieldChange("NSC_FD_BTN", {
                NSC_FD_BTN: true,
                HDN_CHARGE_AMT: responseData?.[0]?.CHARGE_AMT || 0,
                HDN_GST_AMT: responseData?.[0]?.GST_AMT || 0,
                HDN_GST_ROUND: responseData?.[0]?.GST_ROUND || "",
                HDN_TAX_RATE: responseData?.[0]?.TAX_RATE || 0,
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
                ACCT_NM: { value: responseData?.[0]?.ACCT_NM },
                TRAN_BAL: { value: responseData?.[0]?.TRAN_BAL },
                SANCTIONED_AMT: { value: responseData?.[0]?.SANCTIONED_AMT },
                BRANCH_CD: { value: responseData?.[0]?.BRANCH_CD },
                SECURITY_CD: { value: "", isFieldFocused: true },
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
      label: "TranBalance",
      placeholder: "TranBalance",
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
      label: "SanctionedLimit",
      placeholder: "SanctionedLimit",
      isReadOnly: true,
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
          return {
            SECURITY_TYPE_DISPLAY: {
              value: field?.optionData?.[0]?.DISPLAY_NM,
            },
          };
        }
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: {
        xs: 12,
        md: 2.9,
        sm: 2.9,
        lg: 2.9,
        xl: 2.9,
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
        md: 1.6,
        sm: 1.6,
        lg: 1.6,
        xl: 1.6,
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER",
      GridProps: {
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "SECURITY_DETAIL",
      label: "SecurityDetail",
      dependentFields: ["SECURITY_CD"],
      shouldExclude(fieldData, dependentFields) {
        let value =
          dependentFields?.SECURITY_CD?.optionData?.[0]?.SECURITY_TYPE.trim();
        if (value === "OTH") {
          return false;
        } else {
          return true;
        }
      },
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
        componentType: "hidden",
      },
      name: "PARENT_TYPE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SECURITY_TYPE_DISPLAY",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "GET_LIMIT_RATE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PENAL_INT_RATE",
      dependentFields: ["FD_ACCT_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields?.FD_ACCT_CD?.value === "") {
          return "N";
        }
        return "Y";
      },
    },
  ],
};
