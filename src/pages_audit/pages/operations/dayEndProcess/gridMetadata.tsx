export const pendingTrnsMetadata = {
  gridConfig: {
    dense: true,
    gridLabel: "Pending Transactions",
    rowIdColumn: "INDEX",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    disableGlobalFilter: true,
    enablePagination: true,
    pageSizes: [15, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "80vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    allowGlobalFilter: false,
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
      accessor: "DOCU_CD",
      columnName: "ScreenName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "SCREEN_NM",
      columnName: "",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 320,
    },
    {
      accessor: "ERR_CNT",
      columnName: "Count",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "OPEN",
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "Open",
      sequence: 14,
      alignment: "center",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
    },
    {
      accessor: "REPORT",
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "REPORT",
      sequence: 14,
      alignment: "center",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
    },
  ],
};
export const pendingTrnsEodReportMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "INDEX",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideActionBar: true,
    disableGroupBy: true,
    enablePagination: true,
    disableGlobalFilter: true,
    pageSizes: [15, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
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
      accessor: "ACCT_CD_DISP",
      columnName: "AcRef",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "VOUCHER_NO",
      columnName: "VersionNo",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "MESSAGE",
      columnName: "Remarks",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 400,
      minWidth: 200,
      maxWidth: 500,
    },
  ],
};
export const verifyDayendChecksumsMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SR_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideActionBar: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [30, 50, 100],
    disableGlobalFilter: true,
    defaultPageSize: 10,
    containerHeight: {
      min: "70vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    allowGlobalFilter: false,
  },
  filters: [],
  columns: [
    {
      accessor: "EXECUTE_SEQ",
      columnName: "Sequence",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 60,
      minWidth: 50,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "SR_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 60,
      minWidth: 50,
      maxWidth: 200,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 750,
      minWidth: 500,
      maxWidth: 800,
    },
    {
      accessor: "MENDETORY",
      columnName: "Mandatory",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 100,
    },
    {
      accessor: "ST_TIME",
      columnName: "StartTime",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "ED_TIME",
      columnName: "endTime",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "REPORT",
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "REPORT",
      sequence: 14,
      alignment: "center",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (
          original?.CLR !== "Y" &&
          original?.CLR !== "P" &&
          original?.CLR !== "X"
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      accessor: "PROCESS",
      columnName: "",
      componentType: "icondefault",
      buttonLabel: "Open",
      sequence: 14,
      alignment: "center",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
      isImageURL: true,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.CLR === "P") {
          return false;
        } else {
          return true;
        }
      },
    },
  ],
};
export const dayEndErroeLogMetaData = {
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
    disableGlobalFilter: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: true,
    allowColumnHiding: true,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sequence",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "BRACH_CD",
      columnName: "Branch",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TYPE",
      columnName: "Type",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_CD",
      columnName: "ACNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "V_NO",
      columnName: "VersionNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 4,
      alignment: "left",
      componentType: "date",
      width: 300,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
export const executeChecksumsReportMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "INDEX",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    hideActionBar: true,
    enablePagination: true,
    pageSizes: [15, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    disableGlobalFilter: true,
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
      accessor: "BRANCH_CD",
      columnName: "branch",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AcctType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AcRef",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "VOUCHER_NO",
      columnName: "VersionNo",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 90,
      maxWidth: 110,
    },
    {
      accessor: "MESSAGE",
      columnName: "Remarks",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 600,
      minWidth: 200,
      maxWidth: 700,
    },
  ],
};
