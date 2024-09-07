import { GridMetaDataType } from "@acuteinfo/common-base";
import { getPassBookTemplate } from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { utilFunction } from "components/utils";
import * as API from "./api";
import { format } from "date-fns";
import { t } from "i18next";

export const AccountInquiryMetadata = {
  form: {
    name: "merchantOnboarding",
    label: "AccountInquiry",
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
        componentType: "textField",
      },
      name: "ACCOUNT",
      label: "AccountNo",
      placeholder: "AccountNo",
      defaultValue: "",
      type: "text",
      maxLength: 20,
      required: false,
      fullWidth: true,
      autoComplete: false,
      // startsIcon: Account_Number_Svg,
      startsIcon: "AccountCircleSharp",
      iconStyle: {
        color: "var(--theme-color3)",
        height: 20,
        width: 20,
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER",
      label: "CustomerId",
      maxLength: 12,
      schemaValidation: {
        type: "string",
      },
      placeholder: "CustomerId",
      type: "text",
      startsIcon: "PortraitSharp",
      iconStyle: {
        height: 20,
        color: "var(--theme-color3)",
        width: 20,
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "MOBILE",
      label: "MobileNo",
      maxLength: 10,
      placeholder: "MobileNo",
      type: "string",
      // startsIcon: Mobile_Number_Svg,
      startsIcon: "PhoneAndroidSharp",
      iconStyle: {
        color: "var(--theme-color3)",
        height: 20,
        width: 20,
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length <= 0) {
          return "";
        } else if (columnValue.value.length >= 11) {
          return "The length of your Mobile Number is greater than 10 character";
        } else if (columnValue.value.length <= 9) {
          return "The length of your Mobile Number is less than 10 character";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "panCardOptional",
      },
      name: "PAN",
      label: "PAN_NO",
      placeholder: "PAN_NO",
      maxLength: 10,
      type: "text",
      schemaValidation: {
        type: "string",
      },
      startsIcon: "PaymentRounded",
      iconStyle: {
        height: 25,
        color: "var(--theme-color3)",
        width: 25,
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
      validate: (columnValue, allField, flag) => {
        let regex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;

        if (columnValue.value.length <= 0) {
          return "";
        } else if (/[a-z]/.test(columnValue.value)) {
          return "Please enter uppercase letters only";
        } else if (!regex.test(columnValue.value)) {
          return "Please Enter Valid Format";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "NAME",
      label: "Account_Name",
      placeholder: "Account_Name",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "PID_DESCRIPTION",
      label: "Retrieve",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 3,
        md: 1,
        lg: 1,
        xl: 1,
      },
    },
    // {
    //   render: {
    //     componentType: "accountCode",
    //   },
    //   // acctTypeCustomAPI: GeneralAPI.getBranchCodeList,
    //   // branchCodeCustomAPI: GeneralAPI.getAccountTypeList,
    //   // branchCode_optionsKey: "getAccountTypeList",
    //   // acctType_optionsKey: "getBranchCodeList",
    //   // options: getBranchCodeList,
    //   // _optionsKey: "justForTestings",
    //   // name: "TEST",
    //   // label: "test",
    // },
    // {
    //   render: {
    //     componentType: "accountType",
    //   },
    //   // acctTypeCustomAPI: GeneralAPI.getBranchCodeList,
    //   // branchCodeCustomAPI: GeneralAPI.getAccountTypeList,
    //   // branchCode_optionsKey: "getAccountTypeList",
    //   // acctType_optionsKey: "getBranchCodeList",
    //   // options: getBranchCodeList,
    //   // _optionsKey: "justForTestings",
    //   // name: "TEST",
    //   // label: "test",
    // },
    // {
    //   render: {
    //     componentType: "branchCode",
    //   },
    //   // acctTypeCustomAPI: GeneralAPI.getBranchCodeList,
    //   // branchCodeCustomAPI: GeneralAPI.getAccountTypeList,
    //   // branchCode_optionsKey: "getAccountTypeList",
    //   // acctType_optionsKey: "getBranchCodeList",
    //   // options: getBranchCodeList,
    //   // _optionsKey: "justForTestings",
    //   // name: "TEST",
    //   // label: "test",
    // },
  ],
};
export const AccountInquiryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "SearchCriteriaData",
    rowIdColumn: "ACCT_NO",
    searchPlaceholder: "Accounts",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "38vh",
      max: "38vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    isCusrsorFocused: true,
  },
  // filters: [],
  columns: [
    {
      columnName: "AcctHolderType",
      accessor: "ACCT_STATUS",
      sequence: 1,
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 160,
      alignment: "left",
    },
    {
      accessor: "ACCT_NO",
      columnName: "AccountNo",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_NM",
      columnName: "Account_Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 180,
      isReadOnly: true,
      maxWidth: 300,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CustomerId",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "CONTACT2",
      columnName: "MobileNo",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "PAN_NO",
      columnName: "PAN_NO",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "WITHDRAW_BAL",
      columnName: "WithdrawBalance",
      sequence: 7,
      color: "red",
      alignment: "left",
      componentType: "currency",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "E_MAIL_ID",
      columnName: "EmailID",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },

    {
      accessor: "OP_DATE",
      columnName: "OpeningDate",
      sequence: 9,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      isReadOnly: true,
      width: 140,
      minWidth: 140,
      maxWidth: 140,
    },
    {
      accessor: "DISPLAY_STATUS",
      columnName: "STATUS",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      isReadOnly: true,
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      accessor: "CLOSE_DT",
      columnName: "CloseDate",
      sequence: 11,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      isReadOnly: true,
      width: 140,
      minWidth: 140,
      maxWidth: 170,
    },
  ],
};
export const DependenciesData = {
  title: "Dependencies Other Accounts",
  disableGroupBy: true,
  hideFooter: false,
  hideAmountIn: true,
  retrievalType: "DATE",
  // filters: [
  //   {
  //     accessor: "FROM_DT",
  //     columnName: "From Date",
  //     filterComponentType: "valueDateFilter",
  //     gridProps: {
  //       xs: 12,
  //       md: 12,
  //       sm: 12,
  //     },
  //   },
  //   {
  //     accessor: "TO_DT",
  //     columnName: "To Date",
  //     filterComponentType: "valueDateFilter",
  //     gridProps: {
  //       xs: 12,
  //       md: 12,
  //       sm: 12,
  //     },
  //   },
  // ],
  columns: [
    {
      columnName: "Assets_Liabilities",
      accessor: "ASS_LIB",
      width: 170,
    },
    {
      columnName: "Account_Status",
      accessor: "ACCT_STATUS",
      width: 150,
    },
    {
      columnName: "CustomerID",
      accessor: "CUSTOMER_ID",
      width: 130,
    },
    {
      columnName: "AccountNo",
      accessor: "AC_CD",
      width: 170,
    },
    {
      columnName: "Account_Name",
      accessor: "ACCT_NM",
      width: 380,
    },
    {
      columnName: "OpeningDate",
      accessor: "OP_DATE",
      width: 180,
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 105,
    },
  ],
};
export const PassbookStatement: any = {
  form: {
    name: "passbookstatement",
    label: "Retrieve Account Statement",
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
        componentType: "_accountNumber",
      },
      // acctFieldPara: "1",
      // postValidationSetCrossFieldValues: "testingFn",
      name: "ACCT_CD",
    },
    // {
    //   render: {
    //     componentType: "reportAccountType",
    //   },
    //   // acctFieldPara: "1",
    //   // postValidationSetCrossFieldValues: "testingFn",
    //   name: "ACCT_CD",
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountHolder",
      placeholder: "AccountHolder",
      type: "text",
      isReadOnly: true,
      fullWidth: true,

      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "STMT_FROM_DATE",
      label: "From Date :-",
      // format: "dd/MM/yyyy hh",
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
        lg: 6,
        xl: 6,
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["From Date is required."] },
          { name: "typeError", params: ["Must be a valid date"] },
        ],
      },
      validate: (value, data, others) => {
        if (!Boolean(value)) {
          return "Must be a valid date.";
        }
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "WK_STMT_TO_DATE",
      label: "ToDate",
      placeholder: "",
      // format: "dd/MM/yyyy",
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: [" To date is required."] },
          { name: "typeError", params: ["Must be a valid date"] },
        ],
      },
      dependentFields: ["STMT_FROM_DATE"],
      runValidationOnDependentFieldsChange: true,
      // },
      // validate: (value, data, others) => {
      //   if (!Boolean(value)) {
      //     return "This field is required.";
      //   }
      //   let toDate = new Date(value?.value);
      //   let fromDate = new Date(data?.STMT_FROM_DATE?.value);
      //   if (!greaterThanInclusiveDate(toDate, fromDate)) {
      //     return `To Date should be greater than or equal to From Date.`;
      //   }
      //   return "";
      // },
      validate: {
        conditions: {
          all: [
            {
              fact: "dependentFields",
              path: "$.STMT_FROM_DATE.value",
              operator: "lessThanInclusiveDate",
              value: { fact: "currentField", path: "$.value" },
            },
          ],
        },
        success: "",
        failure: "To Date should be greater than or equal to From Date.",
      },
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
        lg: 6,
        xl: 6,
      },
    },
    // {
    //   render: {
    //     componentType: "currency",
    //   },
    //   label: "Amount",
    //   placeholder: "Enter Minimum Amount",
    //   required: true,
    //   GridProps: { xs: 12, sm: 6, md: 6 },
    //   // isCurrencyCode: true,
    //   // FormatProps: {
    //   //   thousandsGroupStyle: "lakh",
    //   //   decimalScale: 1,
    //   // },
    //   enableNumWords: false,
    //   // StartAdornment: "BDT",
    // },

    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   // options: getBranchCodeList,
    //   // _optionsKey: "justForTestings",
    //   // name: "TEST",
    //   // label: "test",
    // },
  ],
};
export const AccountInquiry = {
  form: {
    name: "AccountInquiry",
    label: "Passbook/Statement Print Option",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    // submitAction: "home",
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
        componentType: "numberFormat",
      },
      name: "ACCT_NO",
      label: "AccountNo",
      placeholder: "AccountNo",
      defaultValue: "",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountHolder",
      placeholder: "AccountHolder",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "radio",
      },
      name: "PD_DESTION",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "S",
      options: [
        { label: "Statement ", value: "S" },
        {
          label: "Passbook",
          value: "P",
        },
      ],

      GridProps: {
        xs: 12,
        md: 11,
        sm: 11,
        lg: 11,
        xl: 11,
      },
    },
    {
      render: {
        componentType: "radio",
      },
      name: "PID_DESCRIPION",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "D",
      options: [
        {
          label: "FrontPage",
          value: "F",
        },
        { label: "FirstPage", value: "A" },
        { label: "Detail", value: "D" },
      ],
      dependentFields: ["PD_DESTION"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PD_DESTION?.value === "P") {
          return false;
        } else {
          return true;
        }
      },

      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TRAN_CD",
      label: "Template",
      defaultValue: "1",
      dependentFields: ["PD_DESTION", "PID_DESCRIPION"],
      fullWidth: true,
      disableCaching: true,
      options: async (dependentValue, formState, _, authState) => {
        if (
          dependentValue?.PID_DESCRIPION?.value &&
          dependentValue?.PD_DESTION?.value === "P"
        ) {
          // handleButonDisable use for disable "Ok" button while getPassBookTemplate api call
          formState.handleButonDisable(true);
          try {
            const data = await getPassBookTemplate({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              ACCT_TYPE: formState?.rowsData?.ACCT_TYPE,
              FLAG: "PAS" + dependentValue?.PID_DESCRIPION?.value,
            });
            return data;
          } catch (err) {
            console.log("err", err);
            return [];
          } finally {
            formState.handleButonDisable(false);
          }
        } else {
          return [];
        }
      },
      _optionsKey: "getTemplateList",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PD_DESTION?.value === "P") {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "PASS_BOOK_LINE",
      label: "LineNo",
      type: "text",
      fullWidth: true,
      autoComplete: false,
      GridProps: {
        xs: 6,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["PD_DESTION", "PID_DESCRIPION", "TRAN_CD", "REPRINT"],
      runValidationOnDependentFieldsChange: true,
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PD_DESTION?.value === "P" &&
          (!Boolean(dependentFieldsValues?.REPRINT?.value) ||
            dependentFieldsValues?.REPRINT?.value === "")
        ) {
          return true;
        } else {
          return false;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (formState?.isSubmitting) return {};

        if (field?.value === "0" || field?.value === "") {
          return {
            PASS_BOOK_LINE: {
              value: dependentValue?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE
                ? Number(dependentValue?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE)
                : "",

              ignoreUpdate: true,
            },
          };
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PD_DESTION?.value === "P" &&
          dependentFieldsValues?.PID_DESCRIPION?.value === "D"
        ) {
          return false;
        } else {
          return true;
        }
      },
      validate: (columnValue, dependentFields) => {
        if (
          dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE &&
          Boolean(columnValue?.value)
        ) {
          if (
            Number(columnValue?.value) >=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE) &&
            Number(columnValue?.value) <=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE)
          ) {
            return "";
          } else {
            return `${t(`LineNoValidation`, {
              from: dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE,
              to: dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE,
            })}`;
          }
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "REPRINT_VALUE",
      dependentFields: ["REPRINT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value = Number(dependentFieldsValues?.REPRINT?.value);
        return value === 1 ? "Y" : "N";

      },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "REPRINT",
      label: "Reprint",
      endsIcon: "Print",
      rotateIcon: "scale(1.4)",
      type: "text",
      // isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      dependentFields: ["PD_DESTION", "PID_DESCRIPION"],
      GridProps: {
        xs: 6,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 3,
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PID_DESCRIPION?.value !== "D" ||
          (dependentFieldsValues?.PD_DESTION?.value === "P" &&
            fieldData?.value !== "")
        ) {
          return true;
        } else if (dependentFieldsValues?.PD_DESTION?.value === "S") {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "LINE_NO_SPACER",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
      dependentFields: ["PD_DESTION", "PID_DESCRIPION"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PD_DESTION?.value === "P" &&
          dependentFieldsValues?.PID_DESCRIPION?.value !== "D"
        ) {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "OP_DATE",
      format: "dd/MM/yyyy",
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_DT",
      label: "FromDate",
      format: "dd/MM/yyyy",
      placeholder: "",
      type: "text",
      maxDate: new Date(),
      dependentFields: ["PD_DESTION", "REPRINT", "PID_DESCRIPION", "OP_DATE"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PD_DESTION?.value === "P" &&
          (!Boolean(dependentFieldsValues?.REPRINT?.value) ||
            dependentFieldsValues?.REPRINT?.value === "")
        ) {
          return true;
        } else if (
          dependentFieldsValues?.PD_DESTION?.value === "P" &&
          dependentFieldsValues?.PID_DESCRIPION?.value !== "D"
        ) {
          return true;
        } else {
          return false;
        }
      },

      onFocus: (date) => {
        date.target.select();
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PD_DESTION?.value === "P") {
          return false;
        } else {
          return true;
        }
      },

      validate: (columnValue, dependentFields) => {
        if (
          new Date(columnValue?.value) <
          new Date(dependentFields?.OP_DATE?.value)
        ) {
          return `${t(`DateValidation`, {
            date: format(
              new Date(dependentFields?.OP_DATE?.value),
              "dd/MM/yyyy"
            ),
          })}`;
        } else {
          return "";
        }
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_TO_DT",
      label: "ToDate",
      placeholder: "",
      // format: "dd/MM/yyyy",
      dependentFields: ["PD_DESTION"],
      isReadOnly: true,
      onFocus: (date) => {
        date.target.select();
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PD_DESTION?.value === "P") {
          return false;
        } else {
          return true;
        }
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "STMT_FROM_DATE",
      label: "FromDate",
      // format: "dd/MM/yyyy",
      placeholder: "",
      type: "text",
      dependentFields: ["PD_DESTION"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PD_DESTION?.value === "S") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
      defaultValue: new Date(),
      // onFocus: (date) => {
      //   date.target.select();
      // },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["From Date is required."] }],
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "WK_STMT_TO_DATE",
      label: "ToDate",
      placeholder: "",
      // format: "dd/MM/yyyy",
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["PD_DESTION", "STMT_FROM_DATE"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PD_DESTION?.value === "S") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
      defaultValue: new Date(),
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Effective To is required."] }],
      },
      runValidationOnDependentFieldsChange: true,
      validate: {
        conditions: {
          all: [
            {
              fact: "dependentFields",
              path: "$.STMT_FROM_DATE.value",
              operator: "lessThanInclusiveDate",
              value: { fact: "currentField", path: "$.value" },
            },
          ],
        },
        success: "",
        failure: "To Date should be greater than or equal to From Date.",
      },
    },
  ],
};
export const ViewDetailMetadata = {
  form: {
    name: "ViewDetailMetadata",
    label: "Account Detail",
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
        componentType: "textField",
      },
      name: "ACCT_NO",
      label: "AccountNo",
      placeholder: "AccountNo",
      defaultValue: "",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      isReadOnly: true,
      name: "ACCT_NM",
      label: "AccountHolder",
      placeholder: "AccountHolder",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CUSTOMER_ID",
      label: "Customer Id",
      placeholder: "Customer Id",
      isReadOnly: true,
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT2",
      label: "Mobile No.",
      placeholder: "Mobile Number",
      isReadOnly: true,
      type: "text",
      isrequired: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_NO",
      label: "Pan No.",
      isReadOnly: true,
      placeholder: "Pan Number",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DISPLAY_STATUS",
      isReadOnly: true,
      label: "Status",
      placeholder: "Status",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OP_DATE",
      label: "Opening Date",
      isReadOnly: true,
      placeholder: "Opening Date",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CLOSE_DT",
      label: "Close Date",
      placeholder: "Close Date",
      isReadOnly: true,
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
  ],
};
export const PassbookPrintingInq = {
  form: {
    name: "PassbookStatementInq",
    label: "Passbook Printing Parameters",
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
        componentType: "autocomplete",
      },
      name: "BRANCH_CD",
      label: "BranchCode",
      defaultValue: "099 ",
      placeholder: "BranchCodePlaceHolder",
      options: "getBranchCodeList",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["BranchCodeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ACCT_TYPE",
      label: "AccountType",
      placeholder: "AccountTypePlaceHolder",
      dependentFields: ["BRANCH_CD"],
      disableCaching: true,
      options: (dependentValue, formState, _, authState) => {
        return GeneralAPI.get_Account_Type({
          COMP_CD: authState?.companyID,
          BRANCH_CD: dependentValue?.BRANCH_CD?.value,
          USER_NAME: authState?.user?.id,
          DOC_CD: "RPT/430",
        });
      },
      _optionsKey: "get_Account_Type",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "select",
      },
      name: "TRAN_CD",
      label: "Template",
      defaultValue: "1",
      dependentFields: ["PID_DESCRIPION", "ACCT_TYPE", "BRANCH_CD"],
      fullWidth: true,
      disableCaching: true,
      options: async (dependentValue, formState, _, authState) => {
        if (dependentValue?.ACCT_TYPE?.value !== "") {
          // handleButonDisable use for disable "Ok" button while getPassBookTemplate api call
          formState.handleButonDisable(true);
          try {
            const data = await getPassBookTemplate({
              COMP_CD: authState?.companyID,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              FLAG: "PAS" + dependentValue?.PID_DESCRIPION?.value,
            });

            return data;
          } catch (err) {
            console.log("err", err);
            return [];
          } finally {
            formState.handleButonDisable(false);
          }
        } else {
          return [];
        }
      },
      _optionsKey: "getPassBookTemplate",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["TemplateReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "AccountNumber",
      placeholder: "AccountNumberPlaceHolder",
      dependentFields: ["ACCT_TYPE", "BRANCH_CD", "TRAN_CD"],
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountNumberReqired"] }],
      },

      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (
          currentField?.value &&
          dependentFieldsValues?.BRANCH_CD?.value &&
          dependentFieldsValues?.ACCT_TYPE?.value
        ) {
          const reqParameters = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value,
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value,
              dependentFieldsValues?.ACCT_TYPE?.optionData
            ),
            TRAN_CD: dependentFieldsValues?.TRAN_CD?.optionData?.[0]?.value,
            DEFAULT_LINE:
              dependentFieldsValues?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE,
            SKIP_LINE:
              dependentFieldsValues?.TRAN_CD?.optionData?.[0]?.SKIP_LINE,
            SCREEN_REF: "RPT/430",
          };
          formState.handleButonDisable(true);

          const postData = await API.passbookAccountDetails(reqParameters);

          formState.handleButonDisable(false);

          let btn99, returnVal;

          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          console.log(postData);

          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.O_STATUS === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Validation Failed",
                message: postData[i]?.O_MESSAGE,
              });
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Confirmation",
                message: postData[i]?.O_MESSAGE,
                buttonNames: ["Yes", "No"],
              });
              btn99 = btnName;
              if (btnName === "No") {
                returnVal = "";
              }
            } else if (postData[i]?.O_STATUS === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Alert",
                  message: postData[i]?.O_MESSAGE,
                });
              }
            } else if (postData[i]?.O_STATUS === "0") {
              if (btn99 !== "No") {
                returnVal = postData[i];
              } else {
                returnVal = "";
              }
            }
          }
          btn99 = 0;
          formState.setDataOnFieldChange("accountDetails", {
            PASS_BOOK_DT: returnVal?.FROM_DT ?? "",
          });
          return {
            ACCT_CD: {
              value:
                returnVal !== ""
                  ? utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldsValues?.ACCT_TYPE?.optionData
                    )
                  : "",
              isFieldFocused: false,
              ignoreUpdate: true,
            },
            ACCT_NM: {
              value: returnVal?.ACCT_NM ?? "",
              ignoreUpdate: true,
            },
            PASS_BOOK_LINE: {
              value: returnVal?.LINE_ID ?? "",
              ignoreUpdate: true,
            },
            PASS_BOOK_DT: {
              value: returnVal?.FROM_DT ?? "",
              ignoreUpdate: true,
            },

            OP_DATEEEE: {
              value: returnVal?.OP_DATE ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {
            ACCT_NM: {
              value: "",
            },
            PASS_BOOK_LINE: {
              value: "",
            },
            PASS_BOOK_DT: {
              value: "",
            },
            PASS_BOOK_TO_DT: {
              value: "",
            },
          };
        }
        return {};
      },
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "ENT_BRANCH_CD",
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountHolder",
      placeholder: "AccountHolder",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "radio",
      },
      name: "PID_DESCRIPION",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "D",
      options: [
        {
          label: "FrontPage",
          value: "F",
        },
        { label: "FirstPage", value: "A" },
        { label: "Detail", value: "D" },
      ],

      GridProps: {
        xs: 12,
        md: 7,
        sm: 7,
        lg: 7,
        xl: 7,
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "PASS_BOOK_LINE",
      label: "LineNo",
      type: "text",
      fullWidth: true,
      disableCaching: true,
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      dependentFields: ["PID_DESCRIPION", "TRAN_CD", "REPRINT"],
      runValidationOnDependentFieldsChange: true,
      runPostValidationHookAlways: true,
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value === ""
        ) {
          return true;
        } else {
          return false;
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return true;
        } else {
          return false;
        }
      },

      validate: (columnValue, dependentFields) => {
        if (
          dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE &&
          Boolean(columnValue?.value)
        ) {
          if (
            Number(columnValue?.value) >=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE) &&
            Number(columnValue?.value) <=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE)
          ) {
            return "";
          } else {
            return `${t(`LineNoValidation`, {
              from: dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE,
              to: dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE,
            })}`;
          }
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "LINE_NO_SPACER",
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      dependentFields: ["PID_DESCRIPION"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "REPRINT_VALUE",
      dependentFields: ["REPRINT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value = Number(dependentFieldsValues?.REPRINT?.value);
        return value === 1 ? "Y" : "N";
      },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "REPRINT",
      label: "Reprint",
      endsIcon: "Print",
      rotateIcon: "scale(1.4)",
      type: "text",
      // isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },

      dependentFields: ["PID_DESCRIPION"],
      runValidationOnDependentFieldsChange: true,
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          dependentValue?.PID_DESCRIPION?.value === "D" &&
          field?.value === "0"
        ) {
          return {
            REPRINT: {
              value: "",
            },
          };
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PID_DESCRIPION?.value !== "D" ||
          fieldData?.value !== ""
        ) {
          return true;
        } else {
          return false;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "OP_DATEEEE",
      // format: "dd/MM/yyyy",
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_DT",
      label: "FromDate",
      // format: "dd/MM/yyyy",
      placeholder: "",
      type: "text",
      maxDate: new Date(),
      dependentFields: ["REPRINT", "PID_DESCRIPION", "OP_DATEEEE"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value === ""
        ) {
          return true;
        } else if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return true;
        } else {
          return false;
        }
      },

      onFocus: (date) => {
        date.target.select();
      },
      // validationRun: "all",

      validate: (columnValue, dependentFields) => {
        if (
          new Date(columnValue?.value) <
          new Date(dependentFields?.OP_DATEEEE?.value)
        ) {
          return `${t(`DateValidation`, {
            date: format(
              new Date(dependentFields?.OP_DATEEEE?.value),
              "dd-MM-yyyy"
            ),
          })}`;
        } else {
          return "";
        }
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_TO_DT",
      label: "ToDate",
      placeholder: "",
      defaultValue: new Date(),
      format: "dd/MM/yyyy",
      isReadOnly: true,
      onFocus: (date) => {
        date.target.select();
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
  ],
};
