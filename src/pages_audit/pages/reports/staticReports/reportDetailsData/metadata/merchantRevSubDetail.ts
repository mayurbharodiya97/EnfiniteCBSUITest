import { components } from "components/report";
export const merchantRevSubDetailsMetaData = {
  title: "Report Details",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
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
      columnName: "Sr. No.",
      accessor: "SR_CD",
      width: 100,
      type: "default",
    },
    {
      columnName: "Response Date",
      accessor: "REQ_DATE",
      width: 160,
      // Cell: components.DateTimeCell,
      type: "default",
    },
    {
      columnName: "API Name.",
      accessor: "API_NAME",
      width: 170,
    },
    {
      columnName: "Status.",
      accessor: "STATUS",
      width: 170,
    },
    {
      columnName: "Resp. Code",
      accessor: "RESPONSE_CODE",
      width: 150,
    },
    {
      columnName: "Ref.Tran.ID",
      accessor: "REF_TRAN_ID",
      width: 150,
    },
    {
      columnName: "Response Message",
      accessor: "RESPONSE_MSG",
      width: 180,
    },
  ],
};
