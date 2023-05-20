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

export const PagesAudit = (props) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerState] = useState(true);
  const handleDrawerOpen = () => setDrawerState(true);
  const handleDrawerClose = () => setDrawerState(false);
  const isValidURL = props?.isValidURL ?? true;
  return (
    <Fragment>
      <div className={classes.root}>
        {/* {alert("Test")} */}
        <AppBar open={drawerOpen} handleDrawerOpen={handleDrawerOpen} />
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
                {/* <Route
                  path="branch-selection/*"
                  element={<BranchSelectionGridWrapper />}
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
    if (location.pathname === "/netbanking") {
      navigate("/netbanking/branch-selection");
      // } else if (!isValidURL) {
      //   navigate("/error");
    } else {
      navigate(location.pathname);
    }
  }, [navigate, location.pathname]);
  return null;
};
