import { GridMetaDataType } from "components/dataTableStatic";
export const TRN002_TableMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Today's Transactions",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: false,
    // hideHeader: false,
    hideFooter: false,
    // pageSizes: [10, 20, 30],
    // defaultPageSize: 10,
    containerHeight: {
      min: "26vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "Voucher No",
      sequence: 1,
      componentType: "default",
      width: 100,
    },
    {
      accessor: "ACCT_CD_NEW",
      columnName: "Account No",
      sequence: 2,
      componentType: "default",
      width: 180,
    },
    {
      accessor: "ACCT_NM",
      columnName: "A/C Holder Name",
      sequence: 3,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "TRX",
      sequence: 4,
      componentType: "default",
      width: 20,
    },
    {
      accessor: "SCROLL1",
      columnName: "Scroll/Token",
      sequence: 5,
      componentType: "default",
      width: 100,
    },
    {
      accessor: "SDC",
      columnName: "SDC",
      sequence: 6,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 7,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Date",
      sequence: 8,
      width: 70,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
    },
    {
      accessor: "time",
      columnName: "Time",
      sequence: 9,
      width: 30,
      componentType: "default",
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 10,
      componentType: "currency",
      width: 120,
      alignment: "right",
    },

    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 11,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "Branch",
      sequence: 12,
      componentType: "default",
      width: 80,
    },
  ],
};
