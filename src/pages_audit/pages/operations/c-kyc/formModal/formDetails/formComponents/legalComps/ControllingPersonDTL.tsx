import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Grid, Typography, Divider, Skeleton, IconButton, Collapse, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';
import * as API from "../../../../api";
import { corporate_control_dtl_meta_data } from '../../metadata/legal/legal_corporate_control_dtl_meta_data';
// import { format } from 'date-fns';
import { AuthContext } from "pages_audit/auth";

const ControllingPersonDTL = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx} = useContext(CkycContext)
  const formRef = useRef<any>("")
  const [isNextLoading, setIsNextLoading] = useState(false)
  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
   ) => {
        setIsNextLoading(true)
        // console.log("qweqweqwe", data)     
        if(data && !hasError) {
            let newData = state?.formDatactx
            const commonData = {
                IsNewRow: true,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                REQ_FLAG: "F",
                REQ_CD: state?.req_cd_ctx,
                // SR_CD: "3",
                CONFIRMED: "N",
                ENT_COMP_CD: authState?.companyID ?? "",
                ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
                ACTIVE: "Y"
            }
            let newFormatRelPerDtl:any = []
            if(data && data.RELETED_PERSON_DTL) {
                newFormatRelPerDtl = data?.RELETED_PERSON_DTL?.map((el, i) => {
                    return {...el, ...commonData, SR_CD: i+1}
                })
            }

            // newData["RELATED_PERSON_DTL"] = {...newData["RELATED_PERSON_DTL"], ...data, ...commonData}
            newData["RELATED_PERSON_DTL"] = [...newFormatRelPerDtl]
            handleFormDataonSavectx(newData)
            // handleColTabChangectx(4)
            handleColTabChangectx(state?.colTabValuectx+1)
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            // setIsNextLoading(false)
        } else {
            handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
        }
        setIsNextLoading(false)
        endSubmit(true)
   }
  const [isFormExpanded, setIsFormExpanded] = useState(true)
  const handleFormExpand = () => {
    setIsFormExpanded(!isFormExpanded)
  }

const myGridRef = useRef<any>(null);
    // const initialVal = useMemo(() => {
    //     return state?.isFreshEntryctx
    //             ? state?.formDatactx["CONTROLLING_PERSON_DETAIL"]
    //                 ? state?.formDatactx["CONTROLLING_PERSON_DETAIL"]
    //                 : {}
    //             : state?.retrieveFormDataApiRes
    //                 ? state?.retrieveFormDataApiRes["CONTROLLING_PERSON_DETAIL"]
    //                 : {}
    // }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])
    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx
                ? state?.formDatactx["RELATED_PERSON_DTL"]
                    ? {RELATED_PERSON_DTL: state?.formDatactx["RELATED_PERSON_DTL"]}
                    : {RELATED_PERSON_DTL: [{}]}
                : state?.retrieveFormDataApiRes
                    ? {RELATED_PERSON_DTL: state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"]}
                    : {}
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    return (
        <Grid container rowGap={3}>
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Declaration Details {`(3/8)`}</Typography>             */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Declaration Details {`(3/8)`}</Typography>
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("ControllingPersonDTL")}</Typography>
                    <IconButton onClick={handleFormExpand}>
                        {!isFormExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>

                <Collapse in={isFormExpanded}>
                <Grid item>
                    <FormWrapper 
                        ref={formRef}
                        onSubmitHandler={onSubmitHandler}
                        // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                        initialValues={initialVal}
                        key={"controlling-person-form-kyc"+ initialVal}
                        metaData={corporate_control_dtl_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}

            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        // handleColTabChangectx(1)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        formRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>
        </Grid>        
    )
}

export default ControllingPersonDTL