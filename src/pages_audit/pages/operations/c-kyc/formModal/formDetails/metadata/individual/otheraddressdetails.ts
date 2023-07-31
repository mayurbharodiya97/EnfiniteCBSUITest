  export const other_address_poa_meta_data = {
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
            name: "ADDRESS_TYPE",
            label: "Address Type",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
            options: [
                {label: "Address Type1", value: "Address Type1"},
                {label: "Address Type2", value: "Address Type2"},
            ],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LINE1",
            label: "Line1",
            required: true,          
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LINE2",
            label: "Line2",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LINE3",
            label: "Line3",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "AREA",
            label: "Area",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
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
            GridProps: {xs: 4, sm:3},
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
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DISTRICT",
            label: "District",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "STATE",
            label: "State",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COUNTRY",
            label: "Country",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "STATE_UT_CODE",
            label: "State/U.T(Union Territories) Code",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ISO_COUNTRY_CODE",
            label: "ISO-3166 Country Code of Residence",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
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