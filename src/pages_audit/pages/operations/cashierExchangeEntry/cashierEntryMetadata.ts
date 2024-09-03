import * as API from "./api"
export const cashierEntryMetaData = {
    form: {
      name: "CashierEntryMetaDataArrayField",
      label: "Cashier Exchange Entry",
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
        name: "CASHIERENTRY",
        enableGrid: true,
        isCustomStyle: true,
        changeRowOrder: true,
        fixedRows:true,
        isDivider:false,
        isDisplayCount:false,
        GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        _fields: [
            {
                render: {
                  componentType: "textField",
                },
                name: "DENO_LABLE",
                label: "",
                placeholder: "",
                dependentFields: ["CASHIERENTRY"],
                GridProps: { 
                    xs: 12, 
                    sm: 2, 
                    md: 2, 
                    lg: 2, 
                    xl: 2
                 },
                isReadOnly:true,
              },
            {
                render: {
                  componentType: "numberFormat",
                },
                name: "AVAIL_QTY",
                label: "",
                placeholder: "",
                textFieldStyle: {
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                  },
                },
                GridProps: { 
                    xs: 12, 
                    sm: 2, 
                    md: 2, 
                    lg: 2, 
                    xl: 2
                 },
                isReadOnly:true,
              },
            {
                render: {
                  componentType: "amountField",
                },
                name: "AVAIL_VAL",
                label: "",
                placeholder: "",
                dependentFields: ["AVAIL_QTY"],
                GridProps: { 
                    xs: 12, 
                    sm: 2, 
                    md: 2, 
                    lg: 2, 
                    xl: 2
                 },
                isReadOnly:true,
              },
            {
                render: {
                  componentType: "amountField",
                },
                name: "DENO_VAL",
                label: "",
                placeholder: "",
                GridProps: { 
                    xs: 12, 
                    sm: 2, 
                    md: 2, 
                    lg: 2, 
                    xl: 2
                 },
                isReadOnly:true,
              },
            {
                render: {
                  componentType: "numberFormat",
                },
                name: "EnterNoteValue",
                label: "",
                placeholder: "",
                dependentFields: ["DENO_VAL","AVAIL_QTY"],
                textFieldStyle: {
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                  },
                },
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  auth,
                  dependentFieldsValues
                ) => {
                  const CurrentFieldValue = Number(field?.value);
                  const DependentFieldValue = Number(dependentFieldsValues["CASHIERENTRY.AVAIL_QTY"]?.value);
                  if(CurrentFieldValue > DependentFieldValue){
                    formState.MessageBox({
                      messageTitle: "Invalid",
                      message: "Denomination should be less than or equals to Debit Cashier.",
                      buttonNames: ["Ok"],
                    });
                    return{
                      EnterNoteValue:{value:"",isFieldFocused: true},
                    }
                  }else if (field?.value < 0){
                    formState.MessageBox({
                      messageTitle: "Invalid",
                      message: "Denomination should be greater than or equals to zero.",
                      buttonNames: ["Ok"],
                    });
                    return{
                      EnterNoteValue:{value:"",isFieldFocused: true},
                    }
                  }else{
                    return {TotalSumAmount:{value:dependentFieldsValues["CASHIERENTRY.DENO_VAL"]?.value * field?.value ?? 0 }}
                  }
                },
                GridProps: { 
                    xs: 12, 
                    sm: 2, 
                    md: 2, 
                    lg: 2, 
                    xl: 2
                 },
              },
            {
                render: {
                  componentType: "amountField",
                },
                name: "TotalSumAmount",
                label: "",
                GridProps: { 
                    xs: 12, 
                    sm: 2, 
                    md: 2, 
                    lg: 2, 
                    xl: 2
                 },
                 isReadOnly:true,
              },
        ],
      },
      {
        render : {
          componentType:"spacer",
        },
        name:"Spacer1",
        GridProps: { 
          xs: 12, 
          sm: 4, 
          md: 4, 
          lg: 4, 
          xl: 4 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "RECEIPT_TOTAL",
        label: "Receipt Total",
        placeholder: "Receipt Total",
        defaultValue: "0",
        dependentFields: ["CASHIERENTRY","AVAIL_VAL"],
        validationRun: "all",
        validate: (currentField, value) => {
          if (currentField?.value) {
            return;
          }
        },
        isReadOnly: true,
        GridProps: { 
          xs: 12, 
          sm: 2, 
          md: 2, 
          lg: 2, 
          xl: 2 },
      },
      {
        render : {
          componentType:"spacer",
        },
        name:"Spacer2",
        GridProps: { 
          xs: 12, 
          sm: 4, 
          md: 4, 
          lg: 4, 
          xl: 4 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "SUM_TOTAL",
        label: "Final Total",
        placeholder: "Receipt Total",
        defaultValue: "0",
        isReadOnly: true,
        GridProps: { 
          xs: 12, 
          sm: 2, 
          md: 2, 
          lg: 2, 
          xl: 2 },
      },
    ],
  };
  export const cashierEntryMetaData2 = {
    form: {
      name: "CashierEntryMetaDataForm",
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
              componentType: "autocomplete",
            },
            name: "From_User",
            label: "From User",
            options: (dependentValue, formState, _, authState) => API.getFromUserDdw({
              DEF_COMP_CD: authState?.companyID, 
              DEF_BRANCH_CD: authState?.user?.branchCode,
              USER_LEVEL : authState?.role,
              FLAG: "FROMUSER",
              A_USER: authState?.user?.id,
            }),
            _optionsKey: "fromUser",
            postValidationSetCrossFieldValues: (
              currentField,
              formState,
              authState,
              dependentFieldValue,
              reqFlag
            ) => {
              formState.setDataOnFieldChange("FROM_USER", currentField);
            },
            defaultValue:"",
            placeholder: "",
            type: "text",
            GridProps: { 
              xs: 12, 
              sm: 3, 
              md: 3, 
              lg: 3, 
              xl: 3 },
          },
        {
            render: {
              componentType: "autocomplete",
            },
            name: "To",
            label: "To User",
            options: (dependentValue, formState, _, authState) => API.getFromUserDdw({
              DEF_COMP_CD: authState?.companyID, 
              DEF_BRANCH_CD: authState?.user?.branchCode,
              USER_LEVEL : authState?.role,
              FLAG: "TOUSER",
              A_USER: authState?.user?.id,
            }),
            dependentFields: ["From_User"],
            postValidationSetCrossFieldValues: (
              currentField,
              formState,
              authState,
              dependentFieldValue,
              reqFlag
            ) => {
              if(dependentFieldValue?.From_User?.value === currentField?.value){
                formState.MessageBox({
                  messageTitle: "Validation Failed",
                  message: "From & To user cannot be same.",
                  buttonNames: ["Ok"],
                });
                return{
                  To:{value:"",isFieldFocused: true},
                }
              }
            },
            _optionsKey: "toUser",
            defaultValue:"  ",
            placeholder: "",
            type: "text",
            GridProps: { 
              xs: 12, 
              sm: 3, 
              md: 3, 
              lg: 3, 
              xl: 3 },
          },
    ],
  };