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
export const ListPopupMessageWrapper = ({ open, closeDialog, dialogLabel }) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const classes = useDialogStyles();
  const headerClasses = useHeaderStyles();

  const lastFileData = useRef<any>(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMessageBoxListData"], () => API.getMessageBoxListData({}));
  console.log(
    "data?.[0].UPLOAD_DOCUMENT",
    data?.[0].UPLOAD_DOCUMENT,
    data?.[0].FILE_DATA
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getMessageBoxListData"]);
    };
  }, [getEntries]);

  const fileData = useMemo(() => {
    if (data?.[0]?.UPLOAD_DOCUMENT) {
      lastFileData.current = {
        UPLOAD_DOCUMENT: utilFunction.blobToFile(
          utilFunction.base64toBlob(
            data?.[0]?.UPLOAD_DOCUMENT,
            data?.[0]?.FILE_TYPE === "pdf"
              ? "application/pdf"
              : "image/" + data?.[0]?.FILE_TYPE
          ),
          data?.[0].FILE_NAME
        ),
        FILE_TYPE: data?.[0].FILE_TYPE,
        FILE_NAME: data?.[0].FILE_NAME,
      };
    }
    return lastFileData.current;
  }, [data?.[0]?.UPLOAD_DOCUMENT]);
  console.log("fileData", fileData);
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={true}
      PaperProps={{
        style: {
          width: "50%",
          height: "90%",
        },
      }}
      key="filepreviewDialog"
    >
      <AppBar
        position="relative"
        color="secondary"
        style={{ marginBottom: "5px" }}
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
              backgroundColor: "var(--theme-color2)",
              height: "32px",
              width: "20px",
              borderRadius: "05px",
              color: "var(--theme-color3)",
            }}
          >
            Close
          </GradientButton>
        </Toolbar>
      </AppBar>

      <FormWrapper
        key={`MessageDescriptionMetadata`}
        metaData={MessageDescriptionMetadata}
        initialValues={[]}
        hideHeader={true}
        formStyle={{
          background: "white",
        }}
      ></FormWrapper>

      {lastFileData.current?.FILE_TYPE?.includes("pdf") ? (
        <PDFViewer
          blob={lastFileData.current?.UPLOAD_DOCUMENT ?? null}
          fileName={lastFileData.current?.FILE_NAME ?? ""}
        />
      ) : lastFileData.current?.FILE_TYPE?.includes("png") ||
        lastFileData.current?.FILE_TYPE?.includes("jpg") ||
        lastFileData.current?.FILE_TYPE?.includes("jpeg") ? (
        <>
          <ImageViewer
            blob={lastFileData.current?.UPLOAD_DOCUMENT ?? null}
            fileName={lastFileData.current?.FILE_NAME ?? ""}
          />
        </>
      ) : (
        <NoPreview fileName={lastFileData.current?.FILE_NAME ?? ""} />
      )}
    </Dialog>
  );
};
