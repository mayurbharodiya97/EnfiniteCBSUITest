export const company_info_meta_data = {
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
            format: "dd/MM/yyyy",
            type: "text",
            GridProps: {xs:4, sm:3},
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
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_REG_NO",
            label: "Reg.No.",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_SALES_TAX_NO",
            label: "Sales Tax No.",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_EXCISE_NO",
            label: "Excise No.",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_IT_NO",
            label: "IT No.",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_TAN_NO",
            label: "TAN No.",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMP_CIN_NO",
            label: "CIN No.",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
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
            GridProps: {xs:4, sm:3},
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
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "select",
            },
            name: "COMPANY_SIZE",
            label: "Size",
            options: [
                {label: "op1", value: "large"},
                {label: "op2 ", value: "medium"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
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
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "STAFF_STRENGTH",
            label: "Staff Strength",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CIBIL_SCORE",
            label: "CIBIL MSME Rank",
            required: true,
            // placeholder: "Prefix",
            type: "text",
            GridProps: {xs:4, sm:2},
        },
		
        {
            render: {
                componentType: "textField",
            },
            name: "SPECIALIZATION_REMARKS",
            label: "Specialization",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        
    ]
}