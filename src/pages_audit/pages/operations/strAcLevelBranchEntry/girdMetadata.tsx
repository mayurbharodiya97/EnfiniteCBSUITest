import { GridMetaDataType } from "@acuteinfo/common-base";

export const strBranchLevelEntryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "65vh",
      max: "65vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "ACCT_BRANCH_CD",
      columnName: "BranchCode",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      placeholder: "",
      width: 120,
      minWidth: 130,
      maxWidth: 160,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AccountType",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AccountNo",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountName",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 400,
      minWidth: 420,
      maxWidth: 480,
    },
    {
      accessor: "SUSP_DESC",
      columnName: "SuspiciousStatus",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      accessor: "REASON_DESC",
      columnName: "SuspiciousReasons",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 250,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "GROUND_OF_SUSPICION",
      sequence: 7,
      buttonLabel: "GroundOfSuspicion",
      isVisible: true,
      width: 200,
      minWidth: 250,
      maxWidth: 280,
    },
    {
      columnName: "Transaction Detail",
      componentType: "buttonRowCell",
      accessor: "TRANSACTION_DETAIL",
      sequence: 7,
      buttonLabel: "TransactionDetail",
      isVisible: true,
      width: 200,
      minWidth: 250,
      maxWidth: 280,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.TRN_DTL_BUT_VISIBLE === "Y") {
          return false;
        }
        return true;
      },
    },
    {
      accessor: "ACT_FROM_DT",
      columnName: "GeneralFromDate",
      sequence: 8,
      alignment: "center",
      componentType: "date",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "ACT_TO_DT",
      columnName: "GeneralToDate",
      sequence: 9,
      alignment: "center",
      componentType: "date",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "TRAN_BAL",
      columnName: "Balance",
      sequence: 10,
      alignment: "right",
      componentType: "currency",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "PAN_NO",
      columnName: "PanNo",
      sequence: 11,
      alignment: "right",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "REMARKS2",
      columnName: "InvestigationDetail",
      sequence: 12,
      alignment: "right",
      componentType: "default",
      width: 300,
      minWidth: 320,
      maxWidth: 380,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 13,
      alignment: "right",
      componentType: "default",
      width: 450,
      minWidth: 460,
      maxWidth: 500,
    },
  ],
};
export const strBranchLevelHistoryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "55vh",
      max: "55vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 60,
      minWidth: 60,
      maxWidth: 80,
      isAutoSequence: true,
    },

    {
      accessor: "SUSP_DESC",
      columnName: "SuspiciousStatus",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      accessor: "REASON_DESC",
      columnName: "SuspiciousReasons",
      sequence: 2,
      alignment: "center",
      componentType: "default",
      width: 300,
      minWidth: 310,
      maxWidth: 350,
    },
    {
      accessor: "REMARKS2",
      columnName: "Remarks",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 450,
      minWidth: 460,
      maxWidth: 500,
    },
    {
      accessor: "REMARKS",
      columnName: "InvestigationDetail",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 450,
      minWidth: 460,
      maxWidth: 500,
    },
    {
      accessor: "ACT_FROM_DT",
      columnName: "GeneralFromDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "ACT_TO_DT",
      columnName: "GeneralToDate",
      sequence: 5,
      alignment: "center",
      componentType: "date",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
  ],
};