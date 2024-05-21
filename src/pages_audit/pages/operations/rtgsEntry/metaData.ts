import { utilFunction } from "components/utils";
import {
  getAccountDetail,
  getIfscBankDetail,
  getIfscBenDetail,
  getJointDetailsList,
  getRtgsTransactionTypeList,
} from "./api";
import { GridMetaDataType } from "components/dataTableStatic";
import { format, isValid } from "date-fns";
import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { isValidDate } from "components/utils/utilFunctions/function";
export const RtgsEntryFormMetaData = {
  form: {
    name: "rtgsEntry",
    label: "RTGS Entry(MST/552)",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
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
        componentType: "autocomplete",
      },
      name: "ENTRY_TYPE",
      label: "RTGS/NEFT",
      defaultValue: "RTGS",
      options: () => {
        return API.getEntryType();
      },
      _optionsKey: "getEntryType",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Date",
      placeholder: "",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRAN_TYPE",
      label: "Transaction Type",
      defaultValue: "R42",
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 2.4 },
      skipDefaultOption: true,
      options: () => {
        return API.getRtgsTransactionTypeList({
          MSG_FLOW: "O",
        });
      },
      _optionsKey: "getRtgsTransactionTypeList",
      disableCaching: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Please Select the Transaction Type"] },
        ],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_NO",
      label: "Slip No.",
      type: "text",
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DEF_TRAN_CD",
      label: "Comm. Type",
      defaultValue: "149",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
      options: (dependentValue, formState, _, authState) => {
        return API.getCommTypeList({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          CODE: "RTGSO",
        });
      },
      _optionsKey: "getCommTypeList",
      disableCaching: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Please Select the Comm. Definition"] },
        ],
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "BR_IFSCCODE",
      label: "IFSC",
      defaultValue: "SBI0000KBCB",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
      options: async (dependentValue, formState, _, authState) => {
        const data = await API.getIfscCodeList({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        });
        formState.setDataOnFieldChange("IFSC_DATA", data);
        return data;
      },
      _optionsKey: "getIfscCodeList",
      disableCaching: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Please enter Ordering Branch IFSCode"],
          },
        ],
      },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        // defaultValue: "099 ",
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        runPostValidationHookAlways: true,
        schemaValidation: {
          type: "string",
          rules: [
            {
              name: "required",
              params: [" Please Enter Ordering A/c Branch"],
            },
          ],
        },

        postValidationSetCrossFieldValues: (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          formState.setDataOnFieldChange("ACCT_CD_BLANK");
          return {
            ACCT_NM: { value: "" },
            LIMIT_AMOUNT: { value: "" },
            ACCT_NAME: { value: "" },
            CONTACT_INFO: { value: "" },
            ACCT_MODE: { value: "" },
            ADD1: { value: "" },
            TRAN_BAL: { value: "" },
            ACCT_CD: { value: "" },
          };
        },
      },

      accountTypeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        isFieldFocused: true,
        defaultfocus: true,
        defaultValue: "",
        runPostValidationHookAlways: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "MST/552",
          });
        },
        schemaValidation: {
          type: "string",
          rules: [
            {
              name: "required",
              params: [" Please Enter Ordering A/c Type"],
            },
          ],
        },
        // schemaValidation: {
        //   type: "string",
        //   rules: [{ name: "", params: [""] }],
        // },
        _optionsKey: "get_Account_Type",
        // postValidationSetCrossFieldValues: (
        //   field,
        //   formState,
        //   auth,
        //   dependentFieldsValues
        // ) => {
        //   if (formState?.isSubmitting) return {};
        //   if (Boolean(formState?.isBackButton)) return {};
        //   // formState.setDataOnFieldChange("ACCT_CD_BLANK");
        //   return {
        //     ACCT_CD: { value: "" },
        //     ACCT_NM: { value: "" },
        //     LIMIT_AMOUNT: { value: "" },
        //     ACCT_NAME: { value: "" },
        //     CONTACT_INFO: { value: "" },
        //     ACCT_MODE: { value: "" },
        //     ADD1: { value: "" },
        //     TRAN_BAL: { value: "" },
        //   };
        // },
      },
      accountCodeMetadata: {
        fullWidth: true,
        FormatProps: {
          allowNegative: false,
          isAllowed: (values) => {
            if (values?.value?.length > 6) {
              return false;
            }
            return true;
          },
        },
        disableCaching: false,
        // schemaValidation: {
        //   type: "string",
        //   rules: [{ name: "", params: [""] }],
        // },
        schemaValidation: {
          type: "string",
          rules: [
            {
              name: "required",
              params: [" Please Enter Ordering A/c Number"],
            },
          ],
        },
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (Boolean(formState?.isBackButton)) return {};
          if (
            field.value &&
            dependentFieldsValues?.["ACCT_TYPE"]?.value &&
            dependentFieldsValues?.["BRANCH_CD"]?.value
          ) {
            let Apireq = {
              COMP_CD: auth?.companyID,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentFieldsValues?.["ACCT_TYPE"]?.optionData
              ),
              ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
              BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
              AMOUNT: "",
              SCREEN_REF: "EMST/552",
            };
            formState.setDataOnFieldChange("API_REQ", Apireq);
            let postData = await getAccountDetail(Apireq);

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData.length; i++) {
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Account Validation Failed",
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "HNI Alert",
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Risk Category Alert",
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });

                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
                let jointDetail = await getJointDetailsList({
                  COMP_CD: auth?.companyID,
                  BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentFieldsValues?.["ACCT_TYPE"]?.optionData
                  ),
                  ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
                });
                formState.setDataOnFieldChange("JOINT_DETAIL", jointDetail);
              }
            }
            btn99 = 0;
            return {
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: field?.value.padStart(6, "0")?.padEnd(20, " "),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              TRAN_BAL: {
                value: returnVal?.TRAN_BAL ?? "",
              },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
              ACCT_NAME: {
                value: returnVal?.ACCT_NAME ?? "",
              },
              ADD1: {
                value: returnVal?.ADD1 ?? "",
              },
              LIMIT_AMOUNT: {
                value: returnVal?.LIMIT_AMOUNT ?? "",
              },
              CONTACT_INFO: {
                value: returnVal?.CONTACT_INFO ?? "",
              },
              ACCT_MODE: {
                value: returnVal?.ACCT_MODE ?? "",
              },
              PARA_BNFCRY: {
                value: returnVal?.PARA_BNFCRY ?? "",
              },
            };
          } else if (!field?.value) {
            return {
              ACCT_NM: { value: "" },
              LIMIT_AMOUNT: { value: "" },
              ACCT_NAME: { value: "" },
              CONTACT_INFO: { value: "" },
              ACCT_MODE: { value: "" },
              ADD1: { value: "" },
              TRAN_BAL: { value: "" },
              PARA_BNFCRY: { value: "" },
            };
          }

          return {};
        },
        runPostValidationHookAlways: true,
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_BNFCRY",
      label: "",
      type: "text",
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NAME",
      label: "A/C Name",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Shadow.Balance",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "Limit",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MODE",
      label: "A/C Mode",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Ord.A/C Name",
      type: "text",
      fullWidth: true,
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Please enter Ordering A/c Name"],
          },
        ],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "A/C Address",
      type: "text",
      fullWidth: true,
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Please enter Ordering A/c Address"],
          },
        ],
      },
    },

    {
      render: {
        componentType: "textField",
        // componentType: "phoneNumber",
      },
      name: "CONTACT_INFO",
      label: "Contact Number",
      placeholder: "Mobile Number",
      type: "string",
      GridProps: { xs: 12, sm: 1.9, md: 1.9, lg: 1.9, xl: 1.9 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Please enter Ordering A/c Contact Information"],
          },
        ],
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Cheque No.",
      type: "text",
      required: true,
      autoComplete: "off",
      // isFieldFocused: true,
      // defaultfocus: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 10) {
            return false;
          }

          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Please enter Cheque Number"],
          },
        ],
      },
      dependentFields: ["ACCT_CD", "ACCT_TYPE", "BRANCH_CD"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (
          field.value &&
          dependentFieldsValues?.["ACCT_CD"]?.value.length === 0
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
              ACCT_TYPE: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
        } else if (
          field.value &&
          dependentFieldsValues?.["ACCT_CD"]?.value?.length
        ) {
          let postData = await API.getRtgsChequeNoValidation({
            BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
            ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              dependentFieldsValues?.["ACCT_CD"]?.value,
              dependentFieldsValues?.["ACCT_TYPE"]?.optionData
            ),
            CHQ_NO: field.value,
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
                  CHEQUE_DT: {
                    value: "",
                    isFieldFocused: false,
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

      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      type: "text",
      fullWidth: true,
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 4.4, md: 4.4, lg: 4.4, xl: 4.4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Amount",
      placeholder: "",
      type: "text",
      required: true,
      FormatProps: {
        allowNegative: false,
      },
      dependentFields: [
        "ACCT_CD",
        "ACCT_TYPE",
        "BRANCH_CD",
        "ENTRY_TYPE",
        "DEF_TRAN_CD",
      ],
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Please Enter RTGS/NEFT Ordering Amount"],
          },
        ],
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          field.value &&
          dependentFieldsValues?.["ACCT_CD"]?.value.length === 0
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Information",
            message: "Enter Account Information",
            buttonNames: ["Ok"],
          });

          if (buttonName === "Ok") {
            return {
              AMOUNT: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
              ACCT_TYPE: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
        } else if (
          field.value &&
          dependentFieldsValues?.["ACCT_CD"]?.value &&
          dependentFieldsValues?.["ACCT_TYPE"]?.value &&
          dependentFieldsValues?.["BRANCH_CD"]?.value &&
          dependentFieldsValues?.["ENTRY_TYPE"]?.value &&
          dependentFieldsValues?.["DEF_TRAN_CD"]?.value
        ) {
          console.log(
            "test",
            field.value,
            field.value <
              dependentFieldsValues?.["ENTRY_TYPE"]?.optionData?.[0]?.TRN_LIMIT
          );
          if (
            field.value <
            dependentFieldsValues?.["ENTRY_TYPE"]?.optionData?.[0]?.TRN_LIMIT
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "Validation Failed",
              message: `Amount can't be less than ${dependentFieldsValues?.["ENTRY_TYPE"]?.optionData?.[0]?.TRN_LIMIT} (RTGS Minimum Limit)`,
              buttonNames: ["Ok"],
            });
            if (buttonName === "Ok") {
              return {
                AMOUNT: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                COMM_AMT: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
              };
            }
          } else {
            let Validate = await API.validateAmount({
              BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
              ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                dependentFieldsValues?.["ACCT_CD"]?.value,
                dependentFieldsValues?.["ACCT_TYPE"]?.optionData
              ),
              AMOUNT: field.value,
              DOC_CD: "MST/552",
            });
            let btn99;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < Validate.length; i++) {
              if (Validate[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Account Validation Failed",
                  message: Validate[i]?.O_MESSAGE,
                });
                if (btnName === "Ok") {
                  return {
                    AMOUNT: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                    COMM_AMT: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (Validate[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "HNI Alert",
                    message: Validate[i]?.O_MESSAGE,
                  });
                }
              } else if (Validate[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Risk Category Alert",
                  message: Validate[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });

                btn99 = btnName;
                if (btnName === "No") {
                  return {
                    COMM_AMT: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                    AMOUNT: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (Validate[i]?.O_STATUS === "0") {
                let postData = await API.getRtgsAmountChargeValidation({
                  COMP_CD: auth?.companyID,
                  BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
                  ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    dependentFieldsValues?.["ACCT_CD"]?.value,
                    dependentFieldsValues?.["ACCT_TYPE"]?.optionData
                  ),
                  DEF_TRAN_CD: dependentFieldsValues?.["DEF_TRAN_CD"]?.value,
                  ENTRY_TYPE: dependentFieldsValues?.["ENTRY_TYPE"]?.value,
                  AMOUNT: field.value,
                });
                return {
                  COMM_AMT: { value: postData?.[0]?.CHRG_AMT },
                  SERVICE_CHARGE: { value: postData?.[0]?.GST_AMT },
                  ENABLE_DISABLE: { value: postData?.[0]?.ENABLE_DISABLE },
                };
              }
            }
          }
        } else if (!field?.value) {
          return {
            SERVICE_CHARGE: { value: "" },
            COMM_AMT: { value: "" },
            ENABLE_DISABLE: { value: "" },
          };
        }
      },

      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COMM_AMT",
      label: "Comm.",
      placeholder: "",
      type: "text",

      GridProps: {
        xs: 12,
        md: 1.4,
        sm: 1.4,
        lg: 1.4,
        xl: 1.4,
      },
      dependentFields: ["ENABLE_DISABLE"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.ENABLE_DISABLE?.value === "N") {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENABLE_DISABLE",
      label: "",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: {
        xs: 12,
        md: 1.4,
        sm: 1.4,
        lg: 1.4,
        xl: 1.4,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_CHARGE",
      label: "GST",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.4,
        sm: 1.4,
        lg: 1.4,
        xl: 1.4,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL",
      label: "Total Amount",
      placeholder: "",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 2 },

      dependentFields: ["AMOUNT", "SERVICE_CHARGE", "COMM_AMT"],

      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          parseInt(dependentFields?.SERVICE_CHARGE?.value) +
          parseInt(dependentFields?.AMOUNT?.value) +
          parseInt(dependentFields?.COMM_AMT?.value);
        return value ?? "--";
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_BY",
      label: "Maker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_DATE",
      label: "Maker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      __VIEW__: { render: { componentType: "datetimePicker" } },
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "CONFIRMED",
      label: "Confirm status",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 1.1, md: 1.1, lg: 1.1, xl: 1.1 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "VERIFIED_BY",
      label: "Checker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      dependentFields: ["CONFIRMED"],
      __VIEW__: { render: { componentType: "textField" } },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 1.3, md: 1.2, lg: 1.2, xl: 1.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "VERIFIED_DATE",
      label: "Checker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      __VIEW__: { render: { componentType: "datetimePicker" } },
      fullWidth: true,
      isReadOnly: true,
      dependentFields: ["CONFIRMED"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
  ],
};

export const SlipJoinDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Joint Detail",
    rowIdColumn: "index",
    // rowIdColumn: "J_TYPE",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: false,
    disableGlobalFilter: true,
    hideFooter: false,
    hideHeader: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "28vh",
      max: "28vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_CD",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "rigth",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "JOINT_DISC",
      columnName: "Joint Type",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "REF_PERSON_NAME",
      columnName: "Person Name",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 300,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      accessor: "DESIGNATION_NM",
      columnName: "Designation",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 300,
    },

    {
      accessor: "MEM_DISP_ACCT_TYPE",
      columnName: "Mem.Type - A/C No.",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
    {
      accessor: "REF_ACCT",
      columnName: "Reference Account",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
    {
      accessor: "phone1",
      columnName: "Contact No.",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "Customer ID",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
export const IFSCBankDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "IFSC Bank Detail",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: false,
    disableGlobalFilter: true,
    hideFooter: false,
    hideHeader: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "40vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_CD",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "rigth",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "TO_ACCT_TYPE",
      columnName: "A/C Type",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "TO_ACCT_NO",
      columnName: "A/C Number",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 300,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      accessor: "TO_ACCT_NM",
      columnName: "A/C Name",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 300,
    },

    {
      accessor: "TO_ADD1",
      columnName: "Address",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 150,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "TO_CONTACT_NO",
      columnName: "Mobile Number",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
    {
      accessor: "TO_EMAIL_ID",
      columnName: "Email Id",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 150,
      minWidth: 160,
      maxWidth: 200,
    },
    {
      accessor: "REMARKS",
      columnName: "Reamrks",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 180,
      minWidth: 200,
      maxWidth: 220,
    },
  ],
};

export const rtgsAccountDetailFormMetaData: any = {
  form: {
    refID: 1667,
    name: "beneficiaryDtlFormMetaData",
    label: "Beneficiary Detail",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",

      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "spacer",
      },
      GridProps: { xs: 0, md: 8, sm: 8, lg: 8, xl: 8 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SLIP_AMOUNT",
      label: "Total Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },

      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FINALAMOUNT",
      label: "Total Cheque Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      validationRun: "onBlur",
      defaultValue: "0",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },

      dependentFields: ["beneficiaryAcDetails"],

      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState,
        auth,
        dependentFieldState
      ) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["beneficiaryAcDetails"])
            ? dependentFieldState?.["beneficiaryAcDetails"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.AMOUNT?.value), 0);

        if (
          Number(currentFieldState.value) ===
          Number(accumulatedTakeoverLoanAmount)
        ) {
          return {};
        }
        if (accumulatedTakeoverLoanAmount) {
          return {
            FINALAMOUNT: {
              value: accumulatedTakeoverLoanAmount ?? 0,
            },
          };
        } else {
          return {
            FINALAMOUNT: {
              value: "",
            },
          };
        }
      },

      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_AMOUNT",
      label: "Total Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      validationRun: "onBlur",
      dependentFields: ["SLIP_AMOUNT", "FINALAMOUNT"],
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.SLIP_AMOUNT?.value) -
          Number(dependentFields?.FINALAMOUNT?.value);
        console.log("value", value);
        return value ?? "0";
      },
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "ADDNEWROW",
      label: "Add Row",
      endsIcon: "AddCircleOutlineRounded",
      rotateIcon: "scale(2)",
      placeholder: "",
      type: "text",
      tabIndex: "-1",
      iconStyle: {
        fontSize: "25px !important",
      },
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      isRemoveButton: true,
      displayCountName: "Beneficiary A/C Detail",
      fixedRows: true,
      isScreenStyle: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "Are you Sure you want to delete this row?",
      name: "beneficiaryAcDetails",
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "autocomplete",
          },
          name: "TO_ACCT_NO",
          label: "A/C No",
          defaultValue: "",
          // isFieldFocused: true,
          // defaultfocus: true,

          GridProps: { xs: 12, sm: 2.8, md: 2.8, lg: 2.8, xl: 2.8 },
          options: async (dependentValue, formState, _, authState) => {
            return API.getRtgsBenfDtlList({
              COMP_CD: authState?.companyID,
              BRANCH_CD:
                formState?.rtgsAcData?.BRANCH_CD ??
                authState?.user?.branchCode ??
                "",
              ACCT_TYPE: formState?.rtgsAcData?.ACCT_TYPE ?? "",
              ACCT_CD: formState?.rtgsAcData?.ACCT_CD ?? "",
              FLAG:
                formState?.rtgsAcData?.PARA_BNFCRY !== null
                  ? "N"
                  : formState?.rtgsAcData?.PARA_BNFCRY,
            });
          },
          _optionsKey: "getRtgsBenfDtlList",
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (
              field?.value &&
              field.optionData &&
              field.optionData.length > 0
            ) {
              let validateIFSC = await getIfscBenDetail({
                IFSC_CODE: field.optionData[0].TO_IFSCCODE,
                ENTRY_TYPE: formState?.rtgsAcData?.ENTRY_TYPE,
              });

              if (validateIFSC?.[0]?.O_STATUS === "999") {
                let buttonName = await formState.MessageBox({
                  messageTitle: "Validation Failed",
                  message: validateIFSC?.[0]?.O_MESSAGE,
                  buttonNames: ["Ok"],
                });
                if (buttonName === "Ok") {
                  return {
                    TO_ACCT_NO: {
                      value: "",
                      isFieldFocused: true,
                    },
                    TO_ACCT_NM: { value: "" },
                    TO_ACCT_TYPE: {
                      value: "",
                    },
                    CONTACT_NO: {
                      value: "",
                    },
                    TO_EMAIL_ID: { value: "" },
                    TO_ADD1: { value: "" },
                    REMARKS: { value: "" },
                    TO_IFSCCODE: { value: "" },
                    BANK_NM: { value: "" },
                    BRANCH_NM: { value: "" },
                    CONTACT_DTL: { value: "" },
                    CENTER_NM: { value: "" },
                    ADDR: { value: "" },
                    DISTRICT_NM: { value: "" },
                    STATE_NM: { value: "" },
                  };
                }
              } else if (validateIFSC?.[0]?.O_STATUS === "0") {
                let postData = await getIfscBankDetail({
                  AS_VALUE: field?.optionData[0].TO_IFSCCODE ?? "",
                  FLAG: "I",
                });

                return {
                  TO_ACCT_NM: { value: field.optionData[0].TO_ACCT_NM ?? "" },
                  TO_ACCT_TYPE: {
                    value: field.optionData[0].TO_ACCT_TYPE ?? "",
                  },
                  CONTACT_NO: {
                    value: field.optionData[0].TO_CONTACT_NO ?? "",
                  },
                  TO_EMAIL_ID: { value: field.optionData[0].TO_EMAIL_ID ?? "" },
                  TO_ADD1: { value: field.optionData[0].TO_ADD1 ?? "" },
                  REMARKS: {
                    value: field.optionData[0].REMARKS ?? "",
                    isFieldFocused: true,
                  },
                  TO_IFSCCODE: { value: postData?.[0].IFSC_CODE ?? "" },
                  BANK_NM: { value: postData?.[0].BANK_NM ?? "" },
                  BRANCH_NM: { value: postData?.[0].BRANCH_NM ?? "" },
                  CONTACT_DTL: { value: postData?.[0].CONTACT_DTL ?? "" },
                  CENTER_NM: { value: postData?.[0].CENTRE_NM ?? "" },
                  ADDR: { value: postData?.[0].ADD1 ?? "" },
                  DISTRICT_NM: { value: postData?.[0].DISTRICT_NM ?? "" },
                  STATE_NM: { value: postData?.[0].STATE_NM ?? "" },
                };
              }
            } else if (!field?.value) {
              return {
                TO_ACCT_NM: { value: "" },
                TO_ACCT_TYPE: { value: "" },
                CONTACT_NO: { value: "" },
                TO_EMAIL_ID: { value: "" },
                TO_ADD1: { value: "" },
                REMARKS: { value: "" },
                TO_IFSCCODE: { value: "" },
                BANK_NM: { value: "" },
                BRANCH_NM: { value: "" },
                CONTACT_DTL: { value: "" },
                CENTER_NM: { value: "" },
                ADDR: { value: "" },
                DISTRICT_NM: { value: "" },
                STATE_NM: { value: "" },
              };
            }
          },
          runPostValidationHookAlways: true,
          disableCaching: true,
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "BENEFICIARY",
          label: "...",
          // endsIcon: "AddCircleOutlineRounded",
          // rotateIcon: "scale(2)",
          placeholder: "",
          type: "text",
          tabIndex: "-1",
          iconStyle: {
            fontSize: "25px !important",
          },
          shouldExclude(fieldData, dependentFields, formState) {
            if (formState?.isIfscCdData?.[0] === "Y") {
              return false;
            } else {
              return true;
            }
          },
          __VIEW__: { render: { componentType: "hidden" } },
          GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_NM",
          label: "Name",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          // maxLength: 20,

          GridProps: { xs: 12, sm: 2.8, md: 2.8, lg: 2.8, xl: 2.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_TYPE",
          label: "Account Type",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          // maxLength: 20,

          GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "CONTACT_NO",
          label: "Mobile No.",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
        },
        // {
        //   render: {
        //     componentType: "textField",
        //   },
        //   name: "BRANCH",
        //   label: "Description",
        //   // placeholder: "EnterAcNo",
        //   type: "text",
        //   fullWidth: true,
        //   required: true,
        //   isReadOnly: true,
        //   // maxLength: 20,
        //   // schemaValidation: {
        //   //   type: "string",
        //   //   rules: [{ name: "required", params: ["Description is required."] }],
        //   // },
        //   GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 1.5 },
        // },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_EMAIL_ID",
          label: "Email ID",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ADD1",
          label: "Address",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "REMARKS",
          label: "Remarks",
          type: "text",
          fullWidth: true,

          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMITTANCE_INFO",
          label: "Remittance Info.",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 3.2, md: 3.2, lg: 3.2, xl: 3.2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "",
          type: "text",
          FormatProps: {
            allowNegative: false,
          },
          validationRun: "all",
          postValidationSetCrossFieldValues: async (...arr) => {
            if (arr[0].value) {
              return {
                FINALAMOUNT: { value: arr[0].value ?? "0" },
              };
            } else {
              return {
                FINALAMOUNT: { value: "" },
              };
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },

        {
          render: {
            componentType: "Divider",
          },
          dividerText: "IFSC Bank Detail",
          name: "Address",
          label: "Address",
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_IFSCCODE",
          label: "IFSC",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            formState.setDataOnFieldChange("IFSC_CD", field?.value);
          },
          GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "IFSC",
          label: "...",
          // endsIcon: "AddCircleOutlineRounded",
          // rotateIcon: "scale(2)",
          placeholder: "",
          type: "text",
          tabIndex: "-1",
          iconStyle: {
            fontSize: "25px !important",
          },
          __VIEW__: { render: { componentType: "hidden" } },
          GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "Bank",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_NM",
          label: "Branch",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CONTACT_DTL",
          label: "Contact",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CENTER_NM",
          label: "Center",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADDR",
          label: "Address",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4.3, md: 4.3, lg: 4.3, xl: 4.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DISTRICT_NM",
          label: "District",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "STATE_NM",
          label: "State",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
      ],
    },
  ],
};

export const AddNewBenfiDetailGridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "List Of Beneficiary A/c of Ordering ",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: false,
    disableGlobalFilter: true,
    hideFooter: false,
    hideHeader: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "40vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_CD",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "rigth",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },

    {
      accessor: "TO_IFSCCODE",
      columnName: "IFSC Code",
      sequence: 2,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "TO_ACCT_TYPE",
      columnName: "A/C Type",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "TO_ACCT_NO",
      columnName: "A/C Number",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 300,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      accessor: "TO_ACCT_NM",
      columnName: "A/C Name",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 300,
    },

    {
      accessor: "TO_ADD1",
      columnName: "Address",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 150,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "TO_CONTACT_NO",
      columnName: "Mobile Number",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
    {
      accessor: "TO_EMAIL_ID",
      columnName: "Email Id",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 150,
      minWidth: 160,
      maxWidth: 200,
    },
    {
      accessor: "ACTIVE_FLAG",
      columnName: "Active",
      sequence: 9,
      alignment: "center",
      componentType: "editableCheckbox",
      width: 150,
      minWidth: 160,
      maxWidth: 200,
    },
    {
      accessor: "REMARKS",
      columnName: "Reamrks",
      sequence: 10,
      alignment: "center",
      componentType: "default",
      width: 180,
      minWidth: 200,
      maxWidth: 220,
    },
    {
      accessor: "TO_LEI_NO",
      columnName: "LEI No.",
      sequence: 11,
      alignment: "center",
      componentType: "default",
      width: 180,
      minWidth: 200,
      maxWidth: 220,
    },
  ],
};

export const AddNewBenfiDetailFormMetadata = {
  form: {
    name: "ClearingBankMasterForm",
    label: "Clearing Bank Master",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
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
        componentType: "Divider",
      },
      dividerText: "IFSC Bank Detail",
      name: "Address",
      label: "Address",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
      label: "Bank",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADDR",
      label: "Address",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4.6, md: 4.6, lg: 4.6, xl: 4.6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_NM",
      label: "Branch",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.9, md: 2.9, lg: 2.9, xl: 2.9 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE_NM",
      label: "State",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DISTRICT_NM",
      label: "District",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CENTER_NM",
      label: "Center",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MICR_CD",
      label: "MICR Code",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT_DTL",
      label: "Contact",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
  ],
};
export const RetrieveFormConfigMetaData = {
  form: {
    name: "RetrieveFormConfigMetaData",
    label: "Retrieve CTS O/W Clearing Data",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    // allowColumnHiding: true,
    render: {
      ordering: "auto",
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
        componentType: "datePicker",
      },
      name: "FROM_TRAN_DT",
      label: "From Date",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["From Date is required."] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Must be a valid date";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TO_TRAN_DT",
      label: "To Date",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["To Date is required."] }],
      },
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Must be a valid date";
        }
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.FROM_TRAN_DT?.value)
        ) {
          return "To Date should be greater than or equal to From Date.";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["FROM_TRAN_DT"],
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      disableCaching: true,
      requestProps: "ZONE_TRAN_TYPE",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "SLIP_NO",
      label: "Slip No.",
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.5 },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",

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
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.5 },
      // maxLength: 50,
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "BANK_CD",
      label: "Bank Code",

      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CHEQUE_AMOUNT",
      label: "Cheque Amount",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.5 },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "RETRIEVE",
      label: "Retrieve",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1, xl: 1 },
    },
  ],
};

export const RetrieveGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Retrieve Grid",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "48vh",
      max: "48vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    // {
    //   accessor: "SR_NO",
    //   columnName: "Sr.No.",
    //   sequence: 1,
    //   alignment: "rigth",
    //   componentType: "default",
    //   width: 70,
    //   minWidth: 60,
    //   maxWidth: 120,
    //   isAutoSequence: true,
    // },
    {
      accessor: "SLIP_CD",
      columnName: "Slip No.",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_CNT",
      columnName: "Cheque Count",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_LIST",
      columnName: "Cheque No. List",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_AMT_LIST",
      columnName: "Cheque Amount List",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "TRAN_DT",
      columnName: "CLG Date",
      sequence: 6,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },

    {
      accessor: "CONFIRMED",
      columnName: "Confirm Status",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "THROUGH_CHANNEL",
      columnName: "Entry From",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 10,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "Verified By",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "Verified Date",
      sequence: 12,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
  ],
};
