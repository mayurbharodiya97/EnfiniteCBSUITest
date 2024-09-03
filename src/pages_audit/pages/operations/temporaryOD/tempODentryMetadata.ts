import { utilFunction } from "components/utils";
import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { t } from "i18next";
import { lessThanDate } from "registry/rulesEngine";
export const temporaryODentryMetadata = {
  masterForm: {
    form: {
      name: "temporaryOD-entryMetadata",
      label: "TemporaryODAgainstEntry",
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
      {
        render: {
          componentType: "_accountNumber",
        },
        name: "",
        branchCodeMetadata: {
          postValidationSetCrossFieldValues: async (field, formState) => {
            if (field?.value) {
              return {
                ACCT_TYPE: { value: "" },
                ACCT_CD: { value: "" },
              };
            } else if (!field.value) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
              return {
                ACCT_TYPE: { value: "" },
                ACCT_CD: { value: "" },
              };
            }
          },
          runPostValidationHookAlways: true,
          GridProps: {
            xs: 12,
            md: 2,
            sm: 2,
            lg: 2,
            xl: 2,
          },
        },
        accountTypeMetadata: {
          isFieldFocused: true,
          options: (dependentValue, formState, _, authState) => {
            return GeneralAPI.get_Account_Type({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              USER_NAME: authState?.user?.id,
              DOC_CD: "TRN/054",
            });
          },
          _optionsKey: "get_Account_Type",
          postValidationSetCrossFieldValues: async (field, formState) => {
            formState.setDataOnFieldChange("IS_VISIBLE", {
              IS_VISIBLE: false,
            });
            if (field?.value) {
              return {
                ACCT_CD: { value: "" },
              };
            }
          },
          runPostValidationHookAlways: true,
          GridProps: {
            xs: 12,
            md: 2,
            sm: 2,
            lg: 2,
            xl: 2,
          },
        },

        accountCodeMetadata: {
          render: {
            componentType: "textField",
          },
          validate: (columnValue) => {
            let regex = /^[^!&]*$/;
            if (!regex.test(columnValue.value)) {
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
              let otherAPIRequestPara = {
                COMP_CD: authState?.companyID,
                ACCT_CD: utilFunction.getPadAccountNumber(
                  field?.value,
                  dependentValue?.ACCT_TYPE?.optionData
                ),
                ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
                BRANCH_CD: dependentValue?.BRANCH_CD?.value,
                SCREEN_REF: "TRN/047",
              };
              let postData = await GeneralAPI.getAccNoValidation(
                otherAPIRequestPara
              );
              let apiRespMSGdata = postData?.MSG;
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

                    if (
                      btnName.buttonName === "No" ||
                      btnName.status === "999"
                    ) {
                      formState.setDataOnFieldChange("IS_VISIBLE", {
                        IS_VISIBLE: false,
                      });
                      return {
                        ACCT_CD: {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: true,
                        },
                      };
                    } else {
                      formState.setDataOnFieldChange("IS_VISIBLE", {
                        IS_VISIBLE: true,
                      });
                      isReturn = true;
                    }
                  } else {
                    formState.setDataOnFieldChange("IS_VISIBLE", {
                      IS_VISIBLE: true,
                    });
                    isReturn = true;
                  }
                }
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
                };
              }
            } else if (!field.value) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
              return {
                AMOUNT_UPTO: { value: "" },
                FROM_EFF_DATE: { value: authState?.workingDate },
                TO_EFF_DATE: { value: authState?.workingDate },
              };
            }
            return {};
          },
          runPostValidationHookAlways: true,
          fullWidth: true,
          GridProps: {
            xs: 12,
            md: 2.5,
            sm: 2.5,
            lg: 2.5,
            xl: 2.5,
          },
        },
      },
      {
        render: {
          componentType: "autocomplete",
        },
        name: "CODE",
        label: "Parameters",
        required: true,
        fullWidth: true,
        placeholder: "SelectParameters",
        disableCaching: true,
        dependentFields: ["ACCT_TYPE"],
        options: (dependentFields) => {
          if (dependentFields?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE) {
            return API.parametersListDD(
              dependentFields?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE
            );
          }
          return [];
        },
        _optionsKey: "parametersListDD",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["PleaseSelectValue"] }],
        },
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
          componentType: "spacer",
        },
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "FROM_EFF_DATE",
        fullWidth: true,
        isWorkingDate: true,
        required: true,
        isMinWorkingDate: true,
        validate: (currentField, dependentField) => {
          // if (
          //   Boolean(currentField?.value) &&
          //   !isValid(currentField?.value)
          // ) {
          //   return t("Mustbeavaliddate");
          // }
          if (
            lessThanDate(currentField?.value, currentField?._minDt, {
              ignoreTime: true,
            })
          ) {
            return t("FromDateGreaterThanOrEqualToWorkingDate");
          }
          return "";
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
        },
        label: "EffectiveFromDate",
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
          componentType: "datePicker",
        },
        name: "TO_EFF_DATE",
        fullWidth: true,
        required: true,
        validate: (currentField, dependentField) => {
          // if (
          //   Boolean(currentField?.value) &&
          //   !isValid(currentField?.value)
          // ) {
          //   return t("Mustbeavaliddate");
          // }
          if (
            lessThanDate(
              currentField?.value,
              dependentField?.FROM_EFF_DATE?.value,
              {
                ignoreTime: true,
              }
            )
          ) {
            return t("ToDateGreaterThanOrEqualToFromDate");
          }
          return "";
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
        },
        onFocus: (date) => {
          date.target.select();
        },
        dependentFields: ["FROM_EFF_DATE"],
        runValidationOnDependentFieldsChange: true,
        label: "EffectiveToDate",
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
        name: "AMOUNT_UPTO",
        label: "AmountUpTo",
        required: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
        },
        FormatProps: {
          allowNegative: false,
        },
        fullWidth: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
      },
      {
        render: {
          componentType: "checkbox",
        },
        name: "FLAG",
        label: "Flag",
        fullWidth: true,
        isReadOnly: true,
        defaultValue: "Y",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
          lg: 3,
          xl: 3,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Documents",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: false,
      disableGroupBy: true,
      enablePagination: false,
      disableGlobalFilter: true,
      containerHeight: { min: "30vh", max: "30vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
      // paginationText: "Configured Messages",
    },
    columns: [
      {
        accessor: "TEMPLATE_CD",
        columnName: "Documents",
        componentType: "editableAutocomplete",
        options: (_, auth) => {
          return API.documentsListDD({
            COMP_CD: auth?.companyID,
            BRANCH_CD: auth?.user?.branchCode,
          });
        },
        // _optionsKey: "documentsListDD",
        required: true,
        sequence: 2,
        alignment: "left",
        width: 350,
        minWidth: 200,
        maxWidth: 400,
        validation: (value, data, prev, next) => {
          let concatenatedArray = [prev, next].flat();
          let nextMsg: any = concatenatedArray?.some((item) => {
            if (value) {
              return value === item?.TEMPLATE_CD;
            }
            return false;
          });

          if (!value) {
            return t("ThisFieldisrequired");
          } else if (nextMsg) {
            return t("OptionIsAlreadyEntered");
          }
          return "";
        },
      },
      {
        accessor: "SUBMIT",
        columnName: "Submit",
        componentType: "editableCheckbox",
        alignment: "center",
        // defaultValue: "Y",
        sequence: 2,
        width: 85,
        minWidth: 70,
        maxWidth: 120,
      },

      {
        accessor: "VALID_UPTO",
        columnName: "ValidTillDate",
        componentType: "editableDatePicker",
        alignment: "center",
        validation: (value, data, prev, next, auth) => {
          let inputDate = new Date(value);
          let workingDate = new Date(auth.workingDate);
          if (!Boolean(value)) {
            return t("ThisFieldisrequired");
          } else if (inputDate < workingDate) {
            return t("Valid Till date should not be less than Working Date");
          }
        },
        sequence: 2,
        width: 210,
        minWidth: 100,
        maxWidth: 300,
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 3,
        width: 90,
        alignment: "center",
        maxWidth: 120,
        minWidth: 90,
        shouldExclude: (initialValue, original) => {
          if (Boolean(original?._isNewRow)) {
            return false;
          }
          return true;
        },
      },
    ],
  },
};
