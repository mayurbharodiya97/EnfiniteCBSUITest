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
                componentType: "select",
            },
            name: "RELATED_PERSON_TYPE",
            label: "Type",
            options: () => API.getPMISCData("CKYC_RELAT_PERS"),
            _optionsKey: "RelatedPersOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs:4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REF_CUST_ID",
            label: "Ref.Cust.ID.",
            required: true,
            // placeholder: "First Name",
            type: "text",
            GridProps: {xs:4, sm:2},
            // dependentFields: ["DAILY_AMT"],
        },
         {
             render: {
                 componentType: "formbutton"
             },
             name: "Signature",
         },
         {
             render: {
                 componentType: "formbutton"
             },
             name: "Remove",
         },,
         {
             render: {
                 componentType: "formbutton"
             },
             name: "View Customer Details",
         },
      
    ]
}