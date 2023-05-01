import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Alert } from "components/common/alert";
import { LoadingTextAnimation } from "components/common/loader";
import {
  ExportExcelFileFromData,
  ExportCSVFileFromData,
} from "components/utils";
import { useState } from "react";

export const SampleFileDownload = ({
  isOpen,
  closeDialog,
  fileData,
  filename,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [error, SetError] = useState("");
  const FileDownload = (format) => {
    if (format === "Excel") {
      setLoading(true);
      SetError("");
      try {
        ExportExcelFileFromData({ data: fileData, title: filename });
      } catch (error) {
        SetError(String(error));
      }
      setTimeout(() => {
        setLoading(false);
        closeDialog();
      }, 1000);
    } else if (format === "CSV") {
      setLoading(true);
      SetError("");
      try {
        ExportCSVFileFromData({ data: fileData, title: filename });
      } catch (error) {
        SetError(String(error));
      }
      setTimeout(() => {
        setLoading(false);
        closeDialog();
      }, 1000);
    }
  };
  return (
    <Dialog open={isOpen} maxWidth="sm">
      <DialogTitle>Which format do you want to download?</DialogTitle>
      <DialogContent>
        {isLoading ? (
          //   "Deleting..."
          <LoadingTextAnimation
            key={"loaderforExporting"}
            text="Exporting..."
          />
        ) : Boolean(error) ? (
          <Alert severity="error" errorMsg={error} />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            FileDownload("Excel");
          }}
          color="secondary"
          disabled={isLoading}
        >
          Excel
        </Button>
        <Button
          onClick={() => {
            FileDownload("CSV");
          }}
          color="secondary"
          disabled={isLoading}
        >
          CSV
        </Button>
        <Button onClick={closeDialog} color="secondary" disabled={isLoading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
