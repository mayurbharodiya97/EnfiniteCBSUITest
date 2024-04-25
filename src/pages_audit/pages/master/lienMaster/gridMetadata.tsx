import { GridMetaDataType } from "components/dataTableStatic";
export const gridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Lien-Master (EMST/066)",
    rowIdColumn: "LEAN_CD",
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
    allowFilter: true,
    allowColumnHiding: true,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  filters: [
    {
      accessor: "LEAN_CD",
      columnName: "LEAN_CD",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "PARENT_TYPE_DISP",
      columnName: "Parent_type",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "LEAN_NM",
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
      accessor: "LEAN_CD",
      columnName: "Code",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 500,
    },
    { 
      accessor: "PARENT_TYPE_DISP",
      columnName: "Parent_Type",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      // color: (val, data) => {
      //   let Parent_Type = data?.original?.PARENT_TYPE ?? "";
      //   return Parent_Type === "05  "
      //     ? "red"
      //     : Parent_Type === "11  "
      //     ? "blue"
      //     : Parent_Type === "44  "
      //     ? "coral"
      //     : "green";
      // },
      width: 250,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "LEAN_NM",
      columnName: "Description",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 100,
      maxWidth: 500,
    },
  ],
};
