import { GeneralAPI } from "registry/fns/functions";
import { getDDDWAcctType, getPMISCData } from "../api";

export const CategoryMasterFormMetaData = {
  form: {
    name: "categoryMaster",
    label: "Category Master",
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
      placeholder: "Enter Code",
      type: "text",
      maxLength: 4,
      isFieldFocused: true,
      required: true,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required."] }],
      },
      __EDIT__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CATEG_NM",
      label: "Category Name",
      placeholder: "Enter Category Name",
      maxLength: 100,
      type: "text",
      required: true,
      autoComplete: "off",
      txtTransform: "uppercase",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Category Name is required."] }],
      },
      GridProps: { xs: 12, sm: 10, md: 10, lg: 10, xl: 10 },
    },

    {
      render: { componentType: "autocomplete" },
      name: "CONSTITUTION_TYPE",
      label: "Type Of Constitution",
      placeholder: "Select Type Of Constitution",
      options: () => getPMISCData("CKYC_CONST_TYPE"),
      _optionsKey: "getPMISCData",
      type: "text",
      __VIEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_LIMIT",
      label: "TDS Limit",
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
      defaultValue: "A   ",
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "TDS Payable",
      name: "TDSPayable",
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
        label: "Branch",
        placeholder: "Select Branch",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
      },
      accountTypeMetadata: {
        name: "TDS_ACCT_TYPE",
        label: "Account Type",
        placeholder: "Select Account Type",
        options: getDDDWAcctType,
        _optionsKey: "getDDDWAcctType",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
      },
      accountCodeMetadata: {
        name: "TDS_ACCT_CD",
        label: "Account No.",
        autoComplete: "off",
        placeholder: "Enter Account No.",
        dependentFields: ["TDS_ACCT_TYPE", "TDS_BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          const paddedAcctcode = (currentField?.value).padStart(
            dependentFieldValues?.TDS_ACCT_TYPE?.optionData?.[0]
              ?.PADDING_NUMBER || 0,
            0
          );

          const reqParameters = {
            BRANCH_CD: dependentFieldValues?.TDS_BRANCH_CD?.value,
            COMP_CD: authState?.companyID,
            ACCT_TYPE: dependentFieldValues?.TDS_ACCT_TYPE?.value,
            ACCT_CD: paddedAcctcode,
            SCREEN_REF: "EMST/041",
          };

          if (
            paddedAcctcode &&
            dependentFieldValues?.TDS_BRANCH_CD?.value &&
            dependentFieldValues?.TDS_ACCT_TYPE?.value
          ) {
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            if (postData?.RESTRICTION) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData.RESTRICTION,
                buttonNames: ["Ok"],
              });
              return {
                TDS_ACCT_CD: { value: "" },
                TDS_ACCT_TYPE: { value: "" },
              };
            }

            if (postData?.MESSAGE1) {
              formState.MessageBox({
                messageTitle: "Validation Alert",
                message: postData.MESSAGE1,
                buttonNames: ["Ok"],
              });
            }

            return {
              TDS_ACCT_CD: {
                value: paddedAcctcode || "",
                ignoreUpdate: true,
              },
              TDS_ACCT_NM: { value: postData.ACCT_NM || "" },
            };
          }
        },
        GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.5, xl: 2.5 },
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "TDS_ACCT_NM",
      label: "Account Name",
      placeholder: "Enter Account Name",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.5, xl: 2.5 },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Service Charge",
      name: "Surcharge",
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
      label: "Account Type",
      placeholder: "Select Account Type",
      options: getDDDWAcctType,
      _optionsKey: "getDDDWAcctType",
      type: "text",
      __VIEW__: { isReadOnly: true },
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
      label: "Account No.",
      name: "TDS_SUR_ACCT_CD",
      placeholder: "Enter Account No.",
      autoComplete: "off",
      dependentFields: ["TDS_SUR_ACCT_TYPE", "BRANCH_CD"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        const paddedAcctcode = (currentField?.value).padStart(
          dependentFieldValues?.TDS_SUR_ACCT_TYPE?.optionData?.[0]
            ?.PADDING_NUMBER || 0,
          0
        );

        const reqParameters = {
          BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
          COMP_CD: authState?.companyID,
          ACCT_TYPE: dependentFieldValues?.TDS_SUR_ACCT_TYPE?.value,
          ACCT_CD: paddedAcctcode,
          SCREEN_REF: "EMST/041",
        };

        if (
          paddedAcctcode &&
          dependentFieldValues?.BRANCH_CD?.value &&
          dependentFieldValues?.TDS_SUR_ACCT_TYPE?.value
        ) {
          const postData = await GeneralAPI.getAccNoValidation(reqParameters);

          if (postData?.RESTRICTION) {
            formState.MessageBox({
              messageTitle: "Validation Failed...!",
              message: postData.RESTRICTION,
              buttonNames: ["Ok"],
            });
            return {
              TDS_SUR_ACCT_CD: { value: "" },
              TDS_SUR_ACCT_TYPE: { value: "" },
            };
          }

          if (postData?.MESSAGE1) {
            formState.MessageBox({
              messageTitle: "Validation Alert",
              message: postData.MESSAGE1,
              buttonNames: ["Ok"],
            });
          }

          return {
            TDS_SUR_ACCT_CD: {
              value: paddedAcctcode || "",
              ignoreUpdate: true,
            },
          };
        }
      },

      maxLength: 8,
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
        componentType: "Divider",
      },
      dividerText: "TDS Receivable",
      name: "TDSReceivable",
    },

    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "TDS_REC_BRANCH_CD",
        label: "Branch",
        placeholder: "Select Branch",
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        name: "TDS_REC_ACCT_TYPE",
        label: "Account Type",
        placeholder: "Select Account Type",
        _optionsKey: "getDDDWAcctType",
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
      accountCodeMetadata: {
        name: "TDS_REC_ACCT_CD",
        label: "Account No.",
        placeholder: "Enter Account No.",
        autoComplete: "off",
        dependentFields: ["TDS_REC_ACCT_TYPE", "TDS_REC_BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          const paddedAcctcode = (currentField?.value).padStart(
            dependentFieldValues?.TDS_REC_ACCT_TYPE?.optionData?.[0]
              ?.PADDING_NUMBER || 0,
            0
          );

          const reqParameters = {
            BRANCH_CD: dependentFieldValues?.TDS_REC_BRANCH_CD?.value,
            COMP_CD: authState?.companyID,
            ACCT_TYPE: dependentFieldValues?.TDS_REC_ACCT_TYPE?.value,
            ACCT_CD: paddedAcctcode,
            SCREEN_REF: "EMST/041",
          };

          if (
            paddedAcctcode &&
            dependentFieldValues?.TDS_REC_BRANCH_CD?.value &&
            dependentFieldValues?.TDS_REC_ACCT_TYPE?.value
          ) {
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);

            if (postData?.RESTRICTION) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData.RESTRICTION,
                buttonNames: ["Ok"],
              });
              return {
                TDS_REC_ACCT_CD: { value: "" },
                TDS_REC_ACCT_TYPE: { value: "" },
              };
            }

            if (postData?.MESSAGE1) {
              formState.MessageBox({
                messageTitle: "Validation Alert",
                message: postData.MESSAGE1,
                buttonNames: ["Ok"],
              });
            }

            return {
              TDS_REC_ACCT_CD: {
                value: paddedAcctcode || "",
                ignoreUpdate: true,
              },
              TDS_REC_ACCT_NM: { value: postData.ACCT_NM || "" },
            };
          }
        },
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "TDS_REC_ACCT_NM",
      label: "Account Name",
      placeholder: "Enter Account Name",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    },
  ],
};
