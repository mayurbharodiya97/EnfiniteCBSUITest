import { GeneralAPI } from "registry/fns/functions";
import { utilFunction } from "components/utils";
import * as API from "./api";

export const ChequeBookEntryMetaData = {
  form: {
    name: "Cheque-book-entry",
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
          spacing: 1.5,
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
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        postValidationSetCrossFieldValues: async () => {
          return {
            ACCT_TYPE: { value: "" },
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
            ACCT_BAL: { value: "" },
            CHEQUE_FROM: { value: "" },
            CHEQUE_TO: { value: "" },
            SERVICE_TAX: { value: "" },
            GST: { value: "" },
            CHEQUE_TOTAL: { value: "" },
            AMOUNT: { value: "" },
            TOOLBAR_DTL: { value: "" },
            SR_CD: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        isFieldFocused: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "ETRN/045",
          });
        },
        _optionsKey: "securityDropDownListType",
        postValidationSetCrossFieldValues: async () => {
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
            ACCT_BAL: { value: "" },
            CHEQUE_FROM: { value: "" },
            CHEQUE_TO: { value: "" },
            SERVICE_TAX: { value: "" },
            GST: { value: "" },
            CHEQUE_TOTAL: { value: "" },
            AMOUNT: { value: "" },
            TOOLBAR_DTL: { value: "" },
            SR_CD: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        // disableCaching: true,
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          if (
            field?.value &&
            dependentValue?.BRANCH_CD?.value &&
            dependentValue?.ACCT_TYPE?.value
          ) {
            let otherAPIRequestPara = {
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              SCREEN_REF: "ETRN/045",
            };

            let postData = await API.getChequebookData({ otherAPIRequestPara });
            postData = postData.sort(
              (a, b) => parseInt(b.O_STATUS) - parseInt(a.O_STATUS)
            );

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData.length; i++) {
              formState.setDataOnFieldChange("DTL_TAB", {
                DTL_TAB: postData[i]?.O_STATUS === "0" ? true : false,
              });

              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Account Validation Failed",
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Risk Category Alert",
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
                    messageTitle: "HNI Alert",
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              ACCT_CD: {
                value:
                  returnVal !== ""
                    ? field?.value.padStart(6, "0")?.padEnd(20, " ")
                    : "",
                ignoreUpdate: true,
              },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
              ACCT_BAL: {
                value: returnVal?.ACCT_BAL ?? "",
              },
              CHEQUE_FROM: {
                value: returnVal?.CHEQUE_FROM ?? "",
              },
              NEW_LEAF_ARR: {
                value: returnVal?.LEAF_ARR ?? "",
              },
              AUTO_CHQBK_FLAG: {
                value: returnVal?.AUTO_CHQBK_FLAG ?? "",
              },
              JOINT_NAME_1: {
                value: returnVal?.JOINT_NAME_1 ?? "",
              },
              JOINT_NAME_2: {
                value: returnVal?.JOINT_NAME_2 ?? "",
              },
              SR_CD: {
                value: returnVal?.SR_CD ?? "",
              },
              TOOLBAR_DTL: {
                value:
                  returnVal !== ""
                    ? `No. of chequebook issued = ${returnVal?.NO_CHEQUEBOOK_ISSUE} \u00A0\u00A0\u00A0\u00A0 Total cheque issued = ${returnVal?.TOTAL_NO_CHEQUE_ISSUED} \u00A0\u00A0\u00A0\u00A0 No. of cheque used = ${returnVal?.NO_CHEQUE_USED} \u00A0\u00A0\u00A0\u00A0 No. of cheque stop = ${returnVal?.NO_CHEQUE_STOP} \u00A0\u00A0\u00A0\u00A0 No. of cheque surrender = ${returnVal?.NO_CHEQUE_SURRENDER} \u00A0\u00A0\u00A0\u00A0 No. of unused cheque = ${returnVal?.NO_OF_CHEQUE_UNUSED}`
                    : "",
              },
            };
          } else if (!field?.value) {
            formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: false });
            return {
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
              CHEQUE_FROM: { value: "" },
              CHEQUE_TO: { value: "" },
              SERVICE_TAX: { value: "" },
              CHEQUE_TOTAL: { value: "" },
              AMOUNT: { value: "" },
              TOOLBAR_DTL: { value: "" },
              JOINT_NAME_1: { value: "" },
              JOINT_NAME_2: { value: "" },
            };
          }

          return {};
        },
        runPostValidationHookAlways: true,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
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
      FormatProps: {
        allowNegative: true,
      },
      isReadOnly: true,
      dependentFields: ["SERVICE_TAX", "CHEQUE_BK_TOTAL"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields, formState) => {
        if (
          Number(dependentFields.SERVICE_TAX.value) *
            Number(dependentFields.CHEQUE_BK_TOTAL.value) >
          Number(currentField.value)
        ) {
          return "balance is less than service-charge";
        }
        return "";
      },
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
        componentType: "textField",
      },
      name: "CHEQUE_FROM",
      label: "From Cheque No.",
      required: true,
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
          background: "var(--theme-color7)",
        },
      },
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
        componentType: "autocomplete",
      },
      name: "CHEQUE_TOTAL",
      label: "No. of Cheque(s)",
      placeholder: "Enter no of Cheque book",
      required: true,
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
        },
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["No. of cheque is required."] }],
      },
      dependentFields: [
        "CHEQUE_FROM",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
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
            BRANCH_CD: dependentFieldsValues.BRANCH_CD.value,
            ACCT_TYPE: dependentFieldsValues.ACCT_TYPE.value,
            ACCT_CD: dependentFieldsValues.ACCT_CD.value,
            NO_OF_LEAVES: field.value,
          };
          let postdata = await API.chequebookCharge(Apireq);

          return {
            SERVICE_C_FLAG: {
              value: postdata?.[0]?.FLAG_ENABLE_DISABLE ?? "",
            },
            ROUND_OFF_FLAG: {
              value: postdata?.[0]?.GST_ROUND ?? "",
            },
            GST: {
              value: postdata?.[0]?.TAX_RATE ?? "",
            },
            SERVICE_TAX: {
              value: postdata?.[0]?.SERVICE_CHRG ?? "",
            },

            AMOUNT: {
              value: postdata?.[0]?.GST_AMT,
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
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
          background: "var(--theme-color7)",
        },
      },
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["To cheque no. is required."] }],
      // },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_TAX",
      label: "Service Charge",
      placeholder: "Service Charge",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
      FormatProps: {
        allowNegative: false,
      },
      dependentFields: ["SERVICE_C_FLAG"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.SERVICE_C_FLAG?.value === "N") {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "GST-Amount",
      type: "text",
      isReadOnly: true,
      dependentFields: ["SERVICE_TAX", "GST", "ROUND_OFF_FLAG"],

      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          dependentFields?.ROUND_OFF_FLAG?.value === "3"
            ? Math.floor(
                (parseInt(dependentFields?.SERVICE_TAX?.value) *
                  parseInt(dependentFields?.GST?.value)) /
                  100
              ) ?? ""
            : dependentFields?.ROUND_OFF_FLAG?.value === "2"
            ? Math.ceil(
                (parseInt(dependentFields?.SERVICE_TAX?.value) *
                  parseInt(dependentFields?.GST?.value)) /
                  100
              ) ?? ""
            : dependentFields?.ROUND_OFF_FLAG?.value === "1"
            ? Math.round(
                (parseInt(dependentFields?.SERVICE_TAX?.value) *
                  parseInt(dependentFields?.GST?.value)) /
                  100
              ) ?? ""
            : (parseInt(dependentFields?.SERVICE_TAX?.value) *
                parseInt(dependentFields?.GST?.value)) /
                100 ?? "";

        return value ?? "--";
      },

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
        componentType: "numberFormat",
      },
      name: "CHEQUE_BK_TOTAL",
      label: "No of ChequeBooks",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
        },
      },
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
        componentType: "select",
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
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "CHARACTERISTICS",
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
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REQUISITION_DT",
      label: "Requisition Date",
      isMaxWorkingDate: true,
      isWorkingDate: true,
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
        componentType: "Remark",
      },
      name: "REMARKS",
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
        componentType: "amountField",
      },
      name: "TOTAL_SEVICE_TAX",
      label: "Total Service Charge",
      isReadOnly: true,
      dependentFields: ["SERVICE_TAX", "CHEQUE_BK_TOTAL"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.SERVICE_TAX?.value) *
          Number(dependentFields?.CHEQUE_BK_TOTAL?.value);

        return value ?? "--";
      },
      shouldExclude(fieldData, dependentFields) {
        if (Number(dependentFields?.CHEQUE_BK_TOTAL?.value) > 1) {
          return false;
        } else {
          return true;
        }
      },
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
      name: "TOTAL_AMOUNT",
      label: "Total GST-Amount",
      isReadOnly: true,
      dependentFields: ["AMOUNT", "CHEQUE_BK_TOTAL"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.AMOUNT?.value) *
          Number(dependentFields?.CHEQUE_BK_TOTAL?.value);

        return value ?? "--";
      },
      shouldExclude(fieldData, dependentFields) {
        if (Number(dependentFields?.CHEQUE_BK_TOTAL?.value) > 1) {
          return false;
        } else {
          return true;
        }
      },
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
        componentType: "textField",
      },
      name: "JOINT_NAME_1",
      label: "Joint Account Name - 1",
      isReadOnly: true,
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
      name: "JOINT_NAME_2",
      label: "Joint Account Name - 2",
      isReadOnly: true,
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
      name: "TOOLBAR_DTL",
      label: "",
      isReadOnly: true,
      textFieldStyle: {
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          minHeight: "35px !important",
          fontSize: "17px",
          color: "white",
          textAlign: "center",
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          paddingY: "0px !important",
          animation: "5s anim-popoutin ease ",
        },
        "& .MuiInputBase-root": {
          marginTop: " 0px !important",
          overflow: "hidden",
        },
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
      name: "SERVICE_C_FLAG",
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
  ],
};
