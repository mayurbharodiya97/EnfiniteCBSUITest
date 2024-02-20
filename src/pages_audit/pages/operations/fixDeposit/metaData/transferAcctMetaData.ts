import { utilFunction } from "components/utils";
import { validateAccountAndGetDetail } from "../api";

export const TransferAcctDetailFormMetadata = {
  form: {
    name: "transferAcctDetail",
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
        componentType: "arrayField",
      },
      name: "TRNDTLS",
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "DC_BRANCH_CD",
            GridProps: { xs: 12, sm: 1, md: 1, lg: 2.5, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "DC_ACCT_TYPE",
            GridProps: { xs: 12, sm: 1, md: 1, lg: 2.5, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "DC_ACCT_CD",
            dependentFields: ["DC_BRANCH_CD", "DC_ACCT_TYPE"],
            postValidationSetCrossFieldValues: async (...arg) => {
              const branchCode =
                arg?.[3]?.["TRNDTLS.DC_BRANCH_CD"]?.value ?? "";
              const accountType =
                arg?.[3]?.["TRNDTLS.DC_ACCT_TYPE"]?.value ?? "";
              const accountCode = utilFunction.getPadAccountNumber(
                arg?.[0]?.value,
                arg?.[3]?.["TRNDTLS.DC_ACCT_TYPE"]?.optionData
              );

              if (Boolean(branchCode) && Boolean(accountType) && accountCode) {
                const apiResponse = await validateAccountAndGetDetail(
                  arg?.[2]?.companyID,
                  branchCode,
                  accountType,
                  accountCode,
                  "FD_DR_ACT"
                );
                if (apiResponse?.status === "0") {
                  if (Boolean(apiResponse?.message)) {
                    arg?.[1]?.MessageBox(
                      "Information",
                      apiResponse?.message.startsWith("\n")
                        ? apiResponse?.message?.slice(1)
                        : apiResponse?.message
                    );
                  }
                  return {
                    DC_ACCT_CD: {
                      value: accountCode,
                      ignoreUpdate: true,
                    },
                    DC_ACCT_NM: {
                      value: apiResponse?.data?.[0]?.ACCT_NM ?? "",
                    },
                    TRAN_BAL: {
                      value: apiResponse?.data?.[0]?.WIDTH_BAL ?? "",
                    },
                  };
                } else {
                  return {
                    DC_ACCT_CD: {
                      value: "",
                      error: apiResponse?.message ?? "",
                      ignoreUpdate: true,
                    },
                    DC_ACCT_NM: { value: "" },
                  };
                }
              }
            },
            GridProps: { xs: 12, sm: 2, md: 2, lg: 3, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DC_ACCT_NM",
          label: "AC Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 2, md: 2, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TRAN_BAL",
          label: "Trn.Balance",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHEQUE_NO",
          label: "Cheque No.",
          placeholder: "Cheque No.",
          type: "text",
          autoComplete: "off",
          isRequired: true,
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
          GridProps: { xs: 6, sm: 2, md: 1.5, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "Cheque Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          defaultValue: new Date(),
          type: "text",
          fullWidth: true,
          maxDate: new Date(),
          maxLength: 6,
          defaultfocus: true,
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "",
          // isFieldFocused: true,
          // autoComplete: false,
          type: "text",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
      ],
    },
  ],
};
