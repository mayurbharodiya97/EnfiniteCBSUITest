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

  const onIdle = () => {
    logout();
  };

  const onActive = (event) => {};
  const onAction = (event) => {
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

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/netbanking/login");
    }
  }, [navigate, isLoggedIn]);
  const allActiveURL = useMemo(() => {
    return utilFunction.GetAllChieldMenuData(authState.menulistdata, false);
  }, [authState.menulistdata]);
  const isValidateURL = (allActiveURL, thisURL) => {
    if ((thisURL || "").length < 12) {
      return true;
    }
    let urldata = thisURL.substring(12);
    let isReturn = false;
    allActiveURL.forEach((item, index) => {
      if (urldata.startsWith(item.href)) {
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
