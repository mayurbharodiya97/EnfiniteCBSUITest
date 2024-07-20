import { GeneralAPI } from "registry/fns/functions";
import * as API from "../api";

export const PayslipAndDDFormMetaData = {
  form: {
    name: "PayslipAndDD",
    label: "Payslip & Demand Draft",
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
      autocomplete: {
        fullWidth: true,
      },
      numberFormat: {
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
        sm: 3,
        md: 7.2,
        lg: 8.2,
        xl: 8.8,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "PAYMENT_AMOUNT",
      label: "Payment Amount",
      placeholder: "",
      isReadOnly: true,
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
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 6, sm: 4.4, md: 2.4, lg: 1.9, xl: 1.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_AMOUNT",
      label: "Total Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      dependentFields: ["PAYSLIPDD"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let amount = (
          Array.isArray(dependentFieldsValues?.["PAYSLIPDD"])
            ? dependentFieldsValues?.["PAYSLIPDD"]
            : []
        ).reduce(
          (accum, obj) =>
            accum +
            Number(obj?.AMOUNT?.value ?? 0) +
            Number(obj?.COMMISSION?.value ?? 0) +
            Number(obj?.SERVICE_CHARGE?.value ?? 0),
          0
        );
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
      GridProps: { xs: 6, sm: 4.4, md: 2.4, lg: 1.9, xl: 1.6 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "BRANCH_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_TYPE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACCT_CD",
    },

    {
      render: {
        componentType: "arrayField",
      },
      name: "PAYSLIPDD",
      isScreenStyle: true,
      displayCountName: "Payslip & Demand Draft",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      removeRowFn: "deleteFormArrayFieldData",
      addRowFn: (data) => {
        const dataArray = Array.isArray(data?.PAYSLIPDD) ? data?.PAYSLIPDD : [];
        if (dataArray?.length > 0) {
          for (let i = 0; i < dataArray?.length; i++) {
            const item = dataArray[0];
            if (
              item.DEF_TRAN_CD.trim() &&
              item.INFAVOUR_OF.trim() &&
              item.AMOUNT.trim() &&
              item.PAYSLIP_NO.trim()
            ) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      },

      _fields: [
        {
          render: {
            componentType: "autocomplete",
          },
          name: "DEF_TRAN_CD",
          label: "Bill Type",
          placeholder: "Select Bill Type",
          required: true,
          defaultValue: "532",
          fullWidth: true,
          options: (dependentValue, formState, _, authState) => {
            return GeneralAPI.getCommTypeList({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              CODE: "DD",
            });
          },
          _optionsKey: "getCommonTypeList",
          isFieldFocused: true,
          runPostValidationHookAlways: true,
          dependentFields: ["PAYMENT_AMOUNT"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (
              currentField?.value &&
              formState?.accountDetailsForPayslip?.ACCT_TYPE &&
              formState?.accountDetailsForPayslip?.ACCT_CD &&
              dependentFieldsValues?.PAYMENT_AMOUNT?.value &&
              currentField?.optionData?.[0]?.TYPE_CD
            ) {
              const reqParams = {
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                ACCT_CD: formState?.accountDetailsForPayslip?.ACCT_CD,
                ACCT_TYPE: formState?.accountDetailsForPayslip?.ACCT_TYPE,
                DEF_TRAN_CD: currentField?.value,
                AMOUNT: dependentFieldsValues?.PAYMENT_AMOUNT?.value,
                TYPE_CD: currentField?.optionData?.[0]?.TYPE_CD,
                SCREEN_REF: formState?.accountDetailsForPayslip?.SCREEN_REF,
              };
              const gstApiData = await API.getCalculateGstDtl(reqParams);

              let amountValue =
                Number(dependentFieldsValues?.PAYMENT_AMOUNT?.value) -
                (Number(gstApiData?.[0]?.SERVICE_CHARGE) +
                  Number(gstApiData?.[0]?.COMMISSION));

              return {
                SERVICE_CHARGE: {
                  value: gstApiData?.[0]?.SERVICE_CHARGE ?? "",
                  ignoreUpdate: true,
                },
                COMMISSION: {
                  value: gstApiData?.[0]?.COMMISSION ?? "",
                  ignoreUpdate: true,
                },
                OTHER_COMISSION: {
                  value: gstApiData?.[0]?.OTHER_COMISSION ?? "",
                  ignoreUpdate: true,
                },
                TAX_RATE: {
                  value: gstApiData?.[0]?.TAX_RATE ?? "",
                  ignoreUpdate: true,
                },
                GST_ROUND: {
                  value: gstApiData?.[0]?.GST_ROUND ?? "",
                  ignoreUpdate: true,
                },
                AMOUNT: {
                  value: amountValue ?? "",
                  ignoreUpdate: true,
                },
              };
            } else if (!currentField?.value) {
              return {
                SERVICE_CHARGE: {
                  value: "",
                  ignoreUpdate: true,
                },
                COMMISSION: {
                  value: "",
                  ignoreUpdate: true,
                },
                REGION: {
                  value: "",
                },
                SIGNATURE1_CD: {
                  value: "",
                },
                SIGNATURE2_CD: {
                  value: "",
                },
              };
            }
            return {};
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Bill Type is required"] }],
          },
          GridProps: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 3,
          },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "TAX_RATE",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "GST_ROUND",
        },

        {
          render: {
            componentType: "autocomplete",
          },
          name: "INFAVOUR_OF",
          label: "Infavour Of",
          placeholder: "Select Infavour Of",
          options: API.getPayslipInfavourOfList,
          _optionsKey: "getPayslipInfavourOfList",
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (currentField?.value) {
              return {
                REGION: {
                  value: currentField?.optionData?.[0]?.REGION_NM ?? "",
                  ignoreUpdate: true,
                },
              };
            }
            return {};
          },
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Infavour Of is required"] }],
          },
          GridProps: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 3,
          },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "INSTRUCTION_REMARKS",
          label: "Instruction Remarks",
          placeholder: "Enter Instruction Remarks",
          type: "text",
          GridProps: { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "PAYSLIP_NO",
          label: "Payslip Number",
          placeholder: "Enter Payslip Number",
          type: "number",
          maxLength: 12,
          disableCaching: true,
          dependentFields: ["DEF_TRAN_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            return dependentFields["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]
              ?.MST_TRAN_CD
              ? dependentFields["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]
                  ?.MST_TRAN_CD
              : "";
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
              dependentFieldsValues?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]
                ?.BRANCH_CD &&
              dependentFieldsValues?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]
                ?.TYPE_CD
            ) {
              let reqParameters = {
                COMM_TYPE:
                  dependentFieldsValues?.["PAYSLIPDD.DEF_TRAN_CD"]
                    ?.optionData?.[0]?.TYPE_CD,
                PAYSLIP_NO: currentField?.value,
                SCREEN_REF: formState?.accountDetailsForPayslip?.SCREEN_REF,
              };
              let postData = await API.validatePayslipNo(reqParameters);

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
                    message: postData[i]?.O_MESSAGE,
                  });
                  returnVal = "";
                } else if (postData[i]?.O_STATUS === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Confirmation",
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
                      messageTitle: "Alert",
                      message: postData[i]?.O_MESSAGE,
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
                PAYSLIP_NO:
                  returnVal !== ""
                    ? {
                        value: returnVal ?? "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
              };
            } else if (!currentField?.value) {
              return {
                PAYSLIP_NO: { value: "", ignoreUpdate: true },
              };
            }
            return {};
          },
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Payslip Number is required"] },
            ],
          },
          FormatProps: {
            allowLeadingZeros: false,
            isAllowed: (values) => {
              //@ts-ignore
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "Enter Amount",
          autoComplete: "off",
          required: true,
          maxLength: 15,
          AlwaysRunPostValidationSetCrossFieldValues: {
            alwaysRun: false,
            touchAndValidate: false,
          },
          FormatProps: {
            allowLeadingZeros: false,
            allowNegative: false,
            isAllowed: (values) => {
              //@ts-ignore
              if (values?.value?.length > 15) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["DEF_TRAN_CD"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (
              currentField?.value &&
              formState?.accountDetailsForPayslip?.ACCT_TYPE &&
              formState?.accountDetailsForPayslip?.ACCT_CD
            ) {
              const reqParams = {
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                ACCT_CD: formState?.accountDetailsForPayslip?.ACCT_CD,
                ACCT_TYPE: formState?.accountDetailsForPayslip?.ACCT_TYPE,
                DEF_TRAN_CD:
                  dependentFieldsValues?.["PAYSLIPDD.DEF_TRAN_CD"]?.value ?? "",
                AMOUNT: currentField?.value,
                TYPE_CD:
                  dependentFieldsValues?.["PAYSLIPDD.DEF_TRAN_CD"]
                    ?.optionData?.[0]?.TYPE_CD ?? "",
                SCREEN_REF: formState?.accountDetailsForPayslip?.SCREEN_REF,
              };
              const gstApiData = await API.getCalculateGstDtl(reqParams);
              return {
                SERVICE_CHARGE: {
                  value: gstApiData?.[0]?.SERVICE_CHARGE ?? "",
                  ignoreUpdate: true,
                },
                COMMISSION: {
                  value: gstApiData?.[0]?.COMMISSION ?? "",
                  ignoreUpdate: true,
                },
                OTHER_COMISSION: {
                  value: gstApiData?.[0]?.OTHER_COMISSION ?? "",
                  ignoreUpdate: true,
                },
                TAX_RATE: {
                  value: gstApiData?.[0]?.TAX_RATE ?? "",
                  ignoreUpdate: true,
                },
                GST_ROUND: {
                  value: gstApiData?.[0]?.GST_ROUND ?? "",
                  ignoreUpdate: true,
                },
              };
            } else if (!currentField?.value) {
              return {
                COMMISSION: {
                  value: "",
                  ignoreUpdate: true,
                },
                REGION: {
                  value: "",
                },
              };
            }
            return {};
          },

          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Amount is required"] }],
          },
          validate: (currentField, dependentField) => {
            if (Number(currentField?.value) <= 0) {
              return "Amount should be greater than zero";
            }
            return "";
          },
          GridProps: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
            xl: 2.4,
          },
        },

        {
          render: {
            componentType: "autocomplete",
          },
          name: "REGION",
          label: "Region",
          placeholder: "Select Region",
          dependentFields: ["DEF_TRAN_CD"],
          disableCaching: true,
          options: (...arg) => {
            if (
              arg?.[3]?.user?.branchCode &&
              arg?.[3]?.companyID &&
              arg?.[2]?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]?.TYPE_CD
            ) {
              return API.getPayslipRegionList({
                BRANCH_CD: arg?.[3]?.user?.branchCode,
                COMP_CD: arg?.[3]?.companyID,
                FLAG: "R",
                COMM_TYPE_CD:
                  arg?.[2]?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]?.TYPE_CD,
              });
            } else {
              return [];
            }
          },

          _optionsKey: "getPayslipRegionList",
          GridProps: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
            xl: 2.4,
          },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "COMMISSION",
          label: "Commision",
          placeholder: "Enter Commision",
          autoComplete: "off",
          maxLength: 13,
          dependentFields: ["TAX_RATE", "GST_ROUND"],
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (currentField?.value) {
              let gstValue =
                dependentFieldsValues?.["PAYSLIPDD.GST_ROUND"]?.value === "3"
                  ? Math.floor(
                      (parseInt(currentField?.value) *
                        parseInt(
                          dependentFieldsValues?.["PAYSLIPDD.TAX_RATE"]?.value
                        )) /
                        100
                    ) ?? ""
                  : dependentFieldsValues?.["PAYSLIPDD.GST_ROUND"]?.value ===
                    "2"
                  ? Math.ceil(
                      (parseInt(currentField?.value) *
                        parseInt(
                          dependentFieldsValues?.["PAYSLIPDD.TAX_RATE"]?.value
                        )) /
                        100
                    ) ?? ""
                  : dependentFieldsValues?.["PAYSLIPDD.GST_ROUND"]?.value ===
                    "1"
                  ? Math.round(
                      (parseInt(currentField?.value) *
                        parseInt(
                          dependentFieldsValues?.["PAYSLIPDD.TAX_RATE"]?.value
                        )) /
                        100
                    ) ?? ""
                  : (parseInt(currentField?.value) *
                      parseInt(
                        dependentFieldsValues?.["PAYSLIPDD.TAX_RATE"]?.value
                      )) /
                      100 ?? "";
              return {
                SERVICE_CHARGE: {
                  value: gstValue ?? "",
                  ignoreUpdate: true,
                },
              };
            } else if (!currentField?.value) {
              return {
                SERVICE_CHARGE: {
                  value: "",
                },
              };
            }
            return {};
          },

          FormatProps: {
            allowLeadingZeros: false,
            allowNegative: false,
            isAllowed: (values) => {
              //@ts-ignore
              if (values?.value?.length > 13) {
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
            sm: 6,
            md: 3,
            lg: 2.4,
            xl: 2.4,
          },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "OTHER_COMISSION",
          label: "Other Commision",
          placeholder: "Enter Other Commision",
          autoComplete: "off",
          maxLength: 13,
          FormatProps: {
            allowLeadingZeros: false,
            allowNegative: false,
            isAllowed: (values) => {
              //@ts-ignore
              if (values?.value?.length > 13) {
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
            sm: 6,
            md: 3,
            lg: 2.4,
            xl: 2.4,
          },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "SERVICE_CHARGE",
          label: "GST",
          isReadOnly: true,
          GridProps: {
            xs: 12,
            sm: 6,
            md: 3,
            lg: 2.4,
            xl: 2.4,
          },
        },

        {
          render: {
            componentType: "autocomplete",
          },
          name: "COL_BANK_CD",
          label: "Bank Code",
          placeholder: "Select Bank Code",
          options: API.getPayslipBankCodeList,
          _optionsKey: "getPayslipBankCodeList",
          GridProps: {
            xs: 12,
            sm: 6,
            md: 3,
            lg: 2.4,
            xl: 2.4,
          },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "Bank Name",
          type: "text",
          dependentFields: ["COL_BANK_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            return dependentFields["PAYSLIPDD.COL_BANK_CD"]?.optionData?.[0]
              ?.BANK_NM
              ? dependentFields["PAYSLIPDD.COL_BANK_CD"]?.optionData?.[0]
                  ?.BANK_NM
              : "";
          },
          isReadOnly: true,
          GridProps: { xs: 12, sm: 6, md: 4, lg: 3.6, xl: 3.6 },
        },

        {
          render: {
            componentType: "autocomplete",
          },
          name: "SIGNATURE1_CD",
          label: "Signature 1",
          placeholder: "Select Signature 1",
          disableCaching: true,
          dependentFields: ["DEF_TRAN_CD"],
          options: (...arg) => {
            if (
              arg?.[3]?.user?.branchCode &&
              arg?.[3]?.companyID &&
              arg?.[2]?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]?.TYPE_CD
            ) {
              return API.getPayslipSignatureList({
                BRANCH_CD: arg?.[3]?.user?.branchCode,
                COMP_CD: arg?.[3]?.companyID,
                COMM_TYPE_CD:
                  arg?.[2]?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]?.TYPE_CD,
              });
            } else {
              return [];
            }
          },
          _optionsKey: "getPayslipSignatureList",
          GridProps: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 3,
          },
        },

        {
          render: {
            componentType: "autocomplete",
          },
          name: "SIGNATURE2_CD",
          label: "Signature 2",
          placeholder: "Select Signature 2",
          disableCaching: true,
          dependentFields: ["DEF_TRAN_CD"],
          options: (...arg) => {
            if (
              arg?.[3]?.user?.branchCode &&
              arg?.[3]?.companyID &&
              arg?.[2]?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]?.TYPE_CD
            ) {
              return API.getPayslipSignatureList({
                BRANCH_CD: arg?.[3]?.user?.branchCode,
                COMP_CD: arg?.[3]?.companyID,
                COMM_TYPE_CD:
                  arg?.[2]?.["PAYSLIPDD.DEF_TRAN_CD"]?.optionData?.[0]?.TYPE_CD,
              });
            } else {
              return [];
            }
          },
          _optionsKey: "getPayslipSignatureList",
          GridProps: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 3,
          },
        },
      ],
    },
  ],
};
