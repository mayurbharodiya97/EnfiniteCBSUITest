import {
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { Fragment, FC, useEffect, useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";
import { downloadFile } from "./utils";

export const PDFViewer: FC<{ blob: File; fileName: string; onClose?: any }> = ({
  blob,
  fileName,
  onClose,
}) => {
  const [urlObj, setUrlObj] = useState(
    typeof blob === "object" && Boolean(blob)
      ? URL.createObjectURL(blob as any)
      : null
  );
  //console.log(blob, urlObj);
  useEffect(() => {
    let toRemoveURL = urlObj ?? "";
    return () => {
      URL.revokeObjectURL(toRemoveURL);
      console.log("revokeObjectURL", toRemoveURL);
    };
  }, []);
  useEffect(() => {
    setUrlObj(typeof blob === "object" && Boolean(blob)
    ? URL.createObjectURL(blob as any)
    : null)
  }, [blob])
  return (
    <Fragment>
      <DialogActions style={{ display: "flex", padding: "8px 24px" }}>
        <Typography variant="h6" color="textSecondary">
          File:
        </Typography>
        <Typography variant="h6">{fileName}</Typography>
        <div style={{ flexGrow: 1 }}></div>
        <IconButton
          color="secondary"
          onClick={() => downloadFile(blob, fileName)}
        >
          <GetAppIcon />
        </IconButton>
        {typeof onClose === "function" ? (
          <IconButton color="secondary" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogActions>
      <DialogContent>
        <iframe
          title="Document Preview"
          src={`${urlObj}`}
          style={{ height: "100%", width: "100%" }}
          aria-label="PDF Preview"
        />
      </DialogContent>
    </Fragment>
  );
};

export const ImageViewer: FC<{
  blob: File;
  fileName: string;
  onClose?: any;
}> = ({ blob, fileName, onClose }) => {
  const [urlObj, setUrlObj] = useState(
    typeof blob === "object" && Boolean(blob)
      ? URL.createObjectURL(blob as any)
      : ""
  );
  //console.log(blob, urlObj);
  useEffect(() => {
    let toRemoveURL = urlObj ?? "";
    return () => {
      //URL.revokeObjectURL(toRemoveURL);
      console.log("revokeObjectURL", toRemoveURL);
    };
  }, []);


  useEffect(() => {
    setUrlObj(typeof blob === "object" && Boolean(blob)
      ? URL.createObjectURL(blob as any)
      : "")
  }, [blob])
  return (
    <Fragment>
      <DialogActions style={{ display: "flex", padding: "8px 24px" }}>
        <Typography variant="h6" color="textSecondary">
          File:
        </Typography>
        <Typography variant="h6">{fileName}</Typography>
        <div style={{ flexGrow: 1 }}></div>
        <IconButton
          color="secondary"
          onClick={() => downloadFile(blob, fileName)}
        >
          <GetAppIcon />
        </IconButton>
        {typeof onClose === "function" ? (
          <IconButton color="secondary" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogActions>
      <DialogContent>
        <img width="60%" src={`${urlObj}`} alt="Preview of document" />
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
        <IconButton color="secondary" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogActions>
    <DialogContent>{message}</DialogContent>
  </Fragment>
);
