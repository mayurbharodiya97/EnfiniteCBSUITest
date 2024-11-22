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
          isFieldFocused: true,
          type: "text",
        //   GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
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
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "US_GIIN",
          label: "GIIN",
          maxLength: 21,
          FormatProps: {
            isAllowed: (values) => {
            if (values?.value?.length > 21) {
                return false;
            }
            return true;
            },
          },
          validate: (columnValue, allField, flag) => API.AlphaNumericValidate(columnValue),
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "DATE_OF_COMMENCEMENT",
        label: "DateOfIncorporation",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },      
      {
          render: {
              componentType: "textField",
          },
          name: "PLACE_OF_INCORPORATION",
          label: "PlaceOfIncorporation",
          placeholder: "",
          type: "text",
          validate: (columnValue, allField, flag) => API.AlphaNumericValidate(columnValue),
          maxLength: 20,
          FormatProps: {
            isAllowed: (values) => {
            if (values?.value?.length > 20) {
                return false;
            }
            return true;
            },
          },
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "TIN",
          label: "TIN",
          placeholder: "",
          maxLength: 20,
          dependentFields: ["TIN_ISSUING_COUNTRY"],
          FormatProps: {
            isAllowed: (values) => {
            if (values?.value?.length > 20) {
                return false;
            }
            return true;
            },
          },
          required: true,
          validate: (columnValue, allField, flag) => {
            const TIN_ISSUING_COUNTRY = allField?.TIN_ISSUING_COUNTRY?.value;
            const GSTIN = flag?.GSTIN;
            if(!Boolean(columnValue?.value)) {
              if(Boolean(TIN_ISSUING_COUNTRY) && !Boolean(GSTIN)) {
                return "This field is required";
              } else {
                return "";
              }
            } else {
              return API.AlphaNumericValidate(columnValue);
            }
          },
          runValidationOnDependentFieldsChange: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "TIN_ISSUING_COUNTRY",
          label: "TINIssuingCountry",
          options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "TINIssuingCountries",
          placeholder: "",
          dependentFields: ["TIN"],
          validate: (columnValue, allField, flag) => {
            const TIN = allField?.TIN?.value;
            const GSTIN = flag?.GSTIN;
            if(!Boolean(columnValue?.value)) {
              if(Boolean(TIN) || Boolean(GSTIN)) {
                return "This field is required";
              } else {
                return "";
              }
            } else {
                return "";
            }
          },
          // runValidationOnDependentFieldsChange: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
  ]
}