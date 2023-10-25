import * as API from "../../../../api";

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
              componentType: "autocomplete",
          },
          name: "FATCA_DEC_RECVD",
          label: "DeclarationReceived",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
        label: "DeclarationReceivedDate",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "DATE_OF_COMMENCEMENT",
        label: "DateOfIncorporation",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },      
      {
          render: {
              componentType: "textField",
          },
          name: "PLACE_OF_INCORPORATION",
          label: "PlaceOfIncorporation",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "TIN",
          label: "TIN",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "COUNTRY_OF_INCORPORATION",
          label: "CountryOfIncorporation",
          options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "CountriesOfIncorporation",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "autocomplete",
          },
          options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "TINIssuingCountries",
          name: "TIN_ISSUING_COUNTRY",
          label: "TINIssuingCountry",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
  ]
}