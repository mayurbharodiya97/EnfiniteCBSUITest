import { GridMetaDataType } from "@acuteinfo/common-base";
import { isValid } from "date-fns";
export const RetrieveFormConfigMetaData = {
  form: {
    name: "RetrieveFormConfigMetaData",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    // allowColumnHiding: true,
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
      name: "FR_TRAN_DT",
      label: "GeneralFromDate",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FromDateRequired."] }],
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
      dependentFields: ["FR_TRAN_DT "],
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "FR_ZONE",
      label: "FromZone",
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
        componentType: "select",
      },
      name: "TO_ZONE",
      label: "ToZone",
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
        componentType: "autocomplete",
      },
      name: "FLAG",
      label: "",
      defaultValue: "N",
      options: [
        { label: "Normal", value: "N" },
        { label: "Branch Wise", value: "B" },
        { label: "Slip Wise", value: "S" },
      ],
      postValidationSetCrossFieldValues: (field, formState) => {
        if (field?.value) {
          formState.setDataOnFieldChange("FLAG", field?.value);
        }
      },

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
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
  ],
};

export const branchClearingDateTransferGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "BANK_CD",
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
    allowRowSelection: true,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
    // footerNote:"test"
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "BANK_NM",
      columnName: "BranchName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 300,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      accessor: "AMOUNT",
      columnName: "TotalAmount",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      isDisplayTotal: true,
      // isSelectedTotal: true,
      width: 180,
      minWidth: 200,
      maxWidth: 250,
    },
    // {
    //   accessor: "CHECKED",
    //   columnName: "Yes/No",
    //   sequence: 4,
    //   alignment: "left",
    //   componentType: "editableCheckbox",
    //   // isReadOnly: true,
    //   enableColumnSelection: true,
    //   width: 90,
    //   minWidth: 60,
    //   maxWidth: 120,
    // },
    // {
    //   accessor: "CHECK_BOX",
    //   columnName: "Select",
    //   sequence: 2,
    //   alignment: "left",
    //   dependentOptionField: "VISIBLE_YN",
    //   componentType: "editableCheckbox",
    //   enableColumnSelection: true,
    //   width: 100,
    //   minWidth: 80,
    //   maxWidth: 140,
    //   defaultValue: false,
    //   shouldExclude: (initialValue, original, prevRows, nextRows) => {
    //     if (!Boolean(original?.VISIBLE_YN === false)) {
    //       return false;
    //     }
    //     return true;
    //   },
    // },
    {
      accessor: "BANK_CD",
      columnName: "Bank",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CNT",
      columnName: "Count",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
  ],
};
export const clearingDateTransferGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "BANK_CD",
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
    {
      accessor: "id",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "BANK_NM",
      columnName: "BranchName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 300,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      accessor: "AMOUNT",
      columnName: "TotalAmount",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 180,
      minWidth: 200,
      maxWidth: 250,
      isDisplayTotal: true,
    },
    {
      accessor: "BANK_CD",
      columnName: "Bank",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CNT",
      columnName: "Count",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
  ],
};
export const slipClearingDateTransferGridMetaData: GridMetaDataType = {
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
    allowRowSelection: true,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
      isAutoSequence: true,
    },

    {
      accessor: "SLIP_CD",
      columnName: "SlipNo",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      accessor: "ACCT_NO",
      columnName: "AccountNo",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
    },

    {
      accessor: "NO_OF_CHEQUES",
      columnName: "NoOfCheques",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 150,
      minWidth: 200,
      maxWidth: 250,
      isDisplayTotal: true,
      // isSelectedTotal: true,
    },
    {
      accessor: "AMOUNT",
      columnName: "TotalAmount",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
      isDisplayTotal: true,
      // isSelectedTotal: true,
    },
    {
      accessor: "CNT",
      columnName: "Count",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    // {
    //   accessor: "CHECKED",
    //   columnName: "Yes/No",
    //   sequence: 6,
    //   alignment: "left",
    //   componentType: "editableCheckbox",
    //   // isReadOnly: true,
    //   width: 90,
    //   minWidth: 60,
    //   maxWidth: 120,
    // },
  ],
};
