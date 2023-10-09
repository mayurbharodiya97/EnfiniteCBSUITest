import * as API from "../../../../api";

export const entity_detail_legal_meta_data = {
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
            name: "SURNAME",
            label: "Entity Name",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
        {
            render: {
                componentType: "select",
            },
            name: "TRADE_CD",
            label: "Occupation",
            options: (dependentValue, formState, _, authState) => API.getOccupationDTL(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "occupationOpdtl",
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
                componentType: "select",
            },
            name: "SUB_CUST_TYPE",
            label: "Sub Customer Type",
            options: () => API.getPMISCData("SUB_CUST_TYPE"),
            _optionsKey: "getSubCustTypeOpdtl",
            // placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "GROUP_CD",
            label: "Group",
            options: (dependentValue, formState, _, authState) => API.getCustomerGroupOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "GroupOptionsdtl",
            // placeholder: "Last Name",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "RATE_CD",
            label: "Rating",
            options: (dependentValue, formState, _, authState) => API.getRatingOpDTL(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "ratingOpdtl",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "BIRTH_DT",
            label: "Inception Date",
            placeholder: "",
            maxDate: new Date(),
            format: "dd/MM/yyyy",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "EXPLICIT_TDS",
            label: "Explicit TDS",
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"},
            ],
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
            name: "GSTIN",
            label: "GSTIN",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_REVIEW_DT",
            label: "KYC Revised Dt.",
            placeholder: "",
            format: "dd/MM/yyyy",
            maxDate: new Date(),
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "RISK_CATEG",
            label: "Risk Category",
            options: () => API.getPMISCData("CKYC_RISK_CATEG"),
            _optionsKey: "kycRiskCategOpdtl",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "NATIONALITY",
            label: "Registered in Country",
            options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "countryOptionsdtl",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "RESIDENCE_STATUS",
            label: "Resi. Status",
            options: () => API.getPMISCData("RESIDE_STATUS"),
            _optionsKey: "ResisdenceStatusdtl",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "US_GIIN",
            label: "GIIN",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "TIN",
            label: "TIN",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "TIN_ISSUING_COUNTRY",
            label: "TIN issuing Country",
            options: (dependentValue, formState, _, authState) => API.getCountryOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "TINIssuingCountriesdtl",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
		{
            render: {
                componentType: "select",
            },
            name: "PARENT_COMPANY",
            label: "Parent Company",
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },        		
		{
            render: {
                componentType: "textField",
            },
            name: "PARENT_COMP_NM",
            label: "Parent Company Name",            
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },        		
    ]
}