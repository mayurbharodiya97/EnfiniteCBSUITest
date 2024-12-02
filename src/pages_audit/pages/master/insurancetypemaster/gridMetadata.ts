import { GridMetaDataType } from "@acuteinfo/common-base";

export const InsuTypeMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "INSURANCE_TYPE_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "70vh",
      max: "70vh",
    },
    allowColumnHiding: true,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "Sr.No.",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "INSURANCE_TYPE_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 400,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 400,
      minWidth: 300,
      maxWidth: 600,
      showTooltip: true,
    },
    {
      accessor: "SEC_TYPE_DESC",
      columnName: "SecurityType",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 200,
      maxWidth: 600,
    },
  ],
};