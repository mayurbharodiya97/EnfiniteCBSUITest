import { useState, Fragment, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AppBar } from "./appBar";
import { Drawer } from "./drawer";
import { MySideBar } from "./sideBar";
import { Content } from "./content";
// import "react-perfect-scrollbar/dist/css/styles.css";
import { useStyles } from "./style";
import { AllScreensGridWrapper } from "./pages/allScreens";
import { Profile } from "./pages/profile";
import Dashboard from "./pages/dashboard/dashboard";
import { BranchSelectionGridWrapper } from "./auth/branchSelection";
import { OperationsMenu } from "./pages/operations";
import AccountDetails from "./pages/STATEMENT/accountDetails";
import { MastersMenu } from "./pages/master";
import { Configuration } from "./pages/configuration";
import DynamicGrids from "./pages/configuration/dynamicGrids";
import CkycProvider from "./pages/operations/c-kyc/CkycContext";
import Trn001 from "./pages/operations/DailyTransaction/TRN001";
import Trn002_Table from "./pages/operations/DailyTransaction/TRN002";

export const PagesAudit = (props, { columns }) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerState] = useState(true);
  const handleDrawerOpen = () => setDrawerState(true);
  const handleDrawerClose = () => setDrawerState(false);
  const isValidURL = props?.isValidURL ?? true;

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
            {isValidURL || true ? (
              <>
                {/* <Route
                  path="all-screens/*"
                  element={<AllScreensGridWrapper />}
                /> */}
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard/*" element={<Dashboard />} />
                <Route
                  path="operation/*"
                  element={
                    <CkycProvider>
                      <OperationsMenu />
                    </CkycProvider>
                  }
                />
                <Route path="view-statement/*" element={<AccountDetails />} />
                <Route path="grid/*" element={<MastersMenu />} />
                <Route path="configuration/*" element={<Configuration />} />
                <Route path="dynamicgrid/:id*" element={<DynamicGrids />} />
                <Route
                  path="operation/teller_daily_tran"
                  element={<Trn001 />}
                />
                <Route
                  path="operation/teller_daily_tran_cnf_F2"
                  element={<Trn002_Table />}
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
