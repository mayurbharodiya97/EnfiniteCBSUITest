// UI
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  // Tab,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StyledTabs from "components/styledComponent/tabs/tabs";
import CloseIcon from "@mui/icons-material/Close";
// import { Button, Tabs } from "@mui/material";

//logic
import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { makeStyles } from "@mui/styles";
import { Tabs } from "components/styledComponent/tabs";
import { Tab } from "components/styledComponent/tab";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { AccountDetailsGridMetadata } from "./TodayTransaction/gridMetadata";
import * as API from "./TodayTransaction/api";
import { useMutation, useQuery } from "react-query";
import { ActionTypes } from "components/dataTable";
import { enqueueSnackbar } from "notistack";
import * as CommonApi from "../TRNCommon/api";

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
interface DailyTransTabsProps {
  heading: string;
  tabsData: any;
  cardsData: any;
  reqData: any;
}

export const DailyTransTabs = ({
  heading,
  tabsData,
  cardsData,
  reqData,
}: DailyTransTabsProps) => {
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
    <div style={{ padding: "8px" }}>
      <h2> {heading}</h2>

      <>
        <Grid item xs="auto" id="dailyTabs">
          <Tabs
            textColor="secondary"
            // className={classes?.tabs}
            // textColor="secondary"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="ant example"
            variant="scrollable"
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
                {a.TAB_NAME.includes("Account") && (
                  <AccDetails cardsData={cardsData} />
                )}
                {a.TAB_NAME.includes("Joint") && (
                  <JointDetailsForm reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Today's") && (
                  <TodayTransactionForm reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Cheques") && (
                  <CheckBook reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Snapshot") && (
                  <Snapshot reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Hold Charges") && (
                  <HoldCharge reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Documents") && (
                  <Document reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Stop Payment") && (
                  <StopPay reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Insurance") && (
                  <Insurance reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Disbursement") && (
                  <Disbursement reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Subsidy") && (
                  <Subsidyy reqData={reqData} />
                )}
                {a.TAB_NAME.includes("Search") && <Search reqData={reqData} />}
                {a.TAB_NAME.includes("Limits") && <Limit reqData={reqData} />}
                {a.TAB_NAME.includes("Stock") && <Stock reqData={reqData} />}
              </>
            </TabPanel>
          ))
        ) : (
          <TabPanel value={tabValue} index={0}>
            <AccDetails cardsData={cardsData} />
          </TabPanel>
        )}
      </>
    </div>
  );
};

export const DailyTransTabsWithDialog = () => {
  const [tabData, setTabsData] = useState<any>([]);
  useEffect(() => {
    // Add event listener for the message event
    //@ts-ignore
    window._childFunction = (req) => {
      if (Boolean(req)) {
        setTabsData(req);
      }
      //@ts-ignore
      window._childFunction = null;
    };
    //@ts-ignore
    window?.opener?._parentFuntion?.();
    return () => {
      //@ts-ignore
      window._childFunction = null;
    };
  }, []);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getAcctDtlList"], () => API.getAcctDtlList());

  const actions: ActionTypes[] = [
    {
      actionName: "view-details",
      actionLabel: "view-details",
      multiple: false,
      rowDoubleClick: true,
      actionTextColor: "var(--theme-color3)",
      alwaysAvailable: false,
      actionBackground: "inherit",
    },
  ];
  let tabsApiSuccess = [];
  let cardsApiSuccess = [];

  const handleBothAPISuccess = () => {
    if (tabsApiSuccess !== null && cardsApiSuccess !== null) {
      setTabsData((preTabsData) => ({
        ...preTabsData,
        tabsData: tabsApiSuccess,
      }));
      setTabsData((preCardsData) => ({
        ...preCardsData,
        cardStore: cardsApiSuccess,
      }));
    }
  };

  const getTabsByParentType = useMutation(CommonApi.getTabsByParentType, {
    onSuccess: (data) => {
      tabsApiSuccess = data;
      handleBothAPISuccess();
      // setTabsData((preTabsData) => ({ ...preTabsData, tabsData: data }));
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      setTabsData((preTabsData) => ({
        ...preTabsData,
        tabsData: [],
      }));
      setTabsData((preCardsData) => ({
        ...preCardsData,
        cardStore: [],
      }));
    },
  });

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      cardsApiSuccess = data;
      handleBothAPISuccess();
      // setTabsData((preCardsData) => ({ ...preCardsData, cardStore: data }));
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      setTabsData((preTabsData) => ({
        ...preTabsData,
        tabsData: [],
      }));
      setTabsData((preCardsData) => ({
        ...preCardsData,
        cardStore: [],
      }));
    },
  });

  const setCurrentAction = useCallback((data) => {
    const rowsData = data?.rows?.[0]?.data;
    if (rowsData) {
      setTabsData((preRowsData) => ({
        ...preRowsData,
        rowsData: rowsData,
      }));
      getTabsByParentType.mutate(rowsData);
      getCarousalCards.mutate({ ...rowsData, PARENT_TYPE: "" });
    }
  }, []);

  return (
    <Dialog open={true} fullScreen>
      {/* <AcctSearchParent
        cardsData={tabData?.cardStore}
        tabData={tabData?.tabsData}
      /> */}
      <Box>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: "var(--theme-color5)",
            margin: "10px 32px 0px 32px",
            alignItems: "center",
            height: "7vh",
            boxShadow:
              "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1.25rem",
              lineHeight: 1.6,
              letterSpacing: "0.0075em",
              color: "#fff",
            }}
          >
            {`Account Details For Customer ID : ${
              tabData?.rowsData?.CUSTOMER_ID ?? ""
            }`}
          </Typography>
        </DialogTitle>
        {Boolean(getCarousalCards.isLoading) ||
        Boolean(getTabsByParentType.isLoading) ? (
          <LinearProgress
            sx={{
              margin: "4px 32px 0 32px",
              background: "var(--theme-color6)",
              "& .MuiLinearProgress-bar": {
                background: "var(--theme-color1) !important",
              },
            }}
          />
        ) : null}
        <DialogContent sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
          <DailyTransTabs
            heading={""}
            tabsData={tabData?.tabsData}
            cardsData={tabData?.cardStore}
            reqData={tabData?.rowsData}
          />
          <GridWrapper
            key={`TodaysTransactionTableGrid`}
            finalMetaData={AccountDetailsGridMetadata as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            ReportExportButton={true}
            actions={actions}
            setAction={setCurrentAction}
            refetchData={() => refetch()}
            loading={isLoading || isFetching}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
};
