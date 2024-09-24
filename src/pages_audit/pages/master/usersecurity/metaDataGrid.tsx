import { GridMetaDataType } from "components/dataTableStatic";
export const UserSecurity: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "USER_NAME",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "65vh",
      max: "65vh",
    },
    allowFilter: true,
    allowColumnHiding: true,
    isCusrsorFocused: true,
    allowRowSelection:false,
  },
  filters: [
    {
      accessor: "USER_NAME",
      columnName: "User ID",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "USER_LEVEL",
      columnName: "User Level",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "GROUP_NAME",
      columnName: "User Group Name",
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
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "USER_NAME",
      columnName: "User ID",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "User Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 100,
      maxWidth: 400,
      showTooltip: true,
    },
    {
      accessor: "USER_LVL_DATA_DISP",
      columnName: "User Level",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 60,
      maxWidth: 400,
    },
    {
      accessor: "GROUP_NAME",
      columnName: "Group Name",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "Customer Id",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CONTACT2",
      columnName: "Mobile No.",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "DEF_BRANCH_CD",
      columnName: "Default Branch",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CONFIRMED",
      columnName: "Confirmed",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Last Entered by",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Last Modified",
      sequence: 11,
      alignment: "left",
      componentType: "date",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};