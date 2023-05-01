import { components, filters } from "components/report";

export const userActivityMetaData = {
  title: "User Activity",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  retrievalType: "DATEUSERNM",
  groupBy: ["CUSTOM_USER_NM", "ACTIVITY_CD"],
  columns: [
    {
      columnName: "Login ID",
      accessor: "CUSTOM_USER_NM",
      width: 150,
      type: "default",
    },
    // {
    //   columnName: "Customer Name",
    //   accessor: "CUST_NAME",
    //   width: 150,
    //   type: "default",
    // },
    {
      columnName: "Activity Code",
      accessor: "ACTIVITY_CD",
      width: 150,
      type: "default",
    },
    {
      columnName: "Activity Time",
      accessor: "LAST_ACTIVITY",
      width: 150,
      Cell: components.DateTimeCell,
      type: "default",
    },
    {
      columnName: "Activity Type",
      accessor: "LAST_ACTIVITY_TYPE",
      width: 220,
      type: "default",
    },
    {
      columnName: "Activity Description",
      accessor: "LAST_ACTIVITY_DESC",
      width: 300,
    },
    {
      columnName: "Device IP",
      accessor: "DEVICE_IP",
      width: 140,
    },
    {
      columnName: "Device Name",
      accessor: "DEVICE_NM",
      width: 140,
    },
    {
      columnName: "Device OS",
      accessor: "DEVICE_OS",
      width: 120,
    },
    {
      columnName: "Latitude",
      accessor: "latitude",
      width: 140,
    },
    {
      columnName: "Longitude",
      accessor: "longitude",
      width: 140,
    },
  ],
};
