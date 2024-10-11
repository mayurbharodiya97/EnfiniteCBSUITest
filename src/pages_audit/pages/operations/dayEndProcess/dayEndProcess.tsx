import React, { useContext, useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { PendinGTrns } from "./pendingTransactions";
import { VerifyDayendChecksums } from "./verifyDayendChecksums";
import { t } from "i18next";
import {
  ClearCacheProvider,
  queryClient,
  GradientButton,
  usePopupContext,
} from "@acuteinfo/common-base";

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
}));

const DayEndProcess = () => {
  const headerClasses = useTypeStyles();
  const { authState } = useContext(AuthContext);
  const [openPendingTrns, setOpenPendingTrns] = useState(false);
  const [openDayendProcess, setOpenDayendProcess] = useState(false);
  const [openVerifyChecksums, setOpenVerifyChecksums] = useState(false);
  const { MessageBox } = usePopupContext();

  const { data, isLoading, isError, error } = useQuery(
    ["getDayendprocessFlag"],
    () =>
      API.getDayendprocessFlag({
        ENT_COMP_CD: authState?.companyID,
        ENT_BRANCH_CD: authState?.user?.branchCode,
        BASE_COMP_CD: authState?.baseCompanyID,
        BASE_BRANCH_CD: authState?.user?.baseBranchCode,
        A_GD_DATE: authState?.workingDate,
      }),
    {
      onError: (error) => {
        console.error("Error fetching day end process flag:", error);
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDayendprocessFlag"]);
    };
  }, []);

  const handleOpenPendingTrns = async () => {
    try {
      const btnName = await MessageBox({
        message: t("PendingTrnsProceed"),
        messageTitle: "Confirmation",
        buttonNames: ["Yes", "No"],
      });
      if (btnName === "Yes") {
        setOpenPendingTrns(true);
      }
    } catch (err) {
      console.error("Error in MessageBox:", err);
    }
  };
  let isHOLoggined =
    authState?.user?.branchCode === authState?.user?.baseBranchCode
      ? true
      : false;
  console.log(isHOLoggined, "isHOLoggined");
  console.log(
    data && data[0]?.EOD_FLAG === "H" ? t("DayHandover") : t("DayEnd")
  );

  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar className={headerClasses.root} variant="dense">
          <Typography
            className={headerClasses.title}
            color="inherit"
            variant="h6"
            component="div"
          >
            {"Day End Process (TRN/399)"}
          </Typography>
          <GradientButton onClick={handleOpenPendingTrns} color={"primary"}>
            {t("PendingTransactions")}
          </GradientButton>
          <GradientButton
            onClick={() => setOpenDayendProcess(true)}
            color={"primary"}
          >
            {data && data[0]?.EOD_FLAG === "H" ? t("DayHandover") : t("DayEnd")}
          </GradientButton>
          <GradientButton
            onClick={() => setOpenVerifyChecksums(true)}
            color={"primary"}
          >
            {t("VerifyDayEndChecksums")}
          </GradientButton>
        </Toolbar>
      </AppBar>
      {openPendingTrns && (
        <PendinGTrns
          open={openPendingTrns}
          close={() => setOpenPendingTrns(false)}
        />
      )}
      {openDayendProcess && (
        <VerifyDayendChecksums
          open={openDayendProcess}
          close={() => {
            setOpenDayendProcess(false);

            API.updateEodRunningStatus({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              FLAG: "N",
            }).catch((err) => console.error("Error updating EOD status:", err));
          }}
          flag={"D"}
          processFlag={
            data && data[0]?.EOD_FLAG === "H" ? t("DayHandover") : t("DayEnd")
          }
          isHOLoggined={isHOLoggined}
        />
      )}
      {openVerifyChecksums && (
        <VerifyDayendChecksums
          open={openVerifyChecksums}
          close={() => {
            setOpenVerifyChecksums(false);

            API.updateEodRunningStatus({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              FLAG: "N",
            }).catch((err) => console.error("Error updating EOD status:", err));
          }}
          flag={"C"}
          processFlag={
            data && data[0]?.EOD_FLAG === "H" ? t("DayHandover") : t("DayEnd")
          }
          isHOLoggined={isHOLoggined}
        />
      )}
    </>
  );
};

export const DayEndProcessMain = () => (
  <ClearCacheProvider>
    <DayEndProcess />
  </ClearCacheProvider>
);