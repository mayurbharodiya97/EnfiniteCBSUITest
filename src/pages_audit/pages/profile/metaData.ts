import { GridMetaDataType } from "components/dataTableStatic";
import { getdashboxData } from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { filter } from "lodash";

export const UserProfileMetaData = {
  form: {
    name: "user-profile",
    label: "UserProfile",
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
          spacing: 1.5,
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
      label: "UserID",
      isReadOnly: true,
      placeholder: "UserID",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "GROUP_NAME",
      sequence: 6,
      type: "text",
      label: "UserGroup",
      isReadOnly: true,
      fullWidth: true,
      placeholder: "User Group",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },

    {
      render: { componentType: "phoneNumber", group: 0 },
      name: "MOBILE_NUMBER",
      sequence: 4,
      type: "text",
      label: "MobileNo",
      isReadOnly: true,
      fullWidth: true,
      placeholder: "MobileNo",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "CUSTOMER_ID",
      sequence: 8,
      type: "text",
      label: "CustomerId",
      fullWidth: true,
      isReadOnly: true,
      placeholder: "Customer ID",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "DEFAULT_BRANCH",
      sequence: 8,
      type: "text",
      label: "DefaultBranch",
      fullWidth: true,
      isReadOnly: true,
      placeholder: "Default Branch",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "EMP_ID",
      sequence: 8,
      type: "text",
      label: "EmployeeId",
      fullWidth: true,
      isReadOnly: true,
      placeholder: "Employee Id",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "EMAIL_ID",
      sequence: 8,
      type: "text",
      fullWidth: true,
      label: "EmailId",
      isReadOnly: true,
      placeholder: "EmailID",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: { componentType: "checkbox", group: 0 },
      name: "ALLOW_RELEASE",
      sequence: 9,
      fullWidth: true,
      type: "text",
      label: "AllowedRelease",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: { componentType: "checkbox", group: 0 },
      name: "VIEW_SIGNATURE",
      sequence: 9,
      type: "text",
      fullWidth: true,
      label: "Signature",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CIBVILEW",
      fullWidth: true,
      label: "DebitTransactionLimit",
      defaultValue: "Debit Transaction Limit",
      TypographyProps: { variant: "h6" },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
      },
    },

    {
      render: { componentType: "amountField", group: 0 },
      name: "DR_CASE_LIMIT",
      fullWidth: true,
      sequence: 8,
      type: "text",
      label: "CashwithdrawalLimit",
      isReadOnly: true,
      placeholder: "Debit Cash Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: { componentType: "amountField", group: 0 },
      name: "DR_CLEARING_LIMIT",
      sequence: 8,
      type: "text",
      label: "ClearingLimit",
      fullWidth: true,
      isReadOnly: true,
      placeholder: "Debit Clearing Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: { componentType: "amountField", group: 0 },
      fullWidth: true,
      name: "DR_TRANSFER_LIMIT",
      sequence: 8,
      type: "text",
      label: "TransferLimit",
      isReadOnly: true,
      placeholder: "Debit Transfer Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CIBVEW",
      fullWidth: true,
      label: "",
      defaultValue: "Credit Transaction Limit",
      TypographyProps: { variant: "h6" },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
      },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_CASE_LIMIT",
      sequence: 8,
      type: "text",
      label: "CashRecieptLimit",
      fullWidth: true,
      isReadOnly: true,
      placeholder: "Credit Cash Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_CLEARING_LIMIT",
      sequence: 8,
      type: "text",
      label: "ClearingLimit",
      isReadOnly: true,
      fullWidth: true,
      placeholder: "Credit Clearing Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: { componentType: "amountField", group: 0 },
      name: "CR_TRANSFER_LIMIT",
      sequence: 8,
      type: "text",
      label: "TransferLimit",
      isReadOnly: true,
      fullWidth: true,
      validate: "getValidateValue",
      placeholder: "Credit Transfer Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
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
    hideFooter: true,
    disableGroupBy: true,
    enablePagination: false,
    disableGlobalFilter: true,
    containerHeight: {
      min: "43vh",
      max: "43vh",
    },
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
      width: 75,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "USERNAME",
      columnName: "LoginID",
      sequence: 2,
      alignment: "center",
      componentType: "default",
      width: 90,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "LOGIN_DT",
      columnName: "LoginDate",
      sequence: 3,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "USER_FLAG",
      columnName: "LoginFlag",
      sequence: 4,
      alignment: "center",
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
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 100,
      maxWidth: 150,
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
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_USER_NAME",
      columnName: "ReleasedUser",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 145,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "RELEASED_DT",
      columnName: "ReleasedDate",
      sequence: 9,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 125,
      minWidth: 100,
      maxWidth: 150,
    },
  ],
};
export const userAccessbranchMetadata: GridMetaDataType = {
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
    containerHeight: {
      min: "36vh",
      max: "36vh",
    },
    enablePagination: true,
    pageSizes: [20, 30, 40],
    defaultPageSize: 20,
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
      width: 75,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch",
      sequence: 2,
      alignment: "center",
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
      width: 170,
      minWidth: 140,
      maxWidth: 200,
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
export const userAccesstypeMetadata: GridMetaDataType = {
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
    defaultPageSize: 20,
    containerHeight: {
      min: "36vh",
      max: "36vh",
    },
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
      width: 75,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },

    {
      accessor: "TYPE_NM",
      columnName: "Product",
      sequence: 3,
      alignment: "left",
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
      min: "43vh",
      max: "43vh",
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
      accessor: "DOC_CD",
      columnName: "",
      sequence: 2,
      alignment: "left",
      componentType: "editableAutocomplete",
      enableDefaultOption: true,
      options: GeneralAPI.getquickViewList,
      _optionsKey: "getquickViewList",
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
            if (item?.DOC_CD == "") {
              return ls_msg;
            }
            if (value === item?.DOC_CD) {
              lb_error = true;
              // ls_msg = "Option is Already entered at Line " + (index + 1);
              ls_msg = "Option is Already entered";
              return ls_msg;
            }
          });
          if (lb_error) {
            return ls_msg;
          }
        }
        return "";
      },
      width: 420,
      maxWidth: 500,
      minWidth: 350,
    },
  ],
};
export const PersonlizationDashboardGridData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "DashboardDataCards",
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
      min: "43vh",
      max: "43vh",
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
      accessor: "DASH_TRAN_CD",
      columnName: "",
      sequence: 2,
      alignment: "left",
      componentType: "editableAutocomplete",
      enableDefaultOption: true,
      options: getdashboxData,
      _optionsKey: "getdashboxData",
      width: 420,
      maxWidth: 500,
      minWidth: 350,
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
            if (item?.DASH_TRAN_CD == "") {
              return ls_msg;
            }
            if (value === item?.DASH_TRAN_CD) {
              lb_error = true;
              // ls_msg = "Option is Already entered at Line " + (index + 1);
              ls_msg = "Option is Already entered  ";
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
