import { GridMetaDataType } from "components/dataTableStatic";
export const tempODGridTodayMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "TemporaryODTodayDetail",
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
    hiddenFlag: "_hidden",
    searchPlaceholder: "Temporary-OD Detail",
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
      accessor: "FROM_EFF_DATE",
      columnName: "EffectiveFromDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 150,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "TO_EFF_DATE",
      columnName: "EffectiveToDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 162,
      minWidth: 120,
      maxWidth: 180,
    },
    {
      accessor: "CODE_DESC",
      columnName: "CodeDecription",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 150,
      maxWidth: 290,
    },
    {
      accessor: "AMOUNT_UPTO",
      columnName: "AmountUpTo",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      width: 120,
      minWidth: 90,
      maxWidth: 150,
    },

    {
      accessor: "FLAG",
      columnName: "Flag",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 70,
      maxWidth: 120,
    },
    {
      accessor: "FORCE_EXP_DT",
      columnName: "ForceExpDate",
      sequence: 6,
      alignment: "center",
      componentType: "date",
      width: 164,
      minWidth: 120,
      maxWidth: 180,
    },
    {
      accessor: "FORCE_EXP_BY",
      columnName: "ForceExpBy",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 153,
      minWidth: 130,
      maxWidth: 170,
    },
  ],
};
export const tempODGridHistoryMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "TemporaryODHistory",
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
    hiddenFlag: "_hidden",
    searchPlaceholder: "Temporary-OD Detail",
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
      accessor: "FROM_EFF_DATE",
      columnName: "EffectiveFromDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 150,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "TO_EFF_DATE",
      columnName: "EffectiveToDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 162,
      minWidth: 90,
      maxWidth: 170,
    },
    {
      accessor: "CODE_DESC",
      columnName: "CodeDecription",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 150,
      maxWidth: 290,
    },
    {
      accessor: "AMOUNT_UPTO",
      columnName: "AmountUpTo",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      width: 120,
      minWidth: 90,
      maxWidth: 150,
    },

    {
      accessor: "CONFIRMED",
      columnName: "Active",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 70,
      maxWidth: 120,
    },

    {
      accessor: "LAST_ENTERED_BY",
      columnName: "LastEnteredBy",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "LAST_MACHINE_NM",
      columnName: "LastMachineName",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 155,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      columnName: "ForceExpire",
      componentType: "buttonRowCell",
      // buttonLabel: "Remove",
      accessor: "FORCE_EXP_FLAG",
      sequence: 10,
      alignment: "center",
      width: 150,
      maxWidth: 170,
      minWidth: 120,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (initialValue === "Y") {
          return false;
        }
        return true;
      },
      // isVisible: false,
      // isVisibleInNew: true,
    },
  ],
};
