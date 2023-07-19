import { useRef, useState, useEffect } from 'react';
import { Grid, Typography, Divider, Skeleton, Collapse, IconButton, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { 
    kyc_proof_of_address_contact_meta_data, 
    kyc_proof_of_address_meta_data, 
    kyc_proof_of_identity_driving_license_details_meta_data, 
    kyc_proof_of_identity_meta_data, 
    kyc_proof_of_identity_passport_details_meta_data, 
    kyc_proof_of_local_address_meta_data
} from './metadata/individual/kycdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { DocumentGridMetaData } from './metadata/individual/personaldetails';
import TabStepper from '../TabStepper';

const KYCDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, colTabValue, setColTabValue, tabsApiRes}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  //  const myGridRef = useRef<any>(null);
   const [isPoIExpanded, setIsPoIExpanded] = useState(true)
   const [isPoAExpanded, setIsPoAExpanded] = useState(false)
   const [isNextLoading, setIsNextLoading] = useState(false)
   const KyCPoIFormRef = useRef<any>("")
   const KyCPoAFormRef = useRef<any>("")
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
    setIsNextLoading(true)
    console.log("qweqweqwe", data)     
    if(data) {
        setCurrentTabFormData(formData => ({...formData, "proof_of_identity": data }))
        setIsNextLoading(false)
    }   
    endSubmit(true)
   }
   const PoASubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
   ) => {
    setIsNextLoading(true)
    console.log("qweqweqwe", data)     
    if(data) {
        setCurrentTabFormData(formData => ({...formData, "proof_of_address": data }))
        setIsNextLoading(false)
    }
    endSubmit(true)
   }
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
                    {/* <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>KYC Details</Typography> */}
                    <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                        <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Proof of Identity [PoI]</Typography>
                        <IconButton onClick={handlePoIExpand}>
                            {!isPoIExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                        </IconButton>
                    </Grid>
                </Grid>
                <Collapse
                    in={isPoIExpanded}>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            ref={KyCPoIFormRef}
                            onSubmitHandler={PoISubmitHandler}
                            key={"new-form-in-kyc"}
                            metaData={kyc_proof_of_identity_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>

                {/* <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Passport Details</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={kyc_proof_of_identity_passport_details_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Driving License Details</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={kyc_proof_of_identity_driving_license_details_meta_data as MetaDataType}
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
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Proof of Address [PoA]</Typography>
                    <IconButton onClick={handlePoAExpand}>
                        {!isPoAExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isPoAExpanded}>
                {/* <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Current/Permanent/Overseas Address</Divider> */}
                <Grid item>
                    <FormWrapper 
                        ref={KyCPoAFormRef}
                        onSubmitHandler={PoASubmitHandler}
                        key={"new-form-in-kyc"}
                        metaData={kyc_proof_of_address_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                {/* <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Correspondence/Local Address</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={kyc_proof_of_local_address_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Contact</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={kyc_proof_of_address_contact_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid> */}
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Documents</Typography>
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
                        KyCPoIFormRef.current.handleSubmit(e, "save")
                        KyCPoAFormRef.current.handleSubmit(e, "save")
                    }}
                >Next</Button>
            </Grid>

        </Grid>        
    )
}

export default KYCDetails