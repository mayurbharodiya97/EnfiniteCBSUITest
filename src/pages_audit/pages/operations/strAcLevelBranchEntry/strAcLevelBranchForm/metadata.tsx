import * as API from "../api";

export const strLevelBranchEditFormMetaData = {
    form: {
        name: "StrBranchLevelEntryForm",
        label: "Str Branch Level Entry",
        resetFieldOnUnmount: false,
        validationRun: "onBlur",
        submitAction: "home",
        render: {
            ordering: "auto",
            renderType: "simple",
            gridConfig: {
                item: {
                    xs: 12,
                    sm: 4,
                    md: 4,
                },
                container: {
                    direction: "row",
                    spacing: 1,
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
                componentType: "_accountNumber",
            },
            branchCodeMetadata: {
                name: "ACCT_BRANCH_CD",
                required: true,
                isReadOnly: true,
                GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
            },
            accountTypeMetadata: {
                name: "ACCT_TYPE",
                isReadOnly: true,
                GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
            },
            accountCodeMetadata: {
                name: "ACCT_CD",
                label: "ACNumber",
                placeholder: "",
                fullWidth: true,
                isReadOnly: true,
                GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
            },
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ACCT_NM",
            label: "Account_Name",
            type: "text",
            fullWidth: true,
            isReadOnly: true,
            GridProps: { xs: 12, sm: 5.7, md: 5.7, lg: 5.7, xl: 5.7 },
        },
        {
            render: {
                componentType: "hidden",
            },
            name: "DISABLE_SUSP_STATUS",
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "SUSP_DESC",
            label: "Suspicious Status",
            type: "text",
            fullWidth: true,
            required: true,

            options: () => {
                return API.getSuspStatusData();
            },
            _optionsKey: "getSuspStatusData",
            dependentFields: ["DISABLE_SUSP_STATUS"],
            isReadOnly: (fieldValue, dependentFields, formState) => {
                if (dependentFields?.DISABLE_SUSP_STATUS?.value === "Y") {
                    return false;
                } else {
                    return true;
                }
            },
            GridProps: { xs: 12, sm: 2.8, md: 2.8, lg: 2.8, xl: 2.8 },
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "REASON_DESC",
            label: "Suspicious Reasons",
            GridProps: { xs: 12, sm: 4.9, md: 4.9, lg: 4.9, xl: 4.9 },
            skipDefaultOption: true,
            options: (dependentValue, formState, _, authState) => {
                return API.getSuspReasonData({
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: authState?.user?.branchCode
                });
            },
            _optionsKey: "getSuspReasonData",
            dependentFields: ["DISABLE_SUSP_STATUS"],
            isReadOnly: (fieldValue, dependentFields, formState) => {
                if (dependentFields?.DISABLE_SUSP_STATUS?.value === "Y") {
                    return false;
                } else {
                    return true;
                }
            },
        },

        {
            render: {
                componentType: "amountField",
            },
            name: "TRAN_BAL",
            label: "WithdrawBalance",
            type: "text",
            fullWidth: true,
            isReadOnly: true,
            GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PAN_NO",
            label: "PAN",
            isReadOnly: true,
            GridProps: { xs: 12, sm: 2.1, md: 2.1, lg: 2.1, xl: 2.1 },
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REMARKS2",
            label: "Investigation Detail",
            type: "text",
            fullWidth: true,
            required: true,
            isReadOnly: true,
            GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REMARKS",
            label: "Remarks",
            type: "text",
            fullWidth: true,
            isReadOnly: true,
            GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
        },
    ],
};