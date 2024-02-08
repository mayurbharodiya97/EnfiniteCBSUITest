import { GridMetaDataType } from "components/dataTableStatic";
import { components } from "components/report";
import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
export const TellerScreenMetadata: any = {
  form: {
    name: "TellerOperation",
    label: "Teller Transaction(Maker) - (ETRN/039)",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 4,
          md: 4,
        },
        container: {
          direction: "row",
          spacing: 2,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "select",
      },
      name: "TRN",
      label: "Transaction",
      placeholder: "Select Transaction",
      isFieldFocused: true,
      runPostValidationHookAlways: true,
      options: [
        { label: " Cash Receipt", value: "R" },
        { label: " Cash Payment", value: "P" },
        { label: " Single Denomination", value: "S" },
      ],
      postValidationSetCrossFieldValues: (
        currentField,
        formState,
        authState,
        dependentFieldValue,
        reqFlag
      ) => {
        formState.setDataOnFieldChange("TRN", currentField);
        if (currentField?.value) {
          const sdcValue = currentField?.value === "R" ? "1   " : "4   ";
          return {
            ACCT_CD: { value: "" },
            SDC: { value: sdcValue },
            RECEIPT: { value: "" },
            PAYMENT: { value: "" },
            ACCT_NM: { value: "" },
            BALANCE: { value: "" },
          };
        }
      },
      defaultValue: "R",
      _optionsKey: "defaultOption",
      GridProps: {
        xs: 6,
        sm: 3,
        md: 2,
        lg: 2,
        xl: 2,
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        name: "BRANCH_CD",
        dependentFields: ["TRN"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: (
          currentField,
          formState,
          authState,
          dependentFieldValue,
          reqFlag
        ) => {
          formState.setDataOnFieldChange("BRANCH_CD", currentField);
          if (currentField?.value) {
            const sdcVal = Boolean(dependentFieldValue?.TRN === "R")
              ? "1   "
              : "4   ";
            return {
              ACCT_CD: { value: "" },
              RECEIPT: { value: "" },
              PAYMENT: { value: "" },
              ACCT_NM: { value: "" },
              BALANCE: { value: "" },
            };
          }
        },
        GridProps: {
          xs: 6,
          sm: 3,
          md: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        dependentFields: ["TRN"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues,
          reqFlag
        ) => {
          formState.setDataOnFieldChange("ACCT_TYPE", currentField);
          if (currentField?.value) {
            return {
              ACCT_CD: { value: "" },
              RECEIPT: { value: "" },
              PAYMENT: { value: "" },
              ACCT_NM: { value: "" },
              BALANCE: { value: "" },
            };
          }
        },
        GridProps: {
          xs: 6,
          sm: 3,
          md: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        // setValueOnDependentFieldsChange: (dependentFields, others) => {
        //   if (!others.isSubmitting) {
        //     return "";
        //   }
        // },
        GridProps: {
          xs: 6,
          sm: 3,
          md: 2,
          lg: 2,
          xl: 2,
        },
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentFieldValues
        ) => {
          let paddedAcctcode = (field?.value).padStart(
            dependentFieldValues?.ACCT_TYPE?.optionData?.[0]?.PADDING_NUMBER,
            0
          );
          let reqParameters = {
            BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
            COMP_CD: authState?.companyID,
            ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value,
            ACCT_CD: paddedAcctcode,
            SCREEN_REF: "ETRN/039",
          };
          let postData;
          if (
            Boolean(
              field?.value &&
                dependentFieldValues?.BRANCH_CD?.value &&
                dependentFieldValues?.ACCT_TYPE?.value
            )
          ) {
            postData = await GeneralAPI.getAccNoValidation(reqParameters);
          }
          console.log(postData, "postMassage");
          formState.setDataOnFieldChange(
            "ACCT_CD",
            paddedAcctcode,
            dependentFieldValues,
            postData
          );
          return {
            ACCT_CD: { value: paddedAcctcode ?? "", ignoreUpdate: true },
          };
        },
      },
      fullAccountNumberMetadata: {
        GridProps: {
          xs: 9,
          md: 9,
          sm: 9,
          lg: 9,
          xl: 9,
        },
      },
      // acctFieldPara: "1",
      // postValidationSetCrossFieldValues: () =>
      //   getRetrieveData({
      //     COMP_CD: "132 ",
      //     SELECT_COLUMN: { CUSTOMER_ID: "2" },
      //   }),
      // acctTypeCustomAPI: () => getpMiscData("CKYC_ACCT_TYPE"),
      // branchCodeCustomAPI: () =>
      //   getCIFCategories({
      //     COMP_CD: "132 ",
      //     BRANCH_CD: "099 ",
      //     ENTITY_TYPE: "I",
      //   }),
    },
    {
      render: {
        componentType: "select",
      },
      name: "SDC",
      label: "SDC",
      placeholder: "Select SDC",
      defaultValue: "1   ",
      options: API.getSDCList,
      _optionsKey: "getSDCList",
      GridProps: {
        xs: 6,
        md: 1,
        sm: 4,
        lg: 1,
        xl: 1,
      },
      dependentFields: ["TRN"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRN?.value === "R" ||
          dependentFieldsValues?.TRN?.value === "P"
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARK",
      label: "Remark",
      defaultValue: "BY NANDU --",
      placeholder: "Enter Remark",
      GridProps: {
        xs: 6,
        md: 2,
        sm: 4,
        lg: 2,
        xl: 2,
      },
      dependentFields: ["TRN", "BRANCH_CD", "ACCT_TYPE", "SDC"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRN?.value === "R" ||
          dependentFieldsValues?.TRN?.value === "P"
        ) {
          return false;
        } else {
          return true;
        }
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields?.SDC?.optionData?.[0]?.DISLAY_STANDARD) {
          const RMARK = dependentFields?.SDC?.optionData?.[0]?.DISLAY_STANDARD;
          return RMARK;
        }
        return "";
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "RECEIPT",
      label: "Receipt Amount",
      placeholder: "Enter Receipt",
      GridProps: {
        xs: 6,
        md: 2,
        sm: 4,
        lg: 2,
        xl: 2,
      },
      dependentFields: ["TRN", "BRANCH_CD", "ACCT_TYPE"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRN?.value === "R") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: (field, formState, ...oters) => {
        formState.setDataOnFieldChange("RECEIPT", field);
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "PAYMENT",
      label: "Payment Amount",
      placeholder: "Enter Payment",
      GridProps: {
        xs: 6,
        md: 3,
        sm: 4,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["TRN"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRN?.value === "P") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: (field, formState, ...oters) => {
        formState.setDataOnFieldChange("PAYMENT", field);
      },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "ACCT_NM",
    //   label: "Name",
    //   placeholder: "Enter Name",
    //   GridProps: {
    //     xs: 6,
    //     md: 6,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    //   isReadOnly: true,
    //   dependentFields: ["TRN"],
    //   shouldExclude(fieldData, dependentFieldsValues, formState) {
    //     if (
    //       dependentFieldsValues?.TRN?.value === "R" ||
    //       dependentFieldsValues?.TRN?.value === "P"
    //     ) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   // setValueOnDependentFieldsChange: (dependentFields) => {
    //   //   return "";
    //   // },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "BALANCE",
    //   label: "Balance",
    //   placeholder: "Enter Balance",
    //   GridProps: {
    //     xs: 6,
    //     md: 6,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    //   isReadOnly: true,
    //   dependentFields: ["TRN"],
    //   shouldExclude(fieldData, dependentFieldsValues, formState) {
    //     if (
    //       dependentFieldsValues?.TRN?.value === "R" ||
    //       dependentFieldsValues?.TRN?.value === "P"
    //     ) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   // setValueOnDependentFieldsChange: (dependentFields) => {
    //   //   return "";
    //   // },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "LIMIT",
    //   label: "Transaction Limit",
    //   placeholder: "Enter Transaction Limit",
    //   GridProps: {
    //     xs: 6,
    //     md: 6,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    //   defaultValue: "20000",
    //   isReadOnly: true,
    //   dependentFields: ["TRN"],
    //   shouldExclude(fieldData, dependentFieldsValues, formState) {
    //     if (
    //       dependentFieldsValues?.TRN?.value === "R" ||
    //       dependentFieldsValues?.TRN?.value === "P"
    //     ) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    // },
  ],
};
// export const denoViewTrnGridMetaData: GridMetaDataType = {
//   gridConfig: {
//     dense: true,
//     gridLabel: "View Transactions",
//     rowIdColumn: "id",

//     defaultColumnConfig: {
//       width: 200,
//       maxWidth: 300,
//       minWidth: 200,
//     },

//     allowColumnReordering: false,
//     disableSorting: false,
//     hideHeader: false,
//     disableGroupBy: true,
//     enablePagination: false,
//     containerHeight: {
//       min: "420px",
//       max: "420px",
//     },
//     allowFilter: false,
//     allowColumnHiding: false,
//     allowRowSelection: false,
//     isCusrsorFocused: true,
//     hideFooter: true,
//   },
//   columns: [
//     {
//       accessor: "SR_NO",
//       columnName: "Sr.No",
//       sequence: 1,
//       isAutoSequence: true,
//       alignment: "left",
//       componentType: "default",
//       width: 100,
//       minWidth: 100,
//       maxWidth: 100,
//     },
//     {
//       accessor: "Column1",
//       columnName: "Column1",
//       sequence: 2,
//       alignment: "left",
//       componentType: "default",
//       width: 300,
//       minWidth: 200,
//       maxWidth: 350,
//     },
//     {
//       accessor: "Column2",
//       columnName: "Column2",
//       sequence: 3,
//       alignment: "left",
//       componentType: "default",
//       width: 90,
//       minWidth: 100,
//       maxWidth: 200,
//     },
//     {
//       accessor: "Column3",
//       columnName: "Column3",
//       sequence: 4,
//       alignment: "left",
//       componentType: "default",
//       width: 180,
//       minWidth: 180,
//       maxWidth: 180,
//     },
//   ],
// };

export const cashReportMetaData = {
  title: "View Transactions",
  disableGroupBy: "",
  hideFooter: false,
  hideAmountIn: true,
  retrievalType: "",
  groupBy: [""],
  columns: [
    // {
    //   accessor: "sr_no",
    //   columnName: "SrNo",
    //   sequence: 1,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 65,
    //   minWidth: 65,
    //   maxWidth: 130,
    //   isAutoSequence: true,
    // },
    {
      accessor: "BRANCH_CD",
      columnName: "BrCode",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 45,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AcctType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 50,
      maxWidth: 240,
    },
    {
      accessor: "ACCT_CD",
      columnName: "ACNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 40,
      maxWidth: 200,
    },
    {
      accessor: "TRAN_DT",
      columnName: "TrnDate",
      sequence: 5,
      alignment: "left",
      Cell: components.DateCell,
      // dateFormat: "dd/MM/yyyy",
      format: "dd/MM/yyyy",
      width: 120,
      minWidth: 60,
      maxWidth: 260,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Chequeno",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 90,
      maxWidth: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      accessor: "DEBIT",
      columnName: "DebitAmount",
      sequence: 5,
      alignment: "right",
      Cell: components.NumberCell,
      width: 140,
      minWidth: 60,
      maxWidth: 220,
      color: "red",
      // currencyRefColumn: "CURR_CD",
      // symbolPosi: "end",
    },
    {
      accessor: "CREDIT",
      columnName: "CreditAmount",
      sequence: 5,
      alignment: "right",
      Cell: components.NumberCell,
      width: 140,
      minWidth: 60,
      maxWidth: 240,
      color: "green",
      // currencyRefColumn: "CURR_CD",
      // isCurrencyCode: true,
      // symbolPosi: "end",
    },
    {
      accessor: "TRAN_CD",
      columnName: "Vno",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 220,
    },
    {
      accessor: "CONFIRMED",
      columnName: "Status",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 110,
      maxWidth: 220,
    },
    {
      accessor: "SCROLL1",
      columnName: "Scroll",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 110,
      maxWidth: 220,
    },
    {
      accessor: "SDC",
      columnName: "SDC",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 220,
    },
    {
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 130,
      maxWidth: 220,
    },
    {
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 130,
      maxWidth: 220,
    },
  ],
};
