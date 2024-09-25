import { GeneralAPI } from "registry/fns/functions";
import {
  getAccountTypeList,
  getBankDtlList,
  getIfscBankDetail,
  getIfscBenDetail,
  getPMISCData,
} from "../FDInterestPayment/viewDetails/api";
import { utilFunction } from "components/utils";

let bankflag = false;
let neftflag = false;

export const recAccountFindmetaData = {
  form: {
    name: "accountNumber",
    label: "EnterParameters",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
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
      _accountNumber: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "BRANCH_CD",
        isFieldFocused: true,
        GridProps: { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        GridProps: { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
        isFieldFocused: true,
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        autoComplete: "off",
        dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          formState?.handleButtonDisable(true);
          const reqParameters = {
            BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value ?? "",
              dependentFieldValues?.ACCT_TYPE?.optionData
            ),
            SCREEN_REF: "MST/894",
          };

          if (
            Boolean(dependentFieldValues?.BRANCH_CD?.value) &&
            Boolean(dependentFieldValues?.ACCT_TYPE?.value)
          ) {
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);
            let btn99, returnVal;
            for (let i = 0; i < postData?.MSG.length; i++) {
              if (postData?.MSG[i]?.O_STATUS === "999") {
                const btnName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  icon: "ERROR",
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
                  icon: "WARNING",
                });
              } else if (postData?.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            formState.setDataOnFieldChange("fdPaymentInstrudtl", {
              COMP_CD: authState?.companyID ?? "",
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value ?? "",
                dependentFieldValues?.ACCT_TYPE?.optionData ?? ""
              ),
              ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
              BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
            });
            formState?.handleButtonDisable(false);

            return {
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value ?? "",
                        dependentFieldValues?.TRN_ACCT_TYPE?.optionData ?? ""
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },

              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
                ignoreUpdate: true,
                isFieldFocused: false,
              },
              TRAN_BAL: {
                value: returnVal?.TRAN_BAL ?? "",
                ignoreUpdate: true,
                isFieldFocused: false,
              },
            };
          }
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      placeholder: "AccountName",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Balance",
      placeholder: "Balance",
      type: "text",
      isReadOnly: true,
      textInputFromRight: true,
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
    },
  ],
};
export const RecInterestPaymentMetaData = {
  form: {
    name: "RecInterestPayment",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
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
      amountField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
    },
  },

  fields: [
    // Account details
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "branchCode",
      type: "text",
      ignoreInSubmit: true,
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      label: "accountType",
      type: "text",
      ignoreInSubmit: true,
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "AccountNum",
      type: "text",
      ignoreInSubmit: true,
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NAME",
      label: "AccountName",
      type: "text",
      ignoreInSubmit: true,
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Balance",
      type: "text",
      isReadOnly: true,
      ignoreInSubmit: true,
      fullWidth: true,
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (!Boolean(formState?.accountDetail)) {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    // FD/RD etail
    {
      render: {
        componentType: "divider",
      },
      label: "FDRDDetail",
      name: "FDRDDtl",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PAYMENT_MODE",
      label: "PaymentMode",
      defaultOptionLabel: "Select Option",
      options: getPMISCData,
      _optionsKey: "getPMISCData",
      required: true,
      validationRun: "onChange",
      dependentFields: [
        "CR_BRANCH_CD_1",
        "CR_BRANCH_CD",
        "CR_ACCT_TYPE_1",
        "CR_ACCT_TYPE",
        "CR_ACCT_CD_1",
        "CR_ACCT_CD",
        "CR_ACCT_NM_1",
        "CR_ACCT_NM",
        "HOLDER_ACCT_NM",
        "ACCT_NM",
        "HOLDER_ADD1",
        "ADD1",
        "HOLDER_CONTACT_INFO",
        "CONTACT_INFO",
        "TO_IFSCCODE",
        "BANK",
        "TO_ACCT_NO",
        "TO_ACCT_TYPE",
        "TO_ACCT_NM",
        "TO_CONTACT_NO",
        "TO_ADD1",
      ],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (!Boolean(formState?.accountDetail?.PAYMENT_MODE)) {
          neftflag = true;
          bankflag = true;
        }
        if (currentField?.value === "NEFT") {
          if (
            dependentFieldValues?.CR_BRANCH_CD?.value ||
            dependentFieldValues?.CR_ACCT_TYPE?.value ||
            dependentFieldValues?.CR_ACCT_CD?.value
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "Confirmation",
              message: "PaymentModeChangeConf",
              buttonNames: ["Yes", "No"],
            });
            if (btnName === "Yes") {
              neftflag = true;
              return {
                CR_BRANCH_CD: { value: "" },
                CR_ACCT_TYPE: { value: "" },
                CR_ACCT_CD: { value: "" },
                CR_ACCT_NM: { value: "" },
                ACCT_NM: {
                  value: dependentFieldValues?.HOLDER_ACCT_NM?.value ?? "",
                },
                ADD1: {
                  value: dependentFieldValues?.HOLDER_ADD1?.value ?? "",
                },
                CONTACT_INFO: {
                  value: dependentFieldValues?.HOLDER_CONTACT_INFO?.value ?? "",
                },
              };
            }
            if (btnName === "No") {
              neftflag = false;
              return {
                PAYMENT_MODE: { value: "BANKACCT" },
              };
            }
          } else if (
            dependentFieldValues?.ACCT_NM?.value === "" ||
            dependentFieldValues?.ADD1?.value === "" ||
            dependentFieldValues?.CONTACT_INFO?.value === ""
          ) {
            return {
              ACCT_NM: {
                value: bankflag
                  ? dependentFieldValues?.HOLDER_ACCT_NM?.value
                  : dependentFieldValues?.ACCT_NM?.value ?? "",
              },
              ADD1: {
                value: bankflag
                  ? dependentFieldValues?.HOLDER_ADD1?.value
                  : dependentFieldValues?.ADD1?.value ?? "",
              },
              CONTACT_INFO: {
                value: bankflag
                  ? dependentFieldValues?.HOLDER_CONTACT_INFO?.value
                  : dependentFieldValues?.CONTACT_INFO?.value ?? "",
              },
            };
          }
        }
        if (currentField?.value === "BANKACCT") {
          if (
            Boolean(dependentFieldValues?.ACCT_NM?.value) ||
            Boolean(dependentFieldValues?.ADD1?.value) ||
            Boolean(dependentFieldValues?.CONTACT_INFO?.value) ||
            Boolean(dependentFieldValues?.TO_IFSCCODE?.value) ||
            Boolean(dependentFieldValues?.BANK?.value) ||
            Boolean(dependentFieldValues?.TO_ACCT_NO?.value) ||
            Boolean(dependentFieldValues?.TO_ACCT_TYPE?.value) ||
            Boolean(dependentFieldValues?.TO_ACCT_NM?.value) ||
            Boolean(dependentFieldValues?.TO_CONTACT_NO?.value) ||
            Boolean(dependentFieldValues?.TO_ADD1?.value)
          ) {
            let btnName = await formState.MessageBox({
              messageTitle: "Confirmation",
              message: "PaymentModeChangeConf",
              buttonNames: ["Yes", "No"],
            });
            if (btnName === "Yes") {
              bankflag = true;
              return {
                ACCT_NM: { value: "" },
                ADD1: { value: "" },
                CONTACT_INFO: { value: "" },
                TO_IFSCCODE: { value: "" },
                BANK: { value: "" },
                TO_ACCT_NO: { value: "" },
                TO_ACCT_TYPE: { value: "" },
                TO_ACCT_NM: { value: "" },
                TO_CONTACT_NO: { value: "" },
                TO_ADD1: { value: "" },
                CR_BRANCH_CD: {
                  value: dependentFieldValues?.CR_BRANCH_CD_1?.value
                    ? dependentFieldValues?.CR_BRANCH_CD_1?.value
                    : dependentFieldValues?.CR_BRANCH_CD?.value,
                },
                CR_ACCT_TYPE: {
                  value: dependentFieldValues?.CR_ACCT_TYPE_1?.value
                    ? dependentFieldValues?.CR_ACCT_TYPE_1?.value
                    : dependentFieldValues?.CR_ACCT_TYPE?.value,
                },
                CR_ACCT_CD: {
                  value: dependentFieldValues?.CR_ACCT_CD_1?.value
                    ? dependentFieldValues?.CR_ACCT_CD_1?.value
                    : dependentFieldValues?.CR_ACCT_CD?.value,
                },
                CR_ACCT_NM: {
                  value: dependentFieldValues?.CR_ACCT_NM_1?.value
                    ? dependentFieldValues?.CR_ACCT_NM_1?.value
                    : dependentFieldValues?.CR_ACCT_NM?.value,
                },
              };
            }
            if (btnName === "No") {
              bankflag = false;
              return { PAYMENT_MODE: { value: "NEFT" } };
            }
          } else if (
            dependentFieldValues?.CR_BRANCH_CD?.value === "" ||
            dependentFieldValues?.CR_ACCT_TYPE?.value === "" ||
            dependentFieldValues?.CR_ACCT_CD?.value === "" ||
            dependentFieldValues?.CR_ACCT_NM?.value === ""
          ) {
            return {
              CR_BRANCH_CD: {
                value: neftflag
                  ? dependentFieldValues?.CR_BRANCH_CD_1?.value
                  : dependentFieldValues?.CR_BRANCH_CD?.value ?? "",
              },
              CR_ACCT_TYPE: {
                value: neftflag
                  ? dependentFieldValues?.CR_ACCT_TYPE_1?.value
                  : dependentFieldValues?.CR_ACCT_TYPE?.value ?? "",
              },
              CR_ACCT_CD: {
                value: neftflag
                  ? dependentFieldValues?.CR_ACCT_CD_1?.value
                  : dependentFieldValues?.CR_ACCT_CD?.value ?? "",
              },
              CR_ACCT_NM: {
                value: neftflag
                  ? dependentFieldValues?.CR_ACCT_NM_1?.value
                  : dependentFieldValues?.CR_ACCT_NM?.value ?? "",
              },
            };
          }
        }
      },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["PaymentModerequired"] }],
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "DepositDate",
      type: "text",
      ignoreInSubmit: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOT_AMT",
      label: "DepositAmount",
      type: "text",
      isReadOnly: true,
      ignoreInSubmit: true,
      textInputFromRight: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "MATURITY_DT",
      label: "MaturityDate",
      type: "text",
      ignoreInSubmit: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "MATURITY_AMT",
      label: "MaturityAmount",
      type: "text",
      isReadOnly: true,
      ignoreInSubmit: true,
      textInputFromRight: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MATURE_INST",
      label: "MatureInstruction",
      type: "text",
      ignoreInSubmit: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    // Hidden Fields
    {
      render: {
        componentType: "hidden",
      },
      name: "CR_COMP_CD",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CR_BRANCH_CD_1",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CR_ACCT_TYPE_1",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CR_ACCT_CD_1",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CR_ACCT_NM_1",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HOLDER_ACCT_NM",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HOLDER_ADD1",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HOLDER_CONTACT_INFO",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FD_NO",
      ignoreInSubmit: true,
    },

    {
      render: {
        componentType: "divider",
      },
      label: "FDBankDetail",
      name: "BankAccount",
      dependentFields: ["PAYMENT_MODE"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "NEFT") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "CR_BRANCH_CD",
        validationRun: onchange,
        dependentFields: ["PAYMENT_MODE"],
        isReadOnly: (fieldValue, dependentFields, formState) => {
          return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
        },
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.PAYMENT_MODE?.value === "NEFT") {
            return true;
          } else {
            return false;
          }
        },
        validate: (currentField, dependentFields) => {
          if (
            !Boolean(currentField?.value) &&
            dependentFields?.PAYMENT_MODE?.value !== "NEFT"
          ) {
            return "BranchCodeReqired";
          }
          return "";
        },
        schemaValidation: {},
        GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
      },
      accountTypeMetadata: {
        name: "CR_ACCT_TYPE",
        dependentFields: ["PAYMENT_MODE"],
        validationRun: onchange,
        isReadOnly: (fieldValue, dependentFields, formState) => {
          return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
        },
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.PAYMENT_MODE?.value === "NEFT") {
            return true;
          } else {
            return false;
          }
        },
        validate: (currentField, dependentFields) => {
          if (
            !Boolean(currentField?.value) &&
            dependentFields?.PAYMENT_MODE?.value !== "NEFT"
          ) {
            return "AccountTypeReqired";
          }
          return "";
        },
        schemaValidation: {},
        GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
        isFieldFocused: true,
      },
      accountCodeMetadata: {
        name: "CR_ACCT_CD",
        dependentFields: ["CR_ACCT_TYPE", "CR_BRANCH_CD", "PAYMENT_MODE"],
        isReadOnly: (fieldValue, dependentFields, formState) => {
          return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
        },
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.PAYMENT_MODE?.value === "NEFT") {
            return true;
          } else {
            return false;
          }
        },
        validate: (currentField, dependentFields) => {
          if (
            !Boolean(currentField?.value) &&
            dependentFields?.PAYMENT_MODE?.value !== "NEFT"
          ) {
            return "AccountNumberReqired";
          }
          return "";
        },
        schemaValidation: {},
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          const reqParameters = {
            BRANCH_CD: dependentFieldValues?.CR_BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldValues?.CR_ACCT_TYPE?.value ?? "",
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value ?? "",
              dependentFieldValues?.CR_ACCT_TYPE?.optionData ?? ""
            ),
            SCREEN_REF: "MST/894",
          };

          if (
            dependentFieldValues?.CR_BRANCH_CD?.value &&
            dependentFieldValues?.CR_ACCT_TYPE?.value &&
            currentField?.value &&
            dependentFieldValues?.PAYMENT_MODE?.value === "BANKACCT"
          ) {
            formState.handleButtonDisable(true);
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);
            let btn99, returnVal;
            for (let i = 0; i < postData?.MSG?.length; i++) {
              if (postData?.MSG[i]?.O_STATUS === "999") {
                const btnName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG[i]?.O_MESSAGE ?? "",
                });
                returnVal = "";
              } else if (postData?.MSG[i]?.O_STATUS === "99") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Confirmation",
                  message: postData?.MSG[i]?.O_MESSAGE ?? "",
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG[i]?.O_STATUS === "9") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Alert",
                  message: postData?.MSG[i]?.O_MESSAGE ?? "",
                });
              } else if (postData?.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            formState.handleButtonDisable(false);
            return {
              CR_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value ?? "",
                        dependentFieldValues?.CR_ACCT_TYPE?.optionData ?? ""
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },

              CR_ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
                ignoreUpdate: true,
                isFieldFocused: false,
              },
            };
          } else if (!currentField?.value) {
            return {
              CR_ACCT_NM: { value: "" },
            };
          }
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 1.5, lg: 1.5, xl: 1.5 },
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CR_ACCT_NM",
      label: "AccountName",
      placeholder: "AccountName",
      type: "text",
      isReadOnly: true,
      dependentFields: ["PAYMENT_MODE"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "NEFT") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    },
    // FD Interest/Payment Credit NEFT Details
    {
      render: {
        componentType: "divider",
      },
      label: "FDNEFTDetail",
      name: "NEFT",
      dependentFields: ["PAYMENT_MODE"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "OrderingAcName",
      placeholder: "OrderingName",
      required: true,
      maxLength: 100,
      type: "text",
      txtTransform: "uppercase",
      dependentFields: ["PAYMENT_MODE"],
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },

      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "OrderingNameRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "OrderingAcAddress",
      required: true,
      maxLength: 100,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      dependentFields: ["PAYMENT_MODE"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "OrderingAddressRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT_INFO",
      label: "OrderingAcContact",
      placeholder: "",
      required: true,
      maxLength: 35,
      type: "text",
      dependentFields: ["PAYMENT_MODE"],
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "OrderingContactRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TO_IFSCCODE",
      label: "IFSCCode",
      required: true,
      maxLength: 11,
      type: "text",
      dependentFields: ["PAYMENT_MODE"],
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "IFSCCodeisRequired";
        }
        return "";
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (currentField?.value && !Boolean(currentField?.error)) {
          let validateIFSC = await getIfscBenDetail({
            IFSC_CODE: currentField?.value ?? "",
            ENTRY_TYPE: "NEFT",
          });

          if (validateIFSC?.[0]?.O_STATUS === "999") {
            let buttonName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: validateIFSC?.[0]?.O_MESSAGE ?? "",
              buttonNames: ["Ok"],
            });
            if (buttonName === "Ok") {
              return {
                BANK: { value: "" },
                TO_IFSCCODE: { value: "", isFieldFocused: true },
                TO_IFSCCODE_HIDDEN: { value: "" },
              };
            }
          } else if (validateIFSC?.[0]?.O_STATUS === "0") {
            let postData = await getIfscBankDetail({
              AS_VALUE: currentField?.value ?? "",
              FLAG: "I",
            });

            return {
              BANK: { value: postData?.[0]?.BANK_NM ?? "" },
              TO_IFSCCODE_HIDDEN: { value: postData?.[0]?.IFSC_CODE ?? "" },
            };
          }
        } else if (!currentField?.value) {
          return {
            BANK: { value: "" },
            TO_ACCT_NO: { value: "" },
            TO_IFSCCODE_HIDDEN: { value: "" },
          };
        }
      },

      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK",
      label: "Bank",
      isReadOnly: true,
      type: "text",
      required: true,
      dependentFields: ["PAYMENT_MODE"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "BankRequired";
        }
        return "";
      },

      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TO_IFSCCODE_HIDDEN",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TO_ACCT_NO",
      label: "BeneficiaryAccountNumber",
      placeholder: "",
      type: "text",
      required: true,
      disableCaching: true,
      runValidationOnDependentFieldsChange: true,
      dependentFields: ["PAYMENT_MODE", "TO_IFSCCODE_HIDDEN"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      options: (dependentValue, formState, _, authState) => {
        if (Boolean(dependentValue?.TO_IFSCCODE_HIDDEN?.value)) {
          return getBankDtlList({
            TO_IFSCCODE: dependentValue?.TO_IFSCCODE_HIDDEN?.value,
          });
        } else {
          return [];
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (currentField?.value) {
          return {
            TO_ACCT_NO: {
              value: currentField?.optionData?.[0]?.TO_ACCT_NO,
              ignoreUpdate: true,
            },
            TO_ACCT_TYPE: {
              value: currentField?.optionData?.[0]?.TO_ACCT_TYPE,
              ignoreUpdate: true,
            },
            TO_ACCT_NM: {
              value: currentField?.optionData?.[0]?.TO_ACCT_NM,
              ignoreUpdate: true,
            },
            TO_CONTACT_NO: {
              value: currentField?.optionData?.[0]?.TO_CONTACT_NO,
              ignoreUpdate: true,
            },
            TO_ADD1: {
              value: currentField?.optionData?.[0]?.TO_ADD1,
              ignoreUpdate: true,
            },
          };
        } else {
          return {
            TO_ACCT_TYPE: { value: "" },
            TO_ACCT_NM: { value: "" },
            TO_CONTACT_NO: { value: "" },
            TO_ADD1: { value: "" },
          };
        }
      },

      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "BeneficiaryAcctNumRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 2.4, lg: 2.4, xl: 2.4 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TO_ACCT_TYPE",
      label: "BeneficiaryAccountType",
      type: "text",
      options: getAccountTypeList,
      _optionsKey: "getAccountTypeList",
      required: true,
      validationRun: "onChange",
      dependentFields: ["PAYMENT_MODE", "TO_ACCT_NO"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "BeneficiaryAcctTypeRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 2.4, lg: 2.4, xl: 2.4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TO_ACCT_NM",
      label: "BeneficiaryAccountName",
      type: "text",
      maxLength: 100,
      required: true,
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validationRun: "onChange",
      dependentFields: ["PAYMENT_MODE", "TO_ACCT_NO"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "BeneficiaryAcctNameRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 2.4, lg: 2.4, xl: 2.4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TO_CONTACT_NO",
      label: "BeneficiaryContact",
      type: "text",
      maxLength: 50,
      txtTransform: "uppercase",
      required: true,
      dependentFields: ["PAYMENT_MODE"],
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validationRun: "onChange",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "BeneficiaryContactRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 2.4, lg: 2.4, xl: 2.4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TO_ADD1",
      label: "BeneficiaryAddress",
      type: "text",
      required: true,
      txtTransform: "uppercase",
      maxLength: 200,
      dependentFields: ["PAYMENT_MODE"],
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validationRun: "onChange",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        return dependentFields?.PAYMENT_MODE?.value === "" ? true : false;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PAYMENT_MODE?.value === "BANKACCT") {
          return true;
        } else {
          return false;
        }
      },
      validate: (currentField, dependentFields) => {
        if (
          !Boolean(currentField?.value) &&
          dependentFields?.PAYMENT_MODE?.value !== "BANKACCT"
        ) {
          return "BeneficiaryAddressRequired";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 2.4, lg: 2.4, xl: 2.4 },
    },
  ],
};
