import { GeneralAPI } from "registry/fns/functions";
import { utilFunction, greaterThanDate } from "@acuteinfo/common-base";
import * as API from "./api";
import { t } from "i18next";
import { isValid } from "date-fns";

export const ChequeBookEntryMetaData = {
  form: {
    name: "Cheque-book-entry",
    label: "ChequeBookIssue",
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
        validationRun: "onChange",
        postValidationSetCrossFieldValues: (field, formState) => {
          if (field.value) {
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
              NEW_LEAF_ARR: { value: "" },
            };
          } else if (!field.value) {
            formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: false });
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
              NEW_LEAF_ARR: { value: "" },
            };
          }
        },

        runPostValidationHookAlways: true,
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 2,
          xl: 2,
        },
      },
      accountTypeMetadata: {
        validationRun: "onChange",
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 2,
          xl: 2,
        },
        isFieldFocused: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "TRN/045",
          });
        },
        _optionsKey: "securityDropDownListType",
        postValidationSetCrossFieldValues: (field, formState) => {
          formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: false });

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
            NEW_LEAF_ARR: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        // disableCaching: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        render: {
          componentType: "textField",
        },

        validate: (columnValue) => {
          let regex = /^[^!&]*$/;
          if (!regex.test(columnValue.value)) {
            return "Special Characters (!, &) not Allowed";
          }
          return "";
        },
        AlwaysRunPostValidationSetCrossFieldValues: {
          alwaysRun: true,
          touchAndValidate: false,
        },
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
            formState.setDataOnFieldChange("DTL_TAB", {
              DTL_TAB:
                postData.some((item) => item["O_STATUS"] === "0") ?? false,
            });

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.length; i++) {
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "ValidationFailed",
                  message: postData[i]?.O_MESSAGE,
                  icon: "ERROR",
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "RiskCategoryAlert",
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                  icon: "INFO",
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "HNIAlert",
                    message: postData[i]?.O_MESSAGE,
                    icon: "INFO",
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
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        field?.value,
                        dependentValue?.ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },

              CHEQUE_TOTAL: {
                value: "",
                isFieldFocused: returnVal !== "",
              },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
              ACCT_BAL: {
                value: returnVal?.ACCT_BAL ?? "",
              },
              CHEQUE_FROM: {
                value: returnVal?.CHEQUE_FROM ?? "",
                isFieldFocused: returnVal.PER_CHQ_ALLOW === "N",
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
              PER_CHQ_ALLOW: {
                value: returnVal?.PER_CHQ_ALLOW ?? "",
              },
              TRAN_DT: {
                value: authState?.workingDate ?? "",
              },

              TOOLBAR_DTL: {
                value:
                  returnVal !== ""
                    ? `${t("NoOfchequebookIssued")} = ${
                        returnVal?.NO_CHEQUEBOOK_ISSUE
                      } \u00A0\u00A0\u00A0\u00A0 ${t("TotalChequeIssued")} = ${
                        returnVal?.TOTAL_NO_CHEQUE_ISSUED
                      } \u00A0\u00A0\u00A0\u00A0 ${t("NoOfChequeUsed")} = ${
                        returnVal?.NO_CHEQUE_USED
                      } \u00A0\u00A0\u00A0\u00A0 ${t("NoOfChequeStop")} = ${
                        returnVal?.NO_CHEQUE_STOP
                      } \u00A0\u00A0\u00A0\u00A0 ${t(
                        "NoOfChequeSurrender"
                      )} = ${
                        returnVal?.NO_CHEQUE_SURRENDER
                      } \u00A0\u00A0\u00A0\u00A0 ${t("NoOfUnusedCheque")} = ${
                        returnVal?.NO_OF_CHEQUE_UNUSED
                      }`
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
              NEW_LEAF_ARR: { value: "" },
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
      label: "AccountName",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
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
      dependentFields: ["AMOUNT", "NO_OF_CHQBK"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields, formState) => {
        if (
          Number(dependentFields.AMOUNT.value) *
            Number(dependentFields.NO_OF_CHQBK.value) >
          Number(currentField.value)
        ) {
          return t("BalanceIsLesThanServicecharge");
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
      label: "FromChequeNo",
      required: true,
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
        },
      },
      dependentFields: ["PER_CHQ_ALLOW"],

      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.PER_CHQ_ALLOW?.value === "N") {
          return false;
        }
        return true;
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
        componentType: "autocomplete",
      },
      name: "CHEQUE_TOTAL",
      label: "NoOfCheques",
      placeholder: "SelectNoOfChequeBook",
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
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      dependentFields: [
        "CHEQUE_FROM",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "NEW_LEAF_ARR",
        "PER_CHQ_ALLOW",
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
        if (field.value && dependentFieldsValues.ACCT_CD.value) {
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
            AMOUNT: {
              value: postdata?.[0]?.SERVICE_CHRG ?? "",
            },

            SERVICE_TAX: {
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
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.PER_CHQ_ALLOW?.value === "N") {
          return true;
        } else {
          return false;
        }
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_TOTALS",
      label: "NoOfCheques",
      placeholder: "SelectNoOfChequeBook",
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
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      dependentFields: [
        "CHEQUE_FROM",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "PER_CHQ_ALLOW",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value && dependentFieldsValues.ACCT_CD.value) {
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
            AMOUNT: {
              value: postdata?.[0]?.SERVICE_CHRG ?? "",
            },

            SERVICE_TAX: {
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
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.PER_CHQ_ALLOW?.value === "N") {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CHEQUE_TO",
      label: "ToChequeNo",
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
          background: "var(--theme-color7)",
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
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
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "ServiceCharge",
      placeholder: "ServiceCharge",
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
      dependentFields: ["SERVICE_C_FLAG", "ROUND_OFF_FLAG", "GST"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.SERVICE_C_FLAG?.value === "N") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        if (field.value) {
          return {
            SERVICE_TAX: {
              value:
                dependentFields?.ROUND_OFF_FLAG?.value === "3"
                  ? Math.floor(
                      (parseInt(field?.value) *
                        parseInt(dependentFields?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentFields?.ROUND_OFF_FLAG?.value === "2"
                  ? Math.ceil(
                      (parseInt(field?.value) *
                        parseInt(dependentFields?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentFields?.ROUND_OFF_FLAG?.value === "1"
                  ? Math.round(
                      (parseInt(field?.value) *
                        parseInt(dependentFields?.GST?.value)) /
                        100
                    ) ?? ""
                  : (parseInt(field?.value) *
                      parseInt(dependentFields?.GST?.value)) /
                      100 ?? "",
            },
          };
        } else if (!field.value) {
          return {
            SERVICE_TAX: { value: "" },
          };
        }
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_TAX",
      label: "GSTAmount",
      FormatProps: {
        allowNegative: false,
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
        componentType: "numberFormat",
      },
      name: "NO_OF_CHQBK",
      label: "NoOfChequeBooks",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
        },
      },
      defaultValue: "1",
      FormatProps: {
        allowNegative: false,
        isAllowed: (values) => {
          if (values?.value?.length > 2 || values?.value === "-") {
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
      dependentFields: ["PER_CHQ_ALLOW"],
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.PER_CHQ_ALLOW?.value === "N") {
          return true;
        } else {
          return false;
        }
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "PAYABLE_AT_PAR",
      label: "PayableAtPAR",
      placeholder: "PayableAtPAR",
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
      dependentFields: ["PER_CHQ_ALLOW"],
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.PER_CHQ_ALLOW?.value === "N") {
          return true;
        } else {
          return false;
        }
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

      dependentFields: ["PER_CHQ_ALLOW"],
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.PER_CHQ_ALLOW?.value === "N") {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REQUISITION_DT",
      label: "RequisitionDate",
      isMaxWorkingDate: true,
      isWorkingDate: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "ThisFieldisrequired";
        } else if (
          greaterThanDate(value?.value, value?._maxDt, {
            ignoreTime: true,
          })
        ) {
          return t("RequistionDtShouldBeLessThanOrEqualWorkingDt");
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
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "EnterRemarks",
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
      name: "TOTAL_AMOUNT",
      label: "TotalServiceCharge",
      isReadOnly: true,
      dependentFields: ["AMOUNT", "NO_OF_CHQBK"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.AMOUNT?.value) *
          Number(dependentFields?.NO_OF_CHQBK?.value);

        return value ?? "--";
      },
      shouldExclude(fieldData, dependentFields) {
        if (Number(dependentFields?.NO_OF_CHQBK?.value) > 1) {
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
      name: "TOTAL_SEVICE_TAX",
      label: "TotalGSTAmount",
      isReadOnly: true,
      dependentFields: ["SERVICE_TAX", "NO_OF_CHQBK"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.SERVICE_TAX?.value) *
          Number(dependentFields?.NO_OF_CHQBK?.value);

        return value ?? "--";
      },
      shouldExclude(fieldData, dependentFields) {
        if (Number(dependentFields?.NO_OF_CHQBK?.value) > 1) {
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
      label: "JointAccountName1",
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
      label: "JointAccountName2",
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
          fontSize: "15px",
          textAlign: "center",
          py: "0px !important",
          "&.Mui-disabled": {
            WebkitTextFillColor: "#fff",
          },
        },
        "& .MuiInputBase-root": {
          mt: "0px !important",
          overflow: "hidden",
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
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
      name: "SR_CD",
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
      name: "NEW_LEAF_ARR",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PER_CHQ_ALLOW",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "STATUS",
    },
  ],
};
