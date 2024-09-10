import { useState, useRef, useEffect } from "react";
import { GradientButton } from "components/styledComponent/button";
import { useStyles } from "pages_audit/auth/style";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
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
  label = "Remarks",
  ...other
}) => {
  //const { state: rows }: any = useLocation();
  const [input, setInput] = useState("");
  const [loginState, setLoginState] = useState(inititalState);
  const classes = useStyles();
  const inputRef = useRef<any>(null);
  const inputButtonRef = useRef<any>(null);
  const { t } = useTranslation();
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

  useEffect(() => {
    setInput(other.defaultValue);
  }, [other.defaultValue]);

  return (
    <>
      <Dialog fullWidth={true} open={open}>
        <DialogTitle className={classes.dialogTitleClass}>
          {t(TitleText)}
        </DialogTitle>
        <DialogContent>
          <br />
          <TextField
            autoFocus={true}
            label={t(label)}
            placeholder={t("EnterRemarks")}
            fullWidth
            type={"text"}
            name="remarks"
            variant="standard"
            color="info"
            margin="dense"
            id="standard-size-normal"
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
                  userMessage: t("ThisFieldisrequired"),
                }));
              } else {
                onActionYes(input, rows);
                setInput("");
              }
            }}
            ref={inputButtonRef}
          >
            {t(AcceptbuttonLabelText)}
          </GradientButton>
          <GradientButton
            disabled={isLoading}
            onClick={() => {
              onActionNo();
              setInput("");
            }}
          >
            {t(CanceltbuttonLabelText)}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
