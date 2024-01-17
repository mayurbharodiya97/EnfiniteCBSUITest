import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GeneralAPI } from "registry/fns/functions";
import { clearingBankMasterConfigDML } from "./api";
import { format, isValid } from "date-fns";
import { GridMetaDataType } from "components/dataTableStatic";
import { FilterFormMetaType } from "components/formcomponent";
export const CtsOutwardClearingMetadata = {
  form: {
    name: "CTS O/W Clearing",
    label: "CTS O/W Clearing",
    resetFieldOnUnmount: false,
    validationRun: "all",
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
      name: "TRAN_DT",
      // sequence: 9,
      label: "Presentment Date",
      placeholder: "",
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      placeholder: "Props Value",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      disableCaching: true,
      requestProps: "ZONE_TRAN_TYPE",
      dependentFields: ["TRAN_DT"],
      postValidationSetCrossFieldValues: "getSlipNoData",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_CD",
      label: "Slip No.",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
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
      GridProps: { xs: 12, sm: 1.5, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "ENTERED_DATE",
      label: "Maker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      defaultValue: new Date(),
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "CLEARING_STATUS",
    //   label: "Entry Status",
    //   placeholder: "",
    //   type: "text",
    //   fullWidth: true,
    //   isReadOnly: true,

    //   // required: true,
    //   // maxLength: 20,
    //   // schemaValidation: {
    //   //   type: "string",
    //   //   rules: [{ name: "required", params: ["Slip No. is required."] }],
    //   // },
    //   GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    // },
  ],
};
export const SlipDetailFormMetaData: any = {
  form: {
    refID: 1667,
    name: "SlipDetailFormMetaData",
    label: "Slip Detail",
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
          spacing: 2,
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
      fixedRows: true,
      isDisplayCount: false,
      // isCustomStyle: true,
      name: "slipDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "ACCT_CD",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        // {
        //   render: {
        //     componentType: "textField",
        //   },
        //   name: "COMP_CD",
        //   label: "Company Code",
        //   placeholder: "Company Code",
        //   type: "text",
        //   required: true,
        //   defaultValue: "",
        //   // maxLength: 16,
        //   // options: GeneralAPI.getBranchCodeList,
        //   // _optionsKey: "getBranchCodeList",
        //   GridProps: { xs: 12, sm: 3, md: 2, lg: 2.5, xl: 1.5 },
        //   schemaValidation: {
        //     type: "string",
        //     rules: [
        //       { name: "required", params: ["Company Code is required."] },
        //     ],
        //   },
        // },
        // {
        //   render: {
        //     componentType: "_accountNumber",
        //   },
        //   // acctFieldPara: "1",
        //   // postValidationSetCrossFieldValues: "testingFn",
        //   name: "ACCT_CD",
        //   GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        // },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "BRANCH_CD",
          label: "Branch",
          placeholder: "Branch Code",
          type: "text",
          required: true,
          // maxLength: 16,
          options: GeneralAPI.getBranchCodeList,
          _optionsKey: "getBranchCodeList",
          GridProps: { xs: 12, sm: 3, md: 1.6, lg: 1.6, xl: 1.5 },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Branch Code is required."] }],
          },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "ACCT_TYPE",
          label: "AccountType",
          placeholder: "EnterAccountType",
          type: "text",
          required: true,
          options: GeneralAPI.getAccountTypeList,
          _optionsKey: "getAccountTypeList",
          GridProps: { xs: 12, sm: 2, md: 2.5, lg: 2, xl: 1.5 },
          isFieldFocused: true,
          defaultfocus: true,
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["Account Type is required."] }],
          // },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "ACCT_CD",
          label: "ACNo",
          placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          autoComplete: "off",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 6) {
                return false;
              }
              // if (values.floatValue === 0) {
              //   return false;
              // }
              return true;
            },
          },

          renderReset: false,
          // required: true,
          // maxLength: 6,

          dependentFields: ["ACCT_TYPE"],
          validate: (currentField, value) => {
            if (currentField?.value) {
              return;
            }
          },
          // postValidationSetCrossFieldValues: "getAccountNumberData",

          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NAME",
          label: "AC Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 3, md: 3, lg: 3.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TRAN_BAL",
          label: "Trn.Balance",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "",
          // isFieldFocused: true,
          // autoComplete: false,
          type: "text",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
      ],
    },
  ],
};

export const SlipJoinDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Joint Detail",
    rowIdColumn: "SR_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    disableGlobalFilter: true,
    hideFooter: false,
    hideHeader: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "28vh",
      max: "28vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_CD",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "rigth",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "J_TYPE",
      columnName: "Joint Name Information Type",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "REF_PERSON_NAME",
      columnName: "Person Name",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "DESIGNATION_NM",
      columnName: "Designation",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 400,
    },

    {
      accessor: "MEM_DISP_ACCT_TYPE",
      columnName: "Mem.Type - A/C No.",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
    {
      accessor: "REF_ACCT_TYPE",
      columnName: "Reference Account",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "MOBILE_NO",
      columnName: "Contact No.",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "Customer Id",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};

export const ChequeDetailFormMetaData: any = {
  form: {
    refID: 1667,
    name: "ChequeDetailFormMetaData",
    label: "Cheque Detail",
    resetFieldOnUmnount: false,
    validationRun: "all",
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
          spacing: 2,
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
      fixedRows: true,
      isScreenStyle: true,
      isRemoveButton: true,
      name: "chequeDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHEQUE_NO",
          label: "Cheque No.",
          placeholder: "Cheque No.",
          type: "text",
          isFieldFocused: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 6) {
                return false;
              }
              // if (values.floatValue === 0) {
              //   return false;
              // }
              return true;
            },
          },
          GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
          // schemaValidation: 1.5
          //   type: "string",
          //   rules: [
          //     { name: "required", params: ["Company Code is required."] },
          //   ],
          // },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "BANK_CD",
          label: "Bank Code",
          placeholder: "Bank Code",
          type: "text",
          // dependentFields: ["BANK_NM"],
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 10) {
                return false;
              }
              return true;
            },
          },
          runExternalFunction: true,
          disableCaching: true,
          runValidationOnDependentFieldsChange: true,
          postValidationSetCrossFieldValues: async (
            field,
            __,
            auth,
            dependentFieldsValues
          ) => {
            let formData = {
              COMP_CD: auth.companyID ?? "",
              BRANCH_CD: auth.user.branchCode ?? "",
              BANK_CD:
                field.value && Number.isNaN(Number(field.value))
                  ? ""
                  : field.value.padEnd(10, " "),
              BANK_NM:
                field.value && Number.isNaN(Number(field.value))
                  ? field.value
                  : "",
            };

            if (field.value & field.value.length) {
              let postdata = await clearingBankMasterConfigDML(formData);
              return {
                BANK_CD: { value: postdata?.[0]?.BANK_CD, ignoreUpdate: true },
                BANK_NM: { value: postdata?.[0].BANK_NM, ignoreUpdate: true },
              };
            }

            return {
              BANK_CD: { value: "" },
              BANK_NM: { value: "" },
            };
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["Branch Code is required."] }],
          // },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "Bank Name",
          placeholder: "",
          type: "text",
          required: true,
          maxLength: 100,
          showMaxLength: true,
          GridProps: { xs: 12, sm: 3, md: 2.8, lg: 2.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "BANK_NAME",
          label: "...",
          placeholder: "",
          type: "text",
          dependentFields: ["BANK_CD"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            if (dependentFieldsValues?.["chequeDetails.BANK_CD"]?.error) {
              return false;
            }
            return true;
          },
          GridProps: { sm: 1, md: 1.2, lg: 1.2, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "ECS_SEQ_NO",
          label: "Payee A/C No.",
          runExternalFunction: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 17) {
                return false;
              }
              return true;
            },
          },
          placeholder: "",
          type: "text",
          required: true,

          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
        },
        // {
        //   render: {
        //     componentType: "datePicker",
        //   },
        //   name: "CHEQUE_DATE",
        //   // sequence: 9,
        //   label: "Cheque Date",
        //   placeholder: "",
        //   GridProps: { xs: 12, sm: 3, md: 3, lg: 2.2, xl: 1.5 },
        // },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "Cheque Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          defaultValue: new Date(),
          type: "text",
          fullWidth: true,
          maxDate: new Date(),
          // required: true,
          maxLength: 6,
          defaultfocus: true,
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["ACNo is required."] }],
          // },
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH",
          label: "Description",
          // placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          // required: true,
          // maxLength: 20,
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["Branch Code is required."] }],
          // },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQ_MICR_CD",
          label: "CHQ Micr",
          placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          defaultValue: "10",
          // required: true,
          // maxLength: 6,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 2) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["ACCT_TYPE"],
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ACNo is required."] }],
          },
          GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ECS_USER_NO",
          label: "Pay Name",
          placeholder: "",
          type: "text",
          autoComplete: "off",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "",
          isFieldFocused: true,
          type: "text",
          // isReadOnly: true,
          GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
        },
      ],
    },
  ],
};
export const ClearingBankMasterFormMetadata = {
  form: {
    name: "ClearingBankMasterForm",
    label: "Clearing Bank Master",
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
      name: "RBI_CD",
      label: "RBI Code",
      placeholder: "",
      type: "text",
      maxLength: 20,
      required: true,
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_CD",
      label: "Code",
      placeholder: "",
      type: "text",
      maxLength: 20,
      required: true,
      dependentFields: ["RBI_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields?.RBI_CD?.value ?? "";
      },
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
      label: "Bank Name",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: true,
      GridProps: { xs: 12, sm: 3, md: 4, lg: 4, xl: 1.5 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "EXCLUDE",
      label: "Exclude",
      // defaultValue: true,
      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "CTS",
      label: "CTS",
      defaultValue: true,
      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1 },
    },
  ],
};

export const RetrieveFormConfigMetaData = {
  form: {
    name: "RetrieveFormConfigMetaData",
    label: "Retrieve CTS O/W Clearing Data",
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
          spacing: 2,
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
      label: "From Date",
      placeholder: "",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 1.8, md: 1.7, lg: 1.7, xl: 1.5 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["From Date is required."] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Must be a valid date";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TO_TRAN_DT",
      label: "To Date",
      placeholder: "",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["To Date is required."] }],
      },
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Must be a valid date";
        }
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.FROM_TRAN_DT?.value)
        ) {
          return "To Date should be greater than or equal to From Date.";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["FROM_TRAN_DT"],
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 1.8, md: 1.6, lg: 1.6, xl: 1.5 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      placeholder: "Props Value",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 2, md: 1.7, lg: 1.7, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
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
      label: "Slip No.",
      // placeholder: "Form name",
      // type: "text",
      GridProps: { xs: 12, sm: 1.9, md: 1.9, lg: 1.9, xl: 1.5 },
      // maxLength: 50,
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      // placeholder: "Form label",
      // type: "text",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 17) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 1.9, md: 1.9, lg: 1.9, xl: 1.5 },
      // maxLength: 50,
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Cheque Amount",
      // placeholder: "Submit Action",
      type: "text",
      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
      // maxLength: 10,
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
      // GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
    },
  ],
};

export const RetrieveGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Banner Configuration",
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
      min: "48vh",
      max: "48vh",
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
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "rigth",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "SLIP_CD",
      columnName: "Slip No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Cheuqe No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "TRAN_DT",
      columnName: "CLG Date",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "AMOUNT",
      columnName: "Cheque Amount",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "CONFIRMED",
      columnName: "Confirm",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "THROUGH_CHANNEL",
      columnName: "Entry From",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 7,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Modified By",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Modified Date",
      sequence: 9,
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
