import { useState, Fragment, useEffect, lazy, useContext, memo } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Content } from "./content";
import { useStyles } from "./style";
import { Profile } from "./pages/profile";
import Dashboard from "./pages/dashboard/dashboard";
import { OperationsMenu } from "./pages/operations";
import AccountDetails from "./pages/STATEMENT/accountDetails";
import { Configuration } from "./pages/configuration";
import DynamicGrids from "./pages/configuration/dynamicGrids";
import Master from "./pages/master/master";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
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
import { Quick_View } from "./appBar/quickView";
import { Notification_App } from "./appBar/notification";
import { IconButton, Tooltip } from "@mui/material";
import { Accountinquiry } from "./acct_Inquiry/acct_inquiry";
import AllScreensGridWrapper from "./pages/allScreens/index";
import CloseScreen from "./appBar/closeScreen";

export const PagesAudit = (props, { columns }) => {
  const [acctInq, setAcctInq] = useState(false);
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
          <AppbarWrapper
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
            optionalComponents={[
              {
                Component: AcctEnqwrapper,
                props: { open: acctInq, setAcctInq },
              },
              { Component: Quick_View },
              // { Component: Notification_App },
              {
                Component:
                  location.pathname.includes("dashboard") ||
                  location.pathname.includes("all-screens")
                    ? () => null
                    : CloseScreen,
              },
            ]}
            hideGreetings={false}
          />
          {/* <AppBar
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
            open={drawerOpen}
            columns={undefined}
          /> */}
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
                  <Route
                    path="all-screens/*"
                    element={<AllScreensGridWrapper />}
                  />
                  <Route path="configuration/*" element={<Configuration />} />
                  <Route path="dynamicgrid/:id/*" element={<DynamicGrids />} />

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
const AcctEnqwrapper = memo<any>(({ open, setAcctInq }) => {
  return (
    <>
      <Tooltip title="Account Inquiry" placement="bottom" arrow>
        <IconButton
          // renderIcon="PersonSearchOutlined"
          onClick={() => setAcctInq(true)}
          sx={{
            backgroundColor: open
              ? "var(--theme-color3)"
              : "rgba(235, 237, 238, 0.45)",
            color: open ? "var(--theme-color2)" : "var(--theme-color3)",
            borderRadius: "10px",
            height: "30px",
            width: "30px",
            "&:hover": {
              background: "var(--theme-color2)",
              borderRadius: "10px",
              transition: "all 0.2s ease 0s",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              "& .MuiSvgIcon-root": {
                height: "32px",
                width: "32px",
                transition: "all 0.2s ease 0s",
                padding: "4px",
              },
            },
          }}
        >
          <PersonSearchOutlinedIcon
            fontSize="small"
            sx={{
              color: open ? "var(--theme-color2)" : "var(--theme-color3)",
            }}
          />
        </IconButton>
      </Tooltip>
      {open && <Accountinquiry open={open} onClose={() => setAcctInq(false)} />}
    </>
  );
});
