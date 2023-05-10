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
import { VerifyFinger } from "./verifyFinger";
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
import clsx from "clsx";
export const OTPModel = ({
  classes,
  open,
  handleClose,
  loginState,
  VerifyOTP,
  OTPError,
  setOTPError,
  previousStep,
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
  // useEffect(() => {
  //   if (loginState?.otpmodelClose ?? false) {
  //     handleCloseEvent();
  //   }
  // }, [loginState.otpmodelClose]);
  return (
    <Fragment>
      <Container maxWidth="sm">
        <Grid alignItems="center" marginTop={"4em"}>
          <div
            // className={classes.formWrap}
            style={
              {
                // marginRight: "25px",
                // width: "100%",
                // position: "relative",
                // right: "42px",
                // bottom: "13px",
              }
            }
          >
            <div
              style={{
                color: "#000000",
                fontSize: "30px",
                fontWeight: "600",
                // fontFamily: "Poppins",
                alignItems: "center",
                fontStyle: "normal",
                lineHeight: "150%",
                marginBottom: "10px",
              }}
            >
              OTP Authentication
            </div>
            <div
              style={{
                color: "#949597",
                fontSize: "16px",
                fontWeight: "400",
                // fontFamily: "Poppins",
                alignItems: "center",
                fontStyle: "normal",
                lineHeight: "33px",
                // marginBottom: "10px",
              }}
            >
              Please click on Resend button to Generate new OTP
            </div>
            {/* <DialogContent> */}
            <div className={classes.OTPalignName}>
              <p> Hello Leo,</p>
              <ResendOTP
                onResendClick={() => setbtnshow(false)}
                onTimerComplete={() => setbtnshow(true)}
                renderButton={renderButton}
                renderTime={renderTime}
                maxTime={60}
                className={classes.resendOTPalign}
              />
            </div>
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
              <FormHelperText style={{ color: "red" }}>
                {OTPError}
              </FormHelperText>
            ) : null}

            {/* </DialogContent> */}
            {/* <DialogActions className={classes.verifybutton}> */}
            <div
              style={{
                display: "flex",
                // justifyContent: "center",
                // margin: "0px 5px ",
                gap: "10px",
                // padding: "60px",
                margin: "50px 0 0 37px",

                width: "60%",
              }}
            >
              <GradientButton
                fullWidth
                disabled={loginState.otploading}
                // onClick={handleCloseEvent}
                onClick={previousStep}
                className={classes.otpButtons}
                style={{
                  border: "var(--theme-color3)1px solid",
                  color: "var(--theme-color3)",
                  background: "var(--theme-color2)",
                }}
              >
                Back
              </GradientButton>
              <GradientButton
                fullWidth
                disabled={loginState.otploading}
                endIcon={
                  loginState.otploading ? <CircularProgress size={20} /> : null
                }
                onClick={ClickEventHandler}
                ref={inputButtonRef}
                className={classes.otpButtons}
              >
                Verify OTP
              </GradientButton>
              {/* </DialogActions> */}
            </div>
          </div>
        </Grid>
      </Container>
    </Fragment>
  );
};
