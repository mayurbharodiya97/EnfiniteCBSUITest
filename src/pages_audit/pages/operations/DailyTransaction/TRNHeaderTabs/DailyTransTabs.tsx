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
  useMemo,
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
import { GridMetaDataType } from "components/dataTableStatic/types";
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
import { queryClient } from "cache";
import { MyAppBar } from "pages_audit/appBar/appBar";
import DialogWithAppbar from "components/custom/dialogWithAppbar";
import { t } from "i18next";

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
  hideCust360Btn?: boolean;
}

export const DailyTransTabs = ({
  heading,
  tabsData,
  cardsData,
  reqData,
  hideCust360Btn,
}: DailyTransTabsProps) => {
  const [tabValue, setTabValue] = React.useState(0);
  const navArray = tabsData ? tabsData : [];
  const [detail, setDetail] = useState<any>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setTabValue(0);
  }, [navArray]);
  const getCardColumnValue = () => {
    const keys = [
      "WITHDRAW_BAL",
      "TRAN_BAL",
      "LIEN_AMT",
      "CONF_BAL",
      "UNCL_BAL",
      "DRAWING_POWER",
      "LIMIT_AMOUNT",
      "HOLD_BAL",
      "AGAINST_CLEARING",
      "MIN_BALANCE",
      "OD_APPLICABLE",
      "INST_NO",
      "INST_RS",
      "OP_DATE",
      "PENDING_AMOUNT",
      "ACCT_NM",
    ];

    const cardValues = keys?.reduce((acc, key) => {
      const item: any = cardsData?.find(
        (entry: any) => entry?.COL_NAME === key
      );
      acc[key] = item?.COL_VALUE;
      return acc;
    }, {});
    setDetail(cardValues);
    return cardValues;
  };
  useEffect(() => {
    if (reqData) {
      getCardColumnValue();
    }
  }, [reqData]);

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
                      <CommonSvgIcons iconName={"ACCOUNT"} />
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
                {a?.TAB_NAME.includes("SI") && <SIDetail reqData={reqData} />}
                {a?.TAB_NAME.includes("LIEN") && (
                  <LienDetail reqData={reqData} />
                )}
                {a?.TAB_NAME.match("OUTWARD") && <OW_Chq reqData={reqData} />}
                {a?.TAB_NAME.includes("TEMPOD") && <Temp reqData={reqData} />}
                {a?.TAB_NAME.includes("ATM") && <ATM reqData={reqData} />}
                {a?.TAB_NAME.match("IMPS") && <IMPS reqData={reqData} />}
                {a?.TAB_NAME.includes("ASBA") && <ASBA reqData={reqData} />}
                {a?.TAB_NAME.includes("ACHIW") && <ACH_IW reqData={reqData} />}
                {a?.TAB_NAME.includes("ACHOW") && <ACH_OW reqData={reqData} />}
                {a?.TAB_NAME.includes("SPINST") && (
                  <Instruction reqData={reqData} />
                )}
                {a?.TAB_NAME.includes("GRPAC") && <Group reqData={reqData} />}
                {a?.TAB_NAME.includes("APY") && <APY reqData={reqData} />}
                {a?.TAB_NAME.includes("APBS") && <APBS reqData={reqData} />}
                {a?.TAB_NAME.includes("PMBY") && <PMBY reqData={reqData} />}
                {a.TAB_NAME.includes("ACCOUNT") && (
                  <AccDetails
                    cardsData={cardsData}
                    hideCust360Btn={hideCust360Btn}
                  />
                )}
                {a.TAB_NAME.includes("JOINT") && (
                  <JointDetailsForm
                    reqData={{ ...reqData, ACCT_NM: detail?.ACCT_NM }}
                  />
                )}
                {a.TAB_NAME.includes("TODAYS") && (
                  <TodayTransactionForm reqData={reqData} />
                )}
                {a.TAB_NAME.includes("CHQ") && <CheckBook reqData={reqData} />}
                {a.TAB_NAME.includes("SNAPSHOT") && (
                  <Snapshot reqData={reqData} />
                )}
                {a.TAB_NAME.includes("HOLDCHRG") && (
                  <HoldCharge reqData={reqData} />
                )}
                {a.TAB_NAME.includes("DOCS") && <Document reqData={reqData} />}
                {a.TAB_NAME.includes("STOP") && <StopPay reqData={reqData} />}
                {a.TAB_NAME.includes("INSU") && <Insurance reqData={reqData} />}
                {a.TAB_NAME.includes("DISBDTL") && (
                  <Disbursement reqData={reqData} />
                )}
                {a.TAB_NAME.includes("SUBSIDY") && (
                  <Subsidyy reqData={reqData} />
                )}
                {/* {a.TAB_NAME.includes("Search") && <Search reqData={reqData} />} */}
                {a.TAB_NAME.includes("LIMIT") && (
                  <Limit reqData={{ ...reqData, ACCT_NM: detail?.ACCT_NM }} />
                )}
                {a.TAB_NAME.includes("STOCK") && <Stock reqData={reqData} />}
              </>
            </TabPanel>
          ))
        ) : (
          <TabPanel value={tabValue} index={0}>
            <AccDetails cardsData={cardsData} hideCust360Btn={hideCust360Btn} />
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
  console.log("sjicfbsjbdcjsc", "avcuivhbadavbjbasjdksvbdj");
  const [cardData, setCardsData] = useState<any>([]);
  const [updatedMtdata, setUpdatedMtdata] = useState<any>({});
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

  // const memoizedMetadata = useMemo(() => {
  //   return AccountDetailsGridMetadata;
  // }, []);

  // const updatedMetadataFn = useCallback(() => {
  //   const updatedMetadata = {
  //     ...memoizedMetadata,
  //     gridConfig: {
  //       ...memoizedMetadata.gridConfig,
  //       gridLabel:
  //         data?.length > 0
  //           ? t("AccountDetails") + "-" + t("TotalNoOfRecords") + data?.length
  //           : t("AccountDetails"),
  //     },
  //   };
  //   return updatedMetadata;
  // }, [memoizedMetadata, data, t]);
  const updatedMetadata = {
    ...AccountDetailsGridMetadata,
    gridConfig: {
      ...AccountDetailsGridMetadata.gridConfig,
      gridLabel:
        data?.length > 0
          ? t("AccountDetails") + "-" + t("TotalNoOfRecords") + data?.length
          : t("AccountDetails"),
    },
  };

  // useEffect(() => {
  //   const data = updatedMtdata;
  //   console.log(data, "dfjubdfjdjfjbdjf");
  // }, [updatedMtdata]);

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
  useEffect(() => {
    console.log(updatedMtdata, "updatedMtdataupdatedMtdataupdatedMtdata");
  }, [updatedMtdata]);

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

  useEffect(() => {
    return () => {
      clearTabsCache();
      queryClient.removeQueries("getAcctDtlList");
      // queryClient.removeQueries("getTabsByParentType");
      // queryClient.removeQueries("getCarousalCards");
      queryClient.removeQueries("getSIDetailList");
      queryClient.removeQueries("getLienDetailList");
      queryClient.removeQueries("getOWChqList");
      queryClient.removeQueries("getTempList");
      queryClient.removeQueries("getATMList");
      queryClient.removeQueries("getASBAList");
      queryClient.removeQueries("getACH_IWList");
      queryClient.removeQueries("getACH_OWList");
      queryClient.removeQueries("getInstructionList");
      queryClient.removeQueries("getGroupList");
      queryClient.removeQueries("getAPYList");
      queryClient.removeQueries("getAPBSList");
      queryClient.removeQueries("getPMBYList");
      queryClient.removeQueries("getJointDetailsList");
      queryClient.removeQueries("getTodayTransList");
      queryClient.removeQueries("getCheckDetailsList");
      queryClient.removeQueries("getSnapShotList");
      queryClient.removeQueries("getHoldChargeList");
      queryClient.removeQueries("getDocTemplateList");
      queryClient.removeQueries("getStopPayList");
      queryClient.removeQueries("getInsuranceList");
      // queryClient.removeQueries("Disbursement");
      queryClient.removeQueries("getDisbursementList");
      queryClient.removeQueries("getSubsidyList");
      queryClient.removeQueries("getSearchList");
      queryClient.removeQueries("getLimitList");
      queryClient.removeQueries("getStockList");
    };
  }, []);

  return (
    <DialogWithAppbar
      open={true}
      paperProps={{ style: { background: "var(--theme-color4)" } }}
      // title={
      //   <>
      //     <Typography
      //       sx={{
      //         fontWeight: 500,
      //         fontSize: "1.25rem",
      //         lineHeight: 1.6,
      //         letterSpacing: "0.0075em",
      //         color: "#fff",
      //       }}
      //     >
      //       {`Account Details For Customer ID : ${
      //         rowsData?.[0]?.data?.CUSTOMER_ID ?? ""
      //       }`}
      //     </Typography>
      //     <Box>
      //       <GradientButton onClick={() => handleClose()} color="primary">
      //         Close
      //       </GradientButton>
      //     </Box>
      //   </>
      // }
      content={
        <>
          <DailyTransTabs
            heading={""}
            tabsData={tabsDetails}
            cardsData={cardData}
            reqData={rowsData?.[0]?.data}
            hideCust360Btn={true}
          />
          {Boolean(isTabsLoading) || Boolean(getCarousalCards?.isLoading) ? (
            <LinearProgress
              sx={{
                // margin: "4px 32px 0 32px",
                background: "var(--theme-color6)",
                "& .MuiLinearProgress-bar": {
                  background: "var(--theme-color1) !important",
                },
              }}
            />
          ) : null}
          <GridWrapper
            key={`TodaysTransactionTableGrid${isLoading}`}
            finalMetaData={updatedMetadata as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            ReportExportButton={true}
            actions={[]}
            setAction={setCurrentAction}
            loading={isLoading || isFetching}
            onlySingleSelectionAllow={true}
            isNewRowStyle={true}
            defaultSelectedRowId={data?.length > 0 ? data?.[0]?.SR_NO : ""}
            hideActionBar={true}
          />
          {/* <Routes>
            <Route
              path="view-details"
              element={
                <CkycProvider>
                  <FormModal
                    onClose={() => {
                      console.log("closing....");
                      navigate(".");
                    }}
                    formmode={"new"}
                    from={"new-entry"}
                  />
                  <p>asdasd</p>
                  // <FormModal
                  //   onClose={() => {
                  //     navigate(".");
                  //   }}
                  //   formmode={"new"}
                  //   from={"new-entry"}
                  // />
                </CkycProvider>
              }
            />
          </Routes> */}
        </>
      }
      actions={
        <>
          <GradientButton onClick={() => handleClose()}>
            {t("Close")}
          </GradientButton>
          {/* <GradientButton
            onClick={() =>
              navigate("operations/ckyc/view-details", {
                state: {
                  isFormModalOpen: true,
                  entityType: "I",
                  isFreshEntry: true,
                },
              })
            }
            color="primary"
          >
            Customer Details
          </GradientButton> */}
        </>
      }
      // {/* <DialogTitle
      //   sx={{
      //     display: "flex",
      //     justifyContent: "space-between",
      //     background: "var(--theme-color5)",
      //     margin: "10px 32px 0px 32px",
      //     alignItems: "center",
      //     height: "7vh",
      //     boxShadow:
      //       "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      //   }}
      // >
      //   <Typography
      //     sx={{
      //       fontWeight: 500,
      //       fontSize: "1.25rem",
      //       lineHeight: 1.6,
      //       letterSpacing: "0.0075em",
      //       color: "#fff",
      //     }}
      //   >
      //     {`Account Details For Customer ID : ${
      //       rowsData?.[0]?.data?.CUSTOMER_ID ?? ""
      //     }`}
      //   </Typography>

      // </DialogTitle> */}
      // {Boolean(isTabsLoading) || Boolean(getCarousalCards?.isLoading) ? (
      //   <LinearProgress
      //     sx={{
      //       margin: "4px 32px 0 32px",
      //       background: "var(--theme-color6)",
      //       "& .MuiLinearProgress-bar": {
      //         background: "var(--theme-color1) !important",
      //       },
      //     }}
      //   />
      // ) : null}
      // <DialogContent sx={{ paddingTop: "10px", paddingBottom: "0px" }}>
      //   <>
      //     <DailyTransTabs
      //       heading={""}
      //       tabsData={tabsDetails}
      //       cardsData={cardData}
      //       reqData={rowsData?.[0]?.data}
      //     />
      //     <GridWrapper
      //       key={`TodaysTransactionTableGrid${isLoading}`}
      //       finalMetaData={AccountDetailsGridMetadata as GridMetaDataType}
      //       data={data ?? []}
      //       setData={() => null}
      //       ReportExportButton={true}
      //       actions={[]}
      //       setAction={setCurrentAction}
      //       loading={isLoading || isFetching}
      //       onlySingleSelectionAllow={true}
      //       isNewRowStyle={true}
      //       defaultSelectedRowId={data?.length > 0 ? data?.[0]?.SR_NO : ""}
      //     />
      //   </>
      //   <Routes>
      //     <Route
      //       path="view-details"
      //       element={
      //         <CkycProvider>
      //           <FormModal
      //             onClose={() => {
      //               navigate(".");
      //             }}
      //             formmode={"new"}
      //             from={"new-entry"}
      //           />
      //         </CkycProvider>
      //       }
      //     />
      //   </Routes>
      // </DialogContent>
    />
  );
};
