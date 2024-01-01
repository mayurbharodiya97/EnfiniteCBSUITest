import { GridMetaDataType } from "components/dataTableStatic";
export const HoldChargeGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Hold Charge",
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
      accessor: "CONFIRMED",
      columnName: "CONFIRMED",
      sequence: 1,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Date",
      sequence: 2,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 3,
      componentType: "default",
      width: 220,
    },
    {
      accessor: "TO_ACCT_TYPE",
      columnName: "TO_ACCT_TYPE",
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
      accessor: "AMOUNT",
      columnName: "AMOUNT ",
      sequence: 6,

      componentType: "default",
      width: 120,
    },

    {
      accessor: "TRAN_BAL",
      columnName: "TRAN_BAL",
      sequence: 7,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "TO_ACCT_CD",
      columnName: "TO_ACCT_CD",
      sequence: 8,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Description",
      sequence: 9,

      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      accessor: "REF_TRAN_CD",
      columnName: "REF_TRAN_CD",
      sequence: 10,

      componentType: "default",
      width: 120,
    },
  ],
};
