import { cloneElement, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./authContext";
import { useIdleTimer } from "react-idle-timer";
import { useSnackbar } from "notistack";
import { utilFunction } from "components/utils";
export const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoggedIn, logout, authState } = useContext(AuthContext);
  const isTimeoutData = useMemo(() => {
    let timeout = Number(process?.env?.REACT_APP_IDLE_TIMEOUT ?? 0);
    if (isNaN(timeout) || timeout <= 0) {
      timeout = 300000;
    } else {
      timeout = timeout * 1000;
    }
    return timeout;
  }, []);
  // console.log("isTimeoutData=>", isTimeoutData);
  const onIdle = () => {
    console.log("logout");
    alert("logout");
    logout();
  };

  const onActive = (event) => {
    //console.log("onActive");
  };
  const onAction = (event) => {
    //console.log("onAction =>", idleTimer.isPrompted(), !idleTimer.isIdle());
    if (idleTimer.isPrompted() && !idleTimer.isIdle()) {
      idleTimer.start();
    }
  };
  const onPrompt = () => {
    showMessageForIdeal();
  };
  const idleTimer = useIdleTimer({
    timeout: isTimeoutData,
    promptTimeout: 30000,
    onIdle,
    onActive,
    onAction,
    onPrompt,
    crossTab: true,
    leaderElection: true,
  });
  const showMessageForIdeal = () => {
    enqueueSnackbar(
      "Your Session is Timeout After " +
        idleTimer.getRemainingTime() / 1000 +
        " Sec.",
      {
        variant: "warning",
      }
    );
  };
  //console.log(idleTimer);
  useEffect(() => {
    if (!isLoggedIn()) {
      //console.log("isLoggedIn()=>", isLoggedIn());
      navigate("/cbsenfinity/login");
    }
  }, [navigate, isLoggedIn]);
  const allActiveURL = useMemo(() => {
    return utilFunction.GetAllChieldMenuData(authState.menulistdata, false);
  }, [authState.menulistdata]);
  const isValidateURL = (allActiveURL, thisURL) => {
    //console.log(thisURL, (thisURL || "").length);
    if ((thisURL || "").length < 12) {
      return true;
    }
    let urldata = thisURL.substring(12);
    let isReturn = false;
    allActiveURL.forEach((item, index) => {
      if (urldata.startsWith(item.href)) {
        //console.log(item.href, urldata, index);
        isReturn = true;
        return;
      }
    });
    return isReturn;
  };

  const isValidURL = useMemo(() => {
    if (
      window.location.pathname === "/netbanking" ||
      window.location.pathname === "/netbanking/dashboard" ||
      window.location.pathname === "/netbanking/profile" ||
      window.location.pathname === "/netbanking/branch-selection" ||
      isValidateURL(allActiveURL, window.location.pathname)
    ) {
      return true;
    }
    return false;
  }, [window.location.pathname]);
  let newChildren = cloneElement(children, { isValidURL: isValidURL });
  if (isLoggedIn()) {
    //cloneElement()
    return newChildren;
  }
  return null;
};
// const ProtectedRoutesDefault = ProtectedRoutes;
// export default ProtectedRoutesDefault;
