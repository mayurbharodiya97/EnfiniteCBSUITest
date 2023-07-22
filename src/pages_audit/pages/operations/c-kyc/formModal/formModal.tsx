import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
import { Box, Typography, Grid, ToggleButtonGroup, ToggleButton, InputAdornment, IconButton, Container, Button, Divider, Chip, Skeleton, Avatar, ButtonGroup, Icon, Tooltip, Modal, Dialog, AppBar, Toolbar, Theme, Tab, Stack, Autocomplete, TextField, Select, MenuItem} from '@mui/material';
import { styled } from '@mui/material/styles';
import StyledTabs from "components/styledComponent/tabs/tabs";
import { CustomTabs } from '../ckyc';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';

import PersonalDetails from './formDetails/PersonalDetails';
import KYCDetails from './formDetails/KYCDetails';
import DeclarationDetails from './formDetails/DeclarationDetails';
import RelatedPersonDetails from './formDetails/RelatedPersonDetails';
import OtherDetails from './formDetails/OtherDetails';
import OtherAddressDetails from './formDetails/OtherAddressDetails';
import NRIDetails from './formDetails/NRIDetails';
import AttestationDetails from './formDetails/AttestationDetails';

import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'; //personal-details
import AddLocationIcon from '@mui/icons-material/AddLocation'; // other-address
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InfoIcon from '@mui/icons-material/Info'; // other-details
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'; //edit-pencil-icon
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // delete-icon
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // close-icon
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'; // declaration-icon
import CancelIcon from '@mui/icons-material/Cancel'; // close-icon
import RefreshIcon from '@mui/icons-material/Refresh'; // refresh-icon
import { makeStyles } from '@mui/styles';
// import { customer_data_meta_data } from '../metadata';

import { AuthContext } from 'pages_audit/auth';
import Logo from "assets/images/easy_bankcore_Logo.png";
import { useStyles } from 'pages_audit/appBar/style';
import bank_logo_default from "assets/images/BecomePartnerImg.svg";
import clsx from "clsx";

import * as API from "../api";
import { useQuery } from "react-query";
import { AutoComplete } from 'components/common';
import { checkDateAndDisplay } from 'pages_audit/appBar/appBar';
// import { TextField } from 'components/styledComponent';
// import MyAutocomplete from 'components/common/autocomplete/autocomplete';
type Customtabprops = {
  isSidebarExpanded: boolean;
}
const CustomTab = styled(Tab, {shouldForwardProp: (prop) => prop !== "isSidebarExpanded"})<Customtabprops>(({isSidebarExpanded, theme}) => ({
  minWidth: "60px",
  maxWidth: "250px",
  alignItems: "flex-start",
  // alignItems: isSidebarExpanded ? "flex-start" : "center",
  ...(isSidebarExpanded ? {
    // alignItems: "flex-start",
    width: "100%", 
    transition: "width 0.2s ease-in-out",
  } : {
    // alignItems: "center",
    minWidth: "60px", 
    width:"auto", 
    transition: "width 0.2s ease-in-out",
  }),
  [theme.breakpoints.down("md")]: {
    // backgroundColor: "#ddd",
    maxWidth: "200px"
  }
}))

export const CustomTabLabel = ({IconName, isSidebarExpanded, tabLabel, subtext}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "capitalize",
        // minWidth: "100px"
      }}
    >
      <div className="toggle_icon_container">
        {/* <ViewListIcon /> */}
          {/* {iconType === "mui" 
          ? <Icon><IconName /></Icon> : null
          // : <FontAwesomeIcon
          //     icon={["fas", IconName.toString()]}
          //     // color="var(--theme-color)"
          //   />
          } */}
          {/* <Icon>star</Icon> */}
        {<IconName />}
        {/* {IconComponent(IconName)} */}
        {/* <IconComponent iconName = {IconName as IconNames} /> */}
          {/* <FontAwesomeIcon
            icon={["fas", "users"]}
            // color="var(--theme-color)"
          /> */}
      </div>
      {<div className="toggle_text_container" style={{display: isSidebarExpanded ? "block" : "none", transition: "width 0.4s, display 0.4s", transitionDelay: "0.5s"}}>
        <h4 style={{ margin: 0 }}>{tabLabel}</h4>
        {(subtext.toString().length > 0) && <p style={{ margin: 0 }}>{subtext}</p>}
      </div>}
    </div>
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {/* <Typography> */}
              {children}
          {/* </Typography> */}
        </Box>
      )}
    </div>
  );
}

export const useDialogStyles = makeStyles((theme: Theme) => ({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  width: "95vw",
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,

  height: "95vh",
  overflow: "auto",
};

export default function FormModal({
  isFormModalOpen, handleFormModalOpen, handleFormModalClose,
  isSidebarExpanded, setIsSidebarExpanded, handleSidebarExpansion,
  colTabValue, setColTabValue, handleColTabChange,
  isLoadingData, setIsLoadingData, isCustomerData, setIsCustomerData,
  entityType, setEntityType, 
  customerCategories, tabsApiRes, setTabsApiRes, 
  categoryValue, setCategoryValue, 
  constitutionValue, setConstitutionValue, 
  accTypeValue, setAccTypeValue, AccTypeOptions
}) {
  const classes = useDialogStyles();
  const authController = useContext(AuthContext);
  const appBarClasses = useStyles();
  // const [customerCategories, setCustomerCategories] = useState([])

  const {data:TabsData, isSuccess, isLoading, error, refetch} = useQuery(
    ["getTabsDetail", {entityType, categoryValue, constitutionValue}],
    () =>
      API.getTabsDetail(
      {
        COMP_CD: authController?.authState?.companyID ?? "",
        ENTITY_TYPE: entityType,
        CATEGORY_CD: categoryValue, //CATEG_CD
        CONS_TYPE: constitutionValue, //CONSTITUTION_TYPE
      }  
      )
  );
  const handleChangeAccType = (e) => {
    setAccTypeValue(e.target.value)
  }

  useEffect(() => {
    if(!isLoading) {
      console.log("ResultResult", TabsData)
    }
    // setTabsApiRes(data)
    let newData:any[] = []
    if(TabsData && TabsData.length>0) {
      TabsData.forEach((element:{[k: string]: any}) => {
        let subtitleinfo = {
          SUB_TITLE_NAME : element?.SUB_TITLE_NAME,
          SUB_TITLE_DESC : element?.SUB_TITLE_DESC,
          SUB_ICON : element?.SUB_ICON,
        }
          let index = newData.findIndex((el:any) => el?.TAB_NAME == element?.TAB_NAME)
          if(index != -1) {
            // duplicate tab element
            let subtitles = newData[index].subtitles
            subtitles.push(subtitleinfo)
          } else {
            // new tab element
            newData.push({...element, subtitles: [subtitleinfo]})
          }
        console.log("filled newdata -aft", element.TAB_NAME , newData)
      });
      setTabsApiRes(newData)
    }
  }, [TabsData, isLoading])

  const handleCategoryChange = (e, value, r, d) => {
    // console.log("e,v,r,d", value)
    if(value) {
      setCategoryValue(value?.value)
      setConstitutionValue(value?.CONSTITUTION_TYPE)
      setColTabValue(0)
    } else {
      setColTabValue(false)
      setCategoryValue(null)
      setConstitutionValue(null)
      setTabsApiRes([])
    }
    // refetch()
  }


  return (
    // <div>
    //   <Button onClick={handleFormModalOpen}>Open modal</Button>
      <Dialog fullScreen={true} open={isFormModalOpen}>
        <AppBar
          position="sticky"
          color="primary"
          // style={{ marginBottom: "10px" }}
        >
          <Toolbar variant="dense" sx={{display: "flex", alignItems: "center"}}>
            <div>
              <img
                src={Logo}
                alt="Netbanking"
                className={appBarClasses.logo}
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
              <p className={appBarClasses.version01}>V: 1.12.03.1</p>
            </div>
            <Stack direction="row" spacing={4} mx={2}>
              <Box className={appBarClasses.heading_user_img_border}>
                <Avatar
                  className={appBarClasses.heading_user_img}
                  alt="Remy Sharp"
                  src={bank_logo_default}
                />
              </Box>
            </Stack>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={appBarClasses.title}
            >
              <Box
                style={{
                  marginBottom: "8px",
                  fontSize: "17px",
                  color: "#1C1C1C",
                  // overflowX: "auto",
                  width: "555px",
                }}
                className={clsx({
                  [appBarClasses.marquee]:
                    authController?.authState?.companyName.length > 55,
                })}
              >
                {authController?.authState?.companyName || ""}
              </Box>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ color: "#949597" }}>
                  <Typography
                    variant="caption"
                    display="block"
                    lineHeight={0}
                    fontSize={"11px"}
                  >
                    Branch: {authController?.authState?.user?.branchCode ?? "001 "}-
                    {authController?.authState?.user?.branch ?? ""}
                  </Typography>
                  <Typography variant="caption" display="inline" fontSize={"11px"}>
                    Working Date:{" "}
                    {checkDateAndDisplay(
                      authController?.authState?.workingDate ?? ""
                    )}
                  </Typography>
                  <Typography
                    marginLeft={1}
                    variant="caption"
                    display="inline"
                    fontSize={"11px"}
                  >
                    Last Login Date :{" "}
                    {checkDateAndDisplay(
                      authController?.authState?.user?.lastLogin ?? "Vastrapur"
                    )}
                  </Typography>
                </div>
              </div>
            </Typography>
            <Typography fontSize={"17px"} color={"#1C1C1C"}>
              {/* Greetings....{" "} */}
              {Greetings()} {authController.authState.user.id}
            </Typography>
            {/* <Typography
              className={classes.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              C-KYC Individual/Legal Entry
            </Typography> */}
            <Button
              onClick={handleFormModalClose}
              color="primary"
              // disabled={mutation.isLoading}
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <AppBar
          position="sticky"
          color="secondary"
          style={{ marginBottom: "10px", top: "65px" }}
        >
          <Toolbar variant="dense" sx={{display: "flex", alignItems: "center"}}>
            <Button 
              color="secondary" 
              variant="contained" 
              onClick={handleSidebarExpansion} 
              sx={{ border: "1px solid var(--theme-color2)",
              // height: "40px", width: "40px", minWidth:"40px", borderRadius: "50%", 
              // mb: "5px", ml: {xs: "2px", sm: "8px"}, alignSelf: "start",
              mx: "10px",
              // backgroundColor: (theme) => theme.palette.grey[400],
              minHeight:{xs: "40px", md: "30px"}, 
              height:{xs: "40px", md: "30px"}, 
              minWidth: {xs: "40px", md: "30px"}, 
              width: {xs: "40px", md: "30px"}, 
              display: "flex", 
              alignItems:"center", 
              justifyContent: "center",
              borderRadius: "5px",
              "& .MuiSvgIcon-root": {
                fontSize: {xs: "1.5rem", md: "1.2rem"},
              },
              visibility: (tabsApiRes && tabsApiRes.length>0) ? "visible" : "hidden"
              }}
            >                  
              {/* <IconButton color="secondary" onClick={handleSidebarExpansion}
                sx={{backgroundColor: "#ddd",ml: "20px", mb: "2px", alignSelf: "start"}} 
              > */}
                {!isSidebarExpanded ? <MenuOutlinedIcon /> : <CancelIcon />}
              {/* </IconButton> */}
            </Button>
            <Typography
              className={classes.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {`C-KYC ${entityType == "C" ? "Legal Entity" : "Individual"} Entry`}
            </Typography>
            <Button
              // onClick={handleFormModalClose}
              color="primary"
              size="small"
              // disabled 
              // variant={"contained"}
              // disabled={mutation.isLoading}
            >
              Save as Draft
            </Button>
            <Button
              // onClick={handleFormModalClose}
              color="primary"
              // disabled={mutation.isLoading}
            >
              Save
            </Button>
            <Button
              onClick={handleFormModalClose}
              color="primary"
              // disabled={mutation.isLoading}
            >
              Cancel
            </Button>
          </Toolbar>
        </AppBar>
        {/* <Box sx={style}> */}
          <Grid container sx={{transition: "all 0.4s ease-in-out"}} columnGap={(theme) => theme.spacing(1)}>

            <AppBar
              position="sticky"
              // color=""
              style={{ marginBottom: "10px", top: "113px" }}
            >
              <Toolbar variant="dense" sx={{display: "flex", alignItems: "center"}}>
                {/* common customer fields */}
                <Grid container columnGap={(theme) => theme.spacing(1)} rowGap={(theme) => theme.spacing(1)} my={1}>
                  <Grid item xs={12} sm={6} md>
                    <TextField sx={{width: "100%"}} disabled
                      id="customer-id"
                      label="Cust. ID"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md>
                    <TextField sx={{width: "100%"}} disabled
                      id="req-id"
                      label="Req. ID"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md>
                    <Autocomplete sx={{width: "100%", minWidth: 350}} 
                      disablePortal
                      id="cust-categories"
                      options={customerCategories}
                      onChange={(e,value,r,d) => handleCategoryChange(e, value, r, d)}
                      getOptionLabel={(option:any) => `${option?.label} - ${option?.CONSTITUTION_NAME}`}
                      renderInput={(params) => (
                        <TextField {...params} 
                          autoFocus={true}
                          size="small" 
                          label="Category - Constitution"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position='start'>
                                  <IconButton><RefreshIcon fontSize='small' /></IconButton>
                                </InputAdornment>
                                {/* {params.InputProps.startAdornment} */}
                              </>
                            )
                          }}
                        />
                      )}
                      // enableGrid={false} showCheckbox={false} fieldKey={''} name={''}
                    />
                  </Grid>

                  {/* {entityType == "I" && <TextField
                    id="customer-acct-type"
                    label="Acc. Type"
                    value={accTypeValue}
                    size="small"
                  />} */}


                  {false && <Select
                    labelId="customer-account-type"
                    id=""
                    value={accTypeValue}
                    label="Acc. Type"
                    onChange={handleChangeAccType} sx={{width: "300px"}}
                  >
                    {/* <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}
                    {(AccTypeOptions && AccTypeOptions.length>0) && AccTypeOptions.map(el => {
                      console.log('qwewerewqdxrdsa', el)
                      return <MenuItem value={el?.DATA_VALUE}>{el?.DISPLAY_VALUE}</MenuItem>
                    })}
                  </Select>}
                  <Grid item xs={12} sm={6} md>
                    <Autocomplete sx={{width: "100%"}}
                      disablePortal
                      id="acc-types"
                      options={AccTypeOptions}
                      getOptionLabel={(option:any) => `${option?.DISPLAY_VALUE}`}
                      onChange={(e,v) => {
                        setAccTypeValue(v?.value)
                      }}
                      // sx={{ width: 200 }}
                      renderInput={(params) => (
                        <TextField {...params} 
                          size="small" 
                          label="Acc. Type"
                        />
                      )}
                      // enableGrid={false} showCheckbox={false} fieldKey={''} name={''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md>
                    <TextField disabled sx={{width: "100%"}}
                      id="customer-ckyc-number"
                      label="CKYC No."
                      // sx={{ width: {xs: 12, sm: "", md: "", lg: ""}}}
                      // value={accTypeValue}
                      size="small"
                    />
                  </Grid>
                  {/* <ButtonGroup size="small" variant="outlined" color="secondary">
                    <Button color="secondary" onClick={() => {
                        setIsCustomerData(false)
                        setIsLoadingData(true)
                    }}>Submit</Button>
                    <Button color="secondary" onClick={() => {
                        setIsCustomerData(false)
                        // setIsLoading(true)
                    }}>Reset</Button>
                    <Button color="secondary" onClick={() => {
                        setIsCustomerData(false)
                        // setIsLoading(true)
                    }}>Edit</Button>
                  </ButtonGroup> */}

                </Grid>
                {/* common customer fields */}
              </Toolbar>
            </AppBar>

            <Grid container item xs="auto" sx={{
              display:"flex", flexDirection: "column",alignItems: "center",
              position: "sticky", top:175, height:"calc(95vh - 150px)", 
              boxShadow: "inset 10px 2px 30px #eee",

              opacity: (tabsApiRes && tabsApiRes.length>0) ? 1 : 0, 
              transition: 'opacity 0.4s ease-in-out',
              pointerEvents: (tabsApiRes && tabsApiRes.length>0) ? "" : "none"
              // backgroundColor: "#ddd"
              }}>
              <CustomTabs sx={{height:"calc(100% - 10px)"}}  textColor="secondary" variant="scrollable" scrollButtons={false} visibleScrollbar={true} orientation="vertical" value={colTabValue} onChange={handleColTabChange}>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Personal Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={HowToRegRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Personal Details"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "KYC Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={NoteAddRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"KYC"} subtext={"PoA & PoI & Documents"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Declaration"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={ArticleRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Declaration"} subtext={"FATCA & CRS"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Details of Related Person"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={PeopleAltIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Details of Related Person"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Other Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={InfoIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Other Details"} subtext={"Income & Risk profile & Employment Details"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Other Address"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={AddLocationIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Other Address"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "NRI Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={PersonAddAltRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"NRI Details"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Attestation"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={WorkspacePremiumIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Attestation"} subtext={"KYC verifcation"} />} /></Tooltip>
              </CustomTabs>

              {/* temp ui disabled */}
              {/* {false && <CustomTabs 
                sx={{height:"calc(100% - 10px)", minWidth: "76px"}}  
                textColor="secondary" variant="scrollable" scrollButtons={false} orientation="vertical" 
                value={colTabValue} 
                onChange={handleColTabChange}
              >
                {
                  (tabsApiRes && tabsApiRes.length>0) && tabsApiRes.map((el:any, i) => {
                    // console.log(typeof WorkspacePremiumIcon, "asdqwewqsxaswweqeqw",WorkspacePremiumIcon)
                    return (
                      <Tooltip key={el?.TAB_NAME} placement="left" title={isSidebarExpanded ? "" : el?.TAB_NAME}>
                        <CustomTab isSidebarExpanded={isSidebarExpanded} 
                          label={
                            <CustomTabLabel 
                              IconName={WorkspacePremiumIcon} isSidebarExpanded={isSidebarExpanded} 
                              tabLabel={el?.TAB_NAME} subtext={el?.TAB_DESC ?? ""} 
                            />
                          } 
                        />
                      </Tooltip>
                    )
                  }) 
                }
              </CustomTabs>} */}
            </Grid>
            <Grid sx={{
                "& .MuiBox-root": {
                  padding: "0px",
                }
              }} item xs>
                
            

              <TabPanel value={colTabValue} index={0}>
                {categoryValue ? <PersonalDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes} /> : null}
              </TabPanel>
              <TabPanel value={colTabValue} index={1}>
                <KYCDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes} />
              </TabPanel>
              <TabPanel value={colTabValue} index={2}>
                  {/* <Typography variant="h6">Declaration</Typography> */}
                <DeclarationDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes} />
              </TabPanel>
              <TabPanel value={colTabValue} index={3}>
                {/* <Typography variant="h6">Details of Related Person</Typography> */}
                <RelatedPersonDetails
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData}
                  isCustomerData={isCustomerData} setIsCustomerData={setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes}
                />
              </TabPanel>
              <TabPanel value={colTabValue} index={4}>
                <OtherDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes} />
              </TabPanel>
              <TabPanel value={colTabValue} index={5}>
                <OtherAddressDetails
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes} />
              </TabPanel>
              <TabPanel value={colTabValue} index={6}>
                <NRIDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes} />
              </TabPanel>
              <TabPanel value={colTabValue} index={7}>
                {/* <Typography variant="h6">Attestation</Typography> */}
                <AttestationDetails
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData}
                  isCustomerData={isCustomerData} setIsCustomerData={setIsCustomerData} colTabValue={colTabValue} setColTabValue={setColTabValue} tabsApiRes={tabsApiRes}
                />
              </TabPanel>

                  {/* {(tabsApiRes && tabsApiRes.length>0) && tabsApiRes.map((element, i) => {
                    return (
                      <TabPanel key={i} value={colTabValue} index={i}>
                        {
                          // console.log("cvbdfg", element.subtitles)
                          element.subtitles.map(el => {
                            return (
                              <Typography variant="h6">{el?.SUB_TITLE_NAME}</Typography>
                            )
                          })
                        }
                      </TabPanel>
                    )
                  })} */}

            </Grid>
          </Grid>
        {/* </Box> */}
      </Dialog>
    // </div>
  );
}

const Greetings = () => {
  let hours = new Date().getHours();
  let greet;

  if (hours < 12) greet = "morning";
  else if (hours >= 12 && hours <= 16) greet = "afternoon";
  else if (hours >= 16 && hours <= 24) greet = "evening";

  return <span>Good {greet},</span>;
};