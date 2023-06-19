import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField, IconButton, Button, Divider, Tab} from '@mui/material';
import { styled } from '@mui/material/styles';
import StyledTabs from "components/styledComponent/tabs/tabs";
import FormModal from "./formModal/formModal";
// import {Tabs} from '../../../../components/styledComponent/tabs';
// import {Tab} from '../../../../components/styledComponent/tab';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'; // save-icon
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'; //edit-pencil-icon
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // delete-icon
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // close-icon

export const customer_data_meta_data = {
  form: {
      name: "other_detail_form",
      label: "", 
      resetFieldOnUnmount: false,
      validationRun: "onBlur", 
      submitAction: "home",  
      render: {
          ordering: "auto",
          renderType: "simple",
          gridConfig: {
          item: {
              xs: 12,
              sm: 6,
          },
          container: {
              direction: "row",
              spacing: 3,
          },
          },
      },
      componentProps: {
          textField: {
              fullWidth: true,
          },
          select: {
              fullWidth: true,
          },
          datePicker: {
              fullWidth: true,
          },
          numberFormat: {
              fullWidth: true,
          },
          inputMask: {
              fullWidth: true,
          },
          datetimePicker: {
              fullWidth: true,
          },
      },
  },
  fields: [
      {
          render: {
              componentType: "select",
          },
          name: "CUST_TYPE",
          label: "Cust Type",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
          options: [
              {label: "Individual", value: "individual"},
              {label: "Legal", value: "legal"},
          ],
          // dependentFields: ["DAILY_AMT"],
          // runValidationOnDependentFieldsChange: true,
          // validate: (currentField, dependentFields) => {
          //     if(Number(dependentFields?.DAILY_AMT?.value) >
          //     Number(currentField?.value)) {
          //         return "Weekly Limit should greater than or equal to Daily Limit";
          //     } else {
          //         return "";
          //     }
          // }
      },
      {
          render: {
              componentType: "select",
          },
          options: [
              {label: "category 1", value: "1"},
              {label: "category 2", value: "2"},
              {label: "category 3", value: "3"},
          ],
          name: "category",
          label: "Category",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "constitution",
          label: "Constitution",
          placeholder: "",
          type: "text",
          disabled: true,
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
              disabled: true,
          },
          name: "acc_type",
          label: "A/c Type",
          placeholder: "",
          type: "text",
          disabled: true,
          GridProps: {xs: 6, sm:3},
      },
  ]
}

export const CustomTabs = styled(StyledTabs)(({orientation, theme}) => ({
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
    [theme.breakpoints.up('sm')]: {
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
    backgroundColor: "#07288e82",
    // animation: `boxanima 1000ms ${theme.transitions.easing.easeInOut}`,
    // animationIterationCount: "infinite",
    // animationDirection: "alternate",
    // animationDelay: "5s",
    "& .MuiSvgIcon-root": {
      animation: `anima 500ms ${theme.transitions.easing.easeInOut}`,
      animationIterationCount: "infinite",
      animationDirection: "alternate",
    },
    "@keyframes anima": {
      "0%": {
        fontSize: "1.2rem"
      },
      "100%": {
        fontSize: "1.8rem"
      }
    },
    "@keyframes boxanima": {
      "0%": {
        transform: "rotateY(5deg) rotateX(10deg)"
      },
      "100%": {
        transform: "rotateY(5deg) rotateX(360deg)",
        // borderRadius: "50%"
      }
    },
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_text_container": {
    paddingLeft: theme.spacing(1),
    textAlign: "left",
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

const CustomIconButton = styled(IconButton)(({theme}) => ({
  border: "none", 
  backgroundColor: "#07288e3b", 
  borderRadius: "10px",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "#07288e7d", 
  }
}))

const StyledHeaderGrid = styled(Grid)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  // marginBottom: theme.spacing(1),
  backgroundColor: "var(--theme-color2)",
  paddingTop: "5px",
  paddingBottom: "5px",
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    position: "sticky", 
    top:"56px", 
    height: {xs:"100px", md:"50px"}, 
    paddingTop:"2px", 
    zIndex: "999",
  }
}))

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

export const Ckyc = () => {
  const [inputSearchValue, setInputSearchValue] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [colTabValue, setColTabValue] = React.useState(0);
  const [isCustomerData, setIsCustomerData] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const handleSidebarExpansion = () => {
    setIsSidebarExpanded((prevState) => !prevState)
  }
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const handleFormModalOpen = () => setIsFormModalOpen(true);
  const handleFormModalClose = () => setIsFormModalOpen(false);

  
  // const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
  //   ["GetAreaOptions"],
  //   () =>
  //     API.GetAreaOptions(
  //     // {
  //       // COMP_CD: authState?.companyID ?? "",
  //       // BRANCH_CD: authState?.user?.branchCode ?? "",
  //       // CUST_TYPE: "individual"
  //     // }
  //     )
  // );
  // const setCurrentAction = useCallback((data) => {
  //   // console.log(">>data", data);
  //   console.log("datadatadatadata",data)
  // }, []);


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
        }}>
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
        {tabValue ? <Divider orientation="vertical" flexItem={true}/> : null}
        {tabValue ? <CustomIconButton 
          color="secondary" 
          size="small"
          sx={{ mx: (theme) => theme.spacing(1), }}
          >
            <DriveFileRenameOutlineIcon fontSize="small" />
          </CustomIconButton> : null}
        {tabValue ? <CustomIconButton 
          color="secondary" 
          size="small" 
          sx={{ mr: (theme) => theme.spacing(1), }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </CustomIconButton> : null}
        {tabValue ? <CustomIconButton 
          color="secondary" 
          size="small" 
          sx={{ ml: "auto", }}
          >
            <CancelOutlinedIcon fontSize="small" />
          </CustomIconButton> : null}
      </Grid>
    {/* </Grid> */}
    </Box>
  )

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

  // useEffect(() => {
  //   console.log(colTabValue, typeof colTabValue,"...")
  //   console.log(tabValue, typeof tabValue, "... tab")
  // }, [colTabValue, tabValue])

  useEffect(() => {
    if(isLoadingData) {
      setTimeout(() => {
        setIsLoadingData(false)
        setIsCustomerData(true)
      }, 5000);
    }
  }, [isLoadingData])

  return (
    <React.Fragment>
      <StyledHeaderGrid container 
        columnGap={(theme) => theme.spacing(2)}
        rowGap={(theme) => theme.spacing(2)}>
        <Grid item>
          <Button color="secondary" variant="outlined" onClick={handleFormModalOpen}>Add New</Button>
        </Grid>
        <Grid item xs={12} sm={12} md="auto">
          <CustomTabs textColor="secondary" value={tabValue} onChange={handleTabChange} aria-label="ant example">
            {/* <Tab label="Add New" /> */}
            <Tab label="Retrieve" />
            <Tab label="Pending" />
          </CustomTabs>
        </Grid>
        <Grid item xs={12} sm={12} md>
          <Typography variant="h6" gutterBottom={true}>C-KYC Individual/Legal Entry</Typography>
        </Grid>
        {false && <Grid sx={{ display: tabValue !== 0 ? "none" : "block", }} item xs={12} sm={12} md="auto">
          {controlPanel}
        </Grid>}
      </StyledHeaderGrid>
      <TabPanel value={tabValue} index={0}>
        {/* <Typography variant="h6">Retrieve</Typography> */}
        <Typography sx={{color: (theme) => theme.palette.grey[700]}} variant="h6" gutterBottom={true}>C-KYC Individual/Legal Entry (MST/707)</Typography>
        <Typography sx={{color: (theme) => theme.palette.grey[500]}} variant="subtitle1" gutterBottom={true}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Typography>

        <Grid sx={{
          backgroundColor: "var(--theme-color2)", 
          padding: (theme) => theme.spacing(2), 
          border:(theme) => `2px dashed ${theme.palette.grey[500]}`, borderRadius: "20px"}} 
          my={(theme) => theme.spacing(3)} container direction={"column"}
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

        {/* <GridWrapper
          key={`EmailAcctMstGrid`}
          finalMetaData={RetrievedDataMetaData as GridMetaDataTypee}
          data={[]}
          setData={() => null}
          // loading={isLoading || isFetching}
          actions={actions}
          // setAction={setCurrentAction}
          // refetchData={() => refetch()}
          // ref={myGridRef}
        /> */}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Typography variant="subtitle1" gutterBottom={true}>Pending Requests</Typography>
        <Grid item>
          {/* <GridWrapper
            key={`EmailAcctMstGrid`}
            finalMetaData={PendingReqDetailsMetaData as GridMetaDataTypee}
            data={[]}
            setData={() => null}
            // loading={isLoading || isFetching}
            actions={actions}
            // setAction={setCurrentAction}
            // refetchData={() => refetch()}
            // ref={myGridRef}
          /> */}
        </Grid>
      </TabPanel>      

      <FormModal 
        isFormModalOpen={isFormModalOpen} 
        handleFormModalOpen={handleFormModalOpen} 
        handleFormModalClose={handleFormModalClose} 

        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        handleSidebarExpansion={handleSidebarExpansion}

        colTabValue={colTabValue}
        handleColTabChange={handleColTabChange}

        isLoadingData={isLoadingData}
        setIsLoadingData={setIsLoadingData}
        isCustomerData={isCustomerData}
        setIsCustomerData={setIsCustomerData}
      />
    </React.Fragment>
  );
};