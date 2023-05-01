import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { Fragment, useState, useRef, useEffect } from "react";
import OTPInput, { ResendOTP } from "otp-input-react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CircularProgress, IconButton } from "@mui/material";
import clsx from "clsx";
export const OTPModel = ({
  classes,
  open,
  handleClose,
  loginState,
  VerifyOTP,
  OTPError,
  setOTPError,
}) => {
  const [OTP, setOTP] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [btnshow, setbtnshow] = useState(false);
  const inputButtonRef = useRef<any>(null);
  const renderButton = (buttonProps) => {
    let { remainingTime, ...other } = buttonProps;
    return (
      <a
        remainingtime={remainingTime}
        {...other}
        className={clsx(
          classes.resendbtnLink,
          !btnshow && classes.btnvisibleoff
        )}
      >
        Resend OTP
      </a>
    );
  };
  const ClickEventHandler = () => {
    if (!Boolean(OTP) || OTP.length < 6) {
      setOTPError("Please enter a 6 digit OTP number");
    } else {
      setOTPError("");
      VerifyOTP(OTP);
    }
  };
  const handleCloseEvent = () => {
    setOTPError("");
    setOTP("");
    handleClose();
  };
  const renderTime = (remainingtime) => {
    return (
      <span className={clsx(btnshow && classes.btnvisibleoff)}>
        Valid for {remainingtime}
      </span>
    );
  };
  useEffect(() => {
    if (loginState?.otpmodelClose ?? false) {
      handleCloseEvent();
    }
  }, [loginState.otpmodelClose]);
  return (
    <Fragment>
      <Dialog fullWidth={false} open={open}>
        <DialogTitle>OTP Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Verify OTP</DialogContentText>
          <div
            className={classes.divflex}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                inputButtonRef?.current?.click?.();
              }
            }}
          >
            <OTPInput
              value={OTP}
              onChange={setOTP}
              autoFocus
              OTPLength={6}
              otpType="number"
              disabled={false}
              secure={showPassword}
              className={classes.otpinputpadding}
            />

            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword((old) => !old)}
              onMouseDown={(e) => e.preventDefault()}
              disabled={loginState.otploading}
              className={classes.ibtnvisible}
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {Boolean(OTPError) ? (
            <FormHelperText style={{ color: "red" }}>{OTPError}</FormHelperText>
          ) : null}
          <ResendOTP
            onResendClick={() => setbtnshow(false)}
            onTimerComplete={() => setbtnshow(true)}
            renderButton={renderButton}
            renderTime={renderTime}
            maxTime={60}
            className={classes.resendOTPalign}
          />
        </DialogContent>
        <DialogActions className={classes.verifybutton}>
          <GradientButton
            disabled={loginState.otploading}
            endIcon={
              loginState.otploading ? <CircularProgress size={20} /> : null
            }
            onClick={ClickEventHandler}
            ref={inputButtonRef}
          >
            Verify
          </GradientButton>
          <GradientButton
            disabled={loginState.otploading}
            onClick={handleCloseEvent}
          >
            Cancel
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
