import * as API from "../api";
import { AlphaNumericValidate, DuplicationValidate, TrimSpaceValidation, getCommunityList, getCustomerGroupOptions, getOccupationDTL, getOptionsOnPinParentArea, getPMISCData, getRangeOptions } from "../../c-kyc/api";

export const main_tab_metadata = {
    form: {
        name: "main_tab_form",
        label: "", 
        resetFieldOnUnmount: false,
        validationRun: "onBlur", 
        submitAction: "home",  
        render: {
            ordering: "sequence",
            renderType: "simple",
            gridConfig: {
            item: {
                xs: 12,
                sm: 6,
            },
            container: {
                direction: "row",
                spacing: 0.5,
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
            Divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "FIRST_NM",
            label: "FirstName",
            // placeholder: "First Name",
            type: "text",
            txtTransform: "uppercase",
            maxLength: 50,
            // GridProps: {xs:4, sm:2},
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            validate: (columnValue, allField, flag) => TrimSpaceValidation(columnValue, allField, flag),
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NM",
            label: "MiddleName",
            maxLength: 50,
            // placeholder: "Middle Name",
            type: "text",
            txtTransform: "uppercase",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            validate: (columnValue, allField, flag) => TrimSpaceValidation(columnValue, allField, flag),
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SURNAME",
            label: "LastName",
            maxLength: 50,
            // placeholder: "Last Name",
            type: "text",
            txtTransform: "uppercase",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            validate: (columnValue, allField, flag) => TrimSpaceValidation(columnValue, allField, flag),
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ACCT_NM",
            label: "FullName",
            placeholder: "",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            dependentFields: ["FIRST_NM", "LAST_NM", "SURNAME"],
            setValueOnDependentFieldsChange: (dependentFields) => {
                let full_name = `${dependentFields?.FIRST_NM?.value} ${dependentFields?.LAST_NM?.value} ${dependentFields?.SURNAME?.value}`
                return full_name;
            },
            type: "text",
            GridProps: {xs:12, sm:5, md: 4, lg: 2.8, xl: 3},
        },
        // {
        //     render: {
        //       componentType: "formbutton",
        //     },
        //     name: "SEARCH_BTN_ignoreField",
        //     label: "Search",
        //     endsIcon: "Search",
        //     rotateIcon: "scale(1.5)",
        //     placeholder: "",
        //     type: "text",
        //     dependentFields: ["ACCT_NM"],
        //     GridProps: {lg: 1, xl:1},
        // },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "GENDER",
            label: "Gender",
            // required: true,
            // schemaValidation: {
            //     type: "string",
            //     rules: [
            //       { name: "required", params: ["ThisFieldisrequired"] },
            //     ],
            // },
            // dependentFields: ["PREFIX_CD"],
            // disableCaching: true,
            options: [
                {label: "MALE", value: "M"},
                {label: "FEMALE", value: "F"},
                {label: "OTHER", value: "O"},
                {label: "TRANSGENDER", value: "T"},
            ],
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "BIRTH_DT",
            label: "DateOfBirth",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            // placeholder: "",
            // type: "datePicker",
            // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            maxDate: new Date(), 
            // format: "dd/MM/yyyy",
        },
        {
            render: {
                componentType: "textField"
            },
            name: "LF_NO",
            label: "Ledger No.",
            type: "text",
            maxLength: 8,
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
            FormatProps: {
              isAllowed: (values) => {
              if (values?.value?.length > 20) {
                  return false;
              }
              return true;
              },
            },
            required: true,
            schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
            },
            validate: (columnValue, allField, flag) => AlphaNumericValidate(columnValue),
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Personal Details",
            name: "persondtldivider_ignoreField",
            label: ""
        },
        {
            render: {
                componentType: "textField"
            },
            name: "MOTHER_MAIDEN_NM",
            label: "Mother's Maiden Name",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PASSPORT_NO",
            label: "Passport No.",
            placeholder: "",
            maxLength: 20,
            type: "text",
            txtTransform: "uppercase",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            validate: (columnValue, allField, flag) => DuplicationValidate(columnValue, allField, flag, {PASSPORT_NO: columnValue.value}),
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "MONTHLY_HOUSEHOLD_INCOME",
            label: "Monthly Household Income",
            options: (dependentValue, formState, _, authState) => getRangeOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "monIncomeMainOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EDUCATION_QUALIFICATION",
            label: "EduQualification",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
                sequence: 7,
            },
            name: "MARITAL_STATUS",
            label: "MaritalStatus",
            options: (dependentValue) => getPMISCData("Marital", dependentValue),
            _optionsKey: "maritalMainOp",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            required: true,
            dependentFields: ["PREFIX_CD"],
            disableCaching: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Professional Details",
            name: "professionaldtldivider_ignoreField",
            label: ""
        },
        {
            render: {
                componentType: "checkbox",
            },
            defaultValue: false,
            name: "SALARIED",
            label: "Salaried",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "DESIGNATION_CD",
            label: "Designation",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "FIRM_NM",
            label: "Firm Name",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker"
            },
            name: "DATE_OF_RETIREMENT",
            label: "Date of Retirement",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },

        {
            render: {
                componentType: "checkbox",
            },
            defaultValue: false,
            name: "HANDICAP_FLAG",
            label: "Handicap",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "HANDICAP_DESCRIPTION",
            label: "Handicap Description",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker"
            },
            name: "DATE_OF_DEATH",
            label: "Date of Death",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        

        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Address",
            name: "addressdivider_ignoreField",
            label: "addDivider"
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ADD1",
            label: "Line1",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            required: true,      
            maxLength: 50,    
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            validate: (columnValue, allField, flag) => AlphaNumericValidate(columnValue),
            placeholder: "",
            type: "text",
            txtTransform: "uppercase",
            GridProps: {xs:12, sm:5, md: 3.2, lg: 3.2, xl: 3.3},
          },
        {
            render: {
                componentType: "textField",
            },
            name: "ADD2",
            label: "Line2",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            placeholder: "",
            maxLength: 50,
            validate: (columnValue, allField, flag) => AlphaNumericValidate(columnValue),
            type: "text",
            txtTransform: "uppercase",
            GridProps: {xs:12, sm:5, md: 3.2, lg: 3.2, xl: 3.3},
          },
        {
            render: {
                componentType: "textField",
            },
            name: "ADD3",
            label: "Line3",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            placeholder: "",
            maxLength: 50,
            validate: (columnValue, allField, flag) => AlphaNumericValidate(columnValue),
            type: "text",
            txtTransform: "uppercase",
            GridProps: {xs:12, sm:5, md: 3.2, lg: 3.2, xl: 3.3},
          },
          
        {
            render: {
                componentType: "numberFormat",
            },
            name: "PIN_CODE",
            label: "PIN",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            maxLength: 6,
            FormatProps: {
                isAllowed: (values) => {
                    if (values?.value?.length > 6) {
                    return false;
                    }
                    return true;
                },
            },
            validate: (columnValue) => {
                const PIN = columnValue.value
                if(Boolean(PIN) && PIN.length<6) {
                    return "Pin code should be of six digits"
                }
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
        },  
      {
          render: {
              componentType: "select",
          },
          runPostValidationHookAlways: false, 
          name: "AREA_CD",
          label: "SubArea",
          dependentFields: ["PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) => getOptionsOnPinParentArea(dependentValue, formState, _, authState),
          _optionsKey: "indSubareaMainOp",
        isReadOnly: (fieldValue, dependentFields, formState) => {
            const PARAM320 = formState?.PARAM320;
            if(Boolean(PARAM320)) {
                if(PARAM320 === "Y") {
                    return true;
                } else if(PARAM320 === "N") {
                    const pin_code = dependentFields?.PIN_CODE?.value;
                    if(!Boolean(pin_code)) {
                        return true;
                    } else if(Boolean(pin_code) && pin_code.length<6) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        },
        setValueOnDependentFieldsChange: (dependentFields) => {
            const pincode = dependentFields.PIN_CODE.value
            // console.log("siudbcsiudbcisbdc setvalue", pincode)
            if(Boolean(pincode)) {
                if(pincode.length<6) {
                    return "";
                }
            } else return null;
        },  
          postValidationSetCrossFieldValues: (
            field,
            __,
            ___,
            dependentFieldsValues
          ) => {
            // console.log("siudbcsiudbcisbdc postValidationSetCrossFieldValues called", field.value)
            // console.log("sdhaiuwqidquwdqwe", dependentFieldsValues)
            if(field.value) {
                let values = {
                    CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
                    CITY_ignoreField: {value: field?.optionData[0]?.CITY_NM ? field?.optionData[0]?.CITY_NM : ""},
                    // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                    DISTRICT_CD: {value: field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
                    DISTRICT_ignoreField: {value: field?.optionData[0]?.DISTRICT_NM ? field?.optionData[0]?.DISTRICT_NM : field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
                    STATE: {value: field?.optionData[0]?.STATE_NM ?? ""},
                    COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
                    STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
                }
                return values;
            }
            return {}
          },
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "CITY_ignoreField",
          label: "City",
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
          },
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].CITY_NM;
            } else return "";
          },
          GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
      },
      {
        render: {
            componentType: "hidden",        
        },
        name: "CITY_CD",
        dependentFields: ["AREA_CD"],
        setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].CITY_CD;
            } else return "";
        },
      },
      {
          render: {
              componentType: "textField",
          },
          name: "DISTRICT_ignoreField",
          label: "District Name",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].DISTRICT_NM;
            } else return "";
          },
          GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
      },
      {
        render: {
            componentType: "hidden",
        },
        name: "DISTRICT_CD",
        label: "hidden district",
        dependentFields: ["AREA_CD"],
        setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].DISTRICT_CD;
            } else return "";
        },
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE",
          label: "State",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].STATE_NM;
            } else return "";
          },
          GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY",
          label: "Country",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].COUNTRY_NM;
            } else return "";
          },
          GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_CD",
          label: "UnionTerritoriesCode",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].STATE_CD;
            } else return "";
          },
          GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY_CD",
          label: "CountryCode",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData = dependentFields.AREA_CD.optionData
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if(optionData && optionData.length>0) {
                return optionData[0].COUNTRY_CD;
            } else return "";
          },
          GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
      },
      {
        render: {
            componentType: "aadharCard",
        },
        name: "UNIQUE_ID",
        label: "UIDAadhaar",
        placeholder: "1111 1111 1111",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        required: true,
        type: "text",
        maxLength: 12,
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        // validate: (columnValue, allField, flag) => API.validateUniqueId(columnValue, allField, flag),
        // disableCaching: true,
    },
    {
        render: {
            componentType: "textField",
        },
        name: "GSTIN",
        label: "GSTIN",
        placeholder: "",
        maxLength: 20,
        type: "text",
        txtTransform: "uppercase",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
      //   validate: (columnValue, allField, flag) => API.validateGSTIN(columnValue, allField, flag),
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
    {
        render: {
            componentType: "textField",
        },
        name: "CKYC_NUMBER",
        label: "CKYC NO.",
        placeholder: "",
        maxLength: 20,
        type: "text",
        isReadOnly: true,
      //   validate: (columnValue, allField, flag) => API.validateGSTIN(columnValue, allField, flag),
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
    //   {
    //     render: {
    //         componentType: "Divider",
    //     },
    //     dividerText: "Address",
    //     name: "addressdivider_ignoreField",
    //     label: "addDivider"
    // },
    {
        render:  {
            componentType: "Divider",
        },
        dividerText: "Contact",
        name: "contactDivider_ignoreField",
        label: "contactDivider"
    },
    {
        render: {
            componentType: "numberFormat",
        },
        name: "STD_1",
        label: "PhoneO",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        placeholder: "",
        type: "text",
        maxLength: 5,
        GridProps: {xs:12, sm:4, md: 0.7, lg: 0.7, xl:0.6},
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 5) {
                return false;
              }
              return true;
            },
        },
    },
      {
        render: {
            componentType: "numberFormat",
        },
        name: "CONTACT1",
        label: "",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        placeholder: "",
        maxLength: 20,
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
        },
        type: "text",
        GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
    },
    {
        render: {
            componentType: "spacer"
        },
        GridProps: {
            xs: 0.2
        }
    },
    {
        render: {
            componentType: "numberFormat",
        },
        name: "STD_4",
        label: "PhoneR",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        placeholder: "",
        maxLength: 5,
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 5) {
                return false;
              }
              return true;
            },
        },
        type: "text",
        GridProps: {xs:12, sm:4, md: 0.7, lg: 0.7, xl:0.6},
    },
    {
        render: {
            componentType: "numberFormat",
        },
        name: "CONTACT4",
        label: "",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        placeholder: "",
        maxLength: 20,
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
        },
        type: "text",
        GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
    },
    {
        render: {
            componentType: "spacer"
        },
        GridProps: {
            xs: 0.2
        }
    },
    {
        render: {
            componentType: "numberFormat",
        },
        name: "STD_2",
        label: "MobileNo",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        required: true,
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        placeholder: "",
        maxLength: 3,
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 3) {
                return false;
              }
              return true;
            },
        },
        type: "text",
        GridProps: {xs:12, sm:4, md: 0.7, lg: 0.7, xl:0.6},
    },
    {
        render: {
            componentType: "numberFormat",
        },
        name: "CONTACT2",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        label: "",
        required: true,
        placeholder: "",
        maxLength: 20,
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
        },
        dependentFields: ["STD_2"],
        type: "text",
        // validate: (columnValue, allField, flag) => API.validateMobileNo(columnValue, allField, flag),
        GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
    },
    {
        render: {
            componentType: "spacer"
        },
        GridProps: {
            xs: 0.2
        }
    },
    {
        render: {
            componentType: "numberFormat",
        },
        name: "STD_3",
        label: "Alternate Phone",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        required: true,
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        placeholder: "",
        maxLength: 3,
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 3) {
                return false;
              }
              return true;
            },
        },
        type: "text",
        GridProps: {xs:12, sm:4, md: 0.7, lg: 0.7, xl:0.6},
    },
    {
        render: {
            componentType: "numberFormat",
        },
        name: "CONTACT3",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        label: "",
        required: true,
        placeholder: "",
        maxLength: 20,
        FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
        },
        dependentFields: ["STD_2"],
        type: "text",
        // validate: (columnValue, allField, flag) => API.validateMobileNo(columnValue, allField, flag),
        GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "E_MAIL_ID",
        label: "EmailId",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        placeholder: "",
        required: true,          
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        maxLength: 60,
        // validate: (columnValue, allField, flag) => API.validateEmailID(columnValue),
        validate: (columnValue, allField, flag) => {
            let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(columnValue.value && !emailRegex.test(columnValue.value)) {
                return "Please enter valid Email ID"
            }
            return "";
        },
        type: "text",
        txtTransform: "lowercase",
        GridProps: {xs:12, sm:4, md: 4, lg: 2.4, xl:3},
    },
    {
        render: {
            componentType: "checkbox",
        },
        defaultValue: false,
        name: "REG",
        label: "Mobile Registration",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
    },





    {
        render: {
            componentType: "autocomplete",
        },
        name: "FORM_60",
        label: "Form6061",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        placeholder: "",
        defaultValue: "N",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        options: [
            {label: "Form 61", value: "F"},
            {label: "No", value: "N"},
        ],
        // dependentFields: ["DAILY_AMT"],
        // runValidationOnDependentFieldsChange: true,
        // validate: (currentField, dependentFields) => {
        //     if(Number(dependentFields?.DAILY_AMT?.value) >
        //     Number(currentField?.value)) {
        //         return "Weekly Limit should greater than or equal to Daily Limit";
        //     } else {
        //         return "";
        //     }
        // }
    },
    {
        render: {
            componentType: "panCard",
        },
        name: "PAN_NO",
        label: "PanNo",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        placeholder: "AAAAA1111A",
        type: "text",
        txtTransform: "uppercase",
        required: true,
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
              {
                name: "pancard",
                params: ["Please Enter Valid PAN Number"],
              },
            ],
        },
        // validate: (columnValue, allField, flag) => API.validatePAN(columnValue, allField, flag),
        maxLength: 10,
    },
    {
        render: {
            componentType: "autocomplete",
        },
        name: "TRADE_CD",
        label: "Occupation",
        options: (dependentValue, formState, _, authState) => getOccupationDTL(authState?.companyID, authState?.user?.branchCode),
        _optionsKey: "occupationMainOp",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        required: true,
        schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
    },
    {
        render: {
            componentType: "autocomplete",
        },
        name: "GROUP_CD",
        label: "Group",
        options: (dependentValue, formState, _, authState) => getCustomerGroupOptions(authState?.companyID, authState?.user?.branchCode),
        _optionsKey: "GroupdtlMainOp",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        // placeholder: "Last Name",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
    },
    {
        render: {
          componentType: "autocomplete",
        },
        name: "ACCT_MODE",
        label: "Acct Mode",
        isFieldFocused: false,
        required: true,
        options: (dependentValue, formState, _, authState) => {
          // console.log("<<<<fnef", dependentValue, formState, _, authState);
          return API.getAcctModeOptions({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        _optionsKey: "acctModeOp",
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
          ],
        },
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
    },
    {
        render: {
            componentType: "textField",
        },
        name: "LIEN",//come back
        label: "Lien Amt.",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
    },
    {
        render: {
            componentType: "autocomplete",
        },
        name: "COMMU_CD",
        label: "Religion",
        isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
        required: true,
        schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        options: (dependentValue, formState, _, authState) => getCommunityList(authState?.companyID, authState?.user?.branchCode),
        _optionsKey: "CommunityMainOp",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
    },

    {
        render:  {
            componentType: "Divider",
        },
        dividerText: "Nominal/Share Member",
        name: "nominalShareDivider_ignoreField",
        label: "contactDivider"
    },
    // {
    //     render: {
    //       componentType: "typography",
    //     },
    //     name: "Customer_Details",
    //     label: "Customer Details",
    //     // GridProps: { xs: 4, sm: 3, md: 2 },
    // },
    {
        render: {
            componentType: "textField",
        },
        name: "MEM_ACCT_TYPE",
        label: "A/C No.",
        placeholder: "COMP CD",
        maxLength: 4,
        GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:1}
    },
    {
        render: {
            componentType: "textField",
        },
        name: "MEM_ACCT_CD",
        label: "",
        placeholder: "BRANCH CD",
        maxLength: 4,
        GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:1}
    },
    {
        render: {
            componentType: "textField",
        },
        name: "SHARE_ACCT_TYPE",
        label: "",
        placeholder: "A/C Type",
        maxLength: 4,
        GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:1}
    },
    {
        render: {
            componentType: "textField",
        },
        name: "SHARE_ACCT_CD",
        label: "",
        placeholder: "A/C No.",
        maxLength: 8,
        GridProps: {xs:12, sm:3, md: 2, lg: 2, xl:1.5}
    },
    {
        render: {
            componentType: "textField",
        },
        name: "PATH_PHOTO",
        label: "",
        isReadOnly: true,
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
    },
    {
        render: {
            componentType: "textField"
        },
        name: "REMARKS",
        label: "Remarks",
        maxLength: 300,
        GridProps: {xs:12, sm:6, md: 6, lg: 4.7, xl:4}
    },
    {
        render: {
            componentType: "autocomplete"
        },
        name: "TRADE_INFO",
        label: "Type of A/C",
        options: [
            {label: "Resident Individual", value: "A"},
            {label: "Legal Person/Entity Excluding 'C' and 'D'", value: "B"},
            {label: "Central/State Gov.", value: "C"},
            {label: "Central/State Gov. Owned Undertaking", value: "D"},
            {label: "Reporting Entity", value: "E"},
            {label: "Non Profit Organisation", value: "F"},
            {label: "Non-residential individual", value: "G"},
            {label: "Overseas corporate body/FII", value: "H"},
            {label: "Not categorised", value: "X"},
            {label: "Other", value: "Z"}
        ],
        required: true,
        schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
    },
    {
        render: {
            componentType: "textField",
        },
        name: "UDYAM_REG_NO",
        label: 'URN/UAN',
        type: "text",
        // maxLength: 18,
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        validate: (columnValue, allField, flag) => {
            let URNRegex = /^UDYAM-[A=Za-z]{2}-\d{2}-\d{7}$/;
            let UANRegex = /^[A=Za-z]{2}\d{2}[A-Za-z]{1}\d{7}$/;
            if(columnValue.value && (!URNRegex.test(columnValue.value) && !UANRegex.test(columnValue.value))) {
                return "Please Enter Valid Format."
            }
            return ""
        }
    },
    {
        render: {
            componentType: "datePicker"
        },
        name: "UDYAM_REG_DT",
        label: "URD/UAD",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
    },
    {
        render: {
          componentType: "autocomplete",
        },
        name: "ANNUAL_TURNOVER_SR_CD",
        label: "Turnover",
        options: (dependentValue, formState, _, authState) => getRangeOptions(authState?.companyID, authState?.user?.branchCode),
        _optionsKey: "turnoverMainOp",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
    },
    {
        render: {
            componentType: "textField"
        },
        name: "INVEST_IN_PLANT",
        label: "Investment Plant/Machinery",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
    }
],
}