import { useState, Fragment, useEffect, lazy, useContext } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Content } from "./content";
import { useStyles } from "./style";
import { Profile } from "./pages/profile";
import Dashboard from "./pages/dashboard/dashboard";
import { OperationsMenu } from "./pages/operations";
import AccountDetails from "./pages/STATEMENT/accountDetails";
import { Configuration } from "./pages/configuration";
import DynamicGrids from "./pages/configuration/dynamicGrids";
import Trn001 from "./pages/operations/DailyTransaction/TRN001";
import Trn002 from "./pages/operations/DailyTransaction/TRN002";
import TRN368 from "./pages/operations/DailyTransaction/CashExchange/TRN368/TRN368";
import TRN043 from "./pages/operations/DailyTransaction/CashExchange/TRN043/TRN043";
import TRN044 from "./pages/operations/DailyTransaction/CashExchange/TRN044/TRN044";
import Master from "./pages/master/master";
import TRN001Provider from "./pages/operations/DailyTransaction/TRN001/Trn001Reducer";
// import { AccDetailContext } from "./auth";
import { AuthContext } from "./auth";
import { AuthContextProvider } from "@acuteinfo/common-base";
import { MultiLanguages } from "./auth/multiLanguages";
import SearchScreen from "./appBar/searchScreen";
import { AppbarWrapper, SidebarWrapper } from "@acuteinfo/common-screens";
import Logo from "assets/images/easy_bankcore_Logo.png";
import useLogoPics from "components/logoPics/logoPics";
import { LogoutModal } from "./appBar/logoutModal";
import { AppBar } from "./appBar";

export const PagesAudit = (props, { columns }) => {
  const { authState } = useContext(AuthContext);
  const location = useLocation();
  const [drawerOpen, setDrawerState] = useState(true);
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const logos = useLogoPics();
  const [logoutOpen, setLogoutOpen] = useState(false);
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
    // setCardStore({ ...cardStore, obj });
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
      <AuthContextProvider authState={authState}>
        <div className={classes.root}>
          {/* <AppbarWrapper
            authState={authController?.authState}
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
            navigate={navigate}
            open={drawerOpen}
            dashboardUrl="./dashboard"
            LanguageComponent={MultiLanguages}
            SearchComponent={SearchScreen}
            bankLogo={Logo}
            handleLogout={() => setLogoutOpen(true)}
            handleProfile={() => navigate("./profile")}
            logos={logos}
            profilePic={
              Boolean(authController?.getProfileImage)
                ? authController?.getProfileImage
                : logos?.profile
            }
            menuIconPosition="left"
            hideGreetings={false}
          /> */}
          <AppBar
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
            open={drawerOpen}
            columns={undefined}
          />
          <SidebarWrapper
            authState={authController?.authState ?? {}}
            handleDrawerOpen={handleDrawerOpen}
            open={drawerOpen}
            navigate={navigate}
            rootUrl="cbsenfinity"
            dashboardUrl="dashboard"
          />
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
                  <Route path="master/*" element={<Master />} />
                  <Route path="operation/*" element={<OperationsMenu />} />
                  <Route path="view-statement/*" element={<AccountDetails />} />
                  <Route path="configuration/*" element={<Configuration />} />
                  <Route path="dynamicgrid/:id*" element={<DynamicGrids />} />
                  <Route
                    path="operation/daily_tran_F1"
                    element={
                      <TRN001Provider>
                        <Trn001 />
                      </TRN001Provider>
                    }
                  />
                  <Route
                    path="operation/cnf_daily_tran_F2"
                    element={
                      <TRN001Provider>
                        <Trn002 />
                      </TRN001Provider>
                    }
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
              <Route path="cash/368" element={<TRN368 />} />
              <Route path="cash/043" element={<TRN043 />} />
              <Route path="cash/044" element={<TRN044 />} />
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
            {logoutOpen ? (
              <LogoutModal
                logoutOpen={logoutOpen}
                setLogoutOpen={setLogoutOpen}
              />
            ) : null}
          </Content>
        </div>
      </AuthContextProvider>
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
