import * as API from "../../../../api";
  export const other_details_legal_meta_data = {
    form: {
        name: "legal_other_details_annual_income_details_form",
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
                componentType: "Divider",
            },
            dividerText: "AnnualIncome",
            name: "AnnualIncomeDivider_ignoreField",
            label: "AnnualIncomeDivider",
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "ANNUAL_INCOME_SR_CD",
            label: "Range",
            options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "rangeOptions",
            required: true,
            isFieldFocused: true,      
            placeholder: "",
            type: "text",
          //   GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
              componentType: "autocomplete",
            },
            // className: "textInputFromRight",
            name: "ANNUAL_TURNOVER_SR_CD",
            label: "Turnover",
            options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "turnoverOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            // maxLength: 3,
            // showMaxLength: false,
            // FormatProps: {
            //   allowNegative: false,
            //   allowLeadingZeros: true,
            //   decimalScale: 0,
            //   isAllowed: (values) => {
            //     if (values?.value?.length > 3) {
            //       return false;
            //     }
            //     if (values?.value > 100) {
            //       return false;
            //     }
            //     return true;
            //   },
            // },
          },
          {
              render: {
                  componentType: "autocomplete",
              },
              name: "ANNUAL_OTHER_INCOME_SR_CD",
              label: "OtherIncome",
              options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
              _optionsKey: "otherIncomeOptions",
              placeholder: "",
              type: "text",
              GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
          },
          {
              render: {
                  componentType: "textField",
              },
              name: "SOURCE_OF_INCOME",
              label: "SourceOfIncome",
              maxLength: 200,
              FormatProps: {
                  isAllowed: (values) => {
                  if (values?.value?.length > 200) {
                      return false;
                  }
                  return true;
                  },
              },
              validate: (columnValue, allField, flag) => {
                  if(columnValue.value) {
                      let regex = /^[0-9A-Z]+$/;
                      if(!regex.test(columnValue.value)) {
                          return "Numeric and Uppercase characters are allowed";
                      }
                  }
                  return "";
              },
              placeholder: "",
              type: "text",
              txtTransform: "uppercase",
              GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:4},
          },
  
  
  
          {
              render: {
                  componentType: "Divider",
              },
              dividerText: "ExposureInfo",
              name: "ExposureInfoDivider_ignoreField",
              label: "ExposureInfoDivider",
          },
          {
              render: {
                componentType: "currency",
              },
              // className: "textInputFromRight",
              name: "FUNDED_AMT",
              label: "Funded",
              enableNumWords: false,
              placeholder: "",
              type: "text",
              GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            },
          {
              render: {
                componentType: "currency",
              },
              // className: "textInputFromRight",
              name: "NON_FUNDED_AMT",
              label: "NonFunded",
              enableNumWords: false,
              placeholder: "",
              type: "text",
              GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            },
          {
              render: {
                componentType: "currency",
              },
              // className: "textInputFromRight",
              name: "THRESHOLD_AMT",
              label: "ThresholdLimit",
              enableNumWords: false,
              placeholder: "",
              type: "text",
              GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            },
      ]
  }