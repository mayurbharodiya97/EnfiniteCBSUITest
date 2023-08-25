import React, { useContext, useEffect, useRef } from "react"
import { Button, Grid, Skeleton, Typography } from "@mui/material"
import FormWrapper, {MetaDataType} from "components/dyanmicForm"
import { attestation_detail_meta_data } from "../../metadata/individual/attestationdetails"
import { CkycContext } from "../../../../CkycContext"
import { useTranslation } from "react-i18next"
import * as API from "../../../../api";

const AttestationDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
    const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext);
    const { t } = useTranslation();
    const AttestationDTLFormRef = useRef<any>("");
    const AttestationDTLSubmitHandler = (
        data: any,
        displayData,
        endSubmit,
        setFieldError,
        actionFlag
    ) => {
        // setIsNextLoading(true)
        // console.log("qweqweqwe", data)     
        if(data) {
            // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
            const commonData = {
                IsNewRow: true,
                COMP_CD: "",
                BRANCH_CD: "",
                REQ_FLAG: "",
                REQ_CD: "",
                SR_CD: ""
            }
            let newData = state?.formDatactx
            newData["ATTESTATION_DTL"] = {...newData["ATTESTATION_DTL"], ...data, ...commonData}
            handleFormDataonSavectx(newData)
            // handleColTabChangectx(7)

            // setIsNextLoading(false)
            API.SaveEntry({
                CUSTOMER_TYPE: state?.entityTypectx,
                CATEGORY_CD: state?.categoryValuectx,
                ACCT_TYPE: state?.accTypeValuectx,
                CONSTITUTION_TYPE: state?.constitutionValuectx,
                IsNewRow: state?.isFreshEntryctx,
                REQ_CD: state?.REQ_CD,
                formData: state?.formDatactx
            })
        }   
        endSubmit(true)
    }
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
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("AttestationDetails")}</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            ref={AttestationDTLFormRef}
                            onSubmitHandler={AttestationDTLSubmitHandler}
                            initialValues={state?.formDatactx["ATTESTATION_DTL"] ?? {}}
                            key={"new-form-in-kyc"}
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
                // disabled={isNextLoading}
                    onClick={(e) => {
                        AttestationDTLFormRef.current.handleSubmit(e, "save")
                    }}
                >{t("Save")}</Button>
            </Grid>
        </Grid>
    )
}

export default AttestationDetails