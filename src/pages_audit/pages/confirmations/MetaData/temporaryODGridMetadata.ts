import { GridMetaDataType } from "@acuteinfo/common-base";

export const tempODConfirmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "ENTERED_DATE",
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
    pageSizes: [20, 30, 50],
    defaultPageSize: 14,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    hiddenFlag: "_hidden",
    searchPlaceholder: "Records of Temporary OD Against Confirmation",
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
      accessor: "FULL_ACCT_NO",
      columnName: "AccountNumber",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 190,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountName",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 190,
      maxWidth: 290,
    },
    {
      accessor: "CODE_DESC",
      columnName: "Parameters",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 174,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "FLAG",
      columnName: "Flag",
      sequence: 4,
      alignment: "center",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 74,
      minWidth: 50,
      maxWidth: 100,
    },
    {
      accessor: "AMOUNT_UPTO",
      columnName: "AmountUpTo",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      width: 117,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "FROM_EFF_DATE",
      columnName: "EffectiveFromDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 153,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "TO_EFF_DATE",
      columnName: "EffectiveToDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 163,
      minWidth: 120,
      maxWidth: 180,
    },
    {
      accessor: "FORCE_EXP_DT",
      columnName: "ForceExpDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 163,
      minWidth: 120,
      maxWidth: 180,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 107,
      minWidth: 80,
      maxWidth: 150,
    },

    {
      accessor: "Defination",
      columnName: "Defination",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
