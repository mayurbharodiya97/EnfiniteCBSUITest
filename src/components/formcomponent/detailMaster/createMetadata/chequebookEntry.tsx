import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GeneralAPI } from "registry/fns/functions";
// import { getReportData } from "../detailStatic";
import { GetdetailData } from "../detailmaster";
import { useContext } from "react";
import { FormContext } from "packages/form";

export const chequebookEntryMetadata = {
  masterForm: {
    form: {
      name: "chequeBookForm",
      label: "Cheque Book Issue",
      resetFieldOnUnmount: false,
      validationRun: "onChange",
      submitAction: "home",
      formStyle: {
        background: "white",
        height: "calc(100vh - 420px)",
        overflowY: "auto",
        overflowX: "hidden",
      },
      hideHeader: true,
      render: {
        ordering: "sequence",
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
      apiKey: {
        BRANCH_CD: "BRANCH_CD",
        ACCT_TYPE: "ACCT_TYPE",
        ACCT_CD: "ACCT_CD",
      },
    },
    fields: [
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
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
          lg: 3,
          xl: 3,
        },
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
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
          lg: 3,
          xl: 3,
        },
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
        required: true,
        // maxLength: 20,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Account no. is required."] }],
        },
        padEnds: 20,
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 3,
          xl: 3,
        },
        dependentFields: ["BRANCH_CD", "ACCT_TYPE", "FROM_CHEQU"],
      },
      {
        render: {
          componentType: "autocomplete",
        },
        name: "NO_OF_CHEQUE",
        label: "No of Cheq(s)",
        placeholder: "Enter no of Cheque book",
        type: "text",
        // options: () => {
        //   return [
        //     { value: "15", label: "15" },
        //     { value: "45", label: "45" },
        //     { value: "90", label: "90" },
        //   ];
        // },
        options: GeneralAPI.getChequeLeavesList,
        _optionsKey: "getChequeLeavesList",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
          lg: 3,
          xl: 3,
        },

        postValidationSetCrossFieldValues: async (
          field,
          __,
          ___,
          dependentFieldsValues
        ) => {
          if (field.value) {
            let postdata = await GetdetailData({
              reportID: "GETLANGMSGDTL",
              otherAPIRequestPara: { TRAN_CD: 1 },
            });
            console.log("<<<postdata", postdata);
            return {
              SERVICE_CHARGE: { value: postdata[0]?.LANG_MSG ?? "" },
              GST: {
                value: postdata[0]?.LANG_CODE ?? "",
              },
              FROM_CHEQUE_NO: { value: postdata[0]?.SR_CD ?? "" },
              TO_CHEQUE_NO: { value: postdata[0]?.TRAN_CD ?? "" },
            };
          }

          return {};
        },
        runPostValidationHookAlways: true,
      },
      {
        render: {
          componentType: "textField",
        },
        name: "FROM_CHEQUE_NO",
        label: "From Cheque No.",
        placeholder: "From Cheque No.",
        type: "text",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 1.5,
          sm: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "TO_CHEQUE_NO",
        label: "To Cheque No.",
        placeholder: "To Cheque No.",
        type: "text",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 1.5,
          sm: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "SERVICE_CHARGE",
        label: "Service Charge",
        placeholder: "Service Charge",
        type: "text",
        required: true,
        GridProps: {
          xs: 12,
          md: 1.5,
          sm: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "GST",
        label: "GST",
        placeholder: "GST",
        type: "text",
        required: true,
        GridProps: {
          xs: 12,
          md: 1.5,
          sm: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "REQUISITION_DT",
        // sequence: 9,
        label: "Requisition Date",
        placeholder: "",
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
          componentType: "textField",
        },
        name: "ACCT_NM",
        // sequence: 1,
        label: "Name",
        placeholder: "Account Name",
        type: "text",
        // required: true,
        // maxLength: 16,
        isReadOnly: true,
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
          componentType: "textField",
        },
        name: "REMARKS",
        // sequence: 10,
        label: "Remark",
        placeholder: "Enter remark",
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
          componentType: "autocomplete",
        },
        name: "CHARACTERISTICS",
        // sequence: 4,
        label: "Characteristics",
        placeholder: "Characteristics",
        type: "text",
        required: true,
        options: () => {
          return [
            { value: "Bearer", label: "Bearer" },
            { value: "Order", label: "Order" },
          ];
        },
        _optionsKey: "CHARACTERISTICS",
        GridProps: {
          xs: 12,
          md: 1.5,
          sm: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      {
        render: {
          componentType: "autocomplete",
        },
        name: "PAYABLE_AT_PAR",
        label: "Payable At PAR",
        placeholder: '"Payable At PAR',
        options: () => {
          return [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ];
        },
        _optionsKey: "PAYABLE_AT_PAR",
        type: "text",
        required: true,
        GridProps: {
          xs: 12,
          md: 1.5,
          sm: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "CHEQUE_TOTAL",
        label: "No of ChequeBooks",
        placeholder: "Enter no of Cheque book",
        type: "text",
        required: true,
        // defaultValue: "2",
        // enableDefaultOption: true,
        GridProps: {
          xs: 12,
          md: 1.5,
          sm: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },

      {
        render: {
          componentType: "textField",
        },
        name: "MACHINE_NM",
        label: "Joint Account Name",
        type: "text",
        required: true,
        shouldExclude(fieldData) {
          if (fieldData?.value) {
            return false;
          } else {
            return true;
          }
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
          lg: 2,
          xl: 2,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Cheque Book Issued",
      rowIdColumn: "TRAN_CD",
      defaultColumnConfig: {
        width: 150,
        maxWidth: 250,
        minWidth: 100,
      },
      allowColumnReordering: true,
      disableSorting: false,
      disableGroupBy: true,
      enablePagination: true,
      hideFooter: true,
      pageSizes: [10, 20, 30],
      defaultPageSize: 10,
      containerHeight: {
        min: "38vh",
        max: "38vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
      allowRowSelection: false,
    },
    filters: [],
    columns: [
      {
        accessor: "ID",
        columnName: "Sr.No.",
        sequence: 1,
        alignment: "center",
        componentType: "default",
        width: 70,
        minWidth: 70,
        maxWidth: 200,
        isAutoSequence: true,
      },
      {
        accessor: "TRAN_DT",
        columnName: "Issue Date",
        sequence: 2,
        alignment: "center",
        componentType: "date",
        dateFormat: "dd/MM/yyyy",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "CHEQUE_FROM",
        columnName: "From Chq. No.",
        sequence: 4,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
        isVisible: true,
      },
      {
        accessor: "CHEQUE_TO",
        columnName: "To Chq. No.",
        sequence: 5,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 150,
        maxWidth: 200,
      },
      {
        accessor: "CHEQUE_TOTAL",
        columnName: "No. Chq(s)",
        sequence: 6,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 400,
      },
      {
        accessor: "UNUSED_CHQ",
        columnName: "Unused Chq.",
        sequence: 6,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 400,
      },
      {
        accessor: "AMOUNT",
        columnName: "Charge",
        sequence: 7,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 120,
        maxWidth: 250,
      },
      {
        accessor: "SERVICE_TAX",
        columnName: "GST",
        sequence: 8,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "REMARKS",
        columnName: "Remarks",
        sequence: 9,
        alignment: "left",
        componentType: "default",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "CHARACTERISTICS",
        columnName: "Characteristics",
        sequence: 10,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
        // color: (value) => {
        //   if ((value || "unlock").toLowerCase() === "unlock") {
        //     return "green";
        //   }
        //   return "red";
        // },
      },
      {
        accessor: "PAYABLE_AT_PAR",
        columnName: "At PAR",
        sequence: 9,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "REQUISITION_DT",
        columnName: "Requisition Date",
        sequence: 10,
        alignment: "left",
        componentType: "date",
        dateFormat: "dd/MM/yyyy",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "AUTO_CHQBK_FLAG",
        columnName: "Auto Issue",
        sequence: 10,
        alignment: "center",
        componentType: "default",
        width: 100,
        minWidth: 70,
        maxWidth: 200,
      },
      {
        accessor: "email",
        columnName: "E-Mail ID",
        sequence: 21,
        alignment: "left",
        componentType: "default",
        width: 150,
        minWidth: 100,
        maxWidth: 400,
      },
    ],
  },
};
