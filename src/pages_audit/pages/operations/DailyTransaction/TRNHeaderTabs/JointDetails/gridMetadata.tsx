import { GridMetaDataType } from "@acuteinfo/common-base";
export const JointDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "jointDetails",
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
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      columnName: "SrNo",
      accessor: "SR_NO",
      sequence: 1,
      componentType: "default",
      isAutoSequence: true,
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "type",
      accessor: "JOINT_DISC",
      sequence: 2,
      componentType: "default",
      width: 100,
    },

    {
      columnName: "PersonName",
      accessor: "REF_PERSON_NAME",
      sequence: 3,
      componentType: "default",
      width: 250,
      showTooltip: true,
    },
    {
      columnName: "Designation",
      accessor: "DESIGNATION_NM",
      sequence: 4,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "MemTypeACNo",
      accessor: "MEM_ACCT_CD",
      sequence: 5,
      componentType: "default",
      width: 150,
    },
    {
      columnName: "ReferenceAccount",
      accessor: "REF_ACCT_CD",
      sequence: 6,
      componentType: "default",
      width: 150,
    },
    {
      columnName: "ContactNo",
      accessor: "MOBILE_NO",
      sequence: 7,
      componentType: "default",
      width: 200,
    },
    {
      columnName: "CustomerId",
      accessor: "CUSTOMER_ID",
      sequence: 8,
      componentType: "default",
      width: 100,
    },
  ],
};