import { GridMetaDataType } from "@acuteinfo/common-base";
export const ACH_IWGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ACH IW",
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
      columnName: "Type",
      accessor: "CUSTOMER_ID",
      sequence: 2,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Ordering IFSC",
      accessor: "3",
      sequence: 3,
      componentType: "default",
      width: 100,
    },
    {
      columnName: " Benfc.IFSC",
      accessor: "BRANCH_CD",
      sequence: 4,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Mandate (UMRN No.)",
      accessor: "ACCT_TYPE",
      sequence: 5,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Status",
      accessor: "ACCT_CD",
      sequence: 6,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Reason Code",
      accessor: "ACCT_NM",
      sequence: 7,
      componentType: "default",
      width: 100,
    },
  ],
};
