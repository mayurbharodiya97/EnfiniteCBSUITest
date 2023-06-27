import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
import { Box, Typography, Grid, ToggleButtonGroup, ToggleButton, TextField, InputAdornment, IconButton, Container, Button, Divider, Chip, Skeleton, Avatar, ButtonGroup, Icon, Tooltip, Modal, Dialog, AppBar, Toolbar, Theme, Tab, Stack} from '@mui/material';
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
import { makeStyles } from '@mui/styles';
import { customer_data_meta_data } from '../metadata';

import { AuthContext } from 'pages_audit/auth';
import Logo from "assets/images/easy_bankcore_Logo.png";
import { useStyles } from 'pages_audit/appBar/style';
import bank_logo_default from "assets/images/BecomePartnerImg.svg";
import clsx from "clsx";

type Customtabprops = {
  isSidebarExpanded: boolean;
}
const CustomTab = styled(Tab, {shouldForwardProp: (prop) => prop !== "isSidebarExpanded"})<Customtabprops>(({isSidebarExpanded, theme}) => ({
  minWidth: "60px",
  maxWidth: "250px",
  // alignItems: isSidebarExpanded ? "flex-start" : "center",
  ...(isSidebarExpanded ? {
    alignItems: "flex-start",
    width: "100%", 
    transition: "width 0.2s ease-out",
  } : {
    alignItems: "center",
    // minWidth: "60px", 
    width:"60px", 
    transition: "width 0.2s ease-out",
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
        {<IconName />}
          {/* <FontAwesomeIcon
            icon={["fas", "users"]}
            // color="var(--theme-color)"
          /> */}
      </div>
      {<div className="toggle_text_container" style={{display: isSidebarExpanded ? "block" : "none", transition: "display 0.4s", transitionDelay: "0.5s"}}>
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
  colTabValue, handleColTabChange,
  isLoadingData, setIsLoadingData, isCustomerData, setIsCustomerData,
  customerType, setCustomerType
}) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => handleFormModalOpen(true);
  // const handleClose = () => handleFormModalOpen(false);
  const classes = useDialogStyles();

  const authController = useContext(AuthContext);
  const appBarClasses = useStyles();
  console.log("autdhController",authController)
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
              sx={{
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
              {`C-KYC ${customerType} Entry`}
            </Typography>
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
            <Grid container item xs="auto" sx={{
              display:"flex", flexDirection: "column",alignItems: "center",
              position: "sticky", top:0, height:"calc(95vh - 80px)",
              }}>
              <CustomTabs sx={{height:"calc(100% - 10px)"}}  textColor="secondary" variant="scrollable" scrollButtons={false} orientation="vertical" value={colTabValue} onChange={handleColTabChange}>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Personal Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={HowToRegRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Personal Details"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "KYC Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={NoteAddRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"KYC"} subtext={"PoA & PoI & Documents"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Declaration"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={ArticleRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Declaration"} subtext={"FATCA & CRS"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Details of Related Person"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={PeopleAltIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Details of Related Person"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Other Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={InfoIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Other Details"} subtext={"Income & Risk profile & Employment Details"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Other Address"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={AddLocationIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Other Address"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "NRI Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={PersonAddAltRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"NRI Details"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Attestation"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={WorkspacePremiumIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Attestation"} subtext={"KYC verifcation"} />} /></Tooltip>
              </CustomTabs>
            </Grid>
            <Grid sx={{
                "& .MuiBox-root": {
                  padding: "0px",
                }
              }} item xs>
                
              {/* common customer fields */}
              <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    // padding:(theme) => theme.spacing(2), 
                    px:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px",
                    mb: "8px"
                }} container item xs={12} sm="auto">
                {/* <Grid item xs={12} sm="auto" sx={{display: "flex", alignItems: "center"}}>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Customer Details</Typography>
                </Grid> */}
                <Grid container item xs={12} sm>
                  <Grid item xs={12}>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={customer_data_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                        typography="Cust Details"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <ButtonGroup size="small" variant="outlined" orientation="vertical" color="secondary">
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
                  </ButtonGroup>
                </Grid>
              </Grid>
              {/* common customer fields */}

              <TabPanel value={colTabValue} index={0}>
                <PersonalDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} />
              </TabPanel>
              <TabPanel value={colTabValue} index={1}>
                <KYCDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} />
              </TabPanel>
              <TabPanel value={colTabValue} index={2}>
                  {/* <Typography variant="h6">Declaration</Typography> */}
                <DeclarationDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} />
              </TabPanel>
              <TabPanel value={colTabValue} index={3}>
                {/* <Typography variant="h6">Details of Related Person</Typography> */}
                <RelatedPersonDetails
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData}
                  isCustomerData={isCustomerData} setIsCustomerData={setIsCustomerData} 
                />
              </TabPanel>
              <TabPanel value={colTabValue} index={4}>
                <OtherDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} />
              </TabPanel>
              <TabPanel value={colTabValue} index={5}>
                <OtherAddressDetails
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} />
              </TabPanel>
              <TabPanel value={colTabValue} index={6}>
                <NRIDetails 
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
                  isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} />
              </TabPanel>
              <TabPanel value={colTabValue} index={7}>
                {/* <Typography variant="h6">Attestation</Typography> */}
                <AttestationDetails
                  isLoading={isLoadingData} setIsLoading={setIsLoadingData}
                  isCustomerData={isCustomerData} setIsCustomerData={setIsCustomerData}
                />
              </TabPanel>
            </Grid>
          </Grid>
        {/* </Box> */}
      </Dialog>
    // </div>
  );
}

const checkDateAndDisplay = (dateStr: string) => {
  // const dt = new Date(dateStr);
  // //@ts-ignore
  // if (dt instanceof Date && !isNaN(dt)) {
  //   return dt.toDateString();
  // }
  if (Boolean(dateStr)) {
    return dateStr;
  }
  return "N/A";
};

const Greetings = () => {
  let hours = new Date().getHours();
  let greet;

  if (hours < 12) greet = "morning";
  else if (hours >= 12 && hours <= 16) greet = "afternoon";
  else if (hours >= 16 && hours <= 24) greet = "evening";

  return <span>Good {greet},</span>;
};