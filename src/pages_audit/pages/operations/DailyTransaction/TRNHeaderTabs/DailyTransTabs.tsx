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
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { lazy } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import { AccDetailContext, AuthContext, AuthProvider } from "pages_audit/auth";
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
import { GradientButton } from "components/styledComponent/button";
import FormModal from "../../c-kyc/formModal/formModal";
import CkycProvider from "../../c-kyc/CkycContext";
import { useCacheWithMutation } from "./cacheMutate";
import CommonSvgIcons from "assets/icons/commonSvg/commonSvgIcons";

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
  const navArray = tabsData ? tabsData : [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setTabValue(0);
  }, [navArray]);

  return (
    <div style={{ padding: "8px 8px 0px 8px" }}>
      {Boolean(heading) && <h2> {heading}</h2>}
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
              navArray?.map((a, i) => (
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "0.4rem" }}>
                        <CommonSvgIcons iconName={a?.ICON} />
                      </div>
                      {a?.TAB_DISPL_NAME}
                    </div>
                  }
                  // icon={<CommonSvgIcons iconName={null} />}
                  // iconPosition="top"
                />
              ))
            ) : (
              <Tab
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "0.4rem" }}>
                      <CommonSvgIcons iconName={"accountIcon"} />
                    </div>
                    {"Account"}
                  </div>
                }
              />
            )}
          </Tabs>
        </Grid>

        {navArray.length > 0 && navArray ? (
          navArray?.map((a, i) => (
            <TabPanel value={tabValue} index={i}>
              <>
                {/* other trx */}
                {a?.TAB_NAME.includes("Standing") && (
                  <SIDetail reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("Lien") && (
                  <LienDetail reqData={reqData} />
                )}
                {a?.TAB_NAME.match("O/w Chq/OBC/IBC") && (
                  <OW_Chq reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("Temp.OD/Against") && (
                  <Temp reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("ATM Card") && <ATM reqData={reqData} />}
                {a?.TAB_NAME.match("IMPS") && <IMPS reqData={reqData} />}
                {a?.TAB_NAME.includes("ASBA") && <ASBA reqData={reqData} />}
                {a?.TAB_NAME.includes("ACH I/W") && (
                  <ACH_IW reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("ACH O/W") && (
                  <ACH_OW reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("Sp.Instruction") && (
                  <Instruction reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("Group A/c(s)") && (
                  <Group reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("APY") && <APY reqData={reqData} />}
                {a?.TAB_NAME.includes("APBS") && <APBS reqData={reqData} />}
                {a?.TAB_NAME.includes("PMBY") && <PMBY reqData={reqData} />}
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

export const DailyTransTabsWithDialogWrapper = ({
  handleClose,
  rowsData,
  setRowsData,
}) => {
  return (
    <CkycProvider>
      <DailyTransTabsWithDialog
        handleClose={handleClose}
        rowsData={rowsData}
        setRowsData={setRowsData}
      />
    </CkycProvider>
  );
};

export const DailyTransTabsWithDialog = ({
  handleClose,
  rowsData,
  setRowsData,
}) => {
  const [cardData, setCardsData] = useState<any>([]);
  const navigate = useNavigate();
  const previousRowData = useRef(null);
  const controllerRef = useRef<AbortController>();
  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  } = useCacheWithMutation(
    "getTabsByParentTypeKey",
    CommonApi.getTabsByParentType
  );

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
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getAcctDtlList"], () => API.getAcctDtlList(rowsData?.[0]?.data));

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      setCardsData(data);
    },
    onError: (error: any) => {
      if (
        error?.error_msg !==
        "Timeout : Your request has been timed out or has been cancelled by the user."
      ) {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      }
      setCardsData([]);
    },
  });

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "_rowChanged") {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      const rowsData = data?.rows?.[0]?.data;
      if (
        Boolean(rowsData) &&
        JSON.stringify(rowsData) !== JSON.stringify(previousRowData?.current)
      ) {
        previousRowData.current = rowsData;
        setRowsData(data?.rows);
        fetchTabsData({
          cacheId: rowsData?.SR_NO,
          reqData: rowsData,
          controllerFinal: controllerRef.current,
        });
        getCarousalCards.mutate({
          reqData: { ...rowsData, PARENT_TYPE: "" },
          controllerFinal: controllerRef.current,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (Boolean(isTabsError)) {
      enqueueSnackbar((tabsErorr as any)?.error_msg, {
        variant: "error",
      });
    }
  }, [isTabsError]);

  return (
    <Dialog
      open={true}
      fullScreen
      PaperProps={{ style: { background: "var(--theme-color4)" } }}
    >
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
            rowsData?.[0]?.data?.CUSTOMER_ID ?? ""
          }`}
        </Typography>
        <Box>
          <GradientButton
            onClick={() =>
              handleClose(clearTabsCache, rowsData?.[0]?.data?.SR_NO)
            }
            color="primary"
          >
            Close
          </GradientButton>
        </Box>
      </DialogTitle>
      {Boolean(isTabsLoading) || Boolean(getCarousalCards?.isLoading) ? (
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
      <DialogContent sx={{ paddingTop: "10px", paddingBottom: "0px" }}>
        <>
          <DailyTransTabs
            heading={""}
            tabsData={tabsDetails}
            cardsData={cardData}
            reqData={rowsData?.[0]?.data}
          />
          <GridWrapper
            key={`TodaysTransactionTableGrid${isLoading}`}
            finalMetaData={AccountDetailsGridMetadata as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            ReportExportButton={true}
            actions={actions}
            setAction={setCurrentAction}
            loading={isLoading || isFetching}
            onlySingleSelectionAllow={true}
            isNewRowStyle={true}
            defaultSelectedRowId={data?.length > 0 ? data?.[0]?.SR_NO : ""}
          />
        </>
        <Routes>
          <Route
            path="view-details"
            element={
              <FormModal
                onClose={() => navigate(".")}
                formmode={"view"}
                from={""}
              />
            }
          />
        </Routes>
      </DialogContent>
    </Dialog>
  );
};
