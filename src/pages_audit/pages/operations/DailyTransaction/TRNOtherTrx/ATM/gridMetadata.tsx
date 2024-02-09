import { GridMetaDataType } from "components/dataTableStatic";
export const ATMGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ATM",
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
      width: 120,
    },
    {
      columnName: "Issue From",
      accessor: "2",
      sequence: 2,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Request Date",
      accessor: "3",
      sequence: 3,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      columnName: "Issue Date",
      accessor: "4",
      sequence: 4,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      columnName: "Card No",
      accessor: "5",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Card Type",
      accessor: "6",
      sequence: 6,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Expire Date",
      accessor: "7",
      sequence: 7,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      columnName: "Remarks",
      accessor: "8",
      sequence: 8,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Status",
      accessor: "9",
      sequence: 9,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Deactive Date",
      accessor: "10",
      sequence: 10,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
  ],
};
