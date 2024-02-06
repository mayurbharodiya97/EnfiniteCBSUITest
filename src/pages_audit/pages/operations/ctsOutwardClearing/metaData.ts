import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GeneralAPI } from "registry/fns/functions";
import {
  clearingBankMasterConfigDML,
  getAccountSlipJoinDetail,
  getSlipNoData,
} from "./api";
import { format, isValid } from "date-fns";
import { GridMetaDataType } from "components/dataTableStatic";
import { FilterFormMetaType } from "components/formcomponent";
export const CtsOutwardClearingMetadata = {
  form: {
    name: "CTS O/W Clearing",
    label: "CTS O/W Clearing",
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
      name: "TRAN_DT",
      // sequence: 9,
      label: "Presentment Date",
      placeholder: "",
      GridProps: { xs: 6, sm: 2.2, md: 2.1, lg: 2.1, xl: 1.5 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      placeholder: "Props Value",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
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
      GridProps: { xs: 6, sm: 1.1, md: 1.1, lg: 1.1, xl: 1.1 },
    },
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
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 1.5 },
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
      GridProps: { xs: 12, sm: 2.6, md: 2.6, lg: 2.6, xl: 1.5 },
      isFieldFocused: true,
      defaultfocus: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account Type is required."] }],
      },
    },

    {
      render: {
        componentType: "textField",
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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account no. is required."] }],
      },
      dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
      // validate: (currentField, value) => {
      //   if (currentField?.value) {
      //     return;
      //   }
      // },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value) {
          let Apireq = {
            COMP_CD: auth?.companyID,
            ACCT_CD: field?.value?.padStart(6, "0").padEnd(20, " "),
            ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
            BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
            GD_TODAY_DT: format(new Date(), "dd/MMM/yyyy"),
            SCREEN_REF: "ETRN/559" ?? "",
          };

          let postdata = await getAccountSlipJoinDetail(Apireq);
          formState.setDataOnFieldChange("ACCT_CD", postdata?.[0]);
          // console.log(postdata?.[0]?.RESTRICT_MESSAGE);
          // if (postdata?.[0]?.RESTRICT_MESSAGE) {
          // return {
          //   ACCT_CD: { value: "", isFieldFocused: true },
          //   ACCT_NAME: { value: "" },
          //   TRAN_BAL: { value: "" },
          // };
          // }
          if (postdata?.length && postdata) {
            return {
              ACCT_CD: {
                value: postdata?.[0]?.ACCT_NUMBER ?? "",
                ignoreUpdate: true,
              },
              ACCT_NAME: {
                value: postdata?.[0]?.ACCT_NAME ?? "",
              },
              TRAN_BAL: { value: postdata?.[0].TRAN_BAL ?? "" },
            };
            // }
          } else {
            return {
              ACCT_CD: { value: "", isFieldFocused: true },
              ACCT_NAME: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }
        }
      },

      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 1.5 },
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

      GridProps: { xs: 12, sm: 3.7, md: 3.7, lg: 3.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Shadow.Balance",
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
      label: "Slip Amount",
      placeholder: "",
      // validationRun: "all",
      type: "text",
      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState,
        auth,
        dependentFieldState
      ) => {
        if (currentFieldState?.value) {
          formState.setDataOnFieldChange(
            "AMOUNT",
            currentFieldState?.value ?? "0"
          );
        }
      },
      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 1.5 },
    },
    {
      render: {
        componentType: "hidden",
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
        componentType: "hidden",
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
export const ViewCtsOutwardClearingMetadata = {
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
      GridProps: { xs: 6, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ZONE",
      label: "Zone",
      // defaultValue: "0   ",
      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
      skipDefaultOption: true,
      disableCaching: true,
      // requestProps: "ZONE_TRAN_TYPE",
      // dependentFields: ["TRAN_DT"],
      // postValidationSetCrossFieldValues: "getSlipNoData",
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
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 1.5 },
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
      GridProps: { xs: 12, sm: 2.6, md: 2.6, lg: 2.6, xl: 1.5 },
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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account no. is required."] }],
      },
      dependentFields: ["ACCT_TYPE"],
      // // validate: (currentField, value) => {
      // //   if (currentField?.value) {
      // //     return;
      // //   }
      // // },
      // postValidationSetCrossFieldValues: async (
      //   field,
      //   formState,
      //   auth,
      //   dependentFieldsValues
      // ) => {
      //   let Apireq = {
      //     COMP_CD: auth?.companyID,
      //     ACCT_CD: field?.value?.padStart(6, "0").padEnd(20, " "),
      //     ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
      //     BRANCH_CD: auth?.user?.branchCode,
      //     GD_TODAY_DT: format(new Date(), "dd/MMM/yyyy"),
      //     SCREEN_REF: auth?.menulistdata[4]?.children?.[6]?.user_code,
      //   };

      //   let postdata = await getAccountSlipJoinDetail(Apireq);
      //   formState.setDataOnFieldChange("ACCT_CD", postdata?.[0]);
      //   if (postdata?.length) {
      //     return {
      //       ACCT_NAME: {
      //         value: postdata?.[0]?.ACCT_NAME ?? "",
      //       },
      //       TRAN_BAL: { value: postdata?.[0].TRAN_BAL ?? "" },
      //     };
      //     // }
      //   } else {
      //     return {
      //       ACCT_NAME: { value: "" },
      //       TRAN_BAL: { value: "" },
      //     };
      //   }
      // },
      // postValidationSetCrossFieldValues: "getAccountNumberData",

      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AC Name",
      type: "text",
      fullWidth: true,
      isReadOnly: true,

      GridProps: { xs: 12, sm: 3.7, md: 3.7, lg: 3.7, xl: 1.5 },
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
      label: "slip Amount",
      placeholder: "",
      // isFieldFocused: true,
      // autoComplete: false,
      type: "text",
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 1.5 },
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
        componentType: "textField",
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
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "VERIFIED_DATE",
      label: "Checker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      // defaultValue: new Date(),
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.5 },
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
    enablePagination: false,
    disableGlobalFilter: true,
    hideFooter: false,
    hideHeader: true,
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
      accessor: "J_TYPE_NM",
      columnName: "Joint Type",
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
      width: 300,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      accessor: "DESIGNATION_NM",
      columnName: "Designation",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 300,
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
    // {
    //   accessor: "REF_ACCT_TYPE",
    //   columnName: "Reference Account",
    //   sequence: 8,
    //   alignment: "center",
    //   componentType: "default",
    //   width: 120,
    //   minWidth: 100,
    //   maxWidth: 200,
    // },
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
      columnName: "Customer ID",
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
        componentType: "spacer",
      },

      GridProps: {
        xs: 0,
        md: 1,
        sm: 4.7,
        lg: 4.7,
        xl: 4.7,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SLIP_AMOUNT",
      label: "Total Slip Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",

      // isReadOnly: true,
      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "FINALAMOUNT",
      label: "Total Cheque Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      dependentFields: ["chequeDetails"],

      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState,
        auth,
        dependentFieldState
      ) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["chequeDetails"])
            ? dependentFieldState?.["chequeDetails"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.AMOUNT?.value), 0);
        formState.setDataOnFieldChange(
          "FINALAMOUNT",
          accumulatedTakeoverLoanAmount
        );
        if (
          Number(currentFieldState.value) ===
          Number(accumulatedTakeoverLoanAmount)
        ) {
          return {};
        }

        return {
          FINALAMOUNT: {
            value: accumulatedTakeoverLoanAmount ?? "0",
          },
        };
      },
      // shouldExclude(fieldData) {
      //   if (fieldData?.value) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
      // isReadOnly: true,
      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_AMOUNT",
      label: "Total Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      dependentFields: ["SLIP_AMOUNT", "FINALAMOUNT"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.SLIP_AMOUNT?.value) -
          Number(dependentFields?.FINALAMOUNT?.value);

        return value ?? "0";
      },
      // isReadOnly: true,
      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "ADDNEWROW",
      label: "Add Row",
      endsIcon: "AddCircleOutlineRounded",
      rotateIcon: "scale(2)",
      placeholder: "",
      type: "text",
      iconStyle: {
        fontSize: "25px !important",

        // GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      },
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      // isCustomStyle: true,
      displayCountName: "Cheque Detail",
      fixedRows: true,
      isScreenStyle: true,
      isRemoveButton: true,
      name: "chequeDetails",
      // removeRowFn: "",
      arrayFieldIDName: "CHEQUE",
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
          required: true,
          autoComplete: "off",
          isFieldFocused: true,
          defaultfocus: true,
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
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Cheque No. is required."] }],
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "BANK_CD",
          label: "Bank Code",
          placeholder: "Bank Code",
          type: "text",
          required: true,
          autoComplete: "off",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Bank Code is required."] }],
          },
          // disableCaching: true,
          // runValidationOnDependentFieldsChange: true,
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (field.value) {
              let formData = {
                COMP_CD: auth.companyID ?? "",
                BRANCH_CD: auth.user.branchCode ?? "",
                BANK_CD:
                  field.value && Number.isNaN(Number(field.value))
                    ? ""
                    : field.value.padEnd(10, " "),
              };

              let postData = await clearingBankMasterConfigDML(formData);

              if (postData?.length && postData) {
                formState.setDataOnFieldChange("MESSAGE", postData);

                return {
                  BANK_CD: { error: postData?.[0]?.ERROR_MSSAGE ?? "" },
                  BANK_NM: {
                    value: postData?.[0]?.BANK_NM ?? "",
                  },
                };
              } else {
                return {
                  BANK_CD: { value: "", isFieldFocused: true },
                  BANK_NM: { value: "" },
                };
              }
            } else if (!field?.value) {
              return {
                BANK_NM: { value: "" },
              };
            }
          },

          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
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
          isReadOnly: true,
          // maxLength: 100,
          showMaxLength: true,
          autoComplete: "off",
          dependentFields: ["BANK_CD"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            if (!dependentFieldsValues?.["chequeDetails.BANK_CD"]?.value) {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.8, xl: 2.5 },
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
              if (values?.value?.length > 6) {
                return false;
              }
              return true;
            },
          },
          placeholder: "",
          type: "text",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Payee A/C No. is required."] },
            ],
          },
          GridProps: { xs: 12, sm: 2, md: 1.9, lg: 1.9, xl: 1.5 },
        },

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
          required: true,
          maxLength: 6,

          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Cheque Date is required."] }],
          },
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
          required: true,
          // maxLength: 20,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Description is required."] }],
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQ_MICR_CD",
          label: "CHQ Micr",
          type: "text",
          fullWidth: true,
          defaultValue: "10",
          required: true,
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
            rules: [{ name: "required", params: ["CHQ Micr is required."] }],
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
          required: true,
          autoComplete: "off",
          // isReadOnly: true,\
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Pay Name is required."] }],
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Cheque Amount",
          placeholder: "",
          isFieldFocused: true,
          required: true,
          type: "text",
          validationRun: "onChange",
          validate: (currentField, value) => {
            if (currentField?.value) {
              return;
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Cheque Amount is required."] },
            ],
          },

          postValidationSetCrossFieldValues: async (...arr) => {
            return {
              FINALAMOUNT: { value: arr[0].value },
            };
          },
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
      isFieldFocused: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["RBI Code is required."] }],
      },
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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required."] }],
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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Bank Name is required."] }],
      },
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
      label: "From Date",
      placeholder: "",
      // defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
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
      // defaultValue: new Date(),
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
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      placeholder: "Props Value",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
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
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.5 },
      // maxLength: 50,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Slip No. is required."] }],
      // },
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
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Slip No. is required."] }],
      // },
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.5 },
      // maxLength: 50,
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "BANK_CD",
      label: "Bank Code",

      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Cheque Amount",
      // placeholder: "Submit Action",
      type: "text",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.5 },
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
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1, xl: 1 },
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
    allowRowSelection: false,
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
      columnName: "Cheque No.",
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
