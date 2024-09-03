import { GeneralAPI } from "registry/fns/functions";
import { ExtendedFieldMetaDataTypeOptional } from "./types";
import sub from "date-fns/sub";

export const extendedMetaData: ExtendedFieldMetaDataTypeOptional = {
  currency: {
    render: {
      componentType: "numberFormat",
    },
    className: "textInputFromRight",
    FormatProps: {
      thousandSeparator: true,
      // prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      placeholder: "00.00",
      isAllowed: (values) => {
        if (values?.value?.length > 15) {
          return false;
        }
        if (values.floatValue === 0) {
          return false;
        }
        return true;
      },
    },
    enableNumWords: true,
    isCurrencyField: true,
    // maxLength: 10,
    StartAdornment: "INR",
  },
  currencyWithoutWords: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      thousandSeparator: true,
      // prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      isAllowed: (values) => {
        if (values?.value?.length > 10) {
          return false;
        }
        if (values.floatValue === 0) {
          return false;
        }
        return true;
      },
    },
    enableNumWords: false,
    maxLength: 10,
    isCurrencyField: true,
    StartAdornment: "INR",
  },
  dob: {
    render: {
      componentType: "datePicker",
    },
    //@ts-ignore
    schemaValidation: {
      type: "date",
      rules: [
        { name: "typeError", params: ["Must be a valid date"] },
        {
          name: "max",
          params: [
            sub(new Date(), { years: 18 }),
            "minimum age must be 18 years",
          ],
        },
        {
          name: "min",
          params: [
            sub(new Date(), { years: 100 }),
            "maximum age must be 100 years",
          ],
        },
      ],
    },
  },
  phoneNumber: {
    render: {
      componentType: "numberFormat",
    },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["Mobile No is required"] },
        { name: "min", params: [10, "Mobile No should be 10 digit."] },
        { name: "max", params: [10, "Mobile No should be 10 digit."] },
      ],
    },
    FormatProps: {
      format: "###########",
      allowNegative: false,
      allowLeadingZeros: true,
      isNumericString: true,
      isAllowed: (values) => {
        if (values?.value?.length > 10) {
          return false;
        }

        return true;
      },
    },
    // StartAdornment: "+88",
  },
  phoneNumberOptional: {
    render: {
      componentType: "inputMask",
    },
    MaskProps: {
      mask: "0000000000",
      lazy: true,
    },
  },
  panCard: {
    render: {
      componentType: "inputMask",
    },
    fullWidth: true,
    MaskProps: {
      mask: "aaaaa0000a",
      prepare: function (str) {
        return str.toUpperCase();
      },
      lazy: true,
    },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["ThisFieldisrequired"] },
        {
          name: "pancard",
          params: ["Please enter valid Pan Card Number"],
        },
      ],
    },
  },
  panCardOptional: {
    render: {
      componentType: "inputMask",
    },

    MaskProps: {
      mask: "aaaaa0000a",
      prepare: function (str) {
        return str.toUpperCase();
      },
      lazy: true,
    },
  },
  aadharCard: {
    render: {
      componentType: "inputMask",
    },
    fullWidth: true,
    MaskProps: {
      mask: "0000` 0000` 0000",
      lazy: true,
    },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["ThisFieldisrequired"] },
        {
          name: "aadhar",
          params: ["Please enter valid Aadhar Number"],
        },
      ],
    },
  },
  rateOfInt: {
    render: {
      componentType: "numberFormat",
    },
    className: "textInputFromRight",
    placeholder: "0",
    FormatProps: {
      allowNegative: false,
      allowLeadingZeros: true,
      decimalScale: 2,
      isAllowed: (values) => {
        if (values?.value?.length > 6) {
          return false;
        }
        if (parseFloat(values?.value) > 100) {
          return false;
        }
        return true;
      },
    },
    maxLength: 6,
    EndAdornment: "%",
    // schemaValidation: {
    //   type: "string",
    //   rules: [
    //     { name: "typeError", params: ["ThisFieldisrequired"] },
    //     { name: "required", params: ["ThisFieldisrequired"] },
    //   ],
    // },
  },
  MonthlyEmiPayCurrency: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      thousandSeparator: true,
      // prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      maxLength: 13,
      isAllowed: (values) => {
        if (values.floatValue === null) {
          return false;
        }
        return true;
      },
    },
    enableNumWords: true,
    isCurrencyField: true,
    StartAdornment: "INR",
  },
  pincode: {
    render: {
      componentType: "numberFormat",
    },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["Residence Pincode is required"] },
        { name: "min", params: [6, "Residence Pincode should be 6 digit."] },
        { name: "max", params: [6, "Residence Pincode should be 6 digit."] },
      ],
    },
    FormatProps: {
      format: "######",
      isAllowed: (values) => {
        if (values.floatValue === 0) {
          return false;
        }
        return true;
      },
    },
  },
  futureDateNotAllowed: {
    render: {
      componentType: "datePicker",
    },
    //@ts-ignore
    schemaValidation: {
      type: "date",
      rules: [
        { name: "typeError", params: ["Must be a valid date"] },
        {
          name: "max",
          params: [new Date(), "Future Date not allowed."],
        },
      ],
    },
  },
  minAge: {
    render: {
      componentType: "numberFormat",
    },
    schemaValidation: {
      type: "number",
      rules: [
        { name: "required", params: ["Min Age is required"] },
        { name: "min", params: [25, "Min age should be 25 years"] },
      ],
    },
    FormatProps: {
      format: "##",
    },
  },
  maxAge: {
    render: {
      componentType: "numberFormat",
    },
    schemaValidation: {
      type: "number",
      rules: [
        { name: "required", params: ["Max Age is required"] },
        { name: "max", params: [65, "Max age should be 65 years"] },
      ],
    },
    FormatProps: {
      format: "##",
    },
  },
  rateOfIntWithoutValidation: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      suffix: "%",
      decimalScale: 2,
      fixedDecimalScale: true,
      allowNegative: true,
      allowEmptyFormatting: true,
      isAllowed: (values) => {
        //@ts-ignore
        if (values.floatValue >= 999.99) {
          return false;
        }
        return true;
      },
    },
  },

  rateOfIntUptoThreeDigits: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      suffix: "%",
      decimalScale: 2,
      fixedDecimalScale: true,
      allowNegative: true,
      allowEmptyFormatting: true,
      isAllowed: (values) => {
        //@ts-ignore
        if (values.floatValue < 999.99) {
          return false;
        }
        return true;
      },
    },
  },

  squareFeetFormat: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      thousandSeparator: true,
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      isAllowed: (values) => {
        if (values?.value?.length > 20) {
          return false;
        }
        if (values.floatValue === 0) {
          return false;
        }
        return true;
      },
    },
    maxLength: 20,
    showMaxLength: false,
  },
  currencyWithLeadingZeros: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      thousandSeparator: true,
      // prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: true,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      isAllowed: (values) => {
        if (values?.value?.length > 10) {
          return false;
        }
        return true;
      },
    },
    isCurrencyField: true,
    enableNumWords: true,
    maxLength: 10,
    StartAdornment: "INR",
  },
  pincodeNoValidation: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      format: "######",
      isAllowed: (values) => {
        if (values.floatValue === 0) {
          return false;
        }
        return true;
      },
    },
  },
  amountField: {
    render: {
      componentType: "numberFormat",
    },
    className: "textInputFromRight",
    FormatProps: {
      thousandSeparator: true,
      // prefix: "₹",
      thousandsGroupStyle: "lakh",
      allowNegative: true,
      allowLeadingZeros: false,
      decimalScale: 2,
      fixedDecimalScale: true,
      autoComplete: "off",
      placeholder: "0.00",
      isAllowed: (values) => {
        if (values?.value?.length > 14) {
          return false;
        }
        if (values.floatValue === 0) {
          return false;
        }
        return true;
      },
    },
    StartAdornment: "INR",
    isCurrencyField: true,
  },
  customerID: {
    render: {
      componentType: "numberFormat",
    },
    label: "CustomerId",
    maxLength: 12,
    postValidationSetCrossFieldValues: GeneralAPI.getCustomerIdValidate,
    FormatProps: {
      isAllowed: (values) => {
        if (values?.value?.length > 12) {
          return false;
        }
        if (values.floatValue === 0) {
          return false;
        }
        return true;
      },
      isValidation: "no",
    },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["CustomerIDisrequired"] },
        {
          name: "max",
          params: [12, "CustomerIDShouldNotBeLessThan12Digits"],
        },
      ],
    },
  },

  reportAccountType: {
    render: {
      componentType: "autocomplete",
    },
    name: "RPT_ACCT_TYPE",
    label: "Report Account Type",
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Account Type is required"] }],
    },
    required: true,
    options: GeneralAPI.getReportAccountType,
    _optionsKey: "getReportAccountType",
    defaultAcctTypeTrue: true,
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
    },
  },

  fullAccountNumber: {
    render: {
      componentType: "textField",
    },
    name: "FULL_ACCT_NO",
    label: "Full Account Number",
    postValidationSetCrossFieldValues: "retrieveStatementDtlFullAcctNo",
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Full account No is required"] }],
    },
    GridProps: {
      xs: 12,
      md: 12,
      sm: 12,
      lg: 12,
      xl: 12,
    },
    maxLength: 20,
    FormatProps: {
      allowNegative: false,
      allowLeadingZeros: true,
      isAllowed: (values) => {
        if (values?.value?.length > 20) {
          return false;
        }
        return true;
      },
    },
  },
  branchCode: {
    render: {
      componentType: "autocomplete",
    },
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["BranchCodeReqired"] }],
    },
    required: true,
    name: "BRANCH_CD",
    label: "BranchCode",
    placeholder: "BranchCodePlaceHolder",
    defaultValue: "",
    options: GeneralAPI.getBranchCodeList,
    _optionsKey: "getBranchCodeList",
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
    },
    // NOTE : this props only for set default brranch and only use in branchCode component do not use this key any other place or any component
    defaultBranchTrue: true,
  },

  accountType: {
    render: {
      componentType: "autocomplete",
    },
    required: true,
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["AccountTypeReqired"] }],
    },
    name: "ACCT_TYPE",
    label: "AccountType",
    placeholder: "AccountTypePlaceHolder",
    options: (dependentValue, formState, _, authState) => {
      return GeneralAPI.get_Account_Type({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        USER_NAME: authState?.user?.id ?? "",
        DOC_CD: formState?.docCd ?? "",
      });
    },
    _optionsKey: "get_Account_Type",
    defaultAcctTypeTrue: true,
    defaultValue: "",
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
    },
  },

  accountCode: {
    render: {
      componentType: "numberFormat",
    },
    label: "AccountNumber",
    name: "ACCT_CD",
    placeholder: "AccountNumberPlaceHolder",
    required: true,
    // maxLength: 8,
    dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
    postValidationSetCrossFieldValues: "retrieveStatementDtlAcctCd",
    // setValueOnDependentFieldsChange: (dependentFields) => {
    //   return "";
    // },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["AccountNumberReqired"] },
        {
          name: "max",
          params: [20, "AcctNoValidationMsg"],
        },
      ],
    },
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
    },
    FormatProps: {
      // format: "###########",
      allowNegative: false,
      allowLeadingZeros: true,
      // isNumericString: true,

      isAllowed: (values) => {
        if (values?.value?.length > 8) {
          return false;
        }
        return true;
      },
    },
  },
  accountNumberOptional: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      allowNegative: false,
      allowLeadingZeros: false,
      isAllowed: (values) => {
        if (values?.value?.length > 20) {
          return false;
        }
        // if (values.floatValue === 0) {
        //   return false;
        // }
        return true;
      },
    },
  },
  userAccessableTypeForLoginBranch: {
    render: {
      componentType: "select",
    },
    required: true,
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Account Type is required"] }],
    },
    name: "ACCT_TYPE",
    label: "AccountType",
    // options: GeneralAPI.getAccountTypeList,
    _optionsKey: "getAccountTypeList",
  },

  allTypeForBaseBranch: {
    render: {
      componentType: "select",
    },
    required: true,
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Account Type is required"] }],
    },
    name: "ACCT_TYPE",
    label: "AccountType",
    // options: GeneralAPI.getAccountTypeList,
    _optionsKey: "getAccountTypeList",
  },

  loginAccessableBranch: {
    render: {
      componentType: "select",
    },
    required: true,
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Account Type is required"] }],
    },
    name: "ACCT_TYPE",
    label: "AccountType",
    // options: GeneralAPI.getAccountTypeList,
    _optionsKey: "",
  },

  reportAccessBranch: {
    render: {
      componentType: "select",
    },
    required: true,
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Account Type is required"] }],
    },
    name: "ACCT_TYPE",
    label: "AccountType",
    // options: GeneralAPI.getAccountTypeList,
    _optionsKey: "",
  },

  allBranch: {
    render: {
      componentType: "select",
    },
    required: true,
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Account Type is required"] }],
    },
    name: "ACCT_TYPE",
    label: "AccountType",
    // options: GeneralAPI.getAccountTypeList,
    _optionsKey: "",
  },
  Remark: {
    render: {
      componentType: "textField",
    },
    maxLength: 100,
  },
};
