import { GridMetaDataType } from "components/dataTableStatic";
export const DocumentGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Document",
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
      accessor: "DOC_TYPE",
      columnName: "Document",
      sequence: 2,
      componentType: "default",
      width: 120,
    },

    {
      accessor: "TEMPLATE_DOC_TYPE",
      columnName: "Document Type",
      sequence: 6,
      componentType: "default",
      width: 200,
    },

    {
      accessor: "DESCRIPTION",
      columnName: "DESCRIPTION",
      sequence: 7,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CUSTOMER_ID",
      sequence: 7,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "TRAN_CD",
      columnName: "Voucher No",
      sequence: 7,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch No",
      sequence: 7,
      componentType: "default",
      width: 120,
    },
  ],
};
