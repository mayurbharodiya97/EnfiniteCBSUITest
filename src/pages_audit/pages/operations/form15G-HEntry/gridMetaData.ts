import { GridMetaDataType } from "components/dataTableStatic";

export const Form15GHEntryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "UNIQUE_ID",
    defaultColumnConfig: {
      width: 350,
      minWidth: 300,
      maxWidth: 400,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    allowRowSelection: false,
    enablePagination: true,
    pageSizes: [20, 40, 60],
    defaultPageSize: 20,
    containerHeight: {
      min: "77vh",
      max: "77vh",
    },
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
    footerNote: "NoteDoubleClickOnViewDetails",
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CustomerId",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountName",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "PAN_NO",
      columnName: "PAN",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "FORM_NM",
      columnName: "FormName",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ACTIVE",
      columnName: "Active",
      sequence: 6,
      alignment: "left",
      componentType: "editableCheckbox",
      width: 60,
      minWidth: 50,
      maxWidth: 90,
      isReadOnly: true,
    },
    {
      accessor: "FORM_EXPIRY_DATE",
      columnName: "FormExpiryDate",
      sequence: 7,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 150,
      minWidth: 120,
      maxWidth: 170,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 90,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 9,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "CONFIRMED_DIS",
      columnName: "Confirmed",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 190,
    },
    {
      accessor: "UPLOAD_DIS",
      columnName: "Upload",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 100,
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "VerifiedBy",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 90,
      maxWidth: 150,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "VerifiedDate",
      sequence: 13,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "UNIQUE_ID",
      columnName: "UniqueId",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
      isVisible: false,
    },
  ],
};
