import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Button, Dialog, Grid, Skeleton, Typography } from "@mui/material"
import FormWrapper, {MetaDataType} from "components/dyanmicForm"
import { attest_history_meta_data, attestation_detail_meta_data } from "../../metadata/individual/attestationdetails"
import { CkycContext } from "../../../../CkycContext"
import { useTranslation } from "react-i18next"
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";

const AttestationDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
    const [isNextLoading, setIsNextLoading] = useState(false)
    const [historyDialog, setHistoryDialog] = useState(false)
    const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx} = useContext(CkycContext);
    const { authState } = useContext(AuthContext);
    const { t } = useTranslation();
    const AttestationDTLFormRef = useRef<any>("");  
    const onCloseSearchDialog = () => {
        setHistoryDialog(false)
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
            // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
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
            }
            let newData = state?.formDatactx
            newData["ATTESTATION_DTL"] = {...newData["ATTESTATION_DTL"], ...data, ...commonData}
            handleFormDataonSavectx(newData)

            // handleColTabChangectx(state?.colTabValuectx+1)
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            
            // handleColTabChangectx(7)

            // setIsNextLoading(false)
            API.SaveEntry({
                CUSTOMER_ID: state?.customerIDctx,
                CUSTOMER_TYPE: state?.entityTypectx,
                CATEGORY_CD: state?.categoryValuectx,
                ACCT_TYPE: state?.accTypeValuectx,
                KYC_NUMBER: state?.kycNoValuectx,
                CONSTITUTION_TYPE: state?.constitutionValuectx,
                IsNewRow: state?.isFreshEntryctx,
                REQ_CD: state?.req_cd_ctx,
                formData: state?.formDatactx
            })
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

    // useEffect(() => {
    //     if(!isAttestDataLoading && attestData) {
    //         console.log("attst data..", attestData)
    //         let newData = state?.formDatactx
    //     }
    // }, [isAttestDataLoading, attestData])


    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Attestation Details {`(8/8)`}</Typography> */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Attestation Details {`(8/8)`}</Typography>
                </Grid> */}
            </Grid>
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item container direction={"row"} style={{justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("AttestationDetails")}</Typography>
                    {/* <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("AttestationDetails")}</Typography> */}
                    {!state?.isFreshEntryctx && <Button sx={{mr:2}} 
                    color="secondary" variant="contained" 
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
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        AttestationDTLFormRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Save")}</Button>
            </Grid>
            {historyDialog && <AttestHistory 
                open={historyDialog} 
                onClose={onCloseSearchDialog} 
                data={historyData} 
                isLoading={isHistoryDataLoading} 
            />}
        </Grid>
    )
}


const AttestHistory = ({open, onClose, isLoading, data}) => {
    return (
        <Dialog open={open} onClose={onClose}
            PaperProps={{
                style: {
                    minWidth: "1000px",
                    width: "auto",
                    maxWidth: "1100px",
                    height: "90%",
                }
            }}
        >
            <GridWrapper
                key={`AttestHistoryGrid`}
                finalMetaData={attest_history_meta_data as GridMetaDataType}
                data={data ?? []}
                setData={() => null}          
                loading={isLoading}
                // actions={actions}
                // setAction={setCurrentAction}
                // refetchData={() => refetch()}
                // ref={myGridRef}
            />
        </Dialog>
    )
}

export default AttestationDetails