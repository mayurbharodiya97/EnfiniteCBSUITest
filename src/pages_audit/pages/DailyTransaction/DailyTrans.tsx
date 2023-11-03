import React, { useState } from "react";
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import JointDetailsForm from "./JointDetails";
import TodayTransactionForm from "./TodayTransaction";
import CloseIcon from "@mui/icons-material/Close";
import Insurance from "./Insurance";
import CheckBook from "./CheckBook";
import HoldCharge from "./HoldCharge";
import Snapshot from "./SnapShot";
import Search from "./Search";
import StopPay from "./StopPay";
import Document from "./Document";
import Subsidy from "./Subsidy";
import Disbursement from "./Disbursement";
import Footer from "./Footer/Footer";
import AccDetails from "./AccountDetails/AccDetails";
import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { jointViewDetailMetaData } from "./metaData";

import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Divider,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StyledTabs from "components/styledComponent/tabs/tabs";

// const JointDetails = lazy(() => import("./JointDetails"));
console.log("daily trans");
export const CustomTabs = styled(StyledTabs)(({ orientation, theme }) => ({
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
    [theme.breakpoints.up("sm")]: {
      // padding: "10px"
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root:hover": {
    border: `1.4px solid var(--theme-color1)`,
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root": {
    border: `1.4px solid ${theme.palette.grey[600]}`,
    borderRadius: "10px",
    marginBottom: "10px",
    padding: "6px 16px",
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root.Mui-selected":
    {
      border: `1.4px solid var(--theme-color1)`,
      boxShadow: theme.shadows[4],
      // borderRadius: "10px",
      // marginBottom: "10px"
    },
  "& .MuiButtonBase-root.MuiTab-root .toggle_icon_container": {
    backgroundColor: theme.palette.grey[400],

    minHeight: "40px",
    height: "40px",
    minWidth: "40px",
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
    [theme.breakpoints.only("md")]: {
      minHeight: "30px",
      height: "30px",
      minWidth: "30px",
      width: "30px",
    },
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_icon_container .MuiSvgIcon-root": {
    [theme.breakpoints.only("md")]: {
      fontSize: "1.25rem",
    },
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
        fontSize: "1.2rem",
      },
      "100%": {
        fontSize: "1.8rem",
      },
    },
    "@keyframes boxanima": {
      "0%": {
        transform: "rotateY(5deg) rotateX(10deg)",
      },
      "100%": {
        transform: "rotateY(5deg) rotateX(360deg)",
        // borderRadius: "50%"
      },
    },
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_text_container": {
    paddingLeft: theme.spacing(1),
    textAlign: "left",
  },
}));
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
export const DailyTrans = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [tabValue, setTabValue] = React.useState(0);

  const navArray = [
    {
      name: "Account",
      path: "acc",
    },
    {
      name: "Joint Detail",
      path: "joint",
    },
    {
      name: "Today Trans",
      path: "todayTrans",
    },
    {
      name: "ChequeBook",
      path: "checkBook",
    },
    {
      name: "Snapshot",
      path: "snapshot",
    },
    {
      name: "HoldCharge",
      path: "holdCharge",
    },
    {
      name: "Disbursement",
      path: "disbursement",
    },
    {
      name: "Subsidy",
      path: "subsidy",
    },
    {
      name: "Document",
      path: "document",
    },
    {
      name: "Stop Pay",
      path: "stopPay",
    },
    {
      name: "Search",
      path: "search",
    },
    {
      name: "Insurance",
      path: "insurance",
    },
  ];

  const onConfirmFormButtonClickHandel = () => {
    console.log("helllo");
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue, "newValue");
    setTabValue(newValue);
  };
  return (
    <div style={{ padding: "8px" }}>
      <h1>Daily Transaction (Maker) (TRN/001) </h1>

      <>
        <Grid item xs="auto">
          <CustomTabs
            textColor="secondary"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="ant example"
          >
            {navArray.map((a, i) => (
              <Tab label={a.name} />
            ))}

            {tabValue == 1 && (
              <Button variant="contained" color="primary" onClick={handleOpen}>
                {" "}
                +{" "}
              </Button>
            )}
          </CustomTabs>
        </Grid>

        {navArray.map((a, i) => (
          <TabPanel value={tabValue} index={i}>
            {i == 0 && <AccDetails />}
            {i == 1 && <JointDetailsForm />}
            {i == 2 && <TodayTransactionForm />}
            {i == 3 && <CheckBook />}
            {i == 4 && <Snapshot />}
            {i == 5 && <HoldCharge />}
            {i == 6 && <Disbursement />}
            {i == 7 && <Subsidy />}
            {i == 8 && <Document />}
            {i == 9 && <StopPay />}
            {i == 10 && <Search />}
            {i == 11 && <Insurance />}
          </TabPanel>
        ))}
      </>

      <Footer />

      <Dialog
        PaperProps={{
          style: {
            width: "100%",
            minHeight: "46vh",
          },
        }}
        open={open}
        // onClose={handleClose}
        maxWidth="md"
        scroll="body"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Joint Full View for: Test Customer
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <FormWrapper
              metaData={jointViewDetailMetaData}
              // onSubmitHandler={onSubmitHandler}
              onFormButtonClickHandel={onConfirmFormButtonClickHandel}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};
