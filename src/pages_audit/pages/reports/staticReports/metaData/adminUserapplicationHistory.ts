import { components } from "@acuteinfo/common-base";

export const appUsageHistoryMetaData = {
  title: "Admin User Application Usage History",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  retrievalType: "DATEAPUSERSLIST",
  groupBy: ["USERNAME"],
  autoFetch: false,
  columns: [
    {
      columnName: "Username",
      accessor: "USERNAME",
      width: 140,
      type: "default",
    },
    {
      columnName: "Date",
      accessor: "TRAN_DT",
      width: 160,
      // Cell: components.DateTimeCell,
      type: "default",
    },
    {
      columnName: "Branch",
      accessor: "BRANCH_CD",
      width: 140,
      type: "default",
    },
    {
      columnName: "System Code",
      accessor: "DOC_CD",
      width: 170,
    },

    {
      columnName: "Screen Name",
      accessor: "DOC_NM",
      // Filter: filters.SelectColumnFilter,
      width: 150,
    },
    {
      columnName: "Open Date And Time",
      accessor: "OPEN_TIME",
      width: 200,
    },
    {
      columnName: "Close Date And Time",
      accessor: "CLOSE_TIME",
      width: 200,
    },
    {
      columnName: "Machine Name",
      accessor: "MACHINE_NM",
      width: 200,
    },
  ],
};
