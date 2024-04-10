export const ChequebookDtlGridMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "Cheque Book Issued",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "57vh",
      max: "57vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 76,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },

    {
      accessor: "TRAN_DT",
      columnName: "Issue Date",
      sequence: 1,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 102,
      minWidth: 900,
      maxWidth: 130,
    },
    {
      accessor: "AUTO_CHQBK_FLAG",
      columnName: "Auto Issue",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 101,
      minWidth: 70,
      maxWidth: 130,
    },
    {
      accessor: "CHEQUE_FROM",
      columnName: "From Chq. No.",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 122,
      minWidth: 100,
      maxWidth: 150,
      isVisible: true,
    },
    {
      accessor: "CHEQUE_TO",
      columnName: "To Chq. No.",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 107,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "CHEQUE_TOTAL",
      columnName: "No of ChequeBK",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 136,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "SERVICE_TAX",
      columnName: "Charge",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      width: 70,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "AMOUNT",
      columnName: "GST",
      sequence: 8,
      alignment: "right",
      componentType: "currency",
      width: 70,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "CONFIRMED",
      columnName: "Status",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ALLOW_DELETE",
      columnName: "Action",
      sequence: 8,
      buttonLabel: "Remove",
      alignment: "center",
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (initialValue === "Y") {
          return false;
        }
        return true;
      },
      componentType: "buttonRowCell",
      width: 90,
      minWidth: 60,
      maxWidth: 130,
    },

    {
      accessor: "CHARACTERISTICS",
      columnName: "Characteristics",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "PAYABLE_AT_PAR",
      columnName: "At PAR",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 90,
      minWidth: 70,
      maxWidth: 120,
    },
    {
      accessor: "REQUISITION_DT",
      columnName: "Requisition Date",
      sequence: 8,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 133,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "UNUSED_CHQ",
      columnName: "Unused Chq.",
      sequence: 10,
      alignment: "center",
      componentType: "default",
      width: 115,
      minWidth: 70,
      maxWidth: 140,
    },
  ],
};
