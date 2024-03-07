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
//other
import ACH_IW from "./OtherTrx/ACH_IW";
import ACH_OW from "./OtherTrx/ACH_OW";
import APBS from "./OtherTrx/APBS";
import APY from "./OtherTrx/APY";
import ASBA from "./OtherTrx/ASBA";
import ATM from "./OtherTrx/ATM";
import IMPS from "./OtherTrx/IMPS";
import Group from "./OtherTrx/Group";
import Instruction from "./OtherTrx/Instruction";
import PMBY from "./OtherTrx/PMBY";
import OW_Chq from "./OtherTrx/OW_Chq";
import Temp from "./OtherTrx/Temp";
import LienDetail from "./OtherTrx/Lien_Detail";
import SIDetail from "./OtherTrx/SI_Detail";

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
    console.log(newValue, "newval");
  };
  console.log(navArray, "navArray");

  useEffect(() => {
    setTabValue(0);
  }, [navArray]);

  console.log(tabValue, "tabValue");
  return (
    <div style={{ paddingLeft: "8px", paddingRight: "8px" }}>
      <h2>Daily Transaction {heading}</h2>

      <>
        <Grid item xs="auto" id="dailyTabs">
          <Tabs
            textColor="secondary"
            onChange={handleTabChange}
            aria-label="ant example"
            variant="scrollable"
            value={tabValue}
          >
            {navArray.length > 0 ? (
              navArray?.map((a, i) => <Tab label={a?.TAB_DISPL_NAME} />)
            ) : (
              <Tab label="Account" />
            )}
          </Tabs>
        </Grid>

        {navArray.length > 0 && navArray ? (
          navArray?.map((a, i) => (
            <TabPanel value={tabValue} index={Number(a?.index1)}>
              <>
                {a?.TAB_NAME.includes("Account") && <AccDetails />}
                {a?.TAB_NAME.includes("Joint") && <JointDetailsForm />}
                {a?.TAB_NAME.includes("Today's") && <TodayTransactionForm />}
                {a?.TAB_NAME.includes("Cheques") && <CheckBook />}
                {a?.TAB_NAME.includes("Snapshot") && <Snapshot />}
                {a?.TAB_NAME.includes("Hold Charges") && <HoldCharge />}
                {a?.TAB_NAME.includes("Documents") && <Document />}
                {a?.TAB_NAME.includes("Stop Payment") && <StopPay />}
                {a?.TAB_NAME.includes("Insurance") && <Insurance />}
                {a?.TAB_NAME.includes("Disbursement") && <Disbursement />}
                {a?.TAB_NAME.includes("Subsidy") && <Subsidyy />}
                {a?.TAB_NAME.includes("Search") && <Search />}
                {a?.TAB_NAME.includes("Limits") && <Limit />}
                {a?.TAB_NAME.includes("Stock") && <Stock />}
                {/* other trx */}
                {a?.TAB_NAME.includes("Standing") && <SIDetail />}
                {a?.TAB_NAME.includes("Lien") && <LienDetail />}
                {a?.TAB_NAME.match("O/w Chq/OBC/IBC") && <OW_Chq />}
                {a?.TAB_NAME.includes("Temp.OD/Against") && <Temp />}
                {a?.TAB_NAME.includes("ATM Card") && <ATM />}
                {a?.TAB_NAME.match("IMPS") && <IMPS />}
                {a?.TAB_NAME.includes("ASBA") && <ASBA />}
                {a?.TAB_NAME.includes("ACH I/W") && <ACH_IW />}
                {a?.TAB_NAME.includes("ACH O/W") && <ACH_OW />}
                {a?.TAB_NAME.includes("Sp.Instruction") && <Instruction />}
                {a?.TAB_NAME.includes("Group A/c(s)") && <Group />}
                {a?.TAB_NAME.includes("APY") && <APY />}
                {a?.TAB_NAME.includes("APBS") && <APBS />}
                {a?.TAB_NAME.includes("PMBY") && <PMBY />}
              </>
            </TabPanel>
          ))
        ) : (
          <TabPanel value={tabValue} index={0}>
            <AccDetails />
          </TabPanel>
        )}
      </>
    </div>
  );
};
