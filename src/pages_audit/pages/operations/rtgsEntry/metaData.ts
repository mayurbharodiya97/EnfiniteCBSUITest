import { utilFunction } from "components/utils";
import {
  getAccountDetail,
  getJointDetailsList,
  getRtgsTransactionTypeList,
} from "./api";
import { GridMetaDataType } from "components/dataTableStatic";
import { format, isValid } from "date-fns";
import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { isValidDate } from "components/utils/utilFunctions/function";
export const RtgsEntryFormMetaData = {
  form: {
    name: "rtgsEntry",
    label: "RTGS Entry(MST/552)",
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
        componentType: "autocomplete",
      },
      name: "ENTRY_TYPE",
      label: "RTGS/NEFT",
      options: [
        { label: "RTGS Transaction", value: "RTGS" },
        { label: "NEFT Transaction", value: "NEFT" },
      ],
      defaultValue: "RTGS",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
      // runValidationOnDependentFieldsChange: true,
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Date",
      placeholder: "",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRAN_TYPE",
      label: "Transaction Type",
      defaultValue: "R42",
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 2.4 },
      // runValidationOnDependentFieldsChange: true,
      skipDefaultOption: true,
      options: (dependentValue, formState, _, authState) => {
        return API.getRtgsTransactionTypeList({
          MSG_FLOW: "O",
        });
      },
      _optionsKey: "getRtgsTransactionTypeList",
      disableCaching: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_CD",
      label: "Slip No.",
      type: "text",
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DEF_TRAN_CD",
      label: "Comm. Type",
      defaultValue: "149",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
      options: (dependentValue, formState, _, authState) => {
        return API.getCommTypeList({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          CODE: "RTGSO",
        });
      },
      _optionsKey: "getCommTypeList",
      disableCaching: true,
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "BR_IFSC_CODE",
      label: "IFSC",
      defaultValue: "SBI0000KBCB",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
      options: async (dependentValue, formState, _, authState) => {
        const data = await API.getIfscCodeList({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        });
        return data;
      },
      _optionsKey: "getIfscCodeList",
      disableCaching: true,
    },

    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        // defaultValue: "099 ",
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          if (!field?.value) {
            formState.setDataOnFieldChange("ACCT_CD_BLANK");
            return {
              ACCT_NM: { value: "" },
              LIMIT_AMOUNT: { value: "" },
              ACCT_NAME: { value: "" },
              CONTACT_INFO: { value: "" },
              ACCT_MODE: { value: "" },
              ADD1: { value: "" },
              TRAN_BAL: { value: "" },
              ACCT_CD: { value: "" },
            };
          }
        },
      },

      accountTypeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        isFieldFocused: true,
        defaultfocus: true,
        defaultValue: "",
        runPostValidationHookAlways: true,
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "EMST/552",
          });
        },
        _optionsKey: "get_Account_Type",
        postValidationSetCrossFieldValues: (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          if (!field?.value) {
            formState.setDataOnFieldChange("ACCT_CD_BLANK");
            return {
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              LIMIT_AMOUNT: { value: "" },
              ACCT_NAME: { value: "" },
              CONTACT_INFO: { value: "" },
              ACCT_MODE: { value: "" },
              ADD1: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }
        },
      },
      accountCodeMetadata: {
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
            let Apireq = {
              COMP_CD: auth?.companyID,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentFieldsValues?.["ACCT_TYPE"]?.optionData
              ),
              ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
              BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
              AMOUNT: "",
              SCREEN_REF: "EMST/552",
            };
            formState.setDataOnFieldChange("API_REQ", Apireq);
            let postData = await getAccountDetail(Apireq);

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData.length; i++) {
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Account Validation Failed",
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "HNI Alert",
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Risk Category Alert",
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });

                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
                let jointDetail = await getJointDetailsList({
                  COMP_CD: auth?.companyID,
                  BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
                  ACCT_CD: utilFunction.getPadAccountNumber(
                    field?.value,
                    dependentFieldsValues?.["ACCT_TYPE"]?.optionData
                  ),
                  ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
                });
                formState.setDataOnFieldChange("JOINT_DETAIL", jointDetail);
              }
            }
            btn99 = 0;
            return {
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: field?.value.padStart(6, "0")?.padEnd(20, " "),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              TRAN_BAL: {
                value: returnVal?.TRAN_BAL ?? "",
              },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
              },
              ACCT_NAME: {
                value: returnVal?.ACCT_NAME ?? "",
              },
              ADD1: {
                value: returnVal?.ADD1 ?? "",
              },
              LIMIT_AMOUNT: {
                value: returnVal?.LIMIT_AMOUNT ?? "",
              },
              CONTACT_INFO: {
                value: returnVal?.CONTACT_INFO ?? "",
              },
              ACCT_MODE: {
                value: returnVal?.ACCT_MODE ?? "",
              },
            };
          } else if (!field?.value) {
            return {
              ACCT_NM: { value: "" },
              LIMIT_AMOUNT: { value: "" },
              ACCT_NAME: { value: "" },
              CONTACT_INFO: { value: "" },
              ACCT_MODE: { value: "" },
              ADD1: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }

          return {};
        },
        runPostValidationHookAlways: true,
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NAME",
      label: "A/C Name",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Shadow.Balance",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "Limit",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MODE",
      label: "A/C Mode",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Ord.A/C Name",
      type: "text",
      fullWidth: true,
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "A/C Address",
      type: "text",
      fullWidth: true,
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },

    {
      render: {
        componentType: "phoneNumber",
      },
      name: "CONTACT_INFO",
      label: "Contact Number",
      placeholder: "Mobile Number",
      type: "string",
      GridProps: { xs: 12, sm: 1.9, md: 1.9, lg: 1.9, xl: 1.9 },
      // validate: (columnValue, allField, flag) => {
      //   if (columnValue.value.length <= 0) {
      //     return "";
      //   } else if (columnValue.value.length >= 11) {
      //     return "The length of your Mobile Number is greater than 10 character";
      //   } else if (columnValue.value.length <= 9) {
      //     return "The length of your Mobile Number is less than 10 character";
      //   }
      //   return "";
      // },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Cheque No.",
      type: "text",
      required: true,
      autoComplete: "off",
      // isFieldFocused: true,
      // defaultfocus: true,
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
      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Cheque No. is required."] }],
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Cheque Date is required."] }],
      },
      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Amount",
      placeholder: "",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SERVICE_CHARGE",
      label: "Comm.",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: {
        xs: 12,
        md: 1.4,
        sm: 1.4,
        lg: 1.4,
        xl: 1.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GST",
      label: "GST",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: {
        xs: 12,
        md: 1.4,
        sm: 1.4,
        lg: 1.4,
        xl: 1.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REAMRKS",
      label: "Remarks",
      type: "text",
      fullWidth: true,
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 4.4, md: 4.4, lg: 4.4, xl: 4.4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL",
      label: "Total Amount",
      placeholder: "",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState
      ) => {
        if (currentFieldState?.value) {
          formState.setDataOnFieldChange(
            "AMOUNT",
            currentFieldState?.value ?? "0"
          );
        }
      },
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_BY",
      label: "Maker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_DATE",
      label: "Maker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      __VIEW__: { render: { componentType: "datetimePicker" } },
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "CONFIRMED",
      label: "Confirm status",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 1.1, md: 1.1, lg: 1.1, xl: 1.1 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "VERIFIED_BY",
      label: "Checker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      dependentFields: ["CONFIRMED"],
      __VIEW__: { render: { componentType: "textField" } },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 1.3, md: 1.2, lg: 1.2, xl: 1.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "VERIFIED_DATE",
      label: "Checker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      __VIEW__: { render: { componentType: "datetimePicker" } },
      fullWidth: true,
      isReadOnly: true,
      dependentFields: ["CONFIRMED"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ZONE_TRAN_TYPE",
    },
  ],
};

export const SlipJoinDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Joint Detail",
    rowIdColumn: "index",
    // rowIdColumn: "J_TYPE",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: false,
    disableGlobalFilter: true,
    hideFooter: false,
    hideHeader: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "28vh",
      max: "28vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_CD",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "rigth",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "JOINT_DISC",
      columnName: "Joint Type",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "REF_PERSON_NAME",
      columnName: "Person Name",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 300,
      minWidth: 300,
      maxWidth: 350,
    },
    {
      accessor: "DESIGNATION_NM",
      columnName: "Designation",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 300,
    },

    {
      accessor: "MEM_DISP_ACCT_TYPE",
      columnName: "Mem.Type - A/C No.",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
    {
      accessor: "REF_ACCT",
      columnName: "Reference Account",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 250,
    },
    {
      accessor: "phone1",
      columnName: "Contact No.",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "Customer ID",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};

export const rtgsAccountDetailFormMetaData: any = {
  form: {
    refID: 1667,
    name: "ChequeDetailFormMetaData",
    label: "Cheque Detail",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",

      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "spacer",
      },

      GridProps: {
        xs: 0,
        md: 1,
        sm: 4.7,
        lg: 4.7,
        xl: 4.7,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SLIP_AMOUNT",
      label: "Total Slip Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },

      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "FINALAMOUNT",
      label: "Total Cheque Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      validationRun: "onBlur",
      defaultValue: "0",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },

      dependentFields: ["chequeDetails"],

      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState,
        auth,
        dependentFieldState
      ) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["chequeDetails"])
            ? dependentFieldState?.["chequeDetails"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.AMOUNT?.value), 0);

        if (
          Number(currentFieldState.value) ===
          Number(accumulatedTakeoverLoanAmount)
        ) {
          return {};
        }

        if (accumulatedTakeoverLoanAmount) {
          return {
            FINALAMOUNT: {
              value: accumulatedTakeoverLoanAmount ?? 0,
            },
          };
        } else {
          return {
            FINALAMOUNT: {
              value: "",
            },
          };
        }
      },

      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_AMOUNT",
      label: "Total Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      validationRun: "onBlur",
      dependentFields: ["SLIP_AMOUNT", "FINALAMOUNT"],
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.SLIP_AMOUNT?.value) -
          Number(dependentFields?.FINALAMOUNT?.value);

        return value ?? "0";
      },
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_DT",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",

      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "RANGE_DT",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",

      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "ADDNEWROW",
      label: "Add Row",
      endsIcon: "AddCircleOutlineRounded",
      rotateIcon: "scale(2)",
      placeholder: "",
      type: "text",
      tabIndex: "-1",
      iconStyle: {
        fontSize: "25px !important",
      },
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      // isCustomStyle: true,
      isRemoveButton: true,
      displayCountName: "Beneficiary A/C Detail",
      isHeightAdjust: "14em",
      fixedRows: true,
      isScreenStyle: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "Are you Sure you want to delete this row?",
      name: "chequeDetails",
      removeRowFn: "deleteFormArrayFieldData",
      // arrayFieldIDName: "CHEQUE",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "autocomplete",
          },
          name: "TO_ACCT_NO",
          label: "A/C No",
          // defaultValue: "SBI0000KBCB",
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
          // options: async (dependentValue, formState, _, authState) => {
          //   const data = await API.getIfscCodeList({
          //     COMP_CD: authState?.companyID,
          //     BRANCH_CD: authState?.user?.branchCode,
          //   });
          //   return data;
          // },
          // _optionsKey: "getIfscCodeList",
          disableCaching: true,
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_NM",
          label: "Name",
          // placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          // maxLength: 20,

          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_TYPE",
          label: "Account Type",
          // placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          // maxLength: 20,

          GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "CONTACT_NO",
          label: "Mobile No.",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
        },
        // {
        //   render: {
        //     componentType: "textField",
        //   },
        //   name: "BRANCH",
        //   label: "Description",
        //   // placeholder: "EnterAcNo",
        //   type: "text",
        //   fullWidth: true,
        //   required: true,
        //   isReadOnly: true,
        //   // maxLength: 20,
        //   // schemaValidation: {
        //   //   type: "string",
        //   //   rules: [{ name: "required", params: ["Description is required."] }],
        //   // },
        //   GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 1.5 },
        // },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_EMAIL_ID",
          label: "Email ID",
          // placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          // maxLength: 20,
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["Description is required."] }],
          // },
          GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 3.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ADD1",
          label: "Address",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "REAMRKS",
          label: "Remarks",
          type: "text",
          fullWidth: true,
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMITTANCE_INFO",
          label: "Remittance Info.",
          type: "text",
          fullWidth: true,
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 3.2, md: 3.2, lg: 3.2, xl: 3.2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "",
          type: "text",
          FormatProps: {
            allowNegative: false,
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },

        {
          render: {
            componentType: "Divider",
          },
          dividerText: "IFSC Bank Detail",
          name: "Address",
          label: "Address",
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_IFSCCODE",
          label: "IFSC",
          // placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          // maxLength: 20,

          GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "Bank",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_NM",
          label: "Branch",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CONTACT_DTL",
          label: "Contact",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CENTER_NM",
          label: "Center",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADDR",
          label: "Address",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 4.3, md: 4.3, lg: 4.3, xl: 4.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DISTRICT_NM",
          label: "District",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "STATE_NM",
          label: "State",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          // defaultValue: "0123456789",
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
      ],
    },
  ],
};

export const AddNewBankMasterFormMetadata = {
  form: {
    name: "ClearingBankMasterForm",
    label: "Clearing Bank Master",
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
        componentType: "textField",
      },
      name: "RBI_CD",
      label: "RBI Code",
      placeholder: "",
      type: "text",
      maxLength: 20,
      isFieldFocused: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["RBI Code is required."] }],
      },
      GridProps: { xs: 6, sm: 2, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_CD",
      label: "Code",
      placeholder: "",
      type: "text",
      maxLength: 20,
      required: true,
      dependentFields: ["RBI_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields?.RBI_CD?.value ?? "";
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required."] }],
      },
      GridProps: { xs: 6, sm: 2, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
      label: "Bank Name",
      placeholder: "",
      type: "text",
      required: true,
      txtTransform: "uppercase",
      maxLength: 100,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Bank Name is required."] }],
      },
      GridProps: { xs: 12, sm: 3, md: 6, lg: 6, xl: 1.5 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "EXCLUDE",
      label: "Exclude",
      // defaultValue: true,
      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 4, xl: 1 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "CTS",
      label: "CTS",
      defaultValue: true,
      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 4, xl: 1 },
    },
  ],
};
export const RetrieveFormConfigMetaData = {
  form: {
    name: "RetrieveFormConfigMetaData",
    label: "Retrieve CTS O/W Clearing Data",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    // allowColumnHiding: true,
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
        componentType: "datePicker",
      },
      name: "FROM_TRAN_DT",
      label: "From Date",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["From Date is required."] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Must be a valid date";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TO_TRAN_DT",
      label: "To Date",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["To Date is required."] }],
      },
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Must be a valid date";
        }
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.FROM_TRAN_DT?.value)
        ) {
          return "To Date should be greater than or equal to From Date.";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["FROM_TRAN_DT"],
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      disableCaching: true,
      requestProps: "ZONE_TRAN_TYPE",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "SLIP_CD",
      label: "Slip No.",
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.5 },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",

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
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.5 },
      // maxLength: 50,
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "BANK_CD",
      label: "Bank Code",

      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CHEQUE_AMOUNT",
      label: "Cheque Amount",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.5 },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "RETRIEVE",
      label: "Retrieve",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1, xl: 1 },
    },
  ],
};

export const RetrieveGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Retrieve Grid",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "48vh",
      max: "48vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    // {
    //   accessor: "SR_NO",
    //   columnName: "Sr.No.",
    //   sequence: 1,
    //   alignment: "rigth",
    //   componentType: "default",
    //   width: 70,
    //   minWidth: 60,
    //   maxWidth: 120,
    //   isAutoSequence: true,
    // },
    {
      accessor: "SLIP_CD",
      columnName: "Slip No.",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_CNT",
      columnName: "Cheque Count",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_LIST",
      columnName: "Cheque No. List",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHQ_AMT_LIST",
      columnName: "Cheque Amount List",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "TRAN_DT",
      columnName: "CLG Date",
      sequence: 6,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },

    {
      accessor: "CONFIRMED",
      columnName: "Confirm Status",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "THROUGH_CHANNEL",
      columnName: "Entry From",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 10,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "Verified By",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "Verified Date",
      sequence: 12,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
  ],
};
