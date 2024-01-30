import { GeneralAPI } from "registry/fns/functions";
import { getFDAccountsDetail } from "./api";
export const FixDepositParaFormMetadata = {
  form: {
    name: "fixDepositParameter",
    label: "Fix Deposit Entry",
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
        componentType: "select",
      },
      name: "FD_TYPE",
      label: "FD Operation",
      options: [
        { label: "Fresh FD Account", value: "F" },
        { label: "Existing FD Account", value: "E" },
        { label: "FD Payment", value: "P" },
        { label: "FD Payment Instruction", value: "I" },
      ],
      defaultValue: "E",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["FD Type is required."] },
          { name: "FD_TYPE", params: ["Please select FD Type"] },
        ],
      },
      // fieldValidationRun: "all",
      postValidationSetCrossFieldValues: async (field, formState) => {
        console.log(">>field qwodj.1", field);
        formState.setDataOnFieldChange("FD_TYPE", field?.value);
        // return {
        //   CUSTOMER_ID: { value: "" },
        //   CUSTOMER_NAME: { value: "" },
        // };
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "MODE",
      label: "Mode",
      options: [
        { label: "Clearing", value: "2" },
        { label: "Transfer", value: "3" },
        { label: "Cash", value: "4" },
      ],
      defaultValue: "3",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Mode is required."] },
          { name: "MODE", params: ["Please select Mode"] },
        ],
      },
      // fieldValidationRun: "all",
      postValidationSetCrossFieldValues: async (field, formState) => {
        formState.setDataOnFieldChange("MODE qwodj.2", field?.value);
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      maxLength: 12,
      required: true,
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
        isValidation: "no",
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["CustomerIDisrequired"] },
          {
            name: "max",
            params: [12, "CustomerIDShouldNotBeLessThan12Digits"],
          },
        ],
      },
      dependentFields: ["FD_TYPE", "MODE"],
      // setValueOnDependentFieldsChange: (...arg) => {
      //   console.log(">>arg", arg);
      //   return "";
      // },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentField
      ) => {
        console.log(">>dependentField qwodj.3", dependentField);
        if (dependentField?.FD_TYPE?.value === "E") {
          formState.setDataOnFieldChange("CUSTOMER_ID_FEFORE");
          let Apireq = {
            COMP_CD: auth?.companyID ?? "",
            USER_NAME: auth?.user?.id ?? "",
            CUSTOMER_ID: field?.value ?? "",
          };

          let fdAccounts = await getFDAccountsDetail(Apireq);
          formState.setDataOnFieldChange("CUSTOMER_ID", {
            ...field,
            FD_ACCTS: fdAccounts,
          });
          if (fdAccounts?.length) {
            return {
              CUSTOMER_NAME: {
                value: fdAccounts?.[0]?.CUSTOMER_NAME ?? "",
              },
              FDACCTS: {
                value: fdAccounts,
              },
            };
            // }
          } else {
            return {
              CUSTOMER_ID: {
                error: "FD Accounts not found for this Customer ID.",
              },
              CUSTOMER_NAME: { value: "" },
            };
          }
        }
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CUSTOMER_NAME",
      label: "Customer Name",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3.5 },
    },
  ],
};

export const FixDepositAccountsFormMetadata = {
  form: {
    name: "fixDepositAccounts",
    label: "Fix Deposit Entry",
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
      name: "FDACCTS",
      removeRowFn: "deleteFormArrayFieldData",
      fixedRows: true,
      isCustomStyle: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        // {
        //   render: {
        //     componentType: "_accountNumber",
        //   },
        //   branchCodeMetadata: {
        //     GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        //   },
        //   accountTypeMetadata: {
        //     GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        //   },
        //   accountCodeMetadata: {
        //     name: "ACCT_CD",
        //     GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        //   },
        // },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_CD",
          label: "Branch Code",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_TYPE",
          label: "Account Type",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_CD",
          label: "Account Number",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NM",
          label: "Account Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "FD_AMT",
          label: "New FD Amount",
          placeholder: "",
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          className: "textInputFromRight",
          name: "NO_OF_FD",
          label: "No. of FD",
          defaultValue: 1,
          FormatProps: {
            allowNegative: false,
            isAllowed: (values) => {
              if (values?.value?.length > 5) {
                return false;
              }
              if (parseInt(values?.value) > 100) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TOTAL_AMT",
          label: "Total FD Amount",
          placeholder: "",
          isReadOnly: true,
          dependentFields: ["FD_AMT", "NO_OF_FD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const fdAmount = Number(dependentFields["FDACCTS.FD_AMT"]?.value);
            const numberOfFD = Number(
              dependentFields["FDACCTS.NO_OF_FD"]?.value
            );

            const total = fdAmount * numberOfFD;
            return total.toFixed(2);
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "CR_BRANCH_CD",
            label: "Credit Branch",
            required: false,
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "CR_ACCT_TYPE",
            label: "Credit A/c Type",
            required: false,
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "CR_ACCT_CD",
            label: "Credit A/c No.",
            required: false,
            dependentFields: ["CR_BRANCH_CD", "CR_ACCT_TYPE"],
            postValidationSetCrossFieldValues: () => {
              console.log(">>accountCode");
            },
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CR_ACCT_NM",
          label: "Credit Account Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "MATURE_INST",
          label: "Mature Instruction",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NOMINEE_NM",
          label: "Nominee",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
        },
      ],
    },
  ],
};

export const FixDepositDetailFormMetadata = {
  form: {
    name: "fixDepositDetail",
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
      name: "FDDTL",
      removeRowFn: "deleteFormArrayFieldData",
      fixedRows: true,
      isCustomStyle: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_CD",
          label: "Branch Code",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_TYPE",
          label: "Account Type",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_CD",
          label: "Account Number",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "FD_NO",
          label: "FD Number",
          placeholder: "",
          maxLength: 10,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 10) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
            isValidation: "no",
          },
          // schemaValidation: {
          //   type: "string",
          //   rules: [
          //     { name: "required", params: ["CustomerIDisrequired"] },
          //     {
          //       name: "max",
          //       params: [12, "CustomerIDShouldNotBeLessThan12Digits"],
          //     },
          //   ],
          // },
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TRSF_AMT",
          label: "Transfer Amount",
          placeholder: "",
          // isFieldFocused: true,
          // autoComplete: false,
          type: "text",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NAME",
          label: "AC Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TOTAL",
          label: "Total",
          placeholder: "",
          // isFieldFocused: true,
          // autoComplete: false,
          type: "text",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "TRAN_DT",
          label: "AsOn Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          defaultValue: new Date(),
          type: "text",
          fullWidth: true,
          maxDate: new Date(),
          maxLength: 6,
          defaultfocus: true,
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "PERIOD_CD",
          label: "Period/Tenor",
          options: [
            { label: "Day(s)", value: "D" },
            { label: "Month(s)", value: "M" },
            { label: "Year(s)", value: "Y" },
          ],
          defaultValue: "D",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Period/Tenor is required."] },
              { name: "PERIOD_CD", params: ["Please select Period/Tenor"] },
            ],
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PERIOD_NO",
          label: "Tenor",
          placeholder: "",
          maxLength: 4,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 4) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
            isValidation: "no",
          },
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Tenor is Required."] }],
          },
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MATURITY_AMT",
          label: "Maturity Amount",
          placeholder: "",
          // isFieldFocused: true,
          // autoComplete: false,
          type: "text",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "MATURITY_DT",
          label: "Maturity Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "INT_RATE",
          label: "Interest Rate",
          placeholder: "",
          required: true,
          type: "text",
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Rate is Required."] },
            ],
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "TERM_CD",
          label: "Interest Term",
          options: [
            { label: "MONTHLY", value: "M" },
            { label: "QUARTERLY", value: "Q" },
            { label: "HALF-YEARLY", value: "H" },
            { label: "YEARLY", value: "Y" },
          ],
          defaultValue: "D",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Term is required."] },
              { name: "TERM_CD", params: ["Please select Interest Term"] },
            ],
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CATEG_NM",
          label: "Category",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "BIRTH_DT",
          label: "Birth Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MONTHLY_INT",
          label: "Month Interest",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "CR_BRANCH_CD",
            label: "Credit Branch",
            required: false,
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "CR_ACCT_TYPE",
            label: "Credit A/c Type",
            required: false,
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "CR_ACCT_CD",
            label: "Credit A/c No.",
            required: false,
            dependentFields: ["CR_BRANCH_CD", "CR_ACCT_TYPE"],
            postValidationSetCrossFieldValues: () => {
              console.log(">>accountCode");
            },
            GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CR_ACCT_NM",
          label: "AC Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "MATURE_INST",
          label: "Mature Instruction",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "FD_REMARK",
          label: "FD Remark",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "nominee_nm",
          label: "Nominee Name",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.5, xl: 1.5 },
        },
      ],
    },
  ],
};

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
          postValidationSetCrossFieldValues: (
            currentField,
            formState,
            authState,
            dependentFieldValue,
            reqFlag
          ) => {},
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NAME",
          label: "AC Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.5, xl: 1.5 },
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
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
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
          GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
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
          GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
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
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
      ],
    },
  ],
};
