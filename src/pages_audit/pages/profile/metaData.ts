import { GridMetaDataType } from "components/dataTableStatic";
import { getdashboxData, getquickView, getquickViewList } from "./api";
import { filter } from "lodash";

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
      label: "User Id",
      isReadOnly: true,
      placeholder: "User Id",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "GROUP_NAME",
      sequence: 6,
      type: "text",
      label: "User Group",
      isReadOnly: true,
      placeholder: "User Group",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "textField", group: 0 },
      name: "DEFAULT_BRANCH",
      sequence: 8,
      type: "text",
      label: "Default Branch",
      isReadOnly: true,
      placeholder: "Default Branch",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "phoneNumber", group: 0 },
      name: "MOBILE_NUMBER",
      sequence: 4,
      type: "text",
      label: "Mobile Number",
      isReadOnly: true,
      placeholder: "Mobile Number",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "CUSTOMER_ID",
      sequence: 8,
      type: "text",
      label: "Customer Id",
      isReadOnly: true,
      placeholder: "Customer Id",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "textField", group: 0 },
      name: "EMP_ID",
      sequence: 8,
      type: "text",
      label: "Employee Id",
      isReadOnly: true,
      placeholder: "Employee Id",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "EMAIL_ID",
      sequence: 1,
      type: "text",
      label: "Email Id",
      isReadOnly: true,
      placeholder: "Email Id",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "checkbox", group: 0 },
      name: "ALLOW_RELEASE",
      sequence: 9,
      type: "text",
      label: "Allowed Release",
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
      label: "Debit Transaction Limit",
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
      label: "Cash withdrawal Limit",
      isReadOnly: true,
      placeholder: "Debit Cash Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "amountField", group: 0 },
      name: "DR_CLEARING_LIMIT",
      sequence: 8,
      type: "text",
      label: "Clearing Limit",
      isReadOnly: true,
      placeholder: "Debit Clearing Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },

    {
      render: { componentType: "amountField", group: 0 },
      name: "DR_TRANSFER_LIMIT",
      sequence: 8,
      type: "text",
      label: "Transfer Limit",
      isReadOnly: true,
      placeholder: "Debit Transfer Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "sss",
      label: "Credit Transaction Limit",
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
      label: "Cash Reciept Limit",
      isReadOnly: true,
      placeholder: "Credit Cash Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_CLEARING_LIMIT",
      sequence: 8,
      type: "text",
      label: "Clearing Limit",
      isReadOnly: true,
      placeholder: "Credit Clearing Limit",
      GridProps: { xs: 12, md: 3, sm: 3 },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_TRANSFER_LIMIT",
      sequence: 8,
      type: "text",
      label: "Transfer Limit",
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
    gridLabel: "User Login Details",
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
      columnName: "Sr. No.",
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
      columnName: "Login ID",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "LOGIN_DT",
      columnName: "Login Date",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 250,
    },
    {
      accessor: "USER_FLAG",
      columnName: "Login Flag",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "LOGOUT_DT",
      columnName: "Logout Date",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 140,
      minWidth: 130,
      maxWidth: 250,
    },
    {
      accessor: "REMARKS",
      columnName: "Activity Remarks",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "IP_ADDR",
      columnName: "IP Address",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_USER_NAME",
      columnName: "Released User",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_DT",
      columnName: "Released Date",
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
    gridLabel: "Branch Access Rights",
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
      columnName: "Sr. No.",
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
    gridLabel: "Product Access Rights",
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
      columnName: "Sr. No.",
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
    gridLabel: "Quick View",
    rowIdColumn: "ID",
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
      min: "48vh",
      max: "65vh",
    },
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 40,
      maxWidth: 80,
      isAutoSequence: true,
    },
    {
      accessor: "DOC_CD",
      columnName: "",
      sequence: 2,
      alignment: "left",
      componentType: "editableSelect",
      options: getquickViewList,
      validation: (value, data, prev, next) => {
        // if (!Boolean(value)) {
        //   return "This field is required";
        // }
        if (Array.isArray(prev)) {
          let lb_error = false;
          let ls_msg = "";
          prev.forEach((item, index) => {
            if (lb_error) {
              return ls_msg;
            }
            if (value === item?.DOC_CD) {
              lb_error = true;
              // ls_msg = "Option is Already entered at Line " + (index + 1);
              ls_msg = "Option is Already entered at above Line ";
              return ls_msg;
            }
          });
          if (lb_error) {
            return ls_msg;
          }
        }
        return "";
      },
      _optionsKey: "getquickViewList",
      width: 370,
      maxWidth: 370,
      minWidth: 200,
    },
  ],
};
export const PersonlizationDashboardGridData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Dashboard Data Cards",
    rowIdColumn: "ID",
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
      min: "58vh",
      max: "65vh",
    },
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 40,
      maxWidth: 80,
      isAutoSequence: true,
    },
    {
      accessor: "DASH_TRAN_CD",
      columnName: "",
      sequence: 2,
      alignment: "left",
      componentType: "editableSelect",
      options: getdashboxData,
      _optionsKey: "getdashboxData",
      width: 370,
      maxWidth: 370,
      minWidth: 200,
      validation: (value, data, prev, next) => {
        // if (!Boolean(value)) {
        //   return "This field is required";
        // }
        if (Array.isArray(prev)) {
          let lb_error = false;
          let ls_msg = "";
          prev.forEach((item, index) => {
            if (lb_error) {
              return ls_msg;
            }
            if (value === item?.DASH_TRAN_CD) {
              lb_error = true;
              // ls_msg = "Option is Already entered at Line " + (index + 1);
              ls_msg = "Option is Already entered at above Line ";
              return ls_msg;
            }
          });
          if (lb_error) {
            return ls_msg;
          }
        }
        return "";
      },
    },
  ],
};
