import { GridMetaDataType } from "@acuteinfo/common-base";

export const lienConfirmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "UNIQUE_NUM",
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
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    hiddenFlag: "_hidden",
    // searchPlaceholder: "Records of Lien Confirmation",
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
      columnName: "AccountNum",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 190,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountHolder",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 190,
      maxWidth: 290,
    },
    {
      accessor: "LIEN_CD",
      columnName: "LienCode",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 140,
    },

    {
      accessor: "PARENT_CD_NM",
      columnName: "ParentCodeName",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 145,
      minWidth: 70,
      maxWidth: 250,
    },
    {
      accessor: "LIEN_STATUS_DISPLAY",
      columnName: "LienStatus",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 112,
      minWidth: 70,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 70,
      maxWidth: 250,
    },

    {
      accessor: "EFECTIVE_DT",
      columnName: "EffectiveDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 136,
      minWidth: 70,
      maxWidth: 150,
    },

    {
      accessor: "REMOVAL_DT",
      columnName: "RemovalDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 141,
      minWidth: 70,
      maxWidth: 150,
    },
    {
      accessor: "LIEN_AMOUNT",
      columnName: "LienAmount",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      width: 140,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "LIEN_REASON_NM",
      columnName: "LienReason",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACKNOWLEDGEMENT_NO",
      columnName: "AcknowledgementNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 70,
      maxWidth: 250,
    },
    {
      accessor: "TRANSACTION_ID",
      columnName: "TransactionId",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 70,
      maxWidth: 250,
    },
    {
      accessor: "REPORTING_DATE",
      columnName: "ReportingDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 136,
      minWidth: 70,
      maxWidth: 150,
    },
  ],
};
