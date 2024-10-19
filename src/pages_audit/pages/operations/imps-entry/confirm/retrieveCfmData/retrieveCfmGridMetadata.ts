import { GridMetaDataType } from "@acuteinfo/common-base";

export const RetrieveGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "IMPSConfirmationRetrieveData",
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
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "48vh",
      max: "48vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "CUSTOMER_ID",
      columnName: "CustomerId",
      sequence: 2,
      componentType: "default",
      alignment: "right",
      width: 115,
      maxWidth: 150,
      minWidth: 80,
    },
    {
      accessor: "ORGINAL_NM",
      columnName: "CustomerName",
      sequence: 3,
      componentType: "default",
      width: 200,
      maxWidth: 240,
      minWidth: 130,
      alignment: "left",
    },
    {
      accessor: "MOB_NO",
      columnName: "MobileNo",
      sequence: 3,
      componentType: "default",
      width: 133,
      maxWidth: 220,
      minWidth: 100,
      alignment: "left",
    },

    {
      accessor: "DISPLAY_ACTIVE",
      columnName: "Active",
      sequence: 6,
      componentType: "default",
      width: 90,
      maxWidth: 150,
      minWidth: 70,
      alignment: "center",
    },

    {
      accessor: "DEACTIVE_DT",
      columnName: "DeActiveDateIMPS",
      sequence: 7,
      alignment: "center",
      componentType: "date",
      placeholder: "",
      width: 135,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "DISPLAY_CONFIRMED",
      columnName: "Confirmed",
      sequence: 6,
      componentType: "default",
      width: 100,
      maxWidth: 150,
      minWidth: 70,
      alignment: "center",
    },

    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "EnteredBranch",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 122,
      minWidth: 100,
      maxWidth: 200,
    },

    {
      accessor: "LAST_ENTERED_BY",
      columnName: "LastModifiedBy",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 160,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "LastModifiedDate",
      sequence: 14,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
  ],
};
