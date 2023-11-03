import * as API from "../../../../api";

export const corporate_control_dtl_meta_data = {
    form: {
        name: "corporate_controling_person_details_form",
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "arrayField",
            },
            name: "RELATED_PERSON_DTL",
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
            _fields: [
                {
                    render: {
                        componentType: "select",
                    },
                    name: "RELATED_PERSON_TYPE",
                    label: "Type",
                    options: () => API.getPMISCData("CKYC_RELAT_PERS", null, "C"),
                    _optionsKey: "RelatedPersOptions",
                    placeholder: "",
                    required: true,
                    schemaValidation: {
                        type: "string",
                        rules: [
                        { name: "required", params: ["ThisFieldisrequired"] },
                        ],
                    },
                    // type: "text",
                    // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
                },
                {
                    render: {
                        componentType: "numberFormat",
                    },
                    name: "REF_CUST_ID",
                    label: "Ref.Cust.ID.",
                    required: true,
                    // placeholder: "First Name",
                    // type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
                    // dependentFields: ["DAILY_AMT"],
                    postValidationSetCrossFieldValues: (
                        field,
                        __,
                        ___,
                        dependentFieldsValues
                    ) => API.getControllCustInfo({COMP_CD: ___.companyID, BRANCH_CD: ___.user.branchCode, CUSTOMER_ID: field.value, FROM: "metadata"}),
                    runPostValidationHookAlways: true,
                },
                {
                    render: {
                        componentType: "textField",
                    },
                    name: "REF_ACCT_NM",
                    label: "Ref. Cust. Name",
                    required: true,
                    // placeholder: "First Name",
                    // type: "text",
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
                    dependentFields: ["REF_CUST_ID"],
                    isReadOnly: true,
                    shouldExclude(fieldData) {
                        if (fieldData?.value) {
                          return false;
                        } else {
                          return true;
                        }
                    },
                },
                {
                    render: {
                        componentType: "formbutton"
                    },
                    name: "SIGNATURE_BTN",
                    label: "Signature",
                    dependentFields: ["REF_CUST_ID"],
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
                },
                {
                    render: {
                        componentType: "formbutton"
                    },
                    name: "CUST_DTL_BTN",
                    label: "View Customer Details",
                    dependentFields: ["REF_CUST_ID"],
                    GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
                },
                // {
                //     render: {
                //         componentType: "formbutton",
                //     },
                //     name: "PID_DESCRIPTION",
                //     label: "Retrieve",
                //     endsIcon: "YoutubeSearchedFor",
                //     rotateIcon: "scale(1.5)",
                //     placeholder: "",
                //     type: "text",
                //     GridProps: {
                //         xs: 12,
                //         md: 1,
                //         sm: 1,
                //     },
                // },        
            ]
        }
    ]
}