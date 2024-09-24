import { GridMetaDataType } from "@acuteinfo/common-base";
export const ClosingAdviceGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Closing Advice",
    rowIdColumn: "FROM_DT",
    defaultColumnConfig: {
      width: 180,
      minWidth: 150,
      maxWidth: 200,
    },
    hideHeader: true,
    disableGroupBy: true,
    containerHeight: {
      min: "30.5vh",
      max: "30.5vh",
    },
    allowRowSelection: false,
    hideFooter: true,
  },

  columns: [
    {
      accessor: "FROM_DT",
      columnName: "fromDate",
      sequence: 1,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      minWidth: 160,
    },
    {
      accessor: "TO_DT",
      columnName: "toDate",
      sequence: 2,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
    },
    {
      accessor: "BAL",
      columnName: "IdealBalance",
      sequence: 3,
      alignment: "right",
      componentType: "currency",
    },
    {
      accessor: "ACTUAL_DEPOSIT",
      columnName: "ActualDeposit",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
    },
    {
      accessor: "DIFF",
      columnName: "Difference",
      sequence: 5,
      alignment: "right",
      componentType: "currency",
    },
    {
      accessor: "PENALTY",
      columnName: "Penalty",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
    },
    {
      accessor: "INT_AMT",
      columnName: "InterestAmount",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
    },
  ],
};
