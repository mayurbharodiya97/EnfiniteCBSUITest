import { GridMetaDataType } from "components/dataTableStatic";
import {differenceInYears} from "date-fns";
import * as API from "../../../../api";
export const personal_detail_prefix_data = {
    form: {
        name: "personal_detail_prefix_details_form",
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
            Divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "Prefix",
            name: "prefixDivider",
            label: "prefixDivider"
        },
        {
            render: {
                componentType: "autocomplete",
                sequence: 2,
            },
            name: "PREFIX_CD",
            label: "Prefix",
            // placeholder: "Prefix",
            options: () => API.GetDynamicSalutationData("Salutation"),
            _optionsKey: "PDPrefix",
            type: "text",
            GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1 },
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            }
            // GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:0.5},
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
                sequence: 3,
            },
            name: "FIRST_NM",
            label: "FirstName",
            // placeholder: "First Name",
            type: "text",
            // GridProps: {xs:4, sm:2},
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            }
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
                sequence: 4,
            },
            name: "LAST_NM",
            label: "MiddleName",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
                sequence: 6,
            },
            name: "SURNAME",
            label: "LastName",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
                sequence: 7,
            },
            name: "ACCT_NM",
            isReadOnly: true,
            label: "FullName",
            placeholder: "",
            dependentFields: ["FIRST_NM", "LAST_NM", "SURNAME"],
            setValueOnDependentFieldsChange: (dependentFields) => {
                let full_name = `${dependentFields?.FIRST_NM?.value} ${dependentFields?.LAST_NM?.value} ${dependentFields?.SURNAME?.value}`
                return full_name;
            },
            type: "text",
            GridProps: {xs:12, sm:5, md: 4, lg: 3.5, xl: 2},
        },
        {
            render: {
                componentType: "select",
                sequence: 7,
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
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "select",
                sequence: 7,
            },
            name: "MARITAL_STATUS",
            label: "MaritalStatus",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            placeholder: "",
            options: () => API.getPMISCData("Marital"),
            _optionsKey: "maritalStatus",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },


        {
            render:  {
                componentType: "Divider",
                sequence: 8,
            },
            dividerText: "MaidenName",
            name: "maidenHeaderdivider",
            label: "maidenHeaderDivider"
        },
        {
            render: {
                componentType: "select",
                sequence: 9,
            },
            name: "MAIDEN_PREFIX_CD",
            label: "Prefix",
            options: () => API.getPMISCData("Salutation"),
            _optionsKey: "PDMaidenSalutation",
            defaultValue: "Mrs",
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1},            
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
                sequence: 10,
            },
            accessor: "MAIDEN_FIRST_NM",
            name: "MAIDEN_FIRST_NM",
            label: "FirstName",
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            validate: (columnValue, allField, flag) => {
                if (!Boolean(columnValue)) {
                  return "This field is required.";
                }
                return "";
            },
            // schemaValidation: {
            //     type: "string",
            //     rules: [
            //         {name: "required", params: ["field is required"]},
            //     ]
            // }
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
                sequence: 11,
            },
            name: "MAIDEN_MIDDLE_NM",
            label: "MiddleName",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
                sequence: 12,
            },
            name: "MAIDEN_LAST_NM",
            label: "LastName",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
              componentType: "spacer",
              sequence: 13,
            },
            sequence: 14,
            GridProps: {
              xs: 12,
            //   sm: 12,
            //   md: 12,
            },
        },
        {
            render: {
                componentType: "autocomplete",
                sequence: 14,
            },
            name: "FATHER_SPOUSE",
            label: "FatherOrSpuuseName",
            defaultValue: "01",
            options: [
                {label: "Father", value: "01"},
                {label: "Spouse", value: "02"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:2.5, md:2, lg:1.5, xl:1},
            postValidationSetCrossFieldValues: (
                field,
                __,
                ___,
                dependentFieldsValues
            ) => {
                console.log("q  wqeqweqweqwe f/s", field)
                if(field?.value == "01") {
                    return {fatherHeaderDivider: {value: "Father Name"}}
                }
                if(field?.value == "02") {
                    return {fatherHeaderDivider: {value: "Spouse Name"}}
                }
                return {}
            },
            runPostValidationHookAlways: true,
        },


        {
            render:  {
                componentType: "Divider",
                sequence: 15,
            },
            dividerText: "FatherName",
            name: "fatherHeaderDivider",
            label: "fatherHeaderDivider",
            // dependentFields: ["FATHER_SPOUSE"],
            // setValueOnDependentFieldsChange: (dependentFields) => {
            //     console.log("setvalue divider", dependentFields?.FATHER_SPOUSE?.optionData[0]?.label)
            //     let dividerText = dependentFields?.FATHER_SPOUSE?.optionData[0]?.label ? `${dependentFields?.FATHER_SPOUSE?.optionData[0]?.label} Name` : null
            //     return dividerText;
            // },
        },
        {
            render: {
                componentType: "autocomplete",
                sequence: 16,
            },
            name: "FATHER_PREFIX_CD",
            label: "Prefix",
            options: () => API.getPMISCData("Salutation"),
            _optionsKey: "PDFatherSalutation",
            defaultValue: "Mr",
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1},
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
                sequence: 17,
            },
            name: "FATHER_FIRST_NM",
            label: "FirstName",
            // placeholder: "First Name",
            type: "text",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
                sequence: 18,
            },
            name: "FATHER_MIDDLE_NM",
            label: "MiddleName",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
                sequence: 19,
            },
            name: "FATHER_LAST_NM",
            label: "LastName",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },



        {
            render:  {
                componentType: "Divider",
                sequence: 20,
            },
            dividerText: "MotherName",
            name: "motherHeaderDivider",
            label: "motherHeaderDivider"
        },
        {
            render: {
                componentType: "autocomplete",
                sequence: 21,
            },
            name: "MOTHER_PREFIX_CD",
            label: "Prefix",
            options: () => API.getPMISCData("Salutation"),
            _optionsKey: "PDMotherSalutation",
            defaultValue: "Mrs",
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1},
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
                sequence: 22,
            },
            name: "MOTHER_FIRST_NM",
            label: "FirstName",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
                sequence: 23,
            },
            name: "MOTHER_MIDDLE_NM",
            label: "MiddleName",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
                sequence: 24,
            },
            name: "MOTHER_LAST_NM",
            label: "LastName",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
            accessor: "MAIDEN_FIRST_NM",
            name: "MAIDEN_FIRST_NM",
            label: "First Name",
            required: true,
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs: 4, sm:2},
            // validate: (columnValue, allField, flag) => {
            //     if (!Boolean(columnValue)) {
            //       return "This field is required.";
            //     }
            //     return "";
            // },
            // schemaValidation: {
            //     type: "string",
            //     rules: [
            //         {name: "required", params: ["field is required"]},
            //     ]
            // }
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
              componentType: "spacer",
            },
            sequence: 14,
            GridProps: {
              xs: 12,
            //   sm: 12,
            //   md: 12,
            },
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
            name: "FATHER_PREFIX_CD",
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
                componentType: "datePicker",
            },
            name: "BIRTH_DT",
            label: "DateOfBirth",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
            options: [
                {label: "Minor", value: "M"},
                {label: "Major", value: "J"}
            ],
            dependentFields: ["BIRTH_DT"],
            setValueOnDependentFieldsChange: (dependentFields) => {
                if(dependentFields?.BIRTH_DT?.value) {
                    let age = differenceInYears(new Date(), dependentFields?.BIRTH_DT?.value)
                    return (age && age> 18) ? "major" : "minor";
                } else return ""
            },
            name: "LF_NO",
            label: "Minor/Major",
            placeholder: "",
            type: "text",
            // GridProps: {xs: 4, sm:3},
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "BLOOD_GRP_CD",
            label: "BloodGroup",
            placeholder: "",
            options: () => API.getPMISCData("Blood"),
            _optionsKey: "bloodGroup",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "NATIONALITY",
            label: "Nationality",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            placeholder: "",
            options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "countryOptions",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "RESIDENCE_STATUS",
            label: "ResidenceStatus",
            required: true,
            placeholder: "",
            options: () => API.getPMISCData("RESIDE_STATUS"),
            _optionsKey: "ResisdenceStatus",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            }
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "TRADE_CD",
            label: "Occupation",
            options: (dependentValue, formState, _, authState) => API.getOccupationDTL(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "occupationOp",  
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "GROUP_CD",
            label: "Group",
            placeholder: "",
            options: (dependentValue, formState, _, authState) => API.getCustomerGroupOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "GroupOptions",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "COMMU_CD",
            label: "Religion",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            options: (dependentValue, formState, _, authState) => API.getCommunityList(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "CommunityOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "CASTE_CD",
            label: "Caste",
            placeholder: "",
            options: () => API.getPMISCData("CASTE_CD"),
            _optionsKey: "casteCD",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_REVIEW_DT",
            label: "KycRevisedDate",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5}
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
        // {
        //     render: {
        //         componentType: "formbutton"
        //     },
        //     name: "Search",
        // },
        // {
        //     render: {
        //         componentType: "formbutton"
        //     },
        //     name: "Cust.Info",
        // },
        // {
        //     render: {
        //         componentType: "textField",
        //     },
        //     name: "RELIGION",
        //     label: "Religion",
        //     // placeholder: "First Name",
        //     type: "text",
        //     GridProps: {xs:4, sm:2},
        //     // dependentFields: ["DAILY_AMT"],
        // },
        // {
        //     render: {
        //         componentType: "textField",
        //     },
        //     name: "CASTE",
        //     label: "Caste",
        //     // placeholder: "First Name",
        //     type: "text",
        //     GridProps: {xs:4, sm:2},
        //     // dependentFields: ["DAILY_AMT"],
        // },
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
            format: "dd/MM/yyyy",
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
            format: "dd/MM/yyyy",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "NATIONALITY",
            label: "Registered in Country",
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
        {
            render: {
                componentType: "textField",
            },
            name: "GIIN",
            label: "GIIN",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "TIN",
            label: "TIN",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "TIN_ISSUING_COUNTRY",
            label: "TIN",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },        
        {
            render: {
                componentType: "textField"
            },
            name: "CCIL_ID",
            label: "CCIL ID",
        },
        {
            render: {
                componentType: "textField"
            },
            name: "LEI_NO",
            label: "LEI NO.",
        },
        {
            render: {
                componentType: "datePicker"
            },
            name: "LEI_EXPIRY_DT",
            label: "LEI Expiry Date",
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
            format: "dd/MM/yyyy",
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
            format: "dd/MM/yyyy",
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
            format: "dd/MM/yyyy",
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
            format: "dd/MM/yyyy",
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
            format: "dd/MM/yyyy",
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
export const DocumentGridMetaData: GridMetaDataType = {
    gridConfig: {
      dense: true,
      gridLabel: "Documents",
      rowIdColumn: "id",
      defaultColumnConfig: {
        width: 400,
        maxWidth: 450,
        minWidth: 300,
      },
      allowColumnReordering: true,
      disableGlobalFilter: true,
      disableSorting: false,
      hideHeader: false,
      disableGroupBy: true,
      enablePagination: true,
      pageSizes: [15, 25, 50],
      defaultPageSize: 15,
      containerHeight: {
        min: "68vh",
        max: "68vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
      allowRowSelection: false,
      isCusrsorFocused: true,
      hiddenFlag: "_hidden",
    },
    filters: [],
    columns: [
      {
        accessor: "",
        columnName: "Sr.No.",
        sequence: 1,
        alignment: "right",
        componentType: "default",
        width: 70,
        minWidth: 60,
        maxWidth: 120,
        isAutoSequence: true,
      },
      {
        accessor: "DOCUMENT",
        columnName: "Document*",
        sequence: 2,
        alignment: "left",
        componentType: "editableSelect",
        // options: [{label: "label1", value: "value1"},{label: "label2", value: "value2"}],
        options: (dependentValue, formState, _, authState) => {
            // console.log("fwezzzzfeqw", dependentValue, formState, _, authState)
            // API.getDocumentTypes({COMP_CD: COMP_CD, CONSTITUTION: CONSTITUTION, CUST_TYPE: CUST_TYPE})
        },
        _optionsKey: "GetChargeTemplates",
        placeholder: "",
        width: 150,
        minWidth: 100,
        maxWidth: 250,
      },
      {
        accessor: "SUBMIT",
        columnName: "Submit",
        sequence: 3,
        alignment: "left",
        componentType: "editableCheckbox",
        placeholder: "",
        width: 100,
        minWidth: 150,
        maxWidth: 400,
      },
      {
        accessor: "DOCUMENT_NO",
        columnName: "Document No.",
        sequence: 4,
        alignment: "left",
        componentType: "editableTextField",
        placeholder: "",
        width: 200,
        minWidth: 100,
        maxWidth: 300,
        isReadOnly: true,
      },  
      {
        accessor: "VALID_TILL_DATE",
        columnName: "Valid till Date",
        sequence: 8,
        alignment: "left",
        componentType: "editableDatePicker",
        dateFormat: "dd/MM/yyyy",
        defaultValue: new Date(),
        // options: () => GeneralAPI.GetChargeTemplates(),
        // options: [{label: "label1", value: "value1"},{label: "label2", value: "value2"}],
        // _optionsKey: "GetChargeTemplates",
        // placeholder: "",
        width: 250,
        minWidth: 250,
        maxWidth: 400,
      },
      {
        accessor: "ENTERED_DATE",
        columnName: "Entered Date",
        sequence: 8,
        alignment: "left",
        componentType: "editableDatePicker",
        dateFormat: "dd/MM/yyyy",
        defaultValue: new Date(),
        placeholder: "",
        width: 250,
        minWidth: 250,
        maxWidth: 400,
      },
      {
        accessor: "BTN",
        columnName: "Action",
        componentType: "buttonRowCell",
        sequence: 9,
        buttonLabel: "Upload",
        isVisible: true,
        width: 140,
        minWidth: 140,
        maxWidth: 200,
        __EDIT__: { isVisible: true },
      },
      {
        columnName: "",
        componentType: "deleteRowCell",
        accessor: "SPECIAL_AMOUNT",
        sequence: 10,
        buttonLabel: "Special Amount",
        isVisible: true,
        width: 140,
        minWidth: 140,
        maxWidth: 200,
        // __EDIT__: { isVisible: true },
        // __VIEW__: { isVisible: true },
        // __NEW__: { isVisible: true },
      },
    ],
  };

export const IdtpChargeConfigGridMetaData: GridMetaDataType = {
    gridConfig: {
        dense: true,
        gridLabel: "Documents",
        rowIdColumn: "SR_NO",
        defaultColumnConfig: {
            width: 400,
            maxWidth: 450,
            minWidth: 300,
        },
        allowColumnReordering: true,
        disableSorting: false,
        hideHeader: false,
        disableGroupBy: true,
        enablePagination: true,
        pageSizes: [15, 25, 50],
        defaultPageSize: 15,
        containerHeight: {
            min: "68vh",
            max: "68vh",
        },
        allowFilter: false,
        allowColumnHiding: false,
        allowRowSelection: false,
        isCusrsorFocused: true,
        hiddenFlag: "_hidden",
    },
    filters: [],
    columns: [
        {
            accessor: "id",
            columnName: "Sr.No.",
            sequence: 1,
            alignment: "rigth",
            componentType: "default",
            width: 70,
            minWidth: 60,
            maxWidth: 120,
            isAutoSequence: true,
        },
        {
            accessor: "DOCUMENT",
            columnName: "Document*",
            sequence: 2,
            alignment: "left",
            componentType: "default",
            placeholder: "",
            width: 150,
            minWidth: 100,
            maxWidth: 250,
        },
        {
            accessor: "SUBMIT",
            columnName: "Submit",
            sequence: 3,
            alignment: "left",
            componentType: "editableCheckbox",
            placeholder: "",
            width: 100,
            minWidth: 150,
            maxWidth: 400,
        },
        {
            accessor: "DOCUMENT_NO",
            columnName: "Document No.",
            sequence: 4,
            alignment: "left",
            componentType: "editableTextField",
            placeholder: "",
            width: 200,
            minWidth: 100,
            maxWidth: 300,
            isReadOnly: true,
        },

        {
            accessor: "VALID_TILL_DATE",
            columnName: "Valid Till Date",
            sequence: 8,
            alignment: "left",
            componentType: "editableSelect",
            // options: () => GeneralAPI.GetChargeTemplates(),
            // _optionsKey: "GetChargeTemplates",
            placeholder: "",
            width: 170,
            minWidth: 80,
            maxWidth: 200,
        },
        {
            accessor: "ENTERED_DATE",
            columnName: "Entered Date",
            sequence: 8,
            alignment: "left",
            componentType: "editableSelect",
            // options: () => GeneralAPI.GetChargeTemplates(),
            // _optionsKey: "GetChargeTemplates",
            placeholder: "",
            width: 170,
            minWidth: 80,
            maxWidth: 200,
        },
        // {
        //     accessor: "VAT_PERC",
        //     columnName: "VAT Percentage",
        //     sequence: 8,
        //     alignment: "left",
        //     componentType: "editableTextField",
        //     placeholder: "",
        //     width: 140,
        //     minWidth: 80,
        //     maxWidth: 200,
        // },
        {
            columnName: "Action",
            componentType: "deleteRowCell",
            accessor: "_hidden",
            sequence: 12,
        },
        {
            columnName: "",
            componentType: "buttonRowCell",
            accessor: "SPECIAL_AMOUNT",
            sequence: 11,
            buttonLabel: "Special Amount",
            isVisible: true,
            // __EDIT__: { isVisible: true },
          },
    ],
};