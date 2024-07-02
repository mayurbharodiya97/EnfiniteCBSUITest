import { GridMetaDataType } from "components/dataTableStatic";

export const AreaMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "AREA_CD",
    defaultColumnConfig: {
      width: 200,
      maxWidth: 450,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: true,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "Sr_No",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 60,
      minWidth: 50,
      maxWidth: 100,
      isAutoSequence:true
    },
    {
      accessor: "AREA_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "AREA_NM",
      columnName: "Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      accessor: "PIN_CODE",
      columnName: "PinCode",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 130,
      maxWidth: 400,
    },
    {
      accessor: "CITY_NM",
      columnName: "City",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      accessor: "PARENT_AREA_NM",
      columnName: "ParentArea",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 300,
    },
  ],
};