import React, { useContext, useMemo, useRef, useState } from "react"
import { Button, Grid, Skeleton, Typography } from "@mui/material"
import FormWrapper, {MetaDataType} from "components/dyanmicForm"
import { nri_detail_meta_data } from "../../metadata/individual/nridetails"
import { CkycContext } from "../../../../CkycContext"
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next"

const NRIDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
    const [isNextLoading, setIsNextLoading] = useState(false)
    const {state, handleFormDataonSavectx, handleColTabChangectx, handleStepStatusctx} = useContext(CkycContext);
    const { t } = useTranslation();
    const NRIDTLFormRef = useRef<any>("");
    const { authState } = useContext(AuthContext);

    const NRIDTLSubmitHandler = (
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
            const commonData = {
                IsNewRow: true,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                REQ_FLAG: "F",
                REQ_CD: state?.req_cd_ctx,
                // SR_CD: "3",
                ENT_COMP_CD: authState?.companyID ?? "",
                ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
            }
            let newData = state?.formDatactx
            newData["NRI_DTL"] = {...newData["NRI_DTL"], ...data, ...commonData}
            handleFormDataonSavectx(newData)
            // handleColTabChangectx(7)
            handleColTabChangectx(state?.colTabValuectx+1)
            handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
            // setIsNextLoading(false)
        } else {
            handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
        }
        endSubmit(true)
        setIsNextLoading(false)
    }
    const initialVal = useMemo(() => {
        return state?.isFreshEntryctx
                ? state?.formDatactx["NRI_DTL"]
                    ? state?.formDatactx["NRI_DTL"]
                    : {}
                : state?.retrieveFormDataApiRes
                    ? state?.retrieveFormDataApiRes["NRI_DTL"]
                    : {}
    }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])

    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>NRI Details {`(7/8)`}</Typography> */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>NRI Details {`(7/8)`}</Typography>
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("NRIDetails")}</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            ref={NRIDTLFormRef}
                            onSubmitHandler={NRIDTLSubmitHandler}
                            key={"nri-details-form-kyc"+ initialVal}
                            metaData={nri_detail_meta_data as MetaDataType}
                            // initialValues={state?.formDatactx["NRI_DTL"] ?? {}}
                            initialValues={initialVal}
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
                        // handleColTabChangectx(5)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" 
                disabled={isNextLoading}
                    onClick={(e) => {
                        NRIDTLFormRef.current.handleSubmitError(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>
        </Grid>
    )
}

export default NRIDetails