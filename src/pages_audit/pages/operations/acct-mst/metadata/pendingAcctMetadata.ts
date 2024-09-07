import { GridMetaDataType } from "@acuteinfo/common-base";

export const pendingAcctMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Pending Accounts",
    rowIdColumn: "REQUEST_ID",
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
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "calc(100vh - 260px)",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "REQUEST_ID",
      columnName: "Req. ID",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
    },
    {
      accessor: "CUSTOMER_NAME",
      columnName: "CustomerName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 280,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 280,
    },
    {
      accessor: "CONFIRMED_FLAG",
      columnName: "Confirm Flag", // value of fresh/existing
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "UPD_TAB_NAME",
      columnName: "Update Type",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      accessor: "ACCOUNT_NUMBER",
      columnName: "Account Number",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      accessor: "TYPE_NM",
      columnName: "Type Name",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "Account Type",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      accessor: "REQ_FLAG",
      columnName: "Request Flag",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      accessor: "LAST_MODIFIED",
      columnName: "LastModified",
      sequence: 12,
      alignment: "left",
      dateFormat: "dd/MM/yyyy",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "Verified Date",
      sequence: 13,
      alignment: "left",
      dateFormat: "dd/MM/yyyy",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    filters: [],
    columns: [
      {
        accessor: "REQUEST_ID",
        columnName: "Req. ID",
        sequence: 1,
        alignment: "left",
        componentType: "default",
        width: 80,
        minWidth: 70,
        maxWidth: 100,
      },
      {
        accessor: "CUSTOMER_NAME",
        columnName: "CustomerName",
        sequence: 2,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 280,
      },
      {
        accessor: "REMARKS",
        columnName: "Remarks",
        sequence: 3,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 280,
      },
      {
        accessor: "CONFIRMED_FLAG",
        columnName: "Confirm Flag", // value of fresh/existing
        sequence: 4,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "UPD_TAB_NAME",
        columnName: "Update Type",
        sequence: 5,
        alignment: "left",
        componentType: "default",
        width: 100,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        accessor: "ACCT_CD",
        columnName: "Account Number",
        sequence: 6,
        alignment: "left",
        componentType: "default",
        width: 120,
        minWidth: 120,
        maxWidth: 120,
      },
      {
        accessor: "TYPE_NM",
        columnName: "Type Name",
        sequence: 7,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "ACCT_TYPE",
        columnName: "Account Type",
        sequence: 8,
        alignment: "left",
        componentType: "default",
        width: 100,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        accessor: "REQ_FLAG",
        columnName: "Request Flag",
        sequence: 9,
        alignment: "left",
        componentType: "default",
        width: 100,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        accessor: "CHECKER",
        columnName: "Checker",
        sequence: 10,
        alignment: "left",
        componentType: "default",
        width: 80,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        accessor: "MAKER",
        columnName: "Maker",
        sequence: 11,
        alignment: "left",
        componentType: "default",
        width: 80,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        accessor: "LAST_MODIFIED",
        columnName: "LastModified",
        sequence: 12,
        alignment: "left",
        dateFormat: "dd/MM/yyyy",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "VERIFIED_DATE",
        columnName: "Verified Date",
        sequence: 13,
        alignment: "left",
        dateFormat: "dd/MM/yyyy",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },



    //   {
    //     accessor: "ENTRY_TYPE",
    //     columnName: "Req. Type", // value for fresh/existing
    //     sequence: 8,
    //     alignment: "left",
    //     componentType: "default",
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 180,
    //   },

    //   {
    //     accessor: "CUSTOMER_ID",
    //     columnName: "CustomerId",
    //     sequence: 6,
    //     alignment: "left",
    //     componentType: "default",
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 180,
    //   },

    //   {
    //     accessor: "CUSTOMER_TYPE_FLAG",
    //     columnName: "CustomerType",
    //     sequence: 7,
    //     alignment: "left",
    //     componentType: "default",
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 180,
    //   },

    //   {
    //     accessor: "CHECKER",
    //     columnName: "Checker",
    //     sequence: 11,
    //     alignment: "center",
    //     componentType: "default",
    //     isReadOnly: true,
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 140,
    //   },
  ],
};
