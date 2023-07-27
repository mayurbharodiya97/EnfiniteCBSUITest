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
          name: "FATCA_DEC_RECVD",
          label: "DeclarationReceived",
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
        format: "dd/MM/yyyy",
        label: "DeclarationReceivedDate",
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
        format: "dd/MM/yyyy",
        name: "DATE_OF_COMMENCEMENT",
        label: "DateOfIncorporation",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs: 4, sm:3},
      },      
      {
          render: {
              componentType: "textField",
          },
          name: "PLACE_OF_INCORPORATION",
          label: "PlaceOfIncorporation",
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
          label: "CountryOfIncorporation",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "TIN_ISSUING_COUNTRY",
          label: "TINIssuingCountry",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
  ]
}