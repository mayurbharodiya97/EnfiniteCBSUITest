import { GridMetaDataType } from "@acuteinfo/common-base";
export const LienGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "LienDetail",
    rowIdColumn: "SR_CD",
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
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "63vh",
      max: "63vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    searchPlaceholder: "Lien Detail",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 70,
      maxWidth: 130,
      isAutoSequence: true,
    },
    {
      accessor: "LIEN_DISPL",
      columnName: "Lien",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 230,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 215,
      minWidth: 150,
      maxWidth: 240,
    },

    {
      accessor: "EFECTIVE_DT",
      columnName: "EffectiveDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 136,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "REMOVAL_DT",
      columnName: "RemovalDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 139,
      minWidth: 90,
      maxWidth: 160,
    },
    {
      accessor: "LIEN_AMOUNT",
      columnName: "LienAmount",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 120,
      minWidth: 60,
      maxWidth: 150,
    },
    {
      accessor: "LIEN_STATUS_DISPLAY",
      columnName: "Status",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "DISPLAY_CONFIRMED",
      columnName: "Confirmed",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 101,
      minWidth: 80,
      maxWidth: 150,
    },

    {
      accessor: "LIEN_REASON_CD",
      columnName: "Reason",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 230,
      minWidth: 150,
      maxWidth: 350,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 105,
      minWidth: 70,
      maxWidth: 120,
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "VerifiedBy",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 124,
      minWidth: 70,
      maxWidth: 150,
    },
  ],
};
