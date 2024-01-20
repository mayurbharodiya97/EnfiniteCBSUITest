import { GridMetaDataType } from "components/dataTableStatic";
export const stopPayGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Stop Pay",
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
      accessor: "FLAG",
      columnName: "FLAG ",
      sequence: 3,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "CHEQUE_TO",
      columnName: "CHEQUE_TO",
      sequence: 4,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "ENTERED_BY",
      sequence: 5,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "CONFIRMED",
      columnName: "CONFIRMED",
      sequence: 6,

      componentType: "default",
      width: 250,
    },
  ],
};
