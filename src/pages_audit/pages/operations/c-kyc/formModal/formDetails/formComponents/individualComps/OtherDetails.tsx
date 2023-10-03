import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Grid, Typography, Divider, Skeleton, Collapse, IconButton, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { other_details_meta_data } from '../../metadata/individual/otherdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { CkycContext } from '../../../../CkycContext';
import { useTranslation } from 'react-i18next';


const OtherDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
    const [isNextLoading, setIsNextLoading] = useState(false)
    const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext);
    const { t } = useTranslation();
    const OtherDTLFormRef = useRef<any>("")
    const [isOtherDetailsExpanded, setIsOtherDetailsExpanded] = useState(true)
    const handleOtherDetailsExpand = () => {
        setIsOtherDetailsExpanded(!isOtherDetailsExpanded)
    }

    const OtherDTLSubmitHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
    ) => {
        setIsNextLoading(true)
        console.log("qweqweqwe", data)     
        if(data) {
            // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))

            let newData = state?.formDatactx
            const commonData = {
                IsNewRow: true,
                COMP_CD: "",
                BRANCH_CD: "",
                REQ_FLAG: "",
                REQ_CD: "",
                SR_CD: ""
            }
            newData["OTHER_DTL"] = {...newData["OTHER_DTL"], ...data, ...commonData}
            handleFormDataonSavectx(newData)
            // handleColTabChangectx(5)
            // handleColTabChangectx(state?.colTabValuectx+1)

            // setIsNextLoading(false)
        }   
        setIsNextLoading(false)
        handleColTabChangectx(state?.colTabValuectx+1)
        endSubmit(true)
    }
    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx
                ? state?.formDatactx["OTHER_DTL"]
                    ? state?.formDatactx["OTHER_DTL"]
                    : {}
                : state?.retrieveFormDataApiRes
                    ? state?.retrieveFormDataApiRes["OTHER_DTL"]
                    : {}
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    return (
        <Grid container rowGap={3}>
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Details {`(5/8)`}</Typography> */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Details {`(5/8)`}</Typography>
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("OtherDetails")}</Typography>
                    <IconButton onClick={handleOtherDetailsExpand}>
                        {!isOtherDetailsExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isOtherDetailsExpanded}>                
                <Grid item>
                    <FormWrapper 
                        ref={OtherDTLFormRef}
                        onSubmitHandler={OtherDTLSubmitHandler}
                        key={"other-details-form-kyc"+initialVal}
                        metaData={other_details_meta_data as MetaDataType}
                        // initialValues={state?.formDatactx["OTHER_DTL"] ?? {}}
                        initialValues={initialVal}
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
                        // handleColTabChangectx(3)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        OtherDTLFormRef.current.handleSubmit(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>
        </Grid>        
    )
}

export default OtherDetails