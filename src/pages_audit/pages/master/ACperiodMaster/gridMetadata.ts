import { GridMetaDataType } from "components/dataTableStatic";
export const gridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "AC Period Master (EMST/148)",
    rowIdColumn: "PERIOD_CD",
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
    pageSizes: [15, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowColumnHiding: true,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "SrNo",
      isAutoSequence: true,
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "PERIOD_CD",
      columnName: "Code",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "PERIOD_NM",
      columnName: "PeriodName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "INST_NO",
      columnName: "InstNo",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "DATA_DISPLAY_INSTALLMENT",
      columnName: "InstallmentPeriod",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 100,
      maxWidth: 500,
    },
  ],
};
