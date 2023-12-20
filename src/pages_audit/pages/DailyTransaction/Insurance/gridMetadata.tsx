import { GridMetaDataType } from "components/dataTableStatic";
export const InsuranceGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Insurance",
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
      accessor: "Sr",
      columnName: "Sr.",
      sequence: 1,
      componentType: "default",
      isAutoSequence: true,
    },
    {
      accessor: "POLICY_NO",
      columnName: "Policy No.",
      sequence: 2,
      componentType: "default",
    },
    {
      accessor: "INSURANCE_DATE",
      columnName: "Insurance Date",
      sequence: 3,
      componentType: "default",
    },
    {
      accessor: "DUE_DATE",
      columnName: "Due Date",
      sequence: 4,

      componentType: "default",
    },
    {
      accessor: "INSURANCE_AMOUNT",
      columnName: "Insurance Amount",
      sequence: 5,

      componentType: "default",
    },
    {
      accessor: "TOT_PREMIUM_AMT",
      columnName: "Total Premium Amount ",
      sequence: 6,

      componentType: "default",
    },
    {
      accessor: "NET_PREMIUM_AMOUNT",
      columnName: "Net Premium Amount ",
      sequence: 7,

      componentType: "default",
    },
    {
      accessor: "INSURANCE_TYPE",
      columnName: "Insurance Type",
      sequence: 8,

      componentType: "default",
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Company",
      sequence: 9,

      componentType: "default",
    },
    {
      accessor: "INS_DESCRIPTION",
      columnName: "Description",
      sequence: 10,

      componentType: "default",
    },
    {
      accessor: "SERVICE_CHARGE",
      columnName: "SERVICE_CHARGE",
      sequence: 11,

      componentType: "default",
    },
  ],
};
