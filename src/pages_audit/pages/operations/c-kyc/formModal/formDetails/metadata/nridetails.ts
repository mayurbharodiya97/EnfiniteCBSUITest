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
            label: "Visa Details",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Visa_Issue_By",
            label: "Visa Issue By",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "Visa_Issue_Date",
            label: "Visa Issue Date",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "Visa_Expiry_Date",
            label: "Visa Expiry Date",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Domestic_Risk",
            label: "Domestic Risk",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Country_Of_Risk",
            label: "Country Of Risk",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Cross_Border_Risk",
            label: "Cross Border Risk",
            placeholder: "",
            type: "text",
            required: true,
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "Visually_Impaired",
            label: "Visually Impaired",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
            options: [
                {label: "type 1", value: "1"},
                {label: "type 2", value: "2"},
                {label: "type 3", value: "3"},
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
                {label: "category 1", value: "1"},
                {label: "category 2", value: "2"},
                {label: "category 3", value: "3"},
            ],
            name: "Customer_Evaluation_Required",
            label: "Customer Evaluation Required",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Relationship_Manager",
            label: "Relationship Manager",
            placeholder: "",
            type: "text",
            disabled: true,
            GridProps: {xs: 6, sm:3},
        }        
    ]
}