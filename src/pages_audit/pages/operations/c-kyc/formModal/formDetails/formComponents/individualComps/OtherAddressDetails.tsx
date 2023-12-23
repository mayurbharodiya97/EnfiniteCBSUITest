import { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { Grid, Typography, Divider, Skeleton, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { 
    other_address_meta_data
} from '../../metadata/individual/otheraddressdetails';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';
import { AuthContext } from "pages_audit/auth";
import { utilFunction } from 'components/utils';
import _ from 'lodash';

const OtherAddressDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, displayMode}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
    const { authState } = useContext(AuthContext);
    const [isNextLoading, setIsNextLoading] = useState(false)
    const { t } = useTranslation();
    const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx, handleModifiedColsctx} = useContext(CkycContext);
    const OtherAddDTLFormRef = useRef<any>("");
    const myGridRef = useRef<any>(null);
    const OtherAddDTLSubmitHandler = (
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
            // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))

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
            }
            newData["OTHER_ADDRESS"] = {...newData["OTHER_ADDRESS"], ...data, ...commonData}
            handleFormDataonSavectx(newData)
            handleColTabChangectx(state?.colTabValuectx+1)
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            // handleColTabChangectx(6)
            // handleColTabChangectx(state?.colTabValuectx+1)

            // setIsNextLoading(false)
        } else {
            handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
        }
        endSubmit(true)
        setIsNextLoading(false)
    }
    const OtherAddDTLSubmitHandler2 = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag,
        hasError
    ) => {
        setIsNextLoading(true)
        // console.log("qweqweqweo", data, data.OTHER_ADDRESS)     
        if(data && !hasError) {
            // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))

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
            }
            if(data.OTHER_ADDRESS) {
                let filteredCols:any[]=[]
                filteredCols = Object.keys(data.OTHER_ADDRESS[0])
                filteredCols = filteredCols.filter(field => !field.includes("_ignoreField"))
                if(state?.isFreshEntryctx) {
                    filteredCols = filteredCols.filter(field => !field.includes("SR_CD"))
                }

                let newFormatOtherAdd = data.OTHER_ADDRESS.map((formRow, i) => {
                    let formFields = Object.keys(formRow)
                            // console.log("reltedaw formFields", formFields)
                    formFields = formFields.filter(field => !field.includes("_ignoreField"))
                            // console.log("reltedaw formFields 2", formFields)
                            // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
                    const formData = _.pick(data.OTHER_ADDRESS[i], formFields)
                            // console.log("reltedaw formData", formData)
                    return {...formData, ...commonData};
                })
                console.log("reltedaw", data.OTHER_ADDRESS)






                // let newFormatOtherAdd = data?.OTHER_ADDRESS.map((el, i) => {
                //     return {...el, ...commonData
                //         // , SR_CD: i+1
                //     }
                // })
                // data["OTHER_ADDRESS"] = newFormatOtherAdd
    
                newData["OTHER_ADDRESS"] = [...newFormatOtherAdd]
                handleFormDataonSavectx(newData)
    
    
    
                if(!state?.isFreshEntryctx) {
                    let tabModifiedCols:any = state?.modifiedFormCols
                    tabModifiedCols = {
                        ...tabModifiedCols,
                        OTHER_ADDRESS: [...filteredCols]
                    }
                    handleModifiedColsctx(tabModifiedCols)
                }
            } else {
                newData["OTHER_ADDRESS"] = []
                handleFormDataonSavectx(newData)
                if(!state?.isFreshEntryctx) {
                    let tabModifiedCols:any = state?.modifiedFormCols
                    tabModifiedCols = {
                      ...tabModifiedCols,
                      OTHER_ADDRESS: []
                    }
                    handleModifiedColsctx(tabModifiedCols)
                }
            }




            // newData["OTHER_ADDRESS"] = {...newData["OTHER_ADDRESS"], ...newFormatOtherAdd}
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            handleColTabChangectx(state?.colTabValuectx+1)
            // handleColTabChangectx(6)
            // handleColTabChangectx(state?.colTabValuectx+1)

            // setIsNextLoading(false)
        } else {
            handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
        }
        endSubmit(true)
        setIsNextLoading(false)
    }
    // const initialVal = useMemo(() => {
    //     return state?.isFreshEntryctx
    //             ? state?.formDatactx["OTHER_ADDRESS"]
    //                 ? state?.formDatactx["OTHER_ADDRESS"]
    //                 : {}
    //             : state?.retrieveFormDataApiRes
    //                 ? state?.retrieveFormDataApiRes["OTHER_ADDRESS"]
    //                 : {}
    // }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx
                ? state?.formDatactx["OTHER_ADDRESS"]
                    ? {OTHER_ADDRESS: state?.formDatactx["OTHER_ADDRESS"]}
                    : {OTHER_ADDRESS: [{}]}
                : state?.retrieveFormDataApiRes
                    ? {OTHER_ADDRESS: state?.retrieveFormDataApiRes["OTHER_ADDRESS"]}
                    : {}
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    return (
        <Grid container rowGap={3}>
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Address {`(6/8)`}</Typography>             */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Address {`(6/8)`}</Typography>
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("OtherAddress")}</Typography>
                </Grid>

                {/* <Divider sx={{mt: 1, color: "var(--theme-color3)"}} textAlign={"left"}>Current/Permanent/Overseas Address</Divider> */}
                <Grid item>
                    <FormWrapper 
                        ref={OtherAddDTLFormRef}
                        onSubmitHandler={OtherAddDTLSubmitHandler2}
                        // initialValues={state?.formDatactx["OTHER_ADDRESS"] ?? {}}
                        initialValues={initialVal}
                        displayMode={displayMode}
                        key={"other-address-form-kyc"+initialVal}
                        metaData={other_address_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        // handleColTabChangectx(4)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                {state?.isFreshEntryctx && <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        OtherAddDTLFormRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Save & Next")}</Button>}
                {(!state?.isFreshEntryctx && state?.confirmFlagctx && !(state?.confirmFlagctx.includes("Y") || state?.confirmFlagctx.includes("R")))
                ? <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        OtherAddDTLFormRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Update & Next")}</Button>
                : !state?.isFreshEntryctx ? <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        handleColTabChangectx(state?.colTabValuectx+1)
                    }}
                >{t("Next")}</Button> : null
                }
            </Grid>
        </Grid>        
    )
}

export default OtherAddressDetails