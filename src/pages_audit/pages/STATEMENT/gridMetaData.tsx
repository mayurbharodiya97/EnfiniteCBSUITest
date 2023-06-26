import { GridMetaDataType } from "components/dataTableStatic";
export const AccountDetailsGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "TRAN_CD",

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
    // {
    //   accessor: "CREDIT",
    //   columnName: "CREDIT",
    //   sequence: 1,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 200,
    //   minWidth: 200,
    //   maxWidth: 400,
    // },
    // {
    //   accessor: "COMP_CD",
    //   columnName: "Narration",
    //   sequence: 2,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 360,
    //   minWidth: 360,
    //   maxWidth: 400,
    // },
    // {
    //   accessor: "CONFIRMED",
    //   columnName: "Cheque no",
    //   sequence: 3,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 180,
    //   minWidth: 180,
    //   maxWidth: 180,
    // },
    // {
    //   accessor: "SCROLL1",
    //   columnName: "Debit",
    //   sequence: 4,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 140,
    //   minWidth: 160,
    //   maxWidth: 220,
    // },
    // {
    //   accessor: "TABLE_FLAG",
    //   columnName: "Credit",
    //   sequence: 5,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 140,
    //   minWidth: 160,
    //   maxWidth: 220,
    //   color: "greeen",
    // },
    // {
    //   accessor: "PAID",
    //   columnName: "Balance",
    //   sequence: 5,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 90,
    //   minWidth: 90,
    //   maxWidth: 200,
    // },
    // {
    //   accessor: "TYPE_CD",
    //   columnName: "Tr.Br.",
    //   sequence: 5,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 70,
    //   minWidth: 70,
    //   maxWidth: 200,
    // },
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
      columnName: "Narration",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 360,
      minWidth: 360,
      maxWidth: 400,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Cheque no",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
    {
      accessor: "DEBIT",
      columnName: "Debit",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
    },
    {
      accessor: "CREDIT",
      columnName: "Credit",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 160,
      maxWidth: 220,
      color: "greeen",
    },
    {
      accessor: "BALANCE",
      columnName: "Balance",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 90,
      maxWidth: 200,
    },
    {
      accessor: "TR_BR",
      columnName: "Tr.Br.",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
    },
  ],
};
