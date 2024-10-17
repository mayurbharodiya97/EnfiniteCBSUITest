import { GridMetaDataType } from "@acuteinfo/common-base";

export const PositivePayEntryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 350,
      minWidth: 300,
      maxWidth: 400,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 50, 100],
    defaultPageSize: 20,
    containerHeight: {
      min: "77vh",
      max: "77vh",
    },
    isCusrsorFocused: true,
    allowRowSelection: false,
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 150,
      isAutoSequence: true,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "BranchCode",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AccType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AccCode",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountName",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 150,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "ChequeNumber",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "CHEQUE_DT",
      columnName: "ChequeDate",
      sequence: 7,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_AMT",
      columnName: "Amount",
      sequence: 8,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 70,
      maxWidth: 300,
    },
    {
      accessor: "PAYEE_NM",
      columnName: "PayeeName",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 400,
      showTooltip: true,
    },
    {
      accessor: "REQ_CHANNEL_DIS",
      columnName: "RequestFrom",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 12,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
  ],
};
