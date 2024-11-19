import { GridMetaDataType } from "@acuteinfo/common-base";
export const AgentMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: false,
    gridLabel: "",
    rowIdColumn: "AGENT_CD",
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
      width: 70,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "AGENT_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 60,
      minWidth: 40,
      maxWidth: 70,
    },
    {
      accessor: "AGENT_NM",
      columnName: "Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 180,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "GROUP_CD_NM",
      columnName: "Group",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 70,
      maxWidth: 150,
    },
    {
      accessor: "AGENT_BRANCH_CD",
      columnName: "AgentAccountBranch",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "AGENT_TYPE_CD",
      columnName: "AgentAccountType",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "AGENT_ACCT_CD",
      columnName: "AgentAccountNo",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AgentAccountName",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 180,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "SECURITY_BRANCH",
      columnName: "SecurityAccountBranch",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "SECURITY_TYPE_CD",
      columnName: "SecurityAccountType",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "SECURITY_ACCT_CD",
      columnName: "SecurityAccountNo",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "SECURITY_ACCT_NM",
      columnName: "SecurityAccountName",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 180,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "SECURITY_AMT",
      columnName: "SecurityAmount",
      sequence: 13,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 140,
      maxWidth: 200,
    },
    {
      accessor: "SECURITY_PER",
      columnName: "Security%",
      sequence: 14,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "SECURITY_FLAG_DISP_VAL",
      columnName: "SecurityCalculationOn",
      sequence: 15,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 250,
      showTooltip: true,
    },
    {
      accessor: "OTH_BRANCH_CD",
      columnName: "OtherAccountBranch",
      sequence: 16,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "OTH_ACCT_TYPE",
      columnName: "OtherAccountType",
      sequence: 17,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "OTH_ACCT_CD",
      columnName: "OtherAccountNo",
      sequence: 18,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "OTHER_ACCT_NM",
      columnName: "OtherAccountName",
      sequence: 19,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 200,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "PTAX_BRANCH_CD",
      columnName: "ProfessionalTaxAccountBranch",
      sequence: 20,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 200,
      maxWidth: 250,
    },
    {
      accessor: "PTAX_ACCT_TYPE",
      columnName: "ProfessionalTaxAccountType",
      sequence: 21,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 200,
      maxWidth: 250,
    },
    {
      accessor: "PTAX_ACCT_CD",
      columnName: "ProfessionalTaxAccountNo",
      sequence: 22,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 180,
      maxWidth: 250,
    },
    {
      accessor: "PTAX_ACCT_NM",
      columnName: "ProfessionalTaxAccountName",
      sequence: 23,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 180,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "PTAX_DEF_TRAN_NM",
      columnName: "ProfessionalTaxAccountConfiguration",
      sequence: 24,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 240,
      maxWidth: 300,
      showTooltip: true,
    },
    {
      accessor: "PIGMY_CONF_NM",
      columnName: "HandHeldMachineConfiguration",
      sequence: 25,
      alignment: "left",
      componentType: "default",
      width: 230,
      minWidth: 220,
      maxWidth: 240,
    },
    {
      accessor: "TDS_RATE",
      columnName: "HandHeldMachineTDSRate",
      sequence: 26,
      alignment: "right",
      componentType: "default",
      width: 210,
      minWidth: 180,
      maxWidth: 250,
    },
  ],
};
