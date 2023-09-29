export const communMasterConfig = {
  title: "Admin User Application Usage History",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  retrievalType: "GETPROPMISCDATA",
  // groupBy: ["USERNAME"],
  autoFetch: false,
  columns: [
    {
      columnName: "Display Name",
      accessor: "DISPLAY_NM",
      width: 240,
      type: "default",
    },
    {
      columnName: "Data Value",
      accessor: "DATA_VALUE",
      width: 170,
      type: "default",
    },
    {
      columnName: "Display Value",
      accessor: "DISPLAY_VALUE",
      width: 180,
      type: "default",
    },
    {
      columnName: "Remarks",
      accessor: "REMARKS",
      width: 200,
    },
  ],
};
