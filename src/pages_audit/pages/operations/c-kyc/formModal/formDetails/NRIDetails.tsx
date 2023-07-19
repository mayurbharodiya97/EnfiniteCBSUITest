import React from "react"
import { Grid, Skeleton, Typography } from "@mui/material"
import FormWrapper, {MetaDataType} from "components/dyanmicForm"
import { nri_detail_meta_data } from "./metadata/individual/nridetails"
import TabStepper from "../TabStepper"

const NRIDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, colTabValue, setColTabValue, tabsApiRes}) => {
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
                    <TabStepper currentTab={colTabValue} setColTabValue={setColTabValue} />
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>NRI Details</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={nri_detail_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
        </Grid>
    )
}

export default NRIDetails