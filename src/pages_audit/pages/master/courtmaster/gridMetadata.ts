import { GridMetaDataType } from "@acuteinfo/common-base";

export const CourtMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "COURT_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "70vh",
      max: "70vh",
    },
    allowColumnHiding: true,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "Sr_No",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 50,
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
      columnName: "CourtName",
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
      accessor: "CITY_NM",
      columnName: "City",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "DIST_NM",
      columnName: "District",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
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
      accessor: "COUNTRY_NM",
      columnName: "Country",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "PIN_CODE",
      columnName: "PinCode",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "ADD1",
      columnName: "Address1",
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
      columnName: "Contact1",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONTACT2",
      columnName: "Contact2",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONTACT3",
      columnName: "Contact3",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};