import { useContext, useEffect, useRef, useState } from 'react';
import { Grid, Typography, Divider, Skeleton, IconButton, Collapse, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { declaration_meta_data } from './metadata/individual/declarationdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TabStepper from '../TabStepper';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../../CkycContext';

const DeclarationDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation();
  const {state, handleFormDataonSavectx, handleColTabChangectx} = useContext(CkycContext)
  const DeclarationFormRef = useRef<any>("")
  const [isNextLoading, setIsNextLoading] = useState(false)
  const [currentTabFormData, setCurrentTabFormData] = useState({declaration_details: {}})
  const DeclarationSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
   ) => {
    setIsNextLoading(true)
    console.log("qweqweqwe", data)     
    if(data) {
        setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))

        let newData = state?.formDatactx
        newData["PERSONAL_DETAIL"] = {...newData["PERSONAL_DETAIL"], ...data}
        handleFormDataonSavectx(newData)
        handleColTabChangectx(3)

        setIsNextLoading(false)
    }   
    endSubmit(true)
   }
  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(true)
  const handleDeclarationExpand = () => {
    setIsDeclarationExpanded(!isDeclarationExpanded)
  }

const myGridRef = useRef<any>(null);

    return (
        <Grid container rowGap={3}>
            {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Declaration Details {`(3/8)`}</Typography>             */}
            <Grid container>
                {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Declaration Details {`(3/8)`}</Typography>
                </Grid> */}
                <Grid item xs>
                    <TabStepper />
                </Grid>
            </Grid>
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(1), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid container item sx={{alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("DeclarationDetails")}</Typography>
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
                        initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                        key={"new-form-in-kyc"}
                        metaData={declaration_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>
                </Collapse>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}

            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        handleColTabChangectx(1)
                    }}
                >{t("Previous")}</Button>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        DeclarationFormRef.current.handleSubmit(e, "save")
                    }}
                >{t("Save & Next")}</Button>
            </Grid>
        </Grid>        
    )
}

export default DeclarationDetails