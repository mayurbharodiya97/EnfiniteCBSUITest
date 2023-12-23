import * as API from "../../../../api";
  
  export const other_address_meta_data = {
    form: {
        name: "other_address_details_form",
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
                componentType: "arrayField",
            },
            name: "OTHER_ADDRESS",
            // fixedRows: 1,
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
            _fields: [
                {
                    render: {
                        componentType: "Divider",
                    },
                    dividerText: "CurrentAddress",
                    name: "CurrentAddressDivider",
                    label: "CurrentAddressDivider",
                },
                {
                    render: {
                        componentType: "autocomplete",
                    },
                    name: "ADDRESS_TYPE",
                    label: "AddressType",
                    placeholder: "",
                    type: "text",
                    // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                    GridProps: {xs:12, sm:4, md: 2.4, lg: 2.4, xl:2},
                    options: () => API.getPMISCData("ADDRESS_TYPE"),
                    _optionsKey: "AddTypeOptions",
                    required: true,          
                    schemaValidation: {
                        type: "string",
                        rules: [
                        { name: "required", params: ["ThisFieldisrequired"] },
                        ],
                    },
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
                    maxLength: 50,
                    validate: (columnValue, allField, flag) => {
                      let regex = /^[a-zA-Z0-9 ]*$/;
                          // special-character not allowed
                      if(columnValue.value) {
                          if(!regex.test(columnValue.value)) {
                              return "Alphanumeric Value is Allowed";
                          }
                      }
                      return "";
                    },          
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:6, md: 3.2, lg: 3.2, xl:3.3},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "ADD2",
                    label: "Line2",
                    placeholder: "",
                    type: "text",
                    maxLength: 50,
                    validate: (columnValue, allField, flag) => {
                      let regex = /^[a-zA-Z0-9 ]*$/;
                          // special-character not allowed
                      if(columnValue.value) {
                          if(!regex.test(columnValue.value)) {
                              return "Alphanumeric Value is Allowed";
                          }
                      }
                      return "";
                    },          
                    GridProps: {xs:12, sm:6, md: 3.2, lg: 3.2, xl:3.3},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "ADD3",
                    label: "Line3",
                    placeholder: "",
                    maxLength: 50,
                    validate: (columnValue, allField, flag) => {
                      let regex = /^[a-zA-Z0-9 ]*$/;
                          // special-character not allowed
                      if(columnValue.value) {
                          if(!regex.test(columnValue.value)) {
                              return "Alphanumeric Value is Allowed";
                          }
                      }
                      return "";
                    },          
                    type: "text",
                    GridProps: {xs:12, sm:6, md: 3.2, lg: 3.2, xl:3.3},
                },
                {
                    render: {
                        componentType: "select",
                    },
                    options: (dependentValue, formState, _, authState) => API.getOptionsOnPinParentArea(dependentValue, formState, _, authState),  // parent-area        
                    // _optionsKey: "localParentAreaList",
                    // options: (dependentValue, formState, _, authState) => API.getSubAreaOptions(dependentValue, authState?.companyID, authState?.user?.branchCode),
                    _optionsKey: "otherAddSubArea",
                    name: "AREA_CD",
                    label: "Area",
                    postValidationSetCrossFieldValues: (
                    field,
                    __,
                    ___,
                    dependentFieldsValues
                    ) => {
                        if(field.value) {
                            return {
                                PIN_CODE: {value: field?.optionData[0]?.PIN_CODE ?? ""},
                                CITY_ignoreField: {value: field?.optionData[0]?.CITY_NM ? field?.optionData[0]?.CITY_NM : field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
                                CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
                                DISTRICT_ignoreField: {value: field?.optionData[0]?.DISTRICT_NM ? field?.optionData[0]?.DISTRICT_NM : field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
                                DISTRICT_CD: {value: field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
                                STATE: {value: field?.optionData[0]?.STATE_NM ?? ""},
                                // STATE: {value: field?.optionData[0]?.STATE_NM ?? ""},
                                COUNTRY_ignoreField: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
                                STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
                                COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
                            }
                        }
                        return {}
                    },
                    runPostValidationHookAlways: true,    
                    required: true,
                    schemaValidation: {
                        type: "string",
                        rules: [
                        { name: "required", params: ["ThisFieldisrequired"] },
                        ],
                    },
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "PIN_CODE",
                    label: "PIN",
                    required: true,
                    placeholder: "",
                    type: "text",
                    maxLength: 6,
                    FormatProps: {
                        isAllowed: (values) => {
                          if (values?.value?.length > 6) {
                            return false;
                          }
                          return true;
                        },
                    },            
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "CITY_ignoreField",
                    label: "City",
                    required: true,
                    isReadOnly: true,
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "hidden",
                        name: "CITY_CD"
                    }
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "DISTRICT_ignoreField",
                    label: "District",
                    placeholder: "",
                    isReadOnly: true,
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "hidden",
                        name: "DISTRICT_CD"
                    }
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "STATE",
                    label: "State",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "COUNTRY_ignoreField",
                    label: "Country",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "STATE_CD",
                    // label: "UnionTerritoriesCode",
                    label: "State/U.T(Union Territories) Code",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "COUNTRY_CD",
                    label: "ISO-3166 Country Code of Residence",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
        
        
        
                {
                    render: {
                        componentType: "Divider",
                    },
                    dividerText: "Contact",
                    name: "ContactDivider",
                    label: "ContactDivider",
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "STD_1",
                    label: "PhoneO",
                    placeholder: "",
                    type: "text",
                    maxLength: 5,
                    GridProps: {xs:12, sm:4.5, md: 0.9, lg: 0.8, xl:0.6},
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
                        xs: 0, sm:0.2, md:0.1
                    }
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "STD_2",
                    label: "PhoneR",
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
                    GridProps: {xs:12, sm:4.5, md: 0.9, lg: 0.8, xl:0.6},
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "CONTACT2",
                    label: "",
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
                        xs: 0, sm:0.2, md:0.1
                    }
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "STD_3",
                    label: "MobileNo",
                    required: true,
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
                    GridProps: {xs:12, sm:4.5, md: 0.9, lg: 0.8, xl:0.6},
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "CONTACT3",
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
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
                },
                {
                    render: {
                        componentType: "spacer"
                    },
                    GridProps: {
                        xs: 0, sm:0.2, md:0.1
                    }
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "STD_4",
                    label: "Fax",
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
                    GridProps: {xs:12, sm:4.5, md: 0.9, lg: 0.8, xl:0.6},
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "CONTACT4",
                    label: "",
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
                        componentType: "textField",
                    },
                    name: "E_MAIL_ID",
                    label: "EmailId",
                    placeholder: "",
                    type: "text",
                    maxLength: 60,
                    validate: (columnValue, allField, flag) => {
                        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if(columnValue.value && !emailRegex.test(columnValue.value)) {
                            return "Please Enter Valid Email ID."
                        }
                        return "";
                    },            
                    GridProps: {xs:12, sm:4, md: 3, lg: 3, xl:3},
                },
                {
                    render: {
                        componentType: "hidden",
                    },
                    name: "SR_CD",
                    label: "Sr. No.",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 3, xl:3},
                },
            ]
        }
    ]
  }  