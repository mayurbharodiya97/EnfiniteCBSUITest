import { GridMetaDataType } from "@acuteinfo/common-base";

import { GeneralAPI } from "registry/fns/functions";

export const standingInsructionGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "65vh",
      max: "65vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "COMM_TYPE_DESC",
      columnName: "CommisionType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 200,
      maxWidth: 300,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Decscription",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "NO_OF_RECORD",
      columnName: "NoofRecords",
      sequence: 5,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      columnName: "",
      componentType: "default",
      isVisible: false,
      accessor: "TRAN_CD",
      sequence: 6,
      width: 160,
      minWidth: 160,
      maxWidth: 200,
    },
    {
      columnName: "",
      componentType: "default",
      isVisible: false,
      accessor: "DEF_TRAN_CD",
      sequence: 6,
      width: 160,
      minWidth: 160,
      maxWidth: 200,
    },
  ],
};

export const standingInsructionViewGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "LINE_ID",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "30vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "CR_BRANCH_CD",
      columnName: "CreditBranchCode",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_ACCT_TYPE",
      columnName: "CreditAcctType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_ACCT_CD",
      columnName: "Credit A/c No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "CreditPhotoSign",
      accessor: "credit",
      width: 180,
      sequence: 4,
      alignment: "center",
      isVisible: true,
    },
    {
      accessor: "START_DT",
      columnName: "StartDate",
      sequence: 5,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "EXECUTE_DAY",
      columnName: "ExecuteOnDay",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "FEQ_TYPE",
      columnName: "FrequncyType",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "FEQ_VALUE",
      columnName: "FrequencyValue",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "DebitBranchCode",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DR_ACCT_TYPE",
      columnName: "DebitAcctType",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DR_ACCT_CD",
      columnName: "DebitAcctNo",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "DebitPhotoSign",
      accessor: "debit",
      width: 180,
      sequence: 12,
      alignment: "center",
      isVisible: true,
    },
    {
      accessor: "SI_AMOUNT",
      columnName: "SIAmount",
      sequence: 13,
      componentType: "currency",
      alignment: "right",
      width: 150,
      minWidth: 50,
      maxWidth: 170,
      isDisplayTotal: true,
    },
    {
      accessor: "SI_CHARGE",
      columnName: "SICharge",
      sequence: 14,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remark",
      sequence: 15,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 350,
    },
    {
      accessor: "VALID_UPTO",
      columnName: "ValidUpTo",
      sequence: 16,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "SI_COUNT",
      columnName: "",
      sequence: 17,
      alignment: "left",
      isVisible: false,
      componentType: "default",
      isReadOnly: true,
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DOC_STATUS",
      columnName: "Status",
      sequence: 18,
      alignment: "left",
      componentType: "editableCheckbox",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
      isVisible: true,
      isReadOnly: true,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.SI_COUNT > 0) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      accessor: "SI_NUMBER",
      columnName: "SINumber",
      sequence: 19,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_ACCT_NM",
      columnName: "CreditAcctName",
      sequence: 20,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 50,
      maxWidth: 350,
    },
    {
      accessor: "DR_ACCT_NM",
      columnName: "DebitAcctName",
      sequence: 21,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 50,
      maxWidth: 350,
    },

    {
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "...",
      accessor: "edit",
      width: 80,
      sequence: 22,
      alignment: "center",
      isVisible: true,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "Delete",
      accessor: "delete",
      width: 80,
      sequence: 23,
      alignment: "center",
      isVisible: true,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.SI_COUNT <= 0) {
          return false;
        } else {
          return true;
        }
      },
    },
  ],
};

export const siasExecutedGridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SUB_LINE_ID",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "40vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "EXECUTE_DT",
      columnName: "ExecuteDate",
      sequence: 1,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_BRANCH_CD",
      columnName: "CreditBranchCode",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_ACCT_TYPE",
      columnName: "CreditAcctType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_ACCT_CD",
      columnName: "CreditAcctNo",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "SI_AMOUNT",
      columnName: "Amount",
      sequence: 3,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 50,
      maxWidth: 170,
    },
    {
      accessor: "SI_EXECUTE_FLG",
      columnName: "Processed",
      sequence: 4,
      alignment: "left",
      componentType: "editableSelect",
      options: () => [
        { label: "Consider As Executed", value: "C" },
        { label: "N", value: "N" },
      ],
      _optionsKey: "considerAsExecuted",
      defaultOptionLabel: "",
      defaultValue: "N",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "REASON",
      columnName: "Reason",
      sequence: 5,
      alignment: "left",
      componentType: "editableTextField",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
  ],
};

export const searchButttonGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "SearchSI",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
    footerNote: "ColorandSi",
  },
  columns: [
    {
      accessor: "DEBIT_ACCOUNT",
      columnName: "Debit From A/C",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "DR_ACCT_NM",
      columnName: "Debit A/C Name",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 50,
      maxWidth: 350,
    },
    {
      accessor: "START_DT",
      columnName: "StartDate",
      sequence: 3,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "EXECUTE_DAY",
      columnName: "ExecuteOnDay",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "FEQ_TYPE",
      columnName: "FrequncyType",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "FEQ_VALUE",
      columnName: "FrequencyValue",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CREDIT_ACCOUNT",
      columnName: "CreditFromAcct",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CR_ACCT_NM",
      columnName: "CreditAcctName",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 50,
      maxWidth: 350,
    },
    {
      accessor: "SI_AMOUNT",
      columnName: "SIAmount",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 50,
      maxWidth: 170,
    },
    {
      accessor: "SI_CHARGE",
      columnName: "SICharge",
      sequence: 10,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remark",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 350,
    },
    {
      accessor: "VALID_UPTO",
      columnName: "ValidUpTo",
      sequence: 12,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DOC_STATUS",
      columnName: "Status",
      sequence: 13,
      alignment: "left",
      componentType: "editableCheckbox",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
      isReadOnly: true,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.SI_COUNT > 0) {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "Delete",
      accessor: "delete",
      width: 80,
      sequence: 14,
      alignment: "center",
      isVisible: true,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.SI_COUNT <= 0) {
          return false;
        } else {
          return true;
        }
      },
    },
  ],
};

export const siExecuteDetailViewGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "SI Execute Detail View",
    rowIdColumn: "SUB_LINE_ID",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    footerNote: "DeletetheTransaction",
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "70vh",
      max: "70vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "Sr No.",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      isAutoSequence: true,
      width: 50,
      minWidth: 40,
      maxWidth: 100,
    },
    {
      accessor: "EXECUTE_DT",
      columnName: "ExecuteDate",
      sequence: 2,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "PROCESS_DT",
      columnName: "ProcessDate",
      sequence: 3,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "SI_EXECUTE_FLG_DIS",
      columnName: "SIExecuteProcess",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "REASON",
      columnName: "Reason",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "DebitBranchCode",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DR_ACCT_TYPE",
      columnName: "DebitAcctType",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DR_ACCT_CD",
      columnName: "DebitAcctNo",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_BRANCH_CD",
      columnName: "CreditBranchCode",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CR_ACCT_TYPE",
      columnName: "CreditAcctType",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 350,
    },
    {
      accessor: "CR_ACCT_CD",
      columnName: "CreditAcctNo",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 350,
    },
    {
      accessor: "SI_AMOUNT",
      columnName: "SIAmount",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 50,
      maxWidth: 170,
      isDisplayTotal: true,
    },
    {
      accessor: "SI_CHARGE",
      columnName: "SICharge",
      sequence: 10,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
      isDisplayTotal: true,
    },
    {
      accessor: "REMARKS",
      columnName: "Remark",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 350,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "AuditTrail",
      accessor: "_hidden2",
      width: 140,
      sequence: 14,
      alignment: "center",
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.AUDIT_CNT > 0) {
          return false;
        } else {
          return true;
        }
      },
    },
  ],
};

export const AuditgridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "SI Execute Detail View",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableGlobalFilter: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "70vh",
      max: "70vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "Sr No.",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      isAutoSequence: true,
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "ACTIVITY_TIME",
      columnName: "ActivityTime",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "COLUMN_LABEL",
      columnName: "ColumnName",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "OLD_VALUE",
      columnName: "OldValue",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "NEW_VALUE",
      columnName: "NewValue",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 250,
    },
  ],
};

export const populateGridData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SUB_LINE_ID",
    defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
    allowColumnReordering: true,
    hideHeader: true,
    disableGroupBy: true,
    // enablePagination: true,
    containerHeight: { min: "25vh", max: "25vh" },
    allowRowSelection: false,
    hiddenFlag: "_hidden",
    disableLoader: true,
    paginationText: "Records found",
  },
  columns: [
    {
      accessor: "Sr No.",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      isAutoSequence: true,
      width: 50,
      minWidth: 40,
      maxWidth: 100,
    },
    {
      accessor: "EXECUTE_DT",
      columnName: "ExecuteDate",
      sequence: 2,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "PROCESS_DT",
      columnName: "ProcessDate",
      sequence: 3,
      alignment: "left",
      componentType: "date",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "SI_EXECUTE_FLG_DIS",
      columnName: "SIExecuteProcess",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "REASON",
      columnName: "Reason",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "DebitBranchCode",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DR_ACCT_TYPE",
      columnName: "DebitAcctType",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "DR_ACCT_CD",
      columnName: "DebitAcctNo",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "CR_BRANCH_CD",
      columnName: "CreditBranchCode",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CR_ACCT_TYPE",
      columnName: "CreditAcctType",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 350,
    },
    {
      accessor: "CR_ACCT_CD",
      columnName: "CreditAcctNo",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 350,
    },
    {
      accessor: "SI_AMOUNT",
      columnName: "SIAmount",
      sequence: 12,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 50,
      maxWidth: 170,
    },
    {
      accessor: "SI_CHARGE",
      columnName: "SICharge",
      sequence: 13,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remark",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 350,
    },
  ],
};

// export const editDataMasterMetaData: MasterDetailsMetaData = {
//   masterForm: {
//     form: {
//       name: "Si Detail View",
//       label: "SI Execute Detail View",
//       resetFieldOnUnmount: false,
//       validationRun: "onBlur",
//       render: {
//         ordering: "auto",
//         renderType: "simple",
//         gridConfig: {
//           item: {
//             xs: 12,
//             sm: 4,
//             md: 4,
//           },
//           container: {
//             direction: "row",
//             spacing: 1,
//           },
//         },
//       },
//     },
//     fields: [
//       {
//         render: {
//           componentType: "datePicker",
//         },
//         name: "EXECUTE_DT",
//         label: "Execute Date",
//         type: "text",
//         isReadOnly:true,
//         fullWidth: true,
//         GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2},
//       },
//       {
//         render: {
//           componentType: "datePicker",
//         },
//         name: "PROCESS_DT",
//         label: "Process Date",
//         type: "text",
//         fullWidth: true,
//         isReadOnly:true,
//         GridProps: {  xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "SI_EXECUTE_FLG_DIS",
//         label: "SI Execute Process",
//         type: "text",
//         fullWidth: true,
//         isReadOnly:true,
//         GridProps: { xs: 6, sm: 6,md: 2, lg: 2, xl: 2},
//       },
//       {
//         render: {
//           componentType: "hidden",
//         },
//         name: "SI_EXECUTE_FLG",
//         label: "SI Execute FLAG"
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "REASON",
//         label: "Reason",
//         type: "text",
//         fullWidth: true,
//         isReadOnly:true,
//         GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
//       },
//       {
//         render: {

//           componentType: "_accountNumber" },
//           name:"data",
//         branchCodeMetadata: {
//           label: "Debit Branch Code",
//           name: "BRANCH_CD",
//           __VIEW__: { isReadOnly: true },
//           GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl: 3},
//         },
//         accountTypeMetadata: {
//           label: "Debit Account Type",
//           name: "DR_ACCT_TYPE",
//           options: (dependentValue, formState, _, authState) => {
//             return GeneralAPI.get_Account_Type({
//               COMP_CD: authState?.companyID,
//               BRANCH_CD: authState?.user?.branchCode,
//               USER_NAME: authState?.user?.id,
//               DOC_CD: "SIDRTYPE",
//             });

//           },
//           _optionsKey: "debit_acct_type",
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//         },
//         accountCodeMetadata: {
//           label: "Debit Account No.",
//           name: "DR_ACCT_CD",
//           autoComplete: "off",
//           maxLength: 20,
//           dependentFields: ["DR_ACCT_TYPE", "BRANCH_CD", "CR_ACCT_CD", "CR_ACCT_TYPE", "CR_BRANCH_CD", "ENT_BRANCH_CD", "ENT_COMP_CD"],
//           postValidationSetCrossFieldValues: async (
//             currentField,
//             formState,
//             authState,
//             dependentFieldValues
//           ) => {
//             if (formState?.isSubmitting) return {};

//             const reqParameters = {
//               BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
//               COMP_CD: authState?.companyID,
//               ACCT_TYPE: dependentFieldValues?.DR_ACCT_TYPE?.value,
//               ACCT_CD: utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.DR_ACCT_TYPE?.optionData
//               ),
//               SCREEN_REF: "TRN/394",
//             };

//             if (

//               dependentFieldValues?.BRANCH_CD?.value &&
//               dependentFieldValues?.DR_ACCT_TYPE?.value
//             ) {
//               const postData = await GeneralAPI.getAccNoValidation(reqParameters);

//               let btn99, returnVal;

//               const getButtonName = async (obj) => {
//                 let btnName = await formState.MessageBox(obj);
//                 return { btnName, obj };
//               };

//               for (let i = 0; i < postData.MSG.length; i++) {

//                 if (postData.MSG[i]?.O_STATUS === "999") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "ValidationFailed",
//                     message: postData.MSG[i]?.O_MESSAGE,
//                   });
//                   returnVal = "";
//                 } else if (postData.MSG[i]?.O_STATUS === "99") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "Confirmation",
//                     message: postData[i]?.O_MESSAGE,
//                     buttonNames: ["Yes", "No"],
//                   });
//                   btn99 = btnName;
//                   if (btnName === "No") {
//                     returnVal = "";
//                   }
//                 } else if (postData.MSG[i]?.O_STATUS === "9") {
//                   if (btn99 !== "No") {
//                     const { btnName, obj } = await getButtonName({
//                       messageTitle: "Alert",
//                       message: postData.MSG[i]?.O_MESSAGE,
//                     });
//                   }
//                   returnVal = postData[i];
//                 } else if (postData.MSG[i]?.O_STATUS === "0") {
//                   if (btn99 !== "No") {
//                     returnVal = postData[i];
//                   } else {
//                     returnVal = "";
//                   }
//                 }
//               }
//               btn99 = 0;

//               if (dependentFieldValues?.["CR_ACCT_CD"]?.value === utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.DR_ACCT_CD?.optionData
//               )
//               ) {
//                 await formState.MessageBox({
//                   messageTitle: "ValidationFailed",
//                   message: "Please enter another A/C No",
//                   buttonNames: ["OK"],
//                 });
//                 return {
//                   DR_ACCT_CD: { value: "" },
//                 };
//               }
//               return {
//                 DR_ACCT_CD:
//                   postData[0] !== ""
//                     ? {
//                       value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
//                       ignoreUpdate: true,
//                       isFieldFocused: false,
//                     }
//                     : {
//                       value: "",
//                       isFieldFocused: true,
//                       ignoreUpdate: true,
//                     },
//               };
//             }
//           },

//           // runPostValidationHookAlways: true,
//           FormatProps: {
//             isAllowed: (values) => {
//               //@ts-ignore
//               if (values?.value?.length > 20) {
//                 return false;
//               }
//               return true;
//             },
//           },
//           fullWidth: true,
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 2, xl: 2 },
//         },

//       },
//       {
//         render: { componentType: "_accountNumber" },
//         name:"data",
//         branchCodeMetadata: {
//           label: "Credit Branch Code",
//           name: "CR_BRANCH_CD",
//           isReadOnly:true,
//           __EDIT__: { isReadOnly: true },
//           GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl: 3 },
//         },
//         accountTypeMetadata: {
//           label: "Credit Account Type",
//           isReadOnly:true,
//           name: "CR_ACCT_TYPE",
//           options: (dependentValue, formState, _, authState) => {
//             return GeneralAPI.get_Account_Type({
//               COMP_CD: authState?.companyID,
//               BRANCH_CD: authState?.user?.branchCode,
//               USER_NAME: authState?.user?.id,
//               DOC_CD: "SICRTYPE",
//             });

//           },
//           _optionsKey: "credit_acct_type",
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//         },
//         accountCodeMetadata: {
//           label: "Credit Account No.",
//           name: "CR_ACCT_CD",
//           autoComplete: "off",
//           maxLength: 20,
//           isReadOnly:true,
//           dependentFields: ["ENT_BRANCH_CD", "ENT_COMP_CD", "CR_ACCT_CD", "CR_ACCT_TYPE", "CR_BRANCH_CD"],
//           postValidationSetCrossFieldValues: async (
//             currentField,
//             formState,
//             authState,
//             dependentFieldValues
//           ) => {
//             if (formState?.isSubmitting) return {};

//             const reqParameters = {
//               BRANCH_CD: dependentFieldValues?.CR_BRANCH_CD?.value,
//               COMP_CD: authState?.companyID,
//               ACCT_TYPE: dependentFieldValues?.CR_ACCT_TYPE?.value,
//               ACCT_CD: utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.CR_ACCT_TYPE?.optionData
//               ),
//               SCREEN_REF: "TRN/394",
//             };

//             if (

//               dependentFieldValues?.CR_BRANCH_CD?.value &&
//               dependentFieldValues?.CR_ACCT_TYPE?.value
//             ) {
//               const postData = await GeneralAPI.getAccNoValidation(reqParameters);

//               let btn99, returnVal;

//               const getButtonName = async (obj) => {
//                 let btnName = await formState.MessageBox(obj);
//                 return { btnName, obj };
//               };

//               for (let i = 0; i < postData.MSG.length; i++) {

//                 if (postData.MSG[i]?.O_STATUS === "999") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "ValidationFailed",
//                     message: postData.MSG[i]?.O_MESSAGE,
//                   });
//                   returnVal = "";
//                 } else if (postData.MSG[i]?.O_STATUS === "99") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "Confirmation",
//                     message: postData[i]?.O_MESSAGE,
//                     buttonNames: ["Yes", "No"],
//                   });
//                   btn99 = btnName;
//                   if (btnName === "No") {
//                     returnVal = "";
//                   }
//                 } else if (postData.MSG[i]?.O_STATUS === "9") {
//                   if (btn99 !== "No") {
//                     const { btnName, obj } = await getButtonName({
//                       messageTitle: "Alert",
//                       message: postData.MSG[i]?.O_MESSAGE,
//                     });
//                   }
//                   returnVal = postData[i];
//                 } else if (postData.MSG[i]?.O_STATUS === "0") {
//                   if (btn99 !== "No") {
//                     returnVal = postData[i];
//                   } else {
//                     returnVal = "";
//                   }
//                 }
//               }
//               btn99 = 0;

//               if (dependentFieldValues?.["DR_ACCT_CD"]?.value === utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.CR_ACCT_CD?.optionData
//               )
//               ) {
//                 const btnname = await formState.MessageBox({
//                   messageTitle: "ValidationFailed",
//                   message: "Please enter another A/C No",
//                   buttonNames: ["OK"],
//                 });
//                 return {
//                   CR_ACCT_CD: { value: "" },
//                 };

//               }
//               // alert end

//               return {
//                 CR_ACCT_CD:
//                   postData[0] !== ""
//                     ? {
//                       value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
//                       ignoreUpdate: true,
//                       isFieldFocused: false,
//                     }
//                     : {
//                       value: "",
//                       isFieldFocused: true,
//                       ignoreUpdate: true,
//                     },
//               };
//             }
//           },

//           // runPostValidationHookAlways: true,
//           FormatProps: {
//             isAllowed: (values) => {
//               //@ts-ignore
//               if (values?.value?.length > 20) {
//                 return false;
//               }
//               return true;
//             },
//           },
//           fullWidth: true,
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//         },

//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "SI_AMOUNT",
//         label: "SI Amount",
//         placeholder: "",
//         type: "text",
//         dependentFields: ["DR_ACCT_TYPE", "DR_ACCT_CD", "DEF_TRAN_CD", "BRANCH_CD", "COMP_CD"],
//         fullWidth:true,
//         FormatProps: {
//           allowNegative: false,
//         },
//         // postValidationSetCrossFieldValues: async (
//         //   currentField,
//         //   formState,
//         //   authState,
//         //   dependentFieldValues
//         // ) => {
//         //   if (formState?.isSubmitting) return {};

//         //   const reqParameters = {
//         //     COMP_CD: dependentFieldValues?.["COMP_CD"]?.value,
//         //     BRANCH_CD: dependentFieldValues?.["BRANCH_CD"]?.value,
//         //     ACCT_TYPE: dependentFieldValues?.["DR_ACCT_TYPE"]?.value,
//         //     ACCT_CD: dependentFieldValues?.["DR_ACCT_CD"]?.value,
//         //     AMOUNT: currentField?.value,
//         //     DEF_TRAN_CD: dependentFieldValues?.["DEF_TRAN_CD"]?.value,
//         //     DOC_CD: "TRN/394",
//         //   };
//         //   const postData = await API.getSiCharge(reqParameters);
//         //   return {

//         //     SI_CHARGE: {
//         //       value:postData
//         //           ? postData[0]?.SI_CHARGE ?? ""
//         //           : "",
//         //       ignoreUpdate: true,
//         //     },
//         //   };

//         // },
//         required: true,
//         GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl:3 },
//         schemaValidation: {
//           type: "string",
//           rules: [{ name: "required", params: ["SI Amount is Required"] }],
//         },

//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "SI_CHARGE",
//         label: "SI Charge",
//         type: "text",
//         fullWidth: true,
//         GridProps: {xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "REMARKS",
//         label: "Remark",
//         fullWidth:true,
//         placeholder: "",
//         type: "text",
//         GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//       },
//       {
//         render: {
//           componentType: "formbutton"
//         },
//         name: "populate",
//         label: "Populate",
//         placeholder: "",
//         GridProps: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1,},
//         dependentFields: ["SI_EXECUTE_FLG"],
//         shouldExclude(fieldData, dependentFields, formState) {
//           if (dependentFields?.SI_EXECUTE_FLG?.value === "N") {
//             return false;
//           } else {
//             return true;
//           }
//         },
//       },
//       {
//         render: {
//           componentType: "hidden",
//         },
//         name: "DEF_TRAN_CD",
//         label:"HIDDEN FLAG"
//       },

//     ],
//   },
//   detailsGrid: {
//     gridConfig: {
//       dense: true,
//       gridLabel: "SI Execute Detail View",
//       rowIdColumn: "SUB_LINE_ID",
//       defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
//       allowColumnReordering: true,
//       hideHeader: true,
//       disableGroupBy: true,
//       // enablePagination: true,
//       containerHeight: { min: "30vh", max: "30vh" },
//       allowRowSelection: false,
//       hiddenFlag: "_hidden",
//       disableLoader: true,
//       paginationText: "Records found",
//     },
//     columns: [
//       {
//         accessor: "Sr No.",
//         columnName: "Sr No.",
//         sequence: 1,
//         alignment: "left",
//         componentType: "default",
//         isAutoSequence: true,
//         width: 50,
//         minWidth: 40,
//         maxWidth: 100,
//       },
//       {
//         accessor: "EXECUTE_DT",
//         columnName: "Execute Date",
//         sequence: 2,
//         alignment: "left",
//         componentType: "date",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       },
//       {
//         accessor: "PROCESS_DT",
//         columnName: "Process Date",
//         sequence: 3,
//         alignment: "left",
//         componentType: "date",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       },
//       {
//         accessor: "SI_EXECUTE_FLG_DIS",
//         columnName: "SI Execute Process",
//         sequence: 4,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "REASON",
//         columnName: "Reason",
//         sequence: 5,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "BRANCH_CD",
//         columnName: "Debit Branch Code",
//         sequence: 6,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "DR_ACCT_TYPE",
//         columnName: "Debit A/C Type",
//         sequence: 6,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "DR_ACCT_CD",
//         columnName: "Debit A/C No.",
//         sequence: 6,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "CR_BRANCH_CD",
//         columnName: "Credit Branch Code",
//         sequence: 7,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 100,
//         maxWidth: 200,
//       },
//       {
//         accessor: "CR_ACCT_TYPE",
//         columnName: "Credit A/C Type",
//         sequence: 8,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 350
//       },
//       {
//         accessor: "CR_ACCT_CD",
//         columnName: "Credit A/C No.",
//         sequence: 8,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 350
//       },
//       {
//         accessor: "SI_AMOUNT",
//         columnName: "SI Amount",
//         sequence: 9,
//         alignment: "left",
//         componentType: "currency",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       },
//       {
//         accessor: "SI_CHARGE",
//         columnName: "SI Charge",
//         sequence: 10,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       },
//       {
//         accessor: "REMARKS",
//         columnName: "Remark",
//         sequence: 11,
//         alignment: "left",
//         componentType: "default",
//         width: 150,
//         minWidth: 100,
//         maxWidth: 350
//       },
//       // {
//       //   columnName: "",
//       //   componentType: "buttonRowCell",
//       //   buttonLabel: "Audit Trail",
//       //   accessor: "_hidden2",
//       //   width: 140,
//       //   sequence: 14,
//       //   alignment: "center",
//       //   shouldExclude: (initialValue, original, prevRows, nextRows) => {
//       //     if (original?.AUDIT_CNT > 0) {
//       //       return false;
//       //     }
//       //     else {
//       //       return true;
//       //     }
//       //   },
//       // },
//       // {
//       //   columnName: "",
//       //   componentType: "buttonRowCell",
//       //   buttonLabel: "Populate",
//       //   accessor: "_hidden1",
//       //   width: 80,
//       //   sequence: 14,
//       //   alignment: "center",
//       //   shouldExclude: (initialValue, original, prevRows, nextRows) => {

//       //     if (original?.SI_EXECUTE_FLG == 'N') {
//       //       return false;
//       //     }
//       //     else {
//       //       return true;
//       //     }
//       //   },
//       // },
//     ],
//   },
// };
