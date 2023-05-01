export const SchemeMasterGridMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "Scheme Master",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
    allowColumnReordering: true,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    containerHeight: { min: "68vh", max: "68vh" },
    pageSizes: [15, 20, 30],
    defaultPageSize: 15,
  },
  columns: [
    {
      columnName: "ID",
      componentType: "default",
      accessor: "TRAN_CD",
      sequence: 1,
      alignment: "left",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Source",
      componentType: "default",
      accessor: "APP_INDICATOR",
      sequence: 3,
      alignment: "left",
      width: 120,
      maxWidth: 200,
      minWidth: 100,
    },
    {
      columnName: "Parent Type",
      componentType: "default",
      accessor: "PARENT_TYPE",
      sequence: 3,
      alignment: "left",
      width: 150,
      maxWidth: 200,
      minWidth: 120,
    },
    {
      columnName: "Scheme Code",
      componentType: "default",
      accessor: "SCHEME_CD",
      sequence: 3,
      alignment: "left",
      width: 150,
      maxWidth: 200,
      minWidth: 120,
    },
    {
      columnName: "Confirm Status",
      componentType: "default",
      accessor: "CONFIRM_STATUS",
      sequence: 4,
      alignment: "left",
    },
    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 6,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy hh:mm a",
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Last Modified By",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 130,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Last Modified Date",
      sequence: 8,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy hh:mm a",
    },
  ],
};
export const SchemeMasterConfirmationGridMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "Scheme Master Confirmation",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
    allowColumnReordering: true,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    containerHeight: { min: "68vh", max: "68vh" },
    pageSizes: [15, 20, 30],
    defaultPageSize: 15,
  },
  columns: [
    {
      columnName: "ID",
      componentType: "default",
      accessor: "TRAN_CD",
      sequence: 1,
      alignment: "left",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Source",
      componentType: "default",
      accessor: "APP_INDICATOR",
      sequence: 3,
      alignment: "left",
      width: 120,
      maxWidth: 200,
      minWidth: 100,
    },
    {
      columnName: "Parent Type",
      componentType: "default",
      accessor: "PARENT_TYPE",
      sequence: 3,
      alignment: "left",
      width: 150,
      maxWidth: 200,
      minWidth: 120,
    },
    {
      columnName: "Scheme Code",
      componentType: "default",
      accessor: "SCHEME_CD",
      sequence: 3,
      alignment: "left",
      width: 150,
      maxWidth: 200,
      minWidth: 120,
    },
    {
      columnName: "Confirm Status",
      componentType: "default",
      accessor: "CONFIRM_STATUS",
      sequence: 4,
      alignment: "left",
    },
    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 6,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy hh:mm a",
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Last Modified By",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 130,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Last Modified Date",
      sequence: 8,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy hh:mm a",
    },
  ],
};
