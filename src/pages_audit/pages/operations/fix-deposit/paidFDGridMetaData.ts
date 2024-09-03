import { GridMetaDataType } from "components/dataTableStatic";
export const PaidFDGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Paid FD Detail",
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
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "55vh",
      max: "55vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },

  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 60,
      minWidth: 40,
      maxWidth: 70,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Deposit Date",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "TOT_AMT",
      columnName: "Principal Amt.",
      sequence: 3,
      alignment: "right",
      componentType: "currency",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
      isDisplayTotal: true,
    },
    {
      accessor: "PAID_DT",
      columnName: "Paid Date",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "PAYMENT_MODE",
      columnName: "Payment",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "PAYMENT_AMT",
      columnName: "Payment Amt.",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "MATURITY_DT",
      columnName: "Maturity Date",
      sequence: 7,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "FD_NO",
      columnName: "FD no.",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "PERIOD_DISP",
      columnName: "Period",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "INT_RATE",
      columnName: "Rate(%)",
      sequence: 10,
      alignment: "right",
      componentType: "default",
      width: 90,
      minWidth: 80,
      maxWidth: 100,
    },
    {
      accessor: "TERM_DISP",
      columnName: "Term",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "INT_AMT",
      columnName: "Fin. Int. Amt.",
      sequence: 12,
      alignment: "right",
      componentType: "currency",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
      isDisplayTotal: true,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Issue Date",
      sequence: 13,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "FD_REMARK",
      columnName: "Fd Remark",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 140,
      maxWidth: 160,
    },
    {
      accessor: "MATURITY_AMT",
      columnName: "Maturity Amt.",
      sequence: 15,
      alignment: "right",
      componentType: "currency",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
      isDisplayTotal: true,
    },
    {
      accessor: "TOT_TDS_RECO_INT_AMT",
      columnName: "TDS Recover Amt.",
      sequence: 16,
      alignment: "right",
      componentType: "currency",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
      isDisplayTotal: true,
    },
    {
      accessor: "RENEW_REMARK",
      columnName: "Renew Remark",
      sequence: 17,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 140,
      maxWidth: 160,
    },
    {
      accessor: "SR_CD",
      columnName: "Serial Code",
      sequence: 18,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
    },

    {
      accessor: "MATURE_INST",
      columnName: "Mature Instruction",
      sequence: 19,
      alignment: "left",
      componentType: "default",
      width: 230,
      minWidth: 200,
      maxWidth: 280,
    },
  ],
};
