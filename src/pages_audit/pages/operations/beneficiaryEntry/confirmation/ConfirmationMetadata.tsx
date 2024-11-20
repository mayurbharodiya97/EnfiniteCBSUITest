import { GridMetaDataType } from "@acuteinfo/common-base";
import { isValid } from "date-fns";

export const BenefiAccountConfirmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "index",
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
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "SR_CD",
      columnName: "SrNo",
      sequence: 1,
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },

    {
      accessor: "AC_UQ_ID",
      columnName: "Ordering A/c No.",
      sequence: 2,
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "ACCT_NM",
      columnName: "A/c Holder Name",
      sequence: 2,
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "TO_IFSCCODE",
      columnName: "IFSCCode",
      sequence: 2,
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "TO_ACCT_TYPE",
      columnName: "AcctType",
      sequence: 3,
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 150,
      isVisible: true,
    },

    {
      accessor: "TO_ACCT_NO",
      columnName: "ACNo",
      sequence: 4,
      componentType: "default",
      width: 160,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "TO_ACCT_NM",
      columnName: "Account_Name",
      sequence: 5,
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 250,
    },

    {
      accessor: "TO_ADD1",
      columnName: "Address",
      sequence: 6,
      componentType: "default",
      width: 320,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      accessor: "TO_CONTACT_NO",
      columnName: "MobileNo",
      sequence: 7,
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TO_EMAIL_ID",
      columnName: "EmailID",
      sequence: 8,
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "ACTIVE_FLAG",
      columnName: "Active",
      sequence: 9,
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 120,
    },
    {
      accessor: "REMARKS",
      columnName: "Reamrks",
      sequence: 10,
      componentType: "default",
      width: 260,
      minWidth: 200,
      maxWidth: 300,
    },
    {
      accessor: "TO_LEI_NO",
      columnName: "LEI No.",
      sequence: 11,
      componentType: "default",
      width: 260,
      minWidth: 200,
      maxWidth: 300,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 10,
      alignment: "center",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "VerifiedBy",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "VerifiedDate",
      sequence: 12,
      alignment: "center",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
  ],
};