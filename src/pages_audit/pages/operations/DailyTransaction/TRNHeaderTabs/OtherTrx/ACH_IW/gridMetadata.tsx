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
      columnName: "SrNo",
      accessor: "sr",
      sequence: 1,
      componentType: "default",
      width: 60,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Type",
      accessor: "TRN_TYPE",
      sequence: 2,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "OrderingIFSC",
      accessor: "ORD_BANK_IFSC",
      sequence: 3,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "BenfcIFSC",
      accessor: "BEF_BANK_IFSC",
      sequence: 4,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "MandateUMRNNo",
      accessor: "MNDT_ID",
      sequence: 5,
      componentType: "default",
      width: 180,
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      sequence: 6,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "ReasonCode",
      accessor: "REJECT_REASON_CD",
      sequence: 7,
      componentType: "default",
      width: 100,
    },
  ],
};