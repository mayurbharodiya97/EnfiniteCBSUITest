import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";
import { getAccCodeValidation } from "../api";

export const RetrievalFormMetaData = {
  form: {
    name: "retrieveFormMetadata",
    label: "Enter Parameter",
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
      datePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          return {
            ACCT_NM: { value: "" },
            ACCT_TYPE: { value: "" },
            ACCT_CD: { value: "" },
            BALANCE: { value: "" },
          };
        },
        validationRun: "onChange",
        isFieldFocused: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState?.user?.branchCode ?? "",
            USER_NAME: authState?.user?.id ?? "",
            DOC_CD: "MST/006",
          });
        },
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
            BALANCE: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
      accountCodeMetadata: {
        autoComplete: "off",
        dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (
            currentField?.value &&
            dependentFieldValues?.BRANCH_CD?.value &&
            dependentFieldValues?.ACCT_TYPE?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "MST/006",
            };
            formState.handleButtonDisable(true);
            const postData = await getAccCodeValidation(reqParameters);

            let btn99, returnVal;
            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData?.length; i++) {
              if (postData?.[i]?.O_STATUS === "999") {
                formState.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "ValidationFailed",
                  message: postData?.[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.[i]?.O_STATUS === "9") {
                formState.handleButtonDisable(false);
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message: postData?.[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData?.[i];
              } else if (postData?.[i]?.O_STATUS === "99") {
                formState.handleButtonDisable(false);
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Confirmation",
                  message: postData?.[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.[i]?.O_STATUS === "0") {
                formState.handleButtonDisable(false);
                if (btn99 !== "No") {
                  returnVal = postData?.[i];
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
                        dependentFieldValues?.ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
              BALANCE: {
                value: returnVal?.BALANCE ?? "",
              },
            };
          } else if (!currentField?.value) {
            formState.handleButtonDisable(false);
            return {
              ACCT_NM: { value: "" },
              BALANCE: { value: "" },
            };
          }
          return {};
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "BALANCE",
      label: "Balance",
      isReadOnly: true,
      fullWidth: true,
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
  ],
};
