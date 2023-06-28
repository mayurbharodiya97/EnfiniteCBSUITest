import { GridMetaDataType } from "components/dataTableStatic";
export const TodaysTransactionTableGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "TodaysTransaction",
    rowIdColumn: "TRAN_CD",

    defaultColumnConfig: {
      width: 200,
      maxWidth: 300,
      minWidth: 200,
    },

    allowColumnReordering: false,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 40, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "50vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hideFooter: false,
  },
  columns: [
    {
      accessor: "sr_no",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branchcode",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AccountType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_CD",
      columnName: "ACNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "TRAN_DT",
      columnName: "TransactionDate",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Chequeno",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 90,
      maxWidth: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 330,
      minWidth: 120,
      maxWidth: 340,
    },
    {
      accessor: "CREDIT",
      columnName: "CreditAmount",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "DEBIT",
      columnName: "DebitAmount",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "TRAN_CD",
      columnName: "Vno",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "CONFIRM",
      columnName: "STATUS",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "SCROLL1",
      columnName: "Scroll",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "SDC",
      columnName: "SDC",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
  ],
};
