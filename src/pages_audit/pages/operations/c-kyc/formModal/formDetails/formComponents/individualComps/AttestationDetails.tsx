import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Skeleton, Typography } from "@mui/material"
import FormWrapper, {MetaDataType} from "components/dyanmicForm"
import { attest_history_meta_data, attestation_detail_meta_data } from "../../metadata/individual/attestationdetails"
import { CkycContext } from "../../../../CkycContext"
import { useTranslation } from "react-i18next"
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import _ from "lodash"
import { GradientButton } from "components/styledComponent/button"
import { ConfirmUpdateDialog } from "../../../dialog/ConfirmUpdateDialog"
import { CustomerSaveDialog } from "../../../dialog/CustomerSave"
import TabNavigate from "../TabNavigate"

const actions = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
];

const AttestationDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, displayMode, onFormClose, onUpdateForm}) => {
    const [isNextLoading, setIsNextLoading] = useState(false)
    const [historyDialog, setHistoryDialog] = useState(false)
    const [updateDialog, setUpdateDialog] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)
    const [saveSuccessDialog, setSaveSuccessDialog] = useState<boolean>(false)
    const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx, handleModifiedColsctx, handleUpdatectx, handleCurrentFormRefctx, handleSavectx, handleCurrFormctx} = useContext(CkycContext);
    const { authState } = useContext(AuthContext);
    const { t } = useTranslation();
    const AttestationDTLFormRef = useRef<any>("");  
    const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
    const [formStatus, setFormStatus] = useState<any[]>([])
    const onCloseSearchDialog = () => {
        setHistoryDialog(false)
    }    
    const onCloseUpdateDialog = () => {
        setUpdateDialog(false)
        setIsUpdated(false)
    }    
    const onCloseSaveSuccessDialog = () => {
        setSaveSuccessDialog(false)
    }    

    useEffect(() => {
        let refs = [AttestationDTLFormRef]
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

    // attest.history
    const { data:historyData, isError:isHistoryDataError, isLoading: isHistoryDataLoading, error, refetch: historyDataRefetch } = useQuery<any, any>(
        ["getAttestHistory", state?.customerIDctx],
        () => API.getAttestHistory({
            COMP_CD: authState?.companyID ?? "",
            // BRANCH_CD: authState?.user?.branchCode ?? "",
            CUSTOMER_ID: state?.customerIDctx,
        })
    );

    // get attest. form data
    const { data:attestData, isError:isAttestDataError, isLoading: isAttestDataLoading, error: attestDataError, refetch: attestDataRefetch } = useQuery<any, any>(
        ["getAttestData", state?.customerIDctx],
        () => API.getAttestData({
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState?.user?.branchCode ?? "",
            CUSTOMER_ID: state?.customerIDctx,
            USER_NAME: authState?.user?.id ?? "",
        })
    );    

    const mutation: any = useMutation(API.SaveEntry, {
        onSuccess: (data) => {
            // console.log("data on save", data)
            if(data?.[0]?.REQ_CD) {
                setFormStatus(old => [...old, true])
                setSaveSuccessDialog(true)
                // handleReqCDctx(data?.[0]?.REQ_CD)
                // handleColTabChangectx(state?.colTabValuectx+1)
            }
        },
        onError: (error: any) => {
            setFormStatus(old => [...old, false])
        },
    });    
    
    const AttestationDTLSubmitHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag,
        hasError
    ) => {
        // setIsNextLoading(true)
        if(data && !hasError) {
            let formFields = Object.keys(data) // array, get all form-fields-name 
            // formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
            formFieldsRef.current = [...formFields] // array, added distinct all form-field names
            
            // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
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
            let newData = state?.formDatactx
            newData["ATTESTATION_DTL"] = {...newData["ATTESTATION_DTL"], ...data, ...commonData}
            handleFormDataonSavectx(newData)

            // handleColTabChangectx(state?.colTabValuectx+1)
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            
            // handleColTabChangectx(7)

            // setIsNextLoading(false)
            if(!state?.isFreshEntryctx) {
                let tabModifiedCols:any = state?.modifiedFormCols
                let updatedCols = tabModifiedCols.ATTESTATION_DTL ? _.uniq([...tabModifiedCols.ATTESTATION_DTL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])
                tabModifiedCols = {
                    ...tabModifiedCols,
                    ATTESTATION_DTL: [...updatedCols]
                }
                handleModifiedColsctx(tabModifiedCols)
                setFormStatus(old => [...old, true])
                // if() {
                //     setAlertOnUpdate
                // } else {

                // }
                // setUpdateDialog(true)
                // updateMutation.mutate()
            } else {
                // console.log("acdsvq currentFormctx mutateeee...", state?.steps)
                // if(state?.req_cd_ctx) {}
                let data = {
                    CUSTOMER_ID: state?.customerIDctx,
                    CUSTOMER_TYPE: state?.entityTypectx,
                    CATEGORY_CD: state?.categoryValuectx,
                    COMP_CD: authState?.companyID ?? "",
                    ACCT_TYPE: state?.accTypeValuectx,
                    KYC_NUMBER: state?.kycNoValuectx,
                    CONSTITUTION_TYPE: state?.constitutionValuectx,
                    IsNewRow: state?.isFreshEntryctx,
                    REQ_CD: state?.req_cd_ctx,
                    formData: state?.formDatactx
                }
                mutation.mutate(data)
            }
        } else {
            handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
            setFormStatus(old => [...old, false])
        }
        endSubmit(true)
        // setIsNextLoading(false)
    }

    // const initialVal = useMemo(() => {
    //     return state?.isFreshEntryctx
    //             ? state?.formDatactx["ATTESTATION_DTL"]
    //                 ? state?.formDatactx["ATTESTATION_DTL"]
    //                 : {}
    //             : state?.retrieveFormDataApiRes
    //                 ? state?.retrieveFormDataApiRes["ATTESTATION_DTL"]
    //                 : {}
    // }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])
    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx 
                ? attestData 
                    ? {...state?.formDatactx["ATTESTATION_DTL"], ...attestData?.[0]}
                    : state?.formDatactx["ATTESTATION_DTL"]
                : state?.retrieveFormDataApiRes
                    ? attestData 
                        ? {...state?.retrieveFormDataApiRes["ATTESTATION_DTL"], ...attestData?.[0]} 
                        : state?.retrieveFormDataApiRes["ATTESTATION_DTL"]
                    : null;
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes, attestData])

    const handleSave = (e) => {
        handleCurrFormctx({
            isLoading: true,
        })
        const refs = [AttestationDTLFormRef.current.handleSubmitError(e, "save", false)]
        handleSavectx(e, refs)
    }

    // useEffect(() => {
    //     if(!isAttestDataLoading && attestData) {
    //         console.log("attst data..", attestData)
    //         let newData = state?.formDatactx
    //     }
    // }, [isAttestDataLoading, attestData])

    const retrieveonupdate: any = useMutation(API.getCustomerDetailsonEdit, {
        onSuccess: (data) => {
        },
        onError: (error: any) => {},
    });

    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Attestation Details {`(8/8)`}</Typography> */}
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item container direction={"row"} style={{justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)",  pl: 2, pt: "6px"}} variant={"h6"}>{t("AttestationDetails")}</Typography>
                    {/* <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("AttestationDetails")}</Typography> */}
                    {!state?.isFreshEntryctx && <Button sx={{mr:2, mt: "6px"}} 
                    color="secondary" variant="contained" size="small"
                    onClick={() => {
                        // historyDataRefetch()
                        if(!isHistoryDataLoading && historyData) {
                            // console.log("attst data..", historyData)
                            setHistoryDialog(true)
                        }
                    }}>
                        History
                    </Button>}
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            ref={AttestationDTLFormRef}
                            onSubmitHandler={AttestationDTLSubmitHandler}
                            // initialValues={state?.formDatactx["ATTESTATION_DTL"] ?? {}}
                            initialValues={initialVal}
                            displayMode={displayMode}
                            key={"att-details-form-kyc"+ initialVal}
                            metaData={attestation_detail_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
            <TabNavigate handleSave={displayMode !== "new" ? onUpdateForm : handleSave} displayMode={displayMode ?? "new"} isNextLoading={isNextLoading} />
            {historyDialog && <AttestHistory 
                open={historyDialog} 
                onClose={onCloseSearchDialog} 
                data={historyData} 
                isLoading={isHistoryDataLoading} 
            />}

            {updateDialog && <ConfirmUpdateDialog 
                open={updateDialog} 
                onClose={onCloseUpdateDialog} 
                mutationFormDTL={retrieveonupdate}
                // data={historyData} 
                // isLoading={!isUpdated} 
                // setIsLoading={setIsUpdated}
                // mt={updateMutation}
            />}

            {saveSuccessDialog && <CustomerSaveDialog 
                open={saveSuccessDialog} 
                onClose={onCloseSaveSuccessDialog} 
                onFormClose={onFormClose}
                // data={historyData} 
                // isLoading={!isUpdated} 
                // setIsLoading={setIsUpdated}
                // mt={updateMutation}
            />}
        </Grid>
    )
}


const AttestHistory = ({open, onClose, isLoading, data}) => {
    const setCurrentAction = useCallback(
        (data) => {
          if(data.name === "close") {
            onClose()
          }
        },
        []
    );
    return (
        <Dialog open={open} maxWidth="lg"
            PaperProps={{
                style: {
                    minWidth: "70%",
                    width: "80%",
                }
            }}
        >
            <GridWrapper
                key={`AttestHistoryGrid`}
                finalMetaData={attest_history_meta_data as GridMetaDataType}
                data={data ?? []}
                setData={() => null}          
                loading={isLoading}
                actions={actions}
                setAction={setCurrentAction}
                // refetchData={() => refetch()}
                // ref={myGridRef}
            />
        </Dialog>
    )
}

export default AttestationDetails