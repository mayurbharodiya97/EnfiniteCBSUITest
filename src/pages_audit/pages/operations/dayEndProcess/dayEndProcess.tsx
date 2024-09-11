import { AppBar, CircularProgress, Toolbar, Typography } from "@mui/material";
import { ClearCacheProvider, queryClient } from "cache";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { GradientButton } from "components/styledComponent/button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { PendinGTrns } from "./pendingTransactions";
import { usePopupContext } from "components/custom/popupContext";
import { VerifyDayendChecksums } from "./verifyDayendChecksums";
import { t } from "i18next";

const useTypeStyles: any = makeStyles((theme: Theme) => ({
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
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [openDayendProcess, setOpenDayendProcess] = useState(false);
  const [openVerifyChecksums, setOpenVerifyChecksums] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: slipdataRefetch,
  } = useQuery<any, any>(["getDayendprocessFlag"], () =>
    API.getDayendprocessFlag({
      ENT_COMP_CD: authState?.companyID,
      ENT_BRANCH_CD: authState?.user?.branchCode,
      BASE_COMP_CD: authState?.baseCompanyID,
      BASE_BRANCH_CD: authState?.user?.baseBranchCode,
      A_GD_DATE: authState?.workingDate,
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDayendprocessFlag"]);
    };
  }, []);

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
          <GradientButton
            onClick={async (event) => {
              const btnName = await MessageBox({
                message: "DeleteData",
                messageTitle: "Confirmation",
                buttonNames: ["Yes", "No"],
              });
              if (btnName === "Yes") {
                setOpenPendingTrns(true);
              }
            }}
            color={"primary"}
          >
            {t("PendingTransactions")}
          </GradientButton>
          <GradientButton
            onClick={(event) => {
              setOpenDayendProcess(true);
            }}
            // disabled={}
            //   endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            //   color={"primary"}
          >
            {data && data[0]?.EOD_FLAG === "H"
              ? t("DayEndHover")
              : t("DayEndProcess")}
          </GradientButton>
          <GradientButton
            onClick={(event) => {
              setOpenVerifyChecksums(true);
            }}
            color={"primary"}
          >
            {t("VerifyDayEndChecksums")}
          </GradientButton>
        </Toolbar>
      </AppBar>
      {openPendingTrns ? (
        <PendinGTrns
          open={openPendingTrns}
          close={() => setOpenPendingTrns(false)}
        />
      ) : (
        ""
      )}
      {openDayendProcess ? (
        <VerifyDayendChecksums
          open={openDayendProcess}
          close={() => setOpenDayendProcess(false)}
          flag={"D"}
          restartLoop={() => {
            setOpenVerifyChecksums(false);
            setOpenVerifyChecksums(true);
          }}
        />
      ) : (
        ""
      )}
      {openVerifyChecksums ? (
        <VerifyDayendChecksums
          open={openVerifyChecksums}
          close={() => setOpenVerifyChecksums(false)}
          flag={"C"}
          restartLoop={() => {
            setOpenVerifyChecksums(false);
            setTimeout(() => setOpenVerifyChecksums(true), 1000); // Restart with 1-second delay
          }}
        />
      ) : null}
    </>
  );
};
export const DayEndProcessMain = () => {
  return (
    <ClearCacheProvider>
      <DayEndProcess />
    </ClearCacheProvider>
  );
};
