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

export const PopupRequestWrapper = ({
  MessageTitle,
  Message,
  onClickButton,
  buttonNames = ["Yes", "No"],
  rows,
  open = false,
  loading = false,
  icon = "INFO",
}) => {
  //const { state: rowsdata }: any = useLocation();
  const classes = useStyles();
  const colorMap = {
    INFO: "#40A2D8",
    SUCCESS: "#0fd643",
    WARNING: "#FFA447",
    ERROR: "#DC143C",
  };

  // const PopupList = popupData.map((key, val) => {
  //   console.log("key", key, val);
  //   return;
  // });
  return (
    <>
      <Dialog fullWidth={false} open={open}>
        <DialogTitle
          className={classes.dialogTitleClass}
          style={{ textAlign: "center" }}
        >
          {MessageTitle}
        </DialogTitle>
        <DialogContent
          sx={{
            paddingTop: "1rem !important",
            paddingBottom: "2rem !important",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Box>
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
            <Typography color={"black"}>{Message}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttonNames.map((buttonName, index) => {
            return (
              <GradientButton
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
