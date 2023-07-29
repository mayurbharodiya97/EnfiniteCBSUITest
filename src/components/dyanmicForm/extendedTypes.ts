import { GeneralAPI } from "registry/fns/functions";
import { ExtendedFieldMetaDataTypeOptional } from "./types";
import sub from "date-fns/sub";

export const extendedMetaData: ExtendedFieldMetaDataTypeOptional = {
  currency: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      thousandSeparator: true,
      prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: true,
      allowLeadingZeros: false,
      decimalScale: 2,
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
    enableNumWords: true,
    maxLength: 10,
  },
  currencyWithoutWords: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      thousandSeparator: true,
      prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
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
    FormatProps: {
      suffix: "%",
      decimalScale: 2,
      fixedDecimalScale: true,
      allowNegative: true,
      allowEmptyFormatting: true,
      isAllowed: (values) => {
        //@ts-ignore
        if (values.floatValue <= 100) {
          return true;
        }
        return false;
      },
    },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "typeError", params: ["ThisFieldisrequired"] },
        { name: "required", params: ["ThisFieldisrequired"] },
      ],
    },
  },
  MonthlyEmiPayCurrency: {
    render: {
      componentType: "numberFormat",
    },
    FormatProps: {
      thousandSeparator: true,
      prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 0,
      maxLength: 13,
      isAllowed: (values) => {
        if (values.floatValue === null) {
          return false;
        }
        return true;
      },
    },
    enableNumWords: true,
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
      prefix: "৳",
      thousandsGroupStyle: "lakh",
      allowNegative: true,
      allowLeadingZeros: false,
      decimalScale: 2,
      isAllowed: (values) => {
        if (values?.value?.length > 10) {
          return false;
        }
        return true;
      },
    },
    enableNumWords: true,
    maxLength: 10,
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
      prefix: "₹ ",
      thousandsGroupStyle: "lakh",
      allowNegative: false,
      allowLeadingZeros: false,
      decimalScale: 2,
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
    enableNumWords: false,
  },
  accountNumber: {
    render: {
      componentType: "textField",
    },
    label: "Account Code",
    name: "ACCT_CD",
    required: true,
    dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
    postValidationSetCrossFieldValues: "retrieveStatementDetails",
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["Account code is required"] },
        {
          name: "min",
          params: [6, "Account code should not be less than 10 digits"],
        },
        {
          name: "max",
          params: [20, "Account code should not exceed 20 digits"],
        },
      ],
    },
    FormatProps: {
      // format: "###########",
      // allowNegative: false,
      // allowLeadingZeros: true,
      // isNumericString: true,
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
      componentType: "select",
    },
    label: "Report Account Type",
    options: GeneralAPI.getReportAccountType,
    _optionsKey: "getReportAccountType",
  },

  fullAccountNumber: {
    render: {
      componentType: "numberFormat",
    },
    name: "ACCT_NO",
    label: "fullAccountNumber",
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["Account No is required"] },
        {
          name: "min",
          params: [10, "Account No should not be less than 10 digits"],
        },
        {
          name: "max",
          params: [20, "Account No should not exceed 20 digits"],
        },
      ],
    },
  },
  branchCode: {
    render: {
      componentType: "select",
    },
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Branch Code is required"] }],
    },
    required: true,
    name: "BRANCH_CD",
    label: "Branch Code",
    options: GeneralAPI.getBranchCodeList,
    _optionsKey: "getBranchCodeList",
  },

  accountType: {
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
    options: GeneralAPI.getAccountTypeList,
    _optionsKey: "getAccountTypeList",
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
};
