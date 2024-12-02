import { GridMetaDataType } from "@acuteinfo/common-base";
export const PMBYGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "PMBY",
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
      columnName: "SrNo",
      accessor: "sr",
      sequence: 1,
      componentType: "default",
      width: 80,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Type",
      accessor: "SELF_JOINT",
      sequence: 2,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "ApplicantName",
      accessor: "APPLICANT_NM",
      sequence: 3,
      componentType: "default",
      width: 200,
    },
    {
      columnName: "CustomerId",
      accessor: "CUSTOMER_ID",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 100,
    },
    {
      columnName: "RegistrationNumber",
      accessor: "TRAN_CD",
      alignment: "right",
      sequence: 5,
      componentType: "default",
      width: 125,
    },
    {
      accessor: "TRAN_DT",
      columnName: "RegistrationDate",
      sequence: 5,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 130,
    },
    {
      accessor: "UPLOAD_DT",
      columnName: "LastPremiumDate",
      sequence: 5,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 140,
    },
    {
      columnName: "PremiumAmount",
      accessor: "PREMIUM_AMT",
      sequence: 6,
      componentType: "currency",
      alignment: "right",
      width: 130,
    },
    {
      columnName: "Nominee",
      accessor: "NOMINEE_NM",
      sequence: 7,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "NomineeRelation",
      accessor: "NOMINEE_RELATION_TYPE",
      sequence: 7,
      componentType: "default",
      width: 165,
    },
    {
      columnName: "InsuranceThrough",
      accessor: "INSURANCE_TRAN_CD",
      sequence: 7,
      componentType: "default",
      showTooltip: true,
      width: 140,
    },
    {
      columnName: "Status",
      accessor: "ACTIVE",
      sequence: 7,
      componentType: "default",
      width: 100,
    },
  ],
};