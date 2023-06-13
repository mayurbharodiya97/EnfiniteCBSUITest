import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Button, Divider, Skeleton } from '@mui/material';
import {styled} from "@mui/material/styles";
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';


export const related_person_detail_data = {
    form: {
        name: "related_person_detail_form",
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
            options: [
                {label: "Type 1", value: "type1"},
                {label: "Type 2", value: "type2"}
            ],
            name: "RELATED_PERSON_TYPE",
            label: "Type",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RELATED_PERSON_REF_TYPE",
            label: "Ref. Type",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs:6, sm:3},
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
                componentType: "textField",
            },
            name: "REF_CUST_ID",
            label: "Ref. Cust. ID",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs:6, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            required: true,
            type: "text",
            GridProps: {xs:6, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            required: true,
            type: "text",
            GridProps: {xs:6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            required: true,
            type: "text",
            GridProps: {xs:6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CKYC_NO",
            label: "CKYC NO.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm: 8, md: 8, lg:8},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "REF_NAME",
            label: "Ref. Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm: 8, md: 8, lg:8},
        }
    ]
}
export const related_person_poi_detail_data = {
    form: {
        name: "related_person_poi_detail_data",
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
                componentType: "textField",
            },
            name: "PAN",
            label: "PAN",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DRIVING_LIC_NO",
            label: "Driving Lic. No.",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DRIVING_LIC_EXP_DT",
            label: "Driving Lic.Exp.Dt.",
            // required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "VOTER_ID",
            label: "Voter ID",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PASSPORT_NO",
            label: "Passport No.",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "PASSPORT_EXP_DT",
            label: "Passport Exp.Dt.",
            // required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "UNIQUE_ID",
            label: "Unique ID",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "NREGA_JOB_CARD",
            label: "NREGA Job Card",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OTHER_DOC",
            label: "Other Doc",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OTHER_DOC_NO",
            label: "Other Doc No.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        }
    ]
}
export const related_person_attestation_detail_meta_data = {
    form: {
        name: "other_detail_form",
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
            name: "DOC_RECEIVED",
            label: "Doc Received",
            placeholder: "",
            required: true,
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RICK_CATEGORY",
            label: "Risk Category",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "IPV_FLAG",
            label: "IPV Flag",
            placeholder: "",
            required: true,
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "IPV_DATE",
            label: "IPV Date",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_CODE",
            label: "Emp. Code",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_NAME",
            label: "Emp. Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMP_DESIGNATION",
            label: "Emp. Desig.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "IPV_BRANCH",
            label: "IPV Branch",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Org_Name",
            label: "Org. Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "Org_Code",
            label: "Org. Code",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DEC_PLACE",
            label: "Dec. Place",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DEC_DATE",
            label: "Dec. Date",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
    ]
}

const RelatedPersonDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
const myGridRef = useRef<any>(null);

    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography variant={"h6"}>Personal Details</Typography> */}
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Details of Related Person</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={related_person_detail_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Proof of Identity [PoI] of Related Person</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={related_person_poi_detail_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Attestation Details [IPV-Identity Proof Verified By]</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={related_person_attestation_detail_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
        </Grid>        
    )
}

export default RelatedPersonDetails