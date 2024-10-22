export const mobEmailUpdLogDetailsMetaData = {
  title: "UpdateDetails",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  hideShowFiltersSwitch: true,
  columns: [
    {
      columnName: "Source",
      accessor: "APP_INDICATOR",
      width: 150,
      type: "default",
    },
    {
      columnName: "CustomerID",
      accessor: "APP_CUSTOMER_ID",
      width: 150,
      type: "default",
    },
    {
      columnName: "OldValue",
      accessor: "OLD_VAL",
      width: 150,
      type: "default",
    },
    {
      columnName: "NewValue",
      accessor: "NEW_VAL",
      width: 150,
      type: "default",
    },
    {
      columnName: "ResponseCode",
      accessor: "RESPONSE_CD",
      width: 150,
      type: "default",
    },
    {
      columnName: "ResponseMessage",
      accessor: "RESPONSE_MSG",
      width: 200,
      type: "default",
    },
  ],
};
