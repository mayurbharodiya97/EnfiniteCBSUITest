// UI
import { AppBar, Box, Grid, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import StyledTabs from "components/styledComponent/tabs/tabs";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Tabs } from "@mui/material";

//logic
import React, { useContext, useEffect, useState } from "react";
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
import Subsidyy from "./Subsidyy";
import Disbursement from "./Disbursement";
import AccDetails from "./AccountDetails";
import "./DailyTransTabs.css";
import { AccDetailContext } from "pages_audit/auth";
import Limit from "./Limit";
import Stock from "./Stock";

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
export const DailyTransTabs = ({ heading, tabsData }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const navArray = tabsData ? tabsData : [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setTabValue(0);
  }, [navArray]);
  return (
    <div style={{ paddingLeft: "8px", paddingRight: "8px" }}>
      <h2>Daily Transaction {heading}</h2>

      <>
        <Grid item xs="auto" id="dailyTabs">
          <Tabs
            textColor="secondary"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="ant example"
          >
            {navArray.length > 0 ? (
              navArray?.map((a, i) => <Tab label={a.TAB_DISPL_NAME} />)
            ) : (
              <Tab label="Account" />
            )}
          </Tabs>
        </Grid>

        {navArray.length > 0 && navArray ? (
          navArray?.map((a, i) => (
            <TabPanel value={tabValue} index={Number(a.DISPL_ORDER) - 1}>
              <>
                {a.TAB_NAME.includes("Account") && (
                  <AccDetails flag={"DLYTRN"} />
                )}
                {a.TAB_NAME.includes("Joint") && <JointDetailsForm />}
                {a.TAB_NAME.includes("Today's") && <TodayTransactionForm />}
                {a.TAB_NAME.includes("Cheques") && <CheckBook />}
                {a.TAB_NAME.includes("Snapshot") && <Snapshot />}
                {a.TAB_NAME.includes("Hold Charges") && <HoldCharge />}
                {a.TAB_NAME.includes("Documents") && <Document />}
                {a.TAB_NAME.includes("Stop Payment") && <StopPay />}
                {a.TAB_NAME.includes("Insurance") && <Insurance />}
                {a.TAB_NAME.includes("Disbursement") && <Disbursement />}
                {a.TAB_NAME.includes("Subsidy") && <Subsidyy />}
                {a.TAB_NAME.includes("Search") && <Search />}
                {a.TAB_NAME.includes("Limits") && <Limit />}
                {a.TAB_NAME.includes("Stock") && <Stock />}
              </>
            </TabPanel>
          ))
        ) : (
          <TabPanel value={tabValue} index={0}>
            <AccDetails flag={"DLYTRN"} />
          </TabPanel>
        )}
      </>
    </div>
  );
};
