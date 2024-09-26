import { GridMetaDataType } from "@acuteinfo/common-base";
export const ASBAGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ASBA",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 120,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "36vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      columnName: "Sr",
      accessor: "sr",
      sequence: 1,
      componentType: "default",
      width: 60,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Dep.Code",
      accessor: "DEPOSITORY_CODE",
      sequence: 2,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "App.Form Date",
      accessor: "TRAN_DT",
      sequence: 3,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Applicant Ref.No.",
      accessor: "APPLICANT_REF_NO",
      sequence: 4,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Enrollment ID",
      accessor: "ENROLLMENT_ID",
      sequence: 5,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "DP ID",
      accessor: "DP_ID",
      sequence: 6,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Client ID",
      accessor: "CLIENT_ID",
      sequence: 7,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "1st Holder Name",
      accessor: "CUSTOMER_NM",
      sequence: 8,
      componentType: "default",
      width: 200,
    },
    {
      columnName: "1st Holder PAN",
      accessor: "PAN_NO",
      sequence: 9,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "2nd Holder Name",
      accessor: "ACCT_NM1",
      sequence: 10,
      componentType: "default",
      width: 150,
    },
    {
      columnName: "2nd Holder PAN",
      accessor: "PAN_NO1",
      sequence: 11,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "3rd Holder Name",
      accessor: "ACCT_NM2",
      sequence: 12,
      componentType: "default",
      width: 150,
    },
    {
      columnName: "3rd Holder PAN",
      accessor: "PAN_NO2",
      sequence: 13,
      componentType: "default",
      width: 100,
    },
  ],
};
