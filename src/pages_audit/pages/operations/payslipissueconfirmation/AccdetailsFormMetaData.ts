import { utilFunction } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";
import { geTrxDdw } from "../payslip-issue-entry/api";
export const PayslipdetailsFormMetaData = {
  form: {
    name: "payslip entry",

    label: "",
    resetFieldOnUnmount: false,
    validationRun: "all",
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
      amountField: {
        fullWidth: true,
      }
    },
  },
  fields: [
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "issueDate",
      isReadOnly: true,
      dateFormat: "dd/MM/yyyy",
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDENSLIP_CD",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_CD",
      label: "slipNo",
      placeholder: "slipNo",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      dependentFields: ["PAYSLIP_MST_DTL", "PAYSLIP_DRAFT_DTL", "TRAN_DT", "HIDDENSLIP_CD"],
      disableCaching: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PENDING_FLAG",
      label: "Status",
      color: 'error',
      placeholder: "Mode",
      type: "text",
      isReadOnly: true,
      textFieldStyle: {
        "& .MuiInputBase-root": {
          color: "red",
        },
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      GridProps: { xs: 0, sm: 0, md: 0, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "MST_TOTAL",
      label: "Total ",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      dependentFields: ["PAYSLIP_MST_DTL", "PAYSLIP_DRAFT_DTL"],
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
      GridProps: { xs: 6, sm: 6, md: 6, lg: 2, xl: 1.5 },
      setValueOnDependentFieldsChange: (dependentFields) => {
        let totalValue = 0;

        // Iterate through each row in PAYSLIP_MST_DTL
        dependentFields.PAYSLIP_MST_DTL.forEach(row => {
          const amount = parseFloat(row?.AMOUNT?.value) || 0;
          const commission = parseFloat(row?.COMMISSION?.value) || 0;
          const serviceCharge = parseFloat(row?.SERVICE_CHARGE?.value) || 0;
          const isCCtR = row?.C_C_T?.value === "R";

          if (isCCtR) {
            totalValue -= amount;
          } else {
            totalValue += amount;
          }

          totalValue += commission + serviceCharge;
        });

        return totalValue;
      }
    },

  ]
}
export const AccdetailsFormMetaData = {
  form: {
    name: "payslip entry",
    label: " ",
    resetFieldOnUnmount: false,
    validationRun: "onChange",
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
      amountField: {
        fullWidth: true,
      }
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "PAYSLIP_MST_DTL",
      addRowFn: (data) => {
        const dataArray = Array.isArray(data?.PAYSLIP_MST_DTL) ? data?.PAYSLIP_MST_DTL : [];

        if (dataArray?.length > 0) {
          for (let i = 0; i < dataArray?.length; i++) {
            const item = dataArray[0];
            if (
              item.AMOUNT.trim() &&
              item.CHEQUE_NO.trim() &&
              item.ACCT_CD.trim()
            ) {
              return true;
            }
          }

          return false;
        }
        else return true;
      },
      __EDIT__: {
        fixedRows: true,
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },

      _fields: [
        {
          render: { componentType: "_accountNumber" },

          branchCodeMetadata: {
            name: "BRANCH_CD",
            GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
            isReadOnly: true,
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
            runValidationOnDependentFieldsChange:false,
            validationRun: "all",
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
                  BRANCH_CD: dependentFieldValues?.["PAYSLIP_MST_DTL.BRANCH_CD"]?.value,
                  COMP_CD: authState?.companyID,
                  ACCT_TYPE: dependentFieldValues?.["PAYSLIP_MST_DTL.ACCT_TYPE"]?.value,
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
                        value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
                        ignoreUpdate: true,
                        isFieldFocused: false,
                      }
                      : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                  ACCT_NM: {
                    value: postData?.ACCT_NM ?? "",
                  },
                  TYPE_CD: {
                    value: postData?.TYPE_CD ?? "",
                  },
                  LIMIT_AMT: {
                    value: postData?.LIMIT_AMT ?? "",
                  },
                  WIDTH_BAL: {
                    value: postData?.WIDTH_BAL ?? "",
                  },
                  TRAN_BAL: {
                    value: postData?.TRAN_BAL ?? "",
                  }

                };
              } else if (!currentField?.value) {
                return {
                  ACCT_NM: { value: "" },
                  TRAN_BAL: { value: "" }
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
          name: "ACCT_NM",
          label: "accountName",
          isReadOnly: true,
          type: "text",
          fullWidth: true,
          __EDIT__: { isReadOnly: true },
          __NEW__: { isReadOnly: false },
          GridProps: { xs: 6, sm: 6, md: 4, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TRAN_BAL",
          label: "balance",
          isReadOnly: true,
          type: "text",
          fullWidth: true,
          FormatProps: {
            allowNegative: true,
          },
          GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
          __EDIT__: { isReadOnly: true },
          __NEW__: { isReadOnly: false },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "JOINT_DTL",
          label: "Joint Details",
          type: "text",
          GridProps: { lg: 1, xl: 1 },
          dependentFields: ["INFAVOUR_OF"],
          __EDIT__: { isReadOnly: true },
          __NEW__: { isReadOnly: false },
        },
        {
            render: {
              componentType: "formbutton",
            },
            name: "SIGN",
            label: "Sign",
            GridProps: { lg: 1, xl: 1 },
          },
        {
            render: {
              componentType: "amountField",
            },
            name: "WIDTH_BAL",
            label: "Withdrawal Balance",
            required: true,
            fullWidth: true,
            placeholder: "",
            type: "text",
            FormatProps: {
              allowNegative: false,
            },
            dependentFields: ["PAYSLIP_MST_DTL", "ACCT_TYPE", "BRANCH_CD","ACCT_CD"],
            setValueOnDependentFieldsChange:async (dependentFieldValues) => {
              const reqParameters = {
                BRANCH_CD: dependentFieldValues?.["PAYSLIP_MST_DTL.BRANCH_CD"]?.value,
                COMP_CD: "132",
                ACCT_TYPE: dependentFieldValues?.["PAYSLIP_MST_DTL.ACCT_TYPE"]?.value,
                ACCT_CD: dependentFieldValues?.["PAYSLIP_MST_DTL.ACCT_CD"]?.value,
                SCREEN_REF: "RPT/15",
              };
              
              let postData = await GeneralAPI.getAccNoValidation(reqParameters);
              console.log("reqParameters",postData);
            
              return postData?.WIDTH_BAL ?? "";
            },  
         
            GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
           
  
          },
        {
            render: {
              componentType: "amountField",
            },
            name: "LIMIT_AMT",
            label: "Withdrawable Amount",
            required: true,
            fullWidth: true,
            placeholder: "",
            type: "text",
            FormatProps: {
              allowNegative: false,
            },
            __EDIT__: { isReadOnly: true, required: false, },
           
            GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
            dependentFields: ["PAYSLIP_MST_DTL", "ACCT_TYPE", "BRANCH_CD","ACCT_CD"],
            setValueOnDependentFieldsChange:async (dependentFieldValues) => {
              const reqParameters = {
                BRANCH_CD: dependentFieldValues?.["PAYSLIP_MST_DTL.BRANCH_CD"]?.value,
                COMP_CD: "132",
                ACCT_TYPE: dependentFieldValues?.["PAYSLIP_MST_DTL.ACCT_TYPE"]?.value,
                ACCT_CD: dependentFieldValues?.["PAYSLIP_MST_DTL.ACCT_CD"]?.value,
                SCREEN_REF: "RPT/15",
              };
              
              let postData = await GeneralAPI.getAccNoValidation(reqParameters);
              console.log("reqParameters",postData);
            
              return postData?.LIMIT_AMT ?? "";
            }, 
  
          },
          {
            render: {
              componentType: "amountField",
            },
            name: "LIMIT_AMT",
            label: "Limit Amount",
            required: true,
            dependentFields: ["COMMISSION", "SERVICE_CHARGE", "C_C_T"],
            fullWidth: true,
            placeholder: "",
            type: "text",
            FormatProps: {
              allowNegative: false,
            },
            __EDIT__: { isReadOnly: true, required: false, },
           
            GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
           
  
          },
        {
          render: {
            componentType: "hidden",
          },
          name: "TYPE_CD",

        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMARKS",
          setFieldLabel: (dependenet, currVal) => {
            return currVal === "C" ? "Cash"
              : currVal === "T" ? "Transfer"
                : currVal === "G" ? "Clearing"
                  : null

          },
          label: "narration",
          placeholder: "Mode",
          type: "text",
          GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
          __EDIT__: { isReadOnly: true },
        },
        {
          render: { componentType: "autocomplete" },
          name: "C_C_T",
          placeholder: "",
          label: "byTrf",
          fullWidth: true,
          _optionsKey: "options",
          options: (dependentValue, formState, _, authState) => {
            return geTrxDdw();
          },
          setFieldLabel: (dependenet, currVal) => {
            return currVal === "C" ? "By Cash"
              : currVal === "T" ? "By Trf"
                : currVal === "R" ? "By Cr. Trf"
                  : currVal === "G" ? "By CLG"
                    : null
          },
          defaultValue: "T",
          __EDIT__: { isReadOnly: true },
          __NEW__: { isReadOnly: false },
          GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const payload = {
              C_C_T: currentField?.value,
            };

            formState.setDataOnFieldChange("BY_TRF", payload);


          }
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHEQUE_NO",
          label: "chequeNo",
          placeholder: "Cheque No.",
          type: "text",
          fullWidth: true,
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
          GridProps: { xs: 6, sm: 6, md: 4, lg: 1.5, xl: 1.5 },
          dependentFields: ["ACCT_CD", "ACCT_TYPE", "BRANCH_CD", "C_C_T", "TYPE_CD"],
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ChequeNoisrequired"] }],
          },
          AlwaysRunPostValidationSetCrossFieldValues: {
            alwaysRun: true,
            touchAndValidate: false,
          },
          shouldExclude: (val1, dependentFields) => {
            if (dependentFields?.["PAYSLIP_MST_DTL.C_C_T"]?.value === "C") {
              return true;
            }
            return false;
          },
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (
              field.value &&
              dependentFieldsValues?.["PAYSLIP_MST_DTL.ACCT_CD"]?.value.length === 0
            ) {
              let buttonName = await formState?.MessageBox({
                messageTitle: "Information",
                message: "Enter Account Information",
                buttonNames: ["Ok"],
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
              field.value &&
              dependentFieldsValues?.["PAYSLIP_MST_DTL.ACCT_CD"]?.value.length
            ) {
              if (formState?.isSubmitting) return {};
              let postData = await GeneralAPI.getChequeNoValidation({
                BRANCH_CD: dependentFieldsValues?.["PAYSLIP_MST_DTL.BRANCH_CD"]?.value,
                ACCT_TYPE: dependentFieldsValues?.["PAYSLIP_MST_DTL.ACCT_TYPE"]?.value,
                ACCT_CD: utilFunction.getPadAccountNumber(
                  dependentFieldsValues?.["PAYSLIP_MST_DTL.ACCT_CD"]?.value,
                  dependentFieldsValues?.["PAYSLIP_MST_DTL.ACCT_TYPE"]?.optionData
                ),
                CHEQUE_NO: field.value,
                TYPE_CD: dependentFieldsValues?.["PAYSLIP_MST_DTL.TYPE_CD"]?.value,
                SCREEN_REF: "Rpt/14"
              });
              let btn99;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.ERR_CODE === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Account Validation Failed",
                    message: postData[i]?.ERR_MSG,
                  });
                  if (btnName === "Ok") {
                    return {
                      CHEQUE_NO: {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      CHEQUE_DT: {
                        value: "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (postData[i]?.ERR_CODE === "9") {
                  if (btn99 !== "No") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: "HNI Alert",
                      message: postData[i]?.ERR_MSG,
                    });
                  }
                } else if (postData[i]?.ERR_CODE === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Risk Category Alert",
                    message: postData[i]?.ERR_MSG,
                    buttonNames: ["Yes", "No"],
                  });

                  btn99 = btnName;
                  if (btnName === "No") {
                    return {
                      CHEQUE_NO: {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      CHEQUE_DT: {
                        value: "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (postData[i]?.ERR_CODE === "0") {
                  return {
                    CHEQUE_NO: {
                      value: field?.value,
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                }
              }
            }
          },
          __EDIT__: {
            isReadOnly: true, required: false,
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {

            },
          },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "chequeDate",
          placeholder: "",
          format: "dd/MM/yyyy",
          defaultValue: new Date(),
          type: "text",
          fullWidth: true,
          __EDIT__: { isReadOnly: true },
          __NEW__: { isReadOnly: false },
          dependentFields: ["C_C_T"],
          GridProps: { xs: 6, sm: 6, md: 4, lg: 1.5, xl: 1.5 },
          shouldExclude: (val1, dependentFields) => {
            if (dependentFields?.["PAYSLIP_MST_DTL.C_C_T"]?.value === "C") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "amount",
          required: true,
          dependentFields: ["COMMISSION", "SERVICE_CHARGE", "C_C_T"],
          fullWidth: true,
          placeholder: "",
          type: "text",
          FormatProps: {
            allowNegative: false,
          },
          __EDIT__: { isReadOnly: true, required: false, },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["amountRequired"] }],
          },
          GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
          runValidationOnDependentFieldsChange: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const payload = {
              AMOUNT: currentField.value,
              COMMISSION: dependentFieldValues?.["PAYSLIP_MST_DTL.COMMISSION"]?.value,
              SERVICE_CHARGE: dependentFieldValues?.["PAYSLIP_MST_DTL.SERVICE_CHARGE"]?.value,
              C_C_T: dependentFieldValues?.["PAYSLIP_MST_DTL.C_C_T"]?.value,
            }
            formState.setDataOnFieldChange("MST_TOTAL", payload);

          }

        },
        {
          render: {
            componentType: "amountField",
          },
          name: "COMMISSION",
          label: "Comm.",
          fullWidth: true,
          placeholder: "",
          type: "text",
          GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
          __EDIT__: { isReadOnly: true },
          __NEW__: { isReadOnly: false },

        },
        {
          render: {
            componentType: "amountField",
          },
          name: "SERVICE_CHARGE",
          label: "GST",
          placeholder: "",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
          __EDIT__: { isReadOnly: true },
          __NEW__: { isReadOnly: false },

        },

        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD"
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "PENDING_FLAG"
        },
        {
          render: {
            componentType: "checkbox",
          },
          name: "DUMMY_CHECK",
          defaultValue: true,
          dependentFields: ["PAYSLIP_MST_DTL", "C_C_T"],
          __EDIT__: {
            isReadOnly: true
          },
          shouldExclude: (val1, dependentFields) => {

            if (dependentFields["PAYSLIP_MST_DTL"].length === 1) {
              return true
            }
            else {
              const cctValue = dependentFields["PAYSLIP_MST_DTL.C_C_T"]?.value;

              if (cctValue === "R") {
                return true;
              }
              return false
            }



          },
          // setValueOnDependentFieldsChange: (dependentFields) => {

          //   if (dependentFields["PAYSLIP_MST_DTL"].length === 1) {
          //     return ""
          //   }
          //   else {
          //     const cctValue = dependentFields["PAYSLIP_MST_DTL.C_C_T"]?.value;

          //     if (cctValue === "R") {
          //       return false
          //     }
          //     return true
          //   }
          // },

          GridProps: { xs: 6, sm: 2, md: 3, lg: 3, xl: 1.5 },
        },


      ],
    },

  ]
}