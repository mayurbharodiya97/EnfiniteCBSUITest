import {
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { Fragment, FC, useEffect, useRef } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";
import { downloadFile } from "./utils";

export const PDFViewer: FC<{ blob: File; fileName: string; onClose?: any }> = ({
  blob,
  fileName,
  onClose,
}) => {
  const urlObj = useRef(
    typeof blob === "object" && Boolean(blob)
      ? URL.createObjectURL(blob as any)
      : null
  );
  //console.log(blob, urlObj.current);
  useEffect(() => {
    let toRemoveURL = urlObj.current ?? "";
    return () => {
      URL.revokeObjectURL(toRemoveURL);
      // console.log("revokeObjectURL", toRemoveURL);
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
          src={`${urlObj.current}`}
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
  const urlObj = useRef(
    typeof blob === "object" && Boolean(blob)
      ? URL.createObjectURL(blob as any)
      : ""
  );
  //console.log(blob, urlObj.current);
  useEffect(() => {
    let toRemoveURL = urlObj.current ?? "";
    return () => {
      //URL.revokeObjectURL(toRemoveURL);
      // console.log("revokeObjectURL", toRemoveURL);
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
        <img width="60%" src={`${urlObj.current}`} alt="Preview of document" />
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
