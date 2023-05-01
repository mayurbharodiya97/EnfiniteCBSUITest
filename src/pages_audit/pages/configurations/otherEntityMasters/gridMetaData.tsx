export const OtherEntityMastersGridMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "Third Party Master",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
    allowColumnReordering: true,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    containerHeight: { min: "68vh", max: "68vh" },
    pageSizes: [15, 20, 30],
    defaultPageSize: 15,
    isCusrsorFocused: true,
  },
  columns: [
    {
      columnName: "ID",
      componentType: "default",
      accessor: "TRAN_CD",
      sequence: 1,
      alignment: "left",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
      isAutoSequence: true,
    },
    {
      columnName: "Code",
      componentType: "default",
      accessor: "ENTITY_CD",
      sequence: 3,
      alignment: "left",
      width: 130,
      maxWidth: 200,
      minWidth: 100,
    },
    {
      columnName: "Description",
      componentType: "default",
      accessor: "DESCRIPTION",
      sequence: 3,
      alignment: "left",
      width: 250,
      maxWidth: 400,
      minWidth: 180,
    },
    {
      columnName: "Account Source",
      componentType: "default",
      accessor: "TO_SOURCE",
      sequence: 4,
      alignment: "left",
      width: 130,
      maxWidth: 300,
      minWidth: 180,
    },
    {
      columnName: "Transaction Particulars",
      componentType: "default",
      accessor: "TRN_PERTICULERS",
      sequence: 5,
      alignment: "left",
      width: 130,
      maxWidth: 300,
      minWidth: 180,
    },
    {
      columnName: "Transaction Particulars2",
      componentType: "default",
      accessor: "TRN_PERTICULERS2",
      sequence: 6,
      alignment: "left",
      width: 130,
      maxWidth: 300,
      minWidth: 180,
    },
    {
      columnName: "Remark",
      componentType: "default",
      accessor: "REMARKS",
      sequence: 7,
      alignment: "left",
      width: 150,
      maxWidth: 400,
      minWidth: 180,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 130,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 9,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy hh:mm a",
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Last Modified By",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 130,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Last Modified Date",
      sequence: 11,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy hh:mm a",
    },
  ],
};
