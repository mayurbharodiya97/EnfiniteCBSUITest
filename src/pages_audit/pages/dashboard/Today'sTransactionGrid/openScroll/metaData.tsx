import { components, filters } from "components/report";

export const scrollMetaData = {
  title: "",
  disableGroupBy: true,
  hideFooter: false,
  hideAmountIn: true,
  retrievalType: "",
  groupBy: [""],
  columns: [
    {
      columnName: "V.No.",
      accessor: "TRAN_CD",
      width: 100,
    },
    {
      columnName: "A/C Number",
      accessor: "ACCT_NO",
      width: 180,
    },
    {
      columnName: "A/C Holder",
      accessor: "ACCT_NM",
      width: 310,
    },
    {
      columnName: "Remarks",
      accessor: "REMARKS",
      width: 310,
    },
    //

    {
      columnName: "Cheque No.",
      accessor: "CHEQUE_NO",
      width: 120,
      type: "default",
    },
    {
      columnName: "Credit",
      accessor: "CREDIT",
      width: 150,
      color: "green",
      isDisplayTotal: true,
    },

    {
      columnName: "Debit",
      accessor: "DEBIT",
      width: 150,
      color: "red",
      isDisplayTotal: true,
    },
    {
      columnName: "Tr.Branch",
      accessor: "BRANCH_CD",
      width: 100,
    },
    {
      columnName: "Entry Time",
      accessor: "TIME",
      Cell: components.TimeCell,
      width: 120,
    },
    {
      columnName: "Maker",
      accessor: "MAKER",
      // Filter: filters.SelectColumnFilter,
      width: 150,
    },
    {
      columnName: "Checker",
      accessor: "CHECKER",
      // Filter: filters.SelectColumnFilter,
      width: 150,
    },
  ],
};
