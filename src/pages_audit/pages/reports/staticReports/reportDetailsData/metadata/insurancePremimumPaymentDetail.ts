import { components } from "@acuteinfo/common-base";
export const InsurancePrimiDetailMetaData = {
  title: "APIResponseDetailsReport",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
  hideShowFiltersSwitch: true,

  columns: [
    {
      columnName: "ResponseDate",
      accessor: "REQ_DATE",
      width: 170,
      Cell: components.DateTimeCell,
    },
    {
      columnName: "ApiName",
      accessor: "API_NAME",
      width: 170,
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 160,
    },
    {
      columnName: "FromAccount",
      accessor: "FROM_ACCT_NO",
      width: 150,
    },
    {
      columnName: "ToAccount",
      accessor: "TO_ACCT_NO",
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
