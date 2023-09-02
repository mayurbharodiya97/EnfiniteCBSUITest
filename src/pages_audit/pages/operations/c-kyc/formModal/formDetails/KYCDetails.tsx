import { useRef, useState, useEffect, useContext, useMemo } from 'react';
import { Grid, Typography, Divider, Skeleton, Collapse, IconButton, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { 
    kyc_proof_of_address_meta_data, 
    kyc_proof_of_identity_meta_data, 
} from './metadata/individual/kycdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { DocumentGridMetaData } from './metadata/individual/personaldetails';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../CkycContext';

const KYCDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  //  const myGridRef = useRef<any>(null);
   const { t } = useTranslation();
   const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext);
   const [isPoIExpanded, setIsPoIExpanded] = useState(true)
   const [isPoAExpanded, setIsPoAExpanded] = useState(true)
   const [isNextLoading, setIsNextLoading] = useState(false)
   const KyCPoIFormRef = useRef<any>("")
   const KyCPoAFormRef = useRef<any>("")
   const NextBtnRef = useRef<any>("")
  const [currentTabFormData, setCurrentTabFormData] = useState({proof_of_identity: {}, proof_of_address: {}})
 

  const [gridData, setGridData] = useState<any>([
    {
        SR_NO: "",
        document: "",
        Submit: "",
        Doc_No :"",
        valid_till_date: "",
        entered_date: ""
    },
    {
        SR_NO: "",
        document: "",
        Submit: "",
        Doc_No :"",
        valid_till_date: "",
        entered_date: ""
    },
  ]);

   const handlePoIExpand = () => {
    setIsPoIExpanded(!isPoIExpanded)
   }
   const handlePoAExpand = () => {
    setIsPoAExpanded(!isPoAExpanded)
   }

   const PoISubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
   ) => {
    // setIsNextLoading(true)
    console.log("qweqweqwe", data)     
    if(data) {
        setCurrentTabFormData(formData => ({...formData, "proof_of_identity": data }))
        let newData = state?.formDatactx
        newData["PERSONAL_DETAIL"] = {...newData["PERSONAL_DETAIL"], ...data}
        handleFormDataonSavectx(newData)

        KyCPoAFormRef.current.handleSubmit(NextBtnRef.current, "save")
    }   
    // endSubmit(true)
   }
   const PoASubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
   ) => {
    // setIsNextLoading(true)
    console.log("qweqweqwe", data)     
    if(data) {
        setCurrentTabFormData(formData => ({...formData, "proof_of_address": data }))

        let newData = state?.formDatactx
        newData["PERSONAL_DETAIL"] = {...newData["PERSONAL_DETAIL"], ...data}
        handleFormDataonSavectx(newData)
        handleColTabChangectx(2)

        // setIsNextLoading(false)
    }
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

//    useEffect(() => {
//     console.log("asdfweafdw",currentTabFormData)
//    }, [currentTabFormData])
    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography variant={"h6"}>Personal Details</Typography> */}         
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>KYC Details {`(2/8)`}</Typography> */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>KYC Details {`(2/8)`}</Typography>
                </Grid> */}
            </Grid>
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    {/* <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>KYC Details</Typography> */}
                    <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                        <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>{t("ProofOfIdentity")}</Typography>
                        <IconButton onClick={handlePoIExpand}>
                            {!isPoIExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                        </IconButton>
                    </Grid>
                </Grid>
                <Collapse
                    in={isPoIExpanded}>
                    <Grid item xs={12}>
                        <FormWrapper 
                            ref={KyCPoIFormRef}
                            onSubmitHandler={PoISubmitHandler}
                            // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                            initialValues={initialVal}
                            key={"new-form-in-kyc"}
                            metaData={kyc_proof_of_identity_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
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
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>{t("ProofOfAddress")}</Typography>
                    <IconButton onClick={handlePoAExpand}>
                        {!isPoAExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isPoAExpanded}>
                <Grid item>
                    <FormWrapper 
                        ref={KyCPoAFormRef}
                        onSubmitHandler={PoASubmitHandler}
                        // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                        initialValues={initialVal}
                        key={"new-form-in-kyc"}
                        metaData={kyc_proof_of_address_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}

            {(isCustomerData && false) ? 
            <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("Documents")}</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12} sx={{backgroundColor:"#eee"}}>
                        <GridWrapper
                            key={`idtpChargeConfigGrid`}
                            finalMetaData={DocumentGridMetaData as GridMetaDataType}
                            data={gridData}
                            setData={setGridData}
                            // loading={isLoading || isFetching}
                            // actions={actions}
                            // setAction={setCurrentAction}
                            // refetchData={() => refetch()}
                            // ref={myGridRef}
                        />
                    </Grid>                    
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="300px" width="100%"></Skeleton> : null}

            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        handleColTabChangectx(0)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        NextBtnRef.current = e
                        KyCPoIFormRef.current.handleSubmit(e, "save")                        
                    }}
                >{t("Save & Next")}</Button>
            </Grid>

        </Grid>        
    )
}

export default KYCDetails