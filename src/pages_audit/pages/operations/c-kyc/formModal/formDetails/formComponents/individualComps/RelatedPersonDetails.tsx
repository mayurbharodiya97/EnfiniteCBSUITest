import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Button, Divider, Skeleton, Collapse, IconButton } from '@mui/material';
import {styled} from "@mui/material/styles";
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { related_person_detail_data } from '../../metadata/individual/relatedpersondetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';
import { AuthContext } from "pages_audit/auth";
import _ from 'lodash';
import TabNavigate from '../TabNavigate';

const RelatedPersonDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, displayMode}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx, handleModifiedColsctx, handleCurrentFormRefctx, handleSavectx, handleCurrFormctx} = useContext(CkycContext);
  const RelPersonFormRef = useRef<any>("")
  const [isRelatedPDExpanded, setIsRelatedPDExpanded] = useState(true)
  const [isNextLoading, setIsNextLoading] = useState(false)
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [formStatus, setFormStatus] = useState<any[]>([])
  const handleRelatedPDExpand = () => {
    setIsRelatedPDExpanded(!isRelatedPDExpanded)
  }
  useEffect(() => {
    let refs = [RelPersonFormRef]
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    })
  }, [])

  useEffect(() => {
    // console.log("qweqweqweqwe", formStatus2)
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

const myGridRef = useRef<any>(null);

    const RelPersonSubmitHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag,
        hasError
    ) => {
        setIsNextLoading(true)
        console.log("qweqweqwe", data)     
        if(data && !hasError) {
            let newData = state?.formDatactx
            const commonData = {
                IsNewRow: true,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                REQ_FLAG: "F",
                // REQ_CD: state?.req_cd_ctx,
                // SR_CD: "3",
                CONFIRMED: "N",
                ENT_COMP_CD: authState?.companyID ?? "",
                ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
                ACTIVE: "Y"
            }
            newData["RELATED_PERSON_DTL"] = {...newData["RELATED_PERSON_DTL"], ...data, ...commonData}
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
    const RelPersonSubmitHandler2 = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag,
        hasError
    ) => {
        // console.log("skefdiweufiweufwef", data)
        // let formFields = Object.keys(data?.RELATED_PERSON_DTL?.[0]) // array, get all form-fields-name 
        // formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
        // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
        // // const formData = _.pick(data, formFieldsRef.current)

        // console.log(formDT, "reltedaw", data.RELATED_PERSON_DTL)
        
        // let formDT = (data.RELATED_PERSON_DTL && data.RELATED_PERSON_DTL.length>0) && data.RELATED_PERSON_DTL.map((formRow, i) => {
        //     let formFields = Object.keys(formRow)
        //     formFields = formFields.filter(field => !field.includes("_ignoreField"))
        //     const formData = _.pick(data.RELATED_PERSON_DTL[i], formFields)
        //     return formData;
        // })

        

        // setIsNextLoading(true)
        // console.log("qweqweqwe", data)     
        if(data && !hasError) {
            let newData = state?.formDatactx
            const commonData = {
                IsNewRow: true,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                REQ_FLAG: "F",
                // REQ_CD: state?.req_cd_ctx,
                // SR_CD: "3",
                CONFIRMED: "N",
                ENT_COMP_CD: authState?.companyID ?? "",
                ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
                ACTIVE: "Y"
            }
            if(data.RELATED_PERSON_DTL) {
                let filteredCols:any[]=[]
                // if(data.RELATED_PERSON_DTL.length>0) {
                filteredCols = Object.keys(data.RELATED_PERSON_DTL[0])
                filteredCols = filteredCols.filter(field => !field.includes("_ignoreField"))
                if(state?.isFreshEntryctx) {
                    filteredCols = filteredCols.filter(field => !field.includes("SR_CD"))
                }
                // }

                let newFormatRelPerDtl = data.RELATED_PERSON_DTL.map((formRow, i) => {
                    let formFields = Object.keys(formRow)
                            // console.log("reltedaw formFields", formFields)
                    formFields = formFields.filter(field => !field.includes("_ignoreField"))
                            // console.log("reltedaw formFields 2", formFields)
                            // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
                    const formData = _.pick(data.RELATED_PERSON_DTL[i], formFields)
                            // console.log("reltedaw formData", formData)
                    return {...formData, ...commonData};
                })

                // console.log("reltedaw", data.RELATED_PERSON_DTL)
                
                            
                    
                    
                
                
                
                // let newFormatRelPerDtl = data?.RELATED_PERSON_DTL.map((el, i) => {
                //     return {...el, ...commonData
                //         // , SR_CD: i+1
                //     }
                // })
    
                // newData["RELATED_PERSON_DTL"] = {...newData["RELATED_PERSON_DTL"], ...data, ...commonData}
                newData["RELATED_PERSON_DTL"] = [...newFormatRelPerDtl]
                handleFormDataonSavectx(newData)
                // handleColTabChangectx(4)


                if(!state?.isFreshEntryctx) {
    
                    let tabModifiedCols:any = state?.modifiedFormCols
                    // let updatedCols = tabModifiedCols.RELATED_PERSON_DTL ? _.uniq([...tabModifiedCols.RELATED_PERSON_DTL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])
                    // let updatedCols = [" "]
                    tabModifiedCols = {
                      ...tabModifiedCols,
                      RELATED_PERSON_DTL: [...filteredCols]
                    }
                    handleModifiedColsctx(tabModifiedCols)
                      
    
    
                    // let updPara = utilFunction.transformDetailDataForDML(
                    //     result[1].data ?? [],
                    //     newSomeData ?? [],
                    //     ["SR_CD"]
                    //   );
                    //     let tabModifiedCols:any = state?.modifiedFormCols
                    //     let updatedCols = tabModifiedCols.RELATED_PERSON_DTL ? _.uniq([...tabModifiedCols.RELATED_PERSON_DTL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])
                
                    //     tabModifiedCols = {
                    //       ...tabModifiedCols,
                    //       RELATED_PERSON_DTL: [...updatedCols]
                    //     }
                    //     // handleEditFormDatactx(updateFormData, tabModifiedCols)
                    //     handleModifiedColsctx(tabModifiedCols)
                    //   } else {
                    //     handleStepStatusctx({
                    //       status: "completed",
                    //       coltabvalue: state?.colTabValuectx,
                    //     });
                }
            } else {
                newData["RELATED_PERSON_DTL"] = []
                handleFormDataonSavectx(newData)
                if(!state?.isFreshEntryctx) {
                    let tabModifiedCols:any = state?.modifiedFormCols
                    tabModifiedCols = {
                      ...tabModifiedCols,
                      RELATED_PERSON_DTL: []
                    }
                    handleModifiedColsctx(tabModifiedCols)
                }
            }
            setFormStatus(old => [...old, true])
            // handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            // handleColTabChangectx(state?.colTabValuectx+1)
            // setIsNextLoading(false)
        } else {
            handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
            setFormStatus(old => [...old, false])
        }
        // setIsNextLoading(false)
        endSubmit(true)
    }

    // const initialVal = useMemo(() => {
    //     return state?.isFreshEntryctx
    //             ? state?.formDatactx["RELATED_PERSON_DTL"]
    //                 ? state?.formDatactx["RELATED_PERSON_DTL"]
    //                 : {}
    //             : state?.retrieveFormDataApiRes
    //                 ? state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"]
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

    const handleSave = (e) => {
        handleCurrFormctx({
            isLoading: true,
        })
        const refs = [RelPersonFormRef.current.handleSubmitError(e, "save", false)]
        handleSavectx(e, refs)
    }


    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Details of Related Person {`(4/8)`}</Typography> */}
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)", pl: 2}} variant={"h6"}>{t("DetailsOfRelatedPerson")}</Typography>
                    <IconButton onClick={handleRelatedPDExpand}>
                        {!isRelatedPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>
                <Collapse in={isRelatedPDExpanded}>
                    <Grid item>
                        <FormWrapper 
                            ref={RelPersonFormRef}
                            onSubmitHandler={RelPersonSubmitHandler2}
                            // initialValues={state?.formDatactx["RELATED_PERSON_DTL"] ?? {}}
                            initialValues={initialVal}
                            displayMode={displayMode}
                            key={"new-form-in-kyc"}
                            metaData={related_person_detail_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
            <TabNavigate handleSave={handleSave} displayMode={displayMode ?? "new"} isNextLoading={isNextLoading} />
        </Grid>        
    )
}

export default RelatedPersonDetails