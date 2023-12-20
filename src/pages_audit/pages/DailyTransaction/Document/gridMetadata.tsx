import { GridMetaDataType } from "components/dataTableStatic";
export const DocumentGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Document",
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
      columnName: "Sr",
      sequence: 1,
      componentType: "default",
      isAutoSequence: true,
    },
    {
      accessor: "DOC_TYPE",
      columnName: "Document",
      sequence: 2,
      componentType: "default",
    },
    {
      accessor: "VALID_UPTO",
      columnName: "Valid Upto",
      sequence: 4,
      componentType: "default",
    },
    {
      accessor: "TEMPLATE_DOC_TYPE",
      columnName: "Document Type",
      sequence: 6,
      componentType: "default",
    },
    {
      accessor: "DOC_AMOUNT",
      columnName: "Document Amount",
      sequence: 6,
      componentType: "default",
    },
    {
      accessor: "DESCRIPTION",
      columnName: "DESCRIPTION",
      sequence: 7,
      componentType: "default",
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CUSTOMER_ID",
      sequence: 7,
      componentType: "default",
    },
  ],
};
