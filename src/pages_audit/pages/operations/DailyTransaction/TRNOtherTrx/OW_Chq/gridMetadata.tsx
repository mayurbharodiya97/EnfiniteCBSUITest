import { GridMetaDataType } from "components/dataTableStatic";
export const OwChqGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "O/W Chq(s) OBC/IBC",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 120,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "36vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "TRAN_DT",
      columnName: "Tran Date",
      sequence: 1,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Chq No",
      sequence: 2,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      sequence: 3,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "STATUS",
      columnName: "Other Detail ",
      sequence: 4,
      componentType: "default",
      width: 250,
    },
    {
      accessor: "CR_DR",
      columnName: " CR_DR  ",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "AMOUNT",
      columnName: "AMOUNT",
      sequence: 6,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "CONFIRMED",
      columnName: "CONFIRMED",
      sequence: 7,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "Branch",
      sequence: 8,
      componentType: "default",
      width: 120,
    },
  ],
};
