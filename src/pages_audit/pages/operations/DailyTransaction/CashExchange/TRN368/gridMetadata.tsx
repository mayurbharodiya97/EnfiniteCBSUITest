import { GridMetaDataType } from "@acuteinfo/common-base";
export const gridMetaData368: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
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
      min: "20vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    hideHeader: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "BRANCH_NM",
      columnName: "Transfer Details",
      sequence: 2,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "account1",
      columnName: "Tran Date",
      sequence: 3,
      width: 70,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
    },
    {
      accessor: "ACCT_CD",
      columnName: "Amount",
      sequence: 4,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "trx1",
      columnName: "Entered By",
      sequence: 5,
      componentType: "default",
      width: 80,
    },
  ],
};
