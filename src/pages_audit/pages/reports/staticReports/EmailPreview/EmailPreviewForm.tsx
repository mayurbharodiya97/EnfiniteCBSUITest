import React from "react";
import {
  AppBar,
  Dialog,
  Toolbar,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { Transition } from "@acuteinfo/common-base";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import DOMPurify from "dompurify";
import juice from "juice";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip } from "@acuteinfo/common-base";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

export const EmailPreviewDialog = ({ isOpen, onClose, emailValue }) => {
  const headerClasses = useTypeStyles();

  const isHTML = (str) => {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
  };

  const renderEmailContent = () => {
    if (isHTML(emailValue)) {
      const inlinedCSS = juice(emailValue);

      const sanitizedHTML = DOMPurify.sanitize(inlinedCSS);

      return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
    } else {
      return <div>{emailValue}</div>;
    }
  };

  return (
    <Dialog
      open={isOpen}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="sm"
    >
      <div style={{ alignSelf: "end", position: "fixed" }}>
        <Tooltip title={"Close"} arrow={true}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon style={{ color: "var(--primary-bg)" }} />
          </IconButton>
        </Tooltip>
      </div>
      <div style={{ margin: "10px 25px 10px 10px" }}>
        {renderEmailContent()}
      </div>
    </Dialog>
  );
  ``;
};
