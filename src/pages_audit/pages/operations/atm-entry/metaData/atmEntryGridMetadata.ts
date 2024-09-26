import { GridMetaDataType } from "@acuteinfo/common-base";
export const atmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "CardDetails",
    rowIdColumn: "CUSTOMER_NM",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    disableGlobalFilter: true,
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "29vh",
      max: "29vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SRNO",
      columnName: "SrNo",
      sequence: 1,
      componentType: "default",
      width: 75,
      minWidth: 50,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "REQ_DT",
      columnName: "RequestDate",
      sequence: 2,
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      maxWidth: 200,
      minWidth: 150,
    },
    {
      accessor: "DISPLAY_STATUS",
      columnName: "CardStatus",
      componentType: "default",
      sequence: 2,
      alignment: "center",
      width: 100,
      minWidth: 200,
      maxWidth: 400,
    },

    {
      accessor: "DISPLAY_CARD_ISSUE_TYPE",
      columnName: "IssueTo",
      sequence: 4,
      componentType: "default",
      width: 120,
      alignment: "center",
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CustomerId",
      sequence: 5,
      componentType: "default",
      width: 120,
      alignment: "center",
    },
    {
      accessor: "CUSTOMER_NM",
      columnName: "CustomerName",
      sequence: 6,
      componentType: "default",
      width: 90,
      maxWidth: 100,
      minWidth: 50,
      alignment: "left",
    },
    {
      accessor: "ISSUE_DT",
      columnName: "IssueRejectDate",
      sequence: 7,
      componentType: "date",
      width: 120,
      alignment: "center",
    },

    {
      accessor: "CITIZEN_ID",
      columnName: "CitizenId",
      sequence: 8,
      componentType: "default",
      width: 120,
      alignment: "center",
    },
    {
      accessor: "M_CARD_NO",
      columnName: "CardNo",
      sequence: 9,
      componentType: "default",
      width: 120,
      alignment: "center",
    },
    {
      accessor: "CARD_TYPE",
      columnName: "CardType",
      sequence: 10,
      componentType: "default",
      alignment: "center",
      width: 120,
    },
    {
      accessor: "EXPIRE_DT",
      columnName: "ExpireDate",
      sequence: 12,
      componentType: "date",
      alignment: "center",
      // dateFormat: "dd/MM/yyyy",
      width: 120,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 11,
      componentType: "default",
      alignment: "center",
      width: 120,
    },
    {
      accessor: "DEACTIVE_DT",
      columnName: "DeactiveDate",
      sequence: 12,
      componentType: "date",
      alignment: "center",
      // dateFormat: "dd/MM/yyyy",
      width: 120,
    },

    {
      accessor: "ALLOW_DELETE",
      columnName: "Action",
      buttonLabel: "Delete",
      sequence: 14,
      alignment: "center",
      componentType: "buttonRowCell",
      shouldExclude: (initialValue, original) => {
        if (original?.EDIT_STATUS === "N") {
          return true;
        } else {
          if (original.ALLOW_DELETE && original?.ALLOW_DELETE !== "Y") {
            return true;
          } else {
            return false;
          }
        }
      },
      width: 90,
      minWidth: 60,
      maxWidth: 130,
    },
  ],
};
