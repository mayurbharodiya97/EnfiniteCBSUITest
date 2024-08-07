import { components } from "@acuteinfo/common-base";
export const schduleDetailMetaData = {
  title: "Report Details",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",

  columns: [
    {
      columnName: "Sr.No.",
      accessor: "SR_CD",
      width: 140,
      type: "default",
    },
    {
      columnName: "Schedule Date",
      accessor: "EXECUTE_DT",
      width: 180,
    },
    {
      columnName: "From Source",
      accessor: "FROM_SOURCE",
      width: 170,
    },
    {
      columnName: "From Account No.",
      accessor: "FROM_ACCT_NO",
      width: 170,
    },
    {
      columnName: "From Account Name",
      accessor: "FROM_ACCT_NM",
      width: 160,
      // Cell: components.DateTimeCell,
    },
    {
      columnName: "To Source",
      accessor: "TO_SOURCE",
      width: 150,
    },
    {
      columnName: "To Account No",
      accessor: "TO_BEN_NO",
      width: 150,
    },
    {
      columnName: "To Account Name",
      accessor: "TO_ACCT_NM",
      width: 150,
    },
    {
      columnName: "Amount",
      accessor: "AMOUNT",
      width: 150,
      Cell: components.NumberCell,
      alignment: "right",
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 150,
    },
    {
      columnName: "Process Date",
      accessor: "PROCESS_DT",
      width: 180,
    },
    {
      columnName: "Ben. Contact No.",
      accessor: "TO_MOBILE_NO",
      width: 180,
    },
    {
      columnName: "Ben. Email ID.",
      accessor: "TO_EMAIL_ID",
      width: 180,
    },
    {
      columnName: "Remarks",
      accessor: "REMARKS",
      width: 180,
    },
    {
      columnName: "Ref. Tran. ID",
      accessor: "REF_TRAN_ID",
      width: 180,
    },
    {
      columnName: "Ref. Date",
      accessor: "REF_TRAN_DATE",
      width: 180,
    },
    {
      columnName: "Api_Response",
      accessor: "API_RESPONSE",
      width: 170,
      // Cell: components.ButtonRowCell,
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
      columnName: "Response Date",
      accessor: "REQ_DATE",
      width: 170,
      type: "default",
    },
    {
      columnName: "API Name",
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
      columnName: "Resp. Code",
      accessor: "RESPONSE_CODE",
      width: 130,
      type: "default",
    },
    {
      columnName: "Ref. Tran. ID ",
      accessor: "REF_TRAN_ID",
      width: 140,
      type: "default",
    },
    {
      columnName: "Response Message",
      accessor: "RESPONSE_MSG",
      width: 200,
      type: "default",
    },
  ],
};
