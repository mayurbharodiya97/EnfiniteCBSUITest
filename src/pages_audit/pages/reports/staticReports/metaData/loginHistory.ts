import { components, filters } from "components/report";

export const loginHistoryMetaData = {
  title: "User Login History",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  retrievalType: "DATEUSERNM",
  columns: [
    {
      columnName: "Login ID",
      accessor: "USER_NAME",
      width: 140,
      type: "default",
    },
    {
      columnName: "Customer Name",
      accessor: "CUST_NAME",
      width: 150,
    },
    {
      columnName: "Login Date",
      accessor: "LOGIN_DT",
      width: 160,
      Cell: components.DateTimeCell,
      type: "default",
    },
    {
      columnName: "Login By",
      accessor: "LOGIN_BY",
      Filter: filters.SelectColumnFilter,
      width: 150,
    },
    {
      columnName: "Device Name",
      accessor: "DEVICE_NM",
      width: 200,
    },
  ],
};
