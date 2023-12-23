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
import { GridMetaDataType } from "components/dataTableStatic";

export const DenominationScreenMetaData: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Teller Operation",
    allowColumnHiding: true,
    submitButtonName: "Denomination",
    HideHeader: true,
    submitButtonHide: false,
    isDisplayOnly: false,
    validationRun: "onBlur",
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
      // tabToSubmit: true,
      isDisabled: false,
      placeholder: "Select Transaction",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: [
        { label: " Cash Receipt", value: "R" },
        { label: " Cash Payment", value: "P" },
        { label: " Single Denomination", value: "S" },
      ],

      onBlurHandler: (columnValue, allField, flag) => {
        // if (!Boolean(columnValue)) {
        //   return "This field is required.";
        // }
        // return "";
        //@ts-ignore
        // if (typeof window?._CHANGE_OPERATOR_TYPE === "function") {
        //@ts-ignore
        window._CHANGE_OPERATOR_TYPE(columnValue, "TRN");
        // }
      },
    },
    {
      // accessor: "BRANCH",
      // name: "BRANCH",
      // label: "Branch",
      // placeholder: "Branch",
      // type: "text",
      // isDisabled: false,
      // gridconfig: { xs: 6, sm: 1 },
      accessor: "BRANCH",
      name: "BRANCH",
      defaultValue: "",
      isVisible: true,
      gridconfig: { xs: 6, sm: 2 },
      label: "Branch",
      autoComplete: "off",
      required: true,
      isDisabled: false,
      placeholder: "Select Branch",
      isColumnHidingDisabled: true,
      // entertoSubmit: true,
      type: "select",
      optiondata: GeneralAPI.getBranchCodeList,
      _optionsKey: "getBranchCodeList",
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "R" || value === "P") {
          return { isVisible: true };
        } else {
          return {
            isVisible: false,
          };
        }
      },
    },
    {
      // accessor: "ACOUNT_TYPE",
      // name: "ACCOUNT_TYPE",
      // label: "Account Type",
      // placeholder: "Account Type",
      // type: "text",
      // isDisabled: false,
      // gridconfig: { xs: 6, sm: 1 },
      accessor: "ACCOUNT_TYPE",
      name: "ACCOUNT_TYPE",
      defaultValue: "333 ",
      isVisible: true,
      gridconfig: { xs: 6, sm: 2 },
      label: "Account Type",
      autoComplete: "off",
      required: true,
      isDisabled: false,
      placeholder: "Select Account Type",
      isColumnHidingDisabled: true,
      // entertoSubmit: true,
      type: "select",
      optiondata: GeneralAPI.getAccountTypeList,
      _optionsKey: "getAccountTypeList",
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "R" || value === "P") {
          return { isVisible: true };
        } else {
          return {
            isVisible: false,
          };
        }
      },
    },
    {
      accessor: "ACCOUNT_NUMBER",
      name: "ACCOUNT_NUMBER",
      label: "Account Number",
      placeholder: "Account Number",
      type: "number",
      isDisabled: false,
      gridconfig: { xs: 6, sm: 2 },
      // entertoSubmit: false,
      tabToSubmit: true,
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "R" || value === "P") {
          return { isVisible: true };
        } else {
          return {
            isVisible: false,
          };
        }
      },
      // FormatProps: {
      //   thousandSeparator: true,
      //   thousandsGroupStyle: "lakh",
      //   allowNegative: false,
      //   allowLeadingZeros: false,
      //   decimalScale: 2,
      //   isAllowed: (values) => {
      //     if (values?.value?.length > 14) {
      //       return false;
      //     }
      //     if (values.floatValue === 0) {
      //       return false;
      //     }
      //     return true;
      //   },
      // },
    },
    {
      accessor: "SDC",
      name: "SDC",
      defaultValue: "BY CASH -",
      isVisible: true,
      gridconfig: { xs: 6, sm: 2 },
      label: "SDC",
      autoComplete: "off",
      placeholder: "Select SDC",
      isColumnHidingDisabled: false,
      // entertoSubmit: true,
      type: "select",
      isDisabled: false,
      optiondata: API.getSDCList,
      _optionsKey: "getSDCList",
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "R" || value === "P") {
          return { isVisible: true };
        } else {
          return {
            isVisible: false,
          };
        }
      },
      onBlurHandler: (columnValue, allField, flag) => {
        //@ts-ignore
        window._CHANGE_OPERATOR_TYPE(columnValue, "SDC");
      },
    },
    {
      accessor: "REMARK",
      name: "REMARK",
      label: "remark",
      defaultValue: "",
      placeholder: "Enter remark",
      type: "text",
      isDisabled: false,
      gridconfig: { xs: 6, sm: 2 },
      dependFields: ["SDC"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value) {
          return {
            label: "Default Remarkz",
            // gridconfig: { xs: 12, sm: 12 },
            // placeholder: "Placeholder Is Changed",
            value: value,
            defaultValue: value,
          };
        }
      },
      // dependFields: ["TRN"],
      // dependFieldsonchange: (colomnValue, value, name, extraData) => {
      //   if (value === "R" || value === "P") {
      //     return { isVisible: true };
      //   } else {
      //     return {
      //       isVisible: false,
      //     };
      //   }
      // },
    },
    {
      accessor: "RECEIPT_PAYMENT",
      name: "RECEIPT_PAYMENT",
      defaultValue: "",
      type: "currency",
      isVisible: true,
      gridconfig: { xs: 6, sm: 2 },
      defaultfocus: true,
      entertoSubmit: true,
      label: "Receipt Amount",
      required: false,
      autoComplete: "off",
      isDisabled: false,
      placeholder: "Please Enter Receipt Value",
      isColumnHidingDisabled: true,
      // entertoSubmit: true,
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "R") {
          return {
            label: "Receipt Amount",
            placeholder: "Please Enter Receipt Value",
            gridconfig: { xs: 6, sm: 2 },
            isVisible: true,
          };
        } else if (value === "P") {
          return {
            label: "Payment Amount",
            placeholder: "Please Enter Payment Value",
            gridconfig: { xs: 6, sm: 2 },
            isVisible: true,
          };
        } else if (value === "S") {
          return { isVisible: false };
        }
      },
      validate: (columnValue, allField, flag) => {
        if (flag === "FIRST") {
          if (!Boolean(columnValue)) {
            return "This field is required.";
          } else if (Boolean(parseFloat(columnValue) <= 0)) {
            return "Value must be greater then 0(zero).";
          }
          return "";
        }
      },
    },
    {
      accessor: "NAME",
      name: "NAME",
      label: "Name",
      placeholder: "Name",
      type: "text",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "R" || value === "P") {
          return { isVisible: true };
        } else {
          return {
            isVisible: false,
          };
        }
      },
    },
    {
      accessor: "BALANCE",
      name: "BALANCE",
      label: "Transaction Balance",
      placeholder: "Transaction Balance",
      type: "number",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
      dependFields: ["TRN"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "R" || value === "P") {
          return { isVisible: true };
        } else {
          return {
            isVisible: false,
          };
        }
      },
    },
  ],
};

export const denoViewTrnGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "View Transactions",
    rowIdColumn: "id",

    defaultColumnConfig: {
      width: 200,
      maxWidth: 300,
      minWidth: 200,
    },

    allowColumnReordering: false,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: false,
    containerHeight: {
      min: "420px",
      max: "420px",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hideFooter: true,
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr.No",
      sequence: 1,
      isAutoSequence: true,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      accessor: "Column1",
      columnName: "Column1",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 200,
      maxWidth: 350,
    },
    {
      accessor: "Column2",
      columnName: "Column2",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "Column3",
      columnName: "Column3",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
  ],
};

export const denoTableMetadata = {
  form: {
    name: "related_person_details_form",
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
          spacing: 3,
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
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      inputMask: {
        fullWidth: true,
      },
      datetimePicker: {
        fullWidth: true,
      },
      divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "DEC_DATE",
      label: "Single Denomination",
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "branchCode",
          },
          GridProps: {
            xs: 12,
            sm: 12,
            md: 3,
            lg: 2,
            xl: 2,
          },
        },
        {
          render: {
            componentType: "accountType",
          },
          GridProps: {
            xs: 12,
            sm: 12,
            md: 3,
            lg: 2,
            xl: 2,
          },
        },
        {
          render: {
            componentType: "accountCode",
          },
          // GridProps: {
          //   xs: 12,
          //   sm: 12,
          //   md: 3,
          //   lg: 1.5,
          //   xl: 1.5,
          // },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "TOKEN",
          label: "Token",
          placeholder: "Token",
          type: "text",
          GridProps: {
            xs: 12,
            sm: 12,
            md: 3,
            lg: 1.5,
            xl: 1.5,
          },
        },
        {
          render: {
            componentType: "select",
          },
          name: "SDC",
          label: "SDC",
          placeholder: "SDC",
          defaultValue: "CHGT",
          type: "select",
          options: API.getSDCList,
          _optionsKey: "getSDCList",
          GridProps: { xs: 12, sm: 12, md: 6, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "Remarks",
          label: "Remarks",
          placeholder: "Remarks",
          type: "text",
          GridProps: { xs: 12, sm: 12, md: 6, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQNO",
          label: "Chq.No",
          placeholder: "Chq.No",
          type: "number",
          GridProps: { xs: 12, sm: 12, md: 6, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "RECEIPT",
          label: "Receipt",
          placeholder: "Receipt",
          type: "number",
          GridProps: { xs: 12, sm: 12, md: 6, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PAYMENT",
          label: "Payment",
          placeholder: "Payment",
          type: "number",
          GridProps: { xs: 12, sm: 12, md: 6, lg: 3, xl: 3 },
        },
      ],
    },
  ],
};
