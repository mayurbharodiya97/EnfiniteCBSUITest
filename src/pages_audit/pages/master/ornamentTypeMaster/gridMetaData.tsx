import { GridMetaDataType } from "components/dataTableStatic";
export const OrnamentTypeMasterMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Ornament Type Master (EMST/247)",
    rowIdColumn: "CODE",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 30, 50],
    defaultPageSize: 10,
    containerHeight: {
      min: "77vh",
      max: "77vh",
    },
    allowFilter: true,
    isCusrsorFocused: true,
  },

  filters: [
    {
      accessor: "CODE",
      columnName: "Code",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "ORN_MARGIN",
      columnName: "Margin",
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
      columnName: "Sr No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "CODE",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 190,
    },
    {
      accessor: "ORN_MARGIN",
      columnName: "Margin",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 130,
    },
  ],
};
