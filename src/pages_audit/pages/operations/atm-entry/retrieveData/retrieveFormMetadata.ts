import { isValid } from "date-fns";
import * as API from "../api";
import { GeneralAPI } from "registry/fns/functions";
import { utilFunction } from "@acuteinfo/common-base";

export const retrieveFormMetaData = {
  form: {
    name: "atm-retrieve-metadata",
    label: "Retrieve Information",
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
        componentType: "radio",
      },
      name: "A_RET_FLAG",
      label: "",
      RadioGroupProps: {
        row: true,
        display: "flex",
        justifyContent: "center",
        sx: {},
      },
      defaultValue: "A",
      options: [
        {
          label: "CustomerId",
          value: "C",
        },
        { label: "AccountNo", value: "A" },
        { label: "ApplicationDate", value: "D" },
      ],

      textFieldStyle: {
        display: "flex",
        justifyContent: "center",
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
      },
      validationRun: "onChange",
      dependentFields: ["ACCT_TYPE", "CUSTOMER_ID", "FROM_DT"],
      postValidationSetCrossFieldValues: (field) => {
        return {
          ACCT_TYPE: {
            value: "",
            isFieldFocused: field?.value === "A" ? true : false,
          },
          CUSTOMER_ID: {
            value: "",
            isFieldFocused: field?.value === "C" ? true : false,
          },
          FROM_DT: { isFieldFocused: field?.value === "D" ? true : false },
        };
      },
    },

    {
      render: {
        componentType: "_accountNumber",
      },

      branchCodeMetadata: {
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        dependentFields: ["A_RET_FLAG"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.A_RET_FLAG?.value === "A") {
            return false;
          } else {
            return true;
          }
        },
        postValidationSetCrossFieldValues: (field, formState) => {
          if (field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
            };
          } else if (!field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
            };
          }
        },
        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        runValidationOnDependentFieldsChange: true,

        schemaValidation: {
          type: "string",
          rules: [{ name: "", params: [""] }],
        },
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        dependentFields: ["A_RET_FLAG"],
        validate: (columnValue, allField) => {
          if (
            columnValue.value.length <= 0 &&
            allField?.A_RET_FLAG.value === "A"
          ) {
            return "The Field is Required";
          }
          return "";
        },
        shouldExclude(fieldData, dependentFieldsValues) {
          if (dependentFieldsValues?.A_RET_FLAG?.value === "A") {
            return false;
          } else {
            return true;
          }
        },
        isFieldFocused: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "MST/846",
          });
        },
        // _optionsKey: "get_Account_Type",
        postValidationSetCrossFieldValues: () => {
          return {
            ACCT_CD: { value: "" },
            ACCT_NM: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        // disableCaching: true,

        runValidationOnDependentFieldsChange: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "", params: [""] }],
        },
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
        dependentFields: [
          "A_RET_FLAG",
          "BRANCH_CD",
          "ACCT_TYPE",
          "PARA_602",
          "PARA_946",
        ],
        validate: (columnValue, allField, flag) => {
          let regex = /^[^!&]*$/;

          if (
            columnValue.value.length <= 0 &&
            allField?.A_RET_FLAG.value === "A"
          ) {
            return "The Field is Required";
          } else if (!regex.test(columnValue.value)) {
            return "Special Characters (!, &) not Allowed";
          }
          return "";
        },
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          if (
            field?.value &&
            dependentValue?.BRANCH_CD?.value &&
            dependentValue?.ACCT_TYPE?.value
          ) {
            let apiRequest = {
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              PARA_602: dependentValue?.PARA_602?.value,
              PARA_946: dependentValue?.PARA_946?.value,
              SCREEN_REF: "MST/846",
              CUSTOMER_ID: "",
            };

            let postData = await API.validateAcctAndCustId(apiRequest);

            console.log("<<<postdat", postData);

            let apiRespMSGdata = postData?.[0]?.MSG;
            let isReturn;
            const messagebox = async (msgTitle, msg, buttonNames, status) => {
              let buttonName = await formState.MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
              });
              return { buttonName, status };
            };
            if (apiRespMSGdata?.length) {
              for (let i = 0; i < apiRespMSGdata?.length; i++) {
                if (apiRespMSGdata[i]?.O_STATUS !== "0") {
                  let btnName = await messagebox(
                    apiRespMSGdata[i]?.O_STATUS === "999"
                      ? "validation fail"
                      : "ALert message",
                    apiRespMSGdata[i]?.O_MESSAGE,
                    apiRespMSGdata[i]?.O_STATUS === "99"
                      ? ["Yes", "No"]
                      : ["Ok"],
                    apiRespMSGdata[i]?.O_STATUS
                  );

                  console.log("<<<buttnnama", btnName);
                  if (btnName.buttonName === "No" || btnName.status === "999") {
                    return {
                      ACCT_CD: { value: "", isFieldFocused: true },
                      ACCT_NM: { value: "" },
                    };
                  } else {
                    isReturn = true;
                  }
                } else {
                  isReturn = true;
                }
              }
            } else {
              return {
                ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                },
              };
            }
            if (Boolean(isReturn)) {
              return {
                ACCT_CD: {
                  value: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentValue?.ACCT_TYPE?.optionData
                  ),
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                ACCT_NM: { value: postData?.[0]?.ACCT_NM },
                RETRIEVE: { isFieldFocused: true },
              };
            }
          } else if (!field?.value) {
            return {
              ACCT_NM: { value: "" },
            };
          }

          return {};
        },
        runPostValidationHookAlways: true,
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.A_RET_FLAG?.value === "A") {
            return false;
          } else {
            return true;
          }
        },
        render: {
          componentType: "textField",
        },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      isReadOnly: true,
      dependentFields: ["A_RET_FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_RET_FLAG?.value === "A") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 4.5,
        sm: 4.5,
        lg: 4.5,
        xl: 4.5,
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      dependentFields: ["A_RET_FLAG"],
      name: "SPACER",
      shouldExclude: (_, dependentFieldsValues, formState) => {
        return dependentFieldsValues?.A_RET_FLAG?.value === "A" ? true : false;
      },
      GridProps: {
        xs: 2.5,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      placeholder: "Enter Customer Id",
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["A_RET_FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_RET_FLAG?.value === "C") {
          return false;
        } else {
          return true;
        }
      },

      runValidationOnDependentFieldsChange: true,
      validate: (columnValue, allField, flag) => {
        if (
          columnValue.value.length <= 0 &&
          allField?.A_RET_FLAG.value === "C"
        ) {
          return "The Field is Required";
        }
        return "";
      },
      required: true,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      // },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "FROM_DT",
      label: "GeneralFromDate",
      placeholder: "",
      fullWidth: true,
      isWorkingDate: true,
      format: "dd/MM/yyyy",
      GridProps: {
        xs: 3.5,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FromDateRequired."] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["A_RET_FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_RET_FLAG?.value === "D") {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TO_DT",
      label: "GeneralToDate",
      placeholder: "",
      fullWidth: true,
      isWorkingDate: true,
      format: "dd/MM/yyyy",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ToDateRequired"] }],
      },
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Mustbeavaliddate";
        }
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.FROM_DT?.value)
        ) {
          return "ToDateshouldbegreaterthanorequaltoFromDate";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["FROM_DT", "A_RET_FLAG"],
      runValidationOnDependentFieldsChange: true,
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_RET_FLAG?.value === "D") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 3.5,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACERS",
      dependentFields: ["A_RET_FLAG"],
      shouldExclude: (_, dependentFieldsValues, formState) => {
        return dependentFieldsValues?.A_RET_FLAG?.value === "D" ? false : true;
      },
      GridProps: {
        xs: 2.5,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACERSS",
      GridProps: {
        xs: 8,
        md: 8,
        sm: 8,
        lg: 8,
        xl: 8,
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "RETRIEVE",
      label: "Retrieve",
      // endsIcon: "YoutubeSearchedFor",
      // rotateIcon: "scale(1.5)",
      dependentFields: ["A_RET_FLAG", "ACCT_CD"],
      isReadOnly: (fieldData, dependentFields, formState) => {
        if (
          dependentFields?.ACCT_CD?.value?.length < 15 &&
          dependentFields?.A_RET_FLAG?.value === "A"
        ) {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "CANCEL",
      label: "Cancel",
      // endsIcon: "YoutubeSearchedFor",
      // rotateIcon: "scale(1.5)",
      GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_602",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_946",
    },
  ],
};
