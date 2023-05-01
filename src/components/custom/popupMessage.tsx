import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useStyles } from "pages_audit/auth/style";

export const PopupMessageAPIWrapper = ({
  MessageTitle,
  Message,
  onActionYes,
  onActionNo,
  rows,
  open = false,
  loading = false,
}) => {
  //const { state: rowsdata }: any = useLocation();
  const classes = useStyles();

  return (
    <>
      <Dialog fullWidth={false} open={open}>
        <DialogTitle className={classes.dialogTitleClass}>
          {MessageTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ color: "black", marginTop: "8px", marginBottom: "6px" }}
          >
            {Message}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.verifybutton}>
          <GradientButton
            endIcon={loading ? <CircularProgress size={20} /> : null}
            onClick={() => onActionYes(rows)}
          >
            Yes
          </GradientButton>
          <GradientButton //disabled={loading}
            onClick={() => onActionNo()}
          >
            No
          </GradientButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
