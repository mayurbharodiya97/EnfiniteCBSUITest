import { GridMetaDataType } from "@acuteinfo/common-base";

export const stopPayConfirmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
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
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    hiddenFlag: "_hidden",
    // searchPlaceholder: "Records of Stop Payment Confirmation",
    footerNote: "FooterNoteMsgCfmRej",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 75,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },

    {
      accessor: "TRAN_DT",
      columnName: "Date",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 90,
      minWidth: 70,
      maxWidth: 120,
    },

    {
      accessor: "FULL_ACCT_NO",
      columnName: "AccountNumber",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 190,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountName",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 190,
      maxWidth: 290,
    },
    {
      accessor: "CHEQUE_FROM_TO",
      columnName: "ChequeFromTo",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 142,
      minWidth: 100,
      maxWidth: 200,
    },

    {
      accessor: "CHEQUE_DT",
      columnName: "ChequeDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 70,
      maxWidth: 150,
    },

    {
      accessor: "CHEQUE_AMOUNT",
      columnName: "ChequeAmount",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      width: 140,
      minWidth: 100,
      maxWidth: 200,
    },

    {
      accessor: "LAST_ENTERED_BY",
      columnName: "LastEnteredBy",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 132,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "TRAN_BAL",
      columnName: "Balance",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 103,
      minWidth: 80,
      maxWidth: 150,
    },

    {
      accessor: "VERIFIED_BY",
      columnName: "VerifiedBy",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
