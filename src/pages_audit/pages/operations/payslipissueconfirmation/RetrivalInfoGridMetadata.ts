import { GridMetaDataType } from "@acuteinfo/common-base";

export const RetrievedinfoGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "TRAN_CD",
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
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "PAYSLIP_NO",
      columnName: "ddNo",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "COMM_TYPE_DESC",
      columnName: "commissionType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "CONFIRMED_FLG",
      columnName: "ConfirmStatus",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
      color: (val, data) => {
        let PENDING_FLAG = data?.original?.CONFIRMED ?? "";
        return PENDING_FLAG === "Y" ? "green" : "red";
      },
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "chequeNo",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "TRAN_DT",
      columnName: "Tran Date",
      sequence: 5,
      alignment: "left",
      componentType: "date",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "AMOUNT",
      columnName: "amount",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 150,
      maxWidth: 250,
    },

    {
      accessor: "INFAVOUR_OF",
      columnName: "inFavourOf",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "enteredBy",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "verifiedBy",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
  ],
};
