export const DocumentFormMetadata = {
    form: {
      name: "EditDocuments",
      label: "Documents",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
      // submitAction: "home",
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
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
      {
        render: { componentType: "hidden" },
        name: "SR_CD",
      },
      {
        render: {componentType: "select"},
        name: "BANK_DOC_TRAN_CD",
        // name: "DOC_DESCRIPTION",
        label: "Document",
        // options: "getKYCDocTypes",
        dependentFields: ["TRAN_CD", "SR_CD"],  
        isReadOnly: false,
        // _optionsKey: "getKYCDocTypes",
        // options: (dependentValue?, formState?, _?, authState?) => API.getCustDocumentOpDtl({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
        options: () => [],
        // _optionsKey: "getDocumentOptionsDTL",
        disableCaching:true,
        required: true,   
        GridProps: {
          xs: 12,
          sm: 6,
          md: 6,
          lg:3, xl:2
        },
        postValidationSetCrossFieldValues: (
          field,
          __,
          ___,
          dependentFieldsValues
        ) => {
          if((field.optionData && field.optionData.length>0) && field.optionData[0].DESCRIPTION) {
            return {
              DOC_DESCRIPTION: {value: field.optionData[0].DESCRIPTION ?? ""},
            }
          } else {
            return {}
          }
        },
        __EDIT__: {isReadOnly: true}
      },
      {
        render: {componentType: "hidden"},
        name: "DOC_DESCRIPTION",
      },
      {
        render: {componentType: "textField"},
        name: "DOCUMENT_NO",
        label: "Document No",
        required: true,   
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },     
      },
      {
        render: {componentType: "datePicker"},
        // name: "VALID_TILL_DT",
        name: "VALID_TILL_DATE",
        label: "Valid Till Date",
        required: true,   
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
        },     
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["From Date is required."] },
            { name: "typeError", params: ["Must be a valid date"] },
          ],
        },
        validate: (value, data, others) => {
          console.log("WEfwedqwe", value)
          if (!Boolean(value)) {
            return "Must be a valid date.";
          }
        },
      },
      {
        render: {componentType: "hidden"},
        name: "ENTERED_DT",
        label: "Entered Date",
        // required: true,   
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
        },     
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "USER_NAME",
        label: "User Name",
        placeholder: "",
        type: "text",
        fullWidth: true,
        // required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["This field is required"] },
            {
              name: "USER_NAME",
              params: ["Please Enter Review by Login ID."],
            },
          ],
        },
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
        },
      },
      // {
      //   render: {
      //     componentType: "datetimePicker",
      //   },
      //   name: "VALID_UPTO",
      //   label: "Expiry Date",
      //   placeholder: "",
      //   type: "date",
      //   fullWidth: true,
      //   format: "dd/MM/yyyy HH:mm:ss",
      //   required: true,
      //   schemaValidation: {
      //     type: "string",
      //     rules: [
      //       { name: "required", params: ["This field is required"] },
      //       { name: "VALID_UPTO", params: ["Please Enter Expiry Date."] },
      //     ],
      //   },
      //   GridProps: {
      //     xs: 12,
      //     md: 4,
      //     sm: 4,
      //   },
      // },
      {
        render: { componentType: "checkbox" },
        defaultValue: true,
        name: "SUBMIT",
        label: "Submit",
        GridProps: { xs: 12, md: 2, sm: 2 },
        // __EDIT__: { render: { componentType: "checkbox" } },
      },
    ],
  };
  