import * as API from "../api";
import { getPMISCData } from "../../c-kyc/api";

export const fixDeposit_tab_metadata = {
    form: {
        name: "fixdeposit_tab_form",
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
            options: () => API.getAdvDirectorNameTypeOP({A_ROLE_IND: "D"}),
            _optionsKey: "directorNmFDOp",
            placeholder: "",
            type: "text",
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
            name: "DAY_BOOK_REVRS_GRP_CD",
            label: "Relationship",
            options: (dependentValue) => getPMISCData("RELATIONSHIP", dependentValue),
            _optionsKey: "relationshipFDOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
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
        // {
        //     render: {
        //         componentType: "autocomplete",
        //     },
        //     name: "INST_NO",
        //     label: "Chq. Sign Autho",
        //     placeholder: "",
        //     // defaultValue: "N",
        //     type: "text",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        //     options: [
        //         {label: "", value: ""}
        //     ],
        // },

        {
            render: {
                componentType: "autocomplete",
            },
            name: "CATEG_CD",
            label: "Category",
            options: (dependentValue, formState, _, authState) => API.getCategoryTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "categFDOp",
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
                componentType: "autocomplete",
            },
            name: "CLASS_CD",
            label: "Risk Category",
            options: (dependentValue, formState, _, authState) => API.getRiskCategTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "riskCategFDOp", 
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
            _optionsKey: "agentFDOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },


        {
            render: {
                componentType: "divider",
            },
            name: "fddtldivider_ignoreField",
            label: "FD Details",
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "PACKET_NO",
            label: "FD No.",
            type: "text",
            isReadOnly: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "INSTALLMENT_TYPE",
            label: "Period/Tenor",
            options: (dependentValue, formState, _, authState) => API.getAgentTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), //COME BACK
            _optionsKey: "agentFDOp",
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
        {//COME BACK
            render: {
                componentType: "textField"//come back
            },
            name: "INST_NO",
            label: "Lookupdisplay",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "INST_DUE_DT",
            label: "Maturity Date",
            isReadOnly: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
            componentType: "rateOfInt",
            },
            name: "INT_RATE",
            label: "Int. Rate(%)",
            placeholder: "",
            type: "text",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        },
        {//COME BACK
            render: {
                componentType: "autocomplete",
            },
            name: "INT_TYPE",
            label: "Int. Type",
            options: [
                {label: "Monthly", value: "M"},
                {label: "Quarterly", value: "Q"},
                {label: "Half-Yearly", value: "H"},
                {label: "Yearly", value: "Y"},
                {label: "On Expiry", value: "E"},
            ], 
            placeholder: "",
            type: "text",
            // required: true,
            // schemaValidation: {
            //     type: "string",
            //     rules: [
            //       { name: "required", params: ["ThisFieldisrequired"] },
            //     ],
            // },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {//come back
            render: {
                componentType: "datePicker",
            },
            name: "INST_RS",
            label: "Month Int.",
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
                componentType: "textField",
            },
            name: "REF_COMP_CD",
            label: "Credit A/C No.",
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
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            maxLength: 8,
            GridProps: {xs:12, sm:3, md: 2, lg: 2, xl:1.5}
        },
        
        {
            render: {
                componentType: "textField"
            },
            name: "REF_ACCT_NM",
            label: "Credit A/C Name",
            isReadOnly: true,
            GridProps: {xs:12, sm:3, md: 2, lg: 2, xl:1.5}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "ACTION_TAKEN_CD",
            label: "Mature Instruction",
            options: (dependentValue, formState, _, authState) => API.getAgentTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), //COME BACK
            _optionsKey: "agentFDOp",
            placeholder: "",
            type: "text",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },

        {
            render: {
                componentType: "divider",
            },
            name: "amountdivider_ignoreField",
            label: "Amount",
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "APPLIED_AMT",
            label: "Cash",
            type: "text",
            FormatProps: {
              allowNegative: true,
            },
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "SANCTIONED_AMT",
            label: "Transfer",
            type: "text",
            FormatProps: {
              allowNegative: true,
            },
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "TOTAL",//come back
            label: "Total",
            type: "text",
            FormatProps: {
              allowNegative: true,
            },
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "DUE_AMT",
            label: "Maturity",
            type: "text",
            FormatProps: {
              allowNegative: true,
            },
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
    ],
}