import { useEffect, useRef, useState } from 'react';
import { Grid, Typography, Divider, Skeleton, IconButton, Collapse, Button } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import { declaration_meta_data } from './metadata/individual/declarationdetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TabStepper from '../TabStepper';

const DeclarationDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, colTabValue, setColTabValue, tabsApiRes}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
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
                    <TabStepper currentTab={colTabValue} setColTabValue={setColTabValue} />
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
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Declaration Details</Typography>
                    <IconButton onClick={handleDeclarationExpand}>
                        {!isDeclarationExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}       
                    </IconButton>
                </Grid>

                <Collapse in={isDeclarationExpanded}>
                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>FATCA/CRS Details</Divider>
                <Grid item>
                    <FormWrapper 
                        ref={DeclarationFormRef}
                        onSubmitHandler={DeclarationSubmitHandler}
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
                        DeclarationFormRef.current.handleSubmit(e, "save")
                    }}
                >Next</Button>
            </Grid>
        </Grid>        
    )
}

export default DeclarationDetails