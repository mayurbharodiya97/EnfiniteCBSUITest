import { GridMetaDataType } from "components/dataTableStatic";

export const CourtMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Court Master (EMST/146)",
    rowIdColumn: "COURT_CD",
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
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "79vh",
      max: "79vh",
    },
    allowFilter: true,
    allowColumnHiding: true,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "Sr_No",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "COURT_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "COURT_NAME",
      columnName: "Court Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "AREA_NM",
      columnName: "Area",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "DIST_NM",
      columnName: "District",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "PIN_CODE",
      columnName: "Pin",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "STATE_NM",
      columnName: "State",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "CITY_NM",
      columnName: "City",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "COUNTRY_NM",
      columnName: "Country",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "ADD1",
      columnName: "Address 1",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ADD2",
      columnName: "Address2",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONTACT1",
      columnName: "Contact 1",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONTACT2",
      columnName: "Contact 2",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONTACT3",
      columnName: "Contact 3",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
