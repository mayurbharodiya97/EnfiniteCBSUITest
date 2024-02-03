import { GridMetaDataType } from "components/dataTableStatic";
export const APYGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "APY",
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
      accessor: "sr",
      columnName: "Sr ",
      sequence: 1,
      componentType: "default",
      width: 100,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "Type",
      sequence: 2,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "ACCT_NM",
      columnName: "Subscriber Name ",
      sequence: 3,
      componentType: "default",
      width: 220,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CUSTOMER_ID ",
      sequence: 4,
      componentType: "default",
      width: 120,
    },

    {
      accessor: "1",
      columnName: "Registration No.",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Registration Date",
      sequence: 6,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },

    {
      accessor: "22",
      columnName: "Last Premium Date",
      sequence: 7,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 180,
    },

    {
      accessor: "NOMINEE_NM",
      columnName: "NOMINEE_NM",
      sequence: 8,
      componentType: "default",
      width: 220,
    },
  ],
};
