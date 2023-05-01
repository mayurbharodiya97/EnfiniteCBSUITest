import { useState, useRef } from "react";
import { TextField } from "components/styledComponent/textfield";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { GradientButton } from "components/styledComponent/button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useStyles } from "pages_audit/auth/style";
const inititalState = {
  loading: false,
  isError: false,
  userMessage: "",
};
export const RemarksAPIWrapper = ({
  TitleText,
  onActionNo,
  onActionYes,
  isRequired = true,
  isEntertoSubmit = false,
  AcceptbuttonLabelText = "Yes",
  CanceltbuttonLabelText = "No",
  isLoading = false,
  open = false,
  rows,
}) => {
  //const { state: rows }: any = useLocation();
  const [input, setInput] = useState("");
  const [loginState, setLoginState] = useState(inititalState);
  const classes = useStyles();
  const inputRef = useRef<any>(null);
  const inputButtonRef = useRef<any>(null);
  const handleChange = (event) => {
    setInput(event.target.value);
    if (event.target.value) {
      setLoginState((values) => ({
        ...values,
        isError: false,
        userMessage: "",
      }));
    }
  };

  return (
    <>
      <Dialog fullWidth={true} open={open}>
        <DialogTitle className={classes.dialogTitleClass}>
          {TitleText}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus={true}
            label={"Remarks"}
            placeholder="Enter Remarks"
            fullWidth
            type={"text"}
            name="remarks"
            value={input || ""}
            onChange={handleChange}
            error={loginState.isError}
            helperText={loginState.isError ? loginState.userMessage : ""}
            InputLabelProps={{ shrink: true }}
            disabled={isLoading}
            autoComplete="off"
            ref={inputRef}
            required={isRequired}
            onKeyPress={(e) => {
              if (e.key === "Enter" && isEntertoSubmit) {
                inputButtonRef?.current?.click?.();
              }
            }}
          />
        </DialogContent>
        <DialogActions className={classes.verifybutton}>
          <GradientButton
            endIcon={isLoading ? <CircularProgress size={20} /> : null}
            onClick={() => {
              if (!Boolean(input) && isRequired) {
                setLoginState((values) => ({
                  ...values,
                  isError: true,
                  userMessage: "This field is required.",
                }));
              } else {
                onActionYes(input, rows);
                setInput("");
              }
            }}
            ref={inputButtonRef}
          >
            {AcceptbuttonLabelText}
          </GradientButton>
          <GradientButton
            disabled={isLoading}
            onClick={() => {
              onActionNo();
              setInput("");
            }}
          >
            {CanceltbuttonLabelText}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
