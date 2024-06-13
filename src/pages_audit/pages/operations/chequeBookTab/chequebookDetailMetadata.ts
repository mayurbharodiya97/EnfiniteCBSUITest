import { GridMetaDataType } from "components/dataTableStatic";

export const ChequebookDtlGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ChequeBookIssued",
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
      min: "63vh",
      max: "63vh",
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
      columnName: "IssueDate",
      sequence: 1,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 102,
      minWidth: 900,
      maxWidth: 130,
    },
    {
      accessor: "AUTO_CHQBK_FLAG_DISPLAY",
      columnName: "AutoIssue",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 101,
      minWidth: 70,
      maxWidth: 130,
    },
    {
      accessor: "CHEQUE_FROM",
      columnName: "FromChequeNo",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 139,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHEQUE_TO",
      columnName: "ToChequeNo",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 128,
      minWidth: 100,
      maxWidth: 140,
    },
    {
      accessor: "CHEQUE_TOTAL",
      columnName: "NoOfCheques",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 136,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "SERVICE_TAX",
      columnName: "ServiceCharge",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      width: 109,
      minWidth: 80,
      maxWidth: 130,
    },
    {
      accessor: "AMOUNT",
      columnName: "GSTAmount",
      sequence: 8,
      alignment: "right",
      componentType: "currency",
      width: 70,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "CONFIRMED_DISPLAY",
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
      buttonLabel: "Delete",
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
      columnName: "PayableAtPAR",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 147,
      minWidth: 70,
      maxWidth: 190,
    },
    {
      accessor: "REQUISITION_DT",
      columnName: "RequisitionDate",
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
      columnName: "UnusedCheque",
      sequence: 10,
      alignment: "center",
      componentType: "default",
      width: 125,
      minWidth: 70,
      maxWidth: 140,
    },
  ],
};
