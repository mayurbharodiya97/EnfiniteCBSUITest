import { GridMetaDataType } from "components/dataTableStatic";
export const snapShotGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "SnapShot",
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
    hideFooter: true,
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
      accessor: "TRAN_DT",
      columnName: "Date",
      sequence: 1,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },

    {
      accessor: "REMARKS",
      columnName: "REMARKS ",
      sequence: 2,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "TRX ",
      sequence: 3,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "CHEQUE_NO",
      sequence: 4,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "ACCT_NM",
      columnName: "ACCT_NM",
      sequence: 5,

      componentType: "default",
      width: 200,
    },
    {
      accessor: "ACCT_NO",
      columnName: "ACCT_NO",
      sequence: 6,

      componentType: "default",
      width: 150,
    },
    {
      accessor: "AMOUNT",
      columnName: "AMOUNT",
      sequence: 7,

      componentType: "default",
      width: 150,
    },
  ],
};
