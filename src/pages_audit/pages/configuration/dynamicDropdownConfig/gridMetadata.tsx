import { GridMetaDataType } from "components/dataTableStatic";
export const DynamicDropdownConfigGridMData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Dynamic Dropdown Configure",
    rowIdColumn: "TRAN_CD",
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
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "DDLB_NAME",
      columnName: "Dropdown Name",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 200,
      maxWidth: 500,
    },
    // {
    //   accessor: "SOURCE_NAME",
    //   columnName: "Dropdown Source",
    //   sequence: 2,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 250,
    //   minWidth: 200,
    //   maxWidth: 500,
    // },
    {
      accessor: "SOURCE_TYPE",
      columnName: "API List",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "Created By",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Created Date",
      sequence: 5,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Modified By",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Modified Date",
      sequence: 7,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
  ],
};