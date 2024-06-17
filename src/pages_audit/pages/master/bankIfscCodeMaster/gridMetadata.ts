import { GridMetaDataType } from "components/dataTableStatic";
export const gridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Bank Ifsc Code Master(EMST/142)",
    rowIdColumn: "IFSC_CODE",
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
    allowFilter: false,
    allowColumnHiding: true,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr No.",
      // isAutoSequence:true,
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 100,
    },
    { 
      accessor: "IFSC_CODE",
      columnName: "IFSC Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "BANK_NM",
      columnName: "Bank Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      accessor: "DDW_DISPLAY_VALUE",
      columnName: "Facility",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 120,
    },
    {
      accessor: "MICR_CODE",
      columnName: "MICR Code",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "BRANCH_NM",
      columnName: "Branch Name",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "ADD1",
      columnName: "Add 1",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "CONTACT_DTL",
      columnName: "Contact Detail",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "CENTRE_NM",
      columnName: "Centre Name",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      accessor: "DISTRICT_NM",
      columnName: "District Name",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      accessor: "STATE_NM",
      columnName: "State Name",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 200
      ,
      minWidth: 100,
      maxWidth: 300,
    },
  ],
};
