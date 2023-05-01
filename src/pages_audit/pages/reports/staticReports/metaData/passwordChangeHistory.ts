import { components, filters } from "components/report";

export const passwordChangeHistoryMetaData = {
  title: "Password Change History",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  retrievalType: "DATE",
  columns: [
    {
      columnName: "Login ID",
      accessor: "USER_NAME",
      width: 150,
      type: "default",
    },
    {
      columnName: "Customer Name",
      accessor: "CUST_NAME",
      width: 320,
      type: "default",
    },
    {
      columnName: "Password Modify Date",
      accessor: "LOGIN_PASS_DT",
      width: 200,
      Cell: components.DateTimeCell,
      type: "default",
    },
    {
      columnName: "Channel",
      accessor: "LOGIN_BY",
      width: 140,
    },
  ],
};
