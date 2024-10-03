export const CashierExchangeCnfMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SCROLL1",
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
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "REMARKS",
      columnName: "TransferDetails",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 280,
      maxWidth: 320,
    },
    {
      accessor: "TRAN_DT",
      columnName: "TranDate",
      sequence: 1,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MMM/yyyy",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 1,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 120,
      maxWidth: 180,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
  ],
};
