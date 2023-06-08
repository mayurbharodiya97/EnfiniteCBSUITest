import { components, filters } from "components/report";

export const scrollMetaData = {
  title: "Transaction Detail of Scroll : 1925 - Date : 04/06/2023 Sunday",
  disableGroupBy: true,
  hideFooter: "",
  hideAmountIn: "False",
  retrievalType: "DATEAPUSERSLIST",
  groupBy: [""],
  columns: [
    {
      columnName: "A/C Holder",
      accessor: "ACCOUNT_HOLDER",
      width: 140,
    },
    // {
    //   columnName: "Date",
    //   accessor: "TRAN_DT",
    //   width: 160,
    //   Cell: components.DateCell,
    //   type: "default",
    // },
    {
      columnName: "Cheque No.",
      accessor: "CHEQUE_NO",
      width: 140,
      type: "default",
    },
    {
      columnName: "Credit",
      accessor: "CREDIT",
      width: 170,
    },

    {
      columnName: "Debit",
      accessor: "DEBIT",
      // Filter: filters.SelectColumnFilter,
      width: 150,
    },
    {
      columnName: "V.No.",
      accessor: "V_NO",
      width: 200,
    },
    {
      columnName: "Tr.Branch",
      accessor: "TR_BRANCH",
      width: 200,
    },
    {
      columnName: "Entry Date",
      accessor: "ENTRY_DATE",
      width: 200,
    },
  ],
};
