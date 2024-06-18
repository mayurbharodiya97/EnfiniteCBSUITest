import { GeneralAPI } from "registry/fns/functions";
import {
  getPMISCData,
  getAgentMstConfigDDW,
  getAgentMstConfigPigmyDDW,
} from "../api";
import { utilFunction } from "components/utils";

export const AgentMasterFormMetaData = {
  form: {
    name: "agentMaster",
    label: "Agent Master",
    validationRun: "onBlur",
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
      numberFormat: {
        fullWidth: true,
      },
      autocomplete: {
        fullWidth: true,
      },
      rateOfInt: {
        fullWidth: true,
      },
    },
  },

  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "AGENT_CD",
      label: "Code",
      placeholder: "Enter Code",
      type: "text",
      maxLength: 4,
      isFieldFocused: true,
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required."] }],
      },
      validate: (columnValue, ...rest) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue?.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }

        // Duplication validation
        const gridData = rest[1]?.gridData;
        const accessor: any = columnValue.fieldKey.split("/").pop();
        const fieldValue = columnValue.value?.trim().toLowerCase();
        const rowColumnValue = rest[1]?.rows?.[accessor]?.trim().toLowerCase();
        if (fieldValue === rowColumnValue) {
          return "";
        }
        if (gridData) {
          for (let i = 0; i < gridData.length; i++) {
            const ele = gridData[i];
            const trimmedColumnValue = ele?.[accessor]?.trim().toLowerCase();

            if (trimmedColumnValue === fieldValue) {
              return `${fieldValue} is already entered at Sr. No: ${i + 1}`;
            }
          }
        }
        return "";
      },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "AGENT_NM",
      label: "Name",
      placeholder: "Enter Name",
      maxLength: 50,
      type: "text",
      required: true,
      autoComplete: "off",
      txtTransform: "uppercase",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Category Name is required."] }],
      },
      validate: (columnValue, ...rest) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue?.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },

    {
      render: { componentType: "autocomplete" },
      name: "GROUP_CD",
      label: "Group",
      placeholder: "Select Group",
      options: () => getPMISCData("AGENT_GROUP"),
      _optionsKey: "getPMISCData",
      type: "text",
      __VIEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Agent Account",
      name: "AgentAccount",
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "AGENT_BRANCH_CD",
        __VIEW__: { isReadOnly: true },
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              ACCT_NM: { value: "" },
              AGENT_TYPE_CD: { value: "" },
              AGENT_ACCT_CD: { value: "" },
            };
          }
        },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        name: "AGENT_TYPE_CD",
        __VIEW__: { isReadOnly: true },
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              AGENT_ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
            };
          }
        },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountCodeMetadata: {
        name: "AGENT_ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: ["AGENT_TYPE_CD", "AGENT_BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.AGENT_BRANCH_CD?.value &&
            dependentFieldValues?.AGENT_TYPE_CD?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.AGENT_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.AGENT_TYPE_CD?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.AGENT_TYPE_CD?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);
            if (postData?.RESTRICTION) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData?.RESTRICTION,
              });
              return {
                AGENT_ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                SECURITY_BRANCH: {
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                ACCT_NM: { value: "" },
              };
            } else if (postData?.MESSAGE1) {
              formState.MessageBox({
                messageTitle: "Risk Category Alert",
                message: postData?.MESSAGE1,
                buttonNames: ["Ok"],
              });
              return {
                AGENT_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            } else {
              return {
                AGENT_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            }
          } else if (!currentField?.value) {
            return {
              ACCT_NM: { value: "" },
            };
          }
          return {};
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 2, xl: 2 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
      placeholder: "Enter Account Name",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Security Account",
      name: "SecurityAccount",
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "SECURITY_BRANCH",
        required: false,
        schemaValidation: {},
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              SECURITY_TYPE_CD: { value: "" },
              SECURITY_ACCT_CD: { value: "" },
              SECURITY_ACCT_NM: { value: "" },
            };
          }
        },
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
      },
      accountTypeMetadata: {
        name: "SECURITY_TYPE_CD",
        required: false,
        schemaValidation: {},
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              SECURITY_ACCT_CD: { value: "" },
              SECURITY_ACCT_NM: { value: "" },
            };
          }
        },
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
      },
      accountCodeMetadata: {
        name: "SECURITY_ACCT_CD",
        autoComplete: "off",
        fullWidth: true,
        required: false,
        schemaValidation: {},
        dependentFields: ["SECURITY_TYPE_CD", "SECURITY_BRANCH"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.SECURITY_BRANCH?.value &&
            dependentFieldValues?.SECURITY_TYPE_CD?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.SECURITY_BRANCH?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.SECURITY_TYPE_CD?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.SECURITY_TYPE_CD?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            if (postData?.RESTRICTION) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData?.RESTRICTION,
              });
              return {
                SECURITY_ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                SECURITY_AMT: {
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                SECURITY_ACCT_NM: { value: "" },
              };
            } else if (postData?.MESSAGE1) {
              formState.MessageBox({
                messageTitle: "Risk Category Alert",
                message: postData?.MESSAGE1,
                buttonNames: ["Ok"],
              });
              return {
                SECURITY_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                SECURITY_ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            } else {
              return {
                SECURITY_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                SECURITY_ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            }
          } else if (!currentField?.value) {
            return {
              SECURITY_ACCT_NM: { value: "" },
            };
          }
          return {};
        },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SECURITY_ACCT_NM",
      label: "Account Name",
      placeholder: "Enter Account Name",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 7, md: 4, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SECURITY_AMT",
      label: "Security Amount",
      placeholder: "Enter Security Account Amount",
      defaultValue: "0.00",
      autoComplete: "off",
      maxLength: 14,
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (Number(currentField?.value) <= 0) {
          return {
            SECURITY_AMT: {
              value: "0",
              ignoreUpdate: true,
            },
          };
        }
        return {};
      },
      GridProps: {
        xs: 12,
        sm: 5,
        md: 2.5,
        lg: 1.5,
        xl: 1.5,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "SECURITY_PER",
      label: "Security %",
      defaultValue: "0.00",
      autoComplete: "off",
      maxLength: 14,
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (Number(currentField?.value) <= 0) {
          return {
            SECURITY_PER: {
              value: "0.00",
              ignoreUpdate: true,
            },
          };
        }
        return {};
      },
      GridProps: {
        xs: 12,
        sm: 5,
        md: 2.5,
        lg: 1.5,
        xl: 1.5,
      },
    },

    {
      render: { componentType: "select" },
      name: "SECURITY_FLAG",
      label: "Security Calculation On",
      options: [
        { label: "On Commission Amount", value: "N" },
        { label: "On Collection Amount", value: "Y" },
      ],
      z: "N",
      GridProps: { xs: 12, sm: 7, md: 3, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Other Account",
      name: "OtherAccount",
    },

    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "OTH_BRANCH_CD",
        required: false,
        schemaValidation: {},
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              OTH_ACCT_TYPE: { value: "" },
              OTH_ACCT_CD: { value: "" },
              OTHER_ACCT_NM: { value: "" },
            };
          }
        },
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        name: "OTH_ACCT_TYPE",
        required: false,
        schemaValidation: {},
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              OTH_ACCT_CD: { value: "" },
              OTHER_ACCT_NM: { value: "" },
            };
          }
        },
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountCodeMetadata: {
        name: "OTH_ACCT_CD",
        autoComplete: "off",
        dependentFields: ["OTH_ACCT_TYPE", "OTH_BRANCH_CD"],
        required: false,
        schemaValidation: {},
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.OTH_BRANCH_CD?.value &&
            dependentFieldValues?.OTH_ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.OTH_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.OTH_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.OTH_ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            if (postData?.RESTRICTION) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData?.RESTRICTION,
              });
              return {
                OTH_ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                PTAX_BRANCH_CD: {
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                OTHER_ACCT_NM: { value: "" },
              };
            } else if (postData?.MESSAGE1) {
              formState.MessageBox({
                messageTitle: "Risk Category Alert",
                message: postData?.MESSAGE1,
                buttonNames: ["Ok"],
              });
              return {
                OTH_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                OTHER_ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            } else {
              return {
                OTH_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                OTHER_ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            }
          } else if (!currentField?.value) {
            return {
              OTHER_ACCT_NM: { value: "" },
            };
          }
          return {};
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 2, xl: 2 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_ACCT_NM",
      label: "Account Name",
      placeholder: "Enter Account Name",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Professional Tax Account",
      name: "ProfessionalTaxAccount",
    },

    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "PTAX_BRANCH_CD",
        required: false,
        schemaValidation: {},
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              PTAX_ACCT_TYPE: { value: "" },
              PTAX_ACCT_CD: { value: "" },
              PTAX_ACCT_NM: { value: "" },
            };
          }
        },
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
      },
      accountTypeMetadata: {
        name: "PTAX_ACCT_TYPE",
        required: false,
        schemaValidation: {},
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (!currentField?.value) {
            return {
              PTAX_ACCT_CD: { value: "" },
              PTAX_ACCT_NM: { value: "" },
            };
          }
        },
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
      },
      accountCodeMetadata: {
        name: "PTAX_ACCT_CD",
        autoComplete: "off",
        required: false,
        schemaValidation: {},
        dependentFields: ["PTAX_ACCT_TYPE", "PTAX_BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.PTAX_BRANCH_CD?.value &&
            dependentFieldValues?.PTAX_ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.PTAX_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.PTAX_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.PTAX_ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            if (postData?.RESTRICTION) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData?.RESTRICTION,
              });
              return {
                PTAX_ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                PTAX_DEF_TRAN_CD: {
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                PTAX_ACCT_NM: { value: "" },
              };
            } else if (postData?.MESSAGE1) {
              formState.MessageBox({
                messageTitle: "Risk Category Alert",
                message: postData?.MESSAGE1,
                buttonNames: ["Ok"],
              });
              return {
                PTAX_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                PTAX_ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            } else {
              return {
                PTAX_ACCT_CD: {
                  value: currentField.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                PTAX_ACCT_NM: {
                  value: postData?.ACCT_NM ?? "",
                },
              };
            }
          } else if (!currentField?.value) {
            return {
              PTAX_ACCT_NM: { value: "" },
            };
          }
          return {};
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PTAX_ACCT_NM",
      label: "Account Name",
      placeholder: "Enter Account Name",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 },
    },
    {
      render: { componentType: "autocomplete" },
      name: "PTAX_DEF_TRAN_CD",
      label: "Configuration",
      placeholder: "Enter Configuration",
      options: getAgentMstConfigDDW,
      _optionsKey: "getAgentMstConfigDDW",
      type: "text",
      __VIEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Hand Held Machine",
      name: "HandHeldMachine",
    },
    {
      render: { componentType: "autocomplete" },
      name: "PIGMY_CONF_TRAN_CD",
      label: "Configuration",
      placeholder: "Select Configuration",
      options: getAgentMstConfigPigmyDDW,
      _optionsKey: "getAgentMstConfigPigmyDDW",
      type: "text",
      __VIEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "TDS_RATE",
      label: "TDS Rate",
      autoComplete: "off",
      maxLength: 5,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 3,
        xl: 3,
      },
      FormatProps: {
        allowLeadingZeros: false,
        isAllowed: (values) => {
          //@ts-ignore
          if (values.floatValue > 99.99) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
  ],
};
