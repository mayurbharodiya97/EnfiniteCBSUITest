import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { utilFunction } from "components/utils";
import { render } from "react-dom";
import { GeneralAPI } from "registry/fns/functions/general";
import * as API from "./api";
import { addMonths, format, subDays } from "date-fns";
import { GridMetaDataType } from "components/dataTableStatic";
import { getDailyTransactionImportData } from "./api";
import { fi } from "date-fns/locale";


export const DailyTransactionImportMetadata = {
  form: {
    name: "DailyTransactionImport",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "sequence",
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "divider",
      },
      // dividerText: "IFSC Bank Detail",
      name: "AccountDetail",
      label: "Please Enter Details",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        name: "FROM_BRANCH_CD",
        GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
        runPostValidationHookAlways: true,
        render: {
          componentType: "textField",
        },
        isReadOnly: true,
      },

      accountTypeMetadata: {
        name: "FROM_ACCT_TYPE",
        GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
        isFieldFocused: true,
        defaultfocus: true,
        defaultValue: "",
        runPostValidationHookAlways: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "MST/454",

          });
        },
        postValidationSetCrossFieldValues: (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          // if (!field?.value) {
          //   formState.setDataOnFieldChange("IS_VISIBLE", { IS_VISIBLE: false });
          //   return {
          //     ACCT_CD: { value: "", ignoreUpdate: true },
          //     ACCT_NM: { value: "" },
          //   };
          // }
        },
      },
      accountCodeMetadata: {
        name: "FROM_ACCT_CD",
        fullWidth: true,
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
        dependentFields: ["FROM_ACCT_TYPE", "FROM_BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          if (
            field.value &&
            dependentFieldsValues?.["FROM_ACCT_TYPE"]?.value &&
            dependentFieldsValues?.["FROM_BRANCH_CD"]?.value
          ) {
            if (formState?.isSubmitting) return {};
            let Apireq = {
              COMP_CD: auth?.companyID,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentFieldsValues?.["FROM_ACCT_TYPE"]?.optionData
              ),
              ACCT_TYPE: dependentFieldsValues?.["FROM_ACCT_TYPE"]?.value,
              BRANCH_CD: dependentFieldsValues?.["FROM_BRANCH_CD"]?.value,
              SCREEN_REF: "MST/454",
            };
            console.log("Apireq", Apireq)
            let postData = await GeneralAPI.getAccNoValidation(Apireq);

            let btn99, returnVal;
            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData?.MSG?.length; i++) {
              formState.setDataOnFieldChange("GRID_DETAIL", []);
              if (postData?.MSG?.[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "ValidationFailed",
                  message: postData?.MSG?.[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData?.MSG?.[i]?.O_STATUS === "9") {
                formState.setDataOnFieldChange("GRID_DETAIL", []);
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message: postData?.MSG?.[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData
              } else if (postData?.MSG?.[i]?.O_STATUS === "99") {
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
                if (btn99 !== "No") {
                  returnVal = postData
                } else {
                  returnVal = "";
                }
                let gridDetail = await getDailyTransactionImportData({
                  COMP_CD: auth?.companyID,
                  BRANCH_CD: dependentFieldsValues?.["FROM_BRANCH_CD"]?.value,
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentFieldsValues?.["FROM_ACCT_TYPE"]?.optionData
                  ),
                  ACCT_TYPE: dependentFieldsValues?.["FROM_ACCT_TYPE"]?.value,
                  FLAG: "R",
                  CHEQUE_NO: "",
                  OPP_ENT: "",
                  REMARKS: "",
                  TABLE_NM: "",
                  IGNR_INSUF: "",
                });
                console.log("gridDetail", gridDetail)
                formState.setDataOnFieldChange("GRID_DETAIL", gridDetail);
              }
            }
            btn99 = 0;
            return {
              FROM_ACCT_CD:
                returnVal !== ""
                  ? {
                    value: utilFunction.getPadAccountNumber(
                      field?.value,
                      dependentFieldsValues?.FROM_ACCT_TYPE?.optionData
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
              TRAN_BAL: {
                value: returnVal?.TRAN_BAL ?? "",
              },
              TYPE_CD: {
                value: returnVal?.TYPE_CD ?? "",
              },
              DESCRIPTION: {
                value: "", isFieldFocused: true,

              },
            };
          } else {
            formState.setDataOnFieldChange("GRID_DETAIL", []);
            return {
              FROM_ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              TRAN_BAL: { value: "" },

            };
          }
        },
        runPostValidationHookAlways: true,
        GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
      GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
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
      GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "ShadowBalance",
      placeholder: "",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DESCRIPTION",
      label: "Configuration",
      fullWidth: true,
      options: async (dependentValue, formState, _, authState) => {
        return API.getDailyImportConfigData({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        });
      },
      _optionsKey: "getDailyImportConfigData",
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (field.value) {
          console.log("field", field)
          return {
            TABLE_NM: {
              value: field?.optionData?.[0]?.TABLE_NM
            },
            TRAN_CD: {
              value: field?.optionData?.[0]?.TRAN_CD
            }
          }
        } else {
          return {
            TABLE_NM: { value: "" },
            TRAN_CD: { value: "" }
          }
        }
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TABLE_NM",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "ChequeNo",
      placeholder: "Cheque No.",
      type: "text",
      autoComplete: "off",

      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 10) {
            return false;
          }

          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["PleaseEnterChequeNumber"],
          },
        ],
      },
      dependentFields: ["FROM_ACCT_CD", "FROM_ACCT_TYPE", "FROM_BRANCH_CD", "TYPE_CD"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (
          field.value &&
          dependentFieldsValues?.["FROM_ACCT_CD"]?.value.length === 0
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Information",
            message: "Enter Account Information",
            buttonNames: ["Ok"],
          });

          if (buttonName === "Ok") {
            return {
              CHEQUE_NO: {
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
          field.value &&
          dependentFieldsValues?.["FROM_ACCT_CD"]?.value?.length
        ) {
          if (formState?.isSubmitting) return {};
          let postData = await GeneralAPI.getChequeNoValidation({
            COMP_CD: auth?.companyID,
            BRANCH_CD: dependentFieldsValues?.["FROM_BRANCH_CD"]?.value,
            ACCT_TYPE: dependentFieldsValues?.["FROM_ACCT_TYPE"]?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              dependentFieldsValues?.["FROM_ACCT_CD"]?.value,
              dependentFieldsValues?.["FROM_ACCT_TYPE"]?.optionData
            ),
            CHEQUE_NO: field.value,
            TYPE_CD: dependentFieldsValues?.["TYPE_CD"]?.value,
            SCREEN_REF: "MST/454"
          });
          let btn99;

          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.ERR_CODE === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "ValidationFailed",
                message: postData[i]?.ERR_MSG,
              });
              if (btnName === "Ok") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  CHEQUE_DT: {
                    value: "",
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (postData[i]?.ERR_CODE === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Alert",
                  message: postData[i]?.ERR_MSG,
                });
              }
            } else if (postData[i]?.ERR_CODE === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Confirmation",
                message: postData[i]?.ERR_MSG,
                buttonNames: ["Yes", "No"],
              });

              btn99 = btnName;
              if (btnName === "No") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  CHEQUE_DT: {
                    value: "",
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  },
                };
              }
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
      GridProps: { xs: 6, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      fullWidth: true,
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "OPP_ENT",
      label: "Generate Opposite Entry",
      defaultValue: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "IGNR_INSUF",
      label: "Ignore Insufficient Balance",
      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "SELECT",
      label: "Select File",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",

      // GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
    },
  ],
};
export const DailyTransactionImportGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Debit From Account",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    // hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "40vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 75,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "CREDIT_AC",
      columnName: "Credit to Account",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 150,
      maxWidth: 290,
    },
    {
      accessor: "SDC",
      columnName: "SDC",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      width: 100,
      minWidth: 130,
      maxWidth: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx.",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 100,
      minWidth: 130,
      maxWidth: 200,
    },

    {
      accessor: "CHEQUE_NO",
      columnName: "Cheque No",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 150,
      maxWidth: 180,
    },

    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 150,
      maxWidth: 180,
    },

    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 150,
      maxWidth: 290,
    },
    {
      accessor: "STATUS",
      columnName: "Status",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 100,
      minWidth: 150,
      maxWidth: 190,
    },
  ],
};


