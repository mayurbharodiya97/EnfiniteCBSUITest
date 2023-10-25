export const KYCDocumentMasterMetaData = {
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
        label: "Document",
        options: "getKYCDocTypes",
        dependentFields: ["TRAN_CD", "SR_CD"],        
        _optionsKey: "getKYCDocTypes",
        disableCaching:true,
        required: true,   
        GridProps: {
          xs: 12,
          sm: 6,
          md: 6,
          lg:3, xl:2
        },     
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
        name: "VALID_TILL_DT",
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
  