import { GridMetaDataType } from "@acuteinfo/common-base";
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
      width: 80,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Register Date",
      accessor: "TRAN_DT",
      sequence: 2,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      columnName: "AadharNo",
      accessor: "MASKED_UNIQUE_ID",
      sequence: 3,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "ACHolder",
      accessor: "4",
      sequence: 4,
      componentType: "Default",
      width: 120,
    },
    {
      columnName: "CustomerId",
      accessor: "CUSTOMER_ID",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "FreshRegistration",
      accessor: "FRESH_REG",
      sequence: 6,
      componentType: "default",
      width: 135,
    },
    {
      columnName: "PreviousBankIIN",
      accessor: "PREV_IIN_NO",
      sequence: 7,
      componentType: "default",
      width: 132,
    },
    {
      columnName: "UploadNPCI",
      accessor: "8",
      sequence: 8,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "UploadDate",
      accessor: "UPLOAD_DT",
      sequence: 9,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 130,
    },
    {
      columnName: "Deactivedate",
      accessor: "DEACTIVE_DT",
      sequence: 10,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 130,
    },
    {
      columnName: "Status",
      accessor: "ACTIVE",
      sequence: 11,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "UploadFileName",
      accessor: "UPLOAD_FILE_NM",
      sequence: 12,
      componentType: "default",
      showTooltip: true,
      width: 130,
    },
    {
      columnName: "Remarks",
      accessor: "REMARKS",
      sequence: 13,
      componentType: "default",
      width: 120,
    },
  ],
};