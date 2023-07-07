import { GridMetaDataType } from "components/dataTableStatic";
import * as API from "../../../api";
export const personal_detail_prefix_data = {
    form: {
        name: "personal_detail_prefix_details_form",
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
                componentType: "select",
            },
            name: "PREFIX_CD",
            label: "Prefix",
            // placeholder: "Prefix",
            options: () => API.getPMISCData("Salutation"),
            _optionsKey: "PDPrefix",
            type: "text",
            GridProps: {xs:2, sm:1},
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
                componentType: "textField",
            },
            name: "FIRST_NM",
            label: "First Name",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NM",
            label: "Middle Name",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SURNAME",
            label: "Last Name",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "hidden",
            },
            name: "FULL_NAME",
            label: "Full Name",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        }
    ]
}
export const personal_detail_maiden_data = {
    form: {
        name: "personal_detail_maiden_details_form",
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
                componentType: "select",
            },
            name: "MAIDEN_PREFIX_CD",
            label: "Prefix",
            options: () => API.getPMISCData("Salutation"),
            _optionsKey: "PDMaidenSalutation",
            defaultValue: "Mrs",
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 2, sm:1},
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
                componentType: "textField",
            },
            name: "MAIDEN_FIRST_NM",
            label: "First Name",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MAIDEN_MIDDLE_NM",
            label: "Middle Name",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MAIDEN_LAST_NM",
            label: "Last Name",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
        },
        {
            render: {
                componentType: "select",
            },
            name: "FATHER_SPOUSE",
            label: "Father/Spouse Name",
            defaultValue: "01",
            options: [
                {label: "Father", value: "01"},
                {label: "Spouse", value: "02"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
    ]
}
export const personal_detail_father_data = {
    form: {
        name: "personal_detail_father_details_form",
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
                componentType: "select",
            },
            name: "FATHER_PREFIX_CD,",
            label: "Prefix",
            options: () => API.getPMISCData("Salutation"),
            _optionsKey: "PDFatherSalutation",
            defaultValue: "Mr",
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 2, sm:1},
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
                componentType: "textField",
            },
            name: "FATHER_FIRST_NM",
            label: "First Name",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FATHER_MIDDLE_NM",
            label: "Middle Name",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FATHER_LAST_NM",
            label: "Last Name",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
        }
    ]
}
export const personal_detail_mother_data = {
    form: {
        name: "personal_detail_mother_details_form",
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
                componentType: "select",
            },
            name: "MOTHER_PREFIX_CD",
            label: "Prefix",
            options: () => API.getPMISCData("Salutation"),
            _optionsKey: "PDMotherSalutation",
            defaultValue: "Mrs",
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 2, sm:1},
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
                componentType: "textField",
            },
            name: "MOTHER_FIRST_NM",
            label: "First Name",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MOTHER_MIDDLE_NM",
            label: "Middle Name",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MOTHER_LAST_NM",
            label: "Last Name",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
        }
    ]
}
export const personal_other_detail_meta_data = {
    form: {
        name: "personal_other_details_form",
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
                componentType: "datePicker",
            },
            name: "BIRTH_DT",
            label: "Date of Birth",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "Minor", value: "minor"},
                {label: "Major", value: "major"}
            ],
            name: "LF_NO",
            label: "Minor/Major",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "MALE", value: "M"},
                {label: "FEMALE", value: "F"},
                {label: "OTHER", value: "O"},
                {label: "TRANSGENDER", value: "T"},
            ],
            name: "GENDER",
            label: "Gender",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "BLOOD_GRP_CD",
            label: "Blood Group",
            placeholder: "",
            options: () => API.getPMISCData("Blood"),
            _optionsKey: "bloodGroup",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "MARITAL_STATUS",
            label: "Marital Status",
            required: true,
            placeholder: "",
            options: () => API.getPMISCData("Marital"),
            _optionsKey: "maritalStatus",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "NATIONALITY",
            label: "Nationality",
            required: true,
            placeholder: "",
            options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "countryOptions",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "RESIDENCE_STATUS",
            label: "Resi. Status",
            required: true,
            placeholder: "",
            options: () => API.getPMISCData("RESIDE_STATUS"),
            _optionsKey: "ResisdenceStatus",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "TRADE_CD",
            label: "Occupation",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "GROUP_CD",
            label: "Group",
            placeholder: "",
            options: (dependentValue, formState, _, authState) => API.getCustomerGroupOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "GroupOptions",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "COMMU_CD",
            label: "Religion",
            required: true,
            options: (dependentValue, formState, _, authState) => API.getCommunityList(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "GroupOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "CASTE_CD",
            label: "Caste",
            placeholder: "",
            options: () => API.getPMISCData("CASTE_CD"),
            _optionsKey: "casteCD",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_REVISED_DT",
            label: "KYC Revised Dt.",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
    ]
}

export const entity_detail_meta_data = {
    form: {
        name: "personal_detail_prefix_details_form",
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
                componentType: "textField",
            },
            name: "NAME",
            label: "Name",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RELIGION",
            label: "Religion",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CASTE",
            label: "Caste",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OCCUPATION",
            label: "OCCUPATION",
            required: true,
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SUB_CUSTOMER_TYPE",
            label: "Sub Customer Type",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "GROUP",
            label: "Group",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RATING",
            label: "Rating",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "INCEPTION_DATE",
            label: "Inception Date",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "EXPLICIT_TDS",
            label: "Explicit TDS",
            options: [
                {label: "YES", value: "YES"},
                {label: "NO", value: "NO"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "GSTIN",
            label: "GSTIN",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_REVISED_DT",
            label: "KYC Revised Dt.",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "NATIONALITY",
            label: "Nationality",
            options: [
                {label: "Option1", value: "Option1"},
                {label: "Option2", value: "Option2"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RESI_STATUS",
            label: "Resi. Status",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
    ]
}

export const entity_registration_detail_meta_data = {
    form: {
        name: "personal_detail_prefix_details_form",
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
                componentType: "select",
            },
            name: "DECLARATION_RECEIVED",
            label: "Declaration Received",
            options: [
                {label: "YES", value: "YES"},
                {label: "NO", value: "NO"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DECLARATION_RECEIVED_DT",
            label: "Declaratin Received Date",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "GIIN",
            label: "GIIN",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DATE_OF_INCORPORATION",
            label: "Date of Incorporation",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PLACE_OF_INCORPORATION",
            label: "Place of Incorporation",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },        
        {
            render: {
                componentType: "textField",
            },
            name: "TIN",
            label: "TIN",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COUNTRY_OF_INCORPORATION",
            label: "Country of Incorporation",
            required: true,
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "TIN_ISSUING_COUNTRY",
            label: "TIN Issuing Country",
            required: true,
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CCIL_ID",
            label: "CCIL ID",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LEI_NO",
            label: "LEI No.",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "LEI_EXPIRY_DT",
            label: "LEI Expiry Date",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        // {
        //     render: {
        //         componentType: "select",
        //     },
        //     name: "EXPLICIT_TDS",
        //     label: "Explicit TDS",
        //     options: [
        //         {label: "YES", value: "YES"},
        //         {label: "NO", value: "NO"},
        //     ],
        //     placeholder: "",
        //     type: "text",
        //     GridProps: {xs:4, sm:3},
        // },
    ]
}

export const entity_income_detail_meta_data = {
    form: {
        name: "personal_detail_prefix_details_form",
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
                componentType: "textField",
            },
            name: "ANNUAL_INCOME",
            label: "Annual Income",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "TURNOVER",
            label: "Turnover",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OTHER_INCOME",
            label: "Other Income",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SOURCE_OF_INCOME",
            label: "Source of Income",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "IMPORT_EXPORT_CODE",
            label: "Import Export Code",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "THRESHOLD_LIMIT",
            label: "Threshold Limit",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
    ]
}
export const entity_exposure_detail_meta_data = {
    form: {
        name: "personal_detail_prefix_details_form",
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
                componentType: "textField",
            },
            name: "NON_FUNDED",
            label: "Non Funded",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FUNDED",
            label: "Funded",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
    ]
}
export const entity_company_info_meta_data = {
    form: {
        name: "personal_detail_prefix_details_form",
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
                componentType: "datePicker",
            },
            name: "COMMENCEMENT_DT",
            label: "Commencement Date",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "TYPE",
            label: "Type",
            options: [
                {label: "Type1", value: "Type1"},
                {label: "Type2", value: "Type2"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REG_NO",
            label: "Reg. No.",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SALES_TAX_NO",
            label: "Sales Tax No.",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EXCISE_NO",
            label: "Excise No.",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "IT_NO",
            label: "IT No.",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "TAN_NO",
            label: "TAN No.",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CIN_NO",
            label: "CIN No.",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DATE_OF_LIQUIDATION",
            label: "Date of Liquidation",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "WEBSITE",
            label: "Website",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SIZE",
            label: "Size",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CEO_NAME",
            label: "CEO Name",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "STAFF_STRENGTH",
            label: "Staff Strength",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CIBIL_MSME_RANK",
            label: "CIBIL MSME Rank",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
    ]
}


// GRID METADATA
export const personal_document_details_data: GridMetaDataType = {
    gridConfig: {
      dense: true,
      gridLabel: "Customer Searching",
      rowIdColumn: "CUST_ID",
      defaultColumnConfig: {
        width: 150,
        maxWidth: 250,
        minWidth: 100,
      },
      allowColumnReordering: true,
      disableSorting: false,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: true,
      pageSizes: [10, 20, 30],
      defaultPageSize: 10,
      containerHeight: {
        min: "42vh",
        max: "50vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
    },
    // filters: [],
    columns: [
      {
        accessor: "SR_NO",
        columnName: "Sr. No.",
        sequence: 1,
        alignment: "center",
        componentType: "default",
        width: 70,
        minWidth: 60,
        maxWidth: 120,
        isAutoSequence: true,
      },
      {
        accessor: "DOCUMENT",
        columnName: "Document",
        sequence: 1,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "IS_SUBMIT",
        columnName: "Submit",
        sequence: 3,
        alignment: "center",
        componentType: "editableCheckbox",
        isReadOnly: true,
        width: 80,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        accessor: "CUST_NAME",
        columnName: "Cust. Name",
        sequence: 2,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "DOCUMENT_NO",
        columnName: "Document No.",
        sequence: 1,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "VALID_TILL_DATE",
        columnName: "Valid till Date",
        sequence: 4,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "ENTERED_DATE",
        columnName: "Entered Date",
        sequence: 4,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
    ],
};