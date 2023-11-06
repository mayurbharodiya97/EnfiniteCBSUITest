import * as API from "./api";
// export const DenominationScreenMetaData = {
//   form: {
//     name: "DenominationScreenMetaData",
//     label: "Note Denomination",
//     resetFieldOnUnmount: false,
//     validationRun: "onBlur",
//     submitAction: "home",
//     render: {
//       ordering: "auto",
//       renderType: "simple",
//       gridConfig: {
//         item: {
//           xs: 12,
//           sm: 6,
//           md: 6,
//           lg: 6,
//           xl: 6,
//         },
//         container: {
//           direction: "row",
//           spacing: 1,
//         },
//       },
//     },
//     componentProps: {
//       textField: {
//         fullWidth: true,
//       },
//       select: {
//         fullWidth: true,
//       },
//       datePicker: {
//         fullWidth: true,
//       },
//       numberFormat: {
//         fullWidth: true,
//       },
//       inputMask: {
//         fullWidth: true,
//       },
//       datetimePicker: {
//         fullWidth: true,
//       },
//       autocomplete: {
//         fullWidth: true,
//       },
//     },
//   },
//   fields: [
//     {
//       render: {
//         componentType: "spacer",
//       },
//       sequence: 14,
//       GridProps: {
//         xs: 1,
//         md: 9,
//         sm: 9,
//       },
//     },
//     {
//       render: {
//         componentType: "_accountNumber",
//       },
//       // acctFieldPara: "1",
//       // postValidationSetCrossFieldValues: "testingFn",
//       name: "ACCT_CD",
//     },

//     {
//       render: {
//         componentType: "select",
//       },
//       name: "SDC",
//       label: "SDC",
//       placeholder: "Select SDC",
//       type: "text",
//       _optionsKey: "SDC",
//       options: () => {
//         return [
//
//         ];
//       },
//       fullWidth: true,
//       GridProps: {
//         xs: 12,
//         md: 4,
//         sm: 4,
//         lg: 4,
//         xl: 4,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "REMARK",
//       label: "Remark",
//       placeholder: "Enter Remark",
//       type: "text",
//       fullWidth: true,
//       GridProps: {
//         xs: 12,
//         md: 4,
//         sm: 4,
//         lg: 4,
//         xl: 4,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "RECEIPT_PAYMENT",
//       label: "Receipt",
//       placeholder: "Enter Value",
//       type: "text",
//       dependentFields: ["TRANSACTION"],
//       fullWidth: true,

//       GridProps: {
//         xs: 12,
//         md: 4,
//         sm: 4,
//         lg: 4,
//         xl: 4,
//       },
//     },
//   ],
// };

import { FilterFormMetaType } from "components/formcomponent";
import { GeneralAPI } from "registry/fns/functions";

export const DenominationScreenMetaData: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Teller Operation",
    allowColumnHiding: true,
    submitButtonName: "Denomination",

    HideHeader: true,
    submitButtonHide: false,
    isDisplayOnly: false,
  },
  fields: [
    {
      accessor: "TRN",
      name: "TRN",
      defaultValue: "R",
      isVisible: true,
      gridconfig: { xs: 6, sm: 2 },
      label: "Transaction",
      autoComplete: "off",
      required: true,
      isDisabled: false,
      placeholder: "Select Transaction",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: [
        { label: " Cash Receipt", value: "R" },
        { label: " Cash Payment", value: "P" },
        // { label: "Single denomination", value: "S" },
      ],

      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "BRANCH",
      name: "BRANCH",
      label: "Branch",
      placeholder: "Branch",
      type: "text",
      isDisabled: false,
      gridconfig: { xs: 6, sm: 1 },
      // accessor: "BRANCH",
      // name: "BRANCH",
      // defaultValue: "",
      // isVisible: true,
      // gridconfig: { xs: 6, sm: 2 },
      // label: "Branch",
      // autoComplete: "off",
      // required: true,
      // isDisabled: false,
      // placeholder: "Select Branch",
      // isColumnHidingDisabled: true,
      // entertoSubmit: true,
      // type: "select",
      // optiondata: GeneralAPI.getBranchCodeList,
      // _optionsKey: "getBranchCodeList",
      // validate: (columnValue, allField, flag) => {
      //   if (!Boolean(columnValue)) {
      //     return "This field is required.";
      //   }
      //   return "";
      // },
    },
    {
      accessor: "ACOUNT_TYPE",
      name: "ACCOUNT_TYPE",
      label: "Account Type",
      placeholder: "Account Type",
      type: "text",
      isDisabled: false,
      gridconfig: { xs: 6, sm: 1 },
      // accessor: "ACCOUNT_TYPE",
      // name: "ACCOUNT_TYPE",
      // defaultValue: "",
      // isVisible: true,
      // gridconfig: { xs: 6, sm: 2 },
      // label: "Account Type",
      // autoComplete: "off",
      // required: true,
      // isDisabled: false,
      // placeholder: "Select Account Type",
      // isColumnHidingDisabled: true,
      // entertoSubmit: true,
      // type: "select",
      // optiondata: GeneralAPI.getAccountTypeList,
      // _optionsKey: "getAccountTypeList",
      // validate: (columnValue, allField, flag) => {
      //   if (!Boolean(columnValue)) {
      //     return "This field is required.";
      //   }
      //   return "";
      // },
    },
    {
      accessor: "ACCOUNT_NUMBER",
      name: "ACCOUNT_NUMBER",
      label: "Account Number",
      placeholder: "Account Number",
      type: "text",
      isDisabled: false,
      gridconfig: { xs: 6, sm: 2 },
    },
    {
      accessor: "SDC",
      name: "SDC",
      defaultValue: "1   ",
      isVisible: true,
      gridconfig: { xs: 6, sm: 2 },
      label: "SDC",
      autoComplete: "off",
      placeholder: "Select SDC",
      isColumnHidingDisabled: false,
      entertoSubmit: true,
      type: "select",
      isDisabled: false,
      optiondata: API.getSDCList,
      _optionsKey: "getSDCList",
    },
    {
      accessor: "REMARK",
      name: "REMARK",
      label: "remark",
      placeholder: "Enter remark",
      type: "text",
      isDisabled: false,
      gridconfig: { xs: 6, sm: 2 },
    },
    {
      accessor: "RECEIPT_PAYMENT",
      name: "RECEIPT_PAYMENT",
      defaultValue: "",
      type: "number",
      isVisible: true,
      gridconfig: { xs: 6, sm: 2 },
      defaultfocus: true,
      // defaultfocus: true,
      label: "Receipt",
      required: true,
      autoComplete: "off",
      isDisabled: false,
      placeholder: "Please Enter Receipt Value",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        // console.log(colomnValue, value, name, extraData, "OOOOOOOO");
        if (value === "R") {
          return {
            label: "Receipt",
            placeholder: "Please Enter Receipt Value",
            gridconfig: { xs: 6, sm: 2 },
          };
        } else if (value === "P") {
          return {
            label: "Payment",
            placeholder: "Please Enter Payment Value",
            gridconfig: { xs: 6, sm: 2 },
          };
        }
      },
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        } else if (Boolean(parseFloat(columnValue) <= 0)) {
          return "Value must be greater then 0(zero).";
        }
        return "";
      },
    },
  ],
};
