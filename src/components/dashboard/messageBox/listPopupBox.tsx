import { useRef, useEffect, useContext, useState, useMemo } from "react";
import { makeStyles, styled } from "@mui/styles";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import * as API from "../api";
import { AppBar, Dialog, Theme, Toolbar, Typography } from "@mui/material";
import { useDialogStyles } from "components/detailPopupGridData";
import { GradientButton } from "components/styledComponent/button";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { MessageDescriptionMetadata } from "./metadata";
import {
  ImageViewer,
  NoPreview,
  PDFViewer,
} from "components/fileUpload/preView";
import { lowerCase } from "lodash";
import { utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { InitialValuesType } from "packages/form";
import { LoaderPaperComponent } from "components/common/loaderPaper";
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
export const ListPopupMessageWrapper = ({
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
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMessageBoxListData"], () =>
    API.getMessageBoxListData({
      userID: authState?.user?.id ?? "",
      transactionID,
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getMessageBoxListData"]);
    };
  }, []);

  const fileData = useMemo(() => {
    if (data?.[0]?.DOC_BLOB) {
      lastFileData.current = {
        DOC_BLOB: utilFunction.blobToFile(
          utilFunction.base64toBlob(
            data?.[0]?.DOC_BLOB,
            data?.[0]?.FILE_TYPE === "pdf"
              ? "application/pdf"
              : "image/" + data?.[0]?.FILE_TYPE
          ),
          data?.[0].FILE_NM
        ),
        FILE_TYPE: data?.[0].FILE_TYPE,
        FILE_NM: data?.[0].FILE_NM,
      };
    }
    return lastFileData.current;
  }, [data?.[0]?.DOC_BLOB]);
  console.log("lastFileData.current", lastFileData);

  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : (
        <Dialog
          fullWidth
          maxWidth="md"
          open={true}
          PaperProps={{
            style: {
              width: "40%",
              height: "100%",
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
            metaData={MessageDescriptionMetadata}
            initialValues={data?.[0] as InitialValuesType}
            hideHeader={true}
            formStyle={{
              background: "white",
            }}
          ></FormWrapper>

          {lastFileData.current?.FILE_TYPE?.includes("pdf") ? (
            <PDFViewer
              blob={lastFileData.current?.DOC_BLOB ?? null}
              fileName={lastFileData.current?.FILE_NM ?? ""}
            />
          ) : lastFileData.current?.FILE_TYPE?.includes("png") ||
            lastFileData.current?.FILE_TYPE?.includes("jpg") ||
            lastFileData.current?.FILE_TYPE?.includes("jpeg") ? (
            <>
              <ImageViewer
                blob={lastFileData.current?.DOC_BLOB ?? null}
                fileName={lastFileData.current?.FILE_NM ?? ""}
              />
            </>
          ) : (
            <NoPreview fileName={lastFileData.current?.FILE_NM ?? ""} />
          )}
        </Dialog>
      )}
    </>
  );
};
