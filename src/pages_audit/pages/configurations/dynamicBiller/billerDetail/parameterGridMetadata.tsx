import { GridMetaDataType } from "components/dataTableStatic";
export const BillerParametersGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Dynamic Biller URLs",
    rowIdColumn: "PARAMETER_KEYS",
    defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
    allowColumnReordering: true,
    disableSorting: true,
    hideHeader: true,
    disableGroupBy: true,
    containerHeight: { min: "62vh", max: "62vh" },
    allowRowSelection: false,
  },
  columns: [
    {
      columnName: "Serial No",
      componentType: "default",
      accessor: "SR_NO",
      sequence: 0,
      alignment: "left",
    },
    {
      columnName: "Parameter Keys",
      componentType: "default",
      accessor: "PARAMETER_KEYS",
      sequence: 2,
      alignment: "left",
      width: 300,
      minWidth: 280,
      maxWidth: 500,
    },
  ],
};
