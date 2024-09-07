import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "../../api";
import {
  greaterThanDate,
  utilFunction,
  lessThanInclusiveDate,
} from "@acuteinfo/common-base";

export const FixDepositDetailFormMetadata = {
  form: {
    name: "fixDepositDetail",
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
      name: "TOTAL_FIELD_SPACE",
      GridProps: { xs: 0, sm: 9, md: 10, lg: 10, xl: 10 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_FD_AMOUNT",
      label: "Total FD Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      dependentFields: ["FDDTL"],

      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let amount = (
          Array.isArray(dependentFieldsValues?.["FDDTL"])
            ? dependentFieldsValues?.["FDDTL"]
            : []
        ).reduce(
          (accum, obj) =>
            accum +
            Number(obj?.CASH_AMT?.value ?? 0) +
            Number(obj?.TRSF_AMT?.value ?? 0),
          0
        );
        return amount ?? "0";
      },

      // postValidationSetCrossFieldValues: async (
      //   currentField,
      //   formState,
      //   auth,
      //   dependentField
      // ) => {
      //   let accumulatedTakeoverLoanAmount = (
      //     Array.isArray(dependentField?.["FDDTL"])
      //       ? dependentField?.["FDDTL"]
      //       : []
      //   ).reduce((accum, obj) => accum + Number(obj.FD_AMOUNT?.value), 0);

      //   if (
      //     Number(currentField.value) === Number(accumulatedTakeoverLoanAmount)
      //   ) {
      //     return {};
      //   }
      //   if (accumulatedTakeoverLoanAmount) {
      //     return {
      //       TOTAL_FD_AMOUNT: {
      //         value: accumulatedTakeoverLoanAmount ?? 0,
      //       },
      //     };
      //   } else {
      //     return {
      //       TOTAL_FD_AMOUNT: {
      //         value: "",
      //       },
      //     };
      //   }
      // },
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
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DOUBLE_FAC",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "FDDTL",
      fixedRows: false,
      isDisplayCount: true,
      isScreenStyle: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: { componentType: "_accountNumber" },
          __NEW__: {
            branchCodeMetadata: {
              name: "BRANCH_CD",
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
                  ACCT_NM: { value: "" },
                  ACCT_TYPE: { value: "" },
                  ACCT_CD: { value: "" },
                };
              },
              GridProps: { xs: 12, sm: 3, md: 1.7, lg: 2, xl: 1.5 },
            },
            accountTypeMetadata: {
              name: "ACCT_TYPE",
              runPostValidationHookAlways: true,
              validationRun: "onChange",
              dependentFields: ["BRANCH_CD"],
              postValidationSetCrossFieldValues: async (
                currentField,
                formState,
                authState,
                dependentFieldsValues
              ) => {
                if (formState?.isSubmitting) return {};

                if (
                  currentField?.value &&
                  dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value
                ) {
                  const reqParameters = {
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD:
                      dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value ?? "",
                    ACCT_TYPE: currentField?.value ?? "",
                    SCREEN_REF: "RPT/401",
                  };
                  const postData = await API.getFDParaDetail(reqParameters);

                  return {
                    FD_NO_DISABLED: {
                      value: postData?.[0]?.FD_NO_DISABLED ?? "",
                    },
                    INT_RATE_DISABLED: {
                      value: postData?.[0]?.INT_RATE_DISABLED ?? "",
                    },
                    MATURITY_AMT_DISABLED: {
                      value: postData?.[0]?.MATURITY_AMT_DISABLED ?? "",
                    },
                    TERM_CD_DISABLED: {
                      value: postData?.[0]?.TERM_CD_DISABLED ?? "",
                    },
                    TRAN_DT_DISABLED: {
                      value: postData?.[0]?.TRAN_DT_DISABLED ?? "",
                    },
                  };
                }
                return {
                  ACCT_CD: { value: "" },
                  ACCT_NM: { value: "" },
                  FD_NO_DISABLED: { value: "" },
                  INT_RATE_DISABLED: { value: "" },
                  MATURITY_AMT_DISABLED: { value: "" },
                  TERM_CD_DISABLED: { value: "" },
                  TRAN_DT_DISABLED: { value: "" },
                };
              },
              GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
            },
            accountCodeMetadata: {
              name: "ACCT_CD",
              autoComplete: "off",
              dependentFields: ["ACCT_TYPE", "BRANCH_CD", "DOUBLE_FAC"],
              runPostValidationHookAlways: true,
              postValidationSetCrossFieldValues: async (
                currentField,
                formState,
                authState,
                dependentFieldsValues
              ) => {
                if (formState?.isSubmitting) return {};

                if (
                  currentField?.value &&
                  dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value &&
                  dependentFieldsValues?.["FDDTL.ACCT_TYPE"]?.value
                ) {
                  const reqParameters = {
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD:
                      dependentFieldsValues?.["FDDTL.BRANCH_CD"]?.value ?? "",
                    ACCT_TYPE:
                      dependentFieldsValues?.["FDDTL.ACCT_TYPE"]?.value ?? "",
                    ACCT_CD:
                      utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.["FDDTL.ACCT_TYPE"]?.optionData
                      ) ?? "",
                    SCREEN_REF: "RPT/401",
                    TRAN_CD: dependentFieldsValues?.DOUBLE_TRAN?.value ?? "",
                    DOUBLE_FAC: dependentFieldsValues?.DOUBLE_FAC?.value ?? "",
                  };
                  const postData = await API.validateAcctDtl(reqParameters);
                  let btn99, returnVal;
                  const getButtonName = async (obj) => {
                    let btnName = await formState.MessageBox(obj);
                    return { btnName, obj };
                  };

                  for (let i = 0; i < postData?.[0]?.MSG?.length; i++) {
                    if (postData?.[0]?.MSG?.[i]?.O_STATUS === "999") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: "ValidationFailed",
                        message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                      });
                      returnVal = "";
                    } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "9") {
                      if (btn99 !== "No") {
                        const { btnName, obj } = await getButtonName({
                          messageTitle: "Alert",
                          message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                        });
                      }
                      returnVal = postData?.[0];
                    } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "99") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: "Confirmation",
                        message: postData?.[0]?.MSG?.[i]?.O_MESSAGE,
                        buttonNames: ["Yes", "No"],
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
                              dependentFieldsValues?.["FDDTL.ACCT_TYPE"]
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
                  return {
                    ACCT_NM: { value: "" },
                  };
                }
                return {};
              },
              fullWidth: true,
              GridProps: { xs: 12, sm: 3, md: 1.5, lg: 1.5, xl: 1.5 },
            },
          },
          __VIEW__: {
            branchCodeMetadata: {
              name: "BRANCH_CD",
              defaultValue: "",
              postValidationSetCrossFieldValues: () => {},
              isReadOnly: true,
              GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
            },
            accountTypeMetadata: {
              name: "ACCT_TYPE",
              postValidationSetCrossFieldValues: () => {},
              options: () => {},
              isReadOnly: true,
              _optionsKey: "",
              GridProps: { xs: 12, sm: 3, md: 1.7, lg: 2, xl: 1.5 },
            },
            accountCodeMetadata: {
              name: "ACCT_CD",
              postValidationSetCrossFieldValues: () => {},
              isReadOnly: true,
              GridProps: { xs: 12, sm: 3, md: 1.5, lg: 1.5, xl: 1.5 },
            },
          },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "FD_NO",
          label: "FD Number",
          className: "textInputFromRight",
          placeholder: "",
          maxLength: 10,
          dependentFields: ["FD_NO_DISABLED"],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.FD_NO_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 10) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
            isValidation: "no",
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 3, md: 1.5, lg: 1.5, xl: 1 },
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

          GridProps: { xs: 12, sm: 5, md: 3, lg: 3, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "CASH_AMT",
          label: "Cash",
          placeholder: "",
          type: "text",
          required: true,
          FormatProps: {
            allowNegative: false,
          },
          // postValidationSetCrossFieldValues: async (...arr) => {
          //   if (arr[0].value) {
          //     return {
          //       TOTAL_FD_AMOUNT: { value: arr[0].value ?? "0" },
          //     };
          //   } else {
          //     return {
          //       TOTAL_FD_AMOUNT: { value: "" },
          //     };
          //   }
          // },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 3.5, md: 2.3, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "FD_AMOUNT",
          label: "Transfer Amount",
          placeholder: "",
          type: "text",
          required: true,
          FormatProps: {
            allowNegative: false,
          },
          validationRun: "all",
          validate: (columnValue) => {
            if (!Boolean(columnValue.value)) {
              return "Transfer Amount is Required.";
            } else if (columnValue.value <= 0) {
              return "Transfer Amount must be greater than zero.";
            }
            return "";
          },
          // postValidationSetCrossFieldValues: async (...arr) => {
          //   if (arr[0].value) {
          //     return {
          //       TOTAL_FD_AMOUNT: { value: arr[0].value ?? "0" },
          //     };
          //   } else {
          //     return {
          //       TOTAL_FD_AMOUNT: { value: "" },
          //     };
          //   }
          // },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 3.5, md: 2.3, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "TRAN_DT",
          label: "AsOn Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          defaultValue: new Date(),
          type: "text",
          fullWidth: true,
          maxDate: new Date(),
          maxLength: 6,
          defaultfocus: true,
          required: true,
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "PERIOD_NO",
            "PERIOD_CD",
            "FD_AMOUNT",
            "TRAN_DT_DISABLED",
            "FROM_TRAN_DT",
            "TO_TRAN_DT",
          ],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.TRAN_DT_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            let postData = await GeneralAPI.getFDInterest(
              currField,
              dependentFields
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["AsOn Date is required."] },
              { name: "TRAN_DT", params: ["AsOn Date is required."] },
            ],
          },
          validate: (currField, dependentFields) => {
            const newDependentField: any =
              utilFunction.getDependetFieldDataArrayField(dependentFields);
            let tranDate: any = format(currField?.value, "yyyy/MM/dd");
            let fromTranDate = newDependentField?.FROM_TRAN_DT?.value;
            let toTranDate = newDependentField?.TO_TRAN_DT?.value;

            if (utilFunction.isValidDate(fromTranDate)) {
              fromTranDate = format(new Date(fromTranDate), "yyyy/MM/dd");
              if (
                !greaterThanDate(new Date(tranDate), new Date(fromTranDate))
              ) {
                // Calculate the difference in milliseconds
                var diffms =
                  new Date(toTranDate).getTime() -
                  new Date(fromTranDate).getTime();
                // Convert milliseconds to days
                var diffDays = Math.ceil(diffms / (1000 * 60 * 60 * 24));
                return (
                  "AsOn Date should not be less than " + diffDays + " days."
                );
              }
            }
            if (utilFunction.isValidDate(toTranDate)) {
              toTranDate = format(new Date(toTranDate), "yyyy/MM/dd");
              if (
                toTranDate &&
                !lessThanInclusiveDate(new Date(tranDate), new Date(toTranDate))
              ) {
                return "AsOn Date should be less Than or equal to working Date.";
              }
            }
            return "";
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 3.5, md: 2.1, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "PERIOD_CD",
          label: "Period/Tenor",
          disableCaching: true,
          options: (...arg) => {
            if (
              Boolean(arg?.[3]?.companyID) &&
              Boolean(arg?.[2]?.["TRNDTLS.LEAN_BRANCH_CD"]?.value) &&
              Boolean(arg?.[3]?.user?.id)
            ) {
              return API.getPeriodDDWData({
                COMP_CD: arg?.[3]?.companyID ?? "",
                BRANCH_CD: arg?.[2]?.["TRNDTLS.LEAN_BRANCH_CD"]?.value ?? "",
                ACCT_TYPE: "",
              });
            } else {
              return [];
            }
          },
          _optionsKey: "getPeriodDDWData",
          defaultValue: "D",
          required: true,
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_NO",
            "FD_AMOUNT",
          ],
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            let postData = await GeneralAPI.getFDInterest(
              currField,
              dependentFields
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Period/Tenor is required."] },
              { name: "PERIOD_CD", params: ["Please select Period/Tenor"] },
            ],
          },
          __VIEW__: {
            isReadOnly: true,
            postValidationSetCrossFieldValues: () => {},
            options: () => {},
            _optionsKey: "",
          },
          GridProps: { xs: 12, sm: 3.5, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PERIOD_NO",
          label: "Tenor",
          className: "textInputFromRight",
          placeholder: "",
          maxLength: 4,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 4) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
            isValidation: "no",
          },
          required: true,
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_CD",
            "FD_AMOUNT",
          ],
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            let postData = await GeneralAPI.getFDInterest(
              currField,
              dependentFields
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Tenor is Required."] }],
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 2.5, md: 1.8, lg: 1.4, xl: 1.5 },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "INT_RATE",
          label: "Interest Rate",
          placeholder: "",
          required: true,
          type: "text",
          dependentFields: ["INT_RATE_DISABLED"],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.INT_RATE_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          postValidationSetCrossFieldValues: async (currField) => {
            if (Boolean(currField?.value) && currField?.value > 0) {
              return {
                GETFDMATUREAMOUNT: {
                  value: new Date().getTime(),
                },
              };
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Rate is Required."] },
            ],
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 2.5, md: 1.8, lg: 1.4, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "TERM_CD",
          label: "Interest Term",
          disableCaching: true,
          options: API.getFDIntTermDDWData,
          _optionsKey: "getFDIntTermDDWData",
          required: true,
          dependentFields: ["TERM_CD_DISABLED"],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.TERM_CD_DISABLED"]?.value === "Y"
            ) {
              return true;
            } else {
              return false;
            }
          },
          postValidationSetCrossFieldValues: async (currField) => {
            if (Boolean(currField?.value)) {
              return {
                GETFDMATUREAMOUNT: {
                  value: new Date().getTime(),
                },
              };
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Term is required."] },
              { name: "TERM_CD", params: ["Please select Interest Term"] },
            ],
          },
          __VIEW__: {
            isReadOnly: true,
            postValidationSetCrossFieldValues: () => {},
            options: () => {},
            _optionsKey: "",
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MONTHLY_INT",
          label: "Month Interest",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.9, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "MATURITY_DT",
          label: "Maturity Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CR_COMP_CD",
        },

        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "CR_BRANCH_CD",
            label: "Credit A/c Branch",
            required: false,
            schemaValidation: {},
            dependentFields: ["MATURE_INST"],
            runPostValidationHookAlways: true,
            postValidationSetCrossFieldValues: (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              return {
                CR_ACCT_TYPE: { value: "" },
                CR_ACCT_CD: { value: "", ignoreUpdate: true },
                CR_ACCT_NM: { value: "" },
              };
            },
            validate: (currField, dependentFields) => {
              const depFields =
                utilFunction.getDependetFieldDataArrayField(dependentFields);
              const matureInst = depFields?.["MATURE_INST"]?.value ?? "";
              if (matureInst !== "AM" && matureInst !== "NO") {
                if (!Boolean(currField?.value ?? "")) {
                  return "Credit A/c Branch Can't be blank.";
                }
              }
              return "";
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (formState?.screenFlag === "openLienForm") {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.8, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "CR_ACCT_TYPE",
            label: "Credit A/c Type",
            required: false,
            dependentFields: ["MATURE_INST", "CR_BRANCH_CD"],
            schemaValidation: {},
            options: (dependentValue, formState, _, authState) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                USER_NAME: authState?.user?.id ?? "",
                DOC_CD: "FDINSTRCRTYPE",
              });
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
                CR_ACCT_CD: { value: "", ignoreUpdate: true },
                CR_ACCT_NM: { value: "" },
              };
            },
            validate: (currField, dependentFields, formState) => {
              const depFields =
                utilFunction.getDependetFieldDataArrayField(dependentFields);
              const matureInst = depFields?.["MATURE_INST"]?.value ?? "";
              if (matureInst !== "AM" && matureInst !== "NO") {
                if (!Boolean(currField?.value ?? "")) {
                  return "Credit A/c Type Can't be blank.";
                }
              }
              return "";
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (formState?.screenFlag === "openLienForm") {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.8, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "CR_ACCT_CD",
            label: "Credit A/c No.",
            required: false,
            schemaValidation: {},
            dependentFields: [
              "COMP_CD",
              "CR_BRANCH_CD",
              "CR_ACCT_TYPE",
              "MATURE_INST",
            ],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              if (formState?.isSubmitting) return {};

              if (
                currentField?.value &&
                dependentFieldsValues?.["FDDTL.CR_BRANCH_CD"]?.value &&
                dependentFieldsValues?.["FDDTL.CR_ACCT_TYPE"]?.value
              ) {
                const reqParameters = {
                  BRANCH_CD:
                    dependentFieldsValues?.["FDDTL.CR_BRANCH_CD"]?.value,
                  COMP_CD: authState?.companyID,
                  ACCT_TYPE:
                    dependentFieldsValues?.["FDDTL.CR_ACCT_TYPE"]?.value,
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    currentField?.value,
                    dependentFieldsValues?.["FDDTL.CR_ACCT_TYPE"]?.optionData
                  ),
                  SCREEN_REF: "FD_CR_ACT",
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
                  CR_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldsValues?.CR_ACCT_TYPE?.optionData
                          ),
                          isFieldFocused: false,
                          ignoreUpdate: true,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: true,
                        },
                  CR_ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                  },
                };
              } else if (!currentField?.value) {
                return {
                  CR_ACCT_NM: { value: "" },
                };
              }
              return {};

              // const companyCode = arg?.[3]?.["FDDTL.COMP_CD"]?.value ?? "";
              // const branchCode = arg?.[3]?.["FDDTL.CR_BRANCH_CD"]?.value ?? "";
              // const accountType = arg?.[3]?.["FDDTL.CR_ACCT_TYPE"]?.value ?? "";
              // let accountCode = arg?.[0]?.value;
              // if (
              //   Boolean(companyCode) &&
              //   Boolean(branchCode) &&
              //   Boolean(accountType) &&
              //   accountCode
              // ) {
              //   accountCode = utilFunction.getPadAccountNumber(
              //     accountCode,
              //     arg?.[3]?.["FDDTL.CR_ACCT_TYPE"]?.optionData
              //   );
              //   const apiResponse = await validateAccountAndGetDetail(
              //     companyCode,
              //     branchCode,
              //     accountType,
              //     accountCode,
              //     "FD_CR_ACT"
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
              //       CR_ACCT_CD: {
              //         value: accountCode,
              //         isErrorBlank: true,
              //         ignoreUpdate: true,
              //       },
              //       CR_ACCT_NM: {
              //         value: apiResponse?.data?.[0]?.ACCT_NM ?? "",
              //       },
              //     };
              //   } else {
              //     return {
              //       CR_ACCT_CD: {
              //         value: "",
              //         error: apiResponse?.message ?? "",
              //         ignoreUpdate: true,
              //         isFieldFocused: true,
              //       },
              //       CR_ACCT_NM: { value: "" },
              //     };
              //   }
              // }
            },
            validate: (currField, dependentFields) => {
              const depFields =
                utilFunction.getDependetFieldDataArrayField(dependentFields);
              const matureInst = depFields?.["MATURE_INST"]?.value ?? "";
              if (matureInst !== "AM" && matureInst !== "NO") {
                if (!Boolean(currField?.value ?? "")) {
                  return "Credit Account Can't be blank.";
                }
              }
              return "";
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (formState?.screenFlag === "openLienForm") {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 4, md: 2.4, lg: 1.8, xl: 1 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CR_ACCT_NM",
          label: "Credit A/c Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4.5, md: 4, lg: 3, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MATURITY_AMT",
          label: "Maturity Amount",
          type: "text",
          required: true,
          FormatProps: {
            allowNegative: false,
          },
          dependentFields: ["MATURITY_AMT_DISABLED"],
          isReadOnly(_, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues?.["FDDTL.MATURITY_AMT_DISABLED"]?.value ===
                "Y" ||
              formState?.screenFlag === "openLienForm"
            ) {
              return true;
            } else {
              return false;
            }
          },
          validate: (columnValue) => {
            if (!Boolean(columnValue.value)) {
              return "Maturity Amount is Required.";
            } else if (columnValue.value <= 0) {
              return "Maturity Amount must be greater than zero.";
            }
            return "";
          },
          __VIEW__: { isReadOnly: true },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "MATURE_INST",
          label: "Mature Instruction",
          type: "text",
          dependentFields: ["BRANCH_CD", "ACCT_TYPE"],
          disableCaching: true,
          options: "getMatureInstDetail",
          fullWidth: true,
          schemaValidation: {
            type: "string",
            rules: [
              {
                name: "required",
                params: ["FD Mature Instruction is required."],
              },
              {
                name: "MATURE_INST",
                params: ["Please select FD Mature Instruction"],
              },
            ],
          },
          postValidationSetCrossFieldValues: async (currField) => {
            if (Boolean(currField?.value)) {
              return {
                CR_BRANCH_CD: {
                  isErrorBlank: true,
                },
                CR_ACCT_TYPE: {
                  isErrorBlank: true,
                },
                CR_ACCT_CD: {
                  isErrorBlank: true,
                },
              };
            }
          },
          isReadOnly(fieldData, dependentFieldsValues, formState) {
            if (formState?.screenFlag === "openLienForm") {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 4.5, md: 5, lg: 4, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "FD_REMARK",
          label: "FD Remark",
          type: "text",
          fullWidth: true,
          isReadOnly(fieldData, dependentFieldsValues, formState) {
            if (formState?.screenFlag === "openLienForm") {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 6, md: 5, lg: 4, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NOMINEE_NM",
          label: "Nominee Name",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "COMP_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CATEG_CD",
        },
        {
          render: {
            componentType: "textField",
          },
          name: "GETFDMATUREAMOUNT",
          validationRun: "all",
          shouldExclude() {
            return true;
          },
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "FD_AMOUNT",
            "PERIOD_CD",
            "PERIOD_NO",
            "TERM_CD",
            "INT_RATE",
            "MATURITY_DT",
          ],
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            if (!Boolean(dependentFields?.["FDDTL.TRAN_DT"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.FD_AMOUNT"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.PERIOD_CD"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.PERIOD_NO"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.TERM_CD"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.INT_RATE"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.MATURITY_DT"]?.value ?? ""))
              return {};
            const { data, status, message } = await AuthSDK.internalFetcher(
              "GETFDMATUREAMOUNT",
              {
                COMP_CD: dependentFields?.["FDDTL.COMP_CD"]?.value ?? "",
                BRANCH_CD: dependentFields?.["FDDTL.BRANCH_CD"]?.value ?? "",
                ACCT_TYPE: dependentFields?.["FDDTL.ACCT_TYPE"]?.value ?? "",
                ACCT_CD: dependentFields?.["FDDTL.ACCT_CD"]?.value ?? "",
                CATEG_CD: dependentFields?.["FDDTL.CATEG_CD"]?.value ?? "",
                TRAN_DT: dependentFields?.["FDDTL.TRAN_DT"]?.value ?? "",
                FD_AMOUNT: dependentFields?.["FDDTL.FD_AMOUNT"]?.value ?? "",
                PERIOD_CD: dependentFields?.["FDDTL.PERIOD_CD"]?.value ?? "",
                PERIOD_NO: dependentFields?.["FDDTL.PERIOD_NO"]?.value ?? "",
                TERM_CD: dependentFields?.["FDDTL.TERM_CD"]?.value ?? "",
                INT_RATE: dependentFields?.["FDDTL.INT_RATE"]?.value ?? "",
                MATURITY_DT: format(
                  dependentFields?.["FDDTL.MATURITY_DT"]?.value ?? "",
                  "dd/MMM/yyyy"
                ),
              }
            );
            if (status === "0") {
              return {
                MATURITY_AMT: {
                  value: data?.[0]?.MATURITY_AMT ?? "",
                },
                MONTHLY_INT: {
                  value: data?.[0]?.MONTHLY_INT ?? "",
                },
              };
            } else {
              return {
                MATURITY_AMT: {
                  value: "",
                },
                MONTHLY_INT: {
                  value: "",
                },
              };
            }
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "INT_RATE_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "MATURITY_AMT_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FD_NO_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TRAN_DT_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TERM_CD_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FROM_TRAN_DT",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TO_TRAN_DT",
        },

        {
          render: {
            componentType: "divider",
          },
          name: "LienSection",
          label: "Lien",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },

        {
          render: { componentType: "select" },
          name: "LIEN",
          label: "Lien",
          options: [
            { label: "No", value: "V" },
            { label: "Yes", value: "S" },
            { label: "N/A", value: "Y" },
          ],
          defaultValue: "S",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 0.8, xl: 0.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMARK",
          label: "Remark",
          type: "text",
          fullWidth: true,
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 5, md: 5, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "LEAN_COMP_CD",
          label: "Bank Code",
          type: "text",
          isReadOnly: true,
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 0.7, xl: 0.7 },
        },
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            name: "LEAN_BRANCH_CD",
            fullWidth: true,
            isFieldFocused: true,
            runPostValidationHookAlways: true,
            validationRun: "onChange",
            dependentFields: ["LIEN"],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              return {
                LEAN_ACCT_TYPE: { value: "" },
                LEAN_ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
              };
            },
            shouldExclude: (_, dependentFieldsValues, formState) => {
              if (formState?.screenFlag === "openLienForm") {
                return false;
              } else {
                return true;
              }
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDDTL.LIEN"]?.value === "V" ||
                dependentFieldsValues?.["FDDTL.LIEN"]?.value === "Y"
              ) {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "LEAN_ACCT_TYPE",
            dependentFields: ["LEAN_BRANCH_CD", "LIEN"],
            options: (dependentValue, formState, _, authState) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                USER_NAME: authState?.user?.id ?? "",
                DOC_CD: "FD_LIEN",
              });
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
                LEAN_ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
              };
            },
            fullWidth: true,
            shouldExclude: (_, dependentFieldsValues, formState) => {
              if (formState?.screenFlag === "openLienForm") {
                return false;
              } else {
                return true;
              }
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDDTL.LIEN"]?.value === "V" ||
                dependentFieldsValues?.["FDDTL.LIEN"]?.value === "Y"
              ) {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "LEAN_ACCT_CD",
            autoComplete: "off",
            dependentFields: ["LEAN_ACCT_TYPE", "LEAN_BRANCH_CD", "LIEN"],
            runPostValidationHookAlways: true,
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              if (formState?.isSubmitting) return {};
              if (
                currentField?.value &&
                dependentFieldsValues?.["FDDTL.LEAN_BRANCH_CD"]?.value &&
                dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]?.value
              ) {
                const reqParameters = {
                  BRANCH_CD:
                    dependentFieldsValues?.["FDDTL.LEAN_BRANCH_CD"]?.value ??
                    "",
                  COMP_CD: authState?.companyID ?? "",
                  ACCT_TYPE:
                    dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]?.value ??
                    "",
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    currentField?.value,
                    dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]?.optionData
                  ),
                  SCREEN_REF: "FD_LIEN",
                };
                let postData = await GeneralAPI.getAccNoValidation(
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
                  LEAN_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldsValues?.["FDDTL.LEAN_ACCT_TYPE"]
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
                  LEAN_ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                  },
                };
              } else if (!currentField?.value) {
                return {
                  LEAN_ACCT_NM: { value: "" },
                };
              }
              return {};
            },
            fullWidth: true,
            shouldExclude: (_, dependentFieldsValues, formState) => {
              if (formState?.screenFlag === "openLienForm") {
                return false;
              } else {
                return true;
              }
            },
            isReadOnly(fieldData, dependentFieldsValues, formState) {
              if (
                dependentFieldsValues?.["FDDTL.LIEN"]?.value === "V" ||
                dependentFieldsValues?.["FDDTL.LIEN"]?.value === "Y"
              ) {
                return true;
              } else {
                return false;
              }
            },
            GridProps: { xs: 12, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
          },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "LEAN_ACCT_NM",
          label: "AccountName",
          type: "text",
          isReadOnly: true,
          shouldExclude: (_, dependentFieldsValues, formState) => {
            if (formState?.screenFlag === "openLienForm") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
        },
      ],
    },
  ],
};
