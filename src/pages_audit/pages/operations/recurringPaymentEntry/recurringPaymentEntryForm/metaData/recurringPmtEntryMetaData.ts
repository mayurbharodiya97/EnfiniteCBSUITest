import { GeneralAPI } from "registry/fns/functions";
import * as API from "../../api";
import { utilFunction } from "components/utils";
import { t } from "i18next";

const resetFields = {
  ACCT_NM: {
    value: "",
  },
  CATEGORY_NM: {
    value: "",
  },
  INST_RS: {
    value: "",
  },
  DUE_AMT: {
    value: "",
  },
  DUE_DATE: {
    value: "",
  },
  TRAN_BAL: {
    value: "",
  },
  CR_AMT: {
    value: "",
  },
  DEPOSITED_INST: {
    value: "",
  },
  CR_INT_AMT: {
    value: "",
  },
  TOTAL: {
    value: "",
  },
  NO_OF_DAYS: {
    value: "",
  },
  LST_INT_COMPUTE_DT: {
    value: "",
  },
  PROV_INT_AMT: {
    value: "",
  },
  LEAN_AMT: {
    value: "",
  },
  DATEFROM: {
    value: "",
  },
  INT_TO_DT: {
    value: "",
  },
  INT_RATE: {
    value: "",
  },
  INT_AMOUNT: {
    value: "",
  },
  LIABLE: {
    value: "",
  },
  TDS_TILL_AMT: {
    value: "",
  },
  AFT_MATURE_INT: {
    value: "",
  },
  CUSTOMER_ID: {
    value: "",
  },
  FIN_INT_AMT: {
    value: "",
  },
  FIN_TDS: {
    value: "",
  },
  REC_PENALTY_AMT: {
    value: "",
  },
  PENAL_RATE: {
    value: "",
  },
  PAN_NO: {
    value: "",
  },
  TDS_DEDUCT_FLAG: {
    value: "",
  },
  TDS_LIMIT_NEW: {
    value: "",
  },
  TDS_RATE: {
    value: "",
  },
  TDS_SURCHARGE: {
    value: "",
  },
  CASH_AMT: {
    value: "",
  },
  TDS_AMT: {
    value: "",
  },
  REC_REMARKS: {
    value: "",
  },
  TRF_AMT: {
    value: "",
  },
  TOKEN_NO: {
    value: "",
  },
  FORM_60: {
    value: "",
  },
  TYPE_CD: {
    value: "",
  },
  PAYSLIP: {
    value: false,
  },
  RTGS_NEFT: {
    value: false,
  },
};

export const RecurringPaymentEntryFormMetaData = {
  form: {
    name: "RecurringPaymentEntry",
    label: "",
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
      rateOfInt: {
        fullWidth: true,
      },
      amountField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      checkbox: {
        fullWidth: true,
      },
      formbutton: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      autocomplete: {
        fullWidth: true,
      },
    },
  },

  fields: [
    {
      render: {
        componentType: "divider",
      },
      label: "AccountInformation",
      name: "AccountInformation",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: { componentType: "_accountNumber" },
      __NEW__: {
        branchCodeMetadata: {
          name: "BRANCH_CD",
          runPostValidationHookAlways: true,
          validationRun: "onChange",
          isFieldFocused: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              ...resetFields,
              ACCT_TYPE: {
                value: "",
              },
              ACCT_CD: {
                value: "",
              },
            };
          },
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              formState?.entryScreenFlagDataForm?.INT_BRANCH_TRN_ALLOW === "N"
            ) {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 4, md: 2.2, lg: 2, xl: 2 },
        },
        accountTypeMetadata: {
          name: "ACCT_TYPE",
          validationRun: "onChange",
          dependentFields: ["BRANCH_CD"],
          disableCaching: true,
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              ...resetFields,
              ACCT_CD: {
                value: "",
              },
            };
          },
          options: (dependentValue, formState, _, authState) => {
            return GeneralAPI.get_Account_Type({
              COMP_CD: authState?.companyID,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              USER_NAME: authState?.user?.id,
              DOC_CD: "RECDRTYPE",
            });
          },
          _optionsKey: "getDebitAccountType",
          GridProps: { xs: 12, sm: 4, md: 2.2, lg: 2, xl: 2 },
        },
        accountCodeMetadata: {
          name: "ACCT_CD",
          autoComplete: "off",
          maxLength: 20,
          dependentFields: ["ACCT_TYPE", "BRANCH_CD", "INT_RATE"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (
              currentField?.value &&
              dependentFieldsValues?.ACCT_TYPE?.value &&
              dependentFieldsValues?.BRANCH_CD?.value
            ) {
              let reqParameters = {
                BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value,
                COMP_CD: authState?.companyID,
                ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value,
                ACCT_CD: utilFunction.getPadAccountNumber(
                  currentField?.value,
                  dependentFieldsValues?.ACCT_TYPE?.optionData
                ),
                SCREEN_REF: "TRN/053",
              };
              formState.handleDisableButton(true);
              const postData = await API.getRecurValidAcctDtl(reqParameters);

              if (postData?.status === "999") {
                let btnName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: postData?.messageDetails ?? "Somethingwenttowrong",
                });
                if (btnName === "Ok") {
                  formState.handleDisableButton(false);
                  return {
                    ACCT_CD: {
                      value: "",
                      ignoreUpdate: true,
                      isFieldFocused: true,
                    },
                    ACCT_NM: { value: "" },
                  };
                }
              }

              let btn99,
                returnVal,
                reqParam,
                getRecurValidAcctDtl,
                paySimIntValue;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.O_STATUS === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "ValidationFailed",
                    message: postData[i]?.O_MESSAGE ?? "",
                  });

                  if (btnName === "Ok") {
                    formState.handleDisableButton(false);
                    if (postData[i]?.SHOW_LIEN_DTL === "Y") {
                      formState.setDataOnFieldChange("SHOW_LIEN", {
                        COMP_CD: authState?.companyID,
                        ACCT_CD: utilFunction.getPadAccountNumber(
                          currentField?.value,
                          dependentFieldsValues?.ACCT_TYPE?.optionData
                        ),
                        ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value,
                        BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value,
                      });
                    }
                  }

                  returnVal = "";
                } else if (postData[i]?.O_STATUS === "9") {
                  if (btn99 !== "No") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: "Alert",
                      message: postData[i]?.O_MESSAGE ?? "",
                    });
                  }

                  returnVal = "";
                } else if (postData[i]?.O_STATUS === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Confirmation",
                    message: postData[i]?.O_MESSAGE ?? "",
                    buttonNames: ["Yes", "No"],
                  });

                  btn99 = btnName;

                  if (btnName === "Yes") {
                    paySimIntValue = {
                      PAY_SIM_INT:
                        postData?.[i]?.PAY_SIM_INT === "X"
                          ? "Y"
                          : postData?.[i]?.PAY_SIM_INT,
                    };
                  }
                  if (btnName === "No") {
                    paySimIntValue = {
                      PAY_SIM_INT:
                        postData?.[i]?.PAY_SIM_INT === "X"
                          ? "N"
                          : postData?.[i]?.PAY_SIM_INT,
                    };
                  }
                } else if (postData[i]?.O_STATUS === "0") {
                  getRecurValidAcctDtl = postData[0];
                  formState.handleDisableButton(true);
                  reqParam = {
                    COMP_CD: authState?.companyID,
                    INT_RATE: postData[i]?.INT_RATE,
                    BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value,
                    ACCT_CD: utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldsValues?.ACCT_TYPE?.optionData
                    ),
                    ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value,
                    SCREEN_REF: "TRN/053",
                    PAY_SIM_INT:
                      paySimIntValue?.PAY_SIM_INT === "Y"
                        ? "Y"
                        : paySimIntValue?.PAY_SIM_INT === "N"
                        ? "N"
                        : postData?.[i]?.PAY_SIM_INT,
                  };
                  formState.handleDisableButton(true);
                  let getRecurAcctAllData = await API.getRecurAcctData(
                    reqParam
                  );

                  if (getRecurAcctAllData?.status === "999") {
                    let btnName = await formState.MessageBox({
                      messageTitle: "ValidationFailed",
                      message:
                        getRecurAcctAllData?.messageDetails ??
                        "Somethingwenttowrong",
                      buttonNames: ["Ok"],
                    });
                    if (btnName === "Ok") {
                      formState.handleDisableButton(false);
                      return {
                        ACCT_CD: { value: "" },
                        ACCT_NM: { value: "" },
                      };
                    }
                  } else {
                    returnVal = getRecurAcctAllData?.[0];
                  }

                  formState.setDataOnFieldChange("GET_ACCT_DATA", {
                    ...getRecurAcctAllData?.[0],
                    PREMATURE: getRecurValidAcctDtl?.PREMATURE,
                  });
                }
              }
              btn99 = 0;
              formState.handleDisableButton(false);
              return {
                ACCT_CD:
                  returnVal !== ""
                    ? {
                        value: utilFunction.getPadAccountNumber(
                          currentField?.value,
                          dependentFieldsValues?.ACCT_TYPE?.optionData
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
                CATEGORY_NM: {
                  value:
                    String(returnVal?.CATEG_CD)?.trim() +
                      " " +
                      returnVal?.CATEGORY_NM ?? "",
                },
                INST_RS: {
                  value: returnVal?.INST_RS ?? "",
                },
                DUE_AMT: {
                  value: returnVal?.DUE_AMT ?? "",
                },
                DUE_DATE: {
                  value: returnVal?.DUE_DATE ?? "",
                },
                TRAN_BAL: {
                  value: returnVal?.TRAN_BAL ?? "",
                },
                CR_AMT: {
                  value: returnVal?.CR_AMT ?? "",
                },
                DEPOSITED_INST: {
                  value: returnVal?.DEPOSITED_INST ?? "",
                },
                CR_INT_AMT: {
                  value: returnVal?.CR_INT_AMT ?? "",
                },
                TOTAL: {
                  value: returnVal?.TOTAL ?? "",
                },
                NO_OF_DAYS: {
                  value: returnVal?.NO_OF_DAYS ?? "",
                },
                LST_INT_COMPUTE_DT: {
                  value: returnVal?.LST_INT_COMPUTE_DT ?? "",
                },
                PROV_INT_AMT: {
                  value: returnVal?.PROV_INT_AMT ?? "",
                },
                LEAN_AMT: {
                  value: returnVal?.LEAN_AMT ?? "",
                },
                DATEFROM: {
                  value: returnVal?.DATEFROM ?? "",
                },
                INT_FROM_DT: {
                  value: returnVal?.INT_FROM_DT ?? "",
                },
                INT_TO_DT: {
                  value: returnVal?.INT_TO_DT ?? "",
                },
                INT_RATE: {
                  value: returnVal?.INT_RATE ?? "",
                },
                INT_AMOUNT: {
                  value: returnVal?.INT_AMOUNT ?? "",
                },
                LIABLE: {
                  value: returnVal?.LIABLE ?? "",
                },
                TDS_TILL_AMT: {
                  value: returnVal?.TDS_TILL_AMT ?? "",
                },
                AFT_MATURE_INT: {
                  value: returnVal?.AFT_MATURE_INT ?? "",
                },
                CUSTOMER_ID: {
                  value: returnVal?.CUSTOMER_ID ?? "",
                },
                FIN_INT_AMT: {
                  value: returnVal?.FIN_INT_AMT ?? "",
                },
                FIN_TDS: {
                  value: returnVal?.FIN_TDS ?? "",
                },
                REC_PENALTY_AMT: {
                  value: returnVal?.REC_PENALTY_AMT ?? "",
                },
                PENAL_RATE: {
                  value: returnVal?.PENAL_RATE ?? "",
                },
                PAN_NO: {
                  value: returnVal?.PAN_NO ?? "",
                },
                TDS_DEDUCT_FLAG: {
                  value: returnVal?.TDS_DEDUCT_FLAG ?? "",
                },
                TDS_LIMIT_NEW: {
                  value: returnVal?.TDS_LIMIT_NEW ?? "",
                },
                TDS_RATE: {
                  value: returnVal?.TDS_RATE ?? "",
                },
                TDS_SURCHARGE: {
                  value: returnVal?.TDS_SURCHARGE ?? "",
                },
                TYPE_CD: {
                  value: returnVal?.TYPE_CD ?? "",
                },
                FORM_60: {
                  __NEW__: {
                    value:
                      returnVal?.FORM_60 === "Y"
                        ? "FORM 60 Submitted"
                        : returnVal?.FORM_60 === "F"
                        ? "FORM 61 Submitted"
                        : returnVal?.FORM_60 === "N"
                        ? "N"
                        : "",
                  },
                },
                PREMATURE_VAL: { value: getRecurValidAcctDtl?.PREMATURE ?? "" },
                STATUS: { value: getRecurValidAcctDtl?.STATUS ?? "" },
                CASH_AMT: {
                  value: "",
                  ignoreUpdate: true,
                },
                TDS_AMT: {
                  value: "",
                  ignoreUpdate: true,
                },
                REC_REMARKS: {
                  value: "",
                  ignoreUpdate: true,
                },
                TRF_AMT: {
                  value: "",
                  ignoreUpdate: true,
                },
                TOKEN_NO: {
                  value: "",
                  ignoreUpdate: true,
                },
                PAYSLIP: {
                  value: false,
                },
                RTGS_NEFT: {
                  value: false,
                },
              };
            } else if (!currentField?.value) {
              formState.handleDisableButton(false);
              return resetFields;
            }
            formState.handleDisableButton(false);
            return {};
          },
          runPostValidationHookAlways: true,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
          },
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 2.6, lg: 2, xl: 2 },
        },
      },
      __VIEW__: {
        branchCodeMetadata: {
          name: "BRANCH_CD",
          defaultValue: "",
          postValidationSetCrossFieldValues: () => {},
          GridProps: { xs: 12, sm: 4, md: 2.2, lg: 2, xl: 2 },
        },
        accountTypeMetadata: {
          name: "ACCT_TYPE",
          validationRun: "onChange",
          postValidationSetCrossFieldValues: () => {},
          GridProps: { xs: 12, sm: 4, md: 2.2, lg: 2, xl: 2 },
        },
        accountCodeMetadata: {
          name: "ACCT_CD",
          autoComplete: "off",
          fullWidth: true,
          postValidationSetCrossFieldValues: () => {},
          GridProps: { xs: 12, sm: 4, md: 2.6, lg: 2, xl: 2 },
        },
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "PREMATURE_VAL",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "STATUS",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "INT_FROM_DT",
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      type: "text",
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 5, lg: 3.6, xl: 3 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CATEGORY_NM",
      label: "Category",
      type: "text",
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 2.4, xl: 3 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INST_RS",
      label: "InstallmentAmount",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.25,
        lg: 3.2,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "DUE_AMT",
      label: "DueAmount",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.25,
        lg: 3.2,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "DUE_DATE",
      label: "DueDate",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 2.25, lg: 3.2, xl: 3 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Balance",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "CR_AMT",
      label: "InstallmentDepositedAmount",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3.25,
        lg: 3.2,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "DEPOSITED_INST",
      label: "DepositedInstallment",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3.25,
        lg: 3.2,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "CR_INT_AMT",
      label: "Interest",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3.25,
        lg: 3.2,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL",
      label: "Total",
      __NEW__: { isReadOnly: true },
      dependentFields: ["CR_AMT", "CR_INT_AMT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.CR_AMT?.value) +
          Number(dependentFieldsValues?.CR_INT_AMT?.value);
        return value ?? "0";
      },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "divider",
      },
      label: "InterestDetail",
      name: "TDSPayable",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "NO_OF_DAYS",
      label: "NoOfDays",
      type: "number",
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3.25, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "LST_INT_COMPUTE_DT",
      label: "LastProvisionDate",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3.25, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER1",
      GridProps: {
        xs: 0,
        sm: 3,
        md: 3.25,
        lg: 3.6,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PROV_INT_AMT",
      label: "ProvisionalAmount",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "LEAN_AMT",
      label: "LienAmount",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2.5,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "DATEFROM",
      label: "DateFrom",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 2.5, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "INT_TO_DT",
      label: "DateTo",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 2.5, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "InterestRate",
      __NEW__: {
        isReadOnly(_, dependentFieldsValues, formState) {
          if (formState?.entryScreenFlagDataForm?.RATE_DIS === "Y") {
            return true;
          } else {
            return false;
          }
        },
      },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 2.25,
        lg: 1.6,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "INT_AMOUNT",
      label: "InterestAmount",
      __NEW__: {
        isReadOnly(_, dependentFieldsValues, formState) {
          if (formState?.entryScreenFlagDataForm?.RATE_DIS === "Y") {
            return true;
          } else {
            return false;
          }
        },
      },
      GridProps: {
        xs: 12,
        sm: 2.5,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "LIABLE",
      label: "TDS",
      type: "text",
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3.25, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_TILL_AMT",
      label: "TDSAmount",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3.25,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "AFT_MATURE_INT",
      label: "AfterMatureInterest",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3.25,
        lg: 3.6,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_AMT",
      label: "CalculatedTDS",
      __NEW__: {
        isReadOnly(_, dependentFieldsValues, formState) {
          if (formState?.entryScreenFlagDataForm?.TDS_AMT_DIS === "Y") {
            return true;
          } else {
            return false;
          }
        },
      },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      type: "number",
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 3, md: 3.25, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "FIN_INT_AMT",
      label: "FinancialInterestAmount",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3.25,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "FIN_TDS",
      label: "PaidTDS",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3.25,
        lg: 3.6,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_AMOUNT",
      label: "TotalAmount",
      __NEW__: { isReadOnly: true },
      dependentFields: ["TRAN_BAL", "PROV_INT_AMT", "INT_AMOUNT", "TDS_AMT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.TRAN_BAL?.value) +
            Number(dependentFieldsValues?.PROV_INT_AMT?.value) +
            Number(dependentFieldsValues?.INT_AMOUNT?.value) -
            Number(dependentFieldsValues?.TDS_AMT?.value) || 0;
        return value ?? "0";
      },
      textFieldStyle: {
        "& .MuiInputBase-input": {
          "&.Mui-disabled": {
            color: "var(--theme-color1) !important",
            fontWeight: "bold",
            "-webkit-text-fill-color": "var(--theme-color1) !important",
          },
        },
      },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "REC_PENALTY_AMT",
      label: "PenalInterest",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 3,
        md: 2.5,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "CLOSING_ADVICE",
      label: "ClosingAdvice",
      endIcon: "CircularProgress",
      dependentFields: [
        "ACCT_TYPE",
        "ACCT_CD",
        "INT_RATE",
        "INT_AMOUNT",
        "PENAL_RATE",
        "PREMATURE_VAL",
        "BRANCH_CD",
        "REC_PENALTY_AMT",
      ],
      GridProps: { xs: 12, sm: 3, md: 2.5, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "PENAL_RATE",
      label: "PenalRate",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2.5,
        lg: 1.6,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "FORM_60",
      fullWidth: true,
      label: "",
      __NEW__: { isReadOnly: true },
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (
          currentField?.value === "N" ||
          String(currentField?.value)?.trim() === ""
        ) {
          return true;
        } else {
          return false;
        }
      },
      TypographyProps: {
        variant: "subtitle2",
        style: {
          marginTop: "33px",
          fontSize: "14px",
          width: "100%",
          textAlign: "center",
        },
      },
      GridProps: { xs: 12, sm: 3, md: 2.25, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "panCard",
      },
      name: "PAN_NO",
      label: "PAN",
      type: "text",
      required: false,
      __NEW__: { isReadOnly: true },
      schemaValidation: {},
      dependentFields: ["FORM_60"],
      shouldExclude: (currentField, dependentFieldsValues, __) => {
        if (
          dependentFieldsValues?.FORM_60?.value === "N" ||
          String(dependentFieldsValues?.FORM_60?.value)?.trim() === ""
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 2.5, md: 2.25, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "TDS_DEDUCT_FLAG",
      label: "ExplicitDeductTDS",
      type: "text",
      __NEW__: { isReadOnly: true },
      GridProps: { xs: 12, sm: 1.5, md: 2.25, lg: 2.4, xl: 3 },
    },

    {
      render: {
        componentType: "divider",
      },
      label: "PaymentDetail",
      name: "PaymentDetail",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TDS_LIMIT_NEW",
      label: "TDSLimit",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 2.5,
        md: 2.5,
        lg: 2.8,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "TDS_RATE",
      label: "TDSRate",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.6,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "TDS_SURCHARGE",
      label: "TDSSurcharge",
      __NEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.6,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REC_REMARKS",
      label: "Remarks",
      placeholder: "EnterRemarks",
      type: "text",
      autoComplete: "off",
      GridProps: { xs: 12, sm: 4.25, md: 4.25, lg: 3.6, xl: 4 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TRF_AMT",
      label: "Transfer",
      placeholder: "EnterTransferAmount",
      autoComplete: "off",
      maxLength: 15,
      dependentFields: ["TOTAL_AMOUNT", "PAYMENT_AMT", "CASH_AMT"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          Number(currentField?.value) ===
            Number(dependentFieldValues?.TOTAL_AMOUNT?.value) ||
          Number(currentField?.value) +
            Number(dependentFieldValues?.CASH_AMT?.value) ===
            Number(dependentFieldValues?.TOTAL_AMOUNT?.value)
        ) {
          return {
            PAYSLIP: {
              value: false,
              ignoreUpdate: true,
            },
            RTGS_NEFT: {
              value: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowLeadingZeros: false,
        allowNegative: false,
        isAllowed: (values) => {
          if (values?.value?.length > 15) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: {
        xs: 12,
        sm: 2.25,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER2",
      GridProps: {
        xs: 0,
        sm: 6.75,
        md: 6.75,
        lg: 7.2,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOKEN_NO",
      label: "CashPaymentTokenNumber",
      autoComplete: "off",
      maxLength: 9,
      dependentFields: ["CASH_AMT", "ACCT_TYPE", "ACCT_CD", "BRANCH_CD"],
      __NEW__: {
        isReadOnly(fieldData, dependentFieldsValues, formState) {
          if (Number(dependentFieldsValues?.CASH_AMT?.value)) {
            return false;
          } else {
            return true;
          }
        },
        FormatProps: {
          allowLeadingZeros: false,
          allowNegative: false,
          fixedDecimalScale: false,
          placeholder: "EnterCashPaymentTokenNumber",
          isAllowed: (values) => {
            if (values?.value?.length > 9) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          currentField?.value &&
          dependentFieldsValues?.ACCT_TYPE?.value &&
          dependentFieldsValues?.BRANCH_CD?.value &&
          dependentFieldsValues?.ACCT_CD?.value &&
          dependentFieldsValues?.CASH_AMT?.value
        ) {
          let reqParameters = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value,
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value,
            ACCT_CD: dependentFieldsValues?.ACCT_CD?.value,
            TOKEN_NO: currentField?.value,
            SCREEN_REF: "TRN/053",
          };
          let postData = await API.checkTokenValidate(reqParameters);

          postData = postData.sort(
            (a, b) => parseInt(b.O_STATUS) - parseInt(a.O_STATUS)
          );

          let btn99, returnVal;

          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.O_STATUS === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "ValidationFailed",
                message: postData[i]?.O_MESSAGE ?? "",
              });
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Confirmation",
                message: postData[i]?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
              });
              btn99 = btnName;
              if (btnName === "No") {
                returnVal = "";
              }
            } else if (postData[i]?.O_STATUS === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Alert",
                  message: postData[i]?.O_MESSAGE ?? "",
                });
              }
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "0") {
              if (btn99 !== "No") {
                returnVal = currentField?.value;
              } else {
                returnVal = "";
              }
            }
          }
          btn99 = 0;
          return {
            TOKEN_NO: {
              value: returnVal ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {
            TOKEN_NO: { value: "", ignoreUpdate: true },
          };
        }
        return {};
      },

      GridProps: {
        xs: 12,
        sm: 3,
        md: 3,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "CASH_AMT",
      label: "Cash",
      placeholder: "EnterCashAmount",
      dependentFields: ["TOTAL_AMOUNT", "PAYMENT_AMT", "TRF_AMT"],
      autoComplete: "off",
      maxLength: 15,
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (!currentField?.value) {
          return {
            TOKEN_NO: {
              value: "",
              ignoreUpdate: true,
            },
          };
        }
        if (
          Number(currentField?.value) ===
            Number(dependentFieldValues?.TOTAL_AMOUNT?.value) ||
          Number(currentField?.value) +
            Number(dependentFieldValues?.TRF_AMT?.value) ===
            Number(dependentFieldValues?.TOTAL_AMOUNT?.value)
        ) {
          return {
            PAYSLIP: {
              value: false,
              ignoreUpdate: true,
            },
            RTGS_NEFT: {
              value: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      FormatProps: {
        allowLeadingZeros: false,
        allowNegative: false,
        isAllowed: (values) => {
          if (values?.value?.length > 15) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: {
        xs: 12,
        sm: 2.25,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER3",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "recurringPmtConf") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        sm: 4.75,
        md: 4.75,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "PAYSLIP_NO",
      label: "payslipNumber",
      type: "text",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (formState?.screenFlag === "recurringPmtConf") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        sm: 2.375,
        md: 2.375,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "DD_AMT",
      label: "DDAmount",
      type: "text",
      dependentFields: ["PAYSLIP"],
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (
          formState?.screenFlag === "recurringPmtConf" &&
          Boolean(dependentFieldsValues?.PAYSLIP?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        sm: 2.375,
        md: 2.375,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "NEFT_AMT",
      label: "NEFTAmount",
      type: "text",
      dependentFields: ["RTGS_NEFT", "DD_AMT"],
      shouldExclude: (_, dependentFieldsValues, formState) => {
        if (
          formState?.screenFlag === "recurringPmtConf" &&
          Boolean(dependentFieldsValues?.RTGS_NEFT?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        return dependentFieldsValues?.DD_AMT?.value ?? 0;
      },
      GridProps: {
        xs: 12,
        sm: 2.375,
        md: 2.375,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: { componentType: "checkbox" },
      name: "PAYSLIP",
      label: "ByPayslipDD",
      dependentFields: [
        "RTGS_NEFT",
        "TOTAL_AMOUNT",
        "TRF_AMT",
        "CASH_AMT",
        "PAYMENT_AMT",
      ],
      __NEW__: {
        isReadOnly(fieldData, dependentFieldsValues, formState) {
          if (
            Number(dependentFieldsValues?.TOTAL_AMOUNT?.value) <= 0 ||
            Number(dependentFieldsValues?.TOTAL_AMOUNT?.value) ===
              Number(dependentFieldsValues?.TRF_AMT?.value) ||
            Number(dependentFieldsValues?.TOTAL_AMOUNT?.value) ===
              Number(dependentFieldsValues?.CASH_AMT?.value) ||
            Number(dependentFieldsValues?.TRF_AMT?.value) +
              Number(dependentFieldsValues?.CASH_AMT?.value) ===
              Number(dependentFieldsValues?.TOTAL_AMOUNT?.value)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.RTGS_NEFT?.value)) {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 6, sm: 2.5, md: 2.5, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER4",
      dependentFields: ["RTGS_NEFT"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.RTGS_NEFT?.value)) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 6, sm: 2.5, md: 2.5, lg: 1.8, xl: 1.5 },
    },

    {
      render: { componentType: "checkbox" },
      name: "RTGS_NEFT",
      label: "ByNEFT",
      dependentFields: [
        "PAYSLIP",
        "TOTAL_AMOUNT",
        "TRF_AMT",
        "CASH_AMT",
        "PAYMENT_AMT",
      ],
      __NEW__: {
        isReadOnly(_, dependentFieldsValues, __) {
          if (
            Number(dependentFieldsValues?.TOTAL_AMOUNT?.value) <= 0 ||
            Number(dependentFieldsValues?.TOTAL_AMOUNT?.value) ===
              Number(dependentFieldsValues?.TRF_AMT?.value) ||
            Number(dependentFieldsValues?.TOTAL_AMOUNT?.value) ===
              Number(dependentFieldsValues?.CASH_AMT?.value) ||
            Number(dependentFieldsValues?.TRF_AMT?.value) +
              Number(dependentFieldsValues?.CASH_AMT?.value) ===
              Number(dependentFieldsValues?.TOTAL_AMOUNT?.value)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.PAYSLIP?.value)) {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 6, sm: 2.5, md: 2.5, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER5",
      dependentFields: ["PAYSLIP"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (Boolean(dependentFieldsValues?.PAYSLIP?.value)) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 6, sm: 2.5, md: 2.5, lg: 1.8, xl: 1.5 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "PAYMENT_AMT",
      label: "PaymentAmount",
      __NEW__: { isReadOnly: true },
      dependentFields: ["TRF_AMT", "CASH_AMT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value =
          Number(dependentFieldsValues?.TRF_AMT?.value) +
          Number(dependentFieldsValues?.CASH_AMT?.value);
        return value ?? "0";
      },
      GridProps: {
        xs: 12,
        sm: 2.25,
        md: 2.25,
        lg: 2.4,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER6",
      __VIEW__: {
        shouldExclude: () => {
          return true;
        },
      },
      GridProps: { xs: 0, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "REM_NEFT_DD_AMT",
      fullWidth: true,
      label: "",
      isReadOnly: true,
      dependentFields: ["TOTAL_AMOUNT", "PAYMENT_AMT", "RTGS_NEFT", "PAYSLIP"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let diffValue =
          Number(dependentFieldsValues?.TOTAL_AMOUNT?.value ?? 0) -
          Number(dependentFieldsValues?.PAYMENT_AMT?.value ?? 0);

        if (
          Number(dependentFieldsValues?.TOTAL_AMOUNT?.value ?? 0) <
          Number(dependentFieldsValues?.PAYMENT_AMT?.value ?? 0)
        ) {
          return `${t("AmountCannotExceeded")}`;
        } else if (
          Number(dependentFieldsValues?.TOTAL_AMOUNT?.value ?? 0) ===
          Number(dependentFieldsValues?.PAYMENT_AMT?.value ?? 0)
        ) {
          return `${t(
            "NEFTandDDPaymentOptionsAreUnavailableForDiffValueAmount",
            {
              diffValue: diffValue,
            }
          )}`;
        } else {
          if (Boolean(dependentFieldsValues?.RTGS_NEFT?.value)) {
            return `${t(
              "PleaseEnterNEFTDetailForAmountDiffValueByClickingOnNext",
              {
                diffValue: diffValue,
              }
            )}`;
          } else if (Boolean(dependentFieldsValues?.PAYSLIP?.value)) {
            return `${t(
              "PleaseEnterDDDetailForAmountDiffValueByClickingOnNext",
              {
                diffValue: diffValue,
              }
            )}`;
          } else if (
            !Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
            !Boolean(dependentFieldsValues?.RTGS_NEFT?.value)
          ) {
            return `${t(
              "PleaseEnterDDorNEFTDetailForAmountDiffValueByClickingOnNext",
              {
                diffValue: diffValue,
              }
            )}`;
          }
        }
      },
      __VIEW__: {
        shouldExclude: () => {
          return true;
        },
      },
      __NEW__: {
        shouldExclude: (_, dependentFieldsValues, __) => {
          if (Boolean(dependentFieldsValues?.TOTAL_AMOUNT?.value)) {
            return false;
          } else {
            return true;
          }
        },
      },
      TypographyProps: {
        variant: "subtitle2",
        style: {
          fontSize: "14px",
          color: "var(--theme-color1) !important",
        },
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
  ],
};
