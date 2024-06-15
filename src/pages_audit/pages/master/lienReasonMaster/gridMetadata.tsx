import { GridMetaDataType } from "components/dataTableStatic";

export const LienReasonMstGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Lien Reason Master (EMST/809)",
    rowIdColumn: "REASON_CD",
    defaultColumnConfig: {
      width: 350,
      minWidth: 300,
      maxWidth: 400,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 40, 60],
    defaultPageSize: 20,
    containerHeight: {
      min: "77vh",
      max: "77vh",
    },
    allowFilter: true,
    allowColumnHiding: true,
    isCusrsorFocused: true,
  },
  filters: [
    {
      accessor: "REASON_CD",
      columnName: "Code",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "REASON_NM",
      columnName: "Description",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
  ],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "REASON_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "REASON_NM",
      columnName: "Description",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 380,
      minWidth: 340,
      maxWidth: 400,
      showTooltip: true,
    },
  ],
};
