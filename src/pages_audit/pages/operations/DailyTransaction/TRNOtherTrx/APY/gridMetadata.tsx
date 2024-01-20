import { GridMetaDataType } from "components/dataTableStatic";
export const APYGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "APY",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 120,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "36vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "VoucherNo ",
      sequence: 1,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "ACCT_NM",
      columnName: "ACCT_NM ",
      sequence: 2,
      componentType: "default",
      width: 220,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CUSTOMER_ID ",
      sequence: 3,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "TRAN_DT",
      columnName: "TRAN_Date",
      sequence: 4,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },

    {
      accessor: "NOMINEE_NM",
      columnName: "NOMINEE_NM",
      sequence: 6,

      componentType: "default",
      width: 220,
    },
    {
      accessor: "APY_TRAN_CD",
      columnName: "APY_TRAN_CD",
      sequence: 7,

      componentType: "default",
      width: 220,
    },
    {
      accessor: "SELF_JOINT",
      columnName: " SELF_JOINT  ",
      sequence: 8,

      componentType: "default",
      width: 120,
    },
  ],
};
