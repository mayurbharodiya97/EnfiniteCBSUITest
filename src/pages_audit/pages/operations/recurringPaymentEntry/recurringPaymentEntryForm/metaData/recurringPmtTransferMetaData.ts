import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";

export const RecurringPaymentTransferFormMetaData = {
  form: {
    name: "RecurringPaymentTransfer",
    label: "",
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
          xl: 12,
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
      amountField: {
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
        componentType: "amountField",
      },
      name: "PAYMENT_AMOUNT",
      label: "PaymentAmount",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      dependentFields: ["TRF_AMT"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        return Number(dependentFields?.TRF_AMT?.value ?? 0);
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
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 6, sm: 4, md: 2.4, lg: 1.9, xl: 1.6 },
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
      dependentFields: ["TRF_AMT", "RECPAYTRANS"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let totalAmount = (
          Array.isArray(dependentFieldsValues?.["RECPAYTRANS"])
            ? dependentFieldsValues?.["RECPAYTRANS"]
            : []
        ).reduce((accum, obj) => accum + Number(obj?.AMOUNT?.value), 0);
        let diffAmount =
          Number(dependentFieldsValues?.TRF_AMT?.value ?? 0) - totalAmount;
        return diffAmount ?? "0";
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
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 6, sm: 4, md: 2.4, lg: 1.9, xl: 1.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL",
      label: "TotalAmount",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      dependentFields: ["RECPAYTRANS"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let amount = (
          Array.isArray(dependentFieldsValues?.["RECPAYTRANS"])
            ? dependentFieldsValues?.["RECPAYTRANS"]
            : []
        ).reduce((accum, obj) => accum + Number(obj?.AMOUNT?.value ?? 0), 0);
        return amount ?? "0";
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
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 6, sm: 4, md: 2.4, lg: 1.9, xl: 1.6 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "TRF_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
    },

    {
      render: {
        componentType: "arrayField",
      },
      name: "RECPAYTRANS",
      isScreenStyle: true,
      displayCountName: "TransferToAccount",
      addRowFn: (data) => {
        const dataArray = Array.isArray(data?.RECPAYTRANS)
          ? data?.RECPAYTRANS
          : [];
        if (dataArray?.length > 0) {
          for (let i = 0; i < dataArray?.length; i++) {
            const item = dataArray[0];
            if (
              item?.DC_BRANCH_CD?.trim() &&
              item?.DC_ACCT_TYPE?.trim() &&
              item?.DC_ACCT_CD?.trim() &&
              String(item?.AMOUNT)?.trim()
            ) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            name: "DC_BRANCH_CD",
            fullWidth: true,
            isFieldFocused: true,
            runPostValidationHookAlways: true,
            validationRun: "onChange",
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              return {
                DC_ACCT_TYPE: { value: "" },
                DC_ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
              };
            },
            GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
          },
          accountTypeMetadata: {
            name: "DC_ACCT_TYPE",
            dependentFields: ["DC_BRANCH_CD"],
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
                dependentFieldValues?.["RECPAYTRANS.DC_BRANCH_CD"]?.value
                  ?.length === 0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "Alert",
                  message: "Enter Account Branch.",
                  buttonNames: ["Ok"],
                  icon: "WARNING",
                });

                if (buttonName === "Ok") {
                  return {
                    DC_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                    DC_BRANCH_CD: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
              return {
                DC_ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
              };
            },
            fullWidth: true,
            GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
          },
          accountCodeMetadata: {
            name: "DC_ACCT_CD",
            autoComplete: "off",
            dependentFields: ["DC_ACCT_TYPE", "DC_BRANCH_CD"],
            runPostValidationHookAlways: true,
            AlwaysRunPostValidationSetCrossFieldValues: {
              alwaysRun: true,
              touchAndValidate: true,
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
                dependentFieldsValues?.["RECPAYTRANS.DC_ACCT_TYPE"]?.value
                  ?.length === 0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "Alert",
                  message: "Enter Account Type.",
                  buttonNames: ["Ok"],
                  icon: "WARNING",
                });

                if (buttonName === "Ok") {
                  return {
                    DC_ACCT_CD: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                    DC_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (
                currentField?.value &&
                dependentFieldsValues?.["RECPAYTRANS.DC_BRANCH_CD"]?.value &&
                dependentFieldsValues?.["RECPAYTRANS.DC_ACCT_TYPE"]?.value
              ) {
                formState?.handleDisableButton(true);
                const reqParameters = {
                  BRANCH_CD:
                    dependentFieldsValues?.["RECPAYTRANS.DC_BRANCH_CD"]
                      ?.value ?? "",
                  COMP_CD: authState?.companyID ?? "",
                  ACCT_TYPE:
                    dependentFieldsValues?.["RECPAYTRANS.DC_ACCT_TYPE"]
                      ?.value ?? "",
                  ACCT_CD:
                    utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldsValues?.["RECPAYTRANS.DC_ACCT_TYPE"]
                        ?.optionData
                    ) ?? "",
                  SCREEN_REF: "TRN/053",
                };
                let postData = await GeneralAPI.getAccNoValidation(
                  reqParameters
                );

                let btn99, returnVal;
                const getButtonName = async (obj) => {
                  let btnName = await formState?.MessageBox(obj);
                  return { btnName, obj };
                };
                for (let i = 0; i < postData?.MSG?.length; i++) {
                  if (postData?.MSG?.[i]?.O_STATUS === "999") {
                    formState?.handleDisableButton(false);
                    const { btnName, obj } = await getButtonName({
                      messageTitle: "ValidationFailed",
                      message: postData?.MSG?.[i]?.O_MESSAGE,
                      icon: "ERROR",
                    });
                    returnVal = "";
                  } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                    formState?.handleDisableButton(false);
                    if (btn99 !== "No") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: "Alert",
                        message: postData?.MSG?.[i]?.O_MESSAGE,
                        icon: "WARNING",
                      });
                    }
                    returnVal = postData;
                  } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                    formState?.handleDisableButton(false);
                    const { btnName, obj } = await getButtonName({
                      messageTitle: "Confirmation",
                      message: postData?.MSG?.[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                      icon: "CONFIRM",
                    });

                    btn99 = btnName;
                    if (btnName === "No") {
                      returnVal = "";
                    }
                  } else if (postData?.MSG?.[i]?.O_STATUS === "0") {
                    formState?.handleDisableButton(false);
                    if (btn99 !== "No") {
                      returnVal = postData;
                    } else {
                      returnVal = "";
                    }
                  }
                }
                btn99 = 0;
                formState?.handleDisableButton(false);
                return {
                  DC_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldsValues?.["RECPAYTRANS.DC_ACCT_TYPE"]
                              ?.optionData
                          ),
                          isFieldFocused: false,
                          ignoreUpdate: true,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: true,
                        },
                  ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                  },
                };
              } else if (!currentField?.value) {
                formState?.handleDisableButton(false);
                return {
                  ACCT_NM: { value: "" },
                };
              }
              formState?.handleDisableButton(false);
              return {};
            },
            fullWidth: true,
            GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
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
          GridProps: { xs: 12, sm: 7, md: 7, lg: 4, xl: 4 },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "Enter Amount",
          autoComplete: "off",
          fullWidth: true,
          maxLength: 15,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["amountRequired"] }],
          },
          FormatProps: {
            allowLeadingZeros: false,
            allowNegative: false,
            isAllowed: (values) => {
              if (values?.value?.length > 15) {
                return false;
              }
              if (values?.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          GridProps: {
            xs: 12,
            sm: 5,
            md: 5,
            lg: 2,
            xl: 2,
          },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "DC_COMP_CD",
          dependentFields: ["COMP_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            return dependentFields?.COMP_CD?.value;
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "REMARKS",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CHEQUE_NO",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CHEQUE_DATE",
        },
      ],
    },
  ],
};
