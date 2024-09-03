import { GeneralAPI } from "registry/fns/functions";
import * as API from "../api";
export const TemplateDetailMetadata = {
  form: {
    name: "template-template-details",
    label: "Template Detail",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 3,
        },
        container: {
          direction: "row",
          spacing: 1.5,
        },
      },
    },
    componentProps: {
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
        render: {
          componentType: "autocomplete",
        },
        name: "TEMPLATE_CODE",
        label: "Template",
        isFieldFocused: true,
        options:async (dependentValue, formState, _, authState) => {
          const APIrequest = await API.getGstOtwardTemplateDdw({
            BASE_COMP_CD: authState?.baseCompanyID,
            BASE_BRANCH_CD: authState?.user?.baseBranchCode,
            TEMPLATE_TYPE: "OUT",
          });
          formState.optionRef(APIrequest);
          return APIrequest
        },
        _optionsKey: "templatecode",
        GridProps: {
          xs: 12,
          sm: 4,
          md: 4,
          lg: 4,
          xl: 4,
        },
      },
      {
        render: { componentType: "amountField" },
        name: "TAXABLE_VALUE",
        sequence: 23,
        type: "text",
        label: "Charge Amount",
        maxLength: 14,
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
              const res = await formState?.REFDATA?.current?.getFieldData();
              const postData = await GeneralAPI.getCalGstAmountData({
                BRANCH_CD: res.BRANCH_CD,
                ACCT_TYPE: res.ACCT_TYPE,
                ACCT_CD: res.ACCT_CD,
                AMOUNT: field.value,
                MODULE: "",
                ENT_BRANCH_CD: auth?.user?.branchCode,
                ASON_DT: auth?.workingDate,
                COMP_CD: auth?.companyID
              });
        
              return {
                TAX_AMOUNT: { value: postData?.[0]?.TAX_AMOUNT }
              };
        },        
        autoComplete: "off",
        placeholder: "",
        GridProps: {
          xs: 12,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 3,
        },
      },
      {
        render: { componentType: "amountField" },
        name: "TAX_AMOUNT",
        sequence: 23,
        type: "text",
        label: "Tax Amount",
        maxLength: 14,
        autoComplete: "off",
        isReadOnly:true,
        dependentFields: ["TAXABLE_VALUE"],     
        placeholder: "",
        GridProps: {
          xs: 12,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 3,
        },
      },
      {
        render: {
          componentType: "spacer",
        },
        GridProps: { xs: 12,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2, },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        name: "CHEQUE_NO",
        label: "ChequeNo",
        placeholder: "Cheque No.",
        type: "text",
        // required: true,
        autoComplete: "off",
        required: false,
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
              const res = await formState?.REFDATA?.current?.getFieldData();
              if(field?.value?.length > 0){
              if (res?.BRANCH_CD?.length === 0 || res?.ACCT_TYPE?.length === 0 || res?.ACCT_CD?.length === 0){
                formState.MessageBox({
                  messageTitle: "Cheque Book",
                  message: "Enter Account Information",
                });
              }
              else{
              const postData = await GeneralAPI.getChequeNoValidation({
                COMP_CD: auth?.companyID,
                BRANCH_CD: res?.BRANCH_CD,
                ACCT_TYPE: res?.ACCT_TYPE,
                ACCT_CD: res?.ACCT_CD,
                CHEQUE_NO: field.value,
                SCREEN_REF: "TRN/658",
                TYPE_CD: res?.MODE,
              });
            
              let btn99, returnVal;
        
              for (let i = 0; i < postData?.length; i++) {
                const status = postData?.[i]?.ERR_CODE;
                const message = postData?.[i]?.ERR_MSG;
                if (status === "999") {
                  formState.MessageBox({
                    messageTitle: "Validation Failed.",
                    message: message,
                  });
                  return{
                    CHEQUE_NO:{value:""}
                  }
                } else if (status === "99") {
                  const btnName = await formState.MessageBox({
                    messageTitle: "Confirmation",
                    message: message,
                    buttonNames: ["Yes", "No"],
                  });
                  btn99 = btnName;
                  if (btnName === "No") {
                    return{
                      CHEQUE_NO:{value:""}
                    }
                  }
                } else if (status === "9") {
                  formState.MessageBox({
                    messageTitle: "Alert",
                    message: message,
                  });
                } else if (status === "0") {
                  if (btn99 !== "No") {
                    returnVal = postData?.[i];
                  } else {
                    return{
                      CHEQUE_NO:{value:""}
                    }
                  }
                }
              }


              if (returnVal){
                return{
                  FLAG:{value:"Y"}
                }
              }
            }
          }
        },
        
        GridProps: { xs: 6, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
      },
      {
        render: { componentType: "hidden" },
        name: "FLAG",},
      {
        render: { componentType: "datePicker" },
        name: "CHEQUE_DT",
        sequence: 23,
        label: "Chq.Date.",
        maxLength: 14,
        isWorkingDate: true,
        ignoreInSubmit: true,
        autoComplete: "off",
        dependentFields: ["CHEQUE_NO" , "FLAG"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if(dependentFieldsValues?.FLAG?.value === "Y"){
            return false
          }else{
            return true
          }
        },
        placeholder: "",
        GridProps: {
          xs: 12,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 3,
        },
      },
      {
        render: { componentType: "textField" },
        name: "REMARKS",
        sequence: 23,
        type: "text",
        txtTransform: "uppercase",
        label: "Remarks.",
        maxLength: 14,
        autoComplete: "off",
        placeholder: "",
        GridProps: {
          xs: 12,
          sm: 6,
          md: 6,
          lg: 6,
          xl: 6,
        },
      },
  ],
};
