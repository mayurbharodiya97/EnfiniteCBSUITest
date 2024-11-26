import { GeneralAPI } from "registry/fns/functions";
import { getAccountCloseReason, getTRXList } from "./api";
import * as API from "./api";
import { t } from "i18next";
import { utilFunction, GridMetaDataType } from "@acuteinfo/common-base";

export const accountFindmetaData = {
  form: {
    name: "accountNumber",
    label: "EnterParameters",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
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
      _accountNumber: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "BRANCH_CD",
        isReadOnly: true,
        runPostValidationHookAlways: true,
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
            ACCT_CD: { value: "", ignoreUpdate: false },
          };
        },
        GridProps: { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        isFieldFocused: true,
        dependentFields: ["BRANCH_CD"],
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
              };
            }
          }
          return {
            ACCT_CD: { value: "", ignoreUpdate: false },
            ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        autoComplete: "off",
        dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            !Boolean(currentField?.displayValue) &&
            !Boolean(currentField?.value)
          ) {
            return {
              ACCT_NM: { value: "" },
            };
          } else if (!Boolean(currentField?.displayValue)) {
            return {};
          }
          const reqParameters = {
            BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value ?? "",
              dependentFieldValues?.ACCT_TYPE?.optionData ?? ""
            ),
            SCREEN_REF: formState?.docCD ?? "",
          };
          if (
            currentField?.value &&
            dependentFieldValues?.ACCT_TYPE?.value?.length === 0
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "Alert",
              message: "EnterAccountType",
              buttonNames: ["Ok"],
              icon: "WARNING",
            });

            if (buttonName === "Ok") {
              return {
                ACCT_CD: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                ACCT_TYPE: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            }
          } else if (
            dependentFieldValues?.BRANCH_CD?.value &&
            dependentFieldValues?.ACCT_TYPE?.value &&
            currentField?.value
          ) {
            formState.handleButtonDisable(true);
            const postData = await API.getAccountCloseValidation(reqParameters);
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
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData[i]?.O_MSG_TITLE ?? "Confirmation",
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                  icon: "CONFIRM",
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
                if (btnName === "Yes") {
                  returnVal = postData[i];
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
            formState.handleButtonDisable(false);
            btn99 = 0;

            formState.setDataOnFieldChange("closeAccountDetails", {
              ...returnVal,
              COMP_CD: authState?.companyID ?? "",
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value ?? "",
                dependentFieldValues?.ACCT_TYPE?.optionData ?? ""
              ),
              ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
              BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
              PARENT_TYPE:
                dependentFieldValues?.ACCT_TYPE?.optionData?.[0]?.PARENT_TYPE ??
                "",
            });

            return {
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.ACCT_TYPE?.optionData ?? ""
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
                ignoreUpdate: true,
                isFieldFocused: false,
              },

              PARENT_TYPE: {
                value:
                  dependentFieldValues?.ACCT_TYPE?.optionData?.[0]
                    ?.PARENT_TYPE ?? "",
              },
            };
          }
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARENT_TYPE",
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      placeholder: "AccountName",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
  ],
};

export const TransactionGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Transaction",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: true,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "20vh",
      max: "20vh",
    },
    allowColumnHiding: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
      isVisible: false,
    },
    {
      accessor: "ACCT_NO",
      columnName: "AccountNum",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 3,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 230,
      maxWidth: 330,
      showTooltip: true,
    },
    {
      accessor: "OPP_ACCT",
      columnName: "OppoAcct",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
      showTooltip: true,
    },
  ],
};

export const TransactionHoldGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "TransactionHold",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: true,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "20vh",
      max: "20vh",
    },
    allowColumnHiding: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
      isVisible: false,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "DrType",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 130,
      minWidth: 80,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_CD",
      columnName: "DrAcNo",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TO_BRANCH_CD",
      columnName: "CrBr",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "TO_ACCT_TYPE",
      columnName: "CrType",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 140,
      minWidth: 90,
      maxWidth: 190,
    },
    {
      accessor: "TO_ACCT_CD",
      columnName: "CrAcNo",
      sequence: 5,
      alignment: "right",
      componentType: "default",
      width: 160,
      minWidth: 110,
      maxWidth: 210,
    },
    {
      accessor: "TRAN_DT",
      columnName: "HoldDate",
      sequence: 6,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 340,
      minWidth: 230,
      maxWidth: 330,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },

    {
      accessor: "PAID",
      columnName: "PaidWaive",
      sequence: 10,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 120,
      maxWidth: 220,
    },
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "EnterBranch",
      sequence: 11,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
  ],
};

export const MembersGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Members",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: true,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "20vh",
      max: "20vh",
    },
    allowColumnHiding: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "ACCT_NO",
      columnName: "AccountNum",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_MST_ACCT_NM",
      columnName: "MemberName",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TRAN_BAL",
      columnName: "balance",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 140,
      minWidth: 90,
      maxWidth: 190,
    },
    {
      accessor: "STATUS",
      columnName: "status",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 110,
      maxWidth: 210,
    },
  ],
};

export const ParkedChargesGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ParkedCharges",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: true,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "20vh",
      max: "20vh",
    },
    allowColumnHiding: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "TRAN_CD",
      columnName: "",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
      isVisible: false,
    },

    {
      accessor: "ACCT_TYPE",
      columnName: "DrType",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 130,
      minWidth: 80,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_CD",
      columnName: "DrAcNo",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TO_BRANCH_CD",
      columnName: "CrBr",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      accessor: "TO_ACCT_TYPE",
      columnName: "CrType",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 140,
      minWidth: 90,
      maxWidth: 190,
    },
    {
      accessor: "TO_ACCT_CD",
      columnName: "CrAcNo",
      sequence: 5,
      alignment: "right",
      componentType: "default",
      width: 160,
      minWidth: 110,
      maxWidth: 210,
    },
    {
      accessor: "TRAN_DT",
      columnName: "TransactionDate",
      sequence: 6,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 7,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 230,
      maxWidth: 330,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_AVG_BAL",
      columnName: "AcctAvgBal",
      sequence: 10,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "MON_AVG_BAL",
      columnName: "MonAvgBal",
      sequence: 11,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "EnterBranch",
      sequence: 12,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
  ],
};

export const AccountCloseForm = {
  form: {
    name: "AccountCloseForm",
    label: "",
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
      numberFormat: {
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
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Amount",
      defaultValue: ".00",
      fullWidth: true,
      type: "text",
      textInputFromRight: true,
      isReadOnly: true,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TYPE_CD",
      label: "TrnBy",
      options: getTRXList,
      required: true,
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (formState?.isSubmitting) return {};
        if (field?.value !== "6") {
          return {
            NEFT: {
              value: false,
              ignoreUpdate: true,
            },
            PAYSLIP: {
              value: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Tranrequired"] }],
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      defaultValue: "",
      fullWidth: true,
      type: "text",
      GridProps: {
        xs: 12,
        sm: 4,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        name: "TRN_BRANCH_CD",
        validationRun: "onChange",
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          return {
            TRN_ACCT_NM: { value: "" },
            TRN_ACCT_TYPE: { value: "" },
            TRN_ACCT_CD: { value: "" },
          };
        },
        GridProps: { xs: 12, sm: 4, md: 1.5, lg: 1.5, xl: 1.5 },
        dependentFields: ["TYPE_CD", "PAYSLIP", "NEFT"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (
            dependentFieldsValues?.TYPE_CD?.value === "4" ||
            dependentFieldsValues?.TYPE_CD?.value === "1" ||
            Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
            Boolean(dependentFieldsValues?.NEFT?.value)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      accountTypeMetadata: {
        name: "TRN_ACCT_TYPE",
        GridProps: { xs: 12, sm: 4, md: 1.75, lg: 1.75, xl: 1.75 },
        dependentFields: ["TYPE_CD", "PAYSLIP", "NEFT", "TRN_BRANCH_CD"],
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
            dependentFieldValues?.TRN_BRANCH_CD?.value?.length === 0
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "Alert",
              message: "EnterAccountBranch",
              buttonNames: ["Ok"],
              icon: "WARNING",
            });

            if (buttonName === "Ok") {
              return {
                TRN_ACCT_TYPE: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                TRN_BRANCH_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            }
          }
          return {
            TRN_ACCT_CD: { value: "" },
            TRN_ACCT_NM: { value: "" },
          };
        },
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (
            dependentFieldsValues?.TYPE_CD?.value === "4" ||
            dependentFieldsValues?.TYPE_CD?.value === "1" ||
            Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
            Boolean(dependentFieldsValues?.NEFT?.value)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      accountCodeMetadata: {
        name: "TRN_ACCT_CD",
        autoComplete: "off",
        GridProps: { xs: 12, sm: 4, md: 1.75, lg: 1.75, xl: 1.75 },
        dependentFields: [
          "TYPE_CD",
          "PAYSLIP",
          "NEFT",
          "TRN_BRANCH_CD",
          "TRN_ACCT_TYPE",
        ],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            !Boolean(currentField?.displayValue) &&
            !Boolean(currentField?.value)
          ) {
            return {
              TRN_ACCT_NM: { value: "" },
            };
          } else if (!Boolean(currentField?.displayValue)) {
            return {};
          }
          const reqParameters = {
            BRANCH_CD: dependentFieldValues?.TRN_BRANCH_CD?.value ?? "",
            COMP_CD: authState?.companyID ?? "",
            ACCT_TYPE: dependentFieldValues?.TRN_ACCT_TYPE?.value ?? "",
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value ?? "",
              dependentFieldValues?.TRN_ACCT_TYPE?.optionData ?? ""
            ),
            SCREEN_REF: formState?.docCD,
          };
          if (
            currentField?.value &&
            dependentFieldValues?.TRN_ACCT_TYPE?.value?.length === 0
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "Alert",
              message: "EnterAccountType",
              buttonNames: ["Ok"],
              icon: "WARNING",
            });

            if (buttonName === "Ok") {
              return {
                TRN_ACCT_CD: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                TRN_ACCT_TYPE: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            }
          } else if (
            Boolean(dependentFieldValues?.TRN_BRANCH_CD?.value) &&
            Boolean(dependentFieldValues?.TRN_ACCT_TYPE?.value)
          ) {
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);
            let btn99, returnVal;
            for (let i = 0; i < postData?.MSG.length; i++) {
              if (postData?.MSG[i]?.O_STATUS === "999") {
                const btnName = await formState.MessageBox({
                  messageTitle:
                    postData?.MSG[i]?.O_MSG_TITLE ?? "ValidationFailed",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  icon: "ERROR",
                });
                returnVal = "";
              } else if (postData?.MSG[i]?.O_STATUS === "99") {
                const btnName = await formState.MessageBox({
                  messageTitle: postData?.MSG[i]?.O_MSG_TITLE ?? "Confirmation",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                  icon: "CONFIRM",
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData?.MSG[i]?.O_STATUS === "9") {
                const btnName = await formState.MessageBox({
                  messageTitle: postData?.MSG[i]?.O_MSG_TITLE ?? "Alert",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  icon: "WARNING",
                });
              } else if (postData?.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  if (
                    formState.accountRef?.BRANCH_CD ===
                      dependentFieldValues?.TRN_BRANCH_CD?.value &&
                    formState.accountRef?.ACCT_TYPE ===
                      dependentFieldValues?.TRN_ACCT_TYPE?.value &&
                    formState.accountRef?.ACCT_CD ===
                      utilFunction.getPadAccountNumber(
                        currentField?.value ?? "",
                        dependentFieldValues?.TRN_ACCT_TYPE?.optionData ?? ""
                      )
                  ) {
                    const btnName = await formState.MessageBox({
                      messageTitle: "ValidationFailed",
                      message: "SameACnotAllowed",
                      icon: "ERROR",
                    });
                    returnVal = "";
                  } else {
                    returnVal = postData;
                  }
                } else {
                  returnVal = "";
                }
              }
            }
            return {
              TRN_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.TRN_ACCT_TYPE?.optionData ?? ""
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              TRN_ACCT_NM: {
                value: postData?.ACCT_NM ?? "",
                ignoreUpdate: true,
              },
            };
          }
          return "";
        },
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (
            dependentFieldsValues?.TYPE_CD?.value === "4" ||
            dependentFieldsValues?.TYPE_CD?.value === "1" ||
            Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
            Boolean(dependentFieldsValues?.NEFT?.value)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "BRANCH_CODE_SPACER",
      GridProps: { xs: 12, sm: 4, md: 1.5, lg: 1.5, xl: 1.5 },
      dependentFields: ["TYPE_CD", "PAYSLIP", "NEFT"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TYPE_CD?.value === "4" ||
          dependentFieldsValues?.TYPE_CD?.value === "1" ||
          Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
          Boolean(dependentFieldsValues?.NEFT?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "ACCT_TYPE_SPACER",
      GridProps: { xs: 12, sm: 4, md: 1.75, lg: 1.75, xl: 1.75 },
      dependentFields: ["TYPE_CD", "PAYSLIP", "NEFT"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TYPE_CD?.value === "4" ||
          dependentFieldsValues?.TYPE_CD?.value === "1" ||
          Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
          Boolean(dependentFieldsValues?.NEFT?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "ACCT_CD_SPACER",
      GridProps: { xs: 12, sm: 4, md: 1.75, lg: 1.75, xl: 1.75 },
      dependentFields: ["TYPE_CD", "PAYSLIP", "NEFT"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TYPE_CD?.value === "4" ||
          dependentFieldsValues?.TYPE_CD?.value === "1" ||
          Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
          Boolean(dependentFieldsValues?.NEFT?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "TOKEN_NO_SPACER",
      GridProps: {
        xs: 6,
        sm: 4,
        md: 1,
        lg: 1,
        xl: 1,
      },
      dependentFields: ["TYPE_CD"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TYPE_CD?.value === "4") {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "TOKEN_NO",
      label: "TokenNo",
      defaultValue: "0",
      fullWidth: true,
      textInputFromRight: true,
      dependentFields: ["TYPE_CD"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TYPE_CD?.value === "4") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          Boolean(currentField?.value) &&
          Boolean(formState.accountRef?.ACCT_TYPE) &&
          Boolean(formState.accountRef?.BRANCH_CD)
        ) {
          let reqParameters = {
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: formState.accountRef?.BRANCH_CD ?? "",
            ACCT_TYPE: formState.accountRef?.ACCT_TYPE ?? "",
            ACCT_CD:
              utilFunction.getPadAccountNumber(
                formState.accountRef?.ACCT_CD ?? "",
                formState.accountRef?.ACCT_TYPE?.optionData ?? ""
              ) ?? "",
            TOKEN_NO: currentField?.value ?? "",
            SCREEN_REF: formState?.docCD,
          };
          let postData = await API.checkTokenValidate(reqParameters);
          postData = postData.sort(
            (a, b) => parseInt(b.O_STATUS) - parseInt(a.O_STATUS)
          );
          let btn99, returnVal;
          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.O_STATUS === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: postData[i]?.O_MSG_TITLE ?? "ValidationFailed",
                message: postData[i]?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: postData[i]?.O_MSG_TITLE ?? "Confirmation",
                message: postData[i]?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });
              btn99 = btnName;
              if (btnName === "No") {
                returnVal = "";
              }
            } else if (postData[i]?.O_STATUS === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData[i]?.O_MSG_TITLE ?? "Alert",
                  message: postData[i]?.O_MESSAGE ?? "",
                  icon: "WARNING",
                });
              }
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "0") {
              if (btn99 !== "No") {
                returnVal = currentField?.value;
              } else {
                returnVal = "";
              }
            }
          }
          btn99 = 0;
          return {
            TOKEN_NO: {
              value: returnVal ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {
            TOKEN_NO: { value: "", ignoreUpdate: true },
          };
        }
        return {};
      },
      GridProps: {
        xs: 6,
        sm: 4,
        md: 1,
        lg: 1,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "CHEQUE_NO_SPACER",
      GridProps: {
        xs: 6,
        sm: 4,
        md: 1,
        lg: 1,
        xl: 1,
      },
      dependentFields: ["TYPE_CD"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TYPE_CD?.value === "1") {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "ChequeNo",
      defaultValue: "0",
      fullWidth: true,
      className: "textInputFromRight",
      type: "text",
      dependentFields: ["TYPE_CD"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TYPE_CD?.value === "1") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (Boolean(field?.value)) {
          let postData = await GeneralAPI.getChequeNoValidation({
            BRANCH_CD: formState.accountRef?.BRANCH_CD ?? "",
            ACCT_TYPE: formState.accountRef?.ACCT_TYPE ?? "",
            ACCT_CD:
              utilFunction.getPadAccountNumber(
                formState.accountRef?.ACCT_CD ?? "",
                formState.accountRef?.ACCT_TYPE?.optionData ?? ""
              ) ?? "",
            CHEQUE_NO: field.value ?? "",
            TYPE_CD: dependentFieldsValues?.TYPE_CD?.value ?? "",
            SCREEN_REF: formState?.docCD,
          });
          let btn99;

          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.ERR_CODE === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: postData[i]?.O_MSG_TITLE ?? "ValidationFailed",
                message: postData[i]?.ERR_MSG,
                icon: "ERROR",
              });
              if (btnName === "Ok") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (postData[i]?.ERR_CODE === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: postData[i]?.O_MSG_TITLE ?? "Confirmation",
                message: postData[i]?.ERR_MSG,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });

              btn99 = btnName;
              if (btnName === "No") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (postData[i]?.ERR_CODE === "9") {
              const { btnName, obj } = await getButtonName({
                messageTitle: postData[i]?.O_MSG_TITLE ?? "Alert",
                message: postData[i]?.ERR_MSG,
                icon: "WARNING",
              });
            } else if (postData[i]?.ERR_CODE === "0") {
              return {
                CHEQUE_NO: {
                  value: field?.value,
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
              };
            }
          }
        }
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "CLOSE_REASON_CD",
      label: "AcCloseReason",
      fullWidth: true,
      options: getAccountCloseReason,
      _optionsKey: "getAccountCloseReason",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "TRN_ACCT_NM_SPACER",
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["TYPE_CD", "PAYSLIP", "NEFT"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TYPE_CD?.value === "4" ||
          dependentFieldsValues?.TYPE_CD?.value === "1" ||
          Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
          Boolean(dependentFieldsValues?.NEFT?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRN_ACCT_NM",
      label: "AccountName",
      fullWidth: true,
      isReadOnly: true,
      type: "text",
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["TYPE_CD", "PAYSLIP", "NEFT"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TYPE_CD?.value === "4" ||
          dependentFieldsValues?.TYPE_CD?.value === "1" ||
          Boolean(dependentFieldsValues?.PAYSLIP?.value) ||
          Boolean(dependentFieldsValues?.NEFT?.value)
        ) {
          return true;
        } else {
          return false;
        }
      },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "PAYSLIP_SPACER",
      GridProps: { xs: 3, sm: 2, md: 1.5, lg: 1, xl: 1 },
      dependentFields: ["NEFT"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (Boolean(dependentFieldsValues?.NEFT?.value)) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "PAYSLIP",
      label: "Payslip",
      GridProps: { xs: 3, sm: 2, md: 1.5, lg: 1, xl: 1 },
      dependentFields: ["TYPE_CD", "NEFT"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TYPE_CD?.value === "6" &&
          !Boolean(dependentFieldsValues?.NEFT?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "spacer",
      },
      name: "NEFT_SPACER",
      GridProps: { xs: 3, sm: 2, md: 1.5, lg: 1, xl: 1 },
      dependentFields: ["PAYSLIP"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (Boolean(dependentFieldsValues?.PAYSLIP?.value)) {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "checkbox",
      },
      name: "NEFT",
      label: "NEFT",
      GridProps: { xs: 3, sm: 2, md: 1.5, lg: 1, xl: 1 },
      dependentFields: ["TYPE_CD", "PAYSLIP"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TYPE_CD?.value === "6" &&
          !Boolean(dependentFieldsValues?.PAYSLIP?.value)
        ) {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "NOTE",
      label: "Amount*",
      defaultValue: `${t(`ACClosedNote`)}`,
      GridProps: { xs: 12 },
    },
  ],
};
