import React, { Fragment, useRef, useCallback, useState, useMemo, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Typography, Grid, ToggleButtonGroup, ToggleButton, TextField, InputAdornment, IconButton, Container, Button, Divider, Chip, Skeleton, Avatar } from '@mui/material';
import ViewListIcon from "@mui/icons-material/ViewList";
import Search from "@mui/icons-material/Search";
import { styled, ThemeProvider, createTheme, unstable_createMuiStrictModeTheme } from '@mui/material/styles';
import PersonalDetails from "./PersonalDetails";
import StyledTab from "components/styledComponent/tab/tab";
import StyledTabs from "components/styledComponent/tabs/tabs";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { blue, purple, teal, lightGreen } from "@mui/material/colors";
// import {Tabs} from '../../../../components/styledComponent/tabs';
// import {Tab} from '../../../../components/styledComponent/tab';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'; //personal-details
import AddLocationIcon from '@mui/icons-material/AddLocation'; // other-address
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InfoIcon from '@mui/icons-material/Info'; // other-details
import { Icon } from '@mui/material';

const newTheme = createTheme({
  components: {
    MuiToggleButtonGroup: {
      defaultProps: {
        orientation: "vertical",
        color: "primary",
        exclusive: true,
        fullWidth: true,
        size: "small"
      },
      styleOverrides: {
        root: {
          // width: "auto",
          // minWidth: "150px",
        },
        groupedVertical: ({ theme }) => ({
          border: `1px solid #aaa`,            
          // outlineStyle: "auto",
          // height: "70px",
          // outlineWidth: "1px",
          borderRadius: "10px",
          // backgroundColor: "teal"
        }),
        // grouped: {
        //   "& [not(:first-of-type)]": {
        //     borderTop: "1px solid red",
        //     borderBottomLeftRadius: "10px",
        //     borderBottomRightRadius: "10px",
        //     backgroundColor: "green"
        //   }
        // }
      }
    },
    MuiToggleButton: {
      defaultProps: {},
      styleOverrides: {
        root: ({ theme }) => ({
          // margin: "25px auto"
          // ouotline: "none",
          // border: `1px solid ${theme.palette.primary.main}`,
          // borderCollapse: "separate",
          // borderTop: "1px solid",
          // borderTop: `1px solid ${theme.palette.primary.main}`
        })
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          border: "1px solid red"
        }
      }
    }
  }
});

const CustomTabs = styled(StyledTabs)(({orientation, theme}) => ({
  border: "unset !important",
  boxShadow: "unset !important",
  background: "unset !important",
  "& .MuiTabs-flexContainer .MuiButtonBase-root": {
    textTransform: "capitalize",
  },
  "& .MuiTabs-root .MuiTabs-scroller": {
    borderBottom: "1px solid rgba(0,0,0,0.12)",
  },  
  "& .MuiTabs-scroller .MuiTabs-indicator": {
    backgroundColor: "var(--theme-color1)",
    left: 0,
    display: orientation == "vertical" && "none",
  },
  // "&.MuiTabs-root.MuiTabs-vertical .MuiTabs-scroller .MuiTabs-indicator": {
  //   right: "auto !important",
  // },
  // "& .MuiButtonBase-root.Mui-selected": {
  //   color: "#1976d2"
  // },
  "& .MuiButtonBase-root.MuiTab-root:not(.Mui-selected):hover": {
    color: "var(--theme-color3)",
  },
  "& .MuiTabs-flexContainerVertical": {
    [theme.breakpoints.up('md')]: {
      // padding: "10px"
      paddingLeft:theme.spacing(1),
      paddingRight: theme.spacing(1),
    }
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root:hover": {
    border: `1.4px solid var(--theme-color1)`,
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root": {
    border: `1.4px solid ${theme.palette.grey[600]}`,
    borderRadius: "10px",
    marginBottom: "10px"
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root.Mui-selected": {
    border: `1.4px solid var(--theme-color1)`,
    boxShadow: theme.shadows[4]
    // borderRadius: "10px",
    // marginBottom: "10px"
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_icon_container": {
    backgroundColor: theme.palette.grey[400],

    minHeight:"40px", 
    height:"40px", 
    minWidth: "40px", 
    width: "40px", 
    display: "flex", 
    alignItems:"center", 
    justifyContent: "center",
    borderRadius: "5px",
    [theme.breakpoints.only('md')]: {
      minHeight:"30px", 
      height:"30px", 
      minWidth: "30px", 
      width: "30px", 
    }
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_icon_container .MuiSvgIcon-root": {
    [theme.breakpoints.only('md')]: {
      fontSize: "1.25rem",
    }
  },
  "& .MuiButtonBase-root.MuiTab-root:hover .toggle_icon_container": {
    backgroundColor: "#07288e3b",
  },
  "& .MuiButtonBase-root.MuiTab-root.Mui-selected .toggle_icon_container": {
    backgroundColor: "#07288e82"
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_text_container": {
    paddingLeft: theme.spacing(1),
    textAlign: "left"
  }
}))

const StyledSearchField = styled(TextField)(({ theme }) => ({
  // width: "100%",
  "& .MuiInputBase-root": {
    color: "#888",
    padding: "5px",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: "#eee",
    border: "0",
    outline: "none",
    maxWidth: "350px"
  },
  "& .MuiInputBase-root .MuiInputBase-input": {
    paddingLeft: theme.spacing(1)
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: 0
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiInputBase-input": {
    color:"var(--theme-color3)"
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1.5px solid",
    borderColor: "var(--theme-color3)",
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    paddingLeft: 0
  },
  "& .MuiInputAdornment-root": {
    paddingRight: "5px"
  }
}));

const CustomTabLabel = ({IconName, iconType, tabLabel, subtext}) => {
  return (
    // <Box component={"div"}>
    //   <Typography variant="h6">{tabLabel}</Typography>
    //   <Typography variant="subtitle2">{subtext}</Typography>
    // </Box>

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
          {iconType === "mui" 
          ? <Icon><IconName /></Icon> : null
          // : <FontAwesomeIcon
          //     icon={["fas", IconName.toString()]}
          //     // color="var(--theme-color)"
          //   />
          }
        {/* {<IconName />} */}

        {/* <Icon><IconName /></Icon> */}
        {/* <FontAwesomeIcon icon={<IconName />} /> */}

        {/* <FontAwesomeIcon
          icon={["fas", "users"]}
          // color="var(--theme-color)"
        /> */}
        {/* <i className="fa-solid fa-user-group"></i> */}
      </div>
      <div className="toggle_text_container">
        <h4 style={{ margin: 0 }}>{tabLabel}</h4>
        <p style={{ margin: 0 }}>{subtext}</p>
      </div>
    </div>
  )
}

const CustomIconButton = styled(IconButton)(({theme}) => ({
  border: "none", 
  backgroundColor: "#07288e3b", 
  borderRadius: "10px",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "#07288e7d", 
  }
}))
const controlPanel = (
  <Box>
  {/* <Grid container sx={{backgroundColor:"#eee", boxShadow: (theme) => theme.shadows[2],}} xs={12} sm={12} md={12} lg={12}> */}
    {/* <Typography variant="h6">asd</Typography> */}
    <Grid 
      container 
      sx={{
        display:"flex", 
        alignItems: "center", 
        backgroundColor:"var(--theme-color2)", 
        // backgroundColor:{xs:"#fff",sm: "#000", md: "#f00", lg: "#0f0", xl: "#00f"}, 
        width:"100%", 
        // minWidth: 
        p: (theme) => theme.spacing(1), 
        boxShadow: (theme) => theme.shadows[3],
        borderRadius: "10px"
      }} 
      xs={12} sm={12} md={12} lg={12}>
      <Button 
        sx={{mr:(theme) => theme.spacing(1), textTransform: "capitalize"}} 
        color="secondary" 
        variant="contained" 
        startIcon={<SaveOutlinedIcon />} 
        size="small" 
        disableElevation={true}
      >
        Save
      </Button>
      <Divider orientation="vertical" flexItem={true}/>
      <CustomIconButton 
        color="secondary" 
        size="small"
        sx={{ mx: (theme) => theme.spacing(1), }}
        >
          <SaveOutlinedIcon fontSize="small" />
        </CustomIconButton>
      <CustomIconButton 
        color="secondary" 
        size="small" 
        sx={{ mr: (theme) => theme.spacing(1), }}
        >
          <SaveOutlinedIcon fontSize="small" />
        </CustomIconButton>
      <CustomIconButton 
        color="secondary" 
        size="small" 
        sx={{ ml: "auto", }}
        >
          <SaveOutlinedIcon fontSize="small" />
        </CustomIconButton>
    </Grid>
  {/* </Grid> */}
  </Box>
)

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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
        <Box sx={{ p: 3 }}>
          {/* <Typography> */}
              {children}
          {/* </Typography> */}
        </Box>
      )}
    </div>
  );
}

export const Ckyc = () => {
  const [inputSearchValue, setInputSearchValue] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [colTabValue, setColTabValue] = React.useState(0);
  const [isCustomerData, setIsCustomerData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  

  const CustomTabLabelSkeleton = React.memo(() => {
    return <Box sx={{
        mt: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "capitalize",
        backgroundColor: "#efefef",
        p: (theme) => theme.spacing(1),
        borderRadius: (theme) => theme.spacing(1),
        // minWidth: "100px"
      }}>
        <Box sx={{display:"flex", alignItems: "center", justifyContent: "center",}}>
          <Skeleton animation="wave" variant="rounded" height={"30px"} width={"30px"}><Avatar></Avatar></Skeleton>
        </Box>
        <Box sx={{marginLeft: (theme) => theme.spacing(1),textAlign: "left", width: "100%"}}>
          <Typography variant="h6"><Skeleton sx={{mb: "10px"}} width={"100%"} animation="wave" variant="rounded"></Skeleton></Typography>
          <Typography variant="caption"><Skeleton width={"100%"} animation="wave" variant="rounded"></Skeleton></Typography>          
          {/* <h4 style={{ margin: 0 }}>tabLabel</h4>
          <p style={{ margin: 0 }}>subtext</p> */}
        </Box>
      {/* <Skeleton sx={{mb: "10px"}} animation="wave" variant="rounded" width="100%" height="60px"></Skeleton> */}
    </Box>
  })
  const getCustomTabLabelSkeleton = () => {
    return (
      <>
        <CustomTabLabelSkeleton />
        <CustomTabLabelSkeleton />
        <CustomTabLabelSkeleton />
        <CustomTabLabelSkeleton />
        <CustomTabLabelSkeleton />
        <CustomTabLabelSkeleton />
        <CustomTabLabelSkeleton />
      </>
    )
  }

  useEffect(() => {
      console.log("... ckyc", isCustomerData)
  }, [isCustomerData])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const handleColTabChange = (event: React.SyntheticEvent, newValue: number) => {
    // console.log({newValue})
    // if(newValue) {
      setColTabValue(newValue);
    // }
  };
  const handleInputSearchValue = (event) => {
    setInputSearchValue(event.target.value)
  }

  const passDataFromPersonalDetails = (customerDataCurrentStatus) => {
    // setCustomerDataCurrentStatus(customerDataCurrentStatus)
  }

  // useEffect(() => {
  //   console.log(colTabValue, typeof colTabValue,"...")
  //   console.log(tabValue, typeof tabValue, "... tab")
  // }, [colTabValue, tabValue])

  useEffect(() => {
    if(isLoading) {
      setTimeout(() => {
        setIsLoading(false)
        setIsCustomerData(true)
      }, 5000);
    }
  }, [isLoading])

  return (
    <div>
    {/* <ThemeProvider theme={{themeObj}}> */}
      <Grid container columnGap={(theme) => theme.spacing(2)}
        rowGap={(theme) => theme.spacing(2)}
        sx={{px: (theme) => ({xs: theme.spacing(1), md: theme.spacing(2)}), position: "sticky", top:"64px", height: "50px",}}
      >
        <Grid item xs={12} sm={12} md="auto">
          <CustomTabs textColor="secondary" value={tabValue} onChange={handleTabChange} aria-label="ant example">
            <Tab label="Add New" />
            <Tab label="Retrieve" />
            <Tab label="Pending" />
          </CustomTabs>
        </Grid>
        <Grid sx={{ display: tabValue !== 0 ? "none" : "block", }} item xs={12} sm={12} md>
          {controlPanel}
        </Grid>
      </Grid>
      <TabPanel value={tabValue} index={0}>
        {/* Item One */}
          <Grid container columnGap={{md:0, lg:1}}>
            <Grid item xs={12} sm 
              // sx={{position: "sticky", top: "10px", height: "60vh", backgroundColor:"#eee"}}
            >
              {isCustomerData
              ? <Typography variant="h6" gutterBottom={true}>C-KYC Individual/Legal Entry</Typography>
              : isLoading 
                ? (<Box sx={{marginBottom: (theme) => theme.spacing(1)}}>
                    <Typography variant="h5"><Skeleton animation="wave"></Skeleton></Typography>
                    <Typography variant="h6" width={"70%"}><Skeleton animation="wave"></Skeleton></Typography>
                  </Box>) 
                : null}              

              {0 ? <StyledSearchField 
                value={inputSearchValue} 
                onChange={(e) => handleInputSearchValue(e)} 
                color="primary" placeholder="Search here..." fullWidth={true}
                // variant="standard" label="Search"
                InputProps={{
                  startAdornment: <InputAdornment position="end">
                    {/* <IconButton
                      aria-label="toggle password visibility"
                      // onClick={() => setOpenSearch(true)}
                    >
                      <SearchIcon /> */}
                      <Search />
                    {/* </IconButton> */}
                  </InputAdornment>                      
                }}
              /> : null}

              {isCustomerData 
              ? <Box sx={{ flexGrow: 1, display: 'flex', height: 450 }}>
                <CustomTabs textColor="secondary" variant="scrollable" scrollButtons={true} orientation="vertical" value={colTabValue} onChange={handleColTabChange}>                  
                  <Tab label={<CustomTabLabel IconName={HowToRegRoundedIcon} iconType={"mui"} tabLabel={"Personal Details"} subtext={"Lorem ipsum dolor sit amet."} />} />
                  <Tab label={<CustomTabLabel IconName={PeopleAltIcon} iconType={"mui"} tabLabel={"KYC"} subtext={"Lorem ipsum dolor sit amet."} />} />
                  <Tab label={<CustomTabLabel IconName={PeopleAltIcon} iconType={"mui"} tabLabel={"Declaration"} subtext={"Lorem ipsum dolor sit amet."} />} />
                  <Tab label={<CustomTabLabel IconName={PeopleAltIcon} iconType={"mui"} tabLabel={"Details of Related Person"} subtext={"Lorem ipsum dolor sit amet."} />} />
                  <Tab label={<CustomTabLabel IconName={InfoIcon} iconType={"mui"} tabLabel={"Other Details"} subtext={"Lorem ipsum dolor sit amet."} />} />
                  <Tab label={<CustomTabLabel IconName={AddLocationIcon} iconType={"mui"} tabLabel={"Other Address"} subtext={"Lorem ipsum dolor sit amet."} />} />
                  <Tab label={<CustomTabLabel IconName={PeopleAltIcon} iconType={"mui"} tabLabel={"NRI Details"} subtext={"Lorem ipsum dolor sit amet."} />} />
                  <Tab label={<CustomTabLabel IconName={PeopleAltIcon} iconType={"mui"} tabLabel={"Attestation"} subtext={"Lorem ipsum dolor sit amet."} />} />
                </CustomTabs>
              </Box> : isLoading ? getCustomTabLabelSkeleton() : null}
            </Grid>
            <Grid item xs={12} md={9}>
              <TabPanel value={colTabValue} index={0}>
                  {/* <Typography variant="h6">Personal Details</Typography> */}
                  <PersonalDetails passDataFromPersonalDetails={passDataFromPersonalDetails} isLoading={isLoading} setIsLoading={setIsLoading} 
                  isCustomerData = {isCustomerData}
                  setIsCustomerData = {setIsCustomerData}
                  />
              </TabPanel>
              <TabPanel value={colTabValue} index={1}>
                  <Typography variant="h6">KYC</Typography>
              </TabPanel>
              <TabPanel value={colTabValue} index={2}>
                  <Typography variant="h6">Declaration</Typography>
              </TabPanel>
              <TabPanel value={colTabValue} index={3}>
                <Typography variant="subtitle1">Details of Related Person</Typography>
              </TabPanel>
              <TabPanel value={colTabValue} index={4}>
                <Typography variant="subtitle1">Other Details</Typography>
              </TabPanel>
              <TabPanel value={colTabValue} index={5}>
                <Typography variant="subtitle1">Other Address</Typography>
              </TabPanel>
              <TabPanel value={colTabValue} index={6}>
                <Typography variant="subtitle1">NRI Details</Typography>
              </TabPanel>
              <TabPanel value={colTabValue} index={7}>
                <Typography variant="subtitle1">Attestation</Typography>
              </TabPanel>
            </Grid>
          </Grid>          
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* <Typography variant="h6">Retrieve</Typography> */}
        <Typography sx={{color: (theme) => theme.palette.grey[700]}} variant="h6" gutterBottom={true}>C-KYC Individual/Legal Entry (MST/707)</Typography>
        <Typography sx={{color: (theme) => theme.palette.grey[500]}} variant="subtitle1" gutterBottom={true}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Typography>

        <Grid sx={{
          backgroundColor: "var(--theme-color2)", 
          padding: (theme) => theme.spacing(2), 
          border:(theme) => `2px dashed ${theme.palette.grey[500]}`, borderRadius: "20px"}} 
          my={(theme) => theme.spacing(3)} container xs direction={"column"}
        >
          <Grid item>
            <Typography sx={{color: "var(--theme-color1)", paddingBottom: (theme) => theme.spacing(2)}} variant="h6" >Fetch Data</Typography>
          </Grid>
          <Grid item container direction={"column"}>
            <label htmlFor="customer_id" style={{color:"grey"}}>Customer ID</label>
            <StyledSearchField sx={{maxWidth: "300px"}} id={"customer_id"} placeholder="Customer ID" />
          </Grid>
          <Grid item py={2} sx={{textAlign: "right"}}>
            <Button color="secondary" variant="contained">Retrieve</Button>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Typography variant="subtitle1">Pending Requests</Typography>
      </TabPanel>      
    {/* </ThemeProvider>   */}
    </div>
  );
};