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
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "LINE1",
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
                    GridProps: {xs:12, sm:6, md: 3.2, lg: 3.2, xl:3.3},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "LINE2",
                    label: "Line2",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:6, md: 3.2, lg: 3.2, xl:3.3},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "LINE3",
                    label: "Line3",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:6, md: 3.2, lg: 3.2, xl:3.3},
                },
                {
                    render: {
                        componentType: "select",
                    },
                    options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),  // parent-area        
                    // _optionsKey: "localParentAreaList",
                    // options: (dependentValue, formState, _, authState) => API.getSubAreaOptions(dependentValue, authState?.companyID, authState?.user?.branchCode),
                    _optionsKey: "otherAddSubArea",
                    name: "AREA",
                    label: "Area",
                    postValidationSetCrossFieldValues: (
                    field,
                    __,
                    ___,
                    dependentFieldsValues
                    ) => {
                        if(field.value) {
                            return {
                                PIN: {value: field?.optionData[0]?.PIN_CODE ?? ""},
                                CITY: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                                DISTRICT: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
                                STATE: {value: field?.optionData[0]?.STATE_NM ?? ""},
                                COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
                                STATE_UT_CODE: {value: field?.optionData[0]?.STATE_CD ?? ""},
                                ISO_COUNTRY_CODE: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
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
                        componentType: "textField",
                    },
                    name: "PIN",
                    label: "PIN",
                    required: true,
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "CITY",
                    label: "City",
                    required: true,
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "DISTRICT",
                    label: "District",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
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
                    name: "COUNTRY",
                    label: "Country",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "STATE_UT_CODE",
                    label: "UnionTerritoriesCode",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "ISO_COUNTRY_CODE",
                    label: "CountryCode",
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
                        componentType: "textField",
                    },
                    name: "STD_1",
                    label: "",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 1, lg: 1, xl:1},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "CONTACT1",
                    label: "PhoneO",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "STD_2",
                    maxLength: 3,
                    label: "",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 1, lg: 1, xl:1},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "CONTACT2",
                    label: "PhoneR",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
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
                    GridProps: {xs:12, sm:4, md: 1, lg: 1, xl:1},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "CONTACT3",
                    label: "MobileNo",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "STD_4",
                    label: "MobileNo",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 1, lg: 1, xl:1},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "CONTACT4",
                    label: "Fax",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 2, lg: 2, xl:2},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "EMAIL_ID",
                    label: "EmailId",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 3, xl:3},
                },
            ]
        }
    ]
  }
  
  export const other_address_poa_contact_meta_data = {
    form: {
        name: "other_address_poa_contact_details_form",
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
                componentType: "textField",
            },
            name: "PHONE_o",
            label: "Phone(O)",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PHONE_R",
            label: "Phone(R)",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MOBILE_NO",
            label: "Mobile No.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FAX",
            label: "Fax",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMAIL_ID",
            label: "Email ID",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
    ]
  }  