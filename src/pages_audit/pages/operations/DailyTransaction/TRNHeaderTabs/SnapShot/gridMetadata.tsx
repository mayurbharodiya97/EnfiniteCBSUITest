import { GridMetaDataType } from "components/dataTableStatic";
export const snapShotGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "SnapShot",
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
      columnName: "Sr.",
      accessor: "sr",
      sequence: 0,
      componentType: "default",
      width: 60,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Date",
      accessor: "TRAN_DT",
      sequence: 1,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 100,
    },

    {
      columnName: "Narration ",
      accessor: "REMARKS",
      sequence: 2,
      componentType: "default",
      width: 250,
    },
    {
      columnName: "TRX ",
      accessor: "TYPE_CD",
      sequence: 3,
      componentType: "default",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Chq No.",
      accessor: "CHEQUE_NO",
      sequence: 4,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Debit",
      accessor: "debit1",
      sequence: 5,
      componentType: "currency",
      width: 100,
      color: "red",
      alignment: "right",
    },
    {
      columnName: "Credit",
      accessor: "credit1",
      sequence: 6,
      componentType: "currency",
      width: 100,
      color: "green",
      alignment: "right",
    },

    {
      columnName: "Closing Bal",
      accessor: "closing",
      sequence: 7,
      componentType: "default",
      width: 100,
      alignment: "right",
    },
    {
      columnName: "Br ",
      accessor: "ENTERED_BRANCH_CD",
      sequence: 8,
      componentType: "default",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "SDC ",
      accessor: "SDC",
      sequence: 9,
      componentType: "default",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Maker ",
      accessor: "MAKER",
      sequence: 10,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Checker ",
      accessor: "CHECKER",
      sequence: 11,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Entered Date",
      accessor: "VALUE_DT",
      sequence: 12,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 130,
    },
  ],
};
