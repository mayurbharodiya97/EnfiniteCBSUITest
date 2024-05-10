import { GridMetaDataType } from "components/dataTableStatic";

export const Prioritymastermainmetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Priority Master - Main (EMST/O55)",
    rowIdColumn: "ACCT_PRIORITY_CD",
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
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "PRIORITY_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "PARENT_GROUP",
      columnName: "Parent Group",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Sub Priority",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "PRIORITY_NM",
      columnName: "Decscription",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 400,
    },
    {
      accessor: "FROM_LIMIT",
      columnName: "Sanction From Limit",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "TO_LIMIT",
      columnName: "Sanction To Limit",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 120,
      maxWidth: 150,
    },
    {
        accessor: "SECURE_PROV_PERC",
        columnName: "Provision Secured %",
        sequence: 8,
        alignment: "right",
        componentType: "currency",
        width: 120,
        minWidth: 120,
        maxWidth: 150,
      },
      {
        accessor: "UNSECURE_PROV_PERC",
        columnName: "Provision Unsecured %",
        sequence: 9,
        alignment: "right",
        componentType: "currency",
        width: 120,
        minWidth: 120,
        maxWidth: 150,
      },
      {
        accessor: "ACTIVE_FLAG",
        columnName: "Active",
        sequence: 10,
        alignment: "left",
        componentType: "editableCheckbox",
        width: 80,
        minWidth: 70,
        maxWidth: 150,
        isReadOnly:true,
      },
  ],
};
