import { useRef, useState, useEffect, useContext } from 'react';
import { Grid, Typography, Divider, Skeleton, Collapse, IconButton, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
// import { 
//     kyc_proof_of_address_meta_data, 
//     kyc_proof_of_identity_meta_data, 
// } from './metadata/individual/kycdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
// import { DocumentGridMetaData } from './metadata/individual/personaldetails';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';
import { AuthContext } from "pages_audit/auth";
import { useQuery } from 'react-query';
import * as API from "../../../../api";
import KYCDocument from '../../KYCDocument';

const KYCDocUpload = () => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  //  const myGridRef = useRef<any>(null);
   const { t } = useTranslation();
   const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext);
   const [isPoIExpanded, setIsPoIExpanded] = useState(true)
   const [isPoAExpanded, setIsPoAExpanded] = useState(false)
   const [isNextLoading, setIsNextLoading] = useState(false)
   const KyCPoIFormRef = useRef<any>("")
   const KyCPoAFormRef = useRef<any>("")
   const NextBtnRef = useRef<any>("")
   const { authState } = useContext(AuthContext);
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

  const { data:DocGridData, isError, isLoading:isDocGridLoading, error, refetch } = useQuery<any, any>(
    ["getKYCDocumentGridData", 
    // {
    //   COMP_CD: authState?.companyID ?? "",
    //   BRANCH_CD: authState?.user?.branchCode ?? "",
    //   CUST_TYPE: state?.entityTypectx,
    //   CONSTITUTION_TYPE: state?.constitutionValuectx
    // }, {enabled: !!state?.entityTypectx}
    ],
    () => API.getKYCDocumentGridData({
        COMP_CD: authState?.companyID ?? "", 
        BRANCH_CD: authState?.user?.branchCode ?? "", 
        CUST_TYPE: state?.entityTypectx, 
        CONSTITUTION_TYPE: state?.constitutionValuectx ?? ""
    })
  );

   const handlePoIExpand = () => {
    setIsPoIExpanded(!isPoIExpanded)
   }
   const handlePoAExpand = () => {
    setIsPoAExpanded(!isPoAExpanded)
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
            </Grid>


            <KYCDocument data={DocGridData} isLoading={isDocGridLoading} />

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

export default KYCDocUpload