import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Button, Divider, Skeleton, IconButton, Collapse } from '@mui/material';
import {styled} from "@mui/material/styles";
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import {GridMetaDataType} from "../../../../../../../../components/dataTableStatic/types"
import { GridWrapper } from 'components/dataTableStatic/gridWrapper'
import { 
    entity_detail_meta_data,
    personal_detail_father_data, 
    personal_detail_maiden_data, 
    personal_detail_mother_data, 
    personal_detail_prefix_data, 
    personal_document_details_data, 
    personal_other_detail_meta_data
} from '../../metadata/individual/personaldetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';
// import { format } from 'date-fns';

const EntityDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  const { t } = useTranslation();
  const PDFormRef = useRef<any>("")
  const PODFormRef = useRef<any>("")
  const NextBtnRef = useRef<any>("")
  const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx} = useContext(CkycContext)
  const [isNextLoading, setIsNextLoading] = useState(false)
  const [isPDExpanded, setIsPDExpanded] = useState(true)
  const [isOtherPDExpanded, setIsOtherPDExpanded] = useState(true)
  const [isEDExpanded, setIsEDExpanded] = useState(false)
  const handlePDExpand = () => {
    setIsPDExpanded(!isPDExpanded)
  }
  const handleOtherPDExpand = () => {
    setIsOtherPDExpanded(!isOtherPDExpanded)
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
        actionFlag,
        hasError
    ) => {
        // console.log("hasErrorhasError", hasError, data)
        setIsNextLoading(true)
        // console.log("qweqweqwesdcas", data, displayData, actionFlag)     
        if(data && !hasError) {

            let newData = state?.formDatactx
            const commonData = {
                IsNewRow: true,
                COMP_CD: "",
                BRANCH_CD: "",
                REQ_FLAG: "",
                REQ_CD: "",
                SR_CD: ""
            }
            newData["PERSONAL_DETAIL"] = {...newData["PERSONAL_DETAIL"], ...data, ...commonData}
            handleFormDataonSavectx(newData)
            handleStepStatusctx({status: "", coltabvalue: state?.colTabValuectx})
            PODFormRef.current.handleSubmitError(NextBtnRef.current, "save")
            // setIsNextLoading(false)
        } else {
            handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
        }
        setIsNextLoading(false)
        endSubmit(true)
    }
    const onSubmitPODHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag,
        hasError
    ) => {
        setIsNextLoading(true)
        // console.log("qweqweqwe", data)
        // if(Boolean(data["BIRTH_DT"])) {
        //     data["BIRTH_DT"] = format(new Date(data["BIRTH_DT"]), "dd-MMM-yyyy")
        // }     
        if(data && !hasError) {
            let newData = state?.formDatactx
            newData["PERSONAL_DETAIL"] = {...newData["PERSONAL_DETAIL"], ...data}
            handleFormDataonSavectx(newData)
            // handleColTabChangectx(1)
            handleColTabChangectx(state?.colTabValuectx+1)
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            // setIsNextLoading(false)
        } else handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
        setIsNextLoading(false)
        endSubmit(true)
    }

    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx
                ? state?.formDatactx["PERSONAL_DETAIL"]
                    ? state?.formDatactx["PERSONAL_DETAIL"]
                    : {}
                : state?.retrieveFormDataApiRes
                    ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                    : {}
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    // useEffect(() => {
    //     console.log("state?.isFreshEntryctx",state?.isFreshEntryctx)
    // }, [state?.isFreshEntryctx])
    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Personal Details {`(1/8)`}</Typography>
                </Grid> */}
            </Grid>
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("PersonalDetails")}</Typography>
                    <IconButton onClick={handlePDExpand}>
                        {!isPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isPDExpanded}>
                    <Grid item>
                        <FormWrapper 
                            ref={PDFormRef}
                            onSubmitHandler={onSubmitPDHandler}
                            // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                            initialValues={initialVal}
                            key={"pd-form-kyc"+ initialVal}
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("OtherPersonalDetails")}</Typography>
                    <IconButton onClick={handleOtherPDExpand}>
                        {!isOtherPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isOtherPDExpanded}>
                {/* <Grid container item> */}
                    <Grid item>
                        <FormWrapper 
                            ref={PODFormRef}
                            key={"pod-form-kyc"+ initialVal}
                            metaData={personal_other_detail_meta_data as MetaDataType}
                            // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                            initialValues={initialVal}
                            formStyle={{}}
                            hideHeader={true}
                            onSubmitHandler={onSubmitPODHandler}
                        />
                    </Grid>                    
                {/* </Grid> */}
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="300px" width="100%"></Skeleton> : null}



            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        NextBtnRef.current = e
                        PDFormRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>

        </Grid>        
    )
}

export default EntityDetails;