import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";
import {
  getLockerOperationDDWdata,
  getLockerSizeDDWdata,
  getLockerTrxDDWdata,
  validateLockerNo,
  validateLockerOperation,
} from "./api";
import { getRelationshipManagerOptions } from "../c-kyc/api";
import { t } from "i18next";

export const lockerTrnsViewFormMetadata = {
  form: {
    name: "LOCKER DATA VIEW FORM",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        container: {
          direction: "row",
          spacing: 1,
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
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      label: "Type",
      placeholder: "Type",
      isReadOnly: true,
      GridProps: { xs: 3, sm: 3, md: 2, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOCKER_NO",
      label: "lockerNumber",
      placeholder: "lockerNumber",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "ACCT_CD",
      label: "ACNo",
      placeholder: "ACNo",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "OP_DATE",
      label: "OpenDate",
      isReadOnly: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SIZE_NM",
      label: "lockerSize",
      placeholder: "lockerSize",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOC_KEY_NO",
      label: "keyNumber",
      placeholder: "keyNumber",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "INST_DUE_DT",
      label: "DueDate",
      isReadOnly: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "REF_AC",
      label: "ReferenceAccount",
      placeholder: "ReferenceAccount",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "REF_AC_BAL",
      label: "referenceAccountBalance",
      placeholder: "referenceAccountBalance",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      placeholder: "AccountName",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "INST_RS",
      label: "totalRentPaid",
      placeholder: "totalRentPaid",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Add1",
      placeholder: "Add1",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LAST_BAL",
      label: "OpeningBalance",
      placeholder: "OpeningBalance",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Add2",
      placeholder: "Add2",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CONF_BAL",
      label: "ClosingBalance",
      placeholder: "ClosingBalance",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CITY_CD",
      label: "City",
      placeholder: "City",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE_CD",
      label: "State",
      placeholder: "State",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "RENT_AMT",
      label: "dueRent",
      placeholder: "dueRent",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      placeholder: "CustomerId",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT",
      label: "Contact",
      placeholder: "Contact",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_NO",
      label: "PAN",
      placeholder: "PAN",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CATEG_NM",
      label: "Category",
      placeholder: "Category",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "INT_SKIP_FLAG",
      label: "keyEmboss",
      placeholder: "keyEmboss",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MODE",
      label: "Mode",
      placeholder: "Mode",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "UNIQUE_ID",
      label: "UniqueId",
      placeholder: "UniqueId",
      isReadOnly: true,
      GridProps: { xs: 4, sm: 4, md: 4, lg: 2, xl: 2 },
    },
  ],
};
export const lockerTrnsEntryFormMetadata = {
  form: {
    name: "lOCKER ENTRY",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        container: {
          direction: "row",
          spacing: 1,
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
        componentType: "hidden",
      },
      name: "MAIN_ACCT_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "MAIN_ACCT_TYPE",
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ACCT_TYPE_",
      label: "AccountType",
      placeholder: "AccountTypePlaceHolder",
      options: (dependentValue, formState, _, authState) => {
        return GeneralAPI.get_Account_Type({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
          DOC_CD: "RPT/49",
        });
      },
      _optionsKey: "get_Account_Type",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOCKER_NO_",
      label: "lockerNumber",
      placeholder: "lockerNumber",
      dependentFields: ["ACCT_TYPE_"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value && dependentFieldsValues?.ACCT_TYPE_?.value.length) {
          if (formState?.isSubmitting) return {};
          let postData = await validateLockerNo({
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE_?.value,
            COMP_CD: auth?.companyID ?? "",
            BRANCH_CD: auth?.user?.branchCode ?? "",
            LOCKER_NO: field.value,
          });
          let btn99;

          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.O_STATUS === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: postData[i]?.O_MSG_TITLE,
                message: postData[i]?.O_MESSAGE,
                icon: "ERROR",
              });
              if (btnName === "Ok") {
                return {
                  LOCKER_NO_: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  REMARKS: {
                    value: "",
                  },
                };
              }
            } else if (postData[i]?.ERR_CODE === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData[i]?.O_MSG_TITLE,
                  message: postData[i]?.O_MESSAGE,
                  icon: "ERROR",
                });
              }
            } else if (postData[i]?.ERR_CODE === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: postData[i]?.O_MSG_TITLE,
                message: postData[i]?.O_MESSAGE,
                icon: "INFO",
                buttonNames: ["Yes", "No"],
              });

              btn99 = btnName;
              if (btnName === "No") {
                return {
                  LOCKER_NO_: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  REMARKS: {
                    value: "",
                  },
                };
              }
            } else if (postData[i]?.O_STATUS === "0") {
              return {
                LOCKER_NO_: {
                  value: field?.value,
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                REMARKS: {
                  value: postData[i]?.ACCT_NM,
                  isFieldFocused: false,
                  ignoreUpdate: false,
                },
              };
            }
          }
        }
      },
      GridProps: { xs: 4, sm: 4, md: 4, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LOC_SIZE_CD",
      label: "lockerSize",
      placeholder: "AccountTypePlaceHolder",
      disableCaching: true,
      dependentFields: ["LOCKER_NO_", "ACCT_TYPE_", "REMARKS"],
      options: (dependentFields, formState, _, authState) => {
        return getLockerSizeDDWdata({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          LOCKER_NO: dependentFields?.LOCKER_NO_?.value,
          ACCT_TYPE: dependentFields?.ACCT_TYPE_?.value,
          ALLOTED: "Y",
        });
      },

      _optionsKey: "getLockerSizeDDWdata",
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        const payload = {
          ACCT_TYPE: currentField?.optionData[0]?.ACCT_TYPE,
          ACCT_CD: currentField?.optionData[0]?.LST_ACCT_CD,
          LOCKER_NO: currentField?.optionData[0]?.LOCKER_NO,
          ACCT_NM: currentField?.optionData[0]?.REMARKS,
        };
        console.log(payload, "payload");

        formState.setDataOnFieldChange("VIEWMST_PAYLOAD", payload);
        if (
          currentField?.optionData[0]?.LST_ACCT_CD &&
          currentField?.optionData[0]?.LST_ACCT_CD
        ) {
          if (
            currentField?.value &&
            currentField?.optionData[0]?.ACCT_TYPE &&
            currentField?.optionData[0]?.LST_ACCT_CD
          ) {
            const reqParameters = {
              BRANCH_CD: authState?.user?.branchCode,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: currentField?.optionData[0]?.ACCT_TYPE,
              ACCT_CD: currentField?.optionData[0]?.LST_ACCT_CD,
              SCREEN_REF: "RPT/49",
            };
            let postData = await GeneralAPI.getAccNoValidation(reqParameters);
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData?.MSG.length; i++) {
              if (postData?.MSG[i]?.O_STATUS === "999") {
                const btnName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG[i]?.O_STATUS === "99") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Confirmation",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG[i]?.O_STATUS === "9") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Alert",
                  message: postData?.MSG[i]?.O_MESSAGE,
                });
              } else if (postData?.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              MAIN_ACCT_CD: {
                value: currentField?.optionData[0]?.LST_ACCT_CD ?? "",
              },
              MAIN_ACCT_TYPE: {
                value: currentField?.optionData[0]?.ACCT_TYPE ?? "",
              },
            };
          }
        }
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "OPER_STATUS",
      label: "Operation",
      validationRun: "onChange",
      placeholder: "Operation",
      options: () => getLockerOperationDDWdata(),
      _optionsKey: "getLockerOperationDDWdata",
      required: true,
      dependentFields: ["LOC_SIZE_CD", "ACCT_TYPE_", "OPER_STATUS"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          currentField?.value &&
          dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.ACCT_TYPE &&
          dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.LST_ACCT_CD
        ) {
          let response = await validateLockerOperation({
            BRANCH_CD: authState?.user?.branchCode,
            COMP_CD: authState?.companyID,
            ACCT_TYPE:
              dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.ACCT_TYPE,
            ACCT_CD:
              dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.LST_ACCT_CD,
            OPER_STATUS: currentField?.value,
            WORKING_DT: authState?.workingDate ?? "",
          });
          let postData = response[0];
          let btn99, returnVal;

          for (let i = 0; i < postData?.MSG.length; i++) {
            if (postData?.MSG[i]?.O_STATUS === "999") {
              const btnName = await formState.MessageBox({
                messageTitle: postData?.MSG[i]?.O_MSG_TITLE,
                message: postData?.MSG[i]?.O_MESSAGE,
              });
              returnVal = "";
            } else if (postData?.MSG[i]?.O_STATUS === "99") {
              const btnName = await formState.MessageBox({
                messageTitle: postData?.MSG[i]?.O_MSG_TITLE,
                message: postData?.MSG[i]?.O_MESSAGE,
                buttonNames: ["Yes", "No"],
              });
              btn99 = btnName;
              if (btnName === "No") {
                returnVal = "";
              }
            } else if (postData?.MSG[i]?.O_STATUS === "9") {
              const btnName = await formState.MessageBox({
                messageTitle: postData?.MSG[i]?.O_MSG_TITLE,
                message: postData?.MSG[i]?.O_MESSAGE,
              });
            } else if (postData?.MSG[i]?.O_STATUS === "0") {
              if (btn99 !== "No") {
                returnVal = postData;
              } else {
                returnVal = "";
              }
            }
          }
          btn99 = 0;
          return {
            ST_TIME: {
              value: postData?.ST_TIME ?? "",
            },
            CL_TIME: {
              value: postData?.CL_TIME ?? "",
            },
            GST_ROUND: {
              value: postData?.GST_ROUND ?? "",
            },
            TAX_RATE: {
              value: postData?.TAX_RATE ?? "",
            },
            OPER_STATUS: {
              value: postData?.OPER_STATUS ?? "",
            },
            CHRG_AMT: {
              value: postData?.CHRG_AMT ?? "",
              isReadOnly: (fieldValue, dependentFields, formState) => {
                if (postData?.ENABLE_DISABLE === "Y") {
                  return true;
                } else return false;
              },
            },
            SERVICE_CHRGE_AUTO: {
              value: postData?.SERVICE_TAX ?? "",
              isReadOnly: (fieldValue, dependentFields, formState) => {
                if (postData?.ENABLE_DISABLE === "Y") {
                  return true;
                } else return false;
              },
            },
          };
        } else if (!currentField?.value) {
          return {
            ST_TIME: { value: "" },
            CL_TIME: { value: "" },
          };
        }
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "Remarks",
      type: "text",
      dependentFields: ["OPER_STATUS"],
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 3, xl: 3 },
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.OPER_STATUS?.value === "I" ||
          dependentFields?.OPER_STATUS?.value === "B"
        ) {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "ST_TIME",
      label: "timeIn",
      placeholder: "timeIn",
      format: "HH:mm:ss",
      type: "text",
      isReadOnly: true,
      dependentFields: ["OPER_STATUS"],
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1.4, xl: 1.4 },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   if (dependentFields?.OPER_STATUS?.value === "I") {
      //     const now = new Date();
      //     const hours = now.getHours().toString().padStart(2, "0");
      //     const minutes = now.getMinutes().toString().padStart(2, "0");
      //     const seconds = now.getSeconds().toString().padStart(2, "0");

      //     return `${hours}:${minutes}:${seconds}`;
      //   }
      // },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "CL_TIME",
      label: "timeOut",
      placeholder: "timeOut",
      format: "HH:mm:ss",
      dependentFields: ["OPER_STATUS"],
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1.4, xl: 1.4 },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   if (dependentFields?.OPER_STATUS?.value === "O") {
      //     const now = new Date();
      //     const hours = now.getHours().toString().padStart(2, "0");
      //     const minutes = now.getMinutes().toString().padStart(2, "0");
      //     const seconds = now.getSeconds().toString().padStart(2, "0");

      //     return `${hours}:${minutes}:${seconds}`;
      //   }
      // },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRX_CD",
      label: "Trx",
      placeholder: "Trx",
      dependentFields: ["OPER_STATUS"],
      options: () => getLockerTrxDDWdata(),
      _optionsKey: "getLockerTrxDDWdata",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TAX_RATE",
      label: "TAX_RATE",
      dependentFields: ["OPER_STATUS"],
      GridProps: { xs: 12, sm: 4, md: 2, lg: 1.2, xl: 1.2 },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "GST_ROUND",
      label: "GST_ROUND",
      dependentFields: ["OPER_STATUS"],
      GridProps: { xs: 12, sm: 4, md: 2, lg: 1.2, xl: 1.2 },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CHRG_AMT",
      label: "Charge",
      validationRun: "onBlur",
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
      dependentFields: ["TAX_RATE", "GST_ROUND", "OPER_STATUS"],
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        return {
          SERVICE_CHRGE_AUTO: {
            value:
              dependentFields?.GST_ROUND?.value === "3"
                ? Math.floor(
                    (parseInt(field?.value) *
                      parseInt(dependentFields?.TAX_RATE?.value)) /
                      100
                  ) ?? ""
                : dependentFields?.GST_ROUND?.value === "2"
                ? Math.ceil(
                    (parseInt(field?.value) *
                      parseInt(dependentFields?.TAX_RATE?.value)) /
                      100
                  ) ?? ""
                : dependentFields?.GST_ROUND?.value === "1"
                ? Math.round(
                    (parseInt(field?.value) *
                      parseInt(dependentFields?.TAX_RATE?.value)) /
                      100
                  ) ?? ""
                : (parseInt(field?.value) *
                    parseInt(dependentFields?.TAX_RATE?.value)) /
                  100,
          },
        };
      },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_CHRGE_AUTO",
      label: "GST",
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
      dependentFields: ["OPER_STATUS"],

      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "SIGN",
      label: "Signature",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 3,
        md: 1,
        lg: 1,
        xl: 1,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "EMP_ID",
      label: "accompanyEmployeeName",
      placeholder: "accompanyEmployeeName",
      disableCaching: true,
      options: (dependentValue, formState, _, authState) =>
        getRelationshipManagerOptions(authState?.companyID),
      _optionsKey: "getEmployeeName",
      dependentFields: ["OPER_STATUS"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.OPER_STATUS?.value === "I" ||
          dependentFields?.OPER_STATUS?.value === "B"
        ) {
          return false;
        }
        return true;
      },
      validationRun: "onBlur",
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (formState?.refId && field.value) {
          let buttonName = await formState.MessageBox({
            messageTitle: "Confirmation",
            message: `${t("Proceed")}?`,
            icon: "CONFIRM",
            buttonNames: ["Yes", "No"],
          });
          if (buttonName === "Yes") {
            let event: any = { preventDefault: () => {} };
            formState?.refId?.current?.handleSubmit(event, "BUTTON_CLICK");
          }
        }
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 4, xl: 4 },
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "TRF_BRANCH_CD",
        label: "transferBranchCd",
        dependentFields: ["TRX_CD"],
        shouldExclude: (val1, dependentFields) => {
          if (dependentFields?.TRX_CD?.value === "3") {
            return false;
          }
          return true;
        },
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      accountTypeMetadata: {
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "LOC_DR",
          });
        },
        _optionsKey: "get_Account_Type_debit_ac_type",
        name: "TRF_ACCT_TYPE",
        label: "transferAcctType",
        dependentFields: ["TRX_CD"],
        shouldExclude: (val1, dependentFields) => {
          if (dependentFields?.TRX_CD?.value === "3") {
            return false;
          }
          return true;
        },
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      accountCodeMetadata: {
        name: "TRF_ACCT_CD",
        label: "transferAccNo",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: [
          "TRX_CD",
          "TRF_ACCT_CD",
          "TRF_ACCT_TYPE",
          "TRF_BRANCH_CD",
        ],
        runPostValidationHookAlways: true,
        AlwaysRunPostValidationSetCrossFieldValues: {
          alwaysRun: true,
          touchAndValidate: true,
        },
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.["TRF_BRANCH_CD"]?.value &&
            dependentFieldValues?.["TRF_ACCT_TYPE"]?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.TRF_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.TRF_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "RPT/49",
            };
            let postData = await GeneralAPI.getAccNoValidation(reqParameters);

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData?.MSG.length; i++) {
              if (postData?.MSG[i]?.O_STATUS === "999") {
                const btnName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG[i]?.O_STATUS === "99") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Confirmation",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG[i]?.O_STATUS === "9") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Alert",
                  message: postData?.MSG[i]?.O_MESSAGE,
                });
              } else if (postData?.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              TRF_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              ACCT_NM: {
                value: postData?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            return {
              ACCT_NM: { value: "" },
            };
          }
        },
        shouldExclude: (val1, dependentFields) => {
          if (dependentFields?.TRX_CD?.value === "3") {
            return false;
          }
          return true;
        },
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "chequeNo",
      placeholder: "Cheque No.",
      type: "text",
      fullWidth: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }

          return true;
        },
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
      dependentFields: [
        "TRF_ACCT_CD",
        "TYPE_CD",
        "TRF_ACCT_TYPE",
        "TRF_BRANCH_CD",
        "TRX_CD",
      ],
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ChequeNoisrequired"] }],
      },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.TRX_CD?.value === "3") {
          return false;
        }
        return true;
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (
          field.value &&
          dependentFieldsValues?.TRF_ACCT_CD?.value.length === 0
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Information",
            message: "Enter Account Information",
            buttonNames: ["Ok"],
          });

          if (buttonName === "Ok") {
            return {
              CHEQUE_NO: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
              TRF_ACCT_TYPE: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
        } else if (
          field.value &&
          dependentFieldsValues?.TRF_ACCT_CD?.value.length
        ) {
          if (formState?.isSubmitting) return {};
          let postData = await GeneralAPI.getChequeNoValidation({
            BRANCH_CD: dependentFieldsValues?.TRF_BRANCH_CD?.value,
            ACCT_TYPE: dependentFieldsValues?.TRF_ACCT_TYPE?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              dependentFieldsValues?.TRF_ACCT_TYPE?.value,
              dependentFieldsValues?.TRF_ACCT_TYPE?.optionData
            ),
            CHEQUE_NO: field.value,
            TYPE_CD: dependentFieldsValues?.TYPE_CD?.value,

            SCREEN_REF: "RPT/49",
          });
          let btn99;

          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.ERR_CODE === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Account Validation Failed",
                message: postData[i]?.ERR_MSG,
              });
              if (btnName === "Ok") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (postData[i]?.ERR_CODE === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "HNI Alert",
                  message: postData[i]?.ERR_MSG,
                });
              }
            } else if (postData[i]?.ERR_CODE === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Risk Category Alert",
                message: postData[i]?.ERR_MSG,
                buttonNames: ["Yes", "No"],
              });

              btn99 = btnName;
              if (btnName === "No") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  CHEQUE_DT: {
                    value: "",
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (postData[i]?.ERR_CODE === "0") {
              return {
                CHEQUE_NO: {
                  value: field?.value,
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
              };
            }
          }
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "accountName",
      isReadOnly: true,
      type: "text",
      fullWidth: true,
      dependentFields: ["TRX_CD"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.TRX_CD?.value === "3") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2.5, xl: 2.5 },
    },
  ],
};
