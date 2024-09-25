import { utilFunction } from "@acuteinfo/common-base";
// import { validateAccountAndGetDetail } from "../api";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "../../api";

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
    // {
    //   render: {
    //     componentType: "spacer",
    //   },
    //   GridProps: { xs: 0, md: 4, sm: 4, lg: 4, xl: 4 },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "TOTAL_FD_AMOUNT",
    //   label: "Total FD Amount",
    //   placeholder: "",
    //   isReadOnly: true,
    //   type: "text",
    //   GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 1.5 },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "TOTAL_DR_AMOUNT",
    //   label: "Total Debit Amount",
    //   placeholder: "",
    //   isReadOnly: true,
    //   type: "text",
    //   GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 1.5 },
    //   dependentFields: ["TRNDTLS"],
    //   setValueOnDependentFieldsChange: (dependentFieldState) => {
    //     let accumulatedTakeoverLoanAmount = (
    //       Array.isArray(dependentFieldState?.["TRNDTLS"])
    //         ? dependentFieldState?.["TRNDTLS"]
    //         : []
    //     ).reduce((accum, obj) => accum + Number(obj.AMOUNT?.value), 0);

    //     return accumulatedTakeoverLoanAmount;
    //   },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "TOTAL_AMOUNT",
    //   label: "Difference Amount",
    //   placeholder: "",
    //   isReadOnly: true,
    //   type: "text",
    //   dependentFields: ["TOTAL_FD_AMOUNT", "TOTAL_DR_AMOUNT"],
    //   setValueOnDependentFieldsChange: (dependentFields) => {
    //     let value =
    //       Number(dependentFields?.TOTAL_FD_AMOUNT?.value) -
    //       Number(dependentFields?.TOTAL_DR_AMOUNT?.value);

    //     return value ?? "0";
    //   },
    //   GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 1.5 },
    // },

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
      dependentFields: ["TOTAL_FD_AMOUNT", "TOTAL_DR_AMOUNT"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.TOTAL_FD_AMOUNT?.value) -
          Number(dependentFields?.TOTAL_DR_AMOUNT?.value);

        return value ?? "0";
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
      name: "TOTAL_FD_AMOUNT",
      label: "TotalAmount",
      placeholder: "",
      isReadOnly: true,
      fullWidth: true,
      type: "text",
      dependentFields: ["FDACCTS"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let amount = (
          Array.isArray(dependentFieldsValues?.["FDACCTS"])
            ? dependentFieldsValues?.["FDACCTS"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.AMOUNT?.value), 0);
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
        componentType: "arrayField",
      },
      name: "TRNDTLS",
      enableGrid: true,
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "DC_BRANCH_CD",
            isFieldFocus: true,
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
              return {
                DC_ACCT_TYPE: { value: "" },
                DC_ACCT_CD: { value: "" },
                DC_ACCT_NM: { value: "" },
              };
            },

            GridProps: { xs: 12, sm: 1, md: 1, lg: 2.5, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "DC_ACCT_TYPE",
            dependentFields: ["DC_BRANCH_CD"],
            disableCaching: true,
            options: (...arg) => {
              if (
                Boolean(arg?.[3]?.companyID) &&
                Boolean(arg?.[2]?.["TRNDTLS.DC_BRANCH_CD"]?.value) &&
                Boolean(arg?.[3]?.user?.id)
              ) {
                return GeneralAPI.get_Account_Type({
                  COMP_CD: arg?.[3]?.companyID ?? "",
                  BRANCH_CD: arg?.[2]?.["TRNDTLS.DC_BRANCH_CD"]?.value ?? "",
                  USER_NAME: arg?.[3]?.user?.id ?? "",
                  DOC_CD: "FDINSTRCRTYPE",
                });
              } else {
                return [];
              }
            },
            _optionsKey: "getCreditAccountType",
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
                DC_ACCT_CD: { value: "" },
                DC_ACCT_NM: { value: "" },
              };
            },
            fullWidth: true,
            GridProps: { xs: 12, sm: 1, md: 1, lg: 2.5, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "DC_ACCT_CD",
            dependentFields: ["DC_BRANCH_CD", "DC_ACCT_TYPE"],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              if (formState?.isSubmitting) return {};

              if (
                currentField?.value &&
                dependentFieldsValues?.["TRNDTLS.DC_BRANCH_CD"]?.value &&
                dependentFieldsValues?.["TRNDTLS.DC_ACCT_TYPE"]?.value
              ) {
                const reqParameters = {
                  BRANCH_CD:
                    dependentFieldsValues?.["TRNDTLS.DC_BRANCH_CD"]?.value,
                  COMP_CD: authState?.companyID,
                  ACCT_TYPE:
                    dependentFieldsValues?.["TRNDTLS.DC_ACCT_TYPE"]?.value,
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    currentField?.value,
                    dependentFieldsValues?.["TRNDTLS.DC_ACCT_TYPE"]?.optionData
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
                for (let i = 0; i < postData?.MSG?.length; i++) {
                  if (postData?.MSG?.[i]?.O_STATUS === "999") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: "ValidationFailed",
                      message: postData?.MSG?.[i]?.O_MESSAGE,
                    });
                    returnVal = "";
                  } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                    if (btn99 !== "No") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: "Alert",
                        message: postData?.MSG?.[i]?.O_MESSAGE,
                      });
                    }
                    returnVal = postData;
                  } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: "Confirmation",
                      message: postData?.MSG?.[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                    });

                    btn99 = btnName;
                    if (btnName === "No") {
                      returnVal = "";
                    }
                  } else if (postData?.MSG?.[i]?.O_STATUS === "0") {
                    if (btn99 !== "No") {
                      returnVal = postData;
                    } else {
                      returnVal = "";
                    }
                  }
                }
                btn99 = 0;
                return {
                  DC_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldsValues?.DC_ACCT_TYPE?.optionData
                          ),
                          isFieldFocused: false,
                          ignoreUpdate: true,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: true,
                        },
                  DC_ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                  },
                };
              } else if (!currentField?.value) {
                return {
                  DC_ACCT_NM: { value: "" },
                };
              }
              return {};

              // const branchCode =
              //   arg?.[3]?.["TRNDTLS.DC_BRANCH_CD"]?.value ?? "";
              // const accountType =
              //   arg?.[3]?.["TRNDTLS.DC_ACCT_TYPE"]?.value ?? "";
              // let accountCode = arg?.[0]?.value ?? "";

              // if (Boolean(branchCode) && Boolean(accountType) && accountCode) {
              //   accountCode = utilFunction.getPadAccountNumber(
              //     accountCode,
              //     arg?.[3]?.["TRNDTLS.DC_ACCT_TYPE"]?.optionData
              //   );
              //   const apiResponse = await validateAccountAndGetDetail(
              //     arg?.[2]?.companyID,
              //     branchCode,
              //     accountType,
              //     accountCode,
              //     "FD_DR_ACT"
              //   );
              //   if (apiResponse?.status === "0") {
              //     if (Boolean(apiResponse?.message)) {
              //       arg?.[1]?.MessageBox({
              //         messageTitle: "Information",
              //         message: apiResponse?.message.startsWith("\n")
              //           ? apiResponse?.message?.slice(1)
              //           : apiResponse?.message,
              //       });
              //     }
              //     return {
              //       DC_ACCT_CD: {
              //         value: accountCode,
              //         error: "",
              //         ignoreUpdate: true,
              //       },
              //       DC_ACCT_NM: {
              //         value: apiResponse?.data?.[0]?.ACCT_NM ?? "",
              //       },
              //       TRAN_BAL: {
              //         value: apiResponse?.data?.[0]?.WIDTH_BAL ?? "",
              //       },
              //       DC_COMP_CD: {
              //         value: arg?.[2]?.companyID ?? "",
              //       },
              //     };
              //   } else {
              //     return {
              //       DC_ACCT_CD: {
              //         value: "",
              //         error: apiResponse?.message ?? "",
              //         ignoreUpdate: true,
              //         isFieldFocused: true,
              //       },
              //       DC_ACCT_NM: { value: "" },
              //     };
              //   }
              // }
            },
            GridProps: { xs: 12, sm: 2, md: 2, lg: 3, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DC_ACCT_NM",
          label: "AC Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 2, md: 2, lg: 4, xl: 1.5 },
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
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 2, xl: 1.5 },
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
          validate: (columnValue) => {
            if (!Boolean(columnValue.value.trim())) {
              return "Cheque No. is Required.";
            }
            return "";
          },
          GridProps: { xs: 6, sm: 2, md: 1.5, lg: 2, xl: 1.5 },
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
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Debit Amount",
          placeholder: "",
          // isFieldFocused: true,
          // autoComplete: false,
          type: "text",
          FormatProps: {
            allowNegative: false,
          },
          // validationRun: "all",
          AlwaysRunPostValidationSetCrossFieldValues: {
            alwaysRun: true,
            touchAndValidate: false,
          },
          postValidationSetCrossFieldValues: async (...arr) => {
            if (arr[0].value) {
              arr?.[1].setDataOnFieldChange("AMOUNT", "");
              // return {
              //   TOTAL_DR_AMOUNT: { value: arr[0].value ?? "0" },
              // };
            } else {
              // return {
              //   TOTAL_DR_AMOUNT: { value: "" },
              // };
            }
          },
          validate: (columnValue) => {
            if (!Boolean(columnValue.value)) {
              return "Amount is Required.";
            } else if (columnValue.value <= 0) {
              return "Amount must be greater than zero.";
            }
            return "";
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "DC_COMP_CD",
        },
      ],
    },
  ],
};
