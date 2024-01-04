// UI
import { AppBar, Box, Grid, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import StyledTabs from "components/styledComponent/tabs/tabs";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Tabs } from "@mui/material";

//logic
import React, { useState } from "react";
import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import OwChq from "./OwChq";
import "./OtherTrxTabs.css";

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
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}
export const OtherTrxTabs = ({ heading }) => {
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <div style={{ padding: "8px" }}>
      <h1>Daily Transaction {heading}</h1>

      <>
        <Grid item xs="auto" id="dailyTabs">
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
            {/* {i == 0 && <AccDetails flag={"DLYTRN"} />}
            {i == 1 && <JointDetailsForm />}
            {i == 2 && <TodayTransactionForm />}
            {i == 3 && <CheckBook />}
            {i == 4 && <Snapshot />}
            {i == 5 && <HoldCharge />}
            {i == 6 && <Disbursement />}
            {i == 7 && <Subsidyy />}
            {i == 8 && <Document />}
            {i == 9 && <StopPay />}
            {i == 10 && <Search />}
            {i == 11 && <Insurance />} */}
          </TabPanel>
        ))}
      </>
    </div>
  );
};
