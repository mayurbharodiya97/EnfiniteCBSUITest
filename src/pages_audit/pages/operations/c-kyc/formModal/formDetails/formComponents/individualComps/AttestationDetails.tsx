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

const actions = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
];

const AttestationDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, displayMode, onFormClose}) => {
    const [isNextLoading, setIsNextLoading] = useState(false)
    const [historyDialog, setHistoryDialog] = useState(false)
    const [updateDialog, setUpdateDialog] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)
    const [saveSuccessDialog, setSaveSuccessDialog] = useState<boolean>(false)
    const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx, handleModifiedColsctx, handleUpdatectx} = useContext(CkycContext);
    const { authState } = useContext(AuthContext);
    const { t } = useTranslation();
    const AttestationDTLFormRef = useRef<any>("");  
    const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
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
                setSaveSuccessDialog(true)
                // handleReqCDctx(data?.[0]?.REQ_CD)
                // handleColTabChangectx(state?.colTabValuectx+1)
            }
        },
        onError: (error: any) => {},
    });    
    
    const AttestationDTLSubmitHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag,
        hasError
    ) => {
        setIsNextLoading(true)
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
                // handleModifiedColsctx(tabModifiedCols)
                // if() {
                //     setAlertOnUpdate
                // } else {

                // }
                // setUpdateDialog(true)
                // updateMutation.mutate()
            } else {
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
        }
        endSubmit(true)
        setIsNextLoading(false)
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
                    AttestationDTLFormRef.current.handleSubmitError(e, "save")
                }}
                >
                {t("Save")}
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
                        AttestationDTLFormRef.current.handleSubmitError(e, "save")
                    }}
                    >
                    {t("Update")}
                    </Button>
                </Fragment>
                : displayMode == "view" && null;
        }
    }, [displayMode])

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
            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                // disabled={isNextLoading}
                    onClick={(e) => {
                        // handleColTabChangectx(6)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                {SaveUpdateBTNs}
                {/* {state?.isFreshEntryctx && <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        AttestationDTLFormRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Save")}</Button>}
                {(!state?.isFreshEntryctx && state?.confirmFlagctx && !(state?.confirmFlagctx.includes("Y") || state?.confirmFlagctx.includes("R")))
                && <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        AttestationDTLFormRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Update")}</Button>} */}
            </Grid>
            {historyDialog && <AttestHistory 
                open={historyDialog} 
                onClose={onCloseSearchDialog} 
                data={historyData} 
                isLoading={isHistoryDataLoading} 
            />}

            {updateDialog && <UpdateDialog 
                open={updateDialog} 
                onClose={onCloseUpdateDialog} 
                mutationFormDTL={retrieveonupdate}
                // data={historyData} 
                // isLoading={!isUpdated} 
                // setIsLoading={setIsUpdated}
                // mt={updateMutation}
            />}

            {saveSuccessDialog && <SaveSuccessDialog 
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

export const UpdateDialog = ({open, onClose, mutationFormDTL,
    // isLoading, setIsLoading, data, mt
}) => {
    const [shouldUpdate, setShouldUpdate] = useState(false)
    const { authState } = useContext(AuthContext);
    const {state, handleUpdatectx, handleFormDataonSavectx, handleModifiedColsctx} = useContext(CkycContext);


    const mutation: any = useMutation(handleUpdatectx, {
        onSuccess: (data:any) => {
            // setIsUpdated(true)
            // console.log("data on save", data)
            handleModifiedColsctx({})
            handleFormDataonSavectx({})

            // calling this api for getting updated formdata from updated req_cd
            let reqPayload = {
                COMP_CD: authState?.companyID ?? "",
                REQUEST_CD: data[0].REQ_CD ?? "",
            }
            mutationFormDTL.mutate(reqPayload)
            // if(data?.[0]?.REQ_CD) {
            //     // handleReqCDctx(data?.[0]?.REQ_CD)
            //     // handleColTabChangectx(state?.colTabValuectx+1)
            // }
        },
        onError: (error: any) => {
            handleModifiedColsctx({})
            handleFormDataonSavectx({})
            // console.log("data on error", error)
            // setIsUpdated(true)
        },
    });

    // useEffect(() => {
    //         if(mutationFormDTL.isSuccess && mutationFormDTL.data) {
    //         // on success of form data retrieve            
    //     }
    // }, [mutationFormDTL.data, mutationFormDTL.isSuccess])


    return <Dialog open={open} maxWidth="sm"
        PaperProps={{
            style: {
                minWidth: "40%",
                width: "40%",
            }
        }}
    >
        <DialogTitle
            sx={{
                background: "var(--theme-color3)",
                color: "var(--theme-color2)",
                letterSpacing: "1.3px",
                margin: "10px",
                boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                fontWeight: 500,
                borderRadius: "inherit",
                minWidth: "450px",
                py: 1,
            }}
            id="responsive-dialog-title"
        >
            Confirmation
            {/* {isLoading ? "Updating..." : "Updated Successfully"} */}
            {/* {"Updating..."} */}
        </DialogTitle>
        <DialogContent>
            <DialogContentText
                sx={{ fontSize: "19px", display: "flex" }}
            >
                {
                !shouldUpdate 
                    ? "Are you sure you want to apply changes and update ?"
                    : mutation.isLoading
                        ? "Updating..."
                        : mutation.data 
                            ? "Your Changes applied successfully.."
                            : mutation.error && <>
                                {mutation.error.error_msg}
                                {mutation.error.error_detail}
                            </>
                }
                {/* {isLoading ? "Please Wait.. Your Data is getting updated.." : "Data Updated Successfully."}                 */}
                {/* <HelpIcon color="secondary" fontSize="large" /> */}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {!shouldUpdate && <GradientButton
                autoFocus
                onClick={() => {
                    setShouldUpdate(true)
                    mutation.mutate({
                        COMP_CD: authState?.companyID ?? "",
                    })
                }}
            >
                Yes
            </GradientButton>}
            {!shouldUpdate && <GradientButton
                autoFocus
                onClick={onClose}
            >
                No
            </GradientButton>}
            {shouldUpdate && <GradientButton
                autoFocus
                disabled={mutation.isLoading}
                onClick={onClose}
                endIcon={
                    mutation.isLoading ? <CircularProgress size={20} /> : null
                }
            >
                OK
            </GradientButton>}
        </DialogActions>
    </Dialog>
}
export const SaveSuccessDialog = ({open, onClose, onFormClose}) => {
    const {state, handleFormModalClosectx} = useContext(CkycContext);
    return <Dialog open={open} maxWidth="sm"
        PaperProps={{
            style: {
                minWidth: "40%",
                width: "40%",
            }
        }}
    >
        <DialogTitle
            sx={{
                background: "var(--theme-color3)",
                color: "var(--theme-color2)",
                letterSpacing: "1.3px",
                margin: "10px",
                boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                fontWeight: 500,
                borderRadius: "inherit",
                minWidth: "450px",
                py: 1,
            }}
            id="responsive-dialog-title"
        >
            Customer Saved!
            {/* {isLoading ? "Updating..." : "Updated Successfully"} */}
            {/* {"Updating..."} */}
        </DialogTitle>
        <DialogContent>
            <DialogContentText
                sx={{ fontSize: "19px", display: "flex" }}
            >
                Customer Saved SuccessFully!
                {/* {isLoading ? "Please Wait.. Your Data is getting updated.." : "Data Updated Successfully."}                 */}
                {/* <HelpIcon color="secondary" fontSize="large" /> */}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <GradientButton
                autoFocus
                onClick={() => {
                    handleFormModalClosectx()
                    onFormClose()
                }}
            >
                OK
            </GradientButton>
        </DialogActions>
    </Dialog>
}

export default AttestationDetails