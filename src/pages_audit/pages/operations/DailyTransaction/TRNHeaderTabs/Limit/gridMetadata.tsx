import { GridMetaDataType } from "components/dataTableStatic";
export const LimitGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Limit",
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
    allowRowSelection: true,
    hideHeader: false,
    isCusrsorFocused: true,
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
      columnName: "Entry Date",
      accessor: "ENTRY_DT",
      sequence: 2,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 100,
    },
    {
      columnName: "Effective Date",
      accessor: "TRAN_DT",
      sequence: 3,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      columnName: "Expiry Date",
      accessor: "EXPIRY_DT",
      sequence: 4,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      columnName: "Int Rate",
      accessor: "INT_RATE",
      sequence: 5,
      componentType: "default",
      width: 120,
      alignment: "right",
    },
    {
      columnName: "Margin",
      accessor: "MARGIN",
      sequence: 6,
      componentType: "default",
      width: 100,
      alignment: "right",
    },
    {
      columnName: "Over Rate",
      accessor: "PENAL_RATE",
      sequence: 7,
      componentType: "default",
      width: 120,
      alignment: "right",
    },
    // {
    //   columnName: "Over Rate",
    //   accessor: "PENAL_RATE",
    //   sequence: 8,
    //   componentType: "default",
    //   width: 120,
    // },
    {
      columnName: "Security Value",
      accessor: "SECURITY_CD",
      sequence: 9,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Limit Amount",
      accessor: "LIMIT_AMOUNT",
      sequence: 10,
      componentType: "currency",
      width: 120,
      alignment: "right",
    },
    {
      columnName: "Description",
      accessor: "FD_DESC",
      sequence: 11,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Resolution Date",
      accessor: "RESOLUTION_DATE",
      sequence: 12,
      componentType: "default",
      width: 120,
    },
  ],
};
