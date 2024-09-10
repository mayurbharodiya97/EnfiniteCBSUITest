import { GridMetaDataType } from "components/dataTableStatic";

export const gstOutwardEntryConfirmationGrid: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "REF_TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "65vh",
      max: "65vh",
    },
    isCusrsorFocused: true,
    allowRowSelection: false,
  },
  columns: [
    {
      accessor: "REF_TRAN_CD",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "BranchCode",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AccountType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "ACCT_CD",
      columnName: "accountCode",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
    {
      accessor: "CONFIM_DISP",
      columnName: "Confirmed",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "VerifiedDate",
      sequence: 2,
      alignment: "left",
      componentType: "date",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "VerifiedBy",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 2,
      alignment: "left",
      componentType: "date",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
  ],
};
