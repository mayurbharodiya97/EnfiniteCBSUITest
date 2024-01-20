import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { getLimitEntryData } from "../limit-entry/api";

export const StockEntryMetaData = {
  form: {
    name: "PRIORITY",
    label: "Stock Entry",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
    componentProps: {
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "branchCode",
      },
      name: "BRANCH_CD",
      label: "Branch",
      placeholder: "Branch",
      type: "text",
      isFieldFocused: true,
      required: true,
      // maxLength: 16,
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
      label: "Account Type",
      placeholder: "EnterAccountType",
      type: "text",
      required: true,
      options: (dependentValue, formState, _, authState) => {
        let ApiReq = {
          USER_NAME: authState?.user?.id,
          BRANCH_CD: authState?.user?.branchCode,
          COMP_CD: authState?.companyID,
        };
        return API.stockAcctTypeList(ApiReq);
      },
      _optionsKey: "securityDropDownListType",
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
      label: "Account Number",
      placeholder: "EnterAcNo",
      type: "text",
      // fullWidth: true,
      required: true,
      // maxLength: 20,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account no. is required."] }],
      },
      dependentFields: ["ACCT_TYPE", "SECURITY_CD"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
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
          let postData = await getLimitEntryData(otherAPIRequestPara);

          if (postData.length) {
            formState.setDataOnFieldChange("VISIBLE_TAB", {
              VISIBLE_TAB: true,
            });
            return {
              ACCT_NM: {
                value: postData?.[0]?.ACCT_NM,
              },
              TRAN_BAL: {
                value: postData?.[0]?.TRAN_BAL,
              },
            };
          } else {
            formState.setDataOnFieldChange("VISIBLE_TAB", {
              VISIBLE_TAB: false,
            });
            return {
              ACCT_CD: { value: "", isFieldFocused: true },
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }
        } else if (!field?.value) {
          formState.setDataOnFieldChange("VISIBLE_TAB", { VISIBLE_TAB: false });
          return {
            ACCT_NM: { value: "" },
            TRAN_BAL: { value: "" },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 3,
        xl: 3,
      },
      // dependentFields: ["BRANCH_CD", "ACCT_TYPE", "FROM_CHEQU"],
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      // sequence: 1,
      label: "Account Name",
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
      name: "TRAN_BAL",
      label: "Balance",
      placeholder: "Balance",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MST_LIMIT",
      label: "Account Limit Amount",
      placeholder: "Account Limit Entry",
      type: "text",
      // defaultValue: "2",
      // enableDefaultOption: true,
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_CD",
      label: "Security",
      disableCaching: true,
      _optionsKey: "securityListDD",
      dependentFields: ["ACCT_TYPE", "ACCT_CD"],
      placeholder: "Security",
      options: (dependentValue, formState, _, authState, other) => {
        if (
          dependentValue?.ACCT_TYPE?.value &&
          dependentValue?.ACCT_CD?.value
        ) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            ACCT_CD: dependentValue?.ACCT_CD?.value
              .padStart(6, "0")
              .padEnd(20, " "),
          };
          return API.securityListDD(apiReq);
        }
        return [];
      },
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "NNNNNNN",
      // sequence: 9,
      label: "Statement Date",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "HHHHHHHHHHH",
      // sequence: 9,
      label: "STMT Valid Till Date",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SCRIPT_CD",
      label: "Script",
      placeholder: "Script ",
      disableCaching: true,
      _optionsKey: "scriptListDD",
      dependentFields: ["ACCT_TYPE", "ACCT_CD"],
      options: (dependentValue, formState, _, authState, other) => {
        // if (
        //   dependentValue?.ACCT_TYPE?.value &&
        //   dependentValue?.ACCT_CD?.value
        // ) {
        let apiReq = {
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          // ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
          // ACCT_CD: dependentValue?.ACCT_CD?.value,
        };
        return API.scriptListDD(apiReq);
        // }
        // return [];
      },
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "NO_OF_SHARE",
      label: "No. of Share",
      type: "text",
      placeholder: "No. of Share",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "STOCK_VALUE",
      label: "Stock Value",
      placeholder: "Stock Value",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "WWWWWWWWW",
      label: "Net Value",
      type: "text",
      placeholder: "Net Value",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MARGIN",
      label: "Margin",
      type: "text",
      placeholder: "Margin",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STOCK_DESC",
      label: "Stock Decription",
      type: "text",
      placeholder: "Stock Description",
      GridProps: {
        xs: 12,
        md: 3.2,
        sm: 3.2,
        lg: 3.2,
        xl: 3.2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      type: "text",
      placeholder: "Remarks",
      GridProps: {
        xs: 12,
        md: 3.2,
        sm: 3.2,
        lg: 3.2,
        xl: 3.2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DRAWING_POWER",
      label: "Drawing Power",
      type: "text",
      placeholder: "Drawing Power",
      GridProps: {
        xs: 12,
        md: 3.2,
        sm: 3.2,
        lg: 3.2,
        xl: 3.2,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "RECEIVED_DT",
      label: "Received Date",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
  ],
};
