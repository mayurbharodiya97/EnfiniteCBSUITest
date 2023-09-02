import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { getCIFCategories } from "./api";

export const customer_data_meta_data = {
  form: {
    name: "customer_data_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 3,
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
        componentType: "typography",
      },
      name: "Customer_Details",
      label: "Customer Details",
      GridProps: { xs: 4, sm: 3, md: 2 },
    },
    // {
    //     render: {
    //         componentType: "select",
    //     },
    //     name: "CUST_TYPE",
    //     label: "Cust Type",
    //     placeholder: "",
    //     type: "text",
    //     GridProps: {xs: 4, sm: 3, md: 2},
    //     options: [
    //         {label: "Individual", value: "individual"},
    //         {label: "Legal", value: "legal"},
    //     ],
    //     postValidationSetCrossFieldValues: "getCustType",
    //     // dependentFields: ["DAILY_AMT"],
    //     // runValidationOnDependentFieldsChange: true,
    //     // validate: (currentField, dependentFields) => {
    //     //     if(Number(dependentFields?.DAILY_AMT?.value) >
    //     //     Number(currentField?.value)) {
    //     //         return "Weekly Limit should greater than or equal to Daily Limit";
    //     //     } else {
    //     //         return "";
    //     //     }
    //     // }
    // },
    {
      render: {
        componentType: "select",
      },
      options: [
        { label: "category 1", value: "1" },
        { label: "category 2", value: "2" },
        { label: "category 3", value: "3" },
      ],
      // options: () => getCIFCategories("C"),
      // _optionsKey: "getCIFCategories",
      name: "CUST_CATEGORY",
      label: "Category",
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3, md: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      isReadOnly: true,
      name: "constitution",
      label: "Constitution",
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3, md: 2 },
      dependentFields: ["CUST_CATEGORY"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          dependentFields["CUST_CATEGORY"].optionData[0]?.CONSTITUTION_TYPE;
        let label =
          dependentFields["CUST_CATEGORY"].optionData[0]?.CONSTITUTION_NAME;
        console.log(
          "setValueOnDependentFieldsChange",
          dependentFields["CUST_CATEGORY"],
          value
        );
        return value ? value : "";
      },
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields, __) => {
        console.log("currentFieldsss", currentField, dependentFields, __);
      },
    },
    {
      render: {
        componentType: "textField",
        disabled: true,
      },
      name: "acc_type",
      label: "A/c Type",
      placeholder: "",
      type: "text",
      disabled: true,
      GridProps: { xs: 4, sm: 3, md: 2 },
    },
  ],
};
export const ckyc_retrieved_meta_data: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Customer Searching",
    rowIdColumn: "CUSTOMER_ID",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "CATEGORY_CONSTITUTIONS",
      columnName: "CategoryConstitution",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 300,
      maxWidth: 580,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "CustomerId",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "PAN_NO",
      columnName: "PanNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "MOBILE_NUMBER",
      columnName: "MobileNo",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "CUSTOMER_NAME",
      columnName: "CustomerName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 340,
      minWidth: 240,
      maxWidth: 340,
    },
    {
      accessor: "BRANCH",
      columnName: "Branch",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ACTIVE",
      columnName: "Active",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "KYC_NO",
      columnName: "CkycNo",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "REQUEST_CD",
      columnName: "ReqNo",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      columnName: "Remarks",
      componentType: "buttonRowCell",
      accessor: "REMARKS",
      sequence: 10,
      buttonLabel: "Remarks",
      // isVisible: false,
      // __EDIT__: { isVisible: true },
    },
  ],
};
export const ckyc_pending_req_meta_data: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Customer Searching",
    rowIdColumn: "CUST_ID",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "CUST_ID",
      columnName: "CustomerId",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "CUST_NAME",
      columnName: "CustomerName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "CUST_TYPE",
      columnName: "CustomerType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "LAST_MODIFIED",
      columnName: "LastModified",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },

    {
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      isReadOnly: true,
      width: 140,
      minWidth: 140,
      maxWidth: 140,
    },
  ],
};

// form component view
export const RetrieveDataFilterForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "RetrieveTitle",
    allowColumnHiding: true,
    submitButtonName: "Retrieve",
    // submitButtonHide: true,
    // isDisplayOnly: false,
  },
  fields: [
    {
      accessor: "CUSTOMER_ID",
      name: "CUSTOMER_ID",
      label: "CustomerId",
      defaultfocus: true,
      // placeholder: "Select Option",
      gridconfig: { xs: 6, sm: 3 },
      // defaultValue: "A",
      autoComplete: "off",
      isVisible: true,
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      // type: "select",
      // optiondata: [
      //   { label: "Account Number", value: "A" },
      //   { label: "Card Number", value: "C" },
      //   { label: "Client ID", value: "I" },
      // ],
      // validate: (columnValue, allField, flag) => {
      //   if (!Boolean(columnValue)) {
      //     return "This field is required.";
      //   }
      //   return "";
      // },
    },
    {
      accessor: "KYC_NUMBER",
      name: "KYC_NUMBER",
      label: "CkycNo",
      // placeholder: "Select Option",
      gridconfig: { xs: 6, sm: 3 },
      // defaultValue: "A",
      autoComplete: "off",
      isVisible: false,
      isColumnHidingDisabled: false,
      entertoSubmit: true,
      // validate: (columnValue, allField, flag) => {
      //   if (!Boolean(columnValue)) {
      //     return "This field is required.";
      //   }
      //   return "";
      // },
    },
    {
      accessor: "ACCT_NO",
      name: "ACCT_NO",
      defaultValue: "",
      label: "AccountNo",
      gridconfig: { xs: 6, sm: 3 },
      // placeholder: "Please Enter Account Number",
      autoComplete: "off",
      isVisible: true,
      isColumnHidingDisabled: false,
      entertoSubmit: true,
      // dependFields: ["REG_WITH"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "I") {
          return {
            label: "Client ID",
            placeholder: "Please Enter Client ID",
            gridconfig: { xs: 6, sm: 2 },
          };
        } else if (value === "C") {
          return {
            label: "Card Number",
            placeholder: "Please Enter Card Number",
            gridconfig: { xs: 6, sm: 3 },
          };
        } else {
          return {
            label: "Account Number",
            placeholder: "Please Enter Account Number",
            gridconfig: { xs: 6, sm: 3 },
          };
        }
      },
      // validate: (columnValue, allField, flag) => {
      //   if (!Boolean(columnValue)) {
      //     return "This field is required.";
      //   }
      //   return "";
      // },
    },
    {
      accessor: "PAN_NO",
      name: "PAN_NO",
      label: "PanNo",
      defaultValue: "",
      // placeholder: "Card Number",
      gridconfig: { xs: 6, sm: 3 },
      autoComplete: "off",
      isVisible: true,
      isColumnHidingDisabled: false,
      // isDisabled: true,
      // dependFields: ["REG_WITH"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "I") {
          return { isVisible: true };
        } else {
          return {
            isVisible: false,
          };
        }
      },
    },
    {
      accessor: "UNIQUE_ID",
      name: "UNIQUE_ID",
      label: "UniqueId",
      defaultValue: "",
      gridconfig: { xs: 6, sm: 3 },
      // placeholder: "Login ID",
      autoComplete: "off",
      isVisible: false,
      isColumnHidingDisabled: true,
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue) && flag === "SECOND") {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "CONTACT2",
      name: "CONTACT2",
      label: "MobileNo",
      // placeholder: "Mobile Number",
      type: "number",
      // isDisabled: true,
      isVisible: true,
      gridconfig: { xs: 6, sm: 3 },
    },
    {
      accessor: "E_MAIL_ID",
      name: "E_MAIL_ID",
      label: "EmailId",
      // placeholder: "E-Mail Address",
      // isDisabled: true,
      isVisible: false,
      gridconfig: { xs: 6, sm: 4 },
    },
    {
      accessor: "ACCT_NM",
      name: "ACCT_NM",
      label: "CustomerName",
      // placeholder: "Name",
      // isDisabled: true,
      isVisible: false,
      gridconfig: { xs: 6, sm: 6 },
      dependFields: ["REG_WITH"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "I") {
          return { gridconfig: { xs: 4, sm: 4 } };
        } else {
          return {
            gridconfig: { xs: 6, sm: 6 },
          };
        }
      },
    },
  ],
};
