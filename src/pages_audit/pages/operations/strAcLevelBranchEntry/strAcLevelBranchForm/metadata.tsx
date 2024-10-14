import { GridMetaDataType } from "@acuteinfo/common-base";
import * as API from "../api";

export const strLevelBranchEditFormMetaData = {
  form: {
    name: "StrBranchLevelEntryForm",
    label: "Str Branch Level Entry",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 4,
          md: 4,
        },
        container: {
          direction: "row",
          spacing: 1,
        },
      },
    },
    componentProps: {
      textField: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      inputMask: {
        fullWidth: true,
      },
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_BRANCH_CD",
      label: "BranchCode",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      label: "AccountType",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "ACNumber",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account_Name",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 5.7, md: 5.7, lg: 5.7, xl: 5.7 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_SUSP_STATUS",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "REMARKS2_VISIBLE",
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SUSPICIOUS_FLAG",
      label: "SuspiciousStatus",
      type: "text",
      fullWidth: true,
      required: true,
      disableCaching: true,
      options: () => {
        return API.getSuspStatusData();
      },
      _optionsKey: "getSuspStatusData",
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        formState.setDataOnFieldChange("IS_VISIBLE", field?.value);
      },
      dependentFields: ["DISABLE_SUSP_STATUS"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_SUSP_STATUS?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 2.8, md: 2.8, lg: 2.8, xl: 2.8 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "REASON_DESC",
      label: "SuspiciousReasons",
      GridProps: { xs: 12, sm: 4.9, md: 4.9, lg: 4.9, xl: 4.9 },
      skipDefaultOption: true,
      options: (dependentValue, formState, _, authState) => {
        return API.getSuspReasonData({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        });
      },
      _optionsKey: "getSuspReasonData",
      isReadOnly: true,
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "WithdrawBalance",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_NO",
      label: "PAN_NO",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS2",
      label: "InvestigationDetail",
      type: "text",
      fullWidth: true,
      // required: true,
      dependentFields: ["REMARKS2_VISIBLE"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.REMARKS2_VISIBLE?.value === "Y") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
  ],
};

export const suspiciousTransactionGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Suspicious Transaction",
    rowIdColumn: "LINE_ID",
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
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "55vh",
      max: "55vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
    footerNote:
      "Note - Only Suspicious marked transaction will be included in file.",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 50,
      minWidth: 80,
      maxWidth: 100,
      isAutoSequence: true,
    },

    {
      accessor: "TRAN_DT",
      columnName: "TRNDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      width: 100,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "REF_TRAN_CD",
      columnName: "VNo",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "SUSPICIOUS_FLAG",
      columnName: "Suspicious",
      sequence: 4,
      alignment: "center",
      componentType: "editableCheckbox",
      defaultValue: false,
      width: 80,
      minWidth: 90,
      maxWidth: 100,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 4,
      alignment: "right",
      componentType: "editableTextField",
      width: 200,
      minWidth: 250,
      maxWidth: 280,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 50,
      minWidth: 60,
      maxWidth: 80,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "chequeNo",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "M_VERIFIED_BY",
      columnName: "verifiedBy",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 150,
      maxWidth: 200,
    },
  ],
};
