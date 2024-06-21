import { useContext, useEffect, useState } from "react";
import { Grid, Tab } from "@mui/material";
import { AcctMSTContext } from "./AcctMSTContext";
import { CustomTabs } from "../c-kyc/Ckyc";
import { t } from "i18next";
import { TabPanel } from "../c-kyc/formModal/formModal";
import RetrieveAcct from "./RetrieveAcct";

const AcctMST = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <>
    <Grid item xs="auto">
      <CustomTabs
        textColor="secondary"
        value={tabValue}
        onChange={handleTabChange}
        aria-label="acct-mst-tabs"
      >
        {/* <Tab label="Add New" /> */}
        <Tab label={t("Retrieve")} />
        <Tab label={t("Pending")} />
      </CustomTabs>
    </Grid>
    <TabPanel value={tabValue} index={0}>
      <RetrieveAcct />
    </TabPanel>
    </>
  );
};

export default AcctMST;
