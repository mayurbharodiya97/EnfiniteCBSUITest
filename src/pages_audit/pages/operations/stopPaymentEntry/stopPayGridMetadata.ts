import { GridMetaDataType } from "components/dataTableStatic";
export const StopPayGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Cheque Stop Detail",
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
      min: "53vh",
      max: "53vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    searchPlaceholder: "Stop Cheque Detail",
    footerNote:
      "Note : Stop cheque can be Remove on a same working Day and Double-click on the Pink row to release Stop-check.",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 77,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Intimate Date",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 117,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "CHEQUE_FROM",
      columnName: "Cheque From",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 117,
      minWidth: 90,
      maxWidth: 130,
    },
    {
      accessor: "CHEQUE_TO",
      columnName: "Cheque To",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 102,
      minWidth: 90,
      maxWidth: 120,
    },
    {
      accessor: "CHEQUE_DT",
      columnName: "Cheque Date",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 90,
      maxWidth: 140,
    },

    {
      accessor: "CHEQUE_AMOUNT",
      columnName: "Cheque Amount",
      sequence: 5,
      alignment: "right",
      componentType: "currency",
      width: 115,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "FLAG",
      columnName: "Cheque Stop Type",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 125,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CONFIRMED",
      columnName: "Status",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "ALLOW_DELETE",
      columnName: "Action",
      buttonLabel: "Remove",
      sequence: 8,
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
    // {
    //   accessor: "RELEASE",
    //   columnName: "Release",
    //   buttonLabel: "Release",
    //   sequence: 8,
    //   alignment: "center",
    //   componentType: "buttonRowCell",
    //   // shouldExclude: (initialValue, original, prevRows, nextRows) => {
    //   //   if (initialValue === "Y") {
    //   //     return false;
    //   //   }
    //   //   return true;
    //   // },
    //   width: 90,
    //   minWidth: 60,
    //   maxWidth: 130,
    // },
    {
      accessor: "PRINT",
      columnName: "Print",
      buttonLabel: "Print",
      sequence: 8,
      alignment: "center",
      componentType: "buttonRowCell",
      // shouldExclude: (initialValue, original, prevRows, nextRows) => {
      //   if (initialValue === "Y") {
      //     return false;
      //   }
      //   return true;
      // },
      width: 90,
      minWidth: 60,
      maxWidth: 130,
    },
  ],
};
