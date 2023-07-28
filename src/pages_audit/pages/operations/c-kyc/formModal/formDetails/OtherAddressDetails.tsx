import { useContext, useEffect, useRef } from 'react';
import { Grid, Typography, Divider, Skeleton, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { 
    other_address_poa_contact_meta_data, 
    other_address_meta_data
} from './metadata/individual/otheraddressdetails';
import TabStepper from '../TabStepper';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../CkycContext';

const OtherAddressDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
    const { t } = useTranslation();
    const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext);
    const OtherAddDTLFormRef = useRef<any>("");
    const myGridRef = useRef<any>(null);
    const OtherAddDTLSubmitHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
    ) => {
        // setIsNextLoading(true)
        // console.log("qweqweqwe", data)     
        if(data) {
            // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))

            let newData = state?.formDatactx
            newData["OTHER_ADDRESS"] = {...newData["OTHER_ADDRESS"], ...data}
            handleFormDataonSavectx(newData)
            handleColTabChangectx(6)

            // setIsNextLoading(false)
        }   
        endSubmit(true)
    }
    return (
        <Grid container rowGap={3}>
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Address {`(6/8)`}</Typography>             */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Address {`(6/8)`}</Typography>
                </Grid> */}
                <Grid item xs>
                    <TabStepper />
                </Grid>
            </Grid>
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("OtherAddress")}</Typography>
                </Grid>

                {/* <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Current/Permanent/Overseas Address</Divider> */}
                <Grid item>
                    <FormWrapper 
                        ref={OtherAddDTLFormRef}
                        onSubmitHandler={OtherAddDTLSubmitHandler}
                        initialValues={state?.formDatactx["OTHER_ADDRESS"] ?? {}}
                        key={"new-form-in-kyc"}
                        metaData={other_address_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                {/* <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Contact</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_address_poa_contact_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid> */}
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        handleColTabChangectx(4)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        OtherAddDTLFormRef.current.handleSubmit(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>
        </Grid>        
    )
}

export default OtherAddressDetails