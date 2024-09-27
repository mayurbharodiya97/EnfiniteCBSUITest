import { format, isValid } from "date-fns";
import * as API from "./api";
import { t } from "i18next";
import { DefaultValue } from "recoil";
let a = 1;

export const EMICalculateMetaData = {
  form: {
    name: "emiCalculator",
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
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      _accountNumber: {
        fullWidth: true,
      },
      arrayField: {
        fullWidth: true,
      },
      amountField: {
        fullWidth: true,
      },
      formbutton: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "autocomplete" },
      name: "INST_TYPE",
      label: "InstallmentType",
      placeholder: "InstallmentType",
      options: (authState) =>
        API.getEMIInstType({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "getEMIInstType",
      defaultValue: "1",
      GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LOAN_AMT",
      label: "LoanAmount",
      type: "text",
      fullWidth: true,
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("LoanAmountisrequired")] }],
      },
      GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "rateOfIntWithoutValidation",
      },
      name: "INT_RATE",
      label: "IntRate",
      type: "text",
      fullWidth: true,
      className: "textInputFromRight",
      required: true,
      FormatProps: {
        allowLeadingZeros: false,
        allowNegative: true,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("InterestRateisrequired")] }],
      },
      GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: { componentType: "autocomplete" },
      name: "DATA_VAL",
      label: "InterestFunded",
      placeholder: "InterestFunded",
      options: (authState) =>
        API.getEMICalcIntFund({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "getEMICalcIntFund",
      GridProps: { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "InstallmentDetails",
      label: "InstallmentDetails",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "select" },
      name: "INST_PERIOD",
      label: "Period",
      placeholder: "Period",
      options: (authState) =>
        API.getEMICalcPeriod({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "getEMICalcPeriod",
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: [t("InstallmentPeriodisrequired")] },
        ],
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromRight",
      name: "INST_NO",
      label: "No.",
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("NoofInstallmentisrequired")] }],
      },
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "spacer",
      GridProps: { xs: 0, sm: 0, md: 6, lg: 6, xl: 6 },
    },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "DISBURSE_TOTAL",
    //   label: "Total Loan Amount",
    //   placeholder: "",
    //   isReadOnly: true,
    //   type: "text",
    //   dependentFields: ["PAYSLIP_MST_DTL", "PAYSLIP_DRAFT_DTL"],
    //   textFieldStyle: {
    //     "& .MuiInputBase-root": {
    //       background: "var(--theme-color5)",
    //       color: "var(--theme-color2) !important",
    //     },
    //     "& .MuiInputBase-input": {
    //       background: "var(--theme-color5)",
    //       color: "var(--theme-color2) !important",
    //       "&.Mui-disabled": {
    //         color: "var(--theme-color2) !important",
    //         "-webkit-text-fill-color": "var(--theme-color2) !important",
    //       },
    //     },
    //   },
    //   GridProps: { xs: 3, sm: 3, md: 2, lg: 2, xl: 1.5 },
    // },
    // {
    //   render: {
    //     componentType: "numberFormat",
    //   },
    //   name: "REM_INST",
    //   label: "Remaining Installment",
    //   className: "textInputFromRight",
    //   type: "text",
    //   fullWidth: true,
    //   FormatProps: {
    //     allowNegative: false,
    //     allowLeadingZeros: false,
    //   },
    //   isReadOnly: true,
    //   textFieldStyle: {
    //     "& .MuiInputBase-root": {
    //       background: "var(--theme-color5)",
    //       color: "var(--theme-color2) !important",
    //     },
    //     "& .MuiInputBase-input": {
    //       background: "var(--theme-color5)",
    //       color: "var(--theme-color2) !important",
    //       "&.Mui-disabled": {
    //         color: "var(--theme-color2) !important",
    //         "-webkit-text-fill-color": "var(--theme-color2) !important",
    //       },
    //     },
    //   },
    //   GridProps: { xs: 3, sm: 3, md: 2, lg: 2, xl: 1.5 },
    // },
    {
      render: {
        componentType: "formbutton",
      },
      name: "calculate",
      label: "Calculate",
      type: "text",
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "clear",
      label: "Clear",
      type: "text",
      GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "DISBURS_DTL",
      isVisible: false,
      changeRowOrder: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "SR_NO",
          label: "SrNo",
          type: "text",
          className: "textInputFromRight",
          fullWidth: true,
          GridProps: { xs: 1, sm: 1, md: 0.5, lg: 0.5, xl: 0.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "DISBURSE_DATE",
          label: "DisburseDate",
          fullWidth: true,
          defaultValue: new Date(),
          GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
          runValidationOnDependentFieldsChange: false,
          dependentFields: [
            "INST_NO",
            "INST_TYPE",
            "INT_RATE",
            "INST_PERIOD",
            "DATA_VAL",
            "DISBURSE_TOTAL",
            "DISBURSE_AMT",
            "SR_NO",
            "INST_START_DT",
          ],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            // if (formState?.isSubmitting) return {};
            formState.setDataOnFieldChange("EMI_SCHEDULE", {});
            const refIDCurrent = formState.refID?.current;
            // console.log("refIDCurrent.DISBURSE_DATE",formState)

            const date = new Date(currentField?.value);
            const disburseDate = format(date, "dd/MMM/yyyy").toUpperCase();
            const inst_dt = new Date(
              dependentFieldValues?.["DISBURS_DTL.INST_START_DT"]?.value
            );
            const inst_start_dt = format(inst_dt, "dd/MMM/yyyy").toUpperCase();

            const prev_disburseDate =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent.DISBURSE_DATE;
            const prev_date =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : prev_disburseDate
                ? new Date(prev_disburseDate)
                : null;
            const prev_disburse_dt =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : prev_date
                ? format(prev_date, "dd/MMM/yyyy").toUpperCase()
                : null;

            const reqParameters = {
              A_FLAG: "DISBURSEMENT_DT",
              A_INST_NO: dependentFieldValues?.INST_NO?.value,
              A_INST_TYPE: dependentFieldValues?.INST_TYPE?.value,
              A_INT_RATE: dependentFieldValues?.INT_RATE?.value,
              A_INST_PERIOD: dependentFieldValues?.INST_PERIOD?.value,
              A_INT_SKIP_FLAG: dependentFieldValues?.DATA_VAL?.value,
              A_SR_CD: dependentFieldValues?.["DISBURS_DTL.SR_NO"]?.value,
              A_PREV_DISBUR_DT: prev_disburse_dt,
              A_DISBURSEMENT_DT: disburseDate,
              A_INST_START_DT: inst_start_dt,
              A_DISBURS_AMT:
                dependentFieldValues?.["DISBURS_DTL.DISBURSE_AMT"]?.value,
              A_TOT_LOAN_AMT: dependentFieldValues?.DISBURSE_TOTAL?.value,
              A_GD_DATE: authState?.workingDate,
              A_SCREEN_REF: "RPT/1199",
              A_LANG: "en",
              A_USER: authState?.user?.id,
              A_USER_LEVEL: authState?.role,
            };
            const postData = await API.validateDisburseDetail(reqParameters);
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.length; i++) {
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("ValidationFailed"),
                  message: postData[i]?.O_MESSAGE,
                });
                return {};
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("Confirmation"),
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  return {};
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Alert"),
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                return {};
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            return {
              // "EMI_DETAIL2[0].FROM_INST": {
              //   value: postData[0].FROM_INST,
              //   isFieldFocused: true,
              //   ignoreUpdate: true,
              // },
              // "EMI_DETAIL2[0].TO_INST": {
              //   value: postData[0].TO_INST,
              //   isFieldFocused: true,
              //   ignoreUpdate: true,
              // },
              // "EMI_DETAIL2[0].EMI_RS": {
              //   value: postData[0].EMI_RS,
              //   isFieldFocused: true,
              //   ignoreUpdate: true,
              // },
              // REM_INST: {
              //   value: postData[0].REM_INST,
              //   isFieldFocused: true,
              //   ignoreUpdate: true,
              // },
            };
          },
        },

        {
          render: {
            componentType: "datePicker",
          },
          name: "INST_START_DT",
          label: "InstStartDate",
          defaultValue: new Date(),
          type: "text",
          GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
          dependentFields: [
            "DISBURSE_DATE1",
            "INST_NO",
            "INST_TYPE",
            "INT_RATE",
            "INST_PERIOD",
            "DATA_VAL",
            "DISBURSE_TOTAL",
            "DISBURSE_AMT",
            "SR_NO",
          ],
          runValidationOnDependentFieldsChange: false,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            // formState.setDataOnFieldChange("EMI_SCHEDULE1", {});

            const refIDCurrent = formState.refID?.current;
            const date = new Date(currentField?.value);
            const inst_dt = format(date, "dd/MMM/yyyy").toUpperCase();
            const disburseDate = new Date(
              dependentFieldValues?.DISBURSE_DATE1?.value
            );
            const disburse_dt = format(
              disburseDate,
              "dd/MMM/yyyy"
            ).toUpperCase();
            const prev_disburseDate =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent.DISBURSE_DATE;
            const prev_date =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : prev_disburseDate
                ? new Date(prev_disburseDate)
                : null;
            const prev_disburse_dt =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : prev_date
                ? format(prev_date, "dd/MMM/yyyy").toUpperCase()
                : null;
            if (currentField?.value) {
              const reqParameters = {
                A_FLAG: "INST_START_DT",
                A_INST_NO: dependentFieldValues?.INST_NO?.value,
                A_INST_TYPE: dependentFieldValues?.INST_TYPE?.value,
                A_INT_RATE: dependentFieldValues?.INT_RATE?.value,
                A_INST_PERIOD: dependentFieldValues?.INST_PERIOD?.value,
                A_INT_SKIP_FLAG: dependentFieldValues?.DATA_VAL?.value,
                A_SR_CD: dependentFieldValues?.["DISBURS_DTL.SR_NO"]?.value,
                A_PREV_DISBUR_DT: prev_disburse_dt,
                A_DISBURSEMENT_DT: disburse_dt,
                A_INST_START_DT: inst_dt,
                A_DISBURS_AMT:
                  dependentFieldValues?.["DISBURS_DTL.DISBURSE_AMT"]?.value,
                A_TOT_LOAN_AMT: dependentFieldValues?.DISBURSE_TOTAL?.value,
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: "en",
                A_USER: authState?.user?.id,
                A_USER_LEVEL: authState?.role,
              };

              const postData = await API.validateDisburseDetail(reqParameters);
              let btn99, returnVal;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };

              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.O_STATUS === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("ValidationFailed"),
                    message: postData[i]?.O_MESSAGE,
                  });
                  return {};
                } else if (postData[i]?.O_STATUS === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Confirmation"),
                    message: postData[i]?.O_MESSAGE,
                    buttonNames: ["Yes", "No"],
                  });
                  btn99 = btnName;
                  if (btnName === "No") {
                    return {};
                  }
                } else if (postData[i]?.O_STATUS === "9") {
                  if (btn99 !== "No") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: t("Alert"),
                      message: postData[i]?.O_MESSAGE,
                    });
                  }
                  return {};
                } else if (postData[i]?.O_STATUS === "0") {
                  if (btn99 !== "No") {
                    returnVal = postData[i];
                  } else {
                    returnVal = "";
                  }
                }
              }
              return {
                //   "EMI_DETAIL2[0].FROM_INST": {
                //     value: postData[0].FROM_INST,
                //     isFieldFocused: true,
                //     ignoreUpdate: true,
                //   },
                //   "EMI_DETAIL2[0].TO_INST": {
                //     value: postData[0].TO_INST,
                //     isFieldFocused: true,
                //     ignoreUpdate: true,
                //   },
                //   "EMI_DETAIL2[0].EMI_RS": {
                //     value: postData[0].EMI_RS,
                //     isFieldFocused: true,
                //     ignoreUpdate: true,
                //   },
                //    REM_INST: {
                //   value: postData[0].REM_INST,
                //   isFieldFocused: true,
                //   ignoreUpdate: true,
                // },
              };
            }
          },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "DISBURSE_AMT",
          label: "LoanAmount",
          type: "text",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          fullWidth: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: [t("DisburseAmountisrequired")] },
            ],
          },
          GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
          dependentFields: [
            "DISBURSE_DATE1",
            "INST_NO",
            "INST_TYPE",
            "INT_RATE",
            "INST_PERIOD",
            "DATA_VAL",
            "DISBURSE_TOTAL",
            "SR_NO",
            "INST_START_DT1",
            "LOAN_AMT",
          ],

          setValueOnDependentFieldsChange: (dependentFields) => {
            let value = dependentFields?.LOAN_AMT?.value;
            return value;
          },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            // formState.setDataOnFieldChange("EMI_SCHEDULE1", {});
            const remaining_amt =
              dependentFieldValues.LOAN_AMT?.value - currentField.value == 0
                ? 0
                : dependentFieldValues.LOAN_AMT?.value - currentField.value;
            console.log(remaining_amt);
            const refIDCurrent = formState.refID?.current;
            const date = new Date(dependentFieldValues?.INST_START_DT1?.value);
            const inst_dt = format(date, "dd/MMM/yyyy").toUpperCase();
            const disburseDate = new Date(
              dependentFieldValues?.DISBURSE_DATE1?.value
            );
            const disburse_dt = format(
              disburseDate,
              "dd/MMM/yyyy"
            ).toUpperCase();
            const prev_disburseDate =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent.DISBURSE_DATE;
            const prev_date =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : prev_disburseDate
                ? new Date(prev_disburseDate)
                : null;
            const prev_disburse_dt =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : prev_date
                ? format(prev_date, "dd/MMM/yyyy").toUpperCase()
                : null;
            if (currentField?.value) {
              const reqParameters = {
                A_FLAG: "INST_START_DT",
                A_INST_NO: dependentFieldValues?.INST_NO?.value,
                A_INST_TYPE: dependentFieldValues?.INST_TYPE?.value,
                A_INT_RATE: dependentFieldValues?.INT_RATE?.value,
                A_INST_PERIOD: dependentFieldValues?.INST_PERIOD?.value,
                A_INT_SKIP_FLAG: dependentFieldValues?.DATA_VAL?.value,
                A_SR_CD: dependentFieldValues?.["DISBURS_DTL.SR_NO"]?.value,
                A_PREV_DISBUR_DT: prev_disburse_dt,
                A_DISBURSEMENT_DT: disburse_dt,
                A_INST_START_DT: inst_dt,
                A_DISBURS_AMT: currentField?.value,
                A_TOT_LOAN_AMT: dependentFieldValues?.DISBURSE_TOTAL?.value,
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: "en",
                A_USER: authState?.user?.id,
                A_USER_LEVEL: authState?.role,
              };

              const postData = await API.validateDisburseDetail(reqParameters);
              let btn99, returnVal;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };

              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.O_STATUS === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("ValidationFailed"),
                    message: postData[i]?.O_MESSAGE,
                  });
                  return {};
                } else if (postData[i]?.O_STATUS === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Confirmation"),
                    message: postData[i]?.O_MESSAGE,
                    buttonNames: ["Yes", "No"],
                  });
                  btn99 = btnName;
                  if (btnName === "No") {
                    return {};
                  }
                } else if (postData[i]?.O_STATUS === "9") {
                  if (btn99 !== "No") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: t("Alert"),
                      message: postData[i]?.O_MESSAGE,
                    });
                  }
                  return {};
                } else if (postData[i]?.O_STATUS === "0") {
                  if (btn99 !== "No") {
                    returnVal = postData[i];
                  } else {
                    returnVal = "";
                  }
                }
              }
              return {
                "EMI_DETAIL2[0].FROM_INST": {
                  value: postData[0].FROM_INST,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                "EMI_DETAIL2[0].TO_INST": {
                  value: postData[0].TO_INST,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                "EMI_DETAIL2[0].EMI_RS": {
                  value: postData[0].EMI_RS,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                REM_INST: {
                  value: postData[0].REM_INST,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                REMAINING_AMOUNT: {
                  value: remaining_amt,
                  ignoreUpdate: true,
                },
              };
            }
          },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "REMAINING_AMOUNT",
          label: "Remaning Amount",
          type: "text",
          className: "textInputFromRight",
          fullWidth: true,
          isReadOnly: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
          },
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TOTAL_AMOUNT",
          label: "Total Amount",
          type: "text",
          className: "textInputFromRight",
          fullWidth: true,
          isReadOnly: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
          },
          dependentFields: ["LOAN_AMT", "DISBURS_DTL"],
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
          setValueOnDependentFieldsChange: (dependentFields) => {
            let totalAmount = 0;

            if (dependentFields && dependentFields.LOAN_AMT) {
              dependentFields.LOAN_AMT.forEach((item) => {
                if (item && item.LOAN_AMT && item.LOAN_AMT.value) {
                  const loanAmount = parseFloat(item.LOAN_AMT.value);
                  if (!isNaN(loanAmount)) {
                    totalAmount += loanAmount;
                  }
                }
                console.log(totalAmount);
              });
            }
            return totalAmount;
          },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "UPDOWN",
          label: "Step up/down",
          endsIcon: "AddCircleOutlineRounded",
          rotateIcon: "scale(2)",
          placeholder: "",
          type: "text",
          tabIndex: "-1",
          iconStyle: {
            fontSize: "25px !important",
          },
          GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
        },
      ],
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "INST_START_DT1",
      label: "InstStartDate",
      placeholder: "Enter Remark",
      type: "text",
      GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
      dependentFields: ["DISBURS_DTL"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const emiDetail = dependentFields?.DISBURS_DTL?.[0] || {};
        const instStartDt = emiDetail.INST_START_DT?.value;
        return instStartDt || "Default Start Date";
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISBURSE_DATE1",
      label: "InstStartDate",
      placeholder: "Enter Remark",
      type: "text",
      GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
      dependentFields: ["DISBURS_DTL"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const emiDetail = dependentFields?.DISBURS_DTL?.[0] || {};
        const disburseDate = emiDetail.DISBURSE_DATE?.value;
        return disburseDate || "Default Disburse Date";
      },
    },
  ],
};

export const EMICalculatorSecondPartMetaData = {
  form: {
    name: "Standing Instruction Entry (TRN/394)",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    hideHeader: false,
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
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      _accountNumber: {
        fullWidth: true,
      },
      arrayField: {
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
        componentType: "arrayField",
      },
      name: "EMI_DETAIL2",
      changeRowOrder: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "SR_NO",
          label: "SrNo",
          type: "text",
          className: "textInputFromRight",
          defaultValue: 1,
          fullWidth: true,
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "FROM_INST",
          label: "FromInst",
          className: "textInputFromRight",
          type: "text",
          fullWidth: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          dependentFields: ["INST_NO", "TO_INST", "EMI_RS"],
          runPostValidationHookAlways: false,
          // AlwaysRunPostValidationSetCrossFieldValues: {
          //   alwaysRun: false,
          //   touchAndValidate: true,
          // },
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            // formState.setDataOnFieldChange("EMI_SCHEDULE", {});
            let refIDCurrent = formState.fromRefId.current;
            const prev_formInst =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent.FROM_INST;
            // let PREV_FROM_INST =
            //   refIDCurrent.FROM_INST ?? refIDCurrent.FROM_INST;
            console.log("refIDCurrent", refIDCurrent);
            console.log(prev_formInst);
            if (currentField?.value) {
              const reqParameters = {
                A_INST_NO: dependentFieldValues?.INST_NO?.value,
                A_FROM_INST: currentField?.value,
                A_TO_INST: dependentFieldValues?.["EMI_DETAIL2.TO_INST"]?.value,
                A_EMI_RS: dependentFieldValues?.["EMI_DETAIL2.EMI_RS"]?.value,
                A_PREV_FROM_INST: prev_formInst,
                A_FLAG: "FROM_INST",
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: "en",
                A_USER: authState?.user?.id,
                A_USER_LEVEL: authState?.role,
              };

              const postData = await API.validateCheckEmiSchedule(
                reqParameters
              );
              let btn99, returnVal;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };

              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.O_STATUS === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("ValidationFailed"),
                    message: postData[i]?.O_MESSAGE,
                  });
                  returnVal = "";
                } else if (postData[i]?.O_STATUS === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Confirmation"),
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
                      messageTitle: t("Alert"),
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
              return { isFieldFocused: false };
            }
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "TO_INST",
          label: "ToInst",
          type: "text",
          className: "textInputFromRight",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          fullWidth: true,
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
          // AlwaysRunPostValidationSetCrossFieldValues: {
          //   alwaysRun: true,
          //   touchAndValidate: false,
          // },
          runPostValidationHookAlways: false,
          dependentFields: ["FROM_INST", "EMI_RS", "INST_NO"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            // if (formState?.isSubmitting) return {};
            if (currentField?.value) {
              const reqParameters = {
                A_INST_NO: dependentFieldValues?.INST_NO?.value,
                A_FROM_INST:
                  dependentFieldValues?.["EMI_DETAIL2.FROM_INST"]?.value,
                A_TO_INST: currentField?.value,
                A_EMI_RS: dependentFieldValues?.["EMI_DETAIL2.EMI_RS"]?.value,
                A_PREV_FROM_INST: "1",
                A_FLAG: "TO_INST",
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: "en",
                A_USER: authState?.user?.id,
                A_USER_LEVEL: authState?.role,
              };

              const postData = await API.validateCheckEmiSchedule(
                reqParameters
              );
              let btn99, returnVal;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };

              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.O_STATUS === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("ValidationFailed"),
                    message: postData[i]?.O_MESSAGE,
                  });
                  returnVal = "";
                } else if (postData[i]?.O_STATUS === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Confirmation"),
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
                      messageTitle: t("Alert"),
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
              return {};
            }
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "NO_OF_INST",
          label: "NoofInstallment",
          className: "textInputFromRight",
          type: "text",
          fullWidth: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "EMI_RS",
          label: "InstallmentAmount",
          type: "text",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          fullWidth: true,
          GridProps: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2 },
          dependentFields: ["FROM_INST", "TO_INST", "INST_NO"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            // if (formState?.isSubmitting) return {};
            const reqParameters = {
              A_INST_NO: dependentFieldValues?.INST_NO?.value,
              A_FROM_INST:
                dependentFieldValues?.["EMI_DETAIL2.FROM_INST"]?.value,
              A_TO_INST: dependentFieldValues?.["EMI_DETAIL2.TO_INST"]?.value,
              A_EMI_RS: currentField?.value,
              A_PREV_FROM_INST: "1",
              A_FLAG: "EMI_RS",
              A_GD_DATE: authState?.workingDate,
              A_SCREEN_REF: "RPT/1199",
              A_LANG: "en",
              A_USER: authState?.user?.id,
              A_USER_LEVEL: authState?.role,
            };

            const postData = await API.validateCheckEmiSchedule(reqParameters);
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.length; i++) {
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("ValidationFailed"),
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("Confirmation"),
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
                    messageTitle: t("Alert"),
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
            return {};
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "REM_INST",
          label: "Remaining Installment",
          className: "textInputFromRight",
          type: "text",
          fullWidth: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
        },
      ],
    },
  ],
};

// export const EMICalculateMetaData1 = {
//   masterForm: {
//     form: {
//       name: "emicalculator",
//       label: "",
//       resetFieldOnUnmount: false,
//       validationRun: "onBlur",
//       render: {
//         ordering: "auto",
//         renderType: "simple",
//         gridConfig: {
//           item: {
//             xs: 12,
//             sm: 4,
//             md: 4,
//           },
//           container: {
//             direction: "row",
//             spacing: 1,
//           },
//         },
//       },
//     },
//     fields: [
//       {
//         render: {
//           componentType: "arrayField",
//         },
//         name: "DISBURS_DTL",
//         isVisible:false,
//         changeRowOrder: true,
//         GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
//         _fields: [
//           // {
//           //   render: {
//           //     componentType: "numberFormat",
//           //   },
//           //   name: "SR_NO",
//           //   label: "SrNo",
//           //   type: "text",
//           // className: "textInputFromRight",
//           //   fullWidth: true,
//           //   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//           // },
//           {
//             render: {
//               componentType: "datePicker",
//             },
//             name: "DISBURSE_DATE",
//             label: "Disburse Date",
//             type: "text",
//             fullWidth: true,
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },

//           {
//             render: {
//               componentType: "datePicker",
//             },
//             name: "INST_START_DATE",
//             label: "Inst. Start Date",
//             placeholder: "Enter Remark",
//             type: "text",
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           {
//             render: {
//               componentType: "amountField",
//             },
//             name: "LOAN_AMT",
//             label: "Loan Amount",
//             type: "text",
//             FormatProps: {
//               allowNegative: false,
//             },
//             fullWidth: true,
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           // {
//           //   render: {
//           //     componentType: "formbutton",
//           //   },
//           //   name: "ADDNEWROW",
//           //   label: "AddRow",
//           //   endsIcon: "AddCircleOutlineRounded",
//           //   rotateIcon: "scale(2)",
//           //   placeholder: "",
//           //   type: "text",
//           //   tabIndex: "-1",
//           //   iconStyle: {
//           //     fontSize: "25px !important",
//           //   },
//           //   __VIEW__: { render: { componentType: "hidden" } },
//           //   GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
//           // },
//           {
//               render: {
//                 componentType: "arrayField",
//               },
//               name: "EMI_DETAIL2",
//               changeRowOrder: true,
//               GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
//               _fields: [
//                 // {
//                 //   render: {
//                 //     componentType: "numberFormat",
//                 //   },
//                 //   name: "SR_NO",
//                 //   label: "SrNo",
//                 //   type: "text",
//                 // className: "textInputFromRight",
//                 //   fullWidth: true,
//                 //   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//                 // },
//                      {
//                   render: {
//                     componentType: "numberFormat",
//                   },
//                   name: "FROM_INST",
//                   label: "From Inst.",
//                   className: "textInputFromRight",
//                   type: "text",
//                   fullWidth: true,
//                   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//                 },
//                 {
//                   render: {
//                     componentType: "numberFormat",
//                   },
//                   name: "TO_INST",
//                   label: "To Inst.",
//                   type: "text",
//                   className: "textInputFromRight",
//                   fullWidth: true,
//                   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//                 },
//                 {
//                   render: {
//                     componentType: "numberFormat",
//                   },
//                   name: "NO_OF_INST",
//                   label: "No.of Installment",
//                   className: "textInputFromRight",
//                   type: "text",
//                   fullWidth: true,
//                   GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
//                 },
//                 {
//                   render: {
//                     componentType: "amountField",
//                   },
//                   name: "INST_AMOUNT",
//                   label: "Installment Amount",
//                   type: "text",
//                   FormatProps: {
//                     allowNegative: false,
//                   },
//                   fullWidth: true,
//                   GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//                 },
//               ],
//             },
//         ],

//       },
//     ],
//   },
//   detailsGrid: {
//     gridConfig: {
//       dense: true,
//       gridLabel: "Document Detail",
//       rowIdColumn: "id",
//       defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
//       allowColumnReordering: true,
//       hideHeader: true,
//       disableGroupBy: true,
//       enablePagination: false,
//       containerHeight: { min: "20vh", max: "29vh" },
//       // allowScroll:true,
//       allowRowSelection: false,
//       hiddenFlag: "_hidden",
//       disableLoader: false,
//     },
//     columns: [
//       {
//         accessor: "id",
//         columnName: "SrNo",
//         componentType: "default",
//         sequence: 1,
//         alignment: "center",
//         width: 75,
//         minWidth: 50,
//         maxWidth: 100,
//         isAutoSequence: true,
//       },
//       {
//         accessor: "FROM_INST",
//         columnName: "From Inst.",
//         componentType: "editableNumberFormat",
//         placeholder: " ",
//         className: "textInputFromRight",
//         sequence: 2,
//         alignment: "left",
//         width: 180,
//         minWidth: 160,
//         maxWidth: 200,
//         FormatProps: {
//           thousandSeparator: true,
//           thousandsGroupStyle: "lakh",
//           allowNegative: false,
//           allowLeadingZeros: false,
//           decimalScale: 2,
//           fixedDecimalScale: true,
//           isAllowed: (values) => {
//             if (values?.value?.length > 3) {
//               return false;
//             }
//             if (values.floatValue === 0) {
//               return false;
//             }
//             return true;
//           },
//         }
//         // isReadOnly: true,
//         // __EDIT__: { isReadOnly: false, componentType: "editableTextField" },
//       },
//        {
//         accessor: "TO_INST",
//         columnName: "To Inst.",
//         componentType: "editableNumberFormat",
//         className: "textInputFromRight",
//         placeholder: " ",
//         sequence: 3,
//         alignment: "left",
//         width: 180,
//         minWidth: 160,
//         maxWidth: 200,
//         FormatProps: {
//           thousandSeparator: true,
//           thousandsGroupStyle: "lakh",
//           allowNegative: false,
//           allowLeadingZeros: false,
//           decimalScale: 2,
//           fixedDecimalScale: true,
//           isAllowed: (values) => {
//             if (values?.value?.length > 3) {
//               return false;
//             }
//             if (values.floatValue === 0) {
//               return false;
//             }
//             return true;
//           },
//       }
//     },
//     {
//       accessor: "NO_OF_INST",
//       columnName: "No.of Installment",
//       componentType: "editableNumberFormat",
//       className: "textInputFromRight",
//       placeholder: " ",
//       sequence: 3,
//       alignment: "left",
//       width: 180,
//       minWidth: 160,
//       maxWidth: 200,
//       FormatProps: {
//         thousandSeparator: true,
//         thousandsGroupStyle: "lakh",
//         allowNegative: false,
//         allowLeadingZeros: false,
//         decimalScale: 2,
//         fixedDecimalScale: true,
//         isAllowed: (values) => {
//           if (values?.value?.length > 3) {
//             return false;
//           }
//           if (values.floatValue === 0) {
//             return false;
//           }
//           return true;
//         },
//     }
//   },
//       {
//         accessor: "LOAN_AMOUNT",
//         columnName: "Loan Amount",
//         componentType: "editableNumberFormat",
//         className: "textInputFromRight",
//         sequence: 3,
//         alignment: "right",
//         width: 180,
//         minWidth: 160,
//         placeholder: "0.00",
//         maxWidth: 200,
//         FormatProps: {
//           thousandSeparator: true,
//           thousandsGroupStyle: "lakh",
//           allowNegative: false,
//           allowLeadingZeros: false,
//           decimalScale: 2,
//           fixedDecimalScale: true,
//           isAllowed: (values) => {
//             if (values?.value?.length > 15) {
//               return false;
//             }
//             if (values.floatValue === 0) {
//               return false;
//             }
//             return true;
//           },
//         },
//       },
//       {
//         columnName: "Action",
//         componentType: "deleteRowCell",
//         accessor: "_hidden",
//         sequence: 5,
//       },
//     ],
//   },

// };
