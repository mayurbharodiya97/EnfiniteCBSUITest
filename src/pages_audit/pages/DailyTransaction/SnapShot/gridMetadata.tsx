import { GridMetaDataType } from "components/dataTableStatic";
export const SnapshotGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Snapshot",
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
      accessor: "ID",
      columnName: "Sr.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Date",
      sequence: 2,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_FROM",
      columnName: "Narration",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_TO",
      columnName: "TRX",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_TOTAL",
      columnName: "Cheque No.",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "UNUSED_CHQ",
      columnName: "Debit",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "AMOUNT",
      columnName: "Credit",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "0",
      columnName: "Closing Company",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "1",
      columnName: "Br.",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "2",
      columnName: "SDC",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "3",
      columnName: "Maker",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "4",
      columnName: "Checker",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "5",
      columnName: "Entered date",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
