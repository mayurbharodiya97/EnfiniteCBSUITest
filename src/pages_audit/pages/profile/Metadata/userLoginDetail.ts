import { GridMetaDataType } from "@acuteinfo/common-base";

export const UserLoginDtlGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "UserLoginDetails",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: true,
    disableGroupBy: true,
    enablePagination: false,
    disableGlobalFilter: true,
    containerHeight: {
      min: "43vh",
      max: "43vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 75,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "USERNAME",
      columnName: "LoginID",
      sequence: 2,
      alignment: "center",
      componentType: "default",
      width: 90,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "LOGIN_DT",
      columnName: "LoginDate",
      sequence: 3,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "USER_FLAG",
      columnName: "LoginFlag",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "LOGOUT_DT",
      columnName: "LogoutDate",
      sequence: 5,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "ActivityRemarks",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "IP_ADDR",
      columnName: "IPAddress",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_USER_NAME",
      columnName: "ReleasedUser",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 145,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_DT",
      columnName: "ReleasedDate",
      sequence: 9,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 125,
      minWidth: 100,
      maxWidth: 150,
    },
  ],
};
