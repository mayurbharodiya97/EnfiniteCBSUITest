import React, { useContext, useRef } from "react"
import { Button, Grid, Skeleton, Typography } from "@mui/material"
import FormWrapper, {MetaDataType} from "components/dyanmicForm"
import { nri_detail_meta_data } from "./metadata/individual/nridetails"
import TabStepper from "../TabStepper"
import { CkycContext } from "../../CkycContext"
import { useTranslation } from "react-i18next"

const NRIDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
    const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext);
    const { t } = useTranslation();
    const NRIDTLFormRef = useRef<any>("");
    const NRIDTLSubmitHandler = (
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
            newData["NRI_DTL"] = {...newData["NRI_DTL"], ...data}
            handleFormDataonSavectx(newData)
            handleColTabChangectx(7)

            // setIsNextLoading(false)
        }   
        endSubmit(true)
    }
    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>NRI Details {`(7/8)`}</Typography> */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>NRI Details {`(7/8)`}</Typography>
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("NRIDetails")}</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            ref={NRIDTLFormRef}
                            onSubmitHandler={NRIDTLSubmitHandler}
                            key={"new-form-in-kyc"}
                            metaData={nri_detail_meta_data as MetaDataType}
                            initialValues={state?.formDatactx["NRI_DTL"] ?? {}}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        handleColTabChangectx(5)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        NRIDTLFormRef.current.handleSubmit(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>
        </Grid>
    )
}

export default NRIDetails