import { GridMetaDataType } from "components/dataTableStatic";
export const TRN001_TableMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "30vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    hideHeader: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "BRANCH_NM",
      columnName: "Branch",
      sequence: 2,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "ACCT_TYPE_DESC",
      columnName: "AcctType",
      sequence: 3,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AccountNo",
      sequence: 4,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "TRX_DESC",
      columnName: "Trx",
      sequence: 5,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "SCROLL1",
      columnName: "Scroll/Token",
      sequence: 6,
      componentType: "default",
      width: 50,
    },
    {
      accessor: "SDC_DESC",
      columnName: "SDC",
      sequence: 7,
      componentType: "default",
      width: 100,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 8,
      componentType: "default",
      width: 130,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 9,
      width: 70,
      componentType: "date",
      isVisible: true,
    },
    {
      accessor: "TIME",
      columnName: "Time",
      sequence: 9,
      width: 50,
      componentType: "default",
    },
    {
      accessor: "DEBIT",
      columnName: "Debit",
      sequence: 10,
      componentType: "currency",
      color: "red",
      width: 80,
      isDisplayTotal: true,
    },
    {
      accessor: "CREDIT",
      columnName: "Credit",
      sequence: 11,
      componentType: "currency",
      color: "green",
      isDisplayTotal: true,
      width: 80,
    },
    {
      accessor: "TRAN_CD",
      columnName: "Voucher No",
      sequence: 12,
      componentType: "default",
      width: 80,
    },
  ],
};
