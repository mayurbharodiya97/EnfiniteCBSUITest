import * as API from "../api";
import { getPMISCData } from "../../c-kyc/api";

export const termLoan_metadata = {
    form: {
        name: "termLoan_tab_form",
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
            dividerText: "Recommended By",
            name: "recommendbydivider_ignoreField",
            label: ""
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "RECOMMENED_NM",
            label: "Name",
            placeholder: "",
            // defaultValue: "N",
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
            name: "SANCTIONED_BY",
            label: "Sanctioned By",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            options: [
                {label: "", value: ""}
            ],
        },
        {
            render: {
                componentType: "textField"
            },
            name: "RESOLUTION_NO",
            label: "Resolution No.",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },

        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Advances Belongs to Director",
            name: "Advancesdivider_ignoreField",
            label: ""
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "DAY_BOOK_GRP_CD",
            label: "Name",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            options: [
                {label: "", value: ""}
            ],
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
            name: "DAY_BOOK_REVRS_GRP_CD",
            label: "Relationship",
            options: (dependentValue) => getPMISCData("RELATIONSHIP", dependentValue),
            _optionsKey: "relationshipTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "PTS",
            label: "Segment / PTS",
            options: (dependentValue, formState, _, authState) => API.getSegmentPTSOp({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "ptsTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "textField",     
            },
            name: "RATING_CD",
            label: "Rating",
            isReadOnly: true,
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "PURPOSE_CD",
            label: "Purpose",
            options: (dependentValue, formState, _, authState) => API.getPurposeTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "purposeTermLoanOpishewfiwef",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "PARENT_GROUP",
            label: "Priority",
            options: (dependentValue, formState, _, authState) => API.getPrioritParentTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
            _optionsKey: "parPriorityTermLoanOp",
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
            name: "PRIO_CD",
            label: "",
            dependentFields: ["PARENT_GROUP"],
            options: (dependentValue, formState, _, authState) => API.getPrioritMainTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode, dependentValue:dependentValue}),
            _optionsKey: "mainPriorityTermLoanOp",
            disableCaching: true,
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
            name: "SUB_PRIO_CD",
            label: "Weaker",
            dependentFields: ["PRIO_CD"],
            options: (dependentValue, formState, _, authState) => API.getPriorityWeakerTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode, dependentValue:dependentValue}),
            _optionsKey: "weakerPrioTermLoanOp",
            disableCaching: true,
            // _optionsKey: "weakerTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PRIORITY_CD",
            label: "",
            isReadOnly: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "SECURITY_CD",
            label: "Security",
            options: (dependentValue, formState, _, authState) => API.getSecurityTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
            _optionsKey: "securityTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "NPA_CD",
            label: "NPA",
            options: (dependentValue, formState, _, authState) => API.getNPATypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
            _optionsKey: "npaTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "NPA_DT",
            label: "NPA Date",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "CATEG_CD",
            label: "Category",
            options: (dependentValue, formState, _, authState) => API.getCategoryTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "categTermLoanOp",
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
            name: "NPA_REASON",
            label: "Forcefully NPA Reason",
            options: (dependentValue) => getPMISCData("npa_reason"),
            _optionsKey: "npaReasonTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },

        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Loan Detail",
            name: "loanDTLdivider_ignoreField",
            label: ""
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "APPY_DT",
            label: "Application",
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
                componentType: "datePicker",
            },
            name: "SANCTION_DT",
            label: "Sanction",
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
                componentType: "datePicker",
            },
            name: "disbursement_dt",
            label: "Disbursement",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            shouldExclude:(initialValue,original,prevRows,nextRows)=>{
                const GPARAM155 = prevRows?.GPARAM155 
                if(Boolean(GPARAM155)) {
                    if(GPARAM155 === "Y") {
                        return true;
                    } else if(GPARAM155 === "N") {
                        return false;
                    }
                }
                return false;
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField"
            },
            name: "FILE_NO",
            label: "File No.",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "INSTALLMENT_TYPE",
            label: "Installment Type",
            options: [
                {label: "Daily", value: "D"},
                {label: "Monthly", value: "M"},
                {label: "Quarterly", value: "Q"},
                {label: "Half-Yearly", value: "H"},
                {label: "Yearly", value: "Y"},
                {label: "On Expiry", value: "E"},
            ],
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "textField"
            },
            name: "PACKET_NO",
            label: "Packet No.",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "textField"
            },
            name: "DESCRIPTION",
            label: "Description",
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
              componentType: "formbutton",
            },
            name: "landDTL_ignoreField",
            label: "Land Detail",
            placeholder: "",
            type: "text",
            GridProps: {lg: 1, xl:1},
        },

        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Amount",
            name: "amountdivider_ignoreField",
            label: ""
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "APPLIED_AMT",
            label: "Applied",
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
            // textFieldStyle: {
            //   "& .MuiInputLabel-formControl": {
            //     right: "0",
            //     left: "auto",
            //   },
            // },
            // isReadOnly: true,
            // dependentFields: ["SERVICE_TAX", "CHEQUE_TOTAL"],
            // runValidationOnDependentFieldsChange: true,
            // validate: (currentField, dependentFields, formState) => {
            //   if (
            //     Number(dependentFields.SERVICE_TAX.value) *
            //       Number(dependentFields.CHEQUE_TOTAL.value) >
            //     Number(currentField.value)
            //   ) {
            //     return "balance is less than service-charge";
            //   }
            //   return "";
            // },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "SANCTIONED_AMT",
            label: "Sanctioned",
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
            name: "LIMIT_AMOUNT",
            label: "Disbursed",
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
            shouldExclude:(initialValue,original,prevRows,nextRows)=>{
                const GPARAM155 = prevRows?.GPARAM155 
                if(Boolean(GPARAM155)) {
                    if(GPARAM155 === "Y") {
                        return true;
                    } else if(GPARAM155 === "N") {
                        return false;
                    }
                }
                return false;
            },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "TYPE_CD",
            label: "Type",
            options: [
                {label: "EMI", value: "1"},
                {label: "SIMPLE", value: "2"},
            ],
            // _optionsKey: "npaReasonTermLoanOp",
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
              componentType: "formbutton",
            },
            name: "ornamentDTL_ignoreField",
            label: "Ornament(s) Details",
            placeholder: "",
            type: "text",
            GridProps: {lg: 1, xl:1},
        },

        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Rates(%)",
            name: "ratesdivider_ignoreField",
            label: ""
        },
        {
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
            // _optionsKey: "npaReasonTermLoanOp",
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
            componentType: "rateOfInt",
            },
            name: "INT_RATE",
            label: "Interest",
            placeholder: "",
            type: "text",
            GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        },
        {
            render: {
            componentType: "rateOfInt",
            },
            name: "PENAL_RATE",
            label: "Penal",
            placeholder: "",
            type: "text",
            GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "RATE_WEF",
            label: "W.E.F.",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
            componentType: "rateOfInt",
            },
            name: "CR_INT",
            label: "Int. on Credit Balance",
            placeholder: "",
            type: "text",
            GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        },


        {
            render: {
                componentType: "textField"
            },
            name: "DOCKET_NO",
            label: "Docket No.",
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "NO_OF_LEAVES",
            label: "Insurance",
            options: [
                {label: "Bank", value: "0"},
                {label: "Waiver", value: "99999"}
            ],
            // _optionsKey: "npaReasonTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
              componentType: "formbutton",
            },
            name: "nxtDisburse_ignoreField",
            label: "Next Disbursement",
            placeholder: "",
            type: "text",
            GridProps: {lg: 1, xl:1},
        },
        {
            render: {
              componentType: "formbutton",
            },
            name: "vhcleDTL_ignoreField",
            label: "Vehicle Detail",
            placeholder: "",
            type: "text",
            GridProps: {lg: 1, xl:1},
        },
        {
            render: {
              componentType: "formbutton",
            },
            name: "machineryDTL_ignoreField",
            label: "Machinery Details",
            placeholder: "",
            type: "text",
            GridProps: {lg: 1, xl:1},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            name: "INST_NO",
            label: "No. of Installment",
            maxLength: 6, //5
            FormatProps: {
                isAllowed: (values) => {
                    if (values?.value?.length > 6) {
                    return false;
                    }
                    return true;
                },
            },
            validate: (columnValue) => {
                const PIN = columnValue.value
                if(Boolean(PIN) && PIN.length<6) {
                    return "Pin code should be of six digits"
                }
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "installment_ignoreField",
            label: "",
            options: [
                {label: "Month(s)", value: "M"},
                {label: "Quarter(s)", value: "Q"},
                {label: "Half-year(s)", value: "H"},
                {label: "Year(s)", value: "Y"},
                {label: "On Expire", value: "E"},
            ],
            placeholder: "",
            type: "text",
            isReadOnly: true,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "INT_SKIP_FLAG",
            label: "Int. Funded",
            options: [
                {label: "N/A", value: ""},
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"}
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
            name: "INS_START_DT",
            label: "Inst. Start",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            shouldExclude:(initialValue,original,prevRows,nextRows)=>{
                const GPARAM155 = prevRows?.GPARAM155 
                if(Boolean(GPARAM155)) {
                    if(GPARAM155 === "Y") {
                        return true;
                    } else if(GPARAM155 === "N") {
                        return false;
                    }
                }
                return false;
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "numberFormat",//come back
            },
            name: "INT_SKIP_REASON_TRAN_CD",
            label: "Moratorium Period(In Months)",
            isReadOnly: (fieldValue, dependentFields, formState) => API.isReadOnlyonParam320({formState}),
            maxLength: 6,
            FormatProps: {
                isAllowed: (values) => {
                    if (values?.value?.length > 6) {
                    return false;
                    }
                    return true;
                },
            },
            validate: (columnValue) => {
                const PIN = columnValue.value
                if(Boolean(PIN) && PIN.length<6) {
                    return "Pin code should be of six digits"
                }
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "INST_RS",
            label: "Installment Amt.",
            shouldExclude:(initialValue,original,prevRows,nextRows)=>{
                const GPARAM155 = prevRows?.GPARAM155 
                if(Boolean(GPARAM155)) {
                    if(GPARAM155 === "Y") {
                        return true;
                    } else if(GPARAM155 === "N") {
                        return false;
                    }
                }
                return false;
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "INST_DUE_DT",
            label: "Due Date",
            required: true,
            schemaValidation: {
                type: "string",
                rules: [
                  { name: "required", params: ["ThisFieldisrequired"] },
                ],
            },
            shouldExclude:(initialValue,original,prevRows,nextRows)=>{
                const GPARAM155 = prevRows?.GPARAM155 
                if(Boolean(GPARAM155)) {
                    if(GPARAM155 === "Y") {
                        return true;
                    } else if(GPARAM155 === "N") {
                        return false;
                    }
                }
                return false;
            },
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "AGENT_CD",
            label: "Agent",
            options: (dependentValue, formState, _, authState) => API.getAgentTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "agentTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
              componentType: "amountField",
            },
            name: "DUE_AMT",
            label: "Old Credit",
            type: "text",
            FormatProps: {
              allowNegative: true,
            },
            GridProps: {xs: 12, md: 2, sm: 2, lg: 2, xl: 2},
        },
        {
            render: {
                componentType: "rateOfInt",
            },
            name: "INSURANCE_EXPIRY_PANEL_RT",
            label: "Insurance Expiry Penal Rate",
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
            _optionsKey: "riskCategTermLoanOp", 
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "INDUSTRY_CD",
            label: "Industry",
            options: (dependentValue, formState, _, authState) => API.getIndustryTypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "industryTermLoanOp", 
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "RECRE_CD",
            label: "RECRE",
            options: (dependentValue, formState, _, authState) => API.getRECRETypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "RECRETermLoanOp", 
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "BUSINESS_CD",
            label: "Business",
            options: (dependentValue, formState, _, authState) => API.getBusinessypeOP({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}), 
            _optionsKey: "businessTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DATE_OF_COMMENCEMENT",
            label: "Commencement Date of Commercial Operation",
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
            name: "PRODUCTION_YES_NO",
            label: "Production Start",
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"}
            ], 
            // _optionsKey: "npaReasonTermLoanOp",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        },
    ],
}