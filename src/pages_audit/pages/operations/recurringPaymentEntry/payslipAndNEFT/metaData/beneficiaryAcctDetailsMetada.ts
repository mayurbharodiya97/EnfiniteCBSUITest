import * as API from "../api";

export const BeneficiaryAcctDetailsFormMetaData = {
  form: {
    name: "BeneficiaryAcctDetails",
    label: "Beneficiary A/c Details",
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
      checkbox: {
        fullWidth: true,
      },
    },
  },

  fields: [
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER",
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
      dependentFields: ["BENEFIACCTDTL"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let amount = (
          Array.isArray(dependentFieldsValues?.["BENEFIACCTDTL"])
            ? dependentFieldsValues?.["BENEFIACCTDTL"]
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
      name: "BENEFIACCTDTL",
      isScreenStyle: true,
      displayCountName: "Beneficiary A/c Detail",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      addRowFn: (data) => {
        const dataArray = Array.isArray(data?.BENEFIACCTDTL)
          ? data?.BENEFIACCTDTL
          : [];
        if (dataArray?.length > 0) {
          for (let i = 0; i < dataArray?.length; i++) {
            const item = dataArray[0];
            if (item.TO_ACCT_NO.trim() && item.AMOUNT.trim()) {
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
            componentType: "spacer",
          },
          name: "DD_REQUEST_SPACER",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            return formState?.NEFTFlagsData?.[0]?.DD_REQ_VISIBLE === "Y"
              ? true
              : false;
          },
          GridProps: { xs: 12, sm: 6, md: 2.2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "BENEFICIARY_SPACER",
          shouldExclude: (_, dependentFieldsValues, formState) => {
            return formState?.NEFTFlagsData?.[0]?.VISIBLE_BNFCRY_YN === "Y"
              ? true
              : false;
          },
          GridProps: { xs: 12, sm: 6, md: 1.8, lg: 1.5, xl: 1.5 },
        },
        {
          render: { componentType: "checkbox" },
          name: "DD_REQUEST",
          label: "DD Request",
          defaultValue: false,
          shouldExclude: (_, dependentFieldsValues, formState) => {
            return formState?.NEFTFlagsData?.[0]?.DD_REQ_VISIBLE === "N"
              ? true
              : false;
          },
          GridProps: { xs: 12, sm: 6, md: 2.2, lg: 1.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "autocomplete",
          },
          name: "TO_ACCT_NO",
          label: "Account Number",
          placeholder: "Select Account Number",
          dependentFields: ["BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
          options: async (dependentValue, formState, _, authState) => {
            return API.getRtgsBenfDtlList({
              COMP_CD: authState?.companyID,
              BRANCH_CD:
                dependentValue?.BRANCH_CD?.value ??
                authState?.user?.branchCode ??
                "",
              ACCT_TYPE:
                formState?.NEFTFlagsData?.[0]?.PARA_BNFCRY === "Y"
                  ? dependentValue?.ACCT_TYPE?.value ?? ""
                  : "",
              ACCT_CD:
                formState?.NEFTFlagsData?.[0]?.PARA_BNFCRY === "Y"
                  ? dependentValue?.ACCT_CD?.value ?? ""
                  : "",
              FLAG: formState?.NEFTFlagsData?.[0]?.PARA_BNFCRY ?? "",
            });
          },

          _optionsKey: "getRtgsBenfDtlList",
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (
              currentField?.value &&
              currentField?.optionData &&
              currentField?.optionData?.length > 0
            ) {
              let validateIFSC = await API.getIfscBenDetail({
                IFSC_CODE: currentField?.optionData?.[0]?.TO_IFSCCODE,
                ENTRY_TYPE: formState?.ENTRY_TYPE,
              });

              if (validateIFSC?.[0]?.O_STATUS === "999") {
                let buttonName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: validateIFSC?.[0]?.O_MESSAGE,
                  buttonNames: ["Ok"],
                });
                if (buttonName === "Ok") {
                  return {
                    TO_ACCT_NO: {
                      value: "",
                      isFieldFocused: true,
                    },
                    TO_ACCT_NM: { value: "" },
                    TO_ACCT_TYPE: {
                      value: "",
                    },
                    CONTACT_NO: {
                      value: "",
                    },
                    TO_EMAIL_ID: { value: "" },
                    TO_ADD1: { value: "" },
                    TO_IFSCCODE: { value: "" },
                    BANK_NM: { value: "" },
                    BRANCH_NM: { value: "" },
                    CONTACT_DTL: { value: "" },
                    CENTRE_NM: { value: "" },
                    ADDR: { value: "" },
                    DISTRICT_NM: { value: "" },
                    STATE_NM: { value: "" },
                  };
                }
              } else if (validateIFSC?.[0]?.O_STATUS === "0") {
                let postData = await API.getIfscBankDetail({
                  AS_VALUE: currentField?.optionData?.[0]?.TO_IFSCCODE ?? "",
                  FLAG: "I",
                });

                return {
                  TO_ACCT_NM: {
                    value: currentField.optionData[0].TO_ACCT_NM ?? "",
                  },
                  TO_ACCT_TYPE: {
                    value: currentField.optionData[0].TO_ACCT_TYPE ?? "",
                  },
                  CONTACT_NO: {
                    value: currentField.optionData[0].TO_CONTACT_NO ?? "",
                  },
                  TO_EMAIL_ID: {
                    value: currentField.optionData[0].TO_EMAIL_ID ?? "",
                  },
                  TO_ADD1: { value: currentField.optionData[0].TO_ADD1 ?? "" },
                  TO_IFSCCODE: { value: postData?.[0].IFSC_CODE ?? "" },
                  BANK_NM: { value: postData?.[0].BANK_NM ?? "" },
                  BRANCH_NM: { value: postData?.[0].BRANCH_NM ?? "" },
                  CONTACT_DTL: { value: postData?.[0].CONTACT_DTL ?? "" },
                  CENTRE_NM: { value: postData?.[0].CENTRE_NM ?? "" },
                  ADDR: { value: postData?.[0].ADD1 ?? "" },
                  DISTRICT_NM: { value: postData?.[0].DISTRICT_NM ?? "" },
                  STATE_NM: { value: postData?.[0].STATE_NM ?? "" },
                };
              }
            } else if (!currentField?.value) {
              return {
                TO_ACCT_NM: { value: "" },
                TO_ACCT_TYPE: { value: "" },
                CONTACT_NO: { value: "" },
                TO_EMAIL_ID: { value: "" },
                TO_ADD1: { value: "" },
                TO_IFSCCODE: { value: "" },
                BANK_NM: { value: "" },
                BRANCH_NM: { value: "" },
                CONTACT_DTL: { value: "" },
                CENTRE_NM: { value: "" },
                ADDR: { value: "" },
                DISTRICT_NM: { value: "" },
                STATE_NM: { value: "" },
              };
            }
          },
          runPostValidationHookAlways: true,
          disableCaching: true,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Account Number is required"] },
            ],
          },
          GridProps: {
            xs: 12,
            sm: 6,
            md: 3.4,
            lg: 3,
            xl: 3,
          },
        },

        {
          render: {
            componentType: "formbutton",
          },
          name: "BENEFICIARY",
          label: "Audit Trail",
          placeholder: "",
          type: "text",
          tabIndex: "-1",
          iconStyle: {
            fontSize: "25px !important",
          },
          shouldExclude: (_, dependentFieldsValues, formState) => {
            return formState?.NEFTFlagsData?.[0]?.VISIBLE_BNFCRY_YN === "Y"
              ? false
              : true;
          },
          GridProps: { xs: 12, sm: 6, md: 1.8, lg: 1.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_NM",
          label: "Name",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 4.6, lg: 3, xl: 3 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_TYPE",
          label: "Account Type",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "CONTACT_NO",
          label: "Mobile Number",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 3, lg: 1.9, xl: 1.9 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_EMAIL_ID",
          label: "Email ID",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 6, lg: 2.5, xl: 2.5 },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "Enter Amount",
          autoComplete: "off",
          maxLength: 12,
          FormatProps: {
            allowLeadingZeros: false,
            allowNegative: false,
            isAllowed: (currentField) => {
              //@ts-ignore
              if (currentField?.value?.length > 12) {
                return false;
              }
              if (currentField.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          required: true,
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
            md: 3,
            lg: 1.5,
            xl: 1.5,
          },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "TO_ADD1",
          label: "Address",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 5, lg: 3.1, xl: 3.1 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "REMARKS",
          label: "Remarks",
          placeholder: "Enter Remarks",
          type: "text",
          maxLength: 35,
          autoComplete: "off",
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 },
        },

        {
          render: {
            componentType: "divider",
          },
          label: "IFSC Bank Detail",
          name: "IFSCBankDetail",
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "TO_IFSCCODE",
          label: "IFSC",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 3, lg: 1.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "Bank",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 3, lg: 5, xl: 5 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_NM",
          label: "Branch",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 3, lg: 3.7, xl: 3.7 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT_DTL",
          label: "Contact",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 3, lg: 1.8, xl: 1.8 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "CENTRE_NM",
          label: "Center",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 3, lg: 2.2, xl: 2.2 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "ADDR",
          label: "Address",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 9, lg: 5.4, xl: 5.4 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "DISTRICT_NM",
          label: "District",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 6, lg: 2.2, xl: 2.2 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "STATE_NM",
          label: "State",
          type: "text",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 6, lg: 2.2, xl: 2.2 },
        },

        {
          render: {
            componentType: "divider",
          },
          label: "Favouring Detail",
          name: "FavouringDetail",
          dependentFields: ["DD_REQUEST"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            return Boolean(
              !dependentFieldsValues?.["BENEFIACCTDTL.DD_REQUEST"]?.value
            )
              ? true
              : false;
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "PAYEE_ACCT_CD",
          label: "Payee A/c No.",
          placeholder: "Enter Payee A/c No.",
          type: "text",
          maxLength: 20,
          fullWidth: true,
          autoComplete: false,
          dependentFields: ["DD_REQUEST"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            return Boolean(
              !dependentFieldsValues?.["BENEFIACCTDTL.DD_REQUEST"]?.value
            )
              ? true
              : false;
          },
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              if (values.floatValue === 0) {
                return true;
              }
              return true;
            },
          },
          GridProps: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
            xl: 3,
          },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "PAYEE_BANK",
          label: "Payee Bank",
          placeholder: "Enter Payee Bank",
          type: "text",
          maxLength: 50,
          autoComplete: false,
          dependentFields: ["DD_REQUEST"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            return Boolean(
              !dependentFieldsValues?.["BENEFIACCTDTL.DD_REQUEST"]?.value
            )
              ? true
              : false;
          },
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 50) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "PAYABLE_AT",
          label: "Payable At",
          placeholder: "Enter Payable At",
          type: "text",
          maxLength: 50,
          autoComplete: false,
          dependentFields: ["DD_REQUEST"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            return Boolean(
              !dependentFieldsValues?.["BENEFIACCTDTL.DD_REQUEST"]?.value
            )
              ? true
              : false;
          },
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 50) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "PAYEE_NAME",
          label: "Payee Name",
          placeholder: "Enter Payee Name",
          type: "text",
          maxLength: 50,
          autoComplete: false,
          dependentFields: ["DD_REQUEST"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            return Boolean(
              !dependentFieldsValues?.["BENEFIACCTDTL.DD_REQUEST"]?.value
            )
              ? true
              : false;
          },
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 50) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
        },
      ],
    },
  ],
};
