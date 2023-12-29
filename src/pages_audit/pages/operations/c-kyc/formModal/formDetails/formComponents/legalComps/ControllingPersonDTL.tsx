import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Grid, Typography, Divider, Skeleton, IconButton, Collapse, Button, Dialog, DialogTitle, Box } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../../../CkycContext';
import * as API from "../../../../api";
import { corporate_control_dtl_meta_data } from '../../metadata/legal/legal_corporate_control_dtl_meta_data';
// import { format } from 'date-fns';
import { AuthContext } from "pages_audit/auth";
import { useMutation } from 'react-query';
import { personal_individual_detail_metadata } from '../../metadata/individual/personaldetails';
import _ from 'lodash';

const ControllingPersonDTL = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, displayMode}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx, handleModifiedColsctx} = useContext(CkycContext)
  const formRef = useRef<any>("")
  const [isNextLoading, setIsNextLoading] = useState(false)
  const [acctName, setAcctName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const onCloseSearchDialog = () => {
    setDialogOpen(false)
  }
  const mutation: any = useMutation(API.getControllCustInfo, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
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
            // console.log("12345--control data", data)
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
                filteredCols = Object.keys(data.RELATED_PERSON_DTL[0])
                filteredCols = filteredCols.filter(field => !field.includes("_ignoreField"))
                if(state?.isFreshEntryctx) {
                    filteredCols = filteredCols.filter(field => !field.includes("SR_CD"))
                }

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
                console.log("reltedaw", data.RELATED_PERSON_DTL)
    



                // let newFormatRelPerDtl:any = []
                // if(data && data.RELATED_PERSON_DTL) {
                //     newFormatRelPerDtl = data.RELATED_PERSON_DTL?.map((el, i) => {
                //         return {...el, ...commonData, 
                //             // SR_CD: i+1
                //         }
                //     })
                // }


                newData["RELATED_PERSON_DTL"] = [...newFormatRelPerDtl]
                handleFormDataonSavectx(newData)

                if(!state?.isFreshEntryctx) {
                    let tabModifiedCols:any = state?.modifiedFormCols
                    tabModifiedCols = {
                        ...tabModifiedCols,
                        RELATED_PERSON_DTL: [...filteredCols]
                    }
                    handleModifiedColsctx(tabModifiedCols)
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

            // handleColTabChangectx(4)
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            handleColTabChangectx(state?.colTabValuectx+1)
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


    const SaveUpdateBTNs = useMemo(() => {
        if(displayMode) {
            return displayMode == "new"
            ? <Fragment>
                <Button
                sx={{ mr: 2, mb: 2 }}
                color="secondary"
                variant="contained"
                disabled={isNextLoading}
                onClick={(e) => {
                    formRef.current.handleSubmitError(e, "save")
                }}
                >
                {t("Save & Next")}
                </Button>
            </Fragment>
            : displayMode == "edit"
                ? <Fragment>
                    <Button
                    sx={{ mr: 2, mb: 2 }}
                    color="secondary"
                    variant="contained"
                    disabled={isNextLoading}
                    onClick={(e) => {
                        formRef.current.handleSubmitError(e, "save")
                    }}
                    >
                    {t("Update & Next")}
                    </Button>
                </Fragment>
                : displayMode == "view" && <Fragment>
                    <Button
                    sx={{ mr: 2, mb: 2 }}
                    color="secondary"
                    variant="contained"
                    disabled={isNextLoading}
                    onClick={(e) => {
                        handleColTabChangectx(state?.colTabValuectx + 1)
                    }}
                    >
                    {t("Next")}
                    </Button>
                </Fragment>
        }
    }, [displayMode])
    
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
                            displayMode={displayMode}
                            formStyle={{}}
                            hideHeader={true}
                            onFormButtonClickHandel={(fieldID, dependentFields) => {
                                // console.log("form button CTRL clicked...", fieldID, dependentFields)
                                // if(fieldID === "RELATED_PERSON_DTL[0].CUST_DTL_BTN")
                                //     console.log("form button CTRL clicked... in", fieldID, dependentFields["RELATED_PERSON_DTL.REF_CUST_ID"]?.value)
                                // if(fieldID === "RELATED_PERSON_DTL[0].CUST_DTL_BTN") {
                                if(fieldID.indexOf("CUST_DTL_BTN") !== -1) {
                                    const refCustID = dependentFields["RELATED_PERSON_DTL.REF_CUST_ID"]?.value?.trim()
                                    if(refCustID.length>0) {
                                        if(acctName !== refCustID) {
                                            setAcctName(refCustID)
                                            let data = {
                                                COMP_CD: authState?.companyID ?? "",
                                                BRANCH_CD: authState?.user?.branchCode ?? "",
                                                CUSTOMER_ID: refCustID,
                                                FROM: ""
                                                // CATEG_CD: state?.categoryValuectx ?? "",
                                                // formIndex: null
                                            }
                                            mutation.mutate(data)
                                        }
                                        setDialogOpen(true)
                                    }
                                }}
                                // let event: any = { preventDefault: () => {} };
                                // formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
                            }
                        />
                </Grid>
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}


            {dialogOpen && <EntiyDialog 
                open={dialogOpen} 
                onClose={onCloseSearchDialog} 
                data={mutation?.data} 
                isLoading={mutation?.isLoading} 
            />}

            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        // handleColTabChangectx(1)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                {SaveUpdateBTNs}
                {/* {state?.isFreshEntryctx && <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        formRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Save & Next")}</Button>}
                {(!state?.isFreshEntryctx && state?.confirmFlagctx && !(state?.confirmFlagctx.includes("Y") || state?.confirmFlagctx.includes("R")))
                ? <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        formRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Update & Next")}</Button>
                : !state?.isFreshEntryctx && <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => handleColTabChangectx(state?.colTabValuectx+1)}
                >{t("Next")}</Button>} */}
            </Grid>
        </Grid>        
    )
}

export const EntiyDialog = ({open, onClose, data, isLoading}) => {
  const PDFormRef = useRef<any>("")
    return (
        <Dialog open={open} maxWidth="lg"
            PaperProps={{
                style: {
                    minWidth: "70%",
                    width: "80%",
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: 'space-between',
                    alignItems: "center",
                    background: "var(--theme-color3)",
                    color: "var(--theme-color2)",
                    letterSpacing: "1.3px",
                    margin: "10px",
                    boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                    fontWeight: 500,
                    borderRadius: "inherit",
                    minWidth: "450px",
                    p: 1
                }}
                id="responsive-dialog-title"
            >
                <Box>
                    {`Customer Info - Customer ID ${data?.[0]?.CUSTOMER_ID ? data[0].CUSTOMER_ID : ""}`}
                </Box>
                <Button onClick={() => onClose()}>Close</Button>
                {/* rowdata?.[0]?.data?.CUSTOMER_ID */}
            </DialogTitle>
            <FormWrapper 
                ref={PDFormRef}
                // onSubmitHandler={onSubmitPDHandler}
                // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                initialValues={data?.[0]} //{initialVal}
                key={"pd-form-kyc"+ data}
                metaData={personal_individual_detail_metadata as MetaDataType}
                formStyle={{}}
                hideHeader={true}
                displayMode={"view"}
                controlsAtBottom={false}
            >
                {/* {({isSubmitting, handleSubmit}) => {
                    console.log("isSubmitting, handleSubmit", isSubmitting)
                    return <Button color="secondary" onClick={handleSubmit}>Save</Button>
                }} */}
                {/* <p>Controll Components</p> */}
            </FormWrapper>
        </Dialog>
    )
}

export default ControllingPersonDTL