import { GeneralAPI } from "registry/fns/functions";
import { getPassBookTemplate, passbookAccountDetails } from "./api";
import { utilFunction } from "@acuteinfo/common-base";
import { t } from "i18next";
import { format } from "date-fns";

export const PassbookPrintingInq = {
  form: {
    name: "PassbookStatementInq",
    label: "Passbook Printing Parameters",
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
          spacing: 2,
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
        componentType: "autocomplete",
      },
      name: "BRANCH_CD",
      label: "BranchCode",
      placeholder: "BranchCodePlaceHolder",
      options: GeneralAPI.getBranchCodeList,
      _optionsKey: "getBranchCodeList",
      runPostValidationHookAlways: true,
      isFieldFocused: true,
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
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["BranchCodeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ACCT_TYPE",
      label: "AccountType",
      placeholder: "AccountTypePlaceHolder",
      dependentFields: ["BRANCH_CD"],
      disableCaching: true,
      options: (dependentValue, formState, _, authState) => {
        return GeneralAPI.get_Account_Type({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
          DOC_CD: "RPT/430",
        });
      },
      _optionsKey: "get_Account_Type",
      required: true,
      validationRun: "onChange",
      runPostValidationHookAlways: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          currentField?.value &&
          dependentFieldValues?.BRANCH_CD?.value?.length === 0
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountBranch",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });

          if (buttonName === "Ok") {
            return {
              ACCT_TYPE: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
              BRANCH_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
              TRAN_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
        }
        return {
          ACCT_CD: { value: "", ignoreUpdate: true },
          ACCT_NM: { value: "", ignoreUpdate: true },
          TRAN_CD: { value: "", ignoreUpdate: true },
        };
      },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "select",
      },
      name: "TRAN_CD",
      label: "Template",
      // defaultValue: "1",
      dependentFields: ["PID_DESCRIPION", "ACCT_TYPE", "BRANCH_CD"],
      fullWidth: true,
      disableCaching: true,
      options: async (dependentValue, formState, abcd, authState) => {
        if (dependentValue?.ACCT_TYPE?.value !== "") {
          // handleButonDisable use for disable "Ok" button while getPassBookTemplate api call
          formState.handleButonDisable(true);
          try {
            const data = await getPassBookTemplate({
              COMP_CD: authState?.companyID,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              FLAG: "PAS" + dependentValue?.PID_DESCRIPION?.value,
            });
            return data;
          } catch (err) {
            console.log("err", err);
            return [];
          } finally {
            formState.handleButonDisable(false);
          }
        } else {
          return [];
        }
      },
      _optionsKey: "getPassBookTemplate",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["TemplateReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "AccountNumber",
      placeholder: "AccountNumberPlaceHolder",
      autoComplete: "off",
      dependentFields: ["ACCT_TYPE", "BRANCH_CD", "TRAN_CD"],
      required: true,
      runPostValidationHookAlways: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountNumberReqired"] }],
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          !Boolean(currentField?.displayValue) &&
          !Boolean(currentField?.value)
        ) {
          return {
            ACCT_NM: { value: "", ignoreUpdate: true },
          };
        } else if (!Boolean(currentField?.displayValue)) {
          return {};
        }

        if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.BRANCH_CD?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountBranch",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });

          if (buttonName === "Ok") {
            return {
              BRANCH_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
              ACCT_CD: {
                value: "",
                ignoreUpdate: true,
              },
              ACCT_TYPE: {
                value: "",
                ignoreUpdate: true,
              },
            };
          }
        } else if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.ACCT_TYPE?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountType",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });

          if (buttonName === "Ok") {
            return {
              ACCT_TYPE: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
              ACCT_CD: { value: "", ignoreUpdate: true },
            };
          }
        } else if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.TRAN_CD?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "SelectTemplate",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });
          if (buttonName === "Ok") {
            return {
              TRAN_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
              ACCT_CD: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
            };
          }
        } else if (
          currentField?.value &&
          dependentFieldsValues?.BRANCH_CD?.value &&
          dependentFieldsValues?.ACCT_TYPE?.value
        ) {
          const reqParameters = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value,
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value,
              dependentFieldsValues?.ACCT_TYPE?.optionData
            ),
            TRAN_CD: dependentFieldsValues?.TRAN_CD?.optionData?.[0]?.value,
            DEFAULT_LINE:
              dependentFieldsValues?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE,
            SKIP_LINE:
              dependentFieldsValues?.TRAN_CD?.optionData?.[0]?.SKIP_LINE,
            SCREEN_REF: "RPT/430",
          };
          formState.handleButonDisable(true);

          const postData = await passbookAccountDetails(reqParameters);

          formState.handleButonDisable(false);

          if (postData?.status === "999") {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: postData?.messageDetails ?? "Somethingwenttowrong",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
                ACCT_NM: { value: "", ignoreUpdate: true },
              };
            }
          } else {
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData.length; i++) {
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData[i]?.O_MSG_TITLE ?? "ValidationFailed",
                  message: postData[i]?.O_MESSAGE,
                  icon: "ERROR",
                });
                returnVal = "";
                if (btnName === "Ok") {
                  return {
                    ACCT_CD: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData[i]?.O_MSG_TITLE ?? "Confirmation",
                  message: postData[i]?.O_MESSAGE,
                  icon: "CONFIRM",
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: postData[i]?.O_MSG_TITLE ?? "Alert",
                    message: postData[i]?.O_MESSAGE,
                    icon: "WARNING",
                  });
                }
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            formState.setDataOnFieldChange("accountFromDate", {
              PASS_BOOK_DT: returnVal?.FROM_DT ?? "",
            });
            return {
              ACCT_CD: {
                value:
                  returnVal !== ""
                    ? utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.ACCT_TYPE?.optionData
                      )
                    : "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
                ignoreUpdate: true,
              },
              PASS_BOOK_LINE: {
                value: returnVal?.LINE_ID ?? "",
                ignoreUpdate: true,
              },
              PASS_BOOK_DT: {
                value: returnVal?.FROM_DT ?? "",
                ignoreUpdate: true,
              },

              OP_DATE_HIDDEN: {
                value: returnVal?.OP_DATE ?? "",
                ignoreUpdate: true,
              },
            };
          }
        } else if (!currentField?.value) {
          return {
            ACCT_NM: {
              value: "",
              ignoreUpdate: true,
            },
            PASS_BOOK_LINE: {
              value: "",
              ignoreUpdate: true,
            },
            PASS_BOOK_DT: {
              value: "",
              ignoreUpdate: true,
            },
            PASS_BOOK_TO_DT: {
              value: "",
              ignoreUpdate: true,
            },
          };
        }
        return {};
      },
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "ENT_BRANCH_CD",
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountHolder",
      placeholder: "AccountHolder",
      type: "text",
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "radio",
      },
      name: "PID_DESCRIPION",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "D",
      validationRun: "onChange",
      dependentFields: ["TRAN_CD"],
      options: [
        {
          label: "FrontPage",
          value: "F",
        },
        { label: "FirstPage", value: "A" },
        { label: "Detail", value: "D" },
      ],

      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (currentField?.value) {
          return {
            TRAN_CD: {
              value: "",
              isFieldFocused: true,
              ignoreUpdate: false,
            },
          };
        }
      },

      GridProps: {
        xs: 12,
        md: 7,
        sm: 7,
        lg: 7,
        xl: 7,
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "PASS_BOOK_LINE",
      label: "LineNo",
      type: "text",
      fullWidth: true,
      disableCaching: true,
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      dependentFields: ["PID_DESCRIPION", "TRAN_CD", "REPRINT"],
      runValidationOnDependentFieldsChange: true,
      runPostValidationHookAlways: true,
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value === ""
        ) {
          return true;
        } else {
          return false;
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return true;
        } else {
          return false;
        }
      },

      validate: (columnValue, dependentFields) => {
        if (
          dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE &&
          Boolean(columnValue?.value)
        ) {
          if (
            Number(columnValue?.value) >=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE) &&
            Number(columnValue?.value) <=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE)
          ) {
            return "";
          } else {
            return `${t(`LineNoValidation`, {
              from: dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE,
              to: dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE,
            })}`;
          }
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "LINE_NO_SPACER",
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      dependentFields: ["PID_DESCRIPION"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "REPRINT_VALUE",
      dependentFields: ["REPRINT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value = Number(dependentFieldsValues?.REPRINT?.value);
        return value === 1 ? "Y" : "N";
      },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "REPRINT",
      label: "Reprint",
      endsIcon: "Print",
      rotateIcon: "scale(1.4)",
      type: "text",
      // isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },

      dependentFields: ["PID_DESCRIPION"],
      runValidationOnDependentFieldsChange: true,
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          dependentValue?.PID_DESCRIPION?.value === "D" &&
          field?.value === "0"
        ) {
          return {
            REPRINT: {
              value: "",
            },
          };
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PID_DESCRIPION?.value !== "D" ||
          fieldData?.value !== ""
        ) {
          return true;
        } else {
          return false;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "OP_DATE_HIDDEN",
      // format: "dd/MM/yyyy",
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_DT",
      label: "FromDate",
      // format: "dd/MM/yyyy",
      placeholder: "",
      type: "text",
      maxDate: new Date(),
      dependentFields: ["REPRINT", "PID_DESCRIPION", "OP_DATE_HIDDEN"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value === ""
        ) {
          return true;
        } else if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return true;
        } else {
          return false;
        }
      },

      onFocus: (date) => {
        date.target.select();
      },
      // validationRun: "all",

      validate: (columnValue, dependentFields) => {
        if (
          new Date(columnValue?.value) <
          new Date(dependentFields?.OP_DATE_HIDDEN?.value)
        ) {
          return `${t(`DateValidation`, {
            date: format(
              new Date(dependentFields?.OP_DATE_HIDDEN?.value),
              "dd-MM-yyyy"
            ),
          })}`;
        } else {
          return "";
        }
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_TO_DT",
      label: "ToDate",
      placeholder: "",
      defaultValue: new Date(),
      format: "dd/MM/yyyy",
      isReadOnly: true,
      onFocus: (date) => {
        date.target.select();
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
  ],
};
