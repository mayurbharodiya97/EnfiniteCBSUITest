import * as API from "../api";

export const locker_tab_metadata = {
    form: {
        name: "locker_tab_form",
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
                spacing: 0.5,
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
            render: {
                componentType: "Divider",
            },
            dividerText: "Locker Detail",
            name: "savingsdivider_ignoreField",
            label: ""
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "DAY_BOOK_GRP_CD",
            label: "Locker Type",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            options: [
                {label: "", value: ""}
            ],
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "CATEG_CD",
            label: "Category",
            options: (dependentValue, formState, _, authState) => API.getCategoryTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "categLockerOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "textField"
            },
            name: "lf_no",
            label: "Locker No.",
            type: "text",
            maxLength: 8,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker"
            },
            name: "OP_DATE",
            label: "Op. Date",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LOCKER_KEY_NO",
            label: "Loc. Key No.",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker"
            },
            name: "INST_DUE_DT",
            label: "Due Date",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "PATH_SIGN",
            label: "Karar No.",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "INT_SKIP_FLAG",
            label: "Key Emboss",
            options: [], 
            _optionsKey: "keyEmbossLockerOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "TYPE_CD",
            label: "Rent[Y/N]",
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"}
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker"
            },
            name: "LAST_INST_DT",
            label: "Surr. Date",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
            componentType: "rateOfInt",
            },
            name: "INT_RATE",
            label: "Interest Rate",
            placeholder: "",
            type: "text",
            GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "CLASS_CD",
            label: "Risk Category",
            options: (dependentValue, formState, _, authState) => API.getRiskCategTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "riskCategLockerOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Locker Detail",
            name: "savingsdivider_ignoreField",
            label: ""
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REF_COMP_CD",
            label: "FD Type",
            placeholder: "COMP CD",
            maxLength: 4,
            GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:1}
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REF_BRANCH_CD",
            label: "",
            placeholder: "BRANCH CD",
            maxLength: 4,
            GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:1}
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REF_ACCT_TYPE",
            label: "",
            placeholder: "A/C Type",
            maxLength: 4,
            GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:1}
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REF_ACCT_CD",
            label: "",
            placeholder: "A/C No.",
            maxLength: 8,
            GridProps: {xs:12, sm:3, md: 2, lg: 2, xl:1.5}
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "DUE_AMT",
            label: "FD No.",
            type: "text",
            FormatProps: {
              allowNegative: true,
            },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "ACCT_NM",
            label: "",
            isReadOnly: true,
            GridProps: {xs:12, sm:3, md: 2, lg: 2, xl:1.5}
        }
    ],
}