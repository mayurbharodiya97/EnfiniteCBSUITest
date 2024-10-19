import { GridMetaDataType } from "@acuteinfo/common-base";
export const DynFormGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SR_CD",
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
    // {
    //   accessor: "TRAN_CD",
    //   columnName: "Serial No",
    //   sequence: 1,
    //   alignment: "right",
    //   componentType: "default",
    //   width: 90,
    //   minWidth: 50,
    //   maxWidth: 150,
    //   //isAutoSequence: true,
    // },

    {
      accessor: "SR_CD",
      columnName: "SrNo",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "DOC_CD",
      columnName: "Document Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 200,
      maxWidth: 500,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Document Title",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 200,
      maxWidth: 500,
    },
    {
      accessor: "FORM_NAME",
      columnName: "Document Icon",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      accessor: "FORM_LABEL",
      columnName: "Document Group",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      accessor: "VALIDATIONRUN",
      columnName: "Retrieval Type",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "SUBMITACTION",
      columnName: "Retrieval Type",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 120,
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
      accessor: "MACHINE_NM",
      columnName: "machine name",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 180,
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
      accessor: "LAST_MACHINE_NM",
      columnName: "Modified name",
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
