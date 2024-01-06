import { GridMetaDataType } from "components/dataTableStatic";
export const TodayTransGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Today Transaction Details",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 120,
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
      accessor: "ACCT_CD",
      columnName: "Account No",
      sequence: 2,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "TRAN_CD",
      columnName: "Voucher No",
      sequence: 3,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "A/C Type",
      sequence: 4,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "CREDIT",
      columnName: "Credit",
      sequence: 6,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "DEBIT",
      columnName: "Debit",
      sequence: 7,
      componentType: "default",
      width: 120,
    },

    {
      accessor: "MAKER",
      columnName: "CreatedBy",
      sequence: 9,

      componentType: "default",
      width: 120,
    },

    {
      accessor: "SCROLL1",
      columnName: "Scroll",
      sequence: 13,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "SDC",
      columnName: "SDC",
      sequence: 13,

      componentType: "default",
      width: 120,
    },

    {
      accessor: "TRAN_DT",
      columnName: "Date",
      sequence: 17,

      width: 120,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
    },
  ],
};
