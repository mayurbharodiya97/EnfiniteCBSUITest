import { getClearingTypeDDW, getClgZoneData, getReasonDdwData } from "./api";

  export const RetrievalParameterFormMetaData = {
    form: {
      name: "retrievalParameters",
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
      },
    },
    fields: [
      {
        render: {
          componentType: "spacer",
        },
        name:"Spacer",
        GridProps: {
          xs: 0,
          md: 1,
          sm: 0,
          lg: 1,
          xl: 1,
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "FROM_DT",
        label: "GeneralFromDate",
        placeholder: "",
        fullWidth: true,
        format: "dd/MM/yyyy",
        GridProps: { xs: 2, sm: 2, md: 2, lg: 1.4, xl: 1.4 },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["FromDateRequired."] }],
        },
        // validate: (value) => {
        //   if (Boolean(value?.value)) {
        //     return "Mustbeavaliddate";
        //   }
        //   return "";
        // },
      
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "TO_DT",
        label: "GeneralToDate",
        placeholder: "",
        fullWidth: true,
        format: "dd/MM/yyyy",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ToDateRequired"] }],
        },
        // validate: (currentField, dependentField) => {
        //   if (Boolean(currentField?.value)) {
        //     return "Mustbeavaliddate";
        //   }
        //   if (
        //     new Date(currentField?.value) <
        //     new Date(dependentField?.FROM_DT?.value)
        //   ) {
        //     return "ToDateshouldbegreaterthanorequaltoFromDate";
        //   }
        //   return "";
        // },
        dependentFields: ["FROM_DT"],
        runValidationOnDependentFieldsChange: true,
        GridProps: { xs: 2, sm: 2, md: 2, lg: 1.4, xl: 1.4 },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        name: "CHEQUE_NO",
        label: "Chequeno",
        required:true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ChequeNorequired"] }],
        },
        GridProps: { xs: 2, sm: 2, md: 1.4, lg: 1.4, xl: 1.4 },
      },
      {
        render: { componentType: "autocomplete" },
        name: "TRAN_TYPE",
        placeholder: "type",
        label: "type",
        _optionsKey: "getClearingTypeDDW",
        options: (dependentValue, formState, _, authState) => {
          return getClearingTypeDDW({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        defaultValue: "S",
        fullWidth: true,
        GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 1.4 },
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
  export const returnChequeFormMetaData = {
    form: {
      name: "return cheque",
  
      label: "Enter Parameter",
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
        amountField: {
          fullWidth: true,
        }
      },
    },
    fields: [
      {
        render: {
          componentType: "textField",
        },
        name: "ACCT_CD",
        label: "AccountNo",
        isReadOnly: true,
        fullWidth: true,
        dateFormat: "dd/MM/yyyy",
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "BRANCH_CD",
        label: "",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        name: "ACCT_TYPE",
        label: "",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        name: "ACCT_CD",
        label: "",
        type: "text",
        fullWidth: true,
        isReadOnly: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "ACCT_NM",
        label: "AccountName",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 5, xl: 5 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "BALANCE",
        label: "Balance",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4 },
      },
      {
        render: {
          componentType: "spacer",
        },
        name: "SPACER",
        GridProps: { xs: 0, sm: 0, md: 0, lg: 3, xl: 3 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "PHONE",
        label: "phone",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 5, xl: 5 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "BANK_CD",
        label: "Bank",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 6, xl: 6 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "CHEQUE_NO",
        label: "Chequeno",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 3, xl: 3 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "ENTERED_BRANCH_CD",
        label: "from",
        type: "text",
        fullWidth: true,
        isReadOnly: true,
        GridProps: { xs: 6, sm: 6, md: 6, lg: 3, xl: 3 },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ZONE_TRAN_TYPE",
      },
        {
        render: { componentType: "autocomplete" },
        name: "ZONE_CD",
        label: "Zone",
        dependentFields: ["ZONE_TRAN_TYPE"],
        _optionsKey: "getClgZoneData",
        options: (dependentValue, formState, _, authState) => {
          console.log(dependentValue);
          
          return getClgZoneData({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            ZONE_TRAN_TYPE:"W"
          });
       
        },
        GridProps: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
        fullWidth: true,
      },
      {
        render: { componentType: "autocomplete" },
        name: "REASON",
        label: "Reason",
        _optionsKey: "getReasonDdwData",
        options: (dependentValue, formState, _, authState) => {
          return getReasonDdwData({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            RETURN_TYPE: "CLG",
          });
        },
        GridProps: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
        fullWidth: true,
      },
      {
        render: {
          componentType: "textField",
        },
        name: "DESCRIPTION",
        label: "Description",
        type: "text",
        GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      },
  
    ]
  }