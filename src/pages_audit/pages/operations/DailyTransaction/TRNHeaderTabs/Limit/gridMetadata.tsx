import { GridMetaDataType } from "@acuteinfo/common-base";
export const LimitGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Limit",
    rowIdColumn: "TRAN_CD",
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
    hideHeader: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      columnName: "Sr",
      accessor: "sr",
      sequence: 1,
      componentType: "default",
      width: 60,
      maxWidth: 100,
      minWidth: 50,
      alignment: "right",
      isAutoSequence: true,
    },
    {
      columnName: "Entry Date",
      accessor: "ENTRY_DT",
      sequence: 2,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 100,
      alignment: "center",
    },
    {
      columnName: "Effective Date",
      accessor: "TRAN_DT",
      sequence: 3,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
      alignment: "center",
    },
    {
      columnName: "Expiry Date",
      accessor: "EXPIRY_DT",
      sequence: 4,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy",
      width: 120,
      alignment: "center",
    },
    {
      columnName: "IntRate",
      accessor: "INT_RATE",
      sequence: 5,
      componentType: "default",
      width: 120,
      alignment: "right",
    },
    {
      columnName: "Margin%",
      accessor: "MARGIN",
      sequence: 6,
      componentType: "default",
      width: 100,
      alignment: "right",
    },
    {
      columnName: "Over Rate",
      accessor: "PENAL_RATE",
      sequence: 7,
      componentType: "default",
      width: 120,
      alignment: "right",
    },
    // {
    //   columnName: "Over Rate",
    //   accessor: "PENAL_RATE",
    //   sequence: 8,
    //   componentType: "default",
    //   width: 120,
    // },
    {
      columnName: "Security Value",
      accessor: "SECURITY_VALUE",
      sequence: 9,
      componentType: "default",
      width: 120,
      alignment: "right",
      isDisplayTotal: true,
      totalDecimalCount: 2,
    },
    {
      columnName: "Limit Amount",
      accessor: "LIMIT_AMOUNT",
      sequence: 10,
      componentType: "currency",
      width: 120,
      alignment: "right",
      isDisplayTotal: true,
      totalDecimalCount: 2,
    },
    {
      columnName: "Description",
      accessor: "FD_DESC",
      sequence: 11,
      componentType: "default",
      width: 120,
    },
    {
      columnName: "Resolution Date",
      accessor: "RESOLUTION_DATE",
      sequence: 12,
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      alignment: "center",
      width: 120,
    },

    {
      columnName: "Force Expire",
      accessor: "FORCE_EXPIRE",
      sequence: 13,
      componentType: "default",
      width: 150,
    },
  ],
};
export const limitEntryTabMetaData = {
  form: {
    name: "limit-Entry",
    label: "LimitEntry",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    hideHeader: true,
    formStyle: {
      background: "white",
      height: "calc(100vh - 390px)",
      overflowY: "auto",
      overflowX: "hidden",
    },
    render: {
      ordering: "auto",
      // ordering: "sequence",
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
          height: "35vh",
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
      name: "AD_HOC_LIMIT_FLG",
      label: "LimitType",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "SECURITY",
      label: "Security",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "ENTRY_DT",
      fullWidth: true,
      label: "EntryDate",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "EffectiveDate",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "EXPIRY_DT",
      label: "ExpiryDate",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "RESOLUTION_DATE",
      fullWidth: true,
      label: "ResolutionDate",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SECURITY_VALUE",
      label: "SecurityValue",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "MARGIN",
      label: "Margin%",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SEC_AMOUNT",
      label: "SecurityAmount",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_AMT",
      label: "IntrestAmount",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_MARGIN",
      label: "IntrestMargin",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "INT_SEC_AMOUNT",
      label: "SecurityInterstAmount",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "PENAL_RATE",
      fullWidth: true,
      label: "OverDrawn",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "LimitAmount",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      fullWidth: true,
      label: "IntRate",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "Remark",
      },
      name: "REMARK",
      fullWidth: true,
      label: "Remarks",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DOCKET_NO",
      label: "DocketNumber",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CHARGE_AMT",
      label: "Charge",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_TAX",
      label: "GST",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "FORCE_EXP_DT",
      label: "ActualExpiredDate",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "RESOLUTION_NO",
      label: "ResolutionNumber",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
  ],
};
