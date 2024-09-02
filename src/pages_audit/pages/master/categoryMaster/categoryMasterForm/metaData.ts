import { GeneralAPI } from "registry/fns/functions";
import { getDDDWAcctType, getPMISCData } from "../api";
import { utilFunction } from "@acuteinfo/common-base";
import { t } from "i18next";

export const CategoryMasterFormMetaData = {
  form: {
    name: "categoryMaster",
    label: "CategoryMasterForm",
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
      name: "CATEG_CD",
      label: "Code",
      placeholder: "EnterCode",
      type: "text",
      maxLength: 4,
      isFieldFocused: true,
      required: true,
      autoComplete: "off",
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
      __EDIT__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CATEG_NM",
      label: "CategoryName",
      placeholder: "EnterCategoryName",
      maxLength: 100,
      type: "text",
      required: true,
      autoComplete: "off",
      txtTransform: "uppercase",
      preventSpecialChars: localStorage.getItem("specialChar") || "",
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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CategoryNameisrequired"] }],
      },
      GridProps: { xs: 12, sm: 10, md: 10, lg: 10, xl: 10 },
    },

    {
      render: { componentType: "autocomplete" },
      name: "CONSTITUTION_TYPE",
      label: "TypeOfConstitution",
      placeholder: "SelectTypeOfConstitution",
      options: getPMISCData,
      _optionsKey: "getPMISCData",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_LIMIT",
      label: "TDSLimit",
      placeholder: "Enter TDS Limit",
      autoComplete: "off",
      maxLength: 9,
      FormatProps: {
        allowLeadingZeros: false,
        allowNegative: true,
        isAllowed: (values) => {
          //@ts-ignore
          if (values?.value?.length > 9) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: { componentType: "select" },
      name: "LF_NO",
      label: "Minor/Major",
      options: [
        { label: "Minor", value: "M   " },
        { label: "Major", value: "J   " },
        { label: "Sr. Citizen", value: "S   " },
        { label: "Super Sr. Citizen", value: "P   " },
        { label: "All", value: "A   " },
      ],
      __NEW__: { defaultValue: "A   " },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "divider",
      },
      label: "TDSPayable",
      name: "TDSPayable",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "TDS_RATE",
      label: "Rate",
      autoComplete: "off",
      maxLength: 5,
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

      GridProps: {
        xs: 12,
        sm: 4,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "TDS_BRANCH_CD",
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
            TDS_ACCT_TYPE: { value: "" },
            TDS_ACCT_CD: { value: "" },
            TDS_ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
      },
      accountTypeMetadata: {
        name: "TDS_ACCT_TYPE",
        options: getDDDWAcctType,
        _optionsKey: "getDDDWAcctType",
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
            TDS_ACCT_CD: { value: "" },
            TDS_ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
      },
      accountCodeMetadata: {
        name: "TDS_ACCT_CD",
        autoComplete: "off",
        dependentFields: ["TDS_ACCT_TYPE", "TDS_BRANCH_CD"],
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
            dependentFieldsValues?.TDS_BRANCH_CD?.value &&
            dependentFieldsValues?.TDS_ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldsValues?.TDS_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldsValues?.TDS_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldsValues?.TDS_ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "MST/050",
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
              TDS_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.TDS_ACCT_TYPE?.optionData
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              TDS_ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            formState?.handleButtonDisable(false);
            return {
              TDS_ACCT_NM: { value: "" },
            };
          }
          return {};
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.5, xl: 2.5 },
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "TDS_ACCT_NM",
      label: "AccountName",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.5, xl: 2.5 },
    },

    {
      render: {
        componentType: "divider",
      },
      label: "Surcharge",
      name: "Surcharge",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "TDS_SURCHARGE",
      label: "Rate",
      autoComplete: "off",
      maxLength: 5,
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
      GridProps: {
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: { componentType: "autocomplete" },
      name: "TDS_SUR_ACCT_TYPE",
      label: "AccountType",
      placeholder: "AccountTypePlaceHolder",
      validationRun: "onChange",
      options: getDDDWAcctType,
      _optionsKey: "getDDDWAcctType",
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        return {
          TDS_SUR_ACCT_CD: { value: "" },
        };
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },

    {
      render: { componentType: "hidden" },
      name: "BRANCH_CD",
    },

    {
      render: {
        componentType: "numberFormat",
      },
      label: "AccountNumber",
      name: "TDS_SUR_ACCT_CD",
      placeholder: "AccountNumberPlaceHolder",
      autoComplete: "off",
      dependentFields: ["TDS_SUR_ACCT_TYPE", "BRANCH_CD"],
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
          dependentFieldsValues?.BRANCH_CD?.value &&
          dependentFieldsValues?.TDS_SUR_ACCT_TYPE?.value
        ) {
          const reqParameters = {
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value,
            COMP_CD: authState?.companyID,
            ACCT_TYPE: dependentFieldsValues?.TDS_SUR_ACCT_TYPE?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value,
              dependentFieldsValues?.TDS_SUR_ACCT_TYPE?.optionData
            ),
            SCREEN_REF: "MST/050",
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
            TDS_SUR_ACCT_CD:
              returnVal !== ""
                ? {
                    value: utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldsValues?.TDS_SUR_ACCT_TYPE?.optionData
                    ),
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  }
                : {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
          };
        }
        return {};
      },
      maxLength: 8,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        xl: 4,
      },
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 8) {
            return false;
          }
          return true;
        },
      },
    },

    {
      render: {
        componentType: "divider",
      },
      label: "TDSReceivable",
      name: "TDSReceivable",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "TDS_REC_BRANCH_CD",
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
            TDS_REC_ACCT_TYPE: { value: "" },
            TDS_REC_ACCT_CD: { value: "" },
            TDS_REC_ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        name: "TDS_REC_ACCT_TYPE",
        options: getDDDWAcctType,
        _optionsKey: "getDDDWAcctType",
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
            TDS_REC_ACCT_CD: { value: "" },
            TDS_REC_ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
      accountCodeMetadata: {
        name: "TDS_REC_ACCT_CD",
        autoComplete: "off",
        dependentFields: ["TDS_REC_ACCT_TYPE", "TDS_REC_BRANCH_CD"],
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
            dependentFieldsValues?.TDS_REC_BRANCH_CD?.value &&
            dependentFieldsValues?.TDS_REC_ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldsValues?.TDS_REC_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldsValues?.TDS_REC_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldsValues?.TDS_REC_ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "MST/050",
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
              TDS_REC_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.TDS_REC_ACCT_TYPE?.optionData
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              TDS_REC_ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            formState?.handleButtonDisable(false);
            return {
              TDS_REC_ACCT_NM: { value: "" },
            };
          }
          return {};
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "TDS_REC_ACCT_NM",
      label: "AccountName",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    },
  ],
};
