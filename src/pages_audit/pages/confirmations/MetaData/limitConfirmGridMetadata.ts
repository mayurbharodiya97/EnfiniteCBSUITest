import { GridMetaDataType } from "@acuteinfo/common-base";

export const limitConfirmGridMetaData: GridMetaDataType = {
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
    // searchPlaceholder: "Records of Limit Confirmation",
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
      columnName: "AccountNum",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 190,
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
      accessor: "EXPIRY_DT",
      columnName: "ExpiryDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 70,
      maxWidth: 140,
    },

    {
      accessor: "INT_RATE",
      columnName: "IntRate",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 80,
      minWidth: 50,
      maxWidth: 100,
    },

    {
      accessor: "PENAL_RATE",
      columnName: "OverDrawn",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 105,
      minWidth: 50,
      maxWidth: 140,
    },

    {
      accessor: "MARGIN",
      columnName: "Margin%",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 100,
    },

    {
      accessor: "LIMIT_AMOUNT",
      columnName: "LimitAmount",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 118,
      minWidth: 90,
      maxWidth: 150,
    },
    {
      accessor: "DRAWING_POWER",
      columnName: "DrawingPower",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 118,
      minWidth: 90,
      maxWidth: 160,
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
      accessor: "DESCRIPTION",
      columnName: "Description",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 240,
      minWidth: 190,
      maxWidth: 290,
    },

    {
      accessor: "AD_HOC_LIMIT_FLG",
      columnName: "LimitType",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 129,
      minWidth: 115,
      maxWidth: 200,
    },
    {
      accessor: "SECURITY",
      columnName: "OtherDescription",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 290,
    },
    {
      accessor: "EXPIRED_FLAG",
      columnName: "ExpiredFlag",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 134,
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
