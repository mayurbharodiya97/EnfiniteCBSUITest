import { GridMetaDataType } from "components/dataTableStatic";
export const BranchSelectionGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Access Branch List",
    rowIdColumn: "BRANCH_CD",
    searchPlaceholder: "branches",

    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },

    allowColumnReordering: false,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: false,
    containerHeight: {
      min: "68vh",
      max: "68vh ",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hideFooter: true,
  },
  // filters: [
  //   {
  //     accessor: "label",
  //     columnName: "Screen Name",
  //     filterComponentType: "valueFilter",
  //     gridProps: {
  //       xs: 12,
  //       md: 12,
  //       sm: 12,
  //     },
  //   },
  // ],
  columns: [
    {
      accessor: "BRANCH_CD",
      columnName: "Branch Cd",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 140,
      maxWidth: 220,
    },
    {
      accessor: "BRANCH_NM",
      columnName: "Branch Name",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 280,
      maxWidth: 420,
    },
    {
      accessor: "STATUS",
      columnName: "Status",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 140,
      maxWidth: 220,
    },
    {
      accessor: "BEGIN_DATETIME",
      columnName: "Begin Time",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 222,
      minWidth: 140,
      maxWidth: 240,
    },
    {
      accessor: "END_DATETIME",
      columnName: "End Time",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 222,
      minWidth: 140,
      maxWidth: 240,
    },
    {
      accessor: "DAYEND_STATUS",
      columnName: "Dayend Status",
      sequence: 6,
      componentType: "default",
      isVisible: false,
    },
    {
      accessor: "EOD_RUNNING_STATUS",
      columnName: "EOD Running Status",
      sequence: 6,
      componentType: "default",
      isVisible: false,
    },
    {
      accessor: "BASE_COMP_CD",
      columnName: "Base Comp Cd",
      sequence: 6,
      componentType: "default",
      isVisible: false,
    },
    {
      accessor: "BASE_BRANCH_CD",
      columnName: "Base Branch Cd",
      sequence: 6,
      componentType: "default",
      isVisible: false,
    },
    {
      accessor: "COMP_CD",
      columnName: "Comp Cd",
      sequence: 6,
      componentType: "default",
      isVisible: false,
    },
    {
      accessor: "COMP_NM",
      columnName: "Comp Name",
      sequence: 6,
      componentType: "default",
      isVisible: false,
    },
  ],
};
