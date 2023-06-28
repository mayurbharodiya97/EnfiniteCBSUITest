import { GridMetaDataType } from "components/dataTableStatic";

export const UserProfileMetaData = {
  form: {
    name: "PRIORITY",
    label: "User Profile",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
    componentProps: {
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "textField", group: 0 },
      name: "USER_ID",
      sequence: 1,
      type: "text",
      label: "UserId",
      isReadOnly: true,
      placeholder: "User Id",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "textField", group: 0 },
      name: "GROUP_NAME",
      sequence: 6,
      type: "text",
      label: "UserGroup",
      isReadOnly: true,
      placeholder: "User Group",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "textField", group: 0 },
      name: "DEFAULT_BRANCH",
      sequence: 8,
      type: "text",
      label: "DefaultBranch",
      isReadOnly: true,
      placeholder: "Default Branch",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "CUSTOMER_ID",
      sequence: 8,
      type: "text",
      label: "CustomerId",
      isReadOnly: true,
      placeholder: "Customer Id",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "textField", group: 0 },
      name: "EMP_ID",
      sequence: 8,
      type: "text",
      label: "EmployeeId",
      isReadOnly: true,
      placeholder: "Employee Id",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "checkbox", group: 0 },
      name: "ALLOW_RELEASE",
      sequence: 9,
      type: "text",
      label: "AllowedRelease",
      isReadOnly: true,
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "checkbox", group: 0 },
      name: "VIEW_SIGNATURE",
      sequence: 9,
      type: "text",
      label: "Signature",
      isReadOnly: true,
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CIBVIEW",
      label: "DebitTransactionLimit",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },

    {
      render: { componentType: "amountField", group: 0 },
      name: "DR_CASE_LIMIT",
      sequence: 8,
      type: "text",
      label: "CashwithdrawalLimit",
      isReadOnly: true,
      placeholder: "Debit Cash Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "amountField", group: 0 },
      name: "DR_CLEARING_LIMIT",
      sequence: 8,
      type: "text",
      label: "ClearingLimit",
      isReadOnly: true,
      placeholder: "Debit Clearing Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "amountField", group: 0 },
      name: "DR_TRANSFER_LIMIT",
      sequence: 8,
      type: "text",
      label: "TransferLimit",
      isReadOnly: true,
      placeholder: "Debit Transfer Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CIBVIEW",
      label: "CreditTransactionLimit",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_CASE_LIMIT",
      sequence: 8,
      type: "text",
      label: "CashRecieptLimit",
      isReadOnly: true,
      placeholder: "Credit Cash Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_CLEARING_LIMIT",
      sequence: 8,
      type: "text",
      label: "ClearingLimit",
      isReadOnly: true,
      placeholder: "Credit Clearing Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_TRANSFER_LIMIT",
      sequence: 8,
      type: "text",
      label: "TransferLimit",
      isReadOnly: true,
      validate: "getValidateValue",
      placeholder: "Credit Transfer Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
  ],
};

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
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    // containerHeight: {
    //   min: "30vh",
    //   max: "83vh",
    // },
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
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "USERNAME",
      columnName: "LoginID",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "LOGIN_DT",
      columnName: "LoginDate",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 250,
    },
    {
      accessor: "USER_FLAG",
      columnName: "LoginFlag",
      sequence: 4,
      alignment: "left",
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
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 250,
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
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_USER_NAME",
      columnName: "ReleasedUser",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_DT",
      columnName: "ReleasedDate",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 250,
    },
  ],
};
export const userAccessbranch: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "BranchAccessRights",
    rowIdColumn: "BRANCH_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    allowRowSelection: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      accessor: "BRANCH_NM",
      columnName: "Name",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "LOGIN_ACCESS",
      columnName: "Login",
      sequence: 3,
      alignment: "center",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      accessor: "REPORT_ACCESS",
      columnName: "Report",
      sequence: 3,
      alignment: "center",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
  ],
};
export const userAccesstype: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ProductAccessRights",
    rowIdColumn: "ACCT_TYPE",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 40, 60],
    defaultPageSize: 10,
    // disableGlobalFilter: true,
    // containerHeight: {
    //   min: "30vh",
    //   max: "83vh",
    // },
    // allowFilter: false,
    // allowColumnHiding: false,
    allowRowSelection: false,
    // isCusrsorFocused: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },

    {
      accessor: "TYPE_NM",
      columnName: "Product",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      width: 280,
      minWidth: 280,
      maxWidth: 300,
    },
    {
      accessor: "ACCESS",
      columnName: "Access",
      sequence: 3,
      alignment: "center",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
  ],
};

export const PersonlizationQuickGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "QuickView",
    rowIdColumn: "CUST_ID",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableGlobalFilter: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: true,
    disableGroupBy: true,
    allowRowSelection: false,
    containerHeight: {
      min: "62vh",
      max: "65vh",
    },
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 40,
      maxWidth: 80,
      isAutoSequence: true,
    },
    {
      accessor: "CLOSE_DT",
      columnName: "",
      sequence: 2,
      alignment: "left",
      componentType: "editableSelect",
      width: 370,
      maxWidth: 370,
      minWidth: 200,
    },
  ],
};
export const PersonlizationDashboardGridData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "DashboardDataBoxes",
    rowIdColumn: "CUST_ID",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableGlobalFilter: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: true,
    disableGroupBy: true,
    allowRowSelection: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 40,
      maxWidth: 80,
      isAutoSequence: true,
    },
    {
      accessor: "ACCT_NAME",
      columnName: "",
      sequence: 2,
      alignment: "left",
      componentType: "editableSelect",
      width: 370,
      maxWidth: 370,
      minWidth: 200,
    },
  ],
};
