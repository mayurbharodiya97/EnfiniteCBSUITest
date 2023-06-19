import { useEffect, useRef } from 'react';
import { Grid, Typography, Divider, Skeleton } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';


const declaration_meta_data = {
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
          name: "DECLARATION_RECEIVED",
          label: "Declaration Received",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
          options: [
              {label: "YES", value: "yes"},
              {label: "NO", value: "no"},
          ],
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "DECLARATION_RECEIVED_DATE",
        label: "Declaration Received Date",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "GIIN",
          label: "GIIN",
          required: true,          
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "DATE_OF_INCORPORATION",
        label: "Date of Incorporation",
        // placeholder: "",
        // type: "datePicker",
        GridProps: {xs: 6, sm:3},
      },      
      {
          render: {
              componentType: "textField",
          },
          name: "PLACE_OF_INCORPORATION",
          label: "Place of Incorporation",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "TIN",
          label: "TIN",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY_OF_INCORPORATION",
          label: "Country of Incorporation",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "TIN_ISSUING_COUNTRY",
          label: "TIN Issuing Country",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
  ]
}

const DeclarationDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
const myGridRef = useRef<any>(null);

    return (
        <Grid container rowGap={3}>
            {/* <Typography variant={"h6"}>Declaration Details</Typography> */}            
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Declaration Details</Typography>
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>FATCA/CRS Details</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={declaration_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
        </Grid>        
    )
}

export default DeclarationDetails