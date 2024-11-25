import { format } from "date-fns";
import * as API from "./api";
import { t } from "i18next";
import i18n from "components/multiLanguage/languagesConfiguration";

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
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LOAN_AMT_MAIN",
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
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1, xl: 1 },
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
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
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
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "autocomplete" },
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
      render: { componentType: "numberFormat" },
      name: "INSTALLMENT_NO",
      label: "No.",
      required: true,
      type: "text",
      fullWidth: true,
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
      GridProps: { xs: 1, sm: 1, md: 9, lg: 9, xl: 9 },
    },
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
          GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "DISBURSEMENT_DT",
          label: "DisburseDate",
          fullWidth: true,
          defaultValue: new Date(),
          GridProps: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2 },
          runValidationOnDependentFieldsChange: false,
          dependentFields: [
            "INSTALLMENT_NO",
            "INST_TYPE",
            "INT_RATE",
            "INST_PERIOD",
            "DATA_VAL",
            "DISBURSE_TOTAL",
            "LOAN_AMT",
            "SR_NO",
            "INST_START_DT",
          ],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const refIDCurrent = formState?.refID?.current;
            const date = new Date(currentField?.value);
            if (isNaN(date.getTime())) {
              return {};
            }
            const disburseDate = format(date, "dd/MMM/yyyy").toUpperCase();
            const inst_dt = new Date(
              dependentFieldValues?.["DISBURS_DTL.INST_START_DT"]?.value
            );
            if (isNaN(inst_dt.getTime())) {
              return {};
            }
            const inst_start_dt = format(inst_dt, "dd/MMM/yyyy").toUpperCase();

            const prev_disburseDate =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent?.DISBURSEMENT_DT;
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
              A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
              A_INST_TYPE: dependentFieldValues?.INST_TYPE?.value,
              A_INT_RATE: dependentFieldValues?.INT_RATE?.value,
              A_INST_PERIOD: dependentFieldValues?.INST_PERIOD?.value,
              A_INT_SKIP_FLAG: dependentFieldValues?.DATA_VAL?.value,
              A_SR_CD: dependentFieldValues?.["DISBURS_DTL.SR_NO"]?.value,
              A_PREV_DISBUR_DT: prev_disburse_dt,
              A_DISBURSEMENT_DT: disburseDate,
              A_INST_START_DT: inst_start_dt,
              A_DISBURS_AMT:
                dependentFieldValues?.["DISBURS_DTL.LOAN_AMT"]?.value,
              A_TOT_LOAN_AMT: `${dependentFieldValues?.DISBURSE_TOTAL?.value}.00`,
              A_GD_DATE: authState?.workingDate,
              A_SCREEN_REF: "RPT/1199",
              A_LANG: i18n.resolvedLanguage,
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
              DISBURSEMENT_DT:
                returnVal !== ""
                  ? {
                      value: currentField?.value,
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
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
          GridProps: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2 },
          dependentFields: [
            "DISBURSE_DATE1",
            "INSTALLMENT_NO",
            "INST_TYPE",
            "INT_RATE",
            "INST_PERIOD",
            "DATA_VAL",
            "DISBURSE_TOTAL",
            "LOAN_AMT",
            "SR_NO",
          ],
          runValidationOnDependentFieldsChange: false,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
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
                : refIDCurrent.DISBURSEMENT_DT;
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
                A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
                A_INST_TYPE: dependentFieldValues?.INST_TYPE?.value,
                A_INT_RATE: dependentFieldValues?.INT_RATE?.value,
                A_INST_PERIOD: dependentFieldValues?.INST_PERIOD?.value,
                A_INT_SKIP_FLAG: dependentFieldValues?.DATA_VAL?.value,
                A_SR_CD: dependentFieldValues?.["DISBURS_DTL.SR_NO"]?.value,
                A_PREV_DISBUR_DT: prev_disburse_dt,
                A_DISBURSEMENT_DT: disburse_dt,
                A_INST_START_DT: inst_dt,
                A_DISBURS_AMT:
                  dependentFieldValues?.["DISBURS_DTL.LOAN_AMT"]?.value,
                A_TOT_LOAN_AMT: `${dependentFieldValues?.DISBURSE_TOTAL?.value}.00`,
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: i18n.resolvedLanguage,
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
                INST_START_DT:
                  returnVal !== ""
                    ? {
                        value: currentField?.value,
                        ignoreUpdate: true,
                        isFieldFocused: false,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
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
          name: "LOAN_AMT",
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
          GridProps: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2 },
          dependentFields: [
            "DISBURSE_DATE1",
            "INSTALLMENT_NO",
            "INST_TYPE",
            "INT_RATE",
            "INST_PERIOD",
            "DATA_VAL",
            "DISBURSE_TOTAL",
            "SR_NO",
            "INST_START_DT1",
            "LOAN_AMT_MAIN",
          ],

          setValueOnDependentFieldsChange: (dependentFields) => {
            let value = dependentFields?.LOAN_AMT_MAIN?.value;
            return value;
          },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
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
                : refIDCurrent.DISBURSEMENT_DT;
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
                A_FLAG: "LOAN_AMT",
                A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
                A_INST_TYPE: dependentFieldValues?.INST_TYPE?.value,
                A_INT_RATE: dependentFieldValues?.INT_RATE?.value,
                A_INST_PERIOD: dependentFieldValues?.INST_PERIOD?.value,
                A_INT_SKIP_FLAG: dependentFieldValues?.DATA_VAL?.value,
                A_SR_CD: dependentFieldValues?.["DISBURS_DTL.SR_NO"]?.value,
                A_PREV_DISBUR_DT: prev_disburse_dt,
                A_DISBURSEMENT_DT: disburse_dt,
                A_INST_START_DT: inst_dt,
                A_DISBURS_AMT: currentField?.value,
                A_TOT_LOAN_AMT: `${dependentFieldValues?.DISBURSE_TOTAL?.value}.00`,
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: i18n.resolvedLanguage,
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
                LOAN_AMT:
                  returnVal !== ""
                    ? {
                        value: currentField?.value,
                        ignoreUpdate: true,
                        isFieldFocused: false,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                "SCHEDULE_DTL[0].FROM_INST": {
                  value: postData[0].FROM_INST,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                "SCHEDULE_DTL[0].TO_INST": {
                  value: postData[0].TO_INST,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                "SCHEDULE_DTL[0].EMI_RS": {
                  value: postData[0].EMI_RS,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                "SCHEDULE_DTL[0].REM_INST": {
                  value: postData[0].REM_INST,
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            }
          },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "TOT_LOAN_AMT",
          label: "Total Loan Amount",
          dependentFields: ["DISBURSE_TOTAL"],
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
          setValueOnDependentFieldsChange: (dependentFields) => {
            const value = dependentFields?.DISBURSE_TOTAL?.value;
            return value;
          },
        },
      ],
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "INST_START_DT1",
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
      dependentFields: ["DISBURS_DTL"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const emiDetail = dependentFields?.DISBURS_DTL?.[0] || {};
        const disburseDate = emiDetail.DISBURSEMENT_DT?.value;
        return disburseDate || "Default Disburse Date";
      },
    },
    // eMI_dETAIL ARRAYFILED
    {
      render: {
        componentType: "arrayField",
      },
      name: "SCHEDULE_DTL",
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
          dependentFields: ["INSTALLMENT_NO", "TO_INST", "EMI_RS"],
          runPostValidationHookAlways: false,
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            let refIDCurrent = formState?.fromRefId?.current;
            const prev_formInst =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent.FROM_INST;
            if (currentField?.value) {
              const reqParameters = {
                A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
                A_FROM_INST: currentField?.value,
                A_TO_INST:
                  dependentFieldValues?.["SCHEDULE_DTL.TO_INST"]?.value,
                A_EMI_RS: dependentFieldValues?.["SCHEDULE_DTL.EMI_RS"]?.value,
                A_PREV_FROM_INST: prev_formInst,
                A_FLAG: "FROM_INST",
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: i18n.resolvedLanguage,
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
                  currentField.value = "";
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
              return {
                FROM_INST:
                  returnVal !== ""
                    ? {
                        value: currentField?.value,
                        ignoreUpdate: true,
                        isFieldFocused: false,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
              };
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
          runPostValidationHookAlways: false,
          dependentFields: ["FROM_INST", "EMI_RS", "INSTALLMENT_NO"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            let refIDCurrent = formState?.fromRefId?.current;
            const prev_formInst =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent.FROM_INST;
            if (currentField?.value) {
              const reqParameters = {
                A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
                A_FROM_INST:
                  dependentFieldValues?.["SCHEDULE_DTL.FROM_INST"]?.value,
                A_EMI_RS: dependentFieldValues?.["SCHEDULE_DTL.EMI_RS"]?.value,
                A_TO_INST: currentField?.value,
                A_PREV_FROM_INST: prev_formInst,
                A_FLAG: "TO_INST",
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: i18n.resolvedLanguage,
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
              return {
                TO_INST:
                  returnVal !== ""
                    ? {
                        value: currentField?.value,
                        ignoreUpdate: true,
                        isFieldFocused: false,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
              };
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
          idReadOnly: true,
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
          dependentFields: ["TO_INST", "FROM_INST"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const fromInst =
              parseInt(dependentFields?.["SCHEDULE_DTL.FROM_INST"]?.value) || 0;
            const toInst =
              parseInt(dependentFields?.["SCHEDULE_DTL.TO_INST"]?.value) || 0;
            if (fromInst === 0 && toInst === 0) {
              return 0;
            }
            const noOfInst = Math.max(0, toInst - fromInst + 1);
            return `${noOfInst}`;
          },
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
          dependentFields: ["FROM_INST", "TO_INST", "INSTALLMENT_NO"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            let refIDCurrent = formState?.fromRefId?.current;
            const prev_formInst =
              refIDCurrent === null || refIDCurrent === undefined
                ? ""
                : refIDCurrent.FROM_INST;
            if (currentField?.value) {
              const reqParameters = {
                A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
                A_TO_INST:
                  dependentFieldValues?.["SCHEDULE_DTL.TO_INST"]?.value,
                A_FROM_INST:
                  dependentFieldValues?.["SCHEDULE_DTL.FROM_INST"]?.value,
                A_EMI_RS: currentField?.value,
                A_PREV_FROM_INST: prev_formInst,
                A_FLAG: "EMI_RS",
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: i18n.resolvedLanguage,
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
              return {
                EMI_RS:
                  returnVal !== ""
                    ? {
                        value: currentField?.value,
                        ignoreUpdate: true,
                        isFieldFocused: false,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
              };
            }
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TOT_INST",
          label: "Total No. of Intstallment",
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
          dependentFields: ["TOT_INSTALLMENT"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let totalValue = dependentFields?.TOT_INSTALLMENT?.value;
            return totalValue;
          },
        },
      ],
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "spacer2",
      GridProps: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "REMAINING_AMOUNT",
      label: "Remaining Amount",
      type: "text",
      className: "textInputFromRight",
      fullWidth: true,
      isReadOnly: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
      },
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
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
      dependentFields: ["DISBURSE_TOTAL", "LOAN_AMT_MAIN"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const loanAmtMain = dependentFields.LOAN_AMT_MAIN?.value || 0;
        const disburseTotal = dependentFields.DISBURSE_TOTAL?.value || 0;
        let remaining_amt = loanAmtMain - disburseTotal;
        if (disburseTotal > loanAmtMain) {
          return -Math.abs(remaining_amt);
        }
        return remaining_amt;
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "DISBURSE_TOTAL",
      label: "Total Loan Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      dependentFields: ["DISBURS_DTL"],
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
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
      setValueOnDependentFieldsChange: (dependentFields) => {
        let totalValue = 0;
        dependentFields.DISBURS_DTL.forEach((row) => {
          const amount = parseFloat(row?.LOAN_AMT?.value) || 0;
          totalValue += amount;
        });
        return totalValue;
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "TOT_INSTALLMENT",
      label: "Total No. of Intstallment",
      className: "textInputFromRight",
      type: "text",
      fullWidth: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
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
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
      dependentFields: ["SCHEDULE_DTL"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let totalValue = 0;
        dependentFields.SCHEDULE_DTL.forEach((row) => {
          const amount = parseFloat(row?.NO_OF_INST?.value) || 0;
          totalValue += amount;
        });
        return `${totalValue}`;
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
      name: "SCHEDULE_DTL",
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
          dependentFields: ["INSTALLMENT_NO", "TO_INST", "EMI_RS"],
          runPostValidationHookAlways: false,
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            let refIDCurrent = formState.fromRefId.current;
            const prev_formInst =
              refIDCurrent === null || refIDCurrent === undefined
                ? "1"
                : refIDCurrent.FROM_INST;
            if (currentField?.value) {
              const reqParameters = {
                A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
                A_FROM_INST: currentField?.value,
                A_TO_INST:
                  dependentFieldValues?.["SCHEDULE_DTL.TO_INST"]?.value,
                A_EMI_RS: dependentFieldValues?.["SCHEDULE_DTL.EMI_RS"]?.value,
                A_PREV_FROM_INST: prev_formInst,
                A_FLAG: "FROM_INST",
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: i18n.resolvedLanguage,
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
          runPostValidationHookAlways: false,
          dependentFields: ["FROM_INST", "EMI_RS", "INSTALLMENT_NO"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (currentField?.value) {
              const reqParameters = {
                A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
                A_FROM_INST:
                  dependentFieldValues?.["SCHEDULE_DTL.FROM_INST"]?.value,
                A_TO_INST: currentField?.value,
                A_EMI_RS: dependentFieldValues?.["SCHEDULE_DTL.EMI_RS"]?.value,
                A_PREV_FROM_INST: "1",
                A_FLAG: "TO_INST",
                A_GD_DATE: authState?.workingDate,
                A_SCREEN_REF: "RPT/1199",
                A_LANG: i18n.resolvedLanguage,
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
          dependentFields: ["FROM_INST", "TO_INST", "INSTALLMENT_NO"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const reqParameters = {
              A_INST_NO: dependentFieldValues?.INSTALLMENT_NO?.value,
              A_FROM_INST:
                dependentFieldValues?.["SCHEDULE_DTL.FROM_INST"]?.value,
              A_TO_INST: dependentFieldValues?.["SCHEDULE_DTL.TO_INST"]?.value,
              A_EMI_RS: currentField?.value,
              A_PREV_FROM_INST: "1",
              A_FLAG: "EMI_RS",
              A_GD_DATE: authState?.workingDate,
              A_SCREEN_REF: "RPT/1199",
              A_LANG: i18n.resolvedLanguage,
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
//             name: "DISBURSEMENT_DT",
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
//               name: "SCHEDULE_DTL",
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
