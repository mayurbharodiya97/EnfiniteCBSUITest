import { GridMetaDataType } from "components/dataTableStatic";
export const issuedChequeBkGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ChequeBkAlreadyIssued",
    rowIdColumn: "CHEQUE_NO",
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
      min: "50vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
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
      columnName: "ProcessedDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 140,
      minWidth: 90,
      maxWidth: 170,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "ChequeNo",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "AMOUNT",
      columnName: "Charge",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      width: 80,
      minWidth: 100,
      maxWidth: 130,
    },

    {
      accessor: "FLAG",
      columnName: "Status",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
  ],
};
