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
import ACH_IW from "./OtherTrx/ACH_IW";
import ACH_OW from "./OtherTrx/ACH_OW";
import APBS from "./OtherTrx/APBS";
import APY from "./OtherTrx/APY";
import ASBA from "./OtherTrx/ASBA";
import ATM from "./OtherTrx/ATM";
import Group from "./OtherTrx/Group";
import IMPS from "./OtherTrx/IMPS";
import Instruction from "./OtherTrx/Instruction";
import OW_Chq from "./OtherTrx/OW_Chq";
import PMBY from "./OtherTrx/PMBY";
import Temp from "./OtherTrx/Temp";

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
export const OtherTrxTabs = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const navArray = [
    {
      name: "O/W Chq/OBC/IBC",
      path: "other1",
    },
    {
      name: "Temp OD/Against",
      path: "other2",
    },
    {
      name: "ATM Card",
      path: "other3",
    },
    {
      name: "Group A/C",
      path: "other4",
    },
    {
      name: "IMPS",
      path: "other5",
    },
    {
      name: "ASBA",
      path: "other6",
    },
    {
      name: "PMBY",
      path: "other7",
    },
    {
      name: "APY",
      path: "other8",
    },
    {
      name: "APBS",
      path: "other9",
    },
    {
      name: "ACH I/W",
      path: "other10",
    },
    {
      name: "ACH O/W",
      path: "other11",
    },
    {
      name: "Spl. Instruction",
      path: "other12",
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <div>
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
            {i == 0 && <OW_Chq />}
            {i == 1 && <Temp />}
            {i == 2 && <ATM />}
            {i == 3 && <Group />}
            {i == 4 && <IMPS />}
            {i == 5 && <ASBA />}
            {i == 6 && <PMBY />}
            {i == 7 && <APY />}
            {i == 8 && <APBS />}
            {i == 9 && <ACH_IW />}
            {i == 10 && <ACH_OW />}
            {i == 11 && <Instruction />}
          </TabPanel>
        ))}
      </>
    </div>
  );
};
