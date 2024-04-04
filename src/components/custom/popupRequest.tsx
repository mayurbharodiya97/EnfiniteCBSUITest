import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useStyles } from "pages_audit/auth/style";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";

export const PopupRequestWrapper = ({
  MessageTitle,
  Message,
  onClickButton,
  buttonNames = ["Yes", "No"],
  rows,
  open = false,
  loading = false,
  icon = "INFO",
  defFocusBtnName = "",
}) => {
  //const { state: rowsdata }: any = useLocation();
  const classes = useStyles();
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const colorMap = {
    INFO: "#40A2D8",
    SUCCESS: "#0fd643",
    WARNING: "#FFA447",
    ERROR: "#DC143C",
  };

  useEffect(() => {
    if (open && buttonRef) {
      buttonRef.focus();
    }
  }, [open, buttonRef]);
  return (
    <>
      <Dialog
        maxWidth="md"
        PaperProps={{
          style: {
            minWidth: "30%",
            maxWidth: "50%",
          },
        }}
        open={open}
      >
        <DialogTitle
          className={classes.dialogTitleClass}
          style={{ textAlign: "center" }}
        >
          {MessageTitle}
        </DialogTitle>
        <DialogContent
          sx={{
            // paddingTop: "1rem !important",
            // paddingBottom: "2rem !important",
            paddingLeft: "10px",
            display: "flex",
            // alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Box style={{ position: "fixed" }}>
            {icon === "INFO" ? (
              <InfoIcon fontSize="large" style={{ color: colorMap[icon] }} />
            ) : icon === "WARNING" ? (
              <WarningIcon fontSize="large" style={{ color: colorMap[icon] }} />
            ) : icon === "SUCCESS" ? (
              <CheckCircleIcon
                fontSize="large"
                style={{ color: colorMap[icon] }}
              />
            ) : icon === "ERROR" ? (
              <ErrorIcon fontSize="large" style={{ color: colorMap[icon] }} />
            ) : null}
          </Box>
          <DialogContentText>
            <Typography
              style={{
                color: "black",
                whiteSpace: "pre-wrap",
                marginLeft: "3rem",
                paddingTop: "0.3rem",
              }}
            >
              {Message.startsWith("\n") ? Message?.slice(1) : Message}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttonNames.map((buttonName, index) => {
            return (
              <GradientButton
                ref={
                  Boolean(defFocusBtnName) && defFocusBtnName === buttonName
                    ? setButtonRef
                    : !Boolean(defFocusBtnName) && index === 0
                    ? setButtonRef
                    : null
                }
                endIcon={loading ? <CircularProgress size={20} /> : null}
                onClick={() => onClickButton(buttonName)}
              >
                {buttonName}
              </GradientButton>
            );
          })}
          {/* <GradientButton //disabled={loading}
              onClick={() => onActionNo("No")}
            >
              {"fdfdf"}
            </GradientButton> */}
        </DialogActions>
      </Dialog>
    </>
  );
};
