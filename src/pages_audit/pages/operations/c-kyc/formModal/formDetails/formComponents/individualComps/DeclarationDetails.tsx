import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Grid, Typography, Divider, Skeleton, IconButton, Collapse, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { declaration_meta_data } from '../../metadata/individual/declarationdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';
import * as API from "../../../../api";
import { useMutation, useQuery } from 'react-query';
import { AuthContext } from 'pages_audit/auth';
import _ from 'lodash';
import { Alert } from 'components/common/alert';
import TabNavigate from '../TabNavigate';
// import { format } from 'date-fns';

const DeclarationDetails = ({displayMode}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx, handleReqCDctx, handleModifiedColsctx, handleCurrentFormRefctx, handleSavectx, handleCurrFormctx} = useContext(CkycContext)
  const DeclarationFormRef = useRef<any>("")
  const [isNextLoading, setIsNextLoading] = useState(false)
  const [currentTabFormData, setCurrentTabFormData] = useState({declaration_details: {}})
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [formStatus, setFormStatus] = useState<any[]>([])

//   const {data:saveDraftData, isSuccess, isLoading: isSaveDraftLoading, error, refetch} = useQuery(
//     ["getSaveDraftData"],
//     () =>
//     API.SaveAsDraft(
//       {
//         CUSTOMER_TYPE: state?.entityTypectx,
//         CATEGORY_CD: state?.categoryValuectx,
//         ACCT_TYPE: state?.accTypeValuectx,
//         KYC_NUMBER: state?.kycNoValuectx,
//         CONSTITUTION_TYPE: state?.constitutionValuectx,
//         IsNewRow: state?.isFreshEntryctx,
//         PERSONAL_DETAIL: state?.formDatactx?.PERSONAL_DETAIL
//       }  
//     ), {enabled: false}
//   );

  useEffect(() => {
    let refs = [DeclarationFormRef]
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    })
  }, [])
  useEffect(() => {
    // console.log("delcatqweqweqweqwe", formStatus)
    if(Boolean(state?.currentFormctx.currentFormRefctx && state?.currentFormctx.currentFormRefctx.length>0) && Boolean(formStatus && formStatus.length>0)) {
      if(state?.currentFormctx.currentFormRefctx.length === formStatus.length) {
        setIsNextLoading(false)
        let submitted;
        submitted = formStatus.filter(form => !Boolean(form))
        if(submitted && Array.isArray(submitted) && submitted.length>0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: state?.colTabValuectx,
          })
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        })
        setFormStatus([])
      }
    }
  }, [formStatus])

  const mutation: any = useMutation(API.SaveAsDraft, {
    onSuccess: (data) => {
      if(data?.[0]?.REQ_CD) {
          let req_cd = parseInt(data?.[0]?.REQ_CD) ?? ""
          handleReqCDctx(req_cd)
          setFormStatus(old => [...old, true])
          // handleColTabChangectx(state?.colTabValuectx+1)
      } else {
        setFormStatus(old => [...old, false])
        console.log("not found req_cd on success", data)
      }
    },
    onError: (error: any) => {
      setFormStatus(old => [...old, false])
    },
  });


//   useEffect(() => {
//     if(!isSaveDraftLoading && saveDraftData) {
//         console.log("saveDraftDawqeqwta", saveDraftData, saveDraftData?.[0]?.REQ_CD)
//         if(saveDraftData?.[0]?.REQ_CD) {
//             handleReqCDctx(saveDraftData?.[0]?.REQ_CD)
//         }        
//     }
//   }, [saveDraftData, isSaveDraftLoading])

  const DeclarationSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
   ) => {
    // setIsNextLoading(true)
    // console.log("qweqweqwe", data)     
    if(data && !hasError) {
        let formFields = Object.keys(data) // array, get all form-fields-name 
        formFields = formFields.filter(field => !field.includes("_ignoreField") && field !== "AGE") // array, removed divider field
        formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
        const formData = _.pick(data, formFieldsRef.current)
  
        // if(Boolean(data["FATCA_DT"])) {
        //     data["FATCA_DT"] = format(new Date(data["FATCA_DT"]), "dd-MMM-yyyy")
        // }
        // if(Boolean(data["DATE_OF_COMMENCEMENT"])) {
        //     data["DATE_OF_COMMENCEMENT"] = format(new Date(data["DATE_OF_COMMENCEMENT"]), "dd-MMM-yyyy")
        // }

        // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))

        let newData = state?.formDatactx
        newData["PERSONAL_DETAIL"] = {...newData["PERSONAL_DETAIL"], ...formData}
        handleFormDataonSavectx(newData)
        // handleColTabChangectx(2)
        // handleColTabChangectx(3)
        // handleColTabChangectx(state?.colTabValuectx+1)

        // setIsNextLoading(false)
        // API.SaveAsDraft({
        //     CUSTOMER_TYPE: state?.entityTypectx,
        //     CATEGORY_CD: state?.categoryValuectx,
        //     ACCT_TYPE: state?.accTypeValuectx,
        //     CONSTITUTION_TYPE: state?.constitutionValuectx,
        //     IsNewRow: state?.isFreshEntryctx,
        //     PERSONAL_DETAIL: state?.formDatactx?.PERSONAL_DETAIL
        // })
        if(!state?.isFreshEntryctx) {
            let tabModifiedCols:any = state?.modifiedFormCols
            let updatedCols = tabModifiedCols.PERSONAL_DETAIL ? _.uniq([...tabModifiedCols.PERSONAL_DETAIL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])
            tabModifiedCols = {
                ...tabModifiedCols,
                PERSONAL_DETAIL: [...updatedCols]
            }
            handleModifiedColsctx(tabModifiedCols)
            // handleColTabChangectx(state?.colTabValuectx+1)
        }
        //  else {
            // handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            let payload = {
                CUSTOMER_TYPE: state?.entityTypectx,
                CATEGORY_CD: state?.categoryValuectx,
                ACCT_TYPE: state?.accTypeValuectx,
                KYC_NUMBER: state?.kycNoValuectx,
                CONSTITUTION_TYPE: state?.constitutionValuectx,
                IsNewRow: state?.isFreshEntryctx,
                PERSONAL_DETAIL: state?.formDatactx?.PERSONAL_DETAIL,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? ""
            }
            mutation.mutate(payload)
            // refetch()
        // }
        // handleColTabChangectx(state?.colTabValuectx+1)
        // if(saveDraftData) {
        //     console.log("saveDraftData", saveDraftData)
        //     handleColTabChangectx(state?.colTabValuectx+1)
        // }
    } else {
        handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
        setFormStatus(old => [...old, false])
    }
    endSubmit(true)
    // handleColTabChangectx(state?.colTabValuectx+1)
    // setIsNextLoading(false)
   }
  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    })
    const refs = [DeclarationFormRef.current.handleSubmitError(e, "save", false)]
    handleSavectx(e, refs)
  } 

  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(true)
  const handleDeclarationExpand = () => {
    setIsDeclarationExpanded(!isDeclarationExpanded)
  }

const myGridRef = useRef<any>(null);
    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx
                ? state?.formDatactx["PERSONAL_DETAIL"]
                    ? state?.formDatactx["PERSONAL_DETAIL"]
                    : {}
                : state?.retrieveFormDataApiRes
                    ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                    : {}
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    
    return (
        <Grid container rowGap={3}>
          {mutation.isError && (
            <Alert
              severity={mutation.error?.severity ?? "error"}
              errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
              errorDetail={mutation.error?.error_detail}
              color="error"
            />
          )}
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Declaration Details {`(3/8)`}</Typography>             */}
            {/* {isCustomerData ?  */}
            <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)", pl: 2}} variant={"h6"}>{t("DeclarationDetails")}</Typography>
                    <IconButton onClick={handleDeclarationExpand}>
                        {!isDeclarationExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>

                <Collapse in={isDeclarationExpanded}>
                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>{t("FATCACRSDetails")}</Divider>
                <Grid item>
                    <FormWrapper 
                        ref={DeclarationFormRef}
                        onSubmitHandler={DeclarationSubmitHandler}
                        // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                        initialValues={initialVal}
                        displayMode={displayMode}
                        key={"declaration-form-kyc"+ initialVal}
                        metaData={declaration_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
                </Collapse>
            </Grid>
             {/* : null} */}
            {/* </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null} */}

            <TabNavigate handleSave={handleSave} displayMode={displayMode ?? "new"} isNextLoading={isNextLoading} />
        </Grid>        
    )
}

export default DeclarationDetails