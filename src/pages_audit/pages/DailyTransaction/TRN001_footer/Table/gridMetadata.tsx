import { GridMetaDataType } from "components/dataTableStatic";
export const TRN001_TableMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "TRN_001 Table",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "26vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    hideHeader: true,
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
      accessor: "account1",
      columnName: "Account",
      sequence: 3,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "ACCT_CD",
      columnName: "Account No",
      sequence: 4,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "trx1",
      columnName: "TRX",
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
      accessor: "sdc1",
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
      width: 100,
    },
    {
      accessor: "date1",
      columnName: "Date",
      sequence: 9,
      width: 80,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
    },
    {
      accessor: "debit1",
      columnName: "Debit",
      sequence: 10,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "credit1",
      columnName: "Credit",
      sequence: 11,
      componentType: "default",
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
