import { GridMetaDataType } from "components/dataTableStatic";
export const InstructionGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Instruction",
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
    hideFooter: false,
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
      accessor: "AC_NO",
      columnName: "Main A/C",
      sequence: 1,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "ACCT_NM",
      columnName: "Main A/C Name",
      sequence: 2,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "OTH_AC_NO",
      columnName: "Other A/C",
      sequence: 3,
      componentType: "default",
      width: 150,
    },

    {
      accessor: "OTH_ACCT_NM",
      columnName: "Other A/C Name",
      sequence: 4,
      componentType: "default",
      width: 200,
    },
    {
      accessor: "5",
      columnName: "Instruction",
      sequence: 5,
      componentType: "default",
      width: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "type1",
      columnName: "Type",
      sequence: 6,
      componentType: "default",
      width: 120,
    },

    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 7,
      componentType: "currency",
      width: 120,
    },

    {
      accessor: "EFFECTIVE_DT",
      columnName: "Effective Date",
      sequence: 8,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },
  ],
};
