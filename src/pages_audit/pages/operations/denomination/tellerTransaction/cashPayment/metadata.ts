import { GridMetaDataType } from "@acuteinfo/common-base";

export const cashPaymentMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Transactions",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "30vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "Vno",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "Type",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "ACCT_CD",
      columnName: "ACNumber",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AcctHolderName",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 220,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 100,
    },
    {
      accessor: "SCROLL1",
      columnName: "Token",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "AMOUNT",
      columnName: "amount",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      width: 120,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 210,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "ChequeNo",
      sequence: 9,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "VerifiedBy",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 140,
    },
  ],
};
