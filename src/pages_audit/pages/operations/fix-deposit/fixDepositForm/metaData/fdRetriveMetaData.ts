import { GeneralAPI } from "registry/fns/functions";
import { utilFunction } from "@acuteinfo/common-base";
import * as API from "../../api";
import { validateHOBranch } from "components/utilFunction/function";

export const FDRetriveMetadata = {
  form: {
    name: "enterparameters",
    label: "Enter Parameters",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    allowColumnHiding: true,
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
      render: { componentType: "_accountNumber" },
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

          const isHOBranch = await validateHOBranch(
            currentField,
            formState?.MessageBox,
            authState
          );
          if (isHOBranch) {
            return {
              BRANCH_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
            };
          }
          return {
            ACCT_NM: { value: "" },
            ACCT_TYPE: { value: "" },
            ACCT_CD: { value: "", ignoreUpdate: false },
          };
        },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        runPostValidationHookAlways: true,
        validationRun: "onChange",
        dependentFields: ["BRANCH_CD"],
        isFieldFocused: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};

          if (
            currentField?.value &&
            dependentFieldsValues?.BRANCH_CD?.value?.length === 0
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Enter Account Branch.",
              buttonNames: ["Ok"],
              icon: "ERROR",
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
              };
            }
          } else if (
            currentField?.value &&
            dependentFieldsValues?.BRANCH_CD?.value
          ) {
            const reqParameters = {
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value ?? "",
              ACCT_TYPE: currentField?.value ?? "",
              SCREEN_REF: "RPT/401",
            };
            const postData = await API.getFDParaDetail(reqParameters);
            if (postData?.status === "999") {
              let btnName = await formState.MessageBox({
                messageTitle: "ValidationFailed",
                message: postData?.messageDetails?.length
                  ? postData?.messageDetails
                  : "Somethingwenttowrong",
                icon: "ERROR",
              });
              if (btnName === "Ok") {
                return {
                  ACCT_TYPE: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  ACCT_CD: { value: "", ignoreUpdate: false },
                  ACCT_NM: { value: "" },
                };
              }
            } else if (postData) {
              formState.setDataOnFieldChange("GET_PARA_DATA", postData?.[0]);
              return {
                DOUBLE_FAC: { value: postData?.[0]?.DOUBLE_FAC ?? "" },
                TRAN_CD: { value: postData?.[0]?.DOUBLE_TRAN ?? "" },
                ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: false,
                },
              };
            }
          }
          return {
            ACCT_CD: { value: "", ignoreUpdate: false },
            ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        autoComplete: "off",
        dependentFields: ["ACCT_TYPE", "BRANCH_CD", "DOUBLE_FAC", "TRAN_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField.value &&
            dependentFieldsValues?.ACCT_TYPE?.value?.length === 0
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "ValidationFailed",
              message: "Enter Account Type.",
              buttonNames: ["Ok"],
              icon: "ERROR",
            });

            if (buttonName === "Ok") {
              return {
                ACCT_CD: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: false,
                },
                ACCT_TYPE: {
                  value: "",
                  isFieldFocused: true,
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
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value ?? "",
              ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value ?? "",
              ACCT_CD:
                utilFunction.getPadAccountNumber(
                  currentField?.value,
                  dependentFieldsValues?.ACCT_TYPE?.optionData
                ) ?? "",
              SCREEN_REF: "RPT/401",
              TRAN_CD: dependentFieldsValues?.TRAN_CD?.value ?? "",
              DOUBLE_FAC: dependentFieldsValues?.DOUBLE_FAC?.value ?? "",
            };
            formState?.handleDisableButton(true);
            const postData = await API.validateAcctDtl(reqParameters);

            let btn99, returnVal;
            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            if (postData.length) {
              formState.setDataOnFieldChange("ACCT_NO_DATA", postData?.[0]);
            }

            for (let i = 0; i < postData?.[0]?.MSG?.length; i++) {
              if (postData?.[0]?.MSG?.[i]?.O_STATUS === "999") {
                formState?.handleDisableButton(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE?.length
                    ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                    : "ValidationFailed",
                  message: postData?.[0]?.MSG?.[i]?.O_MESSAGE ?? "",
                  icon: "ERROR",
                });
                returnVal = "";
              } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "9") {
                formState?.handleDisableButton(false);
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE?.length
                      ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                      : "Alert",
                    message: postData?.[0]?.MSG?.[i]?.O_MESSAGE ?? "",
                    icon: "WARNING",
                  });
                }
                returnVal = postData?.[0];
              } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "99") {
                formState?.handleDisableButton(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData?.[0]?.MSG?.[i]?.O_MSG_TITLE?.length
                    ? postData?.[0]?.MSG?.[i]?.O_MSG_TITLE
                    : "Confirmation",
                  message: postData?.[0]?.MSG?.[i]?.O_MESSAGE ?? "",
                  buttonNames: ["Yes", "No"],
                  icon: "CONFIRM",
                });

                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.[0]?.MSG?.[i]?.O_STATUS === "0") {
                formState?.handleDisableButton(false);
                if (btn99 !== "No") {
                  returnVal = postData?.[0];
                } else {
                  returnVal = "";
                }
              }
            }
            formState?.handleDisableButton(false);
            btn99 = 0;
            return {
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.ACCT_TYPE?.optionData
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: false,
                    },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
              TRAN_BAL: {
                value: returnVal?.TRAN_BAL ?? "",
              },
            };
          } else if (!currentField?.value) {
            formState?.handleDisableButton(false);
            return {
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }
          formState?.handleDisableButton(false);
          return {};
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 8, md: 8, lg: 8, xl: 8 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Balance",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        xl: 4,
      },
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
  ],
};
