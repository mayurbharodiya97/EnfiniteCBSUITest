import * as API from "../../../../api";

export const kyc_proof_of_identity_meta_data = {
    form: {
        name: "kyc_poi_details_form",
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
            name: "FORM_60",
            label: "Form6061",
            placeholder: "",
            defaultValue: "N",
            type: "text",
            // GridProps: {xs: 4, sm:3},
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
            placeholder: "AAAAA1111A",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                  {
                    name: "pancard",
                    params: ["Please enter valid Pan Number"],
                  },
                ],
              },
        },
        {
            render: {
                componentType: "aadharCard",
            },
            name: "UNIQUE_ID",
            label: "UIDAadhaar",
            placeholder: "1111 1111 1111",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                  {
                    name: "aadhar",
                    params: ["Please enter valid Aadhar Number"],
                  },
                ],
              },
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ELECTION_CARD_NO",
            label: "VoterId",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "autocomplete",
          },
          name: "EXPLICIT_TDS",
          label: "ExplicitTDS",
          defaultValue: "N",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          options: [
              {label: "Yes", value: "T"},
              {label: "No", value: "N"},
          ],
        },
        {
          render: {
              componentType: "textField",
          },
          name: "NREGA_JOB_CARD",
          label: "NREGA",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "textField",
          },
          name: "OTHER_DOC",
          label: "OtherPoI",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "textField",
          },
          name: "OTHER_DOC_NO",
          label: "PoINo",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "textField",
          },
          name: "GSTIN",
          label: "GSTIN",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },



        {
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "PassportDetails",
            name: "passportDivider",
            label: "passportDivider"
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PASSPORT_NO",
            label: "No",
            placeholder: "",
            type: "text",
            required: true,          
            schemaValidation: {
                type: "string",
                rules: [
                    { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "PASSPORT_AUTHORITY_CD",
            label: "Autho",
            placeholder: "",
            required: true,          
            schemaValidation: {
                type: "string",
                rules: [
                    { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            options: () => API.getPMISCData("Authority"),
            _optionsKey: "passportAuthority",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "PASSPORT_ISSUE_DT",
          label: "IssueDate",
          maxDate: new Date(),
          required: true,          
          schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
          },
        //   required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "PASSPORT_EXPIRY_DT",
          label: "ExpiryDate",
          minDate: new Date(),
          required: true,          
          schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
          },
        //   required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },



        {
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "DrivingLicenseDetails",
            name: "drivingLicenseDivider",
            label: "drivingLicenseDivider"
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DRIVING_LICENSE_NO",
            label: "No",
            placeholder: "",
            required: true,          
            schemaValidation: {
                type: "string",
                rules: [
                    { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "DRIVING_LICENSE_AUTHORITY_CD",
            label: "Autho",
            required: true,          
            schemaValidation: {
                type: "string",
                rules: [
                    { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            options: () => API.getPMISCData("Authority"),
            _optionsKey: "drivingLicenseAuthority",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "DRIVING_LICENSE_ISSUE_DT",
          label: "IssueDate",
          maxDate: new Date(),
          required: true,          
          schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
          },
        //   required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "DRIVING_LICENSE_EXPIRY_DT",
          label: "ExpiryDate",
          minDate: new Date(),
          required: true,          
          schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
          },
        //   required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
    ]
}

export const kyc_proof_of_address_meta_data = {
  form: {
      name: "kyc_poa_details_form",
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
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "CurrentAddress",
            name: "currentAddDivider",
            label: "currentAddDivider"
        },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "ADDRESS_TYPE",
          label: "AddressType",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD1",
          label: "Line1",
          required: true,          
          schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
          },
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
        },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
        },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PIN_CODE",
            label: "PIN",
            required: true,
            schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
            },
            dependentFields: ["PAR_AREA_CD"],
            setValueOnDependentFieldsChange: (dependentFields) => {
                if(dependentFields?.PAR_AREA_CD?.value) {
                    return ""
                }
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },  
      {
          render: {
              componentType: "select",
          },
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "parentAreaList",
          name: "PAR_AREA_CD",
          label: "ParentArea",
          dependentFields: ["PIN_CODE"],
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
      {
          render: {
              componentType: "select",
          },
          dependentFields: ["PAR_AREA_CD", "PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) => API.getOptionsOnPinParentArea(dependentValue, formState, _, authState),
          _optionsKey: "subAreaList",
          postValidationSetCrossFieldValues: (
            field,
            __,
            ___,
            dependentFieldsValues
          ) => {
            if(field.value) {
                return {
                    // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
                    PAR_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
                    PIN_CODE: {value: field?.optionData[0]?.PIN_CODE, ignoreUpdate: true},
                    CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
                    // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                    DISTRICT: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
                    STATE: {value: field?.optionData[0]?.STATE_NM ?? ""},
                    COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
                    STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
                }
            }
            return {}
          },
          runPostValidationHookAlways: false, 
          name: "AREA_CD",
          label: "SubArea",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "CITY_CD",
          label: "City",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
          },
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "DISTRICT",
          label: "District",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "PROOF_OF_ADD",
          label: "ProofofAdd",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
          },
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          options: () => API.getPMISCData("CKYC_ADD_PROOF"),
          _optionsKey: "currentPoA",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "OTHER_POA",
          label: "OthersPoA",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },



    {
        render:  {
            componentType: "Divider",
            sequence: 1,
        },
        dividerText: "CorrespondenceAddress",
        name: "localAddDivider",
        label: "localAddDivider"
    },
    {
        render: { componentType: "checkbox"},
        name: "SAME_AS_PER",
        label: "SameAsPermanentAddress",
        defaultValue: true,
        // dependentFields: ["ADDRESS_TYPE", "ADD1"],
        // postValidationSetCrossFieldValues: (
        //     field,
        //     __,
        //     ___,
        //     dependentFieldsValues
        //   ) => {
        //       console.log(field, "fieldvalueee..", dependentFieldsValues)
        //     if(field.value) {
        //         return {
        //             // // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
        //             // LOC_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
        //         }
        //     }
        //     return {}
        //   },
          runPostValidationHookAlways: false,   
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "LOC_ADD_TYPE",
          label: "LocalAddressType",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD1",
          label: "Line1",
          required: true,          
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
          },         
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
      },
      {
        render: {
            componentType: "textField",
        },
        name: "LOC_PIN_CODE",
        label: "PIN",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        required: true,
        dependentFields: ["LOC_AREA_CD"],
        setValueOnDependentFieldsChange: (dependentFields) => {
            if(dependentFields?.LOC_AREA_CD?.value) {
                return ""
            }
        },
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
          ],
        },
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "LOC_AREA_CD",
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "localParentAreaList",
          label: "Parent Area",
          dependentFields: ["LOC_PIN_CODE"],
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_AREA_CD2",
          dependentFields: ["LOC_AREA_CD", "LOC_PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) => API.getOptionsOnLocalPinParentArea(dependentValue, formState, _, authState),
          _optionsKey: "localSubAreaList",
          label: "Sub Area",
          postValidationSetCrossFieldValues: (
            field,
            __,
            ___,
            dependentFieldsValues
          ) => {
            if(field.value) {
                return {
                    // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
                    LOC_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
                    LOC_PIN_CODE: {value: field?.optionData[0]?.PIN_CODE, ignoreUpdate: true},
                    LOC_CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
                    // LOC_CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                    LOC_DISTRICT_CD: {value: field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
                    // LOC_DISTRICT_CD: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
                    LOC_STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    // LOC_STATE_CD: {value: field?.optionData[0]?.STATE_NM ?? ""},
                    LOC_COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
                    STATE_UT_CODE: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    LOC_COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
                }
            }
            return {}
          },
          runPostValidationHookAlways: false,    

          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_CITY_CD",
          label: "City",
        //   required: true,
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_DISTRICT_CD",
          label: "District",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_STATE_CD",
          label: "State",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_COUNTRY",
          label: "Country",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_UT_CODE",
          label: "UnionTerritoriesCode",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_COUNTRY_CD",
          label: "CountryCode",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "LOC_PROOF_OF_ADD",
          label: "ProofofAdd",
        //   required: true,
          placeholder: "",
          options: () => API.getPMISCData("CKYC_LOC_POA"),
          _optionsKey: "localPoA",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },



    {
        render:  {
            componentType: "Divider",
            sequence: 1,
        },
        dividerText: "Contact",
        name: "contactDivider",
        label: "contactDivider"
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_1",
        label: "",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
      {
        render: {
            componentType: "textField",
        },
        name: "CONTACT1",
        label: "PhoneO",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_2",
        label: "",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "CONTACT2",
        label: "PhoneR",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_3",
        label: "",
        required: true,
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "CONTACT3",
        label: "MobileNo",
        required: true,
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_4",
        label: "",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "CONTACT4",
        label: "Fax",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "E_MAIL_ID",
        label: "EmailId",
        placeholder: "",
        required: true,          
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },


    // {
    //     render: {
    //       componentType: "numberFormat",
    //     },
    //     name: "MOBILE_NU",
    //     label: "Mobile Number",
    //     placeholder: "",
    //     type: "text",
    //     StartAdornment: "+00",
    //     GridProps: {
    //       xs: 12,
    //       md: 3,
    //       sm: 3,
    //     },
    //     schemaValidation: {
    //       type: "string",
    //       rules: [{ name: "max", params: [11, "Mobile No should be 11 digit."] }],
    //     },
    //     validate: ({ value }) => {
    //       if (Boolean(value) && value.length < 11) {
    //         return "Mobile No should be 11 digit.";
    //       }
    //       return "";
    //     },
    //     FormatProps: {
    //       format: "###########",
    //       allowNegative: false,
    //       allowLeadingZeros: true,
    //       isNumericString: true,
    //       isAllowed: (values) => {
    //         if (values?.value?.length > 11) {
    //           return false;
    //         }
    //         if (values.floatValue === 0) {
    //           return false;
    //         }
    //         return true;
    //       },
    //     },
    //   }


  ]
}

export const kyc_legal_proof_of_add_meta_data = {
  form: {
      name: "kyc_poa_details_form",
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
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "CurrentAddress",
            name: "currentAddDivider",
            label: "currentAddDivider"
        },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "ADDRESS_TYPE",
          label: "AddressType",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD1",
          label: "Line1",
          required: true,          
          schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
          },
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
        },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
        },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PIN_CODE",
            label: "PIN",
            required: true,
            schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
            },
            dependentFields: ["PAR_AREA_CD"],
            setValueOnDependentFieldsChange: (dependentFields) => {
                if(dependentFields?.PAR_AREA_CD?.value) {
                    return ""
                }
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },  
      {
          render: {
              componentType: "select",
          },
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "parentAreaList",
          name: "PAR_AREA_CD",
          label: "ParentArea",
          dependentFields: ["PIN_CODE"],
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
      {
          render: {
              componentType: "select",
          },
          dependentFields: ["PAR_AREA_CD", "PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) => API.getOptionsOnPinParentArea(dependentValue, formState, _, authState),
          _optionsKey: "subAreaList",
          postValidationSetCrossFieldValues: (
            field,
            __,
            ___,
            dependentFieldsValues
          ) => {
            if(field.value) {
                return {
                    // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
                    PAR_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
                    PIN_CODE: {value: field?.optionData[0]?.PIN_CODE, ignoreUpdate: true},
                    CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
                    // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                    DISTRICT: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
                    STATE: {value: field?.optionData[0]?.STATE_NM ?? ""},
                    COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
                    STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
                }
            }
            return {}
          },
          runPostValidationHookAlways: false, 
          name: "AREA_CD",
          label: "SubArea",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "CITY_CD",
          label: "City",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
          },
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "DISTRICT",
          label: "District",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "PROOF_OF_ADD",
          label: "ProofofAdd",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
          },
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          options: () => API.getPMISCData("CKYC_ADD_PROOF"),
          _optionsKey: "currentPoA",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "OTHER_POA",
          label: "OthersPoA",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },



    {
        render:  {
            componentType: "Divider",
            sequence: 1,
        },
        dividerText: "CorrespondenceAddress",
        name: "localAddDivider",
        label: "localAddDivider"
    },
    {
        render: { componentType: "checkbox"},
        name: "SAME_AS_PER",
        label: "SameAsPermanentAddress",
        defaultValue: true,
        postValidationSetCrossFieldValues: (
            field,
            __,
            ___,
            dependentFieldsValues
          ) => {
              console.log("fieldvalueee", field)
            if(field.value) {
                return {
                    // // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
                    // LOC_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
                }
            }
            return {}
          },
          runPostValidationHookAlways: false,   
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "LOC_ADD_TYPE",
          label: "LocalAddressType",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD1",
          label: "Line1",
          required: true,          
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
            ],
          },         
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
      },
      {
        render: {
            componentType: "textField",
        },
        name: "LOC_PIN_CODE",
        label: "PIN",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        required: true,
        dependentFields: ["LOC_AREA_CD"],
        setValueOnDependentFieldsChange: (dependentFields) => {
            if(dependentFields?.LOC_AREA_CD?.value) {
                return ""
            }
        },
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
          ],
        },
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "LOC_AREA_CD",
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "localParentAreaList",
          label: "Parent Area",
          dependentFields: ["LOC_PIN_CODE"],
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_AREA_CD2",
          dependentFields: ["LOC_AREA_CD", "LOC_PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) => API.getOptionsOnLocalPinParentArea(dependentValue, formState, _, authState),
          _optionsKey: "localSubAreaList",
          label: "Sub Area",
          postValidationSetCrossFieldValues: (
            field,
            __,
            ___,
            dependentFieldsValues
          ) => {
            if(field.value) {
                return {
                    // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
                    LOC_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
                    LOC_PIN_CODE: {value: field?.optionData[0]?.PIN_CODE, ignoreUpdate: true},
                    LOC_CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
                    // LOC_CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                    LOC_DISTRICT_CD: {value: field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
                    // LOC_DISTRICT_CD: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
                    LOC_STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    // LOC_STATE_CD: {value: field?.optionData[0]?.STATE_NM ?? ""},
                    LOC_COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
                    STATE_UT_CODE: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    LOC_COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
                }
            }
            return {}
          },
          runPostValidationHookAlways: false,    

          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_CITY_CD",
          label: "City",
        //   required: true,
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_DISTRICT_CD",
          label: "District",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_STATE_CD",
          label: "State",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_COUNTRY",
          label: "Country",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_UT_CODE",
          label: "UnionTerritoriesCode",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_COUNTRY_CD",
          label: "CountryCode",
          placeholder: "",
          isReadOnly: true,
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "LOC_PROOF_OF_ADD",
          label: "ProofofAdd",
        //   required: true,
          placeholder: "",
          options: () => API.getPMISCData("CKYC_LOC_POA"),
          _optionsKey: "localPoA",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },



    {
        render:  {
            componentType: "Divider",
            sequence: 1,
        },
        dividerText: "Contact",
        name: "contactDivider",
        label: "contactDivider"
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_1",
        label: "",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
      {
        render: {
            componentType: "textField",
        },
        name: "CONTACT1",
        label: "PhoneO",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_2",
        label: "",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "CONTACT2",
        label: "PhoneR",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_3",
        label: "",
        required: true,
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "CONTACT3",
        label: "MobileNo",
        required: true,
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "STD_4",
        label: "",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "CONTACT4",
        label: "Fax",
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "E_MAIL_ID",
        label: "EmailId",
        placeholder: "",
        required: true,          
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "E_MAIL_ID2",
        label: "EmailId2",
        required: true,
        schemaValidation: {
            type: "string",
            rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            ],
        },
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },

    // {
    //     render: {
    //       componentType: "numberFormat",
    //     },
    //     name: "MOBILE_NU",
    //     label: "Mobile Number",
    //     placeholder: "",
    //     type: "text",
    //     StartAdornment: "+00",
    //     GridProps: {
    //       xs: 12,
    //       md: 3,
    //       sm: 3,
    //     },
    //     schemaValidation: {
    //       type: "string",
    //       rules: [{ name: "max", params: [11, "Mobile No should be 11 digit."] }],
    //     },
    //     validate: ({ value }) => {
    //       if (Boolean(value) && value.length < 11) {
    //         return "Mobile No should be 11 digit.";
    //       }
    //       return "";
    //     },
    //     FormatProps: {
    //       format: "###########",
    //       allowNegative: false,
    //       allowLeadingZeros: true,
    //       isNumericString: true,
    //       isAllowed: (values) => {
    //         if (values?.value?.length > 11) {
    //           return false;
    //         }
    //         if (values.floatValue === 0) {
    //           return false;
    //         }
    //         return true;
    //       },
    //     },
    //   }


  ]
}