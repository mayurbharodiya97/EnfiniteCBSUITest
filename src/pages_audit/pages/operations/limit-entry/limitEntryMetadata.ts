import * as API from "./api";

export const limitEntryMetaData = {
  form: {
    name: "limitEntry",
    label: "Limit Entry",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    hideHeader: true,
    formStyle: {
      background: "white",
      height: "calc(100vh - 390px)",
      overflowY: "auto",
      overflowX: "hidden",
    },
    render: {
      ordering: "auto",
      // ordering: "sequence",
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
          height: "35vh",
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
    //     componentType: "_accountNumber",
    //   },
    //   // acctFieldPara: "2",
    //   // postValidationSetCrossFieldValues: "testingFn",
    //   // name: "ACCT_CD",
    // },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "FD_BRANCH_CD",
    //   label: "FD Branch",
    //   sequence: "9",
    //   GridProps: {
    //     xs: "12",
    //     md: "3",
    //     sm: "4",
    //     lg: "3",
    //     xl: "2",
    //   },
    // },
    {
      render: {
        componentType: "branchCode",
      },
      name: "BRANCH_CD",
      label: "Branch",
      placeholder: "Branch Code",
      type: "text",
      required: true,
      // isFieldFocused: true,
      // maxLength: 16,
      // options: GeneralAPI.getBranchCodeList,
      // _optionsKey: "getBranchCodeList",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Branch Code is required."] }],
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ACCT_TYPE",
      label: "AccountType",
      placeholder: "EnterAccountType",
      type: "text",
      required: true,

      isFieldFocused: true,
      // disableCaching: true,
      options: (dependentValue, formState, _, authState) => {
        return API.securityDropDownListType(
          authState?.user?.id,
          authState?.user?.branchCode,
          authState?.companyID
        );
      },
      _optionsKey: "securityDropDownListType",
      dependentFields: ["BRANCH_CD", "SECURITY_CD"],

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          return { ACCT_CD: { value: "" } };
        }
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account Type is required."] }],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "ACNo",
      placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account No. is required."] }],
      },
      dependentFields: ["ACCT_TYPE", "SECURITY_CD"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        console.log("<<<ppppppppp");
        if (field?.value) {
          let otherAPIRequestPara = {
            COMP_CD: authState?.companyID,
            ACCT_CD: field.value.padStart(6, "0").padEnd(20, " "),
            ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
            BRANCH_CD: authState?.user?.branchCode,
            GD_TODAY_DT: "17-Jan-2024",
            SCREEN_REF: "EMST/046",
          };
          let postData = await API.getLimitEntryData(otherAPIRequestPara);
          console.log("<<<postdata", postData);
          if (postData?.[0]?.MESSAGE1) {
            formState.setDataOnFieldChange("MESSAGES", {
              MESSAGES: postData?.[0]?.MESSAGE1,
              NSC_FD_BTN: true,
            });
            return {
              ACCT_NM: {
                value: postData?.[0]?.ACCT_NM,
              },
              TRAN_BAL: {
                value: postData?.[0]?.TRAN_BAL,
              },
              SANCTIONED_AMT: {
                value: postData?.[0]?.SANCTIONED_AMT,
              },
              BRANCH_CD: {
                value: postData?.[0]?.BRANCH_CD,
              },
              HIDDEN_CHARGE_AMT: {
                value: postData?.[0]?.CHARGE_AMT,
              },
              HIDDEN_GST_AMT: {
                value: postData?.[0]?.GST_AMT,
              },
              HIDDEN_GST_ROUND: {
                value: postData?.[0]?.GST_ROUND,
              },
              HIDDEN_TAX_RATE: {
                value: postData?.[0]?.TAX_RATE,
              },
            };
          } else if (postData?.[0]?.RESTRICTION) {
            formState.setDataOnFieldChange("MESSAGES", {
              MESSAGES: postData?.[0]?.RESTRICTION,
              NSC_FD_BTN: true,
            });

            return {
              ACCT_CD: { value: "", isFieldFocused: true },
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
              SANCTIONED_AMT: { value: "" },
            };
          } else {
            formState.setDataOnFieldChange("NSC_FD_BTN", { NSC_FD_BTN: true });
            return {
              // ACCT_CD: {
              //   value: postData?.[0]?.ACCT_NM,
              // },
              ACCT_NM: {
                value: postData?.[0]?.ACCT_NM,
              },
              TRAN_BAL: {
                value: postData?.[0]?.TRAN_BAL,
              },
              SANCTIONED_AMT: {
                value: postData?.[0]?.SANCTIONED_AMT,
              },
              HIDDEN_CHARGE_AMT: {
                value: postData?.[0]?.CHARGE_AMT,
              },
              HIDDEN_GST_AMT: {
                value: postData?.[0]?.GST_AMT,
              },
              HIDDEN_GST_ROUND: {
                value: postData?.[0]?.GST_ROUND,
              },
              HIDDEN_TAX_RATE: {
                value: postData?.[0]?.TAX_RATE,
              },
            };
          }
        } else if (!field?.value) {
          formState.setDataOnFieldChange("NSC_FD_BTN", { NSC_FD_BTN: false });
          return {
            ACCT_NM: { value: "" },
            TRAN_BAL: { value: "" },
            SANCTIONED_AMT: { value: "" },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,

      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_CHARGE_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_GST_AMT",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_GST_ROUND",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_TAX_RATE",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
      isReadOnly: true,
      placeholder: "Account Name",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Tran. Balance",
      placeholder: "Balance",
      isFieldFocused: false,
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SANCTIONED_AMT",
      label: "Sanctioned Limit",
      placeholder: "San. limit",
      isReadOnly: true,
      type: "text",
      sequence: 0,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LIMIT_TYPE",
      label: "Limit Type",
      placeholder: "Limit Type",
      type: "text",
      defaultValue: "Normal",
      options: () => {
        return [
          { value: "Normal", label: "Normal Limit" },
          { value: "Hoc", label: "Ad-hoc Limit" },
        ];
      },
      _optionsKey: "getChequeLeavesList",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_CD",
      label: "Security Code",
      placeholder: "Security",
      type: "text",
      disableCaching: true,

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Security Type is required."] }],
      },
      _optionsKey: "getSecurityListData",
      dependentFields: [
        "ACCT_CD",
        "ACCT_TYPE",
        "SECURITY_CD",
        "HIDDEN_CHARGE_AMT",
        "HIDDEN_GST_AMT",
        "HIDDEN_GST_ROUND",
        "HIDDEN_TAX_RATE",
      ],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !dependentFieldsValues?.ACCT_CD?.value ||
          dependentFieldsValues?.ACCT_CD?.error
        ) {
          return true;
        } else {
          return false;
        }
      },
      options: (dependentValue, formState, _, authState, other) => {
        if (dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            A_PARENT_TYPE:
              dependentValue?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE.trim() ??
              dependentValue?.PARA_TYPE?.value,
          };
          return API.getSecurityListData(apiReq);
        }
        return [];
      },

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          formState.setDataOnFieldChange("SECURITY_CODE", {
            SECURITY_CD: field?.value,
            LIMIT_MARGIN:
              dependentValue?.SECURITY_CD?.optionData?.[0]?.LIMIT_MARGIN,
            HDN_CHARGE_AMT: dependentValue?.HIDDEN_CHARGE_AMT?.value,
            HDN_GST_AMT: dependentValue?.HIDDEN_GST_AMT?.value,
            HDN_GST_ROUND: dependentValue?.HIDDEN_GST_ROUND?.value,
            HDN_TAX_RATE: dependentValue?.HIDDEN_TAX_RATE?.value,
          });
        }
        return {};
      },

      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
    },
  ],
};
