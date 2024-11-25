import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "../../api";
import { validateHOBranch } from "components/utilFunction/function";
import { t } from "i18next";

export const TransferAcctDetailFormMetadata = {
  form: {
    name: "transferAcctDetail",
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
        componentType: "spacer",
      },
      name: "SPACER1",
      GridProps: {
        xs: 12,
        sm: 12,
        md: 4.8,
        lg: 6.3,
        xl: 7.2,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CR_COMP_CD",
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_FD_AMOUNT",
      label: "TotalAmount",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      GridProps: { xs: 6, sm: 6, md: 2.4, lg: 1.9, xl: 1.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "DIFF_AMOUNT",
      label: "DiffAmount",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      dependentFields: ["TOTAL_FD_AMOUNT", "TOTAL_DR_AMOUNT"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.TOTAL_FD_AMOUNT?.value) -
          Number(dependentFields?.TOTAL_DR_AMOUNT?.value);

        return value ?? "0";
      },
      FormatProps: {
        allowNegative: true,
      },
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      GridProps: { xs: 6, sm: 6, md: 2.4, lg: 1.9, xl: 1.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_DR_AMOUNT",
      label: "Total Debit Amount",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      dependentFields: ["TRNDTLS"],
      setValueOnDependentFieldsChange: (dependentFieldState) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["TRNDTLS"])
            ? dependentFieldState?.["TRNDTLS"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.AMOUNT?.value), 0);

        return accumulatedTakeoverLoanAmount;
      },
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      GridProps: { xs: 6, sm: 6, md: 2.4, lg: 1.9, xl: 1.6 },
    },

    {
      render: {
        componentType: "arrayField",
      },
      name: "TRNDTLS",
      fixedRows: false,
      isDisplayCount: true,
      isRemoveButton: false,
      isScreenStyle: false,
      displayCountName: "Record",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      addRowFn: (data) => {
        const dataArray = Array.isArray(data?.TRNDTLS) ? data?.TRNDTLS : [];
        if (dataArray?.length > 0) {
          for (let i = 0; i < dataArray?.length; i++) {
            const item = dataArray[0];
            if (
              item.BRANCH_CD.trim() &&
              item.ACCT_TYPE.trim() &&
              item.ACCT_CD.trim() &&
              item.AMOUNT.trim()
            ) {
              return true;
            }
          }
          return {
            reason: t("fdTransferFormRequiredMsgForArrayfield"),
          };
        } else {
          return true;
        }
      },
      _fields: [
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "BRANCH_CD",
            isFieldFocused: true,
            fullWidth: true,
            runPostValidationHookAlways: true,
            validationRun: "onChange",
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              const isHOBranch = await validateHOBranch(
                currentField,
                formState?.MessageBox,
                authState
              );
              if (isHOBranch) {
                return {
                  BRANCH_CD: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: false,
                  },
                };
              }
              return {
                ACCT_TYPE: { value: "" },
                ACCT_CD: { value: "", ignoreUpdate: false },
                ACCT_NM: { value: "" },
              };
            },

            GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 },
          },
          accountTypeMetadata: {
            name: "ACCT_TYPE",
            dependentFields: ["BRANCH_CD"],
            runPostValidationHookAlways: true,
            validationRun: "onChange",
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              if (
                currentField?.value &&
                dependentFieldValues?.["TRNDTLS.BRANCH_CD"]?.value?.length === 0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: "Enter Account Branch.",
                  buttonNames: ["Ok"],
                  icon: "ERROR",
                });

                if (buttonName === "Ok") {
                  return {
                    ACCT_TYPE: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                    BRANCH_CD: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
              return {
                ACCT_CD: { value: "", ignoreUpdate: false },
                ACCT_NM: { value: "" },
              };
            },
            fullWidth: true,
            GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 },
          },
          accountCodeMetadata: {
            name: "ACCT_CD",
            dependentFields: ["BRANCH_CD", "ACCT_TYPE"],
            runPostValidationHookAlways: true,
            autoComplete: "off",
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              if (formState?.isSubmitting) return {};

              if (
                currentField.value &&
                dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.value?.length ===
                  0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: "Enter Account Type.",
                  buttonNames: ["Ok"],
                  icon: "ERROR",
                });

                if (buttonName === "Ok") {
                  return {
                    ACCT_CD: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: false,
                    },
                    ACCT_TYPE: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (
                currentField?.value &&
                dependentFieldsValues?.["TRNDTLS.BRANCH_CD"]?.value &&
                dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.value
              ) {
                const reqParameters = {
                  BRANCH_CD:
                    dependentFieldsValues?.["TRNDTLS.BRANCH_CD"]?.value,
                  COMP_CD: authState?.companyID,
                  ACCT_TYPE:
                    dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.value,
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    currentField?.value,
                    dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.optionData
                  ),
                  SCREEN_REF: "FD_DR_ACT",
                };
                let postData = await API.validateAccountAndGetDetail(
                  reqParameters
                );

                let btn99, returnVal;
                const getButtonName = async (obj) => {
                  let btnName = await formState.MessageBox(obj);
                  return { btnName, obj };
                };
                for (let i = 0; i < postData?.[0]?.MSG?.length; i++) {
                  if (postData?.[0]?.MSG?.[i]?.O_STATUS === "999") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE?.length
                        ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                        : "ValidationFailed",
                      message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                      icon: "ERROR",
                    });
                    returnVal = "";
                  } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "9") {
                    if (btn99 !== "No") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                          ?.length
                          ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                          : "Alert",
                        message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                        icon: "WARNING",
                      });
                    }
                    returnVal = postData?.[0];
                  } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "99") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE?.length
                        ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                        : "Confirmation",
                      message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                      icon: "CONFIRM",
                    });

                    btn99 = btnName;
                    if (btnName === "No") {
                      returnVal = "";
                    }
                  } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "0") {
                    if (btn99 !== "No") {
                      returnVal = postData?.[0];
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
                            dependentFieldsValues?.ACCT_TYPE?.optionData
                          ),
                          isFieldFocused: false,
                          ignoreUpdate: true,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: false,
                        },
                  ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                  },
                  TRAN_BAL: {
                    value: returnVal?.TRAN_BAL ?? "",
                  },
                  TYPE_CD: {
                    value: returnVal?.TYPE_CD ?? "",
                  },
                  CHEQUE_NO: {
                    value: returnVal?.CHEQUE_NO ?? "",
                  },
                  STATUS: {
                    value: returnVal?.STATUS ?? "",
                  },
                  AMOUNT: {
                    value: "",
                  },
                };
              } else if (!currentField?.value) {
                return {
                  ACCT_NM: { value: "" },
                  TRAN_BAL: { value: "" },
                  TYPE_CD: { value: "" },
                  CHEQUE_NO: { value: "" },
                  STATUS: { value: "" },
                  AMOUNT: { value: "" },
                };
              }
              return {};
            },
            GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 1.3 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NM",
          label: "Account Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4.5, md: 4.5, lg: 4.5, xl: 2.6 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TRAN_BAL",
          label: "Trn.Balance",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHEQUE_NO",
          label: "Cheque No.",
          placeholder: "Cheque No.",
          type: "text",
          autoComplete: "off",
          required: true,
          dependentFields: ["BRANCH_CD", "ACCT_TYPE", "ACCT_CD", "TYPE_CD"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};

            if (
              currentField.value &&
              dependentFieldsValues?.["TRNDTLS.ACCT_CD"]?.value.length === 0
            ) {
              let buttonName = await formState?.MessageBox({
                messageTitle: "ValidationFailed",
                message: "Enter Account Information.",
                buttonNames: ["Ok"],
                icon: "ERROR",
              });
              if (buttonName === "Ok") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  },
                  ACCT_TYPE: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (
              currentField.value &&
              dependentFieldsValues?.["TRNDTLS.ACCT_CD"]?.value.length
            ) {
              if (formState?.isSubmitting) return {};
              let postData = await GeneralAPI.getChequeNoValidation({
                BRANCH_CD: dependentFieldsValues?.["TRNDTLS.BRANCH_CD"]?.value,
                ACCT_TYPE: dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.value,
                ACCT_CD: utilFunction.getPadAccountNumber(
                  dependentFieldsValues?.["TRNDTLS.ACCT_CD"]?.value,
                  dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.optionData
                ),
                CHEQUE_NO: currentField.value,
                TYPE_CD: dependentFieldsValues?.["TRNDTLS.TYPE_CD"]?.value,
                SCREEN_REF: "RPT/401",
              });
              let btn99;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.ERR_CODE === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: postData[i]?.O_MSG_TITLE?.length
                      ? postData[i]?.O_MSG_TITLE
                      : "ValidationFailed",
                    message: postData[i]?.ERR_MSG,
                    icon: "ERROR",
                  });
                  if (btnName === "Ok") {
                    return {
                      CHEQUE_NO: {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (postData[i]?.ERR_CODE === "9") {
                  if (btn99 !== "No") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: postData[i]?.O_MSG_TITLE?.length
                        ? postData[i]?.O_MSG_TITLE
                        : "Alert",
                      message: postData[i]?.ERR_MSG,
                      icon: "WARNING",
                    });
                  }
                } else if (postData[i]?.ERR_CODE === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: postData[i]?.O_MSG_TITLE?.length
                      ? postData[i]?.O_MSG_TITLE
                      : "Confirmation",
                    message: postData[i]?.ERR_MSG,
                    buttonNames: ["Yes", "No"],
                    icon: "CONFIRM",
                  });

                  btn99 = btnName;
                  if (btnName === "No") {
                    return {
                      CHEQUE_NO: {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (postData[i]?.ERR_CODE === "0") {
                  return {
                    CHEQUE_NO: {
                      value: currentField?.value,
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
            }
          },
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 6) {
                return false;
              }
              return true;
            },
          },
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "paymentTransfer") {
              return true;
            } else {
              return false;
            }
          },
          validate: (columnValue) => {
            if (!Boolean(columnValue.value.trim())) {
              return "Cheque No. is Required.";
            }
            return "";
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "Cheque Date",
          placeholder: "",
          defaultValue: new Date(),
          isWorkingDate: true,
          format: "dd/MM/yyyy",
          type: "text",
          fullWidth: true,
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "paymentTransfer") {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.3 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "",
          placeholder: "",
          type: "text",
          autoComplete: "off",
          dependentFields: [
            "TRAN_BAL",
            "STATUS",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
          ],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};

            if (
              Number(currentField?.value) >
              Number(dependentFieldsValues?.["TRNDTLS.TRAN_BAL"]?.value)
            ) {
              let buttonName = await formState?.MessageBox({
                messageTitle: "ValidationFailed",
                message:
                  "You can not enter amount more than Withdrawable Balance.",
                buttonNames: ["Ok"],
                icon: "ERROR",
              });
              if (buttonName === "Ok") {
                return {
                  AMOUNT: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            } else {
              if (
                dependentFieldsValues?.["TRNDTLS.BRANCH_CD"]?.value &&
                dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.value &&
                dependentFieldsValues?.["TRNDTLS.ACCT_CD"]?.value
              ) {
                const reqParameters = {
                  A_COMP_CD: authState?.companyID ?? "",
                  A_BRANCH_CD:
                    dependentFieldsValues?.["TRNDTLS.BRANCH_CD"]?.value ?? "",
                  A_ACCT_TYPE:
                    dependentFieldsValues?.["TRNDTLS.ACCT_TYPE"]?.value ?? "",
                  A_ACCT_CD:
                    dependentFieldsValues?.["TRNDTLS.ACCT_CD"]?.value ?? "",
                  A_TYPE_CD: "6",
                  A_AMOUNT: currentField?.value ?? "",
                  A_TYPE: "C",
                  WORKING_DATE: authState?.workingDate ?? "",
                  A_STATUS:
                    dependentFieldsValues?.["TRNDTLS.STATUS"]?.value ?? "",
                  USERNAME: authState?.user?.id ?? "",
                  USERROLE: authState?.role ?? "",
                  A_SCREEN_REF: "RPT/401",
                };
                const postData = await API.checkLienAcct(reqParameters);

                if (postData?.[0]?.STATUS === "999") {
                  let buttonName = await formState?.MessageBox({
                    messageTitle: "ValidationFailed",
                    message: postData?.[0]?.MSG ?? "",
                    buttonNames: ["Ok"],
                    icon: "ERROR",
                  });
                  if (buttonName === "Ok") {
                    return {
                      AMOUNT: {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (postData?.[0]?.STATUS === "0") {
                  return {
                    AMOUNT: {
                      value: currentField?.value,
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
              return {};
            }
            return {};
          },
          FormatProps: {
            allowNegative: false,
          },
          validate: (columnValue) => {
            if (!Boolean(columnValue.value)) {
              return "Amount is Required.";
            } else if (columnValue.value <= 0) {
              return "Amount must be greater than zero.";
            }
            return "";
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
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
      ],
    },
  ],
};

//FD Renew transfer form metadata
export const RenewTransferMetadata = {
  form: {
    name: "renewTransfer",
    label: "Renew Amount",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    allowColumnHiding: true,
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
          spacing: 2,
        },
      },
    },
    componentProps: {
      amountField: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "amountField",
      },
      name: "PAYMENT_AMOUNT",
      label: "Payment Amount",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.5, xl: 2.5 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "RENEW_AMT",
      label: "Renew Amount",
      isFieldFocused: true,
      placeholder: "",
      type: "text",
      dependentFields: ["PAYMENT_AMOUNT"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (
          Number(currentField?.value) >
          Number(dependentFieldsValues?.PAYMENT_AMOUNT?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "ValidationFailed",
            message:
              "Renewal amount should be less or equals to Payment amount.",
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
          if (buttonName === "Ok") {
            return {
              RENEW_AMT: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
        }

        return {};
      },
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
      },
      validate: (columnValue) => {
        if (!Boolean(columnValue.value)) {
          return "Amount is Required.";
        } else if (columnValue.value <= 0) {
          return "Amount can't be Negative or Zero.";
        }
        return "";
      },
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.5, xl: 2.5 },
    },
  ],
};
