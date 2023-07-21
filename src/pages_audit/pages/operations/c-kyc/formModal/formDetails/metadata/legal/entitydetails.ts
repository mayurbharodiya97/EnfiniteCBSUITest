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