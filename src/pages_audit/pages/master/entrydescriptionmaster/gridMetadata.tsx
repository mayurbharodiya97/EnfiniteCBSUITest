import { GridMetaDataType } from "components/dataTableStatic";

export const EntryDescMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Entry Description Master (EMST/067)",
    rowIdColumn: "SP_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "80vh",
      max: "80vh",
    },
    allowFilter: true,
    allowColumnHiding: true,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "Sr.No.",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "SP_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 400,
    },
    {
      accessor: "DISPLAY",
      columnName: "Parent Type",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 200,
      maxWidth: 600,
    },
    {
      accessor: "SP_NM",
      columnName: "Description",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 400,
      minWidth: 300,
      maxWidth: 600,
      showTooltip: true,
    },
  ],
};
