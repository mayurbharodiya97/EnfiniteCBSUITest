import { useReducer, useContext, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { useNavigate } from "react-router-dom";
import loginImg from "assets/images/login.svg";
import { useStyles } from "./style";
//import * as API from "./api";
import logo from "assets/images/logo.jpg";
import { ForgotPasswordFields } from "./forgotPasswordField";
import { OTPModel } from "./otpPopup";
import { utilFunction } from "components/utils/utilFunctions";
import { useSnackbar } from "notistack";
const inititalState = {
  isUsernameError: false,
  userMessageforusername: "",
  loading: false,
  isMobileError: false,
  userMessageforMobileno: "",
  isPasswordError: false,
  userMessageforPassword: "",
  isConfirmPasswordError: false,
  userMessageforconfirmPassword: "",
  workingState: 0,
  isApiError: false,
  apierrorMessage: "",
  otploading: false,
  OtpuserMessage: "",
  otpmodelClose: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "verifyUserNameandMobileNoFailed": {
      return {
        ...state,
        loading: false,
        isUsernameError: action?.payload?.isUsernameError ?? false,
        isMobileError: action?.payload?.isMobileError ?? false,
        userMessageforusername: action?.payload?.userMessageforusername ?? "",
        userMessageforMobileno: action?.payload?.userMessageforMobileno ?? "",
      };
    }
    case "initverifyUserNameandMobileNo": {
      return {
        ...state,
        loading: true,
        isUsernameError: false,
        isMobileError: false,
      };
    }
    case "verifyUserNameandMobileNoSuccess": {
      return {
        ...state,
        loading: false,
        isUsernameError: false,
        isMobileError: false,
        workingState: 0,
      };
    }
    case "inititateOTPVerification": {
      return {
        ...state,
        loading: false,
        otploading: true,
        OtpuserMessage: "",
        otpmodelClose: false,
      };
    }
    case "OTPVerificationComplate": {
      return {
        ...state,
        loading: false,
        otploading: false,
        OtpuserMessage: "",
        workingState: 1,
        otpmodelClose: Boolean(action?.payload?.otpmodelclose),
      };
    }
    case "OTPVerificationFailed": {
      return {
        ...state,
        otploading: false,
        OtpuserMessage: action?.payload?.error,
        otpmodelClose: Boolean(action?.payload?.otpmodelclose),
      };
    }
    case "verifyPasswordFailed": {
      return {
        ...state,
        loading: false,
        isPasswordError: action?.payload?.isPasswordError ?? false,
        isConfirmPasswordError:
          action?.payload?.isConfirmPasswordError ?? false,
        userMessageforPassword: action?.payload?.userMessageforPassword ?? "",
        userMessageforconfirmPassword:
          action?.payload?.userMessageforconfirmPassword ?? "",
      };
    }
    case "initverifyPasswordSetReq": {
      return {
        ...state,
        loading: true,
        isPasswordError: false,
        isConfirmPasswordError: false,
      };
    }
    case "passwordRegistaredSuccess": {
      return {
        ...state,
        loading: false,
        isPasswordError: false,
        isConfirmPasswordError: false,
      };
    }
    default: {
      return state;
    }
  }
};
export const ForgotPasswordController = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loginState, dispath] = useReducer(reducer, inititalState);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const onSubmitHandel = (data, flag) => {
    if (verifyRequestData(data, flag)) {
      if (flag === 0) {
        dispath({ type: "initverifyUserNameandMobileNo" });
        dispath({ type: "verifyUserNameandMobileNoSuccess" });
        setOpen(true);
      } else if (flag === 1) {
        dispath({ type: "initverifyPasswordSetReq" });
        dispath({ type: "passwordRegistaredSuccess" });
        enqueueSnackbar("Password successfully reset", {
          variant: "success",
        });
        navigate("login");
      }
    }
  };

  const verifyRequestData = (data, flag) => {
    if (flag === 0) {
      let validationData = {
        isUsernameError: false,
        isMobileError: false,
        userMessageforusername: "",
        userMessageforMobileno: "",
      };
      if (!Boolean(data.userName)) {
        validationData.isUsernameError = true;
        validationData.userMessageforusername = "Username is Required.";
      }
      if (!Boolean(data.mobileno)) {
        validationData.isMobileError = true;
        validationData.userMessageforMobileno = "Mobile No. is Required.";
      } else if (
        isNaN(data.mobileno) ||
        (data.mobileno.length !== 11 && data.mobileno.length !== 13)
      ) {
        validationData.isMobileError = true;
        validationData.userMessageforMobileno = "Please enter valid Mobile No.";
      }
      dispath({
        type: "verifyUserNameandMobileNoFailed",
        payload: validationData,
      });
      return !(validationData.isMobileError || validationData.isUsernameError);
    } else if (flag === 1) {
      let validationData = {
        isPasswordError: false,
        userMessageforPassword: "",
        isConfirmPasswordError: false,
        userMessageforconfirmPassword: "",
      };
      let pwdverify = utilFunction.ValidatePassword(data.password);
      if (Boolean(pwdverify)) {
        validationData.isPasswordError = true;
        validationData.userMessageforPassword = pwdverify;
      }
      if (!Boolean(data.confirmpassword)) {
        validationData.isConfirmPasswordError = true;
        validationData.userMessageforconfirmPassword =
          "Confirm password is required.";
      } else if (
        Boolean(data.password) &&
        data.password !== data.confirmpassword
      ) {
        validationData.isConfirmPasswordError = true;
        validationData.userMessageforconfirmPassword =
          "New Password and Confirm Password did not matched";
      }
      dispath({
        type: "verifyPasswordFailed",
        payload: validationData,
      });
      return !(
        validationData.isConfirmPasswordError || validationData.isPasswordError
      );
    }
    return true;
  };
  const handleClose = () => {
    setOpen(false);
  };
  const VerifyOTP = async (OTPNumber) => {
    if (Boolean(OTPNumber) && OTPNumber.toString().length === 6) {
      dispath({ type: "inititateOTPVerification" });
      dispath({
        type: "OTPVerificationComplate",
        payload: { otpmodelclose: true },
      });
    } else {
      dispath({
        type: "OTPVerificationFailed",
        payload: { error: "Please enter a 6 digit OTP number" },
      });
    }
  };
  return (
    <Box display="flex" width={1} className={classes.wrapper}>
      <Box
        display="flex"
        flexDirection="column"
        width={1 / 2}
        className={classes.loginLeft}
      >
        <img alt="Bank Logo" src={loginImg} className={classes.loginImg} />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        width={1 / 2}
        className={classes.loginRight}
      >
        <img src={logo} alt="Logo" width="auto" height="auto" />
        <h2>Forgot Password</h2>
        <ForgotPasswordFields
          classes={classes}
          loginState={loginState}
          onSubmit={onSubmitHandel}
        />
        <OTPModel
          classes={classes}
          open={open}
          handleClose={handleClose}
          loginState={loginState}
          VerifyOTP={VerifyOTP}
          OTPError={loginState?.OtpuserMessage ?? ""}
          setOTPError={(error) => {
            dispath({
              type: "OTPVerificationFailed",
              payload: { error: error },
            });
          }}
        />
      </Box>
    </Box>
  );
};
