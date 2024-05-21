import { GridMetaDataType } from "components/dataTableStatic";

export const AdvocateMstGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Advocate Master (EMST/061)",
    rowIdColumn: "CODE",
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
      columnName: "Advocate Name",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "CONTACT1",
      columnName: "Mobile No.",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "EMAIL",
      columnName: "Email ID",
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
      accessor: "CODE",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Advocate Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 260,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "CONTACT1",
      columnName: "Mobile No.",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 160,
      maxWidth: 200,
    },
    {
      accessor: "ADD1",
      columnName: "Address",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 260,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "EMAIL",
      columnName: "Email ID",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 260,
      maxWidth: 350,
      showTooltip: true,
    },
  ],
};