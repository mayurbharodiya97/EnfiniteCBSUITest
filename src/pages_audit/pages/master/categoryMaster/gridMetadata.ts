import { GridMetaDataType } from "@acuteinfo/common-base";
export const CategoryMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: false,
    gridLabel: "",
    rowIdColumn: "CATEG_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 30, 50],
    defaultPageSize: 10,
    containerHeight: {
      min: "70vh",
      max: "70vh",
    },
    isCusrsorFocused: true,
    allowRowSelection: false,
  },

  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 60,
      minWidth: 40,
      maxWidth: 70,
      isAutoSequence: true,
    },
    {
      accessor: "CATEG_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 60,
      minWidth: 40,
      maxWidth: 70,
    },
    {
      accessor: "CATEG_NM",
      columnName: "CategoryName",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 170,
    },
    {
      accessor: "CONSTITUTION_TYPE_DESC",
      columnName: "TypeOfConstitution",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 170,
      maxWidth: 200,
    },
    {
      accessor: "TDS_LIMIT",
      columnName: "TDSLimit",
      sequence: 5,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      accessor: "TDS_RATE",
      columnName: "TDSPayableRate",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 150,
    },
    {
      accessor: "TDS_BRANCH_CD",
      columnName: "TDSPayableBranch",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 150,
    },
    {
      accessor: "TDS_ACCT_TYPE",
      columnName: "TDSPayableType",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "TDS_ACCT_CD",
      columnName: "TDSPayableA/cNo",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 150,
    },
    {
      accessor: "TDS_ACCT_NM",
      columnName: "TDSPayableAccountName",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 170,
      maxWidth: 190,
    },
    {
      accessor: "TDS_SURCHARGE",
      columnName: "SurchargeRate",
      sequence: 11,
      alignment: "right",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "TDS_SUR_ACCT_TYPE",
      columnName: "SurchargeType",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "TDS_SUR_ACCT_CD",
      columnName: "SurchargeA/cNo",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "TDS_REC_BRANCH_CD",
      columnName: "TDSReceivableBranch",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 150,
      maxWidth: 170,
    },
    {
      accessor: "TDS_REC_ACCT_TYPE",
      columnName: "TDSReceivableType",
      sequence: 15,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 150,
    },
    {
      accessor: "TDS_REC_ACCT_CD",
      columnName: "TDSReceivableAcNo",
      sequence: 16,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 150,
      maxWidth: 170,
    },
    {
      accessor: "TDS_REC_ACCT_NM",
      columnName: "TDSReceivableAccountName",
      sequence: 17,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 190,
      maxWidth: 210,
    },
    {
      accessor: "DROPDOWN_DISP",
      columnName: "Minor/Major",
      sequence: 18,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
    },
  ],
};
