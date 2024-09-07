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
import React, { useState } from "react";
import { useEffect, useRef } from "react";

export const MessageBoxWrapper = ({
  MessageTitle,
  Message,
  onClickButton,
  buttonNames = ["Yes", "No"],
  rows,
  open = false,
  loading = false,
  defFocusBtnName = undefined,
}) => {
  //const { state: rowsdata }: any = useLocation();
  const classes = useStyles();
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  // useEffect to focus the button when the Dialog opens
  useEffect(() => {
    if (open && buttonRef) {
      buttonRef.focus();
    }
  }, [open, buttonRef]);
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
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>{Message}</DialogContentText>
        </DialogContent>
        <DialogActions className={classes.verifybutton}>
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
