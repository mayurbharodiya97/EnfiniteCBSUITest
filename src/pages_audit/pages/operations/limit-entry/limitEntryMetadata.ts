import { errorSelector } from "recoil";
import * as API from "./api";

export const limitEntryMetaData = {
  form: {
    name: "limitEntry",
    label: "Limit Entry",
    resetFieldOnUnmount: false,
    validationRun: "onChange",
    submitAction: "home",
    hideHeader: true,
    formStyle: {
      background: "white",
      height: "calc(100vh - 390px)",
      overflowY: "auto",
      overflowX: "hidden",
    },
    render: {
      ordering: "auto",
      // ordering: "sequence",
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
  },
  fields: [
    // {
    //   render: {
    //     componentType: "_accountNumber",
    //   },
    //   // acctFieldPara: "2",
    //   // postValidationSetCrossFieldValues: "testingFn",
    //   // name: "ACCT_CD",
    // },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "FD_BRANCH_CD",
    //   label: "FD Branch",
    //   sequence: "9",
    //   GridProps: {
    //     xs: "12",
    //     md: "3",
    //     sm: "4",
    //     lg: "3",
    //     xl: "2",
    //   },
    // },
    {
      render: {
        componentType: "branchCode",
      },
      name: "BRANCH_CD",
      label: "Branch",
      placeholder: "Branch Code",
      type: "text",
      required: true,
      // isFieldFocused: true,
      // maxLength: 16,
      // options: GeneralAPI.getBranchCodeList,
      // _optionsKey: "getBranchCodeList",
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
      // disableCaching: true,
      options: (dependentValue, formState, _, authState) => {
        return API.securityDropDownListType(
          authState?.user?.id,
          authState?.user?.branchCode,
          authState?.companyID
        );
      },
      _optionsKey: "securityDropDownListType",
      dependentFields: ["BRANCH_CD", "SECURITY_CD"],
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
        rules: [{ name: "required", params: ["Account No. is required."] }],
      },
      dependentFields: ["ACCT_TYPE", "SECURITY_CD"],
      postValidationSetCrossFieldValues: async (
        field,
        __,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          let otherAPIRequestPara = {
            COMP_CD: authState?.companyID,
            ACCT_CD: field.value.padStart(6, "0").padEnd(20, " "),
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            BRANCH_CD: authState?.user?.branchCode,
          };
          let postData = await API.getLimitEntryData(otherAPIRequestPara);
          return {
            ACCT_NM: {
              value: postData?.[0]?.ACCT_NM,
            },
            TRAN_BAL: {
              value: postData?.[0]?.TRAN_BAL,
            },
            SANCTIONED_AMT: {
              value: postData?.[0]?.SANCTIONED_AMT,
            },
            BRANCH_CD: {
              value: postData?.[0]?.BRANCH_CD,
            },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
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
      label: "Account Name",
      isReadOnly: true,
      placeholder: "Account Name",
      type: "text",
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
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Tran. Balance",
      placeholder: "Balance",
      isFieldFocused: false,
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SANCTIONED_AMT",
      label: "San. Limit",
      placeholder: "San. limit",
      isReadOnly: true,
      type: "text",
      sequence: 0,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LIMIT_TYPE",
      label: "Limit Type",
      placeholder: "Limit Type",
      type: "text",
      defaultValue: "Normal",
      options: () => {
        return [
          { value: "Normal", label: "Normal Limit" },
          { value: "Hoc", label: "Ad-hoc Limit" },
        ];
      },
      _optionsKey: "getChequeLeavesList",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_CD",
      label: "Security Code",
      placeholder: "Security",
      type: "text",
      disableCaching: true,
      _optionsKey: "getSecurityListData",
      dependentFields: ["ACCT_TYPE"],
      options: (dependentValue, formState, _, authState, other) => {
        if (dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE) {
          return API.getSecurityListData(
            authState?.companyID,
            authState?.user?.branchCode,
            dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE.trim()
          );
        }
        return [];
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },
  ],
};
