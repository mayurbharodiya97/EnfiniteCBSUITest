import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Button, Divider, Skeleton, Collapse, IconButton } from '@mui/material';
import {styled} from "@mui/material/styles";
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { related_person_detail_data } from '../../metadata/individual/relatedpersondetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';

const RelatedPersonDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation();
  const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext);
  const RelPersonFormRef = useRef<any>("")
  const [isRelatedPDExpanded, setIsRelatedPDExpanded] = useState(true)
  const handleRelatedPDExpand = () => {
    setIsRelatedPDExpanded(!isRelatedPDExpanded)
  }
const myGridRef = useRef<any>(null);

    const RelPersonSubmitHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
    ) => {
        // setIsNextLoading(true)
        console.log("qweqweqwe", data)     
        if(data) {
            let newData = state?.formDatactx
            const commonData = {
                IsNewRow: true,
                COMP_CD: "",
                BRANCH_CD: "",
                REQ_FLAG: "",
                REQ_CD: "",
                SR_CD: ""
            }
            newData["RELATED_PERSON_DTL"] = {...newData["RELATED_PERSON_DTL"], ...data, ...commonData}
            handleFormDataonSavectx(newData)
            // handleColTabChangectx(4)
            handleColTabChangectx(state?.colTabValuectx+1)
            // setIsNextLoading(false)
        }   
        endSubmit(true)
    }
    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx
                ? state?.formDatactx["RELATED_PERSON_DTL"]
                    ? state?.formDatactx["RELATED_PERSON_DTL"]
                    : {}
                : state?.retrieveFormDataApiRes
                    ? state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"]
                    : {}
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Details of Related Person {`(4/8)`}</Typography> */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Details of Related Person {`(4/8)`}</Typography>
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("DetailsOfRelatedPerson")}</Typography>
                    <IconButton onClick={handleRelatedPDExpand}>
                        {!isRelatedPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isRelatedPDExpanded}>
                    <Grid item>
                        <FormWrapper 
                            ref={RelPersonFormRef}
                            onSubmitHandler={RelPersonSubmitHandler}
                            // initialValues={state?.formDatactx["RELATED_PERSON_DTL"] ?? {}}
                            initialValues={initialVal}
                            key={"new-form-in-kyc"}
                            metaData={related_person_detail_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        // handleColTabChangectx(2)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        RelPersonFormRef.current.handleSubmit(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>
        </Grid>        
    )
}

export default RelatedPersonDetails