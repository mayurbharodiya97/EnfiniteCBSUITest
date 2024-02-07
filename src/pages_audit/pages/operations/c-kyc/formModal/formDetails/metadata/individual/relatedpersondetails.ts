import * as API from "../../../../api";

export const related_person_detail_data = {
    form: {
        name: "related_person_details_form",
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "arrayField"
            },
            name: "RELATED_PERSON_DTL",
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
            _fields: [
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
                {
                    render: {
                        componentType: "autocomplete",
                    },
                    options: () => API.getPMISCData("CKYC_RELAT_PERS", null, "I"),
                    _optionsKey: "kycRelatedtype",
                    name: "RELATED_PERSON_TYPE",
                    label: "Type",
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
                        componentType: "autocomplete",
                    },
                    name: "REF_TYPE",
                    label: "RefType",
                    required: true,
                    schemaValidation: {
                        type: "string",
                        rules: [
                        { name: "required", params: ["ThisFieldisrequired"] },
                        ],
                    },
                    // options: () => API.getPMISCData("REF_RELATION"),
                    options: [
                        {label: "OTHER", value: "O"},
                        {label: "C-KYC", value: "C"},
                    ],
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
                        componentType: "numberFormat",
                    },
                    name: "REF_CUST_ID",
                    label: "RefCustID",
                    maxLength: 12,
                    FormatProps: {
                        isAllowed: (values) => {
                        if (values?.value?.length > 12) {
                            return false;
                        }
                        return true;
                        },
                    },
                    type: "text",
                    reqired: true,
                    schemaValidation: {
                        type: "string",
                        rules: [
                          { name: "required", params: ["ThisFieldisrequired"] },
                        ],
                    },
                    dependentFields: ["REF_TYPE"],
                    shouldExclude(fieldData, dependentFieldsValues, formState) {
                        if (dependentFieldsValues["RELATED_PERSON_DTL.REF_TYPE"]?.value === "C") {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                    // dependentFields: ["DAILY_AMT"],
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "REF_FIRST_NM",
                    label: "FirstName",
                    placeholder: "First Name",
                    required: true,
                    schemaValidation: {
                        type: "string",
                        rules: [
                        { name: "required", params: ["ThisFieldisrequired"] },
                        ],
                    },
                    validate: (columnValue, allField, flag) => {
                        let regex = /^[a-zA-Z]+$/;
                        if(columnValue.value) {
                            if(columnValue.value !== columnValue.value.trimStart() && columnValue.value !== columnValue.value.trimEnd()) {
                                return "Please remove extra space";  
                            } else if(columnValue.value !== columnValue.value.trimStart()) {
                              return "Please remove extra space from the starting";
                            } else if (columnValue.value !== columnValue.value.trimEnd()) {
                              return "Please remove extra space from the ending";
                            } else if(!regex.test(columnValue.value)) {
                                return "Please Enter Valid Format";
                            }
                        }
                        return "";
                    },
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                    // dependentFields: ["DAILY_AMT"],
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "REF_MIDDLE_NM",
                    label: "MiddleName",
                    placeholder: "Middle Name",
                    validate: (columnValue, allField, flag) => {
                        let regex = /^[a-zA-Z]+$/;
                        if(columnValue.value) {
                            if(columnValue.value !== columnValue.value.trimStart() && columnValue.value !== columnValue.value.trimEnd()) {
                                return "Please remove extra space";  
                            } else if(columnValue.value !== columnValue.value.trimStart()) {
                              return "Please remove extra space from the starting";
                            } else if (columnValue.value !== columnValue.value.trimEnd()) {
                              return "Please remove extra space from the ending";
                            } else if(!regex.test(columnValue.value)) {
                                return "Please Enter Valid Format";
                            }
                        }
                        return "";
                    },
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "REF_LAST_NM",
                    label: "LastName",
                    placeholder: "Last Name",
                    validate: (columnValue, allField, flag) => {
                        let regex = /^[a-zA-Z]+$/;
                        if(columnValue.value) {
                            if(columnValue.value !== columnValue.value.trimStart() && columnValue.value !== columnValue.value.trimEnd()) {
                                return "Please remove extra space";  
                            } else if(columnValue.value !== columnValue.value.trimStart()) {
                              return "Please remove extra space from the starting";
                            } else if (columnValue.value !== columnValue.value.trimEnd()) {
                              return "Please remove extra space from the ending";
                            } else if(!regex.test(columnValue.value)) {
                                return "Please Enter Valid Format";
                            }
                        }
                        return "";
                    },
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "RELATED_PERSON_KYC",
                    label: "CkycNo",
                    placeholder: "",
                    maxLength: 14,
                    FormatProps: {
                        isAllowed: (values) => {
                        if (values?.value?.length > 14) {
                            return false;
                        }
                        return true;
                        },
                    },
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "REF_ACCT_NM",
                    label: "RefName",
                    isReadOnly: true,
                    placeholder: "",
                    type: "text",
                    dependentFields: ["REF_FIRST_NM", "REF_MIDDLE_NM", "REF_LAST_NM"],
                    setValueOnDependentFieldsChange: (dependentFields) => {
                        let full_name = `${dependentFields?.REF_FIRST_NM?.value ?? ""} ${dependentFields?.REF_MIDDLE_NM?.value ?? ""} ${dependentFields?.REF_LAST_NM?.value ?? ""}`
                        return full_name;
                    },
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
        
        
        
                {
                    render:  {
                        componentType: "Divider",
                        sequence: 20,
                    },
                    dividerText: "PoIOfRelatedPerson",
                    name: "PoIOfRelatedPersonDivider_ignoreField",
                    label: "PoIOfRelatedPersonDivider"
                },
                {
                    render: {
                        componentType: "panCardOptional",
                    },
                    name: "PAN_NO",
                    label: "PAN",
                    placeholder: "AAAAA1111A",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "DRIVING_LICENSE_NO",
                    label: "DrivingLicNo",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                    // dependentFields: ["DAILY_AMT"],
                },
                {
                    render: {
                        componentType: "datePicker",
                    },
                    name: "DRIVING_LICENSE_EXPIRY_DT",
                    label: "DrivingLicExpDt",
                    minDate: new Date(),
                    // required: true,
                    // placeholder: "",
                    // type: "datePicker",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "ELECTION_CARD_NO",
                    label: "VoterId",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "PASSPORT_NO",
                    label: "PassportNo",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "datePicker",
                    },
                    name: "PASSPORT_EXPIRY_DT",
                    label: "PassportExpDt",
                    minDate: new Date(),
                    // required: true,
                    // placeholder: "",
                    // type: "datePicker",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "UNIQUE_ID",
                    label: "UniqueId",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "NREGA_JOB_CARD",
                    label: "NREGAJobCard",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "OTHER_DOC",
                    label: "OtherDoc",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "OTHER_DOC_NO",
                    label: "OtherDocNo",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
        
        
        
                {
                    render:  {
                        componentType: "Divider",
                        sequence: 20,
                    },
                    dividerText: "AttesDetailsIPVBy",
                    name: "AttesDetailsIPVByDivider_ignoreField",
                    label: "AttesDetailsIPVByDivider"
                },
                {
                    render: {
                        componentType: "autocomplete",
                    },
                    name: "RCV_DOC_TYPE",
                    label: "DocReceived",
                    options: () => API.getPMISCData("CKYC_RCVDOCTYPE"),
                    _optionsKey: "kycDocReceivedType",
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
                    options: () => API.getPMISCData("CKYC_RISK_CATEG"),
                    _optionsKey: "kycRiskCateg",
                    name: "RISK_CATEG",
                    label: "RiskCategory",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "autocomplete",
                    },
                    name: "IPV_FLAG",
                    label: "IPVFlag",
                    options: [
                        {label: "YES", value: "Y"},
                        {label: "NO", value: "N"},
                    ],
                    _optionsKey: "ipvFlag",
                    defaultValue: "N",
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
                        componentType: "datePicker",
                    },
                    name: "IPV_DATE",
                    label: "IPVDate",
                    // placeholder: "",
                    // type: "datePicker",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "IPV_EMP_CODE",
                    label: "EmpCode",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "IPV_NAME",
                    label: "EmpName",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "IPV_EMP_DESIG",
                    label: "EmpDesig",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "IPV_BRANCH",
                    label: "IPVBranch",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "ORG_NAME",
                    label: "OrgName",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "ORG_CODE",
                    label: "OrgCode",
                    placeholder: "",
                    type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "PLACE_OF_DECLARE",
                    label: "DecPlace",
                    placeholder: "",
                    type: "text",
                    txtTransform: "uppercase",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },
                {
                    render: {
                        componentType: "datePicker",
                    },
                    name: "DATE_OF_DECLARE",
                    label: "DecDate",
                    // placeholder: "",
                    // type: "datePicker",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                },        
            ]
        }
    ]
}