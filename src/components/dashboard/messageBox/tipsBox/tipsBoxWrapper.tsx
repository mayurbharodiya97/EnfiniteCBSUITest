import { useRef, useEffect, useContext, useState, useMemo } from "react";
import { makeStyles, styled } from "@mui/styles";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
// import * as API from "../api";
import { AppBar, Dialog, Theme, Toolbar, Typography } from "@mui/material";
import { useDialogStyles } from "components/detailPopupGridData";
import { GradientButton } from "components/styledComponent/button";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { InitialValuesType } from "packages/form";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { TipsListMetadata } from "./metadata";
const useHeaderStyles = makeStyles((theme: Theme) => ({
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
export const TipsWrapper = ({
  open,
  closeDialog,
  dialogLabel,
  transactionID,
}) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const classes = useDialogStyles();
  const headerClasses = useHeaderStyles();
  const { authState } = useContext(AuthContext);
  const lastFileData = useRef<any>(null);
  // const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
  //   any,
  //   any
  // >(["getMessageBoxListData"], () =>
  //   API.getMessageBoxListData({
  //     userID: authState?.user?.id ?? "",
  //     transactionID,
  //   })
  // );

  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries(["getMessageBoxListData"]);
  //   };
  // }, []);

  return (
    <>
      {/* {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : ( */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={true}
        PaperProps={{
          style: {
            width: "100%",
            height: "50%",
          },
        }}
        key="filepreviewDialog"
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{
            // marginBottom: "5px",
            padding: "8px",
            background: "none",
            boxShadow: "none",
          }}
        >
          <Toolbar className={headerClasses.root} variant={"dense"}>
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {dialogLabel}
              {/* {dialogLabel.charAt(0).toUpperCase() +
              dialogLabel.slice(1).toLowerCase()} */}
            </Typography>
            <GradientButton
              onClick={closeDialog}
              style={{
                backgroundColor: "var(--theme-color5)",
                height: "32px",
                width: "20px",
                borderRadius: "05px",
                color: "var(--theme-color2)",
              }}
            >
              Close
            </GradientButton>
          </Toolbar>
        </AppBar>

        <FormWrapper
          key={`MessageDescriptionMetadata`}
          metaData={TipsListMetadata}
          // initialValues={data?.[0] as InitialValuesType}
          hideHeader={true}
          formStyle={{
            background: "white",
          }}
        ></FormWrapper>
      </Dialog>
      {/* )} */}
    </>
  );
};
