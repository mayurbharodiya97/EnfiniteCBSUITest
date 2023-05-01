import { Fragment, useContext, useEffect, useState } from "react";
import { DOCCRUDContext } from "./context";
import { downloadFile } from "../download";
import { Button, DialogActions, DialogTitle } from "@mui/material";

export const Download = ({ docData, closeDialog, maxDownloadLimit = 3 }) => {
  const { generateDocumentDownloadURL, context } = useContext(DOCCRUDContext);
  const docType = context.docCategory.filter((one) => one.primary === true)[0]
    .type;
  const [error, setError] = useState("");
  const closeMe = () => {
    setError("");
    closeDialog();
  };
  useEffect(() => {
    if (docData.length > Number(maxDownloadLimit)) {
      setError(`Cannot download more than ${maxDownloadLimit} files at a time`);
      return;
    }
    if (docData.length === 1) {
      const url = generateDocumentDownloadURL.fn(
        generateDocumentDownloadURL.args
      )(
        docType,
        docData.map((one) => one.id)
      );
      downloadFile(url, docData[0].name);
    } else if (docData.length > 1) {
      const url = generateDocumentDownloadURL.fn(
        generateDocumentDownloadURL.args
      )(
        docType,
        docData.map((one) => one.id)
      );
      downloadFile(url, `download-${new Date().getUTCMilliseconds()}`);
    }
    closeDialog();
  }, [
    maxDownloadLimit,
    docData,
    docType,
    closeDialog,
    generateDocumentDownloadURL,
  ]);
  return Boolean(error) ? (
    <Fragment>
      <DialogTitle>{error}</DialogTitle>
      <DialogActions>
        <Button onClick={closeMe}>Ok</Button>
      </DialogActions>
    </Fragment>
  ) : null;
};
