import * as API from "../api";
import { utilFunction } from "@acuteinfo/common-base";
export const GstOutwardForm = {
  masterForm: {
    form: {
      name: "master-gst-form",
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
            lg: 4,
            xl: 4,
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
          componentType: "autocomplete",
        },
        name: "MODE",
        label: "Mode",
        isFieldFocused: true,
        fullWidth: true,
        options: (dependentValue, formState, _, authState) => {
          return API.getGstOtwardModeDdw({
            BASE_COMP_CD: authState?.baseCompanyID,
            BASE_BRANCH_CD: authState?.user?.baseBranchCode,
            TEMPLATE_TYPE: "OUT",
          });
        },
        __EDIT__: {
          isReadOnly: true,
        },
        defaultValue: "T",
        _optionsKey: "GstOutwardModeDDW",
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "ENTERED_DATE",
        label: "EntryDate",
        __NEW__: {
          isWorkingDate: true,
        },
        fullWidth: true,
        format: "dd/MM/yyyy",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
      {
        render: { componentType: "_accountNumber" },
        branchCodeMetadata: {
          name: "BRANCH_CD",
          dependentFields: ["MODE"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["MODE"]?.value === "C") {
              return true;
            } else {
              return false;
            }
          },
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (formState?.defaultView === "edit") {
              return true;
            }
          },
          postValidationSetCrossFieldValues: (
            currentField,
            formState,
            authState,
            dependentFieldValue,
            reqFlag
          ) => {
            if (currentField?.value) {
              return {
                ACCT_CD: { value: "" },
                RECEIPT: { value: "" },
                PAYMENT: { value: "" },
                ACCT_NM: { value: "" },
                BALANCE: { value: "" },
              };
            }
          },
          GridProps: {
            xs: 12,
            sm: 2.4,
            md: 2.4,
            lg: 2.4,
            xl: 2.4,
          },
        },
        accountTypeMetadata: {
          name: "ACCT_TYPE",
          dependentFields: ["MODE"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (formState?.defaultView === "edit") {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["MODE"]?.value === "C") {
              return true;
            } else {
              return false;
            }
          },
          GridProps: {
            xs: 12,
            sm: 2.4,
            md: 2.4,
            lg: 2.4,
            xl: 2.4,
          },
        },
        accountCodeMetadata: {
          name: "ACCT_CD",
          dependentFields: ["BRANCH_CD", "ACCT_TYPE", "MODE"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (formState?.defaultView === "edit") {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["MODE"]?.value === "C") {
              return true;
            } else {
              return false;
            }
          },

          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const reqParameters = {
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
              ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.ACCT_TYPE?.optionData
              ),
              SCREEN_REF: "TRN/658",
            };

            if (
              dependentFieldValues?.BRANCH_CD?.value &&
              dependentFieldValues?.ACCT_TYPE?.value &&
              currentField?.value &&
              dependentFieldValues?.MODE?.value === "T" &&
              formState?.defaultView === "new"
            ) {
              const postData = await API.getAccountDetail(reqParameters);
              let btn99, returnVal;
              for (let i = 0; i < postData?.length; i++) {
                if (postData?.[i]?.O_STATUS === "999") {
                  const btnName = await formState.MessageBox({
                    messageTitle: "ValidationFailed",
                    message: postData?.[i]?.O_MESSAGE,
                  });
                  returnVal = "";
                } else if (postData?.[i]?.O_STATUS === "99") {
                  const btnName = await formState.MessageBox({
                    messageTitle: "Confirmation",
                    message: postData?.[i]?.O_MESSAGE,
                    buttonNames: ["Yes", "No"],
                  });
                  btn99 = btnName;
                  if (btnName === "No") {
                    returnVal = "";
                  }
                } else if (postData?.[i]?.O_STATUS === "9") {
                  const btnName = await formState.MessageBox({
                    messageTitle: "Alert",
                    message: postData?.[i]?.O_MESSAGE,
                  });
                } else if (postData?.[i]?.O_STATUS === "0") {
                  if (btn99 !== "No") {
                    returnVal = postData?.[i];
                    formState?.OpenDilogueBox(true);
                  } else {
                    returnVal = "";
                  }
                }
              }
              return {
                ACCT_CD:
                  returnVal !== ""
                    ? {
                        value: utilFunction.getPadAccountNumber(
                          currentField?.value,
                          dependentFieldValues?.ACCT_TYPE?.optionData
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
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                WIDTH_BAL: {
                  value: returnVal?.WIDTH_BAL ?? "",
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                GSTIN: {
                  value: returnVal?.GSTIN ?? "",
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
              };
            }
          },
          fullWidth: true,
          GridProps: {
            xs: 12,
            sm: 2.4,
            md: 2.4,
            lg: 2.4,
            xl: 2.4,
          },
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "WIDTH_BAL",
        label: "Balance",
        fullWidth: true,
        dependentFields: ["MODE"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.["MODE"]?.value === "C") {
            return true;
          } else {
            return false;
          }
        },
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "ACCT_NM",
        label: "Account_Name",
        dependentFields: ["MODE"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.["MODE"]?.value === "C") {
            return true;
          } else {
            return false;
          }
        },
        fullWidth: true,
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 4.8,
          sm: 4.8,
          lg: 4.8,
          xl: 4.8,
        },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        name: "GSTIN",
        label: "Gstin",
        dependentFields: ["MODE"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.["MODE"]?.value === "C") {
            return true;
          } else {
            return false;
          }
        },
        fullWidth: true,
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "",
      rowIdColumn: "TRAN_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: false,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "40vh", max: "45vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: false,
    },
    columns: [
      {
        accessor: "TRAN_CD",
        columnName: "SrNo",
        sequence: 1,
        alignment: "left",
        componentType: "default",
        width: 70,
        minWidth: 60,
        maxWidth: 100,
        __EDIT__: {
          isAutoSequence: true,
        },
      },
      {
        accessor: "TEMP_DISP",
        columnName: "Template",
        sequence: 2,
        alignment: "left",
        componentType: "default",
        width: 200,
        minWidth: 180,
        maxWidth: 220,
      },
      {
        accessor: "TAXABLE_VALUE",
        columnName: "ChargeAmount",
        alignment: "right",
        sequence: 3,
        componentType: "currency",
        isDisplayTotal: true,
        width: 150,
        minWidth: 120,
        maxWidth: 180,
      },
      {
        accessor: "TAX_AMOUNT",
        columnName: "taxAmount",
        sequence: 4,
        alignment: "right",
        isDisplayTotal: true,
        componentType: "currency",
        width: 150,
        minWidth: 120,
        maxWidth: 180,
      },
      {
        accessor: "CHEQUE_NO",
        columnName: "ChequeNo",
        sequence: 5,
        alignment: "right",
        componentType: "default",
        width: 100,
        minWidth: 80,
        maxWidth: 120,
      },
      {
        accessor: "CHEQUE_DT",
        columnName: "ChequeDate",
        sequence: 6,
        alignment: "left",
        componentType: "date",
        dateFormat: "dd/MMM/yyyy",
        width: 150,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        accessor: "REMARKS",
        columnName: "Remarks",
        sequence: 7,
        alignment: "left",
        componentType: "default",
        width: 200,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        accessor: "DELETE_ROW",
        columnName: "Delete",
        sequence: 8,
        alignment: "center",
        componentType: "buttonRowCell",
        isVisibleInNew: true,
        __VIEW__: {
          isVisible: false,
        },
        width: 150,
        minWidth: 120,
        maxWidth: 180,
      },
    ],
  },
};
