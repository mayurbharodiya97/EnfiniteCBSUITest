import * as API from "../../../../api";
export const attestation_detail_meta_data = {
    form: {
        name: "attestation_details_form",
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
            name: "DOC_TYPE",
            label: "Type of Document Submitted",
            options: () => API.getPMISCData("CKYC_RCVDOCTYPE"),
            _optionsKey: "ckycDocTypes",
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
                {label: "Risk Category 1", value: "riskcat1"},
                {label: "Risk Category 2", value: "riskcat2"}
            ],
            name: "RISK_CATEGORY",
            label: "Risk Category",
            // required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"}
            ],
            name: "KYC_VERIFICATION_FLAG",
            label: "KYC Verification Flag",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_EMP_CODE",
            label: "KYC Verification Emp.Code",
            placeholder: "",
            required: true,
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_EMP_NAME",
            label: "KYC Verification Emp.Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_EMP_DESIGNATION",
            label: "KYC Verification Emp.Designation",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_BRANCH",
            label: "KYC Verification Branch",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_VERIFICATION_DATE",
            label: "KYC Verification Date",
            format: "dd/MM/yyyy",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ORG_CODE",
            label: "Organization Code",
            placeholder: "",
            required: true,
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ORG_NAME",
            label: "Organization Name",
            placeholder: "",
            required: true,
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PLACE_OF_DECLARATION",
            label: "Place of Declaration",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DATE_OF_DECLARATION",
            label: "Date of Declaration",
            format: "dd/MM/yyyy",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 4, sm:3},
        },
    ]
}