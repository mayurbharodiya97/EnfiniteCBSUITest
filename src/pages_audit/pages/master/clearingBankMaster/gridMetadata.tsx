import { GridMetaDataType } from "components/dataTableStatic";

export const ClearingBankMstGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Clearing Bank Master (EMST/091)",
    rowIdColumn: "BANK_CD",
    defaultColumnConfig: {
      width: 350,
      minWidth: 300,
      maxWidth: 400,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [30, 50, 100],
    defaultPageSize: 30,
    containerHeight: {
      min: "77vh",
      max: "77vh",
    },
    allowFilter: true,
    allowColumnHiding: true,
    isCusrsorFocused: true,
  },
  filters: [
    {
      accessor: "RBI_CD",
      columnName: "RBI Code",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "BANK_CD",
      columnName: "Code",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "BANK_NM",
      columnName: "Bank Name",
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
      width: 70,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "RBI_CD",
      columnName: "RBI Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 190,
    },
    {
      accessor: "BANK_CD",
      columnName: "Code",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 190,
    },
    {
      accessor: "BANK_NM",
      columnName: "Bank Name",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 360,
      minWidth: 300,
      maxWidth: 400,
      showTooltip: true,
    },
    {
      accessor: "EXCLUDE",
      columnName: "Exclude",
      sequence: 5,
      alignment: "left",
      componentType: "editableCheckbox",
      width: 140,
      minWidth: 120,
      maxWidth: 180,
      isReadOnly: true,
    },
    {
      accessor: "CTS",
      columnName: "CTS",
      sequence: 6,
      alignment: "left",
      componentType: "editableCheckbox",
      width: 140,
      minWidth: 120,
      maxWidth: 180,
      isReadOnly: true,
    },
  ],
};