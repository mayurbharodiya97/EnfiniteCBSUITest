import { useContext, useEffect, useState, Fragment, FC, useRef } from "react";
import { DOCCRUDContext } from "./context";
import GetAppIcon from "@mui/icons-material/GetApp";
import Close from "@mui/icons-material/Close";
import { downloadFile } from "components/fileUpload/utils";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import {
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

export const PreviewWrapper = ({
  fileType,
  fileName,
  docUUID,
  closeDialog,
}) => {
  return fileType.indexOf("pdf") >= 0 || fileType.indexOf("image") >= 0 ? (
    //@ts-ignore
    <FileViewer
      fileName={fileName}
      onClose={closeDialog}
      docUUID={docUUID}
      fileType={fileType}
    />
  ) : (
    <NoPreview onClose={closeDialog} fileName={fileName} />
  );
};

export const FileViewer: FC<{
  fileName: string;
  onClose?: any;
  docUUID: string;
  fileType: string;
}> = ({ fileName, onClose, docUUID, fileType }) => {
  const { loading, blob, error, success } = useBlobLoader({
    docUUID,
    fileType,
  });
  const urlObj = useRef<any>("");
  if (success) {
    urlObj.current = URL.createObjectURL(blob as any);
  }
  useEffect(() => {
    let toRemoveURL = urlObj.current ?? "";
    return () => {
      URL.revokeObjectURL(toRemoveURL);
    };
  }, []);
  return (
    <Fragment>
      <DialogActions style={{ display: "flex", padding: "8px 24px" }}>
        <Typography variant="h6" color="textSecondary">
          File:
        </Typography>
        <Typography variant="h6">{fileName}</Typography>
        <div style={{ flexGrow: 1 }}></div>
        {success ? (
          <IconButton
            color="primary"
            onClick={() => downloadFile(blob as File, fileName)}
          >
            <GetAppIcon />
          </IconButton>
        ) : null}
        {typeof onClose === "function" ? (
          <IconButton color="primary" onClick={onClose}>
            <Close />
          </IconButton>
        ) : null}
      </DialogActions>
      <DialogContent>
        {loading ? (
          <LoaderPaperComponent />
        ) : Boolean(error) ? (
          <span>{error}</span>
        ) : (
          <iframe
            src={`${urlObj.current}`}
            title="Document View"
            style={{ height: "100%", width: "100%" }}
            aria-label="File Preview"
          />
        )}
      </DialogContent>
    </Fragment>
  );
};

export const NoPreview: FC<{
  fileName: string;
  onClose?: any;
  message?: string;
}> = ({ onClose, fileName, message }) => (
  <Fragment>
    <DialogActions style={{ display: "flex", padding: "8px 24px" }}>
      <Typography variant="h6" color="textSecondary">
        File:
      </Typography>
      <Typography variant="h6">{fileName}</Typography>
      <div style={{ flexGrow: 1 }}></div>
      {typeof onClose === "function" ? (
        <IconButton color="primary" onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </DialogActions>
    <DialogContent>{message}</DialogContent>
  </Fragment>
);

const useBlobLoader = ({ docUUID, fileType }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { previewDocument, context } = useContext(DOCCRUDContext);
  const docType = context.docCategory.filter((one) => one.primary === true)[0]
    .type;
  const [blob, setBlob] = useState<Blob | null>(null);
  useEffect(() => {
    previewDocument
      .fn(previewDocument.args)(docType, docUUID)
      .then((blob) => {
        if (blob instanceof Error) {
          setError(blob.message);
          setLoading(false);
          setSuccess(false);
        } else {
          if (blob.type === "application/json") {
            blob.text((data) => {
              setError(data);
              setLoading(false);
              setSuccess(false);
            });
          } else {
            const fileTypeBlob = new Blob([blob], { type: fileType });
            setBlob(fileTypeBlob);
            setSuccess(true);
            setError("");
            setLoading(false);
          }
        }
      })
      .catch((e) => {
        setError(e.message);
        setLoading(true);
        setSuccess(false);
      });
  }, [
    setError,
    setLoading,
    setSuccess,
    setBlob,
    docUUID,
    fileType,
    previewDocument,
    docType,
  ]);
  return {
    success,
    loading,
    error,
    blob,
  };
};
