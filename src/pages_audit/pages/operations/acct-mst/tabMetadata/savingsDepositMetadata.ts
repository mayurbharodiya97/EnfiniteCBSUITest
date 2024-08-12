import * as API from "../api";

export const savingsDeposit_metadata = {
    form: {
        name: "savingsDeposit_tab_form",
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
                componentType: "divider",
            },
            name: "savingsdivider_ignoreField",
            label: "A/c Belongs to Director",
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "DAY_BOOK_GRP_CD",
            label: "Name",
            placeholder: "",
            // defaultValue: "N",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            options: () => API.getAdvDirectorNameTypeOP({A_ROLE_IND: "D"}),
            _optionsKey: "directorNmSavingsOp",
        },
        {
            render: {
                componentType: "textField"
            },
            name: "DAY_BOOK_REVRS_GRP_CD",
            label: "Relationship",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "PATH_SIGN",
            label: "Nature of Interest",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "INST_NO",
            label: "Chq. Sign Autho",
            placeholder: "",
            options: (dependentValue, formState, _, authState) => API.getCheqSignAuthoTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
            _optionsKey: "chqSignAuthoSavingsOp",
            // defaultValue: "N",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },

        {
            render: {
                componentType: "autocomplete",
            },
            name: "CATEG_CD",
            label: "Category",
            options: (dependentValue, formState, _, authState) => API.getCategoryTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "categSavingsOp",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "INT_RATE",
            label: "Interest (%)",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "CLASS_CD",
            label: "Risk Category",
            options: (dependentValue, formState, _, authState) => API.getRiskCategTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "riskCategSavingsOp", 
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "AGENT_CD",
            label: "Agent",
            options: (dependentValue, formState, _, authState) => API.getAgentTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "agentSavingsOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "TYPE_CD",
            label: "Cheque Book",
            options: [
                {label: "", value: ""}
            ], //api 
            // _optionsKey: "npaReasonTermLoanOp",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "INST_DUE_DT",
            label: "Pigmy Due Date",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "AGAINST_CLEARING",
            label: "Against Clearing",
            options: [
                {label: "Allow", value: "Y"},
                {label: "Not Allow", value: "N"},
                {label: "As per Type", value: "T"}
            ],
            // _optionsKey: "npaReasonTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "LST_INT_COMPUTE_DT",
            label: "Last Int. Applied Dt.",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "checkbox"
            },
            name: "INT_SKIP_FLAG",
            label: "Interest Skip",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",//come back
            },
            name: "INT_SKIP_REASON_TRAN_CD",
            label: "Interest Skip Reason",
            options: (dependentValue, formState, _, authState) => API.getIntSkipReasonTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
            _optionsKey: "skipReasonSavingsOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
    ],
}