import { GridMetaDataType } from "components/dataTableStatic";
export const PMBYGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "PMBY",
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
      accessor: "ACCT_TYPE",
      columnName: "Type",
      sequence: 1,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "APPLICANT_NM",
      columnName: "Applicant Name",
      sequence: 2,
      componentType: "default",
      width: 220,
    },
    {
      accessor: "TRAN_DT",
      columnName: " Date",
      sequence: 3,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "Customer ID",
      sequence: 4,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "TRAN_CD",
      columnName: "Voucher No ",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "PREMIUM_AMT",
      columnName: "Premium Amt ",
      sequence: 6,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "INSURANCE_TRAN_CD",
      columnName: "INSURANCE_TRAN_CD ",
      sequence: 7,
      componentType: "default",
      width: 250,
    },
    {
      accessor: "NOMINEE_RELATION_TYPE",
      columnName: "Relation",
      sequence: 8,
      componentType: "default",
      width: 220,
    },
  ],
};