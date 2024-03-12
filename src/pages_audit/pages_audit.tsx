import { useState, Fragment, useEffect, useContext } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AppBar } from "./appBar";
import { Drawer } from "./drawer";
import { MySideBar } from "./sideBar";
import { Content } from "./content";
// import "react-perfect-scrollbar/dist/css/styles.css";
import { useStyles } from "./style";
import { Profile } from "./pages/profile";
import Dashboard from "./pages/dashboard/dashboard";
import { OperationsMenu } from "./pages/operations";
import AccountDetails from "./pages/STATEMENT/accountDetails";
import { Configuration } from "./pages/configuration";
import DynamicGrids from "./pages/configuration/dynamicGrids";
import Trn001 from "./pages/operations/DailyTransaction/TRN001";
import Trn002 from "./pages/operations/DailyTransaction/TRN002";
import { AccDetailContext } from "./auth";
import { DailyTransTabsWithDialog } from "./pages/operations/DailyTransaction/TRNHeaderTabs/DailyTransTabs";

export const PagesAudit = (props, { columns }) => {
  const location = useLocation();
  const [drawerOpen, setDrawerState] = useState(true);
  const { cardStore, setCardStore } = useContext(AccDetailContext);
  const classes = useStyles();
  const isValidURL = props?.isValidURL ?? true;

  const handleDrawerOpen = () => {
    setDrawerState(true);
    handleCardStateUpdate();
  };
  const handleDrawerClose = () => {
    setDrawerState(false);
    handleCardStateUpdate();
  };
  const handleCardStateUpdate = () => {
    //to update the state once | carousal responsiveness
    let obj = { random: Math.random() };
    setCardStore({ ...cardStore, obj });
  };

  useEffect(() => {
    if (location.pathname === "/cbsenfinity/dashboard") {
      handleDrawerOpen();
    } else if (location.pathname) {
      handleDrawerClose();
    } else {
      handleDrawerOpen();
    }
  }, [location.pathname]);

  return (
    <Fragment>
      <div className={classes.root}>
        {/* {alert("Test")} */}
        <AppBar
          open={drawerOpen}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
          columns={columns}
        />
        <Drawer
          open={drawerOpen}
          handleDrawerClose={handleDrawerClose}
          handleDrawerOpen={handleDrawerOpen}
        >
          <MySideBar handleDrawerOpen={handleDrawerOpen} open={drawerOpen} />
        </Drawer>
        <Content>
          <Routes>
            {isValidURL ? (
              <>
                {/* <Route
                  path="all-screens/*"
                  element={<AllScreensGridWrapper />}
                /> */}
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard/*" element={<Dashboard />} />
                <Route path="operation/*" element={<OperationsMenu />} />
                <Route path="view-statement/*" element={<AccountDetails />} />
                <Route
                  path="searching/*"
                  element={<DailyTransTabsWithDialog />}
                />
                <Route path="configuration/*" element={<Configuration />} />
                <Route path="dynamicgrid/:id*" element={<DynamicGrids />} />
                <Route path="operation/daily_tran_F1" element={<Trn001 />} />
                <Route
                  path="operation/cnf_daily_tran_F2"
                  element={<Trn002 />}
                />

                {/* <Route
                  path="branch-selection/*"
                  element={<BranchSelectionGridWrapper  />}
                /> */}
              </>
            ) : null}
            <Route
              path="*"
              element={<RedirectComponent isValidURL={isValidURL} />}
            />
          </Routes>
          {/* <div
            style={{
              position: "absolute",
              right: "0px",
              bottom: "0px",
              zIndex: "1501",
            }}
          >
            <ChatMessageBox />Switch 
          </div> */}
        </Content>
      </div>
    </Fragment>
  );
};

const RedirectComponent = ({ isValidURL }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/cbsenfinity") {
      navigate("/cbsenfinity/dashboard");
      // } else if (!isValidURL) {
      //   navigate("/error");
    } else {
      navigate(location.pathname);
    }
  }, [navigate, location.pathname]);
  return null;
};
