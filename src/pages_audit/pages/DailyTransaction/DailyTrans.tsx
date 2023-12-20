// UI
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
import CloseIcon from "@mui/icons-material/Close";
import { Button, Tabs } from "@mui/material";

//logic
import React, { useState } from "react";
import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import JointDetailsForm from "./JointDetails";
import TodayTransactionForm from "./TodayTransaction";
import Insurance from "./Insurance";
import CheckBook from "./CheckBook";
import HoldCharge from "./HoldCharge";
import Snapshot from "./SnapShot";
import Search from "./Search";
import StopPay from "./StopPay";
import Document from "./Document";
import Subsidy from "./Subsidy";
import Disbursement from "./Disbursement";
import AccDetails from "./AccountDetails/AccDetails";
import { useNavigate } from "react-router-dom";
import Trn001_footer from "./TRN001_footer/Trn001_footer";
import Trn002_footer from "./TRN002_footer/Trn002_Footer";

// const JointDetails = lazy(() => import("./JointDetails"));
// console.log("daily trans");

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
  const [tabValue, setTabValue] = React.useState(0);
  const loc = useLocation();
  console.log(loc, "loc");

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue, "newValue");
    setTabValue(newValue);
  };
  return (
    <div style={{ padding: "8px" }}>
      <h1>
        Daily Transaction
        {loc.pathname.includes("teller_daily_tran_cnf_F2")
          ? " Confirmation (F2) (TRN/002)"
          : " (Maker) (TRN/001)"}
      </h1>

      <>
        <Grid item xs="auto">
          <Tabs
            textColor="secondary"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="ant example"
          >
            {navArray.map((a, i) => (
              <Tab label={a.name} />
            ))}
          </Tabs>
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
      {loc.pathname.includes("teller_daily_tran_cnf_F2") ? (
        <Trn002_footer />
      ) : (
        <Trn001_footer />
      )}
    </div>
  );
};
