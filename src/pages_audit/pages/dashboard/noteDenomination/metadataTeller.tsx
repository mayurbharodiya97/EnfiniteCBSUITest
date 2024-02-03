import { GridMetaDataType } from "components/dataTableStatic";
import * as API from "./api";
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
          return {
            ACCT_CD: { value: "" },
            SDC: { value: "BY CASH -" },
            REMARK: { value: "BY NANDU --" },
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
        md: 6,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        name: "BRANCH_CD",
        postValidationSetCrossFieldValues: (
          currentField,
          formState,
          authState,
          dependentFieldValue,
          reqFlag
        ) => {
          if (currentField?.value) {
            return {
              ACCT_CD: { value: "" },
              SDC: { value: "BY CASH -" },
              REMARK: { value: "BY NANDU --" },
              RECEIPT: { value: "" },
              PAYMENT: { value: "" },
              ACCT_NM: { value: "" },
              BALANCE: { value: "" },
            };
          }
        },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        postValidationSetCrossFieldValues: (
          currentField,
          formState,
          authState,
          dependentFieldValue,
          reqFlag
        ) => {
          if (currentField?.value) {
            return {
              ACCT_CD: { value: "" },
              SDC: { value: "BY CASH -" },
              REMARK: { value: "BY NANDU --" },
              RECEIPT: { value: "" },
              PAYMENT: { value: "" },
              ACCT_NM: { value: "" },
              BALANCE: { value: "" },
            };
          }
        },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        // setValueOnDependentFieldsChange: (dependentFields, others) => {
        //   if (!others.isSubmitting) {
        //     return "";
        //   }
        // },
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
      defaultValue: "BY CASH -",
      options: API.getSDCList,
      _optionsKey: "getSDCList",
      GridProps: {
        xs: 6,
        md: 6,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["TRN", "BRANCH_CD", "ACCT_TYPE"],
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
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
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
        md: 6,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["TRN", "BRANCH_CD", "ACCT_TYPE"],
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
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
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
        md: 6,
        sm: 3,
        lg: 3,
        xl: 3,
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
        md: 6,
        sm: 3,
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
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Name",
      placeholder: "Enter Name",
      GridProps: {
        xs: 6,
        md: 6,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      isReadOnly: true,
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
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "BALANCE",
      label: "Balance",
      placeholder: "Enter Balance",
      GridProps: {
        xs: 6,
        md: 6,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      isReadOnly: true,
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
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
    },
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
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 200,
      maxWidth: 350,
    },
    {
      accessor: "Column2",
      columnName: "Column2",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "Column3",
      columnName: "Column3",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
  ],
};
