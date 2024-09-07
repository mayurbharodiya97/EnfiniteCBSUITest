import { GridMetaDataType } from "components/dataTableStatic";
export const DynamicGridConfigGridMData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Language Wise Message Configuration",
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
  filters: [
    // {
    //   accessor: "TITLE",
    //   columnName: "Title",
    //   filterComponentType: "valueFilter",
    //   gridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //   },
    // },
  ],
  columns: [
    {
      accessor: "1",
      columnName: "Serial No",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 90,
      minWidth: 50,
      maxWidth: 150,
      isAutoSequence: true,
    },

    {
      accessor: "TRAN_CD",
      columnName: "Message Id",
      sequence: 2,
      alignment: "center",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 180,
    },
    {
      accessor: "DEFAULT_LANG_CODE",
      columnName: "Default Language",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 160,
    },
    {
      accessor: "DEFAULT_LANG_MSG",
      columnName: "Default Message",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 230,
      maxWidth: 300,
    },
    {
      accessor: "CONFIGURE_COUNT",
      columnName: "No.of Languages configured",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      dateFormat: "dd/MM/yyyy",
      width: 180,
      minWidth: 100,
      maxWidth: 280,
    },
  ],
};
