import { GridMetaDataType, utilFunction } from "@acuteinfo/common-base";
import { getCalculateGstComm, getRetrievalType, geTrxDdw } from "../api";
import { GeneralAPI } from "registry/fns/functions";
import { getGstCalcAmount, getStopPaymentReasonData } from "./api";
import { t } from "i18next";
import { icon } from "@fortawesome/fontawesome-svg-core";

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
        componentType: "autocomplete",
      },
      name: "BRANCH_CD",
      label: "Branch",
      defaultValue: "099 ",
      placeholder: "BranchCodePlaceHolder",
      options: "getBranchCodeList",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["BranchCodeReqired"] }],
      },
      GridProps: { xs: 3, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DEF_TRAN_CD",
      label: "Type",
      isFieldFocused: true,
      placeholder: "Select Bill Type",
      required: true,
      fullWidth: true,
      options: (dependentValue, formState, _, authState) => {
        return getRetrievalType({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          CODE: "DD",
        });
      },
      _optionsKey: "getCommonTypeList",
      GridProps: { xs: 3, sm: 4, md: 2, lg: 2, xl: 2 },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["billtypeRequired"] }],
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PAYSLIP_NO",
      label: "payslipNumber",
      placeholder: "enterPayslipToretrive",
      type: "number",
      fullWidth: true,
      // required: true,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["payslipNoRequired"] }],
      // },
      FormatProps: {
        allowLeadingZeros: true,
        isAllowed: (values) => {
          //@ts-ignore
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 3, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SCREEN_REF",
    },
    {
      render: {
        componentType: "radio",
      },
      name: "CANCEL",
      label: "",
      defaultValue: "E",
      RadioGroupProps: { row: true },
      options: [
        {
          label: "cancelReturnPending",
          value: "E",
        },
        {
          label: "confirmPending",
          value: "P",
        },
        {
          label: "todayTrns",
          value: "V",
        },
        {
          label: "Revalidate",
          value: "D",
        },
      ],
      dependentFields: ["SCREEN_REF"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREEN_REF?.value === "CANCEL") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 3.5, lg: 3.5, xl: 3.5 },
    },
    {
      render: {
        componentType: "radio",
      },
      name: "REALIZE",
      label: "",
      defaultValue: "E",
      RadioGroupProps: { row: true },
      options: [
        {
          label: "realizePending",
          value: "E",
        },
        {
          label: "confirmPending",
          value: "P",
        },
        {
          label: "todayTrns",
          value: "V",
        },
      ],
      dependentFields: ["SCREEN_REF"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREEN_REF?.value === "REALIZE") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 3.5, lg: 3.5, xl: 3.5 },
    },
    {
      render: {
        componentType: "radio",
      },
      name: "STOPPAYMENT",
      label: "",
      defaultValue: "E",
      RadioGroupProps: { row: true },
      options: [
        {
          label: "stopPayment",
          value: "S",
        },
        {
          label: "realseStoppedPayslip",
          value: "R",
        },
      ],
      dependentFields: ["SCREEN_REF"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREEN_REF?.value === "STOPPAYMENT") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 3.5, lg: 3.5, xl: 3.5 },
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
    gridLabel: "",
    rowIdColumn: "INDEX",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: false,
    disableSorting: false,
    // hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "64vh",
      max: "65vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "issueBranch",
      sequence: 2,
      componentType: "default",
      alignment: "right",
      width: 115,
      maxWidth: 150,
      minWidth: 80,
    },
    {
      accessor: "PAYSLIP_NO",
      columnName: "payslipNumber",
      sequence: 3,
      componentType: "default",
      width: 100,
      maxWidth: 220,
      minWidth: 100,
      alignment: "right",
    },
    {
      accessor: "PENDING_FLAG",
      columnName: "entryStatus",
      sequence: 3,
      componentType: "default",
      width: 100,
      maxWidth: 220,
      minWidth: 100,
      alignment: "left",
      color: (val, data) => {
        let PENDING_FLAG = data?.original?.PENDING_FLAG ?? "";
        return PENDING_FLAG === "Y" ? "green" : "red";
      },
    },
    {
      accessor: "REALIZE_FLAG",
      columnName: "confirmStatus",
      sequence: 4,
      componentType: "default",
      width: 150,
      maxWidth: 250,
      minWidth: 150,
      alignment: "left",
      color: (val, data) => {
        let REALIZE_FLAG = data?.original?.REALIZE_FLAG ?? "";
        return REALIZE_FLAG === "Y" ? "green" : "red";
      },
    },
    {
      accessor: "TRAN_DT",
      columnName: "issueDate",
      sequence: 6,
      componentType: "date",
      width: 150,
      maxWidth: 220,
      minWidth: 150,
      alignment: "left",
    },
    {
      accessor: "AMOUNT",
      columnName: "amount",
      sequence: 6,
      componentType: "currency",
      width: 130,
      maxWidth: 150,
      minWidth: 100,
      alignment: "right",
    },

    {
      accessor: "ACCT_NO",
      columnName: "AccountNum",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "INFAVOUR_OF",
      columnName: "InfavourOf",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 260,
      minWidth: 260,
      maxWidth: 260,
    },

    {
      accessor: "REVALID_CONF",
      columnName: "reValidDate",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 170,
      minWidth: 150,
      maxWidth: 220,
    },
  ],
};
export const reasonGridMetadata: any = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "REASON_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    disableGlobalFilter: true,
    enablePagination: true,
    pageSizes: [15, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "50vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    allowGlobalFilter: false,
  },
  filters: [],
  columns: [
    {
      accessor: "DISLAY_REASON",
      columnName: "Reason",
      sequence: 1,
      componentType: "default",
      alignment: "left",
      width: 520,
      maxWidth: 550,
      minWidth: 400,
    },
  ],
};
export const ddTransactionFormMetaData = {
  form: {
    name: "ddtransaction",
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
      name: "SCREENFLAG",
      label: "billType",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMM_DISCRIPTION",
      label: "billType",
      isFieldFocused: true,
      placeholder: "Select Bill Type",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "textField" },
      name: "INFAVOUR_OF",
      placeholder: "Select Infavour of",
      label: "inFavourOf",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADDRESS",
      label: "address",
      placeholder: "address",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "INSTRUCTION_REMARKS",
      label: "instRemarks",
      placeholder: "instRemarks",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CCTFLAG",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "textField" },
      name: "C_C_T",
      placeholder: "byTransfer",
      label: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      dependentFields: ["CCTFLAG"],
      setFieldLabel: (dependenet, currVal) => {
        let cct = dependenet?.CCTFLAG?.value;

        return cct === "C"
          ? "By Cash"
          : cct === "T"
          ? "By Trf"
          : cct === "R"
          ? "By Cr. Trf"
          : cct === "G"
          ? "By CLG"
          : null;
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        let cct = dependentFields?.CCTFLAG?.value;

        return cct === "C"
          ? "Cash"
          : cct === "T"
          ? "Transfer"
          : cct === "G"
          ? "Clearing"
          : cct === "R"
          ? "Transfer"
          : null;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "textField" },
      name: "REGION_NM",
      placeholder: "region",
      label: "region",
      isReadOnly: true,
      type: "text",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      fullWidth: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SIGNATURE1_NM",
      label: "signature1",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SIGNATURE2_NM",
      label: "signature2",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REVALID_DT",
      label: "reValidDate",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REVALID_BY",
      label: "reValidBy",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ISSUE_BRANCH",
      label: "payslipIsuueBranch",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COL_BANK_CD",
      label: "bankCode",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
      label: "bankName",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARTY_NAME",
      label: "partyName",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARTY_ADDRESS",
      label: "partyAddress",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DOC_DATE",
      label: "documentDate",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "issueDate",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAYSLIP_NO",
      label: "payslipNumber",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "amount",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COMMISSION",
      label: "Commision",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "OTHER_COMISSION",
      label: "otherComm",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_CHARGE",
      label: "GST",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_NM",
      label: "branch",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "KYC_DOC_DISP",
      label: "kycDocument",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "KYC_DOC_NO",
      label: "kycDocumentNo",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "DEVIDER",
      label: "Realization Pending",
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.SCREENFLAG?.value === "REALIZE" ||
          dependentFields?.SCREENFLAG?.value === "CANCEL"
        ) {
          return false;
        }
        return true;
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REALIZE_DATE",
      label: "realizeDate",
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.SCREENFLAG?.value === "REALIZE" ||
          dependentFields?.SCREENFLAG?.value === "CANCEL"
        ) {
          return false;
        }
        return true;
      },
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "REALIZE_AMT",
      label: "amount",
      dependentFields: ["CCTFLAG", "SCREENFLAG", "AMOUNT"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.SCREENFLAG?.value === "REALIZE" ||
          dependentFields?.SCREENFLAG?.value === "CANCEL"
        ) {
          return false;
        }
        return true;
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields?.AMOUNT?.value;
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value !== dependentFieldsValues?.AMOUNT?.value) {
          let buttonName = await formState?.MessageBox({
            messageTitle: t("ValidationFailed"),
            message: t("realizedAmountValidationMsg"),
            icon: "ERROR",
            buttonNames: ["Ok"],
          });

          if (buttonName === "Ok") {
            return {
              REALIZE_AMT: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
            };
          }
        }
      },

      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "C_C_T_SP_C",
      options: [
        { label: "Cash", value: "C" },
        { label: "Clearing", value: "G" },
        { label: "Transfer", value: "T" },
      ],
      label: "",
      dependentFields: ["CCTFLAG", "SCREENFLAG"],
      setFieldLabel: (dependenet, currVal) => {
        let cct = dependenet?.CCTFLAG?.value;
        return currVal === "C"
          ? "By Cash"
          : currVal === "T"
          ? "By Transfer"
          : currVal === "G"
          ? "By Clearing"
          : "By";
      },
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.SCREENFLAG?.value === "REALIZE" ||
          dependentFields?.SCREENFLAG?.value === "CANCEL"
        ) {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COLLECT_COMISSION",
      label: "colComm",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      dependentFields: ["SCREENFLAG", "ACCT_CD", "ACCT_TYPE", "REALIZE_AMT"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.SCREENFLAG?.value === "REALIZE" ||
          dependentFields?.SCREENFLAG?.value === "CANCEL"
        ) {
          return false;
        }
        return true;
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState.isSubmitting) {
          return {};
        }

        const reqParams = {
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value,
          ACCT_CD: dependentFieldsValues?.ACCT_CD?.value,
          AMOUNT: currentField?.value,
          ENT_BRANCH_CD: authState?.user?.branchCode,
          MODULE: "",
          ASON_DT: authState?.workingDate,
        };
        console.log(reqParams);

        if (
          reqParams.ACCT_CD !== "" &&
          reqParams.ACCT_TYPE !== "" &&
          reqParams.AMOUNT !== "" &&
          dependentFieldsValues?.SCREENFLAG?.value === "CANCEL"
        ) {
          const gstApiData = await getGstCalcAmount(reqParams);

          return {
            COL_SER_CHARGE: {
              value: gstApiData?.[0]?.TAX_AMOUNT ?? "",
              ignoreUpdate: true,
            },
          };
        } else {
          return {};
        }
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COL_SER_CHARGE",
      label: "colGst",
      isReadOnly: true,
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.SCREENFLAG?.value === "REALIZE" ||
          dependentFields?.SCREENFLAG?.value === "CANCEL"
        ) {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRF_COMP_CD",
      label: "",
      isReadOnly: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
      dependentFields: ["C_C_T_SP_C", "SCREENFLAG"],
      shouldExclude: (val1, dependent) => {
        if (
          dependent?.C_C_T_SP_C?.value === "T" &&
          (dependent?.SCREENFLAG?.value === "REALIZE" ||
            dependent?.SCREENFLAG?.value === "CANCEL")
        ) {
          return false;
        }
        return true;
      },
    },
    {
      render: { componentType: "_accountNumber" },

      branchCodeMetadata: {
        name: "TRF_BRANCH_CD",
        dependentFields: ["C_C_T_SP_C", "SCREENFLAG"],
        shouldExclude: (val1, dependent) => {
          if (
            dependent?.C_C_T_SP_C?.value === "T" &&
            (dependent?.SCREENFLAG?.value === "REALIZE" ||
              dependent?.SCREENFLAG?.value === "CANCEL")
          ) {
            return false;
          }
          return true;
        },
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      accountTypeMetadata: {
        name: "TRF_ACCT_TYPE",
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
        dependentFields: ["C_C_T_SP_C", "SCREENFLAG"],
        shouldExclude: (val1, dependent) => {
          if (
            dependent?.C_C_T_SP_C?.value === "T" &&
            (dependent?.SCREENFLAG?.value === "REALIZE" ||
              dependent?.SCREENFLAG?.value === "CANCEL")
          ) {
            return false;
          }
          return true;
        },
      },
      accountCodeMetadata: {
        name: "TRF_ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: [
          "TRF_ACCT_TYPE",
          "TRF_BRANCH_CD",
          "C_C_T_SP_C",
          "SCREENFLAG",
        ],
        shouldExclude: (val1, dependent) => {
          if (
            dependent?.C_C_T_SP_C?.value === "T" &&
            (dependent?.SCREENFLAG?.value === "REALIZE" ||
              dependent?.SCREENFLAG?.value === "CANCEL")
          ) {
            return false;
          }
          return true;
        },
        runPostValidationHookAlways: true,
        AlwaysRunPostValidationSetCrossFieldValues: {
          alwaysRun: true,
          touchAndValidate: true,
        },
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.TRF_BRANCH_CD?.value &&
            dependentFieldValues?.TRF_ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.TRF_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.TRF_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.TRF_ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "RPT/14",
            };
            let postData = await GeneralAPI.getAccNoValidation(reqParameters);

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData?.MSG.length; i++) {
              if (postData?.MSG[i]?.O_STATUS === "999") {
                const btnName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG[i]?.O_STATUS === "99") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Confirmation",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG[i]?.O_STATUS === "9") {
                const btnName = await formState.MessageBox({
                  messageTitle: "Alert",
                  message: postData?.MSG[i]?.O_MESSAGE,
                });
              } else if (postData?.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }

            return {
              TRF_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              TRF_NAME: {
                value: postData?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            return {
              TRF_NAME: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }
        },

        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRF_NAME",
      label: "transfeAcName",
      isReadOnly: true,
      dependentFields: ["C_C_T_SP_C", "SCREENFLAG"],
      shouldExclude: (val1, dependent) => {
        if (
          dependent?.C_C_T_SP_C?.value === "T" &&
          (dependent?.SCREENFLAG?.value === "REALIZE" ||
            dependent?.SCREENFLAG?.value === "CANCEL")
        ) {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "TOKEN_NO",
      label: "TokenNo",
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
      dependentFields: ["C_C_T_SP_C", "SCREENFLAG"],
      shouldExclude: (val1, dependent) => {
        if (
          dependent?.C_C_T_SP_C?.value !== "C" &&
          (dependent?.SCREENFLAG?.value !== "REALIZE" ||
            dependent?.SCREENFLAG?.value !== "CANCEL")
        ) {
          return true;
        }
        return false;
      },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "DEVIDER3",
      label: "Stop Payment",
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREENFLAG?.value === "STOPPAYMENT") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "STOP_DATE",
      label: "stopDate",
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREENFLAG?.value === "STOPPAYMENT") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REALEASE_DATE",
      label: "realeaseDate",
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREENFLAG?.value === "STOPPAYMENT") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REASON_STOPPAYMENT",
      label: "Reason",
      type: "text",
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREENFLAG?.value === "STOPPAYMENT") {
          return false;
        }
        return true;
      },
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "DEVIDER2",
      label: "Account Details",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "branch",
      isReadOnly: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      isReadOnly: true,
      label: "AccountType",
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "AccountNo",
      isReadOnly: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "narration",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "balance",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "textField" },
      name: "C_C_T",
      placeholder: "",
      label: "byTrf",
      fullWidth: true,
      setFieldLabel: (dependenet, currVal) => {
        return currVal === "C"
          ? "By Cash"
          : currVal === "T"
          ? "By Trf"
          : currVal === "R"
          ? "By Cr. Trf"
          : currVal === "G"
          ? "By CLG"
          : null;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CHEQUE_NO_DISP",
      label: "chequeNo",
      dependentFields: ["CCTFLAG"],
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DATE",
      label: "chequeDate",
      isReadOnly: true,
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "amount",
      fullWidth: true,
      isReadOnly: true,
      type: "text",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COMMISSION",
      label: "Comm.",
      fullWidth: true,
      isReadOnly: true,
      type: "text",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_CHARGE",
      label: "GST",
      isReadOnly: true,
      type: "text",
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "accountName",
      isReadOnly: true,
      type: "text",
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "DEVIDER5",
      label: "Stop Payment Reason",
      dependentFields: ["SCREENFLAG"],
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREENFLAG?.value === "STOPPAYMENT") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "REASON_CD",
      label: "Reason",
      isFieldFocused: true,
      required: true,
      dependentFields: ["SCREENFLAG"],
      options: (dependentValue, formState, _, authState) => {
        return getStopPaymentReasonData({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        });
      },
      _optionsKey: "getStopPaymentReason",
      GridProps: { xs: 3, sm: 4, md: 4, lg: 4, xl: 4 },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.SCREENFLAG?.value === "STOPPAYMENT") {
          return false;
        }
        return true;
      },
    },
  ],
};
