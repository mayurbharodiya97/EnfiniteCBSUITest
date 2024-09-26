export const GSTGrid = {
  gridConfig: {
    dense: true,
    gridLabel: "GST",
    rowIdColumn: "docUUID",
    defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
    allowColumnReordering: true,
    disableSorting: false,
    disableGlobalFilter: false,
    disableGroupBy: false,
    containerHeight: { min: "40vh", max: "50vh" },
    enablePagination: true,
  },
  columns: [
    {
      columnName: "File Name",
      componentType: "default",
      accessor: "fileName",
      sequence: 1,
      alignment: "left",
      width: 300,
      maxWidth: 300,
      minWidth: 100,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
    },
    {
      columnName: "Uploaded Date",
      componentType: "date",
      accessor: "uploadDate",
      sequence: 2,
      alignment: "left",
      width: 100,
      maxWidth: 200,
      minWidth: 100,
    },
    {
      columnName: "Verification",
      componentType: "default",
      accessor: "status",
      sequence: 3,
      alignment: "left",
      width: 150,
      maxWidth: 200,
      minWidth: 100,
    },
    {
      columnName: "Document Type",
      componentType: "default",
      accessor: "docType",
      sequence: 5,
      alignment: "left",
      width: 150,
      maxWidth: 200,
      minWidth: 100,
    },
    {
      columnName: "Remarks",
      componentType: "default",
      accessor: "remarks",
      sequence: 6,
      alignment: "left",
      width: 100,
      maxWidth: 200,
      minWidth: 100,
    },
  ],
};
