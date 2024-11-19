import { MessageBoxWrapper, utilFunction } from "@acuteinfo/common-base";
import { Fragment, cloneElement, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "./authContext";
import { useIdleTimer } from "react-idle-timer";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { useMutation } from "react-query";
import { saveRecentScreenData } from "./api";
export const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    isLoggedIn,
    logout,
    authState,
    isBranchSelected,
    message,
    closeMessageBox,
  } = useContext(AuthContext);

  const isTimeoutData = useMemo(() => {
    let timeout = Number(process?.env?.REACT_APP_IDLE_TIMEOUT ?? 0);
    if (isNaN(timeout) || timeout <= 0) {
      timeout = Number(authState?.idealTimer);
      // timeout = 300000;
    } else {
      timeout = timeout * 1000;
    }
    return timeout;
  }, []);
  // console.log("isTimeoutData=>", isTimeoutData);
  const onIdle = () => {
    console.log("logout-due-to onIdle call");
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
    } else if (!isBranchSelected()) {
      navigate("/cbsenfinity/branch-selection");
    }
  }, [navigate, isLoggedIn, isBranchSelected]);
  const allActiveURL = useMemo(() => {
    return utilFunction.GetAllChieldMenuData(authState.menulistdata, false);
  }, [authState.menulistdata]);
  const isValidateURL = (allActiveURL, thisURL) => {
    //console.log(thisURL, (thisURL || "").length);
    if ((thisURL || "").length < 13) {
      return true;
    }

    let urldata = thisURL.substring(13);
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
  const saveCurrScrDt = useMutation(saveRecentScreenData, {
    onError: (error: any) => {},
    onSuccess: (response: any) => {},
  });

  const allScreenData = useMemo(() => {
    let responseData = utilFunction.GetAllChieldMenuData(
      authState?.menulistdata,
      true
    );
    return responseData;
  }, [authState.menulistdata]);

  const splitPath = location.pathname.split("/");
  const extractPath =
    splitPath.length >= 4 ? `${splitPath[2]}/${splitPath[3]}` : splitPath[2];

  useEffect(() => {
    const allScreenMatch = allScreenData.find(
      (item) => item.href === extractPath
    );
    const ScreenMatch = authState.menulistdata.find(
      (item) => item.href === extractPath
    );

    if (allScreenMatch || ScreenMatch) {
      const userCode = allScreenMatch?.user_code;
      if (userCode) {
        console.log(authState.uniqueAppId);

        saveCurrScrDt.mutate({
          branchCode: authState.user.branchCode,
          flag: "I",
          docCd: userCode,
          uniqueAppId: authState.uniqueAppId,
          tranDt: authState.workingDate,
          closeTime: "",
          openTime: format(new Date(), "yyyy-MM-dd hh:mm:ss.S"),
        });
      }
      return () => {
        if (userCode) {
          saveCurrScrDt.mutate({
            branchCode: authState.user.branchCode,
            flag: "U",
            docCd: userCode,
            uniqueAppId: authState.uniqueAppId,
            tranDt: authState.workingDate,
            closeTime: format(new Date(), "yyyy-MM-dd hh:mm:ss.S"),
            openTime: "",
          });
        }
      };
    }
  }, [location.search, extractPath]);

  const isValidURL = useMemo(() => {
    if (
      window.location.pathname === "/cbsenfinity" ||
      window.location.pathname === "/cbsenfinity/dashboard" ||
      window.location.pathname === "/cbsenfinity/profile" ||
      window.location.pathname === "/cbsenfinity/view-statement" ||
      window.location.pathname === "/cbsenfinity/branch-selection" ||
      window.location.pathname === "/cbsenfinity/change-branch" ||
      window.location.pathname === "/cbsenfinity/forgot-totp" ||
      isValidateURL(allActiveURL, window.location.pathname)
    ) {
      return true;
    }
    return false;
  }, [window.location.pathname]);
  let newChildren = cloneElement(children, { isValidURL: isValidURL });
  if (isLoggedIn()) {
    //cloneElement()
    return (
      <Fragment>
        {newChildren}
        {message?.isOpen ? (
          <MessageBoxWrapper
            validMessage={message?.messageTitle ?? "Information"}
            //  Message={message?.message ?? "No Message"}
            onActionYes={() => {
              closeMessageBox();
            }}
            onActionNo={() => {}}
            rows={[]}
            //buttonNames={message?.buttonNames ?? ["OK"]}
            isOpen={true}
          />
        ) : null}
      </Fragment>
    );
  }
  return null;
};
// const ProtectedRoutesDefault = ProtectedRoutes;
// export default ProtectedRoutesDefault;
