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
      options: () => getPMISCData("CKYC_CONST_TYPE"),
      _optionsKey: "getPMISCData",
      defaultValue: "01",
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
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 3,
      },
      FormatProps: {
        allowNegative: false,
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
        placeholder: "Enter TDS Payable Branch",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
      },
      accountTypeMetadata: {
        name: "TDS_ACCT_TYPE",
        label: "Account Type",
        options: getDDDWAcctType,
        _optionsKey: "getDDDWAcctType",
        placeholder: "Enter TDS Payable Type",
        defaultValue: "GL  ",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.5, xl: 2.5 },
      },
      accountCodeMetadata: {
        name: "TDS_ACCT_CD",
        label: "Account No.",
        autoComplete: "off",
        placeholder: "Enter TDS Payable A/c No.",
        dependentFields: ["TDS_ACCT_TYPE", "TDS_BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValue
        ) => {
          let resData: any = await GeneralAPI.retrieveStatementDtlAcctCd(
            currentField,
            formState,
            authState,
            dependentFieldValue
          );
          return {
            ...resData,
            TDS_ACCT_NM: resData?.ACCT_NM,
            TDS_ACCT_CD: resData?.ACCT_CD,
          };
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
      placeholder: "Enter TDS Payable Account Name",
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
      GridProps: {
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: { componentType: "select" },
      name: "TDS_SUR_ACCT_TYPE",
      label: "Account Type",
      options: [
        { label: "GL", value: "GL  ", PADDING_NUMBER: "4" },
        { label: "PL", value: "PL  ", PADDING_NUMBER: "4" },
        { label: "0583", value: "0583", PADDING_NUMBER: "4" },
      ],
      defaultValue: "GL  ",
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
      placeholder: "Enter Surcharge A/c No.",
      autoComplete: "off",
      dependentFields: ["TDS_SUR_ACCT_TYPE", "BRANCH_CD"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        let resData: any = await GeneralAPI.retrieveStatementDtlAcctCd(
          currentField,
          formState,
          authState,
          dependentFieldValues
        );
        return {
          ...resData,
          TDS_SUR_ACCT_CD: resData?.ACCT_CD,
        };
      },
      maxLength: 8,
      GridProps: {
        xs: 3,
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
        placeholder: "Enter TDS Receivable Branch",
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        name: "TDS_REC_ACCT_TYPE",
        label: "Account Type",
        placeholder: "Enter TDS Receivable Type",
        _optionsKey: "getDDDWAcctType",
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
        defaultValue: "GL  ",
      },
      accountCodeMetadata: {
        name: "TDS_REC_ACCT_CD",
        label: "Account No.",
        placeholder: "Enter TDS Receivable A/c No.",
        autoComplete: "off",
        dependentFields: ["TDS_REC_ACCT_TYPE", "TDS_REC_BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValue
        ) => {
          let resData: any = await GeneralAPI.retrieveStatementDtlAcctCd(
            currentField,
            formState,
            authState,
            dependentFieldValue
          );
          return {
            ...resData,
            TDS_REC_ACCT_NM: resData?.ACCT_NM,
            TDS_REC_ACCT_CD: resData?.ACCT_CD,
          };
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
      placeholder: "Enter TDS Receivable Account Name",
      maxLength: 30,
      type: "text",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    },
  ],
};
