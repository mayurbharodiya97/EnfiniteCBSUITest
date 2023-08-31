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
                componentType: "autocomplete",
            },
            options: () => API.getPMISCData("CKYC_RELAT_PERS"),
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
            name: "REF_RELATION",
            label: "RefType",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            options: () => API.getPMISCData("REF_RELATION"),
            _optionsKey: "refRelatedType",
            placeholder: "",
            type: "text",
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
                componentType: "textField",
            },
            name: "REF_CUST_ID",
            label: "RefCustID",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FIRST_NAME",
            label: "FirstName",
            placeholder: "First Name",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "MiddleName",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "LastName",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CKYC_NO",
            label: "CkycNo",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REF_NAME",
            label: "RefName",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },



        {
            render:  {
                componentType: "Divider",
                sequence: 20,
            },
            dividerText: "PoIOfRelatedPerson",
            name: "PoIOfRelatedPersonDivider",
            label: "PoIOfRelatedPersonDivider"
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PAN",
            label: "PAN",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DRIVING_LIC_NO",
            label: "DrivingLicNo",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DRIVING_LIC_EXP_DT",
            label: "DrivingLicExpDt",
            // required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "VOTER_ID",
            label: "VoterId",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PASSPORT_NO",
            label: "PassportNo",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "PASSPORT_EXP_DT",
            label: "PassportExpDt",
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
            name: "NREGA_JOB_CARD2",
            label: "NREGAJobCard",
            placeholder: "",
            type: "text",
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
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },



        {
            render:  {
                componentType: "Divider",
                sequence: 20,
            },
            dividerText: "AttesDetailsIPVBy",
            name: "AttesDetailsIPVByDivider",
            label: "AttesDetailsIPVByDivider"
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "DOC_RECEIVED",
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
            name: "EMP_CODE",
            label: "EmpCode",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_NAME",
            label: "EmpName",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_DESIGNATION",
            label: "EmpDesig",
            placeholder: "",
            type: "text",
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
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Org_Name",
            label: "OrgName",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Org_Code",
            label: "OrgCode",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DEC_PLACE",
            label: "DecPlace",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DEC_DATE",
            label: "DecDate",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
    ]
}
export const related_person_poi_detail_data = {
    form: {
        name: "related_person_poi_details_form",
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
            name: "PAN",
            label: "PAN",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DRIVING_LIC_NO",
            label: "Driving Lic. No.",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 4, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DRIVING_LIC_EXP_DT",
            label: "Driving Lic.Exp.Dt.",
            format: "dd/MM/yyyy",
            // required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "VOTER_ID",
            label: "Voter ID",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PASSPORT_NO",
            label: "Passport No.",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "PASSPORT_EXP_DT",
            label: "Passport Exp.Dt.",
            format: "dd/MM/yyyy",
            // required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "UNIQUE_ID",
            label: "Unique ID",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "NREGA_JOB_CARD2",
            label: "NREGA Job Card",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OTHER_DOC",
            label: "Other Doc",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OTHER_DOC_NO",
            label: "Other Doc No.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        }
    ]
}
export const related_person_attestation_detail_meta_data = {
    form: {
        name: "related_person_attestation_details_form",
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
                componentType: "select",
            },
            name: "DOC_RECEIVED",
            label: "Doc Received",
            options: () => API.getPMISCData("CKYC_RCVDOCTYPE"),
            _optionsKey: "kycDocReceivedType",
            placeholder: "",
            required: true,
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            options: () => API.getPMISCData("CKYC_RISK_CATEG"),
            _optionsKey: "kycRiskCateg",
            name: "RISK_CATEG",
            label: "Risk Category",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "IPV_FLAG",
            label: "IPV Flag",
            placeholder: "",
            required: true,
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "IPV_DATE",
            label: "IPV Date",
            format: "dd/MM/yyyy",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_CODE",
            label: "Emp. Code",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_NAME",
            label: "Emp. Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_DESIGNATION",
            label: "Emp. Desig.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "IPV_BRANCH",
            label: "IPV Branch",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Org_Name",
            label: "Org. Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Org_Code",
            label: "Org. Code",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DEC_PLACE",
            label: "Dec. Place",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DEC_DATE",
            label: "Dec. Date",
            format: "dd/MM/yyyy",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
    ]
}
