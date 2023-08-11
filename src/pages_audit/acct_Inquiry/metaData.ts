import { GridMetaDataType } from "components/dataTableStatic";
import { getPassBookTemplate } from "./api";
import { components } from "components/report";

export const AccountInquiryMetadata = {
  form: {
    name: "merchantOnboarding",
    label: "Account Inquiry",
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
        componentType: "numberFormat",
      },
      name: "ACCOUNT",
      label: "Account No.",
      placeholder: "Account Number",
      defaultValue: "",
      type: "text",
      maxLength: 20,
      required: false,
      fullWidth: true,
      autoComplete: false,
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
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
      label: "Customer Id",
      maxLength: 12,
      schemaValidation: {
        type: "string",
      },
      placeholder: "Customer Id",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
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
      label: "Mobile No.",
      maxLength: 10,
      placeholder: "Mobile Number",
      type: "string",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
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
      label: "Pan No.",
      placeholder: "PanCard Number",
      maxLength: 10,
      type: "text",
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
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
        md: 1,
        sm: 1,
      },
    },
  ],
};
export const AccountInquiryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Search Criteria Data",
    rowIdColumn: "WITHDRAW_BAL",
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
      min: "42vh",
      max: "45vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "ACCT_NO",
      columnName: "Account No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_NM",
      columnName: "Account/Person Name",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 180,
      isReadOnly: true,
      maxWidth: 300,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "Customer Id",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "CONTACT2",
      columnName: "Mobile No.",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "PAN_NO",
      columnName: "Pan No.",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "WITHDRAW_BAL",
      columnName: "Withdraw Balance",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "E_MAIL_ID",
      columnName: "Email Id",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },

    {
      accessor: "OPENIND_DT",
      columnName: "Opening Date",
      sequence: 8,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      isReadOnly: true,
      width: 140,
      minWidth: 140,
      maxWidth: 140,
    },
    {
      accessor: "DISPLAY_STATUS",
      columnName: "Status",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      isReadOnly: true,
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      accessor: "CLOSE_DT",
      columnName: "Close Date",
      sequence: 10,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      isReadOnly: true,
      width: 140,
      minWidth: 140,
      maxWidth: 170,
    },
  ],
};
export const DependenciesData = {
  title: "Dependencies Other Accounts",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "False",
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
      columnName: "Account Number",
      accessor: "AC_CD",
      width: 170,
    },
    {
      columnName: "Account Person Name",
      accessor: "ACCT_NM",
      width: 370,
    },

    {
      columnName: " Account Status",
      accessor: "ACCT_STATUS",
      width: 150,
    },
    {
      columnName: "Opening Date",
      accessor: "OP_DATE",
      width: 180,
    },
    {
      columnName: "Status",
      accessor: "STATUS",
      width: 150,
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
    { render: { componentType: "_accountNumber" }, para: " " },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account/Person Name",
      placeholder: "Account/Person Name",
      type: "text",
      isReadOnly: true,
      fullWidth: true,

      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "STMT_FROM_DATE",
      label: "From Date :-",
      format: "dd/MM/yyyy",
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
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
      label: "To Date :-",
      placeholder: "",
      format: "dd/MM/yyyy",
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
      },
    },
    {
      render: {
        componentType: "currency",
      },
      label: "Amount",
      placeholder: "Enter Minimum Amount",
      required: true,
      GridProps: { xs: 12, sm: 6, md: 6 },
      FormatProps: {
        prefix: "$",
        thousandsGroupStyle: "thousand",
        // decimalScale: 3,
      },
    },
  ],
};
export const PassbookStatementInq = {
  form: {
    name: "passbookstatement",
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
      name: "ACCT_CD",
      label: "Account No.",
      placeholder: "Account Number",
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
      name: "ACCT_NM",
      label: "Account/Person Name",
      placeholder: "Account/Person Name",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 8,
        sm: 8,
      },
    },

    {
      render: {
        componentType: "radio",
      },
      name: "PD_DESTION",
      label: "hello",
      RadioGroupProps: { row: true },
      defaultValue: "P",
      options: [
        {
          label: "Passbook",
          value: "P",
        },
        { label: "Statement", value: "S" },
      ],
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field?.value === "S") {
          return { ACTAA_NO: { value: "0" } };
        }
        return {};
      },
      runPostValidationHookAlways: true,
      GridProps: {
        xs: 12,
        md: 11,
        sm: 11,
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
          label: "Front Page",
          value: "F",
        },
        { label: "First Page", value: "R" },
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
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TRAN_CD",
      label: "Template",
      defaultValue: "1",
      options: getPassBookTemplate,
      _optionsKey: "getTemplateList",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
      dependentFields: ["PD_DESTION"],
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
      label: "Line No.",
      defaultValue: "",
      type: "text",
      isReadOnly: false,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
      dependentFields: ["PD_DESTION"],
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
        componentType: "spacer",
      },
      GridProps: {
        xs: 12,
        md: 0.5,
        sm: 0.5,
      },
      dependentFields: ["PD_DESTION"],
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
        componentType: "formbutton",
      },
      name: "ACTAA_NO",
      label: "Reprint",
      endsIcon: "Print",
      rotateIcon: "scale(1.4)",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      GridProps: {
        xs: 12,
        md: 1.3,
        sm: 1.3,
      },
      dependentFields: ["PD_DESTION"],
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
        componentType: "datePicker",
      },
      name: "PASS_BOOK_DT",
      label: "From Date ddd:-",
      format: "dd/MM/yyyy",
      placeholder: "",
      type: "text",
      dependentFields: ["PD_DESTION", "ACTAA_NO"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PD_DESTION?.value === "P" &&
          (!Boolean(dependentFieldsValues?.ACTAA_NO?.value) ||
            dependentFieldsValues?.ACTAA_NO?.value === "0")
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
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_TO_DT",
      label: "To Date:-",
      placeholder: "",
      format: "dd/MM/yyyy",
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
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "STMT_FROM_DATE",
      label: "From Date :-",
      format: "dd/MM/yyyy",
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
        md: 6,
        sm: 6,
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
      label: "To Date :-",
      placeholder: "",
      format: "dd/MM/yyyy",
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
        md: 6,
        sm: 6,
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
    name: "passbookstatement",
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
      label: "Account No.",
      placeholder: "Account Number",
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
      label: "Account/Person Name",
      placeholder: "Account/Person Name",
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
