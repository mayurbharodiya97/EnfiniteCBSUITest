import { GridMetaDataType } from "@acuteinfo/common-base";

export const chequeBkConfirmGridMetaData: GridMetaDataType = {
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
      min: "73vh",
      max: "73vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    hiddenFlag: "_hidden",
    searchPlaceholder: "Records of Chequebook Confirmation",
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
      columnName: "AccountNum",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 125,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountHolder",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 190,
      maxWidth: 290,
    },

    {
      accessor: "CHEQUE_FROM_TO",
      columnName: "ChequeSeries",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 125,
      minWidth: 90,
      maxWidth: 150,
    },

    {
      accessor: "CHEQUE_TOTAL",
      columnName: "NoOfCheques",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 140,
      minWidth: 70,
      maxWidth: 160,
    },
    {
      accessor: "AMOUNT",
      columnName: "ChargeAmount",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 140,
      minWidth: 70,
      maxWidth: 160,
    },

    {
      accessor: "LAST_ENTERED_BY",
      columnName: "User",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 131,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "SERVICE_TAX",
      columnName: "GST",
      sequence: 9,
      alignment: "right",
      componentType: "default",
      width: 76,
      minWidth: 50,
      maxWidth: 100,
    },
    {
      accessor: "TRAN_BAL",
      columnName: "Balance",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 110,
      minWidth: 90,
      maxWidth: 150,
    },
    {
      accessor: "AUTO_CHQBK_FLAG",
      columnName: "AutoIssueFlag",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 129,
      minWidth: 115,
      maxWidth: 200,
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
