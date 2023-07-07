import React, { useState, useEffect, useRef } from 'react';
import { Grid, Typography, Divider, Skeleton, Collapse, IconButton } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { 
    other_details_annual_income_meta_data, 
    other_details_employment_info_meta_data, 
    other_details_exposure_info_meta_data, 
    other_details_personal_info_meta_data, 
    other_details_vehicle_info_meta_data
} from './metadata/otherdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const OtherDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
    const [isOtherDetailsExpanded, setIsOtherDetailsExpanded] = useState(false)
    const handleOtherDetailsExpand = () => {
        setIsOtherDetailsExpanded(!isOtherDetailsExpanded)
    }

    return (
        <Grid container rowGap={3}>
            <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Details</Typography>
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Other Details</Typography>
                    <IconButton onClick={handleOtherDetailsExpand}>
                        {!isOtherDetailsExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isOtherDetailsExpanded}>                
                <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Annual Income</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_annual_income_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Exposure Info./Risk Profile</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_exposure_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Personal Info.</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_personal_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Vehicle Info.</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_vehicle_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Employment Info.</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_employment_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    >
                    </FormWrapper>
                </Grid>
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
        </Grid>        
    )
}

export default OtherDetails