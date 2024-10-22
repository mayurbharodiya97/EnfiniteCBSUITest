import { components } from "@acuteinfo/common-base";
export const schduleDetailMetaData = {
  title: "ScheduleDetailsReport",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",

  columns: [
    // {
    //   columnName: "Sr.No.",
    //   accessor: "SR_CD",
    //   width: 140,
    //   type: "default",
    // },
    {
      columnName: "ScheduleDate",
      accessor: "EXECUTE_DT",
      width: 180,
      Cell: components.DateTimeCell,
    },
    {
      columnName: "FromSource",
      accessor: "FROM_SOURCE",
      width: 170,
    },
    {
      columnName: "FromAccountNo",
      accessor: "FROM_ACCT_NO",
      width: 170,
    },
    {
      columnName: "FromAccountName",
      accessor: "FROM_ACCT_NM",
      width: 160,
      // Cell: components.DateTimeCell,
    },
    {
      columnName: "ToSource",
      accessor: "TO_SOURCE",
      width: 150,
    },
    {
      columnName: "ToAccountNo",
      accessor: "TO_BEN_NO",
      width: 150,
    },
    {
      columnName: "ToAccountName",
      accessor: "TO_ACCT_NM",
      width: 150,
    },
    {
      columnName: "Amount",
      accessor: "AMOUNT",
      width: 150,
      isTotalWithCurrency: true,
      Cell: components.NumberCell,
      alignment: "right",
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 150,
    },
    {
      columnName: "ProcessDate",
      accessor: "PROCESS_DT",
      width: 180,
      Cell: components.DateTimeCell,
    },
    {
      columnName: "BenContactNo",
      accessor: "TO_MOBILE_NO",
      width: 180,
    },
    {
      columnName: "BenEmailID",
      accessor: "TO_EMAIL_ID",
      width: 180,
    },
    {
      columnName: "Remarks",
      accessor: "REMARKS",
      width: 180,
    },
    {
      columnName: "RefTranID",
      accessor: "REF_TRAN_ID",
      width: 180,
    },
    {
      columnName: "RefDate",
      accessor: "REF_TRAN_DATE",
      width: 180,
      Cell: components.DateTimeCell,
    },
    {
      columnName: "APIResponse",
      accessor: "API_RESPONSE",
      width: 170,
      Cell: components.ButtonRowCell,
      type: "default",
    },
  ],
};

export const schedulePaymentDetailMetaData = {
  title: "",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",

  columns: [
    {
      columnName: "ResponseDate",
      accessor: "REQ_DATE",
      width: 170,
      Cell: components.DateTimeCell,
      type: "default",
    },
    {
      columnName: "ApiName",
      accessor: "API_NAME",
      width: 170,
      type: "default",
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 120,
      type: "default",
    },
    // {
    //   columnName: "From Account",
    //   accessor: "FROM_ACCT_NO",
    //   width: 140,
    //   type: "default",
    // },
    // {
    //   columnName: "To Account",
    //   accessor: "TO_ACCT_NO",
    //   width: 140,
    //   type: "default",
    // },
    {
      columnName: "RespCode",
      accessor: "RESPONSE_CODE",
      width: 130,
      type: "default",
    },
    {
      columnName: "RefTranID",
      accessor: "REF_TRAN_ID",
      width: 140,
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
