import { components, filters } from "@acuteinfo/common-base";

export const accountDeletionMetaData = {
  title: "Account Deletion Request Report",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  retrievalType: "DATE",
  autoFetch: false,
  // filters: [
  //   {
  //     accessor: "FROM_DT",
  //     columnName: "From Date",
  //     filterComponentType: "valueDateFilter",
  //     gridProps: {
  //       xs: 12,
  //       md: 12,
  //       sm: 12,
  //     },
  //   },
  //   {
  //     accessor: "TO_DT",
  //     columnName: "To Date",
  //     filterComponentType: "valueDateFilter",
  //     gridProps: {
  //       xs: 12,
  //       md: 12,
  //       sm: 12,
  //     },
  //   },
  // ],
  columns: [
    {
      columnName: "Request Date",
      accessor: "REQ_DT",
      width: 160,
      // Cell: components.DateTimeCell,
      type: "default",
    },
    {
      columnName: "Login ID",
      accessor: "USER_NAME",
      width: 140,
      type: "default",
    },
    {
      columnName: "Primary CB/CID",
      accessor: "PRIMARY_CBNUMBER",
      width: 150,
    },
    {
      columnName: "Accept Status",
      accessor: "CONFIRMED",
      Filter: filters.SelectColumnFilter,
      width: 150,
    },
    {
      columnName: "Deletion Reason",
      accessor: "DELETION_REASON",
      width: 200,
    },
    {
      columnName: "Maker Remark",
      accessor: "MAKER_REMARKS",
      width: 200,
    },
    {
      columnName: "Checker Remark",
      accessor: "CHECKER_REMARKS",
      width: 200,
    },
  ],
};
