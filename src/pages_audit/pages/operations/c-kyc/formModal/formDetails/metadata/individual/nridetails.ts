import * as API from "../../../../api";

export const nri_detail_meta_data = {
    form: {
        name: "nri_details_form",
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
            name: "Visa_Details",
            label: "VisaDetails",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Visa_Issue_By",
            label: "VisaIssueBy",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "Visa_Issue_Date",
            label: "VisaIssueDate",
            required: true,
            format: "dd/MM/yyyy",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "Visa_Expiry_Date",
            label: "VisaExpiryDate",
            required: true,
            format: "dd/MM/yyyy",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "Domestic_Risk",
            label: "DomesticRisk",
            options: () => API.getPMISCData("DOMESTIC_RISK"),
            _optionsKey: "DomesticRiskTypes",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "Country_Of_Risk",
            label: "CountryOfRisk",
            options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "CountryRiskTypes",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "Cross_Border_Risk",
            label: "CrossBorderRisk",
            options: () => API.getPMISCData("CROSS_BORDER"),
            _optionsKey: "CrossBorderRiskTypes",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "Visually_Impaired",
            label: "VisuallyImpaired",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"},
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
                componentType: "select",
            },
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"}
            ],
            name: "Customer_Evaluation_Required",
            label: "CustomerEvaluationRequired",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            options: (dependentValue, formState, _, authState) => API.getRelationshipManagerOptions(authState?.companyID),          
            _optionsKey: "RelManager",  
            name: "Relationship_Manager",
            label: "RelationshipManager",
            placeholder: "",
            type: "text",
            disabled: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        }        
    ]
}