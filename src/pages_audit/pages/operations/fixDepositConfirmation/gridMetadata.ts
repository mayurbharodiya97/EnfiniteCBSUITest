import { GridMetaDataType } from "@acuteinfo/common-base";

export const FDConfirmationGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "ROW_ID",
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
    pageSizes: [20, 40, 60],
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
      accessor: "ROW_ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 40,
      maxWidth: 150,
      isAutoSequence: true,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 40,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AcctType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 110,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AcctNum",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AcctHolderName",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 450,
      minWidth: 150,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "FD_NO",
      columnName: "FDNo",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "TRN_FLAG_DESC",
      columnName: "TransactionType",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "ADVICE",
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "Advice",
      sequence: 14,
      alignment: "right",
      width: 100,
      minWidth: 70,
      maxWidth: 150,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.TRN_FLAG === "P") {
          return false;
        } else {
          return true;
        }
      },
    },
  ],
};

export const FDConfDetailsGridMetadata: GridMetaDataType = {
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
    hideHeader: true,
    hideFooter: true,
    disableGroupBy: true,
    enablePagination: false,
    containerHeight: {
      min: "28vh",
      max: "28vh",
    },
    isCusrsorFocused: true,
    allowRowSelection: false,
  },
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "VoucherNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 40,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AccType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 85,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AcctNum",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AcctHolderName",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 350,
      minWidth: 150,
      maxWidth: 500,
      showTooltip: true,
    },
    {
      accessor: "FD_NO",
      columnName: "FDNo",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 170,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 55,
      minWidth: 30,
      maxWidth: 170,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "ChequeNo",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 170,
      showTooltip: true,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 130,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "User",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 65,
      minWidth: 50,
      maxWidth: 150,
      showTooltip: true,
    },
    {
      accessor: "CASH_DENO_STATUS",
      columnName: "Denomination",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "SCROLL1",
      columnName: "ScrollTokenNo",
      sequence: 12,
      alignment: "right",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "SIGNATURE",
      sequence: 13,
      buttonLabel: "Sign",
      width: 90,
      minWidth: 80,
      maxWidth: 110,
    },
  ],
};

export const FDConfUpdatedtlMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SR_CD",
    defaultColumnConfig: {
      width: 350,
      minWidth: 300,
      maxWidth: 400,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    hideFooter: true,
    disableGroupBy: true,
    enablePagination: false,
    containerHeight: {
      min: "28vh",
      max: "28vh",
    },
    isCusrsorFocused: true,
    allowRowSelection: false,
  },
  columns: [
    {
      accessor: "SR_CD",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
      isAutoSequence: true,
    },
    {
      accessor: "ACTION",
      columnName: "Action",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 10,
      maxWidth: 350,
    },
    {
      accessor: "COLUMN_LABEL",
      columnName: "LabelName",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 150,
      maxWidth: 350,
    },
    {
      accessor: "OLD_VALUE",
      columnName: "OldValue",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 150,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "NEW_VALUE",
      columnName: "NewValue",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 150,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "MODIFIED_BY",
      columnName: "Maker",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 150,
      maxWidth: 350,
    },
  ],
};
