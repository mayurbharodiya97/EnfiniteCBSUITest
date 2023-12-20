import { GridMetaDataType } from "components/dataTableStatic";
export const JointDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Today Transaction Details",
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

      componentType: "default",
      width: 70,

      isAutoSequence: true,
    },

    {
      accessor: "ACCT_CD",
      columnName: "ACCT_CD",
      sequence: 2,

      componentType: "default",
      width: 120,

      isVisible: true,
    },
    {
      accessor: "TRAN_CD",
      columnName: "TRAN_CD",
      sequence: 3,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "ACCT_TYPE",
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
      columnName: "Credit Amount",
      sequence: 6,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "DEBIT",
      columnName: "Debit Amount",
      sequence: 7,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "AMOUNT",
      columnName: "Total Amount",
      sequence: 8,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "MAKER",
      columnName: "MAKER 1",
      sequence: 9,

      componentType: "default",
      width: 120,
    },

    {
      accessor: "CHARACTERISTICS",
      columnName: "Status",
      sequence: 11,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "PAYABLE_AT_PAR",
      columnName: "BR.",
      sequence: 12,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "REQUISITION_DT",
      columnName: "Scroll",
      sequence: 13,

      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 150,
    },
    {
      accessor: "AUTO_CHQBK_FLAG",
      columnName: "SDC",
      sequence: 14,

      componentType: "default",
      width: 100,
    },

    {
      accessor: "Maker",
      columnName: "Maker",
      sequence: 15,
      componentType: "default",
      width: 150,
    },
    {
      accessor: "Checker",
      columnName: "Checker",
      sequence: 16,

      componentType: "default",
      width: 150,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Date",
      sequence: 17,

      componentType: "default",
      width: 150,
    },
  ],
};
