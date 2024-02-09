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
      // isCustomStyle: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_CD",
          label: "Branch",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Branch is required."] },
              { name: "BRANCH_CD", params: ["Branch is required."] },
            ],
          },
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Account Type is required."] },
              { name: "ACCT_TYPE", params: ["Account Type is required."] },
            ],
          },
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Account Number is required."] },
              { name: "ACCT_CD", params: ["Account Number is required."] },
            ],
          },
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
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
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

          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
        },
        // {
        //   render: {
        //     componentType: "amountField",
        //   },
        //   name: "CASH_AMT",
        //   label: "Cash",
        //   type: "text",
        //   GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        // },
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["AsOn Date is required."] },
              { name: "TRAN_DT", params: ["AsOn Date is required."] },
            ],
          },
          GridProps: { xs: 12, sm: 1.5, md: 1.8, lg: 1.8, xl: 1.5 },
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
          GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1 },
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
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
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
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
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
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MONTHLY_INT",
          label: "Month Interest",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MATURITY_AMT",
          label: "Maturity Amount",
          type: "text",
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        // {
        //   render: {
        //     componentType: "amountField",
        //   },
        //   name: "TOTAL",
        //   label: "Total",
        //   type: "text",
        //   GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        // },
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
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        // {
        //   render: {
        //     componentType: "textField",
        //   },
        //   name: "CATEG_NM",
        //   label: "Category",
        //   isReadOnly: true,
        //   GridProps: { xs: 2.5, sm: 2, md: 2, lg: 2, xl: 2.5 },
        // },
        // {
        //   render: {
        //     componentType: "datePicker",
        //   },
        //   name: "BIRTH_DT",
        //   label: "Birth Date",
        //   placeholder: "",
        //   format: "dd/MM/yyyy",
        //   isReadOnly: true,
        //   fullWidth: true,
        //   GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        // },
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "CR_BRANCH_CD",
            label: "Credit A/c Branch",
            required: false,
            GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "CR_ACCT_TYPE",
            label: "Credit A/c Type",
            required: false,
            GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "CR_ACCT_CD",
            label: "Credit A/c No.",
            required: false,
            dependentFields: ["CR_BRANCH_CD", "CR_ACCT_TYPE"],
            postValidationSetCrossFieldValues: () => {
              console.log(">>accountCode");
            },
            GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CR_ACCT_NM",
          label: "Credit A/c Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "FD_AMOUNT",
          label: "Transfer Amount",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "MATURE_INST",
          label: "Mature Instruction",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 3.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "FD_REMARK",
          label: "FD Remark",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "nominee_nm",
          label: "Nominee Name",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
      ],
    },
  ],
};
