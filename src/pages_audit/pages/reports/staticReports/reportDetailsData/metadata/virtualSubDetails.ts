import { components } from "@acuteinfo/common-base";
export const virtualSubDetailsMetaData = {
  title: "APIResponseDetailsReport",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  hideShowFiltersSwitch: true,

  // retrievalType: "FUNDTRAN",
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
      columnName: "LoginID",
      accessor: "USER_NAME",
      width: 140,
      type: "default",
    },
    {
      columnName: "FromACNo",
      accessor: "FROM_ACCT_NO",
      width: 170,
    },
    {
      columnName: "ToACNo",
      accessor: "TO_ACCT_NO",
      width: 170,
    },
    {
      columnName: "ResponseDate",
      accessor: "REQ_DATE",
      width: 160,
      Cell: components.DateTimeCell,
    },
    {
      columnName: "ApiName",
      accessor: "API_NAME",
      width: 150,
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 150,
    },

    {
      columnName: "RespCode",
      accessor: "RESPONSE_CODE",
      width: 150,
    },
    {
      columnName: "RefTranID",
      accessor: "REF_TRAN_ID",
      width: 150,
    },
    {
      columnName: "ResponseMessage",
      accessor: "RESPONSE_MSG",
      width: 180,
    },
  ],
};
