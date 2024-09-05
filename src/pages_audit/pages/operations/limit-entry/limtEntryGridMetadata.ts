import { GridMetaDataType } from "@acuteinfo/common-base";

export const limitEntryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "LimitDetail",
    subGridLabel: "",
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
    defaultPageSize: 8,
    containerHeight: {
      min: "60vh",
      max: "60vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    footerNote: "limitFooterNote",
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
      accessor: "ENTRY_DT",
      columnName: "EntryDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 109,
      minWidth: 90,
      maxWidth: 150,
    },
    {
      accessor: "TRAN_DT",
      columnName: "EffectiveDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 136,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "EXPIRY_DT",
      columnName: "ExpiryDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 114,
      minWidth: 90,
      maxWidth: 150,
    },
    {
      accessor: "INT_RATE",
      columnName: "IntRate",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 78,
      minWidth: 60,
      maxWidth: 100,
    },

    {
      accessor: "MARGIN",
      columnName: "Margin%",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 72,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "SECURITY_VALUE",
      columnName: "SecurityValue",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 104,
      minWidth: 100,
      maxWidth: 150,
      isVisible: true,
      // isDisplayTotal: true,
      // totalDecimalCount: 2,
    },
    {
      accessor: "LIMIT_AMOUNT",
      columnName: "LimitAmount",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      // isDisplayTotal: true,
      // totalDecimalCount: 2,
      width: 120,
      minWidth: 90,
      maxWidth: 150,
    },

    {
      accessor: "FD_DESC",
      columnName: "FDDescription",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 275,
      minWidth: 200,
      maxWidth: 300,
    },
    {
      accessor: "RESOLUTION_DATE",
      columnName: "ResolutionDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      width: 133,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONFIRMED_DISPLAY",
      columnName: "Status",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 101,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "ALLOW_DELETE",
      columnName: "Action",
      buttonLabel: "Delete",
      sequence: 4,
      alignment: "center",
      componentType: "buttonRowCell",
      shouldExclude: (initialValue) => {
        if (initialValue === "Y") {
          return false;
        }
        return true;
      },
      width: 90,
      minWidth: 60,
      maxWidth: 130,
    },
  ],
};
