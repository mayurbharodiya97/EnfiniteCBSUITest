import { GridMetaDataType } from "components/dataTableStatic";
export const SIDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Standing Instruction Detail",
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
      columnName: "Sr",
      accessor: "sr",
      sequence: 1,
      componentType: "default",
      width: 60,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Execute Day",
      accessor: "2",
      sequence: 2,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Start Date",
      accessor: "3",
      sequence: 3,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Frequency Type",
      accessor: "4",
      sequence: 4,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Frequency Value",
      accessor: "5",
      sequence: 5,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Debit from A/C",
      accessor: "6",
      sequence: 6,
      componentType: "currency",
      width: 80,
    },
    {
      columnName: "Credit to A/C",
      accessor: "8",
      sequence: 8,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "SI Amount",
      accessor: "9",
      sequence: 9,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Remarks",
      accessor: "10",
      sequence: 10,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Valid Upto",
      accessor: "11",
      sequence: 11,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Entered Branch",
      accessor: "12",
      sequence: 12,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Status",
      accessor: "13",
      sequence: 13,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "SI Number",
      accessor: "14",
      sequence: 14,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Deactive Date",
      accessor: "15",
      sequence: 15,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Entered By",
      accessor: "16",
      sequence: 16,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Deactived By",
      accessor: "17",
      sequence: 17,
      componentType: "default",
      width: 80,
    },
  ],
};
