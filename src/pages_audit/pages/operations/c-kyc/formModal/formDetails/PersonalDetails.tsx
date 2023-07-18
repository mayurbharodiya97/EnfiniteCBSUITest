import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Button, Divider, Skeleton, IconButton, Collapse } from '@mui/material';
import {styled} from "@mui/material/styles";
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import {GridMetaDataType} from "../../../../../../components/dataTableStatic/types"
import { GridWrapper } from 'components/dataTableStatic/gridWrapper'
import { 
    entity_detail_meta_data,
    personal_detail_father_data, 
    personal_detail_maiden_data, 
    personal_detail_mother_data, 
    personal_detail_prefix_data, 
    personal_document_details_data, 
    personal_other_detail_meta_data
} from './metadata/personaldetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TabStepper from '../TabStepper';

const PersonalDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, colTabValue, setColTabValue, tabsApiRes}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const PDFormRef = useRef<any>("")
  const PODFormRef = useRef<any>("")
  const [isNextLoading, setIsNextLoading] = useState(false)
  const [currentTabFormData, setCurrentTabFormData] = useState({personal_details: {}, personal_other_details: {}})
  const [isPDExpanded, setIsPDExpanded] = useState(true)
  const [isOtherPDExpanded, setIsOtherPDExpanded] = useState(false)
  const [isEDExpanded, setIsEDExpanded] = useState(false)
  const handlePDExpand = () => {
    setIsPDExpanded(!isPDExpanded)
  }
  const handleOtherPDExpand = () => {
    setIsOtherPDExpanded(!isOtherPDExpanded)
  }
  const handleEDExpand = () => {
    setIsEDExpanded(!isEDExpanded)
  }
const myGridRef = useRef<any>(null);

    // useEffect(() => {
    //     console.log("... personal details", isCustomerData)
    //     passDataFromPersonalDetails(isCustomerData)
    // }, [isCustomerData])
    const onSubmitPDHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
    ) => {
        setIsNextLoading(true)
        console.log("qweqweqwe", data)     
        if(data) {
            // setTabFormData(p => {
            //     return {
            //         ...p,
            //         "personal details": data
            //     }
            // })
            setCurrentTabFormData(tabFormData => ({...tabFormData, "personal_details": data}))
            console.log("aedaqedqdeqd 2",currentTabFormData)
            setIsNextLoading(false)
        }   
        endSubmit(true)
    }
    const onSubmitPODHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
    ) => {
        setIsNextLoading(true)
        console.log("qweqweqwe", data)     
        if(data) {
            // setTabFormData(p => {
            //     return {
            //         ...p,
            //         // "personal other details": data
            //     }
            // })
            setCurrentTabFormData(tabFormData => ({...tabFormData, "personal_other_details": data}))

            console.log("aedaqedqdeqd",currentTabFormData)
            setIsNextLoading(false)
        }   
        endSubmit(true)
    }
    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Personal Details {`(1/8)`}</Typography>
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
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Personal Details</Typography>
                    <IconButton onClick={handlePDExpand}>
                        {!isPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isPDExpanded}>
                {/* <Grid container item> */}
                    <Grid item>
                        <FormWrapper 
                            ref={PDFormRef}
                            onSubmitHandler={onSubmitPDHandler}
                            key={"new-form-in-kyc"}
                            metaData={personal_detail_prefix_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                            displayMode={"new"}
                            controlsAtBottom={false}
                        >
                            {/* {({isSubmitting, handleSubmit}) => {
                                console.log("isSubmitting, handleSubmit", isSubmitting)
                                return <Button color="secondary" onClick={handleSubmit}>Save</Button>
                            }} */}
                            {/* <p>Controll Components</p> */}
                        </FormWrapper>
                    </Grid>                    
                {/* </Grid> */}

                {/* <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Maiden Name</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_maiden_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Father Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_father_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Mother Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_mother_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid> */}
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}

            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Other Personal Details</Typography>
                    <IconButton onClick={handleOtherPDExpand}>
                        {!isOtherPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isOtherPDExpanded}>
                {/* <Grid container item> */}
                    <Grid item>
                        <FormWrapper 
                            ref={PODFormRef}
                            key={"new-form-in-kyc"}
                            metaData={personal_other_detail_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                            onSubmitHandler={onSubmitPODHandler}
                        />
                    </Grid>                    
                {/* </Grid> */}
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="300px" width="100%"></Skeleton> : null}



            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        PDFormRef.current.handleSubmit(e, "save")
                        PODFormRef.current.handleSubmit(e, "save")
                    }}
                >Next</Button>
            </Grid>

            {(isCustomerData && false) ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Entity Details</Typography>
                    <IconButton onClick={handleEDExpand}>
                        {!isEDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isEDExpanded}>
                {/* <Grid container item> */}
                    <Grid item>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={entity_detail_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                {/* </Grid> */}

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Income Details</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_maiden_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Father Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_father_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Mother Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_mother_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
        </Grid>        
    )
}

export default PersonalDetails