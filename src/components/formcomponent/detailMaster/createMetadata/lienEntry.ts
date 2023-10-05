import { GeneralAPI } from "registry/fns/functions";
// import { getReportData } from "../detailStatic";

export const lienEntryMetadata = {
  masterForm: {
    form: {
      name: "chequeBookForm",
      label: "Lien Entry",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
      submitAction: "home",
      formStyle: {
        background: "white",
        height: "calc(100vh - 390px)",
        overflowY: "auto",
        overflowX: "hidden",
      },
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
      // {
      //   render: {
      //     componentType: "_accountNumber",
      //   },
      //   name: "dfk",
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
        maxLength: 20,
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
        name: "FCRss",
        label: "Account Name",
        placeholder: "",
        type: "text",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 6,
          sm: 6,
          lg: 6,
          xl: 6,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "FCR",
        label: "Lien Code",
        placeholder: "",
        type: "text",
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
          componentType: "datePicker",
        },
        name: "FRS",
        label: "Effective Date",
        placeholder: "",
        type: "text",
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
        name: "FFFR",
        label: "Parent Code/Name",
        placeholder: "",
        type: "text",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 6,
          sm: 6,
          lg: 6,
          xl: 6,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "FRS",
        label: "Lien Amount",
        placeholder: "",
        type: "text",
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
          componentType: "datePicker",
        },
        name: "FRS",
        label: "Removal Date",
        placeholder: "",
        type: "text",
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
        name: "FRS",
        label: "Reason",
        placeholder: "",
        type: "text",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 6,
          sm: 6,
          lg: 6,
          xl: 6,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "FRS",
        label: "Rmarks",
        placeholder: "",
        type: "text",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 6,
          sm: 6,
          lg: 6,
          xl: 6,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Lien Entry",
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
        min: "25vh",
        max: "25vh",
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
        accessor: "ENTRY_DT",
        columnName: "Lien Detail",
        sequence: 2,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "ENTRY_DaT",
        columnName: "Lien Detail",
        sequence: 2,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "TT",
        columnName: "Effective Date",
        sequence: 3,
        alignment: "center",
        componentType: "date",
        dateFormat: "dd/MM/yyyy",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "EXPIRY_DT",
        columnName: "Removal Date",
        sequence: 3,
        alignment: "center",
        componentType: "date",
        dateFormat: "dd/MM/yyyy",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },

      {
        accessor: "PENAL_RATE",
        columnName: "Lien Amount",
        sequence: 6,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 400,
      },
      {
        accessor: "SECURITY_VALUE",
        columnName: "Status",
        sequence: 6,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 400,
      },

      {
        accessor: "REMARKS",
        columnName: "Confirmed",
        sequence: 9,
        alignment: "center",
        componentType: "date",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "FORCE_EXP_DT",
        columnName: "Reason",
        sequence: 10,
        alignment: "center",
        componentType: "date",
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
    ],
  },
};
