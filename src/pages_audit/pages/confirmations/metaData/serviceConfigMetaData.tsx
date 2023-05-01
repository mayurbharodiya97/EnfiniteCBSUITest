import { GridMetaDataType } from "components/dataTableStatic";
export const ServiceConfigConfirmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Service Wise Configuration Confirmation",
    rowIdColumn: "SR_NO",
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
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "68vh",
      max: "68vh",
    },
    allowFilter: true,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [
    {
      accessor: "CONFIRM_STATUS",
      columnName: "Confirm Status",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
  ],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 70,
      maxWidth: 120,
      //isAutoSequence: true,
    },
    {
      accessor: "TRN_TYPE",
      columnName: "Transaction Type",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      accessor: "CONFIRM_STATUS",
      columnName: "Confirm Status",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Modified By",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Modified Date",
      sequence: 6,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
  ],
};
