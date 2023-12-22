import * as API from "../../../../api";

export const company_info_meta_data = {
    form: {
        name: "company-info-kyc-details-form",
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "datePicker",
            },
            name: "COMMENCEMENT_DT",
            label: "Commencement Date",
            placeholder: "",
            format: "dd/MM/yyyy",
            maxDate: new Date(),
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "select",
            },
            name: "COMPANY_TYPE",
            label: "Type",
            options: [
                {label: "Type 1", value: "type1"},
                {label: "Type 2", value: "type2"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_REG_NO",
            label: "Reg.No.",
            required: true,
            maxLength: 50,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_SALES_TAX_NO",
            label: "Sales Tax No.",
            required: true,
            maxLength: 50,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_EXCISE_NO",
            label: "Excise No.",
            required: true,
            maxLength: 50,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_IT_NO",
            label: "IT No.",
            required: true,
            maxLength: 50,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_TAN_NO",
            label: "TAN No.",
            required: true,
            maxLength: 50,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_CIN_NO",
            label: "CIN No.",
            required: true,
            maxLength: 50,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "LIQUIDATION_DT",
            label: "Date of Liquidation",
            placeholder: "",
            format: "dd/MM/yyyy",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "WEBSITE_DTL",
            label: "Website",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "select",
            },
            name: "COMPANY_SIZE",
            label: "Size",
            options: () => API.getPMISCData("CST_COMP_SZ"),
            _optionsKey: "getCompSizedtl",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CEO_NAME",
            label: "CEO Name",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "STAFF_STRENGTH",
            label: "Staff Strength",
            required: true,
            maxLength: 10,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CIBIL_SCORE",
            label: "CIBIL MSME Rank",
            required: true,
            maxLength: 3,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
		
        {
            render: {
                componentType: "textField",
            },
            name: "SPECIALIZATION_REMARKS",
            label: "Specialization",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        
    ]
}


export const kyc_poa_legal_meta_data = {
    form: {
        name: "kyc_poaa_details_form",
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
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
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
                    //   CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
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
                    //   LOC_CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                      LOC_DISTRICT_CD: {value: field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
                    //   LOC_DISTRICT_CD: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
                      LOC_STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
                    //   LOC_STATE_CD: {value: field?.optionData[0]?.STATE_NM ?? ""},
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
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
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
          required: true,
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
          required: true,
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
          required: true,
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
          required: true,
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
          required: true,
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
          required: true,
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
          required: true,
          placeholder: "",
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
        placeholder: "",
        type: "text",
        GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
    },
    ]
  }