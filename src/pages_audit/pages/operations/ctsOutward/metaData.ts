import { utilFunction } from "components/utils";
import {
  clearingBankMasterConfigDML,
  getAccountSlipJoinDetail,
  getBankChequeAlert,
} from "./api";
import { GridMetaDataType } from "components/dataTableStatic";
import { format, isValid } from "date-fns";
import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
export const CTSOutwardClearingFormMetaData = {
  form: {
    name: "ctsOWClearing",
    label: "CTS O/W Clearing",
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
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Presentment Date",
      placeholder: "",
      GridProps: { xs: 6, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ZONE",
      label: "Zone",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      disableCaching: true,
      dependentFields: ["TRAN_DT"],
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_CD",
      label: "Slip No.",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __NEW__: {
        dependentFields: ["TRAN_DT", "ZONE", "ZONE_TRAN_TYPE"],
        setValueOnDependentFieldsChange: "getSlipNoData",
        disableCaching: true,
      },
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          formState.setDataOnFieldChange("ACCT_CD_BLANK");
          return {
            ACCT_CD: { value: "" },
            ACCT_TYPE: { value: "" },
            ACCT_NAME: { value: "" },
            TRAN_BAL: { value: "" },
          };
        },
      },

      accountTypeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        isFieldFocused: true,
        defaultfocus: true,
        defaultValue: "",
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          formState.setDataOnFieldChange("ACCT_CD_BLANK");
          return {
            ACCT_CD: { value: "", ignoreUpdate: true },
            ACCT_NAME: { value: "" },
            TRAN_BAL: { value: "" },
          };
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
              GD_TODAY_DT: auth?.workingDate,
              SCREEN_REF: "ETRN/559",
            };
            formState.setDataOnFieldChange("API_REQ", Apireq);
            let postData = await getAccountSlipJoinDetail(Apireq);

            if (postData?.[0]?.MESSAGE1) {
              formState?.MessageBox({
                messageTitle: "Information",
                message: postData?.[0]?.MESSAGE1,
              });
            } else if (postData?.[0]?.RESTRICT_MESSAGE) {
              formState?.MessageBox({
                messageTitle: "Account Validation Failed",
                message: postData?.[0]?.RESTRICT_MESSAGE,
              });
              formState.setDataOnFieldChange("ACCT_CD_VALID", []);
              return {
                ACCT_CD: { value: "", isFieldFocused: true },
                AMOUNT: { isFieldFocused: false },
                ACCT_NAME: { value: "" },
                TRAN_BAL: { value: "" },
              };
            }
            formState.setDataOnFieldChange("ACCT_CD_VALID", postData?.[0]);
            return {
              ACCT_CD: {
                value: postData?.[0]?.ACCT_NUMBER ?? "",
                isFieldFocused: false,
                // ||
                // field.value.padStart(6, "0")?.padEnd(20, " "),
                ignoreUpdate: true,
              },
              ACCT_NAME: {
                value: postData?.[0]?.ACCT_NAME ?? "",
              },
              TRAN_BAL: { value: postData?.[0].TRAN_BAL ?? "" },
            };
          } else {
            formState.setDataOnFieldChange("ACCT_CD_BLANK");
            return {
              ACCT_CD: {
                value: "",
              },
              ACCT_NAME: { value: "" },
              TRAN_BAL: { value: "" },
            };
          }
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
      GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Slip Amount",
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
    rowIdColumn: "GRID_SR_NO",
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
      accessor: "J_TYPE_NM",
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
      accessor: "MOBILE_NO",
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

export const ctsOutwardChequeDetailFormMetaData: any = {
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
      isRemoveButton: true,
      displayCountName: "Cheque Detail",
      fixedRows: true,
      isScreenStyle: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "Are you Sure you want to delete this row?",
      name: "chequeDetails",
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
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
            componentType: "numberFormat",
          },
          name: "BANK_CD",
          label: "Bank Code",
          placeholder: "Bank Code",
          type: "text",
          required: true,
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
            rules: [{ name: "required", params: ["Bank Code is required."] }],
          },

          dependentFields: ["TRAN_DT", "CHEQUE_NO"],

          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (field.value) {
              let formData = {
                COMP_CD: auth.companyID ?? "",
                BRANCH_CD: auth.user.branchCode ?? "",
                BANK_CD:
                  field.value && Number.isNaN(Number(field.value))
                    ? ""
                    : field.value.padEnd(10, " "),
              };
              let postData = await clearingBankMasterConfigDML(formData);
              if (postData?.data?.length && postData?.data) {
                formState.setDataOnFieldChange("MESSAGE", postData?.data);
                if (
                  postData?.status === "0" &&
                  dependentFieldsValues?.["chequeDetails.CHEQUE_NO"]?.value &&
                  field.value
                ) {
                  let data = await getBankChequeAlert({
                    ENTERED_COMP_CD: auth.companyID ?? "",
                    ENTERED_BRANCH_CD:
                      formState?.REQ_DATA?.BRANCH_CD ??
                      auth.user.branchCode ??
                      "",
                    BANK_CD:
                      field.value && Number.isNaN(Number(field.value))
                        ? ""
                        : field.value.padEnd(10, " "),
                    TRAN_TYPE: formState?.ZONE_TRAN_TYPE,
                    TRAN_DT: dependentFieldsValues?.TRAN_DT?.value ?? "",
                    CHEQUE_NO:
                      dependentFieldsValues?.["chequeDetails.CHEQUE_NO"]?.value,
                  });
                  if (data?.[0]?.O_STATUS === "99") {
                    let buttonNames = await formState?.MessageBox({
                      messageTitle: "Information",
                      message: data?.[0]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                    });
                    if (buttonNames === "Yes") {
                      return {
                        BANK_CD: {
                          value: field?.value ?? "",
                          ignoreUpdate: true,
                          isFieldFocused: false,
                        },
                        BANK_NM: {
                          value: postData?.data?.[0]?.BANK_NM ?? "",
                        },
                      };
                    } else {
                      return {
                        BANK_CD: {
                          value: "",
                          ignoreUpdate: true,
                          isFieldFocused: true,
                        },
                        BANK_NM: {
                          value: "",
                        },
                      };
                    }
                  }
                }
                return {
                  BANK_CD: {
                    error: postData?.data?.[0]?.ERROR_MSSAGE ?? "",
                    ignoreUpdate: true,
                  },
                  BANK_NM: {
                    value: postData?.data?.[0]?.BANK_NM ?? "",
                  },
                };
              } else {
                return {
                  BANK_CD: { value: "", isFieldFocused: true },
                  BANK_NM: { value: "" },
                };
              }
            } else if (!field?.value) {
              return {
                BANK_NM: { value: "" },
              };
            }
          },

          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
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
          isReadOnly: true,
          showMaxLength: true,
          autoComplete: "off",
          dependentFields: ["BANK_CD"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            if (!dependentFieldsValues?.["chequeDetails.BANK_CD"]?.value) {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.8, xl: 2.5 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "ECS_SEQ_NO",
          label: "Payee A/C No.",
          runExternalFunction: true,
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
          placeholder: "",
          type: "text",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Payee A/C No. is required."] },
            ],
          },
          GridProps: { xs: 12, sm: 2, md: 1.9, lg: 1.9, xl: 1.5 },
        },

        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "Cheque Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          type: "text",
          fullWidth: true,
          dependentFields: ["TRAN_DT", "RANGE_DT"],
          validate: (currentField, dependentField) => {
            const currentDate = new Date(currentField?.value);
            const rangeDate = new Date(dependentField?.RANGE_DT?.value);
            const transDate = new Date(dependentField?.TRAN_DT?.value);

            if (currentDate < rangeDate || currentDate > transDate) {
              return `Date should be between ${rangeDate.toLocaleDateString(
                "en-IN"
              )} - ${transDate.toLocaleDateString("en-IN")}`;
            }
          },

          required: true,
          maxLength: 6,

          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Cheque Date is required."] }],
          },
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH",
          label: "Description",
          type: "text",
          fullWidth: true,
          required: true,

          GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQ_MICR_CD",
          label: "CHQ Micr",
          type: "text",
          fullWidth: true,
          defaultValue: "10",
          required: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 2) {
                return false;
              }
              return true;
            },
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["CHQ Micr is required."] }],
          },
          GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ECS_USER_NO",
          label: "Payee Name",
          placeholder: "",
          type: "text",
          required: true,
          autoComplete: "off",
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Payee Name is required."] }],
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Cheque Amount",
          placeholder: "",
          required: true,
          type: "text",
          FormatProps: {
            allowNegative: false,
          },
          validationRun: "all",
          validate: (currentField, value) => {
            if (currentField?.value) {
              return;
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Cheque Amount is required."] },
            ],
          },

          postValidationSetCrossFieldValues: async (...arr) => {
            if (arr[0].value) {
              return {
                FINALAMOUNT: { value: arr[0].value ?? "0" },
              };
            } else {
              return {
                FINALAMOUNT: { value: "" },
              };
            }
          },
          GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
        },
      ],
    },
  ],
};
export const inwardReturnChequeDetailFormMetaData: any = {
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
      dependentFields: ["SLIP_AMOUNT", "FINALAMOUNT"],
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
      isRemoveButton: true,
      displayCountName: "Cheque Detail",
      fixedRows: true,
      isScreenStyle: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "Are you Sure you want to delete this row?",
      name: "chequeDetails",
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "BANK_CD",
          label: "Bank Code",
          placeholder: "Bank Code",
          type: "text",
          required: true,
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
            rules: [{ name: "required", params: ["Bank Code is required."] }],
          },
          dependentFields: ["TRAN_DT", "CHEQUE_NO"],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (field.value) {
              let formData = {
                COMP_CD: auth.companyID ?? "",
                BRANCH_CD: auth.user.branchCode ?? "",
                BANK_CD:
                  field.value && Number.isNaN(Number(field.value))
                    ? ""
                    : field.value.padEnd(10, " "),
              };

              let postData = await clearingBankMasterConfigDML(formData);

              if (postData?.data?.length && postData?.data) {
                formState.setDataOnFieldChange("MESSAGE", postData?.data);
                // if (
                //   postData?.status === "0" &&
                //   dependentFieldsValues?.["chequeDetails.CHEQUE_NO"]?.value &&
                //   field.value
                // ) {
                //   let data = await getBankChequeAlert({
                //     ENTERED_COMP_CD: auth.companyID ?? "",
                //     ENTERED_BRANCH_CD:
                //       formState?.REQ_DATA?.BRANCH_CD ??
                //       auth.user.branchCode ??
                //       "",
                //     BANK_CD:
                //       field.value && Number.isNaN(Number(field.value))
                //         ? ""
                //         : field.value.padEnd(10, " "),
                //     TRAN_TYPE: formState?.ZONE_TRAN_TYPE,
                //     TRAN_DT: dependentFieldsValues?.TRAN_DT?.value ?? "",
                //     CHEQUE_NO:
                //       dependentFieldsValues?.["chequeDetails.CHEQUE_NO"]?.value,
                //   });
                //   if (data?.[0]?.O_STATUS === "99") {
                //     let buttonNames = await formState?.MessageBox({
                //       messageTitle: "Information",
                //       message: data?.[0]?.O_MESSAGE,
                //       buttonNames: ["Yes", "No"],
                //     });
                //     if (buttonNames === "No") {
                //       return {
                //         BANK_CD: {
                //           value: "",
                //           isFieldFocused: true,
                //           ignoreUpdate: true,
                //         },
                //       };
                //     }
                //   }
                // }
                return {
                  BANK_CD: { error: postData?.data?.[0]?.ERROR_MSSAGE ?? "" },
                  BANK_NM: {
                    value: postData?.data?.[0]?.BANK_NM ?? "",
                  },
                };
              } else {
                return {
                  BANK_CD: { value: "", isFieldFocused: true },
                  BANK_NM: { value: "" },
                };
              }
            } else if (!field?.value) {
              return {
                BANK_NM: { value: "" },
              };
            }
          },

          GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
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
          isReadOnly: true,
          showMaxLength: true,
          autoComplete: "off",
          dependentFields: ["BANK_CD"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            if (!dependentFieldsValues?.["chequeDetails.BANK_CD"]?.value) {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 3.2, md: 3.2, lg: 3.2, xl: 3.2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH",
          label: "Description",
          type: "text",
          fullWidth: true,
          required: true,

          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "REASON",
          label: "Reason",
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },

          options: (dependentValue, formState, _, authState) => {
            let ApiReq = {
              BRANCH_CD: authState?.user?.branchCode,
              COMP_CD: authState?.companyID,
              RETURN_TYPE: "CLG",
            };
            return API.getInwardReasonTypeList(ApiReq);
          },
          _optionsKey: "getInwardReasonTypeList",
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQ_MICR_CD",
          label: "CHQ Micr",
          type: "text",
          fullWidth: true,
          defaultValue: "10",
          required: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: true,
            isAllowed: (values) => {
              if (values?.value?.length > 2) {
                return false;
              }
              return true;
            },
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["CHQ Micr is required."] }],
          },
          GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
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
          dependentFields: ["BANK_CD", "TRAN_DT"],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            if (
              dependentFieldsValues?.["chequeDetails.BANK_CD"]?.value &&
              field.value
            ) {
              let data = await getBankChequeAlert({
                ENTERED_COMP_CD: auth.companyID ?? "",
                ENTERED_BRANCH_CD:
                  formState?.REQ_DATA?.BRANCH_CD ?? auth.user.branchCode ?? "",
                CHEQUE_NO:
                  field.value && Number.isNaN(Number(field.value))
                    ? ""
                    : field.value.padEnd(10, " "),
                TRAN_TYPE: formState?.ZONE_TRAN_TYPE,
                TRAN_DT: dependentFieldsValues?.TRAN_DT?.value ?? "",
                BANK_CD:
                  dependentFieldsValues?.["chequeDetails.BANK_CD"]?.value,
              });

              if (data?.[0]?.O_STATUS === "99") {
                let buttonNames = await formState?.MessageBox({
                  messageTitle: "Information",
                  message: data?.[0]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                if (buttonNames === "Yes") {
                  if (
                    field.value &&
                    Object.keys(formState?.REQ_DATA).length === 0
                  ) {
                    formState?.MessageBox({
                      messageTitle: "Information",
                      message: "Enter Account Information",
                      buttonNames: ["Ok"],
                    });
                  } else if (
                    field.value &&
                    Object.keys(formState?.REQ_DATA).length
                  ) {
                    let postData = await GeneralAPI.getChequeNoValidation({
                      COMP_CD: formState?.REQ_DATA?.COMP_CD,
                      BRANCH_CD: formState?.REQ_DATA?.BRANCH_CD,
                      ACCT_TYPE: formState?.REQ_DATA?.ACCT_TYPE,
                      ACCT_CD: formState?.REQ_DATA?.ACCT_CD,
                      CHEQUE_NO: field.value,
                    });
                    const buttonName = await formState?.MessageBox({
                      messageTitle: "Information",
                      message: postData?.[0]?.ERR_MSG,
                      buttonNames: ["Ok"],
                    });
                    if (buttonName === "Ok") {
                      let continueButtonName = await formState?.MessageBox({
                        messageTitle: "Confirmation",
                        message: "Are you sure to continue!",
                        buttonNames: ["Yes", "No"],
                      });
                      if (continueButtonName === "Yes") {
                        return {
                          CHEQUE_NO: {
                            value: field.value,
                            ignoreUpdate: true,
                            isFieldFocused: false,
                          },
                          AMOUNT: { isFieldFocused: true },
                        };
                      } else {
                        return {
                          CHEQUE_NO: {
                            value: "",
                            isFieldFocused: true,
                            ignoreUpdate: true,
                          },
                        };
                      }
                    }
                  }
                  return {
                    CHEQUE_NO: {
                      value: field?.value ?? "",
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    },
                  };
                } else {
                  return {
                    CHEQUE_NO: {
                      value: "",
                      ignoreUpdate: true,
                      isFieldFocused: true,
                    },
                  };
                }
              }
            }
          },
          GridProps: { xs: 6, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Cheque No. is required."] }],
          },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "Cheque Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          type: "text",
          fullWidth: true,
          dependentFields: ["TRAN_DT", "RANGE_DT"],
          validate: (currentField, dependentField) => {
            const currentDate = new Date(currentField?.value);
            const rangeDate = new Date(dependentField?.RANGE_DT?.value);
            const transDate = new Date(dependentField?.TRAN_DT?.value);

            if (currentDate < rangeDate || currentDate > transDate) {
              return `Date should be between ${rangeDate.toLocaleDateString(
                "en-IN"
              )} - ${transDate.toLocaleDateString("en-IN")}`;
            }
          },

          required: true,
          maxLength: 6,

          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Cheque Date is required."] }],
          },
          GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Cheque Amount",
          placeholder: "",
          required: true,
          type: "text",
          FormatProps: {
            allowNegative: false,
          },
          validationRun: "all",
          validate: (currentField, value) => {
            if (currentField?.value) {
              return;
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Cheque Amount is required."] },
            ],
          },

          postValidationSetCrossFieldValues: async (...arr) => {
            if (arr[0].value) {
              return {
                FINALAMOUNT: { value: arr[0].value ?? "0" },
              };
            } else {
              return {
                FINALAMOUNT: { value: "" },
              };
            }
          },
          GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
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
