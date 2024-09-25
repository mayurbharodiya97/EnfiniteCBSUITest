import { GeneralAPI } from "registry/fns/functions";
import {
  getPMISCData,
  getAgentMstConfigDDW,
  getAgentMstConfigPigmyDDW,
} from "../api";
import { utilFunction } from "@acuteinfo/common-base";
import { t } from "i18next";

export const AgentMasterFormMetaData = {
  form: {
    name: "agentMaster",
    label: "",
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
      placeholder: "EnterCode",
      type: "text",
      maxLength: 4,
      isFieldFocused: true,
      autoComplete: "off",
      required: true,
      preventSpecialChars: localStorage.getItem("specialChar") || "",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CodeisRequired"] }],
      },
      validate: (columnValue, ...rest) => {
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
              return `${t(`DuplicateValidation`, {
                fieldValue: fieldValue,
                rowNumber: i + 1,
              })}`;
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
      placeholder: "EnterName",
      maxLength: 50,
      type: "text",
      required: true,
      autoComplete: "off",
      txtTransform: "uppercase",
      preventSpecialChars: localStorage.getItem("specialChar") || "",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CategoryNameisrequired"] }],
      },

      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },

    {
      render: { componentType: "autocomplete" },
      name: "GROUP_CD",
      label: "Group",
      placeholder: "SelectGroup",
      options: getPMISCData,
      _optionsKey: "getPMISCData",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "divider",
      },
      label: "AgentAccount",
      name: "AgentAccount",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "AGENT_BRANCH_CD",
        runPostValidationHookAlways: true,
        validationRun: "onChange",
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          return {
            ACCT_NM: { value: "" },
            AGENT_TYPE_CD: { value: "" },
            AGENT_ACCT_CD: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        name: "AGENT_TYPE_CD",
        runPostValidationHookAlways: true,
        validationRun: "onChange",
        disableCaching: true,
        dependentFields: ["AGENT_BRANCH_CD"],
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.AGENT_BRANCH_CD?.value,
            DOC_CD: "MST/041",
            USER_NAME: authState?.user?.id,
          });
        },
        _optionsKey: "getAccountType",
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          return {
            AGENT_ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountCodeMetadata: {
        name: "AGENT_ACCT_CD",
        autoComplete: "off",
        dependentFields: ["AGENT_TYPE_CD", "AGENT_BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldsValues?.AGENT_BRANCH_CD?.value &&
            dependentFieldsValues?.AGENT_TYPE_CD?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldsValues?.AGENT_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldsValues?.AGENT_TYPE_CD?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldsValues?.AGENT_TYPE_CD?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            formState?.handleButtonDisable(true);
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            let btn99, returnVal;
            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData?.MSG?.length; i++) {
              if (postData?.MSG?.[i]?.O_STATUS === "999") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message: postData?.MSG?.[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData;
              } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Confirmation",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });

                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG?.[i]?.O_STATUS === "0") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              AGENT_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.AGENT_TYPE_CD?.optionData
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
              },
            };
          } else if (!currentField?.value) {
            formState?.handleButtonDisable(false);
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
      label: "AccountName",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "divider",
      },
      label: "SecurityAccount",
      name: "SecurityAccount",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "_accountNumber" },
      __NEW__: {
        branchCodeMetadata: {
          name: "SECURITY_BRANCH",
          required: false,
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              SECURITY_TYPE_CD: { value: "" },
              SECURITY_ACCT_CD: { value: "" },
              SECURITY_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
        },
      },
      __VIEW__: {
        branchCodeMetadata: {
          name: "SECURITY_BRANCH",
          required: false,
          defaultValue: "",
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              SECURITY_TYPE_CD: { value: "" },
              SECURITY_ACCT_CD: { value: "" },
              SECURITY_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
        },
      },
      __EDIT__: {
        branchCodeMetadata: {
          name: "SECURITY_BRANCH",
          required: false,
          defaultValue: "",
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              SECURITY_TYPE_CD: { value: "" },
              SECURITY_ACCT_CD: { value: "" },
              SECURITY_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
        },
      },

      accountTypeMetadata: {
        name: "SECURITY_TYPE_CD",
        required: false,
        schemaValidation: {},
        disableCaching: true,
        dependentFields: ["SECURITY_BRANCH"],
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.SECURITY_BRANCH?.value,
            DOC_CD: "MST/041",
            USER_NAME: authState?.user?.id,
          });
        },
        _optionsKey: "getAccountType",
        runPostValidationHookAlways: true,
        validationRun: "onChange",
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          return {
            SECURITY_ACCT_CD: { value: "" },
            SECURITY_ACCT_NM: { value: "" },
          };
        },
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
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldsValues?.SECURITY_BRANCH?.value &&
            dependentFieldsValues?.SECURITY_TYPE_CD?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldsValues?.SECURITY_BRANCH?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldsValues?.SECURITY_TYPE_CD?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldsValues?.SECURITY_TYPE_CD?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            formState?.handleButtonDisable(true);
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            let btn99, returnVal;
            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData?.MSG?.length; i++) {
              if (postData?.MSG?.[i]?.O_STATUS === "999") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message: postData?.MSG?.[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData;
              } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Confirmation",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });

                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG?.[i]?.O_STATUS === "0") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              SECURITY_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.SECURITY_TYPE_CD?.optionData
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              SECURITY_ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            formState?.handleButtonDisable(false);
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
      label: "AccountName",
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
      label: "SecurityAmount",
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
      label: "Security%",
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
      label: "SecurityCalculationOn",
      options: [
        { label: "On Commission Amount", value: "N" },
        { label: "On Collection Amount", value: "Y" },
      ],
      GridProps: { xs: 12, sm: 7, md: 3, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
      },
      label: "OtherAccount",
      name: "OtherAccount",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: { componentType: "_accountNumber" },
      __VIEW__: {
        branchCodeMetadata: {
          name: "OTH_BRANCH_CD",
          required: false,
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          defaultValue: "",
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              OTH_ACCT_TYPE: { value: "" },
              OTH_ACCT_CD: { value: "" },
              OTHER_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
      },
      __EDIT__: {
        branchCodeMetadata: {
          name: "OTH_BRANCH_CD",
          required: false,
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          defaultValue: "",
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              OTH_ACCT_TYPE: { value: "" },
              OTH_ACCT_CD: { value: "" },
              OTHER_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
      },
      __NEW__: {
        branchCodeMetadata: {
          name: "OTH_BRANCH_CD",
          required: false,
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              OTH_ACCT_TYPE: { value: "" },
              OTH_ACCT_CD: { value: "" },
              OTHER_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
      },
      accountTypeMetadata: {
        name: "OTH_ACCT_TYPE",
        required: false,
        schemaValidation: {},
        validationRun: "onChange",
        disableCaching: true,
        dependentFields: ["OTH_BRANCH_CD"],
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.OTH_BRANCH_CD?.value,
            DOC_CD: "MST/041",
            USER_NAME: authState?.user?.id,
          });
        },
        _optionsKey: "getAccountType",
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          return {
            OTH_ACCT_CD: { value: "" },
            OTHER_ACCT_NM: { value: "" },
          };
        },
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
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldsValues?.OTH_BRANCH_CD?.value &&
            dependentFieldsValues?.OTH_ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldsValues?.OTH_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldsValues?.OTH_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldsValues?.OTH_ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            formState?.handleButtonDisable(true);
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            let btn99, returnVal;
            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData?.MSG?.length; i++) {
              if (postData?.MSG?.[i]?.O_STATUS === "999") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message: postData?.MSG?.[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData;
              } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Confirmation",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });

                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG?.[i]?.O_STATUS === "0") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              OTH_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.OTH_ACCT_TYPE?.optionData
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              OTHER_ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            formState?.handleButtonDisable(false);
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
      label: "AccountName",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "divider",
      },
      label: "ProfessionalTaxAccount",
      name: "ProfessionalTaxAccount",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: { componentType: "_accountNumber" },
      __NEW__: {
        branchCodeMetadata: {
          name: "PTAX_BRANCH_CD",
          required: false,
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              PTAX_ACCT_TYPE: { value: "" },
              PTAX_ACCT_CD: { value: "" },
              PTAX_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
        },
      },
      __VIEW__: {
        branchCodeMetadata: {
          name: "PTAX_BRANCH_CD",
          required: false,
          defaultValue: "",
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              PTAX_ACCT_TYPE: { value: "" },
              PTAX_ACCT_CD: { value: "" },
              PTAX_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
        },
      },
      __EDIT__: {
        branchCodeMetadata: {
          name: "PTAX_BRANCH_CD",
          required: false,
          defaultValue: "",
          schemaValidation: {},
          validationRun: "onChange",
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              PTAX_ACCT_TYPE: { value: "" },
              PTAX_ACCT_CD: { value: "" },
              PTAX_ACCT_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
        },
      },
      accountTypeMetadata: {
        name: "PTAX_ACCT_TYPE",
        required: false,
        schemaValidation: {},
        disableCaching: true,
        dependentFields: ["PTAX_BRANCH_CD"],
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.PTAX_BRANCH_CD?.value,
            DOC_CD: "MST/041",
            USER_NAME: authState?.user?.id,
          });
        },
        _optionsKey: "getAccountType",
        validationRun: "onChange",
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          return {
            PTAX_ACCT_CD: { value: "" },
            PTAX_ACCT_NM: { value: "" },
          };
        },
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
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldsValues?.PTAX_BRANCH_CD?.value &&
            dependentFieldsValues?.PTAX_ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldsValues?.PTAX_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldsValues?.PTAX_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldsValues?.PTAX_ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "MST/041",
            };
            formState?.handleButtonDisable(true);
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            let btn99, returnVal;
            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData?.MSG?.length; i++) {
              if (postData?.MSG?.[i]?.O_STATUS === "999") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message: postData?.MSG?.[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData;
              } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                formState?.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Confirmation",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });

                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG?.[i]?.O_STATUS === "0") {
                formState?.handleButtonDisable(false);
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              PTAX_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.PTAX_ACCT_TYPE?.optionData
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              PTAX_ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            formState?.handleButtonDisable(false);
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
      label: "AccountName",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 },
    },
    {
      render: { componentType: "autocomplete" },
      name: "PTAX_DEF_TRAN_CD",
      label: "sidebar.Configuration",
      placeholder: "SelectConfiguration",
      options: getAgentMstConfigDDW,
      _optionsKey: "getAgentMstConfigDDW",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "divider",
      },
      label: "HandHeldMachine",
      name: "HandHeldMachine",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "autocomplete" },
      name: "PIGMY_CONF_TRAN_CD",
      label: "sidebar.Configuration",
      placeholder: "SelectConfiguration",
      options: getAgentMstConfigPigmyDDW,
      _optionsKey: "getAgentMstConfigPigmyDDW",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "TDS_RATE",
      label: "TDSRate",
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
