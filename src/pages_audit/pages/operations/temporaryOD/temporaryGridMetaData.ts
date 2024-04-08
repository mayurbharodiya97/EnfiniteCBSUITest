import { GridMetaDataType } from "components/dataTableStatic";
export const temporaryODGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Temporary OD Detail",
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
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "57vh",
      max: "57vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    hiddenFlag: "_hidden",
    searchPlaceholder: "Temporary-OD Detail",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 75,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Statement Date",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 130,
      minWidth: 100,
      maxWidth: 150,
    },


    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 8,
      alignment: "center",
      componentType: "date",
      width: 115,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CONFIRMED",
      columnName: "Status",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 90,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      accessor: "RECEIVED_DT",
      columnName: "Recieved Date",
      sequence: 9,
      alignment: "center",
      componentType: "date",
      width: 125,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ALLOW_DELETE_FLAG",
      columnName: "Action",
      buttonLabel: "Remove",
      sequence: 9,
      alignment: "center",
      componentType: "buttonRowCell",
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (initialValue === "Y") {
          return false;
        }
        return true;
      },
      width: 90,
      minWidth: 60,
      maxWidth: 130,
    },

    {
      columnName: "Upload/View",
      componentType: "buttonRowCell",
      accessor: "DOC_FLAG",
      sequence: 10,
      width: 125,
      maxWidth: 150,
      minWidth: 90,
      isColumnName: (initialValue) => {
        if (initialValue) {
          return initialValue === "U" ? "Upload" : "Upload/View";
        }
      },
      // isVisible: false,
      // isVisibleInNew: true,
    },
  ],
};
