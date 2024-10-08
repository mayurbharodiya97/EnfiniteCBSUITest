import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";

let bankflag = false;
let neftflag = false;

export const FdInterestPaymentFormMetaData = {
  form: {
    name: "FdInterestPaymentFormUpdate",
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
          lg: 12,
          xl: 12,
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
      numberFormat: {
        fullWidth: true,
      },
      checkbox: {
        fullWidth: true,
      },
    },
  },
  fields: [
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
      name: "TO_ACCT_TYPE_DIS",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FD_NO",
    },

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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
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
        if (formState?.SCREEN_REF === "MST/894") {
          return false;
        } else {
          return true;
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PAYMENT_MODE",
      label: "PaymentMode",
      defaultOptionLabel: "Select Option",
      options: API.getPMISCData,
      _optionsKey: "getPMISCData",
      required: true,
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
        "ADD1",
        "HOLDER_ADD1",
        "CONTACT_INFO",
        "HOLDER_CONTACT_INFO",
        "TO_IFSCCODE",
        "BANK",
        "TO_ACCT_NO",
        "TO_ACCT_TYPE",
        "TO_ACCT_TYPE_DIS",
        "TO_ACCT_NM",
        "TO_CONTACT_NO",
        "TO_ADD1",
      ],
      validationRun: "onChange",
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (!Boolean(formState?.rowData?.PAYMENT_MODE)) {
          neftflag = true;
          bankflag = true;
        }
        if (currentField?.value === "NEFT") {
          if (
            (formState?.fdDetails?.PAYMENT_MODE === "BANKACCT" ||
              formState?.rowsData?.[0]?.data?.PAYMENT_MODE === "BANKACCT") &&
            (dependentFieldValues?.CR_BRANCH_CD?.value ||
              dependentFieldValues?.CR_ACCT_TYPE?.value ||
              dependentFieldValues?.CR_ACCT_CD?.value)
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
                  value: dependentFieldValues?.HOLDER_ACCT_NM?.value
                    ? dependentFieldValues?.HOLDER_ACCT_NM?.value
                    : dependentFieldValues?.ACCT_NM?.value,
                },
                ADD1: {
                  value: dependentFieldValues?.HOLDER_ADD1?.value
                    ? dependentFieldValues?.HOLDER_ADD1?.value
                    : dependentFieldValues?.ADD1?.value,
                },
                CONTACT_INFO: {
                  value: dependentFieldValues?.HOLDER_CONTACT_INFO?.value
                    ? dependentFieldValues?.HOLDER_CONTACT_INFO?.value
                    : dependentFieldValues?.CONTACT_INFO?.value,
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
            (formState?.fdDetails?.PAYMENT_MODE === "NEFT" ||
              formState?.rowsData?.[0]?.data?.PAYMENT_MODE === "NEFT") &&
            (Boolean(dependentFieldValues?.ACCT_NM?.value) ||
              Boolean(dependentFieldValues?.ADD1?.value) ||
              Boolean(dependentFieldValues?.CONTACT_INFO?.value) ||
              Boolean(dependentFieldValues?.TO_IFSCCODE?.value) ||
              Boolean(dependentFieldValues?.BANK?.value) ||
              Boolean(dependentFieldValues?.TO_ACCT_NO?.value) ||
              Boolean(dependentFieldValues?.TO_ACCT_TYPE?.value) ||
              Boolean(dependentFieldValues?.TO_ACCT_NM?.value) ||
              Boolean(dependentFieldValues?.TO_CONTACT_NO?.value) ||
              Boolean(dependentFieldValues?.TO_ADD1?.value))
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
                TO_ACCT_TYPE_DIS: { value: "" },
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOT_AMT",
      label: "Inst. Amount",
      type: "text",
      isReadOnly: true,
      ignoreInSubmit: true,
      textInputFromRight: true,
      fullWidth: true,
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
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
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          formState?.SCREEN_REF === "MST/894" ||
          formState?.SCREEN_REF === "MST/940"
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "PAYMENT_MODE_SPACER",
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (formState?.SCREEN_REF === "TRN/584") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 0, sm: 6, md: 9, lg: 9, xl: 9 },
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
        dependentFields: ["PAYMENT_MODE"],
        validationRun: "onChange",
        runPostValidationHookAlways: true,
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
        validationRun: "onChange",
        runPostValidationHookAlways: true,
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
        runPostValidationHookAlways: true,
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
              currentField?.value,
              dependentFieldValues?.CR_ACCT_TYPE?.optionData
            ),
            SCREEN_REF: formState?.SCREEN_REF,
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
            formState.handleButtonDisable(false);
            return {
              CR_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.CR_ACCT_TYPE?.optionData
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
      placeholder: "EnterOrderingAcName",
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
      placeholder: "EnterOrderingAcAddress",
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
      placeholder: "EnterOrderingAcContact",
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
      placeholder: "EnterIFSCCode",
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
          let validateIFSC = await API.getIfscBenDetail({
            IFSC_CODE: currentField?.value ?? "",
            ENTRY_TYPE: "NEFT",
          });

          if (validateIFSC?.[0]?.O_STATUS === "999") {
            let buttonName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: validateIFSC?.[0]?.O_MESSAGE,
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
            let postData = await API.getIfscBankDetail({
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
      placeholder: "EnterBeneficiaryAccountNumber",
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
          return API.getBankDtlList({
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
      placeholder: "EnterBeneficiaryAccountType",
      type: "text",
      options: API.getAccountTypeList,
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
      placeholder: "EnterBeneficiaryAccountName",
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
      placeholder: "EnterBeneficiaryContact",
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
      placeholder: "EnterBeneficiaryAddress",
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
