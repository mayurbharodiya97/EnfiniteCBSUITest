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

export const MessageBoxWrapper = ({
  MessageTitle,
  Message,
  onClickButton,
  buttonNames = ["Yes", "No"],
  rows,
  open = false,
  loading = false,
}) => {
  //const { state: rowsdata }: any = useLocation();
  const classes = useStyles();
  // const PopupList = popupData.map((key, val) => {
  //   console.log("key", key, val);
  //   return;
  // });
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
          {buttonNames.map((buttonName, index) => {
            return (
              <GradientButton
                endIcon={loading ? <CircularProgress size={20} /> : null}
                onClick={() => onClickButton(rows, buttonName)}
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
