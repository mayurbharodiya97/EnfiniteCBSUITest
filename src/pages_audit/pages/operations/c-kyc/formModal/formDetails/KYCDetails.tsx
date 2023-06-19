import { Grid, Typography, Divider, Skeleton } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';

export const proof_of_identity_meta_data = {
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
                componentType: "select",
            },
            name: "FORM_NO",
            label: "Form 60/61",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
            options: [
                {label: "Yes", value: "Yes"},
                {label: "No", value: "No"},
            ],
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
            name: "UID_AADHAAR",
            label: "UID(Aadhaar)",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "VOTER_ID",
            label: "Voter Id",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
          render: {
              componentType: "select",
          },
          name: "EXPLICIT_TDS",
          label: "Explicit TDS",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
          options: [
              {label: "Yes", value: "Yes"},
              {label: "No", value: "No"},
          ],
        },
        {
          render: {
              componentType: "textField",
          },
          name: "NREGA",
          label: "NREGA",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
        },
        {
          render: {
              componentType: "textField",
          },
          name: "OTHER_POI",
          label: "Other[PoI]",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
        },
        {
          render: {
              componentType: "textField",
          },
          name: "POI_NO",
          label: "PoI No.",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
        },
    ]
}
export const proof_of_identity_passport_details_meta_data = {
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
            name: "PASSPORT_NO",
            label: "No.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "AUTHO",
            label: "Autho.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "ISSUE_DATE",
          label: "Issue Date",
          required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 6, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "EXPIRY_Date",
          label: "Expiry Date",
          required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 6, sm:3},
      },
    ]
}
export const proof_of_identity_driving_license_details_meta_data = {
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
            name: "PASSPORT_NO",
            label: "No.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "AUTHO",
            label: "Autho.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "ISSUE_DATE",
          label: "Issue Date",
          required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 6, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "EXPIRY_Date",
          label: "Expiry Date",
          required: true,
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 6, sm:3},
      },
    ]
}

export const proof_of_address_meta_data = {
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
              componentType: "select",
          },
          name: "ADDRESS_TYPE",
          label: "Address Type",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
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
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LINE2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LINE3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "AREA",
          label: "Area",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
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
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "CITY",
          label: "City*",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "DISTRICT",
          label: "District",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE",
          label: "State",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY",
          label: "Country",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_UT_CODE",
          label: "State/U.T(Union Territories) Code",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ISO_COUNTRY_CODE",
          label: "ISO-3166 Country Code of Residence",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "PROOF_OF_ADDRESS",
          label: "Proof of Add.",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "OTHERS_POA",
          label: "Others[PoA]",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
  ]
}
export const proof_of_local_address_meta_data = {
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
        render: { componentType: "checkbox", group: 0 },
        name: "SAME_AS_PERMANENT_ADD",
        sequence: 9,
        type: "text",
        label: "Same As Permanent Address",
        // isReadOnly: true,
        // placeholder: "Allowed Release",
        GridProps: { xs: 12, md: 3, sm: 3 },
      },
      {
          render: {
              componentType: "select",
          },
          name: "Local_ADDRESS_TYPE",
          label: "Local Address Type",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
          options: [
              {label: "Local Address Type1", value: "Local Address Type1"},
              {label: "Local Address Type2", value: "Local Address Type2"},
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
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LINE2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LINE3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "AREA",
          label: "Area",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
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
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "CITY",
          label: "City*",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "DISTRICT",
          label: "District",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE",
          label: "State",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY",
          label: "Country",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_UT_CODE",
          label: "State/U.T(Union Territories) Code",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ISO_COUNTRY_CODE",
          label: "ISO-3166 Country Code of Residence",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "PROOF_OF_ADDRESS",
          label: "Proof of Add.",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
  ]
}
export const proof_of_address_contact_meta_data = {
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
          name: "PHONE_o",
          label: "Phone(O)",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "PHONE_R",
          label: "Phone(R)",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "MOBILE_NO",
          label: "Mobile No.",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "FAX",
          label: "Fax",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "EMAIL_ID",
          label: "Email ID",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
  ]
}

const KYCDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  //  const myGridRef = useRef<any>(null);

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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>KYC Details</Typography>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Proof of Identity [PoI]</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={proof_of_identity_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Passport Details</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={proof_of_identity_passport_details_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Driving License Details</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={proof_of_identity_driving_license_details_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}

            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Proof of Address [PoA]</Typography>
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Current/Permanent/Overseas Address</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={proof_of_address_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Correspondence/Local Address</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={proof_of_local_address_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Contact</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={proof_of_address_contact_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
        </Grid>        
    )
}

export default KYCDetails