import { GridMetaDataType, utilFunction } from "@acuteinfo/common-base";
import { getRetrievalType, geTrxDdw } from "../api";
import { GeneralAPI } from "registry/fns/functions";

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
      GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
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
      GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
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
      GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
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
    rowIdColumn: "TRAN_CD",
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
      name: "KYC_DOC",
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
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REALIZE_DATE",
      label: "realizeDate",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "REALIZE_AMT",
      label: "amount",
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
      dependentFields: ["CCTFLAG"],
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
      // setFieldLabel: (dependenet, currVal) => {
      //   let cct = currVal.value;
      //   return cct?.valu === "C"
      //     ? { label: "By Cash" }
      //     : cct?.valu === "T"
      //     ? { label: "By Transfer" }
      //     : cct?.valu === "G"
      //     ? { label: "By Clearing" }
      //     : "By";
      // },

      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "REALIZE_AMT",
      label: "colComm",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COL_SER_CHARGE",
      label: "colGst",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRF_BRANCH_CD",
      label: "transferBranchCd",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "_accountNumber" },

      branchCodeMetadata: {
        name: "BRANCH_CD",
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
        // isReadOnly: true,
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: ["PAYSLIP_MST_DTL", "ACCT_TYPE", "BRANCH_CD"],
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
            dependentFieldValues?.["PAYSLIP_MST_DTL.BRANCH_CD"]?.value &&
            dependentFieldValues?.["PAYSLIP_MST_DTL.ACCT_TYPE"]?.value
          ) {
            const reqParameters = {
              BRANCH_CD:
                dependentFieldValues?.["PAYSLIP_MST_DTL.BRANCH_CD"]?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE:
                dependentFieldValues?.["PAYSLIP_MST_DTL.ACCT_TYPE"]?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "RPT/14",
            };
            let postData = await GeneralAPI.getAccNoValidation(reqParameters);

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.MSG.length; i++) {
              if (postData.MSG[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Validation Failed",
                  message: postData.MSG[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData.MSG[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Confirmation",
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData.MSG[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message: postData.MSG[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData[i];
              } else if (postData.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              ACCT_CD:
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
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
              TYPE_CD: {
                value: postData?.TYPE_CD ?? "",
              },
              TRAN_BAL: {
                value: postData?.TRAN_BAL ?? "",
              },
            };
          } else if (!currentField?.value) {
            return {
              ACCT_NM: { value: "" },
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
      name: "TRF_ACCT_TYPE",
      label: "transferAcctType",
      isReadOnly: true,
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRF_ACCT_CD",
      label: "transferAcctNo",
      isReadOnly: true,
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRF_NAME",
      label: "transfeAcName",
      isReadOnly: true,
      GridProps: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
    },
  ],
};
