import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions/general";
import * as API from "../api";
import { addMonths, format, subDays } from "date-fns";

export const InsuranceDetailFormMetaData = {
  masterForm: {
    form: {
      name: "InsuranceMaster",
      label: "",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
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
    },
    fields: [
      // {
      //   render: {
      //     componentType: "divider",
      //   },
      //   // dividerText: "IFSC Bank Detail",
      //   name: "AccountDetail",
      //   label: "Account Detail",
      //   GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      // },
      {
        render: {
          componentType: "_accountNumber",
        },
        name: "",
        branchCodeMetadata: {
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
          runPostValidationHookAlways: true,
          render: {
            componentType: "textField",
          },
          isReadOnly: true,
        },

        accountTypeMetadata: {
          GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
          isFieldFocused: true,
          defaultfocus: true,
          isReadOnly: true,
          defaultValue: "",
          runPostValidationHookAlways: true,
          options: (dependentValue, formState, _, authState) => {
            return GeneralAPI.get_Account_Type({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              USER_NAME: authState?.user?.id,
              DOC_CD: "RPT/70",
            });
          },
          postValidationSetCrossFieldValues: (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (!field?.value) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
              return {
                ACCT_CD: { value: "", ignoreUpdate: true },
                ACCT_NM: { value: "" },
              };
            }
          },
        },
        accountCodeMetadata: {
          fullWidth: true,
          isReadOnly: true,
          FormatProps: {
            allowNegative: false,
            isAllowed: (values) => {
              if (values?.value?.length > 6) {
                return false;
              }
              return true;
            },
          },
          disableCaching: false,
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (
              field.value &&
              dependentFieldsValues?.["ACCT_TYPE"]?.value &&
              dependentFieldsValues?.["BRANCH_CD"]?.value
            ) {
              if (formState?.isSubmitting) return {};
              let Apireq = {
                COMP_CD: auth?.companyID,
                ACCT_CD: utilFunction.getPadAccountNumber(
                  field?.value,
                  dependentFieldsValues?.["ACCT_TYPE"]?.optionData
                ),
                ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
                BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
                SCREEN_REF: "RPT/70",
              };
              let postData = await GeneralAPI.getAccNoValidation(Apireq);

              formState.setDataOnFieldChange("TAB_REQUEST", Apireq);

              let btn99, returnVal;
              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < postData?.MSG?.length; i++) {
                if (postData?.MSG?.[i]?.O_STATUS === "999") {
                  formState.setDataOnFieldChange("IS_VISIBLE", {
                    IS_VISIBLE: false,
                  });
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "ValidationFailed",
                    message: postData?.MSG?.[i]?.O_MESSAGE,
                    icon: "ERROR",
                  });
                  returnVal = "";
                } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                  formState.setDataOnFieldChange("IS_VISIBLE", {
                    IS_VISIBLE: false,
                  });
                  if (btn99 !== "No") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: "Alert",
                      message: postData?.MSG?.[i]?.O_MESSAGE,
                      icon: "WARNING",
                    });
                  }
                  returnVal = postData;
                } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
                  formState.setDataOnFieldChange("IS_VISIBLE", {
                    IS_VISIBLE: false,
                  });
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
                  formState.setDataOnFieldChange("IS_VISIBLE", {
                    IS_VISIBLE: true,
                  });
                  if (btn99 !== "No") {
                    returnVal = postData;
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
                          field?.value,
                          dependentFieldsValues?.ACCT_TYPE?.optionData
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
                COVER_NOTE: {
                  value: "",
                  isFieldFocused: true,
                },
              };
            } else {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
              return {
                ACCT_CD: {
                  value: "",
                },
                ACCT_NM: { value: "" },
              };
            }
          },
          runPostValidationHookAlways: true,
          GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "ACCT_NM",
        label: "Account_Name",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 3.6, md: 3.6, lg: 3.6, xl: 3.6 },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "INSURANCE_DATE",
        fullWidth: true,
        label: "InsuranceDate",
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "DUE_DATE",
        fullWidth: true,
        label: "DueDate",
        dependentFields: ["TRAN_DT"],
        setValueOnDependentFieldsChange: (dependent) => {
          let date = dependent["TRAN_DT"]?.value;
          if (!isNaN(date)) {
            let newDate = subDays(addMonths(date, 12), 1);
            return newDate;
          } else {
            return null;
          }
        },
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      },
      {
        render: {
          componentType: "datePicker",
        },
        fullWidth: true,
        name: "TRAN_DT",
        isReadOnly: true,
        label: "EntryDate",
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      },

      {
        render: {
          componentType: "textField",
        },
        name: "COVER_NOTE",
        label: "CoverNote",
        type: "text",
        fullWidth: true,
        txtTransform: "uppercase",
        required: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Please enter Cover Note."] }],
        },
        validate: (columnValue, allField, flag) => {
          let regex = /^[a-zA-Z0-9 ]*$/;
          // special-character not allowed
          if (columnValue.value) {
            if (!regex.test(columnValue.value)) {
              return "PleaseEnterAlphanumericValue";
            }
          }
          return "";
        },
        GridProps: { xs: 12, sm: 3.1, md: 3.1, lg: 3.1, xl: 3.1 },
      },

      {
        render: {
          componentType: "autocomplete",
        },
        name: "INSURANCE_COMP_CD",
        label: "Company",
        // defaultValue: "RTGS",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["PleaseEnterInsuranceCompany"] },
          ],
        },
        options: async (dependentValue, formState, _, authState) => {
          return API.getInsuranceCompanyData({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        _optionsKey: "getInsuranceCompanyData",
        GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
      },
      {
        render: {
          componentType: "autocomplete",
        },
        name: "INSURANCE_TYPE_CD",
        label: "InsuranceType",
        // defaultValue: "RTGS",
        fullWidth: true,
        options: async (dependentValue, formState, _, authState) => {
          return API.getInsuranceTypeData({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        _optionsKey: "getInsuranceTypeData",
        GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "POLICY_NO",
        label: "PolicyNo",
        txtTransform: "uppercase",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["PleaseEnterPolicyNo"] }],
        },
        GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
      },
      // {
      //   render: {
      //     componentType: "hidden",
      //   },
      //   name: "TRAN_CD",
      // },
      {
        render: {
          componentType: "hidden",
        },
        name: "CONFIRMED",
      },
      {
        render: {
          componentType: "textField",
        },
        name: "DESCRIPTION",
        label: "Description",
        fullWidth: true,
        txtTransform: "uppercase",
        GridProps: { xs: 12, sm: 3.6, md: 3.6, lg: 3.6, xl: 3.6 },
      },

      {
        render: {
          componentType: "amountField",
        },
        name: "INSURANCE_AMOUNT",
        label: "InsuranceAmount",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["PleaseEnterInsuranceAmount"] }],
        },

        GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
      },

      {
        render: {
          componentType: "amountField",
        },
        name: "NET_PREMIUM_AMOUNT",
        fullWidth: true,
        label: "NetPremium",
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["PleaseEnterNetPremiumAmount"] },
          ],
        },
        GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
        dependentFields: [
          "INSURANCE_AMOUNT",
          "ACCT_CD",
          "ACCT_TYPE",
          "BRANCH_CD",
        ],
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (field.value) {
            if (
              Number(field.value) >
              Number(dependentFieldsValues?.INSURANCE_AMOUNT?.value)
            ) {
              let buttonName = await formState?.MessageBox({
                messageTitle: "Alert",
                message: `NetPremiumAmountCanGreaterThanInsuranceAmount`,
                buttonNames: ["Ok"],
                icon: "WARNING",
              });
              if (buttonName === "Ok") {
                return {
                  NET_PREMIUM_AMOUNT: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  SERVICE_CHARGE: {
                    value: "",
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (
              field.value &&
              dependentFieldsValues?.["ACCT_CD"]?.value &&
              dependentFieldsValues?.["ACCT_TYPE"]?.value &&
              dependentFieldsValues?.["BRANCH_CD"]?.value &&
              dependentFieldsValues?.["INSURANCE_AMOUNT"]?.value
            ) {
              let postData = await GeneralAPI.getCalGstAmountData({
                BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
                ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
                ACCT_CD: utilFunction.getPadAccountNumber(
                  dependentFieldsValues?.["ACCT_CD"]?.value,
                  dependentFieldsValues?.["ACCT_TYPE"]?.optionData
                ),
                AMOUNT: field.value,
                MODULE: "INSU",
                COMP_CD: auth?.companyID,
                ENT_BRANCH_CD: auth?.user?.branchCode,
                ASON_DT: auth?.workingDate,
              });
              return {
                SERVICE_CHARGE: { value: postData?.[0]?.TAX_AMOUNT },
              };
            }
          } else if (!field?.value) {
            return {
              SERVICE_CHARGE: { value: "" },
            };
          }
        },
      },

      {
        render: {
          componentType: "amountField",
        },
        name: "SERVICE_CHARGE",
        fullWidth: true,
        label: "GST",
        GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
        dependentFields: ["NET_PREMIUM_AMOUNT"],
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (field.value) {
            if (
              Number(field.value) >
              Number(dependentFieldsValues?.SERVICE_CHARGE?.value)
            ) {
              let buttonName = await formState?.MessageBox({
                messageTitle: "Alert",
                message: `GSTShouldLessThanNetPremiumAmount`,
                buttonNames: ["Ok"],
                icon: "WARNING",
              });
              if (buttonName === "Ok") {
                return {
                  SERVICE_CHARGE: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  TOTAL_PRE: {
                    value: "",
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  },
                };
              }
            }
          } else if (!field?.value) {
            return {
              SERVICE_CHARGE: { value: "" },
            };
          }
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "TOTAL_PRE",
        fullWidth: true,
        isReadOnly: true,
        label: "TotalPremium",
        GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
        dependentFields: ["NET_PREMIUM_AMOUNT", "SERVICE_CHARGE"],
        setValueOnDependentFieldsChange: (dependentFields) => {
          let value =
            parseFloat(dependentFields?.NET_PREMIUM_AMOUNT?.value) +
            parseFloat(dependentFields?.SERVICE_CHARGE?.value);
          return value ?? "--";
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "REMARKS",
        label: "Remarks",
        fullWidth: true,
        txtTransform: "uppercase",
        GridProps: { xs: 12, sm: 3.6, md: 3.6, lg: 3.6, xl: 3.6 },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "PROPOSER1",
        label: "Proposer1",
        fullWidth: true,
        GridProps: { xs: 12, sm: 3.9, md: 3.9, lg: 3.9, xl: 3.9 },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "PROPOSER2",
        fullWidth: true,
        label: "Proposer2",
        GridProps: { xs: 12, sm: 3.9, md: 3.9, lg: 3.9, xl: 3.9 },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ALLOW_EDIT",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ALLOW_RENEW",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "RENEWED_FLAG",
        label: "Inactive",
        fullWidth: true,
        __EDIT__: {
          render: {
            componentType: "checkbox",
          },
          defaultValue: false,
        },
        GridProps: {
          xs: 12,
          md: 1.2,
          sm: 1.2,
          lg: 1.2,
          xl: 1.2,
        },
      },

      {
        render: {
          componentType: "hidden",
        },
        name: "",
        __EDIT__: {
          render: {
            componentType: "datePicker",
          },
          name: "INACTIVE_DATE",
          fullWidth: true,
          label: "InactiveDate",
          GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
          dependentFields: ["RENEWED_FLAG"],
          shouldExclude: (_, dependent, __) => {
            if (!Boolean(dependent?.RENEWED_FLAG?.value)) {
              return true;
            }
            return false;
          },
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Document Detail",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "29vh", max: "29vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: false,
      // paginationText: "Configured Messages",
    },
    columns: [
      {
        accessor: "id",
        columnName: "SrNo",
        componentType: "default",
        sequence: 1,
        alignment: "center",
        width: 75,
        minWidth: 50,
        maxWidth: 100,
        isAutoSequence: true,
      },
      {
        accessor: "SECURITY_TYPE",
        columnName: "SecurityType",
        componentType: "editableAutocomplete",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 250,
        minWidth: 300,
        maxWidth: 400,
        isReadOnly: true,
        options: async (_, authState) => {
          return API.getSecurityTypeData({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        _optionsKey: "getSecurityTypeData",
        __VIEW__: { isReadOnly: true },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["PleaseEnterSecurityType"] }],
        },
        // isReadOnly: true,
        __EDIT__: { isReadOnly: false },
        __NEW__: { isReadOnly: false },
      },
      {
        accessor: "SECURITY_CD",
        columnName: "Security",
        componentType: "editableAutocomplete",
        placeholder: " ",
        sequence: 3,
        alignment: "left",
        width: 350,
        minWidth: 300,
        maxWidth: 400,
        options: async (_, authState) => {
          return API.getSecurityData({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        _optionsKey: "getSecurityData",
        validation: (value, data, prev) => {
          if (!Boolean(value)) {
            return "PleaseEnterSecurity";
          } else if (Array.isArray(prev)) {
            let lb_error = false;
            let ls_msg = "";
            prev.forEach((item, index) => {
              if (value.trim() === item?.SECURITY_CD.trim()) {
                lb_error = true;
                ls_msg = "SecurityAlreadyEnteredLine " + (index + 1);
                return ls_msg;
              }
            });
            if (lb_error) {
              return ls_msg;
            }
          }
          return "";
        },
        // schemaValidation: {
        //   type: "string",
        //   rules: [{ name: "required", params: ["This field is required"] }],
        // },
        // isReadOnly: true,
        __EDIT__: { isReadOnly: false },
        __VIEW__: { isReadOnly: true },
        __NEW__: { isReadOnly: false },
      },
      {
        accessor: "AMOUNT",
        columnName: "Amount",
        componentType: "editableNumberFormat",
        alignment: "center",
        // defaultValue: "Y",
        __VIEW__: { isReadOnly: true },
        __EDIT__: { isReadOnly: false },
        sequence: 4,
        width: 250,
        minWidth: 300,
        maxWidth: 400,
        placeholder: "0.00",
        className: "textInputFromRight",
        FormatProps: {
          thousandSeparator: true,
          thousandsGroupStyle: "lakh",
          allowNegative: false,
          allowLeadingZeros: false,
          decimalScale: 2,
          fixedDecimalScale: true,
          isAllowed: (values) => {
            if (values?.value?.length > 14) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },
        // validation: (value, data) => {
        //   if (!Boolean(value) || !Boolean(data["MAX_AMT"])) {
        //     return "";
        //   }
        //   if (Number.parseFloat(value) > Number.parseFloat(data["MAX_AMT"])) {
        //     return "Minimum Amount should be Less than or equal To Maximum Amount.";
        //   }
        //   return "";
        // },
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 5,
      },
    ],
  },
};
