import { utilFunction } from "components/utils";
import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { DefaultValue } from "recoil";
export const temporaryODentryMetadata = {
  masterForm: {
    form: {
      name: "temporaryOD-entryMetadata",
      label: "Temporary OD Against Entry",
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
              // formState.setDataOnFieldChange("IS_VISIBLE", {
              //   IS_VISIBLE: false,
              // });
              return {
                ACCT_TYPE: { value: "" },
                ACCT_CD: { value: "" },
              };
            }
          },
        },
        accountTypeMetadata: {
          isFieldFocused: true,
          options: (dependentValue, formState, _, authState) => {
            return GeneralAPI.get_Account_Type({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              USER_NAME: authState?.user?.id,
              DOC_CD: "ETRN/054",
            });
          },
          _optionsKey: "get_Account_Type",
          postValidationSetCrossFieldValues: async (field, formState) => {
            if (field?.value) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
              return {
                ACCT_CD: { value: "" },
              };
            }
          },
        },

        accountCodeMetadata: {
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
                SCREEN_REF: "ETRN/047",
              };
              let postData = await GeneralAPI.getAccNoValidation(
                otherAPIRequestPara
              );

              if (postData?.RESTRICTION) {
                formState.setDataOnFieldChange("IS_VISIBLE", {
                  IS_VISIBLE: false,
                });
                let res = await formState.MessageBox({
                  messageTitle: "Validation Failed...!",
                  message: postData?.RESTRICTION,
                  buttonNames: ["Ok"],
                  defFocusBtnName: "Ok",
                });

                if (res === "Ok") {
                  return {
                    ACCT_CD: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (postData?.MESSAGE1) {
                formState.setDataOnFieldChange("IS_VISIBLE", {
                  IS_VISIBLE: true,
                });
                formState.MessageBox({
                  messageTitle: "Risk Category Alert",
                  message: postData?.MESSAGE1,
                  buttonNames: ["Ok"],
                });
                return {
                  ACCT_CD: {
                    value: field.value.padStart(6, "0")?.padEnd(20, " "),
                    ignoreUpdate: true,
                  },
                };
              } else {
                formState.setDataOnFieldChange("IS_VISIBLE", {
                  IS_VISIBLE: true,
                });
                return {
                  ACCT_CD: {
                    value: field.value.padStart(6, "0")?.padEnd(20, " "),
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (!field.value) {
              formState.setDataOnFieldChange("IS_VISIBLE", {
                IS_VISIBLE: false,
              });
            }
            return {};
          },
          runPostValidationHookAlways: true,
          fullWidth: true,
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
        placeholder: "Select Parameters",
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
          rules: [{ name: "required", params: ["Please Select Value"] }],
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
          componentType: "datePicker",
        },
        name: "FROM_EFF_DATE",
        fullWidth: true,
        isWorkingDate: true,
        isMinWorkingDate: true,
        label: "Effective From Date",
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
          componentType: "datePicker",
        },
        name: "TO_EFF_DATE",
        fullWidth: true,
        isWorkingDate: true,
        isMaxWorkingDate: true,
        label: "Effective To Date",
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
        name: "AMOUNT_UPTO",
        label: "Amount UpTo",
        FormatProps: {
          allowNegative: false,
        },
        fullWidth: true,
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
      // {
      //   accessor: "SR_NO",
      //   columnName: "Sr No.",
      //   componentType: "default",
      //   sequence: 1,
      //   alignment: "center",
      //   width: 75,
      //   minWidth: 50,
      //   maxWidth: 100,
      //   isAutoSequence: true,
      // },
      {
        accessor: "TEMPLATE_CD",
        columnName: "Document(s)",
        componentType: "editableAutocomplete",
        // componentType: "editableSelect",
        options: (_, auth) => {
          return API.documentsListDD({
            COMP_CD: auth?.companyID,
            BRANCH_CD: auth?.user?.branchCode,
          });
        },
        _optionsKey: "documentsListDD",
        required: true,
        sequence: 2,
        alignment: "left",
        width: 350,
        minWidth: 200,
        maxWidth: 400,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This field is required"] }],
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
        columnName: "Valid Till Date",
        componentType: "editableDatePicker",
        alignment: "center",
        validation: (value, data, prev) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
        },
        sequence: 2,
        width: 150,
        minWidth: 70,
        maxWidth: 200,
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
