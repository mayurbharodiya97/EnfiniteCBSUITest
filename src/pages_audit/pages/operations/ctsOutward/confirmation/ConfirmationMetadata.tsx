import { GridMetaDataType } from "components/dataTableStatic";
import { isValid } from "date-fns";
export const RetrieveFormConfigMetaData = {
  form: {
    name: "RetrieveFormConfigMetaData",
    label: "ClearingRetrieveInformation",
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
        componentType: "datePicker",
      },
      name: "FROM_TRAN_DT",
      label: "GeneralFromDate",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FromDateRequired"] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Mustbeavaliddate";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TO_TRAN_DT",
      label: "GeneralToDate",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ToDateRequired"] }],
      },
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Mustbeavaliddate";
        }
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.FROM_TRAN_DT?.value)
        ) {
          return "ToDateshouldbegreaterthanorequaltoFromDate";
        }
        return "";
      },
      dependentFields: ["FROM_TRAN_DT"],
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      disableCaching: true,
      requestProps: "ZONE_TRAN_TYPE",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "SLIP_CD",
      label: "SlipNo",
      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "ChequeNo",

      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
      // maxLength: 50,
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "BANK_CD",
      label: "BankCode",

      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CHEQUE_AMOUNT",
      label: "ChequeAmount",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "RETRIEVE",
      label: "Retrieve",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "VIEW_ALL",
      label: "ViewAll",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1, xl: 1 },
    },
  ],
};

export const CtsOutwardClearingConfirmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "RetrieveGrid",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "50vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    // {
    //   accessor: "SR_NO",
    //   columnName: "Sr.No.",
    //   sequence: 1,
    //   alignment: "rigth",
    //   componentType: "default",
    //   width: 70,
    //   minWidth: 60,
    //   maxWidth: 120,
    //   isAutoSequence: true,
    // },
    {
      accessor: "SLIP_CD",
      columnName: "SlipNo",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_CNT",
      columnName: "ChequeCount",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_LIST",
      columnName: "ChequeNoList",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_AMT_LIST",
      columnName: "ChequeAmountList",
      sequence: 5,
      alignment: "right",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "TRAN_DT",
      columnName: "CLGDate",
      sequence: 6,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },

    {
      accessor: "CONFIRMED",
      columnName: "ConfirmStatus",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "THROUGH_CHANNEL",
      columnName: "EntryFrom",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 10,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "VerifiedBy",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "VerifiedDate",
      sequence: 12,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
  ],
};
export const DualConfHistoryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "DualConfirmationHistory",
    rowIdColumn: "TRAN_CD",
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
      min: "50vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "TRN_CONF_CNT",
      columnName: "EntryType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "EnterBy",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Date",
      sequence: 4,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "MACHINE_NM",
      columnName: "Machine",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
  ],
};
export const CTSOutwardClearingConfirmMetaData = {
  form: {
    name: "ctsOWClearing",
    label: "CTS O/W Clearing",
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
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "PresentmentDate",
      placeholder: "",
      GridProps: { xs: 6, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ZONE",
      label: "Zone",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      // runValidationOnDependentFieldsChange: true,
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      disableCaching: true,
      dependentFields: ["TRAN_DT"],
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_CD",
      label: "SlipNo",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __NEW__: {
        dependentFields: ["TRAN_DT", "ZONE", "ZONE_TRAN_TYPE"],
        setValueOnDependentFieldsChange: "getSlipNoData",
      },
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        textFieldStyle: {
          "& .MuiInputBase-root": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
          },
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
      },
      accountTypeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        isFieldFocused: true,
        defaultfocus: true,
        textFieldStyle: {
          "& .MuiInputBase-root": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
          },
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
      },
      accountCodeMetadata: {
        fullWidth: true,
        textFieldStyle: {
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NAME",
      label: "Account_Name",
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "ShadowBalance",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "SlipAmount",
      placeholder: "",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ENTERED_BY",
      label: "Maker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "ENTERED_DATE",
      label: "MakerTime",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CONFIRMED",
      label: "ConfirmStatus",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.1, md: 1.1, lg: 1.1, xl: 1.1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "VERIFIED_BY",
      label: "Checker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      dependentFields: ["CONFIRMED"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 1.3, md: 1.2, lg: 1.2, xl: 1.5 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "VERIFIED_DATE",
      label: "CheckerTime",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      fullWidth: true,
      isReadOnly: true,
      dependentFields: ["CONFIRMED"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ZONE_TRAN_TYPE",
    },
  ],
};
export const ctsOutwardChequeDetailConfirmMetaData: any = {
  form: {
    refID: 1667,
    name: "ChequeDetailFormMetaData",
    label: "Cheque Detail",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",

      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      isRemoveButton: true,
      displayCountName: "Cheque Detail",
      fixedRows: true,
      isScreenStyle: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "deleteTitle",
      name: "chequeDetails",
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHEQUE_NO",
          label: "ChequeNo",
          placeholder: "Cheque No.",
          type: "text",
          required: true,
          autoComplete: "off",
          textFieldStyle: {
            "& .MuiInputBase-input": {
              background: "var(--theme-color5)",
              color: "var(--theme-color2) !important",
              "&.Mui-disabled": {
                color: "var(--theme-color2) !important",
                "-webkit-text-fill-color": "var(--theme-color2) !important",
              },
            },
          },
          GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "BANK_CD",
          label: "BankCode",
          placeholder: "BankCode",
          type: "text",
          required: true,
          autoComplete: "off",
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "BankName",
          placeholder: "",
          type: "text",
          required: true,
          isReadOnly: true,
          showMaxLength: true,
          autoComplete: "off",
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.8, xl: 2.5 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "ECS_SEQ_NO",
          label: "PayeeACNo",
          placeholder: "",
          type: "text",
          required: true,
          GridProps: { xs: 12, sm: 2, md: 1.9, lg: 1.9, xl: 1.5 },
        },

        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "ChequeDate",
          placeholder: "",
          format: "dd/MM/yyyy",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH",
          label: "Description",
          type: "text",
          fullWidth: true,
          required: true,
          GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQ_MICR_CD",
          label: "CHQMicr",
          type: "text",
          fullWidth: true,
          defaultValue: "10",
          required: true,
          GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ECS_USER_NO",
          label: "PayeeName",
          placeholder: "",
          type: "text",
          required: true,
          autoComplete: "off",
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "ChequeAmount",
          placeholder: "",
          required: true,
          type: "text",
          textFieldStyle: {
            "& .MuiInputBase-root": {
              background: "var(--theme-color5)",
              color: "var(--theme-color2) !important",
            },
            "& .MuiInputBase-input": {
              background: "var(--theme-color5)",
              color: "var(--theme-color2) !important",
              "&.Mui-disabled": {
                color: "var(--theme-color2) !important",
                "-webkit-text-fill-color": "var(--theme-color2) !important",
              },
            },
          },
          GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
        },
      ],
    },
  ],
};
export const inwardReturnChequeDetailConfirmMetaData: any = {
  form: {
    refID: 1667,
    name: "ChequeDetailFormMetaData",
    label: "Cheque Detail",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",

      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      isRemoveButton: true,
      displayCountName: "Cheque Detail",
      fixedRows: true,
      isScreenStyle: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "deleteTitle",
      name: "chequeDetails",
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "BANK_CD",
          label: "BankCode",
          placeholder: "BankCode",
          type: "text",
          required: true,
          autoComplete: "off",
          GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "BankName",
          placeholder: "",
          type: "text",
          required: true,
          isReadOnly: true,
          showMaxLength: true,
          autoComplete: "off",
          GridProps: { xs: 12, sm: 3.2, md: 3.2, lg: 3.2, xl: 3.2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH",
          label: "Description",
          type: "text",
          fullWidth: true,
          required: true,
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REASON_DESCRIPTION",
          label: "Reason",
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQ_MICR_CD",
          label: "CHQMicr",
          type: "text",
          fullWidth: true,
          defaultValue: "10",
          required: true,
          GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHEQUE_NO",
          label: "ChequeNo",
          placeholder: "ChequeNo",
          type: "text",
          required: true,
          autoComplete: "off",
          GridProps: { xs: 6, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "ChequeDate",
          placeholder: "",
          format: "dd/MM/yyyy",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "ChequeAmount",
          placeholder: "",
          required: true,
          type: "text",
          FormatProps: {
            allowNegative: false,
          },
          GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
        },
      ],
    },
  ],
};
