import { GridMetaDataType } from "components/dataTableStatic";
/*
SELECT SECURITY_USER_PWD.WORD_TEXT,   
SECURITY_USER_PWD.ENTERED_BY,   
SECURITY_USER_PWD.ENTERED_DATE,   
SECURITY_USER_PWD.LAST_ENTERED_BY,   
SECURITY_USER_PWD.LAST_MODIFIED_DATE,   
SECURITY_USER_PWD.MACHINE_NM,   
SECURITY_USER_PWD.LAST_MACHINE_NM  
FROM SECURITY_USER_PWD   
*/
export const GuessPwdMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Guessable Password Entry",
    rowIdColumn: "SR_NO",
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
      min: "68vh",
      max: "68vh",
    },
    allowFilter: true,
    allowColumnHiding: true,
    isCusrsorFocused: true,
  },
  filters: [
    {
      accessor: "WORD_TEXT",
      columnName: "Guessable Password",
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
      isVisible: false,
      maxWidth: 100,
      isAutoSequence: true,
    },

    {
      accessor: "WORD_TEXT",
      columnName: "Guessable Password",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Modified By",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 200,
    },

    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Modified Date",
      sequence: 3,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
  ],
};
