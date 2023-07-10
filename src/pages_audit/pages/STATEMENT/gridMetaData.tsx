import { GridMetaDataType } from "components/dataTableStatic";
export const AccountDetailsGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Account Statement",
    rowIdColumn: "ID",

    defaultColumnConfig: {
      width: 200,
      maxWidth: 300,
      minWidth: 200,
    },

    allowColumnReordering: false,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 40, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "33vh",
      max: "33vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hideFooter: false,
  },
  columns: [
    {
      accessor: "DATE",
      columnName: "Date",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      accessor: "NARRATION",
      columnName: "Transaction Details",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 360,
      minWidth: 360,
      maxWidth: 400,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Cheque/Ref No",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
    {
      accessor: "VALUE_DATE",
      columnName: "Value Date",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
    {
      accessor: "DEBIT",
      columnName: "Withdrawal",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
      color: "red",
    },
    {
      accessor: "CREDIT",
      columnName: "Deposit",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
      color: "green",
    },
    {
      accessor: "BALANCE",
      columnName: "Closing Balance",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "TR_BR",
      columnName: "Transaction Branch",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
  ],
};
