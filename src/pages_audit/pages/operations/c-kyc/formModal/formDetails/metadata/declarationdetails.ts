export const declaration_meta_data = {
  form: {
      name: "declaration_details_form",
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
              sm: 6,
          },
          container: {
              direction: "row",
              spacing: 3,
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
          name: "FATCA_DEC_RECVD",
          label: "Declaration Received",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
          defaultValue: "N",
          options: [
              {label: "FOR FATCA", value: "Y"},
              {label: "FOR CRS", value: "C"},
              {label: "NO", value: "N"},
          ],
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "FATCA_DT",
        label: "Declaration Received Date",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "US_GIIN",
          label: "GIIN",
          required: true,          
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "DATE_OF_COMMENCEMENT",
        label: "Date of Incorporation",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs: 4, sm:3},
      },      
      {
          render: {
              componentType: "textField",
          },
          name: "PLACE_OF_INCORPORATION",
          label: "Place of Incorporation",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "TIN",
          label: "TIN",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY_OF_INCORPORATION",
          label: "Country of Incorporation",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "TIN_ISSUING_COUNTRY",
          label: "TIN Issuing Country",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
  ]
}