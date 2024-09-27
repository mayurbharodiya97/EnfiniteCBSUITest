import { GridMetaDataType } from "@acuteinfo/common-base";
export const ParametersGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "PARA_CD",
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
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: true,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [
    {
      accessor: "PARA_CD",
      columnName: "Code",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "PARA_NM",
      columnName: "Description",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "DATATYPE_CD",
      columnName: "Datatype",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "PARA_VALUE",
      columnName: "Value",
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
      columnName: "Sr No",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      isAutoSequence: true,
      width: 80,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "PARA_CD",
      columnName: "Code",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "PARA_NM",
      columnName: "Description",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 400,
      minWidth: 200,
      maxWidth: 600,
    },
    {
      accessor: "DATATYPE_DISP_VALUE",
      columnName: "Datatype",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "PARA_VALUE",
      columnName: "Value",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      columnName: "Change History",
      componentType: "buttonRowCell",
      accessor: "SIGN_PATH",
      sequence: 4,
      buttonLabel: "...",
      isVisible: true,
      width: 120,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      accessor: "CONFIRMED_STATUS",
      columnName: "Confirm Status",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      color: (val, data) => {
        let confirmed = data?.original?.CONFIRMED ?? "";
        return confirmed === "N"
          ? "red"
          : confirmed === "R"
          ? "rgb(128, 0, 0)"
          : "inherit";
      },
      width: 230,
      minWidth: 220,
      maxWidth: 300,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Modified By",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Modified Date",
      sequence: 9,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
  ],
};
export const AuditMetadata: GridMetaDataType = {
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
    hideHeader: false,
    disableGroupBy: true,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "OLD_VALUE",
      columnName: "Old Value",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 70,
      maxWidth: 150,
    },
    {
      accessor: "NEW_VALUE",
      columnName: "New Value",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 70,
      maxWidth: 150,
    },
    {
      accessor: "MODIFIED_BY",
      columnName: "Modified By",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "MODIFIED_DATE",
      columnName: "Modified Date",
      sequence: 4,
      alignment: "left",
      dateFormat: "dd/MM/yyyy hh:mm:ss",
      componentType: "dateTime",
      width: 100,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "MACHINE_NM",
      columnName: "Modified Machine",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "Verified By",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "Verified Date",
      sequence: 5,
      alignment: "left",
      dateFormat: "dd/MM/yyyy hh:mm:ss",
      componentType: "default",
      width: 150,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "VERIFIED_MACHINE_NM",
      columnName: "Verified Machine",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 80,
      maxWidth: 150,
    },
  ],
};
