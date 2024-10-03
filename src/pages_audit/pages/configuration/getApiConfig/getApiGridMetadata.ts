import { GridMetaDataType } from "@acuteinfo/common-base";
export const getApiGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Select-Get Api Configuration",
    rowIdColumn: "ID",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    hiddenFlag: "_hidden",
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "69vh",
      max: "69vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "Id No.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      // isAutoSequence: true,
    },

    {
      accessor: "GET_TYPE",
      columnName: "Get Type",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 70,
      maxWidth: 130,
    },
    {
      accessor: "ACTION",
      columnName: "Action",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "GET_QUERY",
      columnName: "Query",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 700,
      minWidth: 500,
      maxWidth: 1000,
    },
    // {
    //   accessor: "BUTTONCELL",
    //   columnName: "Delete",
    //   sequence: 6,
    //   // alignment: "left",
    //   componentType: "buttonRowCell",
    //   width: 100,
    //   minWidth: 70,
    //   maxWidth: 200,
    // },
  ],
};
