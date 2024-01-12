import { GridMetaDataType } from "components/dataTableStatic";
export const JointDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Joint Details",
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
      accessor: "ACCT_CD",
      columnName: "ACCT No",
      sequence: 2,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "A/C Type",
      sequence: 3,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch No",
      sequence: 4,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "COMP_CD",
      columnName: "COMP_CD",
      sequence: 5,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "REF_PERSON_NAME",
      columnName: "Name ",
      sequence: 6,
      componentType: "default",
      width: 200,
    },

    {
      accessor: "ADD1",
      columnName: "Address",
      sequence: 8,
      componentType: "default",
      width: 200,
    },

    {
      accessor: "PIN_CODE",
      columnName: "Pin Code",
      sequence: 9,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "J_TYPE",
      columnName: "J_TYPE",
      sequence: 10,
      componentType: "default",
      width: 80,
    },
    {
      accessor: "phone1",
      columnName: "PHONE",
      sequence: 11,
      componentType: "default",
      width: 120,
    },
    {
      accessor: "BIRTH_DATE",
      columnName: "BIRTH_DATE",
      sequence: 12,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
    },

    {
      accessor: "AREA_CD",
      columnName: "AREA_CD",
      sequence: 14,
      componentType: "default",
      width: 120,
    },
  ],
};