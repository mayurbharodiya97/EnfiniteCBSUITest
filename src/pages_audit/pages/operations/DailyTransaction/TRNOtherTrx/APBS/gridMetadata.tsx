import { GridMetaDataType } from "components/dataTableStatic";
export const APBSGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "APBS",
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
      accessor: "POLICY_NO",
      columnName: "Policy No.",
      sequence: 2,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "INSURANCE_DATE",
      columnName: "Insurance Date",
      sequence: 3,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      accessor: "DUE_DATE",
      columnName: "Due Date",
      sequence: 4,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      accessor: "INSURANCE_AMOUNT",
      columnName: "Insurance Amount",
      sequence: 5,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "TOT_PREMIUM_AMT",
      columnName: "Total Premium  ",
      sequence: 6,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "NET_PREMIUM_AMOUNT",
      columnName: "Net Premium  ",
      sequence: 7,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "INSURANCE_TYPE",
      columnName: "Insurance Type",
      sequence: 8,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Company",
      sequence: 9,

      componentType: "default",
      width: 250,
    },
    {
      accessor: "INS_DESCRIPTION",
      columnName: "Description",
      sequence: 10,

      componentType: "default",
      width: 120,
    },
    {
      accessor: "SERVICE_CHARGE",
      columnName: "Service Charge",
      sequence: 11,

      componentType: "default",
      width: 120,
    },
  ],
};
