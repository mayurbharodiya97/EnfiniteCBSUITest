import { components } from "@acuteinfo/common-base";
export const utilityBillPayAPIResMetaData = {
  title: "APIResponseDetailsReport",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  columns: [
    {
      columnName: "LoginID",
      accessor: "USER_NAME",
      width: 140,
      type: "default",
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
      width: 180,
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 150,
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
