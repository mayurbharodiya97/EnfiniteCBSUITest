import { GridMetaDataType } from "@acuteinfo/common-base";
export const FDDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "FD_NO",
    defaultColumnConfig: {
      width: 250,
      maxWidth: 300,
      minWidth: 200,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [50, 80, 100],
    defaultPageSize: 50,
    containerHeight: {
      min: "77vh",
      max: "77vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    searchPlaceholder: "fixed deposits",
  },

  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Ason Date",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "MATURITY_DT",
      columnName: "Maturity Date",
      sequence: 3,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "TOT_AMT",
      columnName: "Principal Amt.",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 140,
      maxWidth: 200,
      isDisplayTotal: true,
    },
    {
      accessor: "MATURITY_AMT",
      columnName: "Maturity Amt.",
      sequence: 5,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 140,
      maxWidth: 200,
      isDisplayTotal: true,
    },
    {
      accessor: "FD_NO",
      columnName: "FD no.",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "PERIOD_DISP",
      columnName: "Period",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "INT_RATE",
      columnName: "Rate(%)",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 90,
      minWidth: 80,
      maxWidth: 100,
    },
    {
      accessor: "TERM_DISP",
      columnName: "Term",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "CR_AC_DTL",
      columnName: "Cr.Type/Ac.No.",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "INT_AMT",
      columnName: "Fin. Int. Amt.",
      sequence: 11,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 140,
      maxWidth: 200,
      isDisplayTotal: true,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Issue Date",
      sequence: 12,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "BAL_AMT",
      columnName: "Balance",
      sequence: 13,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 140,
      maxWidth: 200,
    },
    {
      accessor: "FD_REMARK",
      columnName: "Fd Remark",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "TOT_TDS_RECO_INT_AMT",
      columnName: "TDS Recover Amt",
      sequence: 15,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 140,
      maxWidth: 200,
      isDisplayTotal: true,
    },
    {
      accessor: "RENEW_REMARK",
      columnName: "Renew Remark",
      sequence: 16,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "FD_LIEN_AMT",
      columnName: "Lien Amount",
      sequence: 17,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 140,
      maxWidth: 200,
      isDisplayTotal: true,
    },
    {
      accessor: "NO_OF_UNIT",
      columnName: "No. Of Unit",
      sequence: 18,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 140,
      isDisplayTotal: true,
    },
    {
      accessor: "TOT_INVEST_AMT",
      columnName: "Total Invested Amount",
      sequence: 19,
      alignment: "right",
      componentType: "currency",
      width: 160,
      minWidth: 150,
      maxWidth: 200,
      isDisplayTotal: true,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "LEAN_FLAG",
      sequence: 20,
      buttonLabel: "Lien",
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (initialValue === "Y") {
          return false;
        }
        return true;
      },
      width: 100,
      minWidth: 80,
      maxWidth: 110,
    },
  ],
};
