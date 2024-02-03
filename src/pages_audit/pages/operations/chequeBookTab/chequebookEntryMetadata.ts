import { GeneralAPI } from "registry/fns/functions";
// import { TemporaryData, chequebookCharge } from "./api";
import { format, parse } from "date-fns";
import * as API from "./api";

export const ChequeBookEntryMetaData = {
  form: {
    name: "PRIORITY",
    label: "Cheque Book Issue",
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
        componentType: "autocomplete",
      },
      name: "BRANCH_CD",
      label: "Branch",
      placeholder: "Branch",
      type: "text",
      isFieldFocused: true,
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
      label: "Account Type",
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
      label: "Account Number",
      placeholder: "EnterAcNo",
      type: "text",
      // fullWidth: true,
      required: true,

      disableCaching: true,
      // maxLength: 20,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account no. is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
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
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
          };
          let postData = await API.getChequebookData({ otherAPIRequestPara });

          const result = [
            "ACCT_ALLOW_MSG",
            "BRN_ALLOW_MSG",
            "CHEQUBOOK_ALLOW_MSG",
            "CONFIRM_MSG",
            "STATUS_MSG",
            "ACCT_MSG",
          ]
            .map((key) => postData[0][key])
            .filter((message) => message !== "")
            .join(", ");

          if (result) {
            console.log("<<<ifi", field?.value);
            formState.setDataOnFieldChange("MESSAGE", result);
            return {
              ACCT_CD: { value: "", isFieldFocused: true },
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
              CHEQUE_FROM: { value: "" },
              CHEQUE_TO: { value: "" },
              SERVICE_TAX: { value: "" },
              LEAF_ARR: { value: "" },
              GST_AMOUNT: { value: "" },
              TOOLBAR_DTL: { value: "" },
            };
          } else {
            formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: true });
            return {
              ACCT_NM: {
                value: postData?.[0]?.ACCT_NM ?? "",
              },
              ACCT_BAL: {
                value: postData?.[0]?.ACCT_BAL ?? "",
              },
              CHEQUE_FROM: {
                value: postData?.[0]?.CHEQUE_FROM ?? "",
              },
              NEW_LEAF_ARR: {
                value: postData?.[0]?.LEAF_ARR ?? "",
              },
              AUTO_CHQBK_FLAG: {
                value: postData?.[0]?.AUTO_CHQBK_FLAG ?? "",
              },
              AUTO_CHQBK_PRINT_FLAG: {
                value: postData?.[0]?.CHEQUEBOOK_PRINT ?? "",
              },
              REQUISITION_DT: {
                value:
                  format(
                    parse(authState?.workingDate, "dd/MM/yyyy", new Date()),
                    "dd-MMM-yyyy"
                  ).toUpperCase() ?? "",
              },
              SR_CD: {
                value: postData?.[0]?.SR_CD ?? "",
              },
              TOOLBAR_DTL: {
                value: `No. of chequebook issued = ${postData?.[0]?.NO_CHEQUEBOOK_ISSUE} , No of cheque used = ${postData?.[0]?.NO_CHEQUE_USED} , No of cheque stop = ${postData?.[0]?.NO_CHEQUE_STOP} , No of cheque surrender = ${postData?.[0]?.NO_CHEQUE_SURRENDER} , No of unused cheque =  ${postData?.[0]?.NO_OF_CHEQUE_UNUSED} `,
              },
            };
          }
        } else if (!field?.value) {
          formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: false });
          return {
            ACCT_NM: { value: "" },
            ACCT_BAL: { value: "" },
            CHEQUE_FROM: { value: "" },
            CHEQUE_TO: { value: "" },
            SERVICE_TAX: { value: "" },
            LEAF_ARR: { value: "" },
            GST_AMOUNT: { value: "" },
            TOOLBAR_DTL: { value: "" },
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
      name: "ACCT_NM",
      // sequence: 1,
      label: "Account Name",
      placeholder: "Account Name",
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
        componentType: "amountField",
      },
      name: "ACCT_BAL",
      label: "Balance",
      placeholder: "Enter no of Cheque book",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      isReadOnly: true,
      // enableDefaultOption: true,

      validate: (currentField, value) => {
        if (currentField?.value) {
          return;
        }
      },
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
      name: "CHEQUE_FROM",
      label: "From Cheque No.",
      placeholder: "From Cheque No.",
      type: "text",
      isReadOnly: true,
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
      name: "LEAF_ARR",
      label: "No. of Cheque(s)",
      placeholder: "Enter no of Cheque book",
      type: "text",
      isFieldFocused: false,
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
      validate: (currentField, value) => {
        if (currentField?.value) {
          return;
        }
      },
      dependentFields: [
        "CHEQUE_FROM",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "CHEQUE_TOTAL",
        "NEW_LEAF_ARR",
      ],
      disableCaching: true,
      options: async (dependentValue, formState, _, authState) => {
        let newDD = dependentValue?.NEW_LEAF_ARR?.value;
        if (newDD) {
          newDD = newDD.split(",").map((item) => ({
            label: item,
            value: item,
          }));
          return newDD;
        }
        return [];
      },
      _optionsKey: "getChequebookDataDD",

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value) {
          let Apireq = {
            COMP_CD: auth.companyID,
            BRANCH_CD: dependentFieldsValues.BRANCH_CD.value,
            ACCT_TYPE: dependentFieldsValues.ACCT_TYPE.value,
            ACCT_CD: dependentFieldsValues.ACCT_CD.value,
            NO_OF_LEAVES: field.value,
            ENT_COMP: auth.companyID,
            ENT_BRANCH: dependentFieldsValues.BRANCH_CD.value,
            SYS_DATE: format(
              parse(auth?.workingDate, "dd/MM/yyyy", new Date()),
              "dd-MMM-yyyy"
            ).toUpperCase(),
          };
          let postdata = await API.chequebookCharge(Apireq);

          return {
            SERVECE_C_FLAG: {
              value: postdata?.[0]?.FLAG_ENABLE_DISABLE ?? "",
            },
            ROUND_OFF_FLAG: {
              value: postdata?.[0]?.GST_ROUND ?? "",
            },
            GST: {
              value: postdata?.[0]?.TAX_RATE ?? "",
            },
            SERVICE_TAX: {
              value: postdata?.[0]?.SERVICE_CHRG,
              isFieldFocused: true,
            },
            GST_AMOUNT: {
              value: postdata[0]?.GST_AMT ?? "",
            },
            CHEQUE_TO: {
              value:
                parseInt(dependentFieldsValues?.CHEQUE_FROM?.value) +
                  parseInt(field?.value) -
                  1 ?? "",
            },
          };
        }
        return {};
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CHEQUE_TO",
      label: "To Cheque No.",
      placeholder: "To Cheque No.",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Account no. is required."] }],
      // },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_TOTAL",
      label: "No of ChequeBooks",
      placeholder: "Enter no of Cheque book",
      type: "text",
      defaultValue: "1",
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          return true;
        },
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value > 1) {
          formState.setDataOnFieldChange("CHEQUE_TOTAL", {
            CHEQUE_TOTAL: true,
          });
        }
        return {};
      },
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
        componentType: "amountField",
      },
      name: "SERVICE_TAX",
      label: "Service Charge",
      placeholder: "Service Charge",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
      dependentFields: ["SERVECE_C_FLAG", "GST", "ROUND_OFF_FLAG"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.SERVECE_C_FLAG?.value === "N") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: (
        field,
        __,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value) {
          return {
            GST_AMOUNT: {
              value:
                dependentFieldsValues?.ROUND_OFF_FLAG?.value === "3"
                  ? Math.floor(
                      (parseInt(field?.value) *
                        parseInt(dependentFieldsValues?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentFieldsValues?.ROUND_OFF_FLAG?.value === "2"
                  ? Math.ceil(
                      (parseInt(field?.value) *
                        parseInt(dependentFieldsValues?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentFieldsValues?.ROUND_OFF_FLAG?.value === "1"
                  ? Math.round(
                      (parseInt(field?.value) *
                        parseInt(dependentFieldsValues?.GST?.value)) /
                        100
                    ) ?? ""
                  : (parseInt(field?.value) *
                      parseInt(dependentFieldsValues?.GST?.value)) /
                      100 ?? "",
            },
          };
        }
        return {};
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "GST_AMOUNT",
      label: "GST-Amount",
      placeholder: "GST-AMOUNT",
      type: "text",
      isReadOnly: true,
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
      name: "PAYABLE_AT_PAR",
      label: "Payable At PAR",
      placeholder: '"Payable At PAR',
      defaultValue: "Y",
      options: () => {
        return [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ];
      },
      _optionsKey: "PAYABLE_AT_PAR",
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
        componentType: "autocomplete",
      },
      name: "CHARACTERISTICS",
      // sequence: 4,
      label: "Characteristics",
      placeholder: "Characteristics",
      type: "text",
      defaultValue: "B",
      options: () => {
        return [
          { value: "B", label: "Bearer" },
          { value: "O", label: "Order" },
        ];
      },
      _optionsKey: "CHARACTERISTICS",
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
      name: "REQUISITION_DT",
      // sequence: 9,
      label: "Requisition Date",
      isReadOnly: true,
      maxDate: new Date(),
      placeholder: "",
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
        componentType: "Remark",
      },
      name: "REMARKS",
      // sequence: 10,
      label: "Remark",
      placeholder: "Enter remark",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "JOINT_NAME_1",
      label: "Joint Account Name",
      type: "text",
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
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "JOINT_NAME_2",
      label: "Joint Account Name",
      type: "text",
      shouldExclude(fieldData) {
        if (fieldData?.value) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "SR_CD",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TOOLBAR_DTL",
      label: "",

      isReadOnly: true,
      textFieldStyle: {
        background: "var(--theme-color5)",
        minHeight: "40px !important",
        fontSize: "15px",
        color: "white",
        boxShadow:
          " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        marginTop: "0px !important",
      },
      shouldExclude(fieldData) {
        if (fieldData?.value) {
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
        componentType: "hidden",
      },
      name: "SERVECE_C_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "GST",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ROUND_OFF_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "AUTO_CHQBK_FLAG",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "SR_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "NEW_LEAF_ARR",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "AUTO_CHQBK_PRINT_FLAG",
    },
  ],
};
