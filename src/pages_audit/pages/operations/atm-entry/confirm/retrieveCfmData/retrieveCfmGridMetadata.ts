import { GridMetaDataType } from "@acuteinfo/common-base";

export const RetrieveGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ATM Confirmation Retrieve Data",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "48vh",
      max: "48vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "CUSTOMER_ID",
      columnName: "CustomerId",
      sequence: 2,
      componentType: "default",
      alignment: "right",
      width: 115,
      maxWidth: 150,
      minWidth: 80,
    },
    {
      accessor: "ACCT_NM",
      columnName: "CustomerName",
      sequence: 3,
      componentType: "default",
      width: 180,
      maxWidth: 220,
      minWidth: 130,
      alignment: "left",
    },
    {
      accessor: "SB_ACCT_CD",
      columnName: "SBAccountCode",
      sequence: 3,
      componentType: "default",
      width: 165,
      maxWidth: 220,
      minWidth: 150,
      alignment: "left",
    },
    {
      accessor: "CA_ACCT_CD",
      columnName: "CAAccountCode",
      sequence: 4,
      componentType: "default",
      width: 165,
      maxWidth: 220,
      minWidth: 150,
      alignment: "left",
    },
    {
      accessor: "CC_ACCT_CD",
      columnName: "CCAccountCode",
      sequence: 6,
      componentType: "default",
      width: 165,
      maxWidth: 220,
      minWidth: 150,
      alignment: "left",
    },
    {
      accessor: "DISPLAY_STATUS",
      columnName: "Status",
      sequence: 6,
      componentType: "default",
      width: 130,
      maxWidth: 150,
      minWidth: 100,
      alignment: "left",
    },

    {
      accessor: "REQ_DT",
      columnName: "RequestDate",
      sequence: 7,
      alignment: "center",
      componentType: "date",
      placeholder: "",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CITIZEN_ID",
      columnName: "CitizenID",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      placeholder: "",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "CARD_NO",
      columnName: "CardNo",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 170,
      minWidth: 150,
      maxWidth: 220,
    },

    {
      accessor: "CARD_TYPE",
      columnName: "CardType",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 70,
      maxWidth: 120,
    },
    {
      accessor: "DISPLAY_CONFIRMED",
      columnName: "Confirmed",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 100,
      maxWidth: 200,
    },

    {
      accessor: "LAST_ENT_BRANCH_CD",
      columnName: "Last Entered Branch",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 100,
      maxWidth: 200,
    },

    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Last Entered By",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 160,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Last Modified Date",
      sequence: 14,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
  ],
};