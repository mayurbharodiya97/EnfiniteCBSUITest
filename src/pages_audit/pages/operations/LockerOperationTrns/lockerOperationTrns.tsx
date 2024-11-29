import {
  ClearCacheProvider,
  GradientButton,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { Fragment } from "react/jsx-runtime";
import { AppBar, Grid, Toolbar, Typography, Box } from "@mui/material";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "pages_audit/auth";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { t } from "i18next";
import { LockerTrnsFormView } from "./lockerTrnsForm";
import { LockerViewDetailsGrid } from "./lockerViewDetailsGrid";
import { LockerTrnsEntry } from "./lockerTrnsEntry";
import JointDetails from "../payslip-issue-entry/JointDetails";
import { useMutation } from "react-query";
import { getJointDetailsList } from "../payslip-issue-entry/api";
export const dataContext = createContext<any>(null);

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  activeView: {
    flex: 1,
    overflowY: "auto",
  },
  entry: {
    height: "40%",
    overflowY: "scroll",
  },
}));

const LockerOperationTrns = () => {
  let currentPath = useLocation().pathname;
  const headerClasses = useTypeStyles();
  const { authState } = useContext(AuthContext);
  const reqParaRef = useRef<any>({});
  const [payload, setPayload] = useState<any>();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [activeView, setActiveView] = useState<string>("master"); // "master", "detail", or "joint"
  const saveData = (values) => {
    setPayload(values);
  };
  const jointDetailMutation = useMutation(getJointDetailsList, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        message: error?.error_msg,
        messageTitle: "error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data) => {},
  });
  useEffect(() => {
    if (payload?.ACCT_CD && payload?.ACCT_CD !== "") {
      jointDetailMutation.mutate({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        ACCT_CD: payload?.ACCT_CD,
        ACCT_TYPE: payload?.ACCT_TYPE,
      });
    }
  }, [payload?.ACCT_CD]);

  return (
    <Fragment>
      <dataContext.Provider value={{ payload, saveData }}>
        <div>
          <Box className={headerClasses.mainContent}>
            <AppBar position="relative" color="secondary">
              <Toolbar className={headerClasses.root} variant="dense">
                <Typography
                  className={headerClasses.title}
                  color="inherit"
                  variant="h6"
                  component="div"
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      {utilFunction.getDynamicLabel(
                        currentPath,
                        authState?.menulistdata,
                        true
                      )}
                    </Grid>
                    <Grid item>
                      <GradientButton onClick={() => setActiveView("master")}>
                        {t("ViewMaster")}
                      </GradientButton>
                      <GradientButton onClick={() => setActiveView("detail")}>
                        {t("ViewDetails")}
                      </GradientButton>
                      <GradientButton onClick={() => setActiveView("joint")}>
                        {t("JointDetail")}
                      </GradientButton>
                    </Grid>
                  </Grid>
                </Typography>
                <GradientButton>{t("Delete")}</GradientButton>
                <GradientButton>{t("Save")}</GradientButton>
              </Toolbar>
            </AppBar>
            <Box className={headerClasses.activeView}>
              {activeView === "master" && <LockerTrnsFormView />}
              {activeView === "detail" && <LockerViewDetailsGrid />}
              {activeView === "joint" && (
                <JointDetails
                  data={jointDetailMutation?.data}
                  loading={false}
                  onClose={() => {}}
                  hideHeader={true}
                />
              )}
            </Box>

            <Box className={headerClasses.entry}>
              <LockerTrnsEntry />
            </Box>
          </Box>
        </div>
      </dataContext.Provider>
    </Fragment>
  );
};

export const LockerOperationTrnsMain = () => {
  return (
    <Fragment>
      <ClearCacheProvider>
        <LockerOperationTrns />
      </ClearCacheProvider>
    </Fragment>
  );
};
