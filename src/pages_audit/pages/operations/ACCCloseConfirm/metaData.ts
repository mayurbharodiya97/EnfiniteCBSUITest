import { GridMetaDataType } from "@acuteinfo/common-base";

export const ClosedAccountDetailsMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SR_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: false,
    hideHeader: true,
    footerNote: "DoubleClicktoviewSign",
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "20vh",
      max: "20vh",
    },
    allowColumnHiding: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "VoucherNumber",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_CD_NEW",
      columnName: "AccountNum",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountHolder",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 90,
      maxWidth: 190,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 5,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 350,
    },
    {
      accessor: "SDC",
      columnName: "SDC",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 110,
      maxWidth: 210,
    },
  ],
};
export const AccountClosedConfirm: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "INDEX",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: true,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "20vh",
      max: "20vh",
    },
    allowColumnHiding: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "ReferenceNumber",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONF_ACTION",
      columnName: "Confirmation",
      sequence: 1,
      alignment: "center",
      componentType: "buttonRowCell",
      buttonLabel: "Confirm / Reopen",
      width: 180,
      minWidth: 130,
      maxWidth: 230,
    },
    {
      accessor: "ACCT_CD_NEW",
      columnName: "AccountNum",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CLOSE_REASON_CD",
      columnName: "AcCloseReason",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Chequeno",
      sequence: 5,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "TOKEN_NO",
      columnName: "TokenNo",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "SCROLL1",
      columnName: "ScrollNo",
      sequence: 7,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHARGE_AMT",
      columnName: "ChargeAmount",
      sequence: 8,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 110,
      maxWidth: 210,
    },
    {
      accessor: "TRN_BRANCH_CD",
      columnName: "branchCode",
      sequence: 10,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "TRN_ACCT_TYPE",
      columnName: "TrxAccountType",
      sequence: 11,
      alignment: "right",
      componentType: "default",
      width: 160,
      minWidth: 110,
      maxWidth: 210,
    },
    {
      accessor: "TRN_ACCT_CD",
      columnName: "TrxAccountNum",
      sequence: 12,
      alignment: "right",
      componentType: "default",
      width: 160,
      minWidth: 110,
      maxWidth: 210,
    },
  ],
};