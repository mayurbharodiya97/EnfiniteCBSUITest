import { GridMetaDataType } from "components/dataTableStatic";
export const Prioritymastersubmetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Priority Master - Sub (EMST/O56)",
    rowIdColumn: "SUB_PRIORITY_CD",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: true,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "Sr_No",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 60,
      minWidth: 50,
      maxWidth: 100,
      isAutoSequence:true
    },
    {
      accessor: "SUB_PRIORITY_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "PARENT_WEAKER_NM",
      columnName: "ParentWeaker",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 200,
      maxWidth: 350,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 400,
    },
  ],
};
