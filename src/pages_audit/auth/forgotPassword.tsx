import { useReducer, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "assets/images/login.png";
import { useStyles } from "./style";
import logo from "assets/images/logo.jpg";
import { ForgotPasswordFields } from "./forgotPasswordField";
import { OTPModel, OTPModelForm } from "./otpPopup";
import { utilFunction } from "components/utils/utilFunctions";
import { useSnackbar } from "notistack";
import { Box, Container, Grid } from "@mui/material";
import { BankDetails } from "./bankDetails";
import {
  updatenewPassword,
  veirfyUsernameandMobileNo,
  verifyOTPForPWDReset,
} from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { useQuery } from "react-query";
import * as API from "./api";
import { useTranslation } from "react-i18next";
import { MultiLanguages } from "./multiLanguages";
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
  requestCd: "",
  username: "",
  auth_type: "O",
  transactionID: "",
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
        isApiError: action?.payload?.isApiError ?? false,
        apierrorMessage: action?.payload?.apierrorMessage ?? "",
        requestCd: "",
        username: "",
      };
    }
    case "initverifyUserNameandMobileNo": {
      return {
        ...state,
        loading: true,
        isUsernameError: false,
        isMobileError: false,
        requestCd: "",
        username: "",
      };
    }
    case "verifyUserNameandMobileNoSuccess": {
      return {
        ...state,
        loading: false,
        isUsernameError: false,
        isMobileError: false,
        workingState: 0,
        isApiError: false,
        apierrorMessage: "",
        requestCd: action?.payload?.requestCd ?? "",
        username: action?.payload?.username ?? "",
        auth_type: action?.payload?.auth_type,
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
        isApiError: false,
        apierrorMessage: "",
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
    case "OTPResendSuccess": {
      return {
        ...state,
        requestCd: action?.payload?.requestCd,
      };
    }
    default: {
      return state;
    }
  }
};
export const ForgotPasswordController = ({ screenFlag }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loginState, dispath] = useReducer(reducer, inititalState);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const otpResendRef = useRef(1);
  const { t } = useTranslation();
  const {
    data: imageData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getLoginImageData"], () =>
    API.getLoginImageData({ APP_TRAN_CD: "51" })
  );
  const onSubmitHandel = async (data, flag) => {
    if (verifyRequestData(data, flag)) {
      if (flag === 0) {
        dispath({ type: "initverifyUserNameandMobileNo" });
        const {
          status,
          data: resdata,
          message,
        } = await veirfyUsernameandMobileNo(
          data?.userName,
          data?.mobileno,
          screenFlag
        );

        if (status === "0") {
          dispath({
            type: "verifyUserNameandMobileNoSuccess",
            payload: {
              requestCd: String(resdata?.TRAN_CD ?? ""),
              username: data?.userName,
              auth_type: resdata?.AUTH_TYPE,
            },
          });
          setOpen(true);
        } else {
          dispath({
            type: "verifyUserNameandMobileNoFailed",
            payload: {
              isApiError: true,
              apierrorMessage: message,
            },
          });
        }
      } else if (flag === 1) {
        dispath({ type: "initverifyPasswordSetReq" });
        const {
          status,
          data: resdata,
          message,
        } = await updatenewPassword(
          loginState?.requestCd,
          loginState?.username,
          data?.password
        );
        if (status === "0") {
          dispath({ type: "passwordRegistaredSuccess" });
          enqueueSnackbar("Password successfully reset", {
            variant: "success",
          });
          navigate("login");
        } else if (status === "99") {
          dispath({
            type: "verifyPasswordFailed",
            payload: {
              isApiError: true,
              apierrorMessage: message,
            },
          });
        } else {
          enqueueSnackbar(message, {
            variant: "error",
          });
          navigate("login");
        }
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
        validationData.userMessageforusername = "UsernameisRequired";
      }
      if (!Boolean(data.mobileno)) {
        validationData.isMobileError = true;
        validationData.userMessageforMobileno = "MobileNoisRequired";
      } else if (
        isNaN(data.mobileno) ||
        (data.mobileno.length !== 10 && data.mobileno.length !== 13)
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
        validationData.userMessageforconfirmPassword = t(
          "Confirmpasswordisrequired"
        );
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
  const changeUserName = () => {
    dispath({
      type: "backToUsernameVerification",
    });
  };

  const VerifyOTP = async (OTPNumber) => {
    if (Boolean(OTPNumber) && OTPNumber.toString().length === 6) {
      dispath({ type: "inititateOTPVerification" });
      const {
        status,
        data: resdata,
        message,
      } = await verifyOTPForPWDReset(
        loginState?.requestCd,
        loginState?.username,
        OTPNumber,
        loginState?.auth_type,
        screenFlag
      );
      console.log("loginState?.authType", loginState);
      if (status === "0") {
        console.log(">>screenFlag", screenFlag);
        if (screenFlag === "totp") {
          enqueueSnackbar(message, {
            variant: "success",
          });
          navigate("login");
        } else {
          dispath({
            type: "OTPVerificationComplate",
            payload: { otpmodelclose: true },
          });
        }
      } else if (status === "99") {
        dispath({
          type: "OTPVerificationFailed",
          payload: { error: message },
        });
      } else {
        enqueueSnackbar(message, {
          variant: "error",
        });
        navigate("login");
      }
    } else {
      dispath({
        type: "OTPVerificationFailed",
        payload: { error: "Please enter a 6 digit OTP number" },
      });
    }
  };
  useEffect(() => {
    GeneralAPI.setDocumentName("Password Reset");
  }, []);
  return (
    <>
      <Grid container style={{ height: "100vh", overflow: "hidden" }}>
        <BankDetails imageData={imageData} />
        <Grid item xs={6} md={6} lg={6} sm={6}>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            padding={"31px"}
          >
            <img src={logo} alt="Logo" />
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            padding={"0 35px 0 0"}
          >
            <MultiLanguages />
          </Grid>
          <Container maxWidth="xs">
            <Grid alignItems="center" style={{ paddingTop: "20px" }}>
              <h2 style={{ margin: "10px 0" }}>
                {loginState.workingState === 1
                  ? t("Setnewpassword")
                  : screenFlag === "totp"
                  ? "Forgot TOTP"
                  : t("ForgotPassword")}
              </h2>
              {open ? (
                <OTPModelForm
                  classes={classes}
                  handleClose={handleClose}
                  loginState={loginState}
                  VerifyOTP={VerifyOTP}
                  OTPError={t(loginState?.OtpuserMessage ?? "")}
                  setOTPError={(error) => {
                    dispath({
                      type: "OTPVerificationFailed",
                      payload: { error: error },
                    });
                  }}
                  resendFlag={"FORGET_PW"}
                  setNewRequestID={(newRequestID) => {
                    dispath({
                      type: "OTPResendSuccess",
                      payload: { requestCd: newRequestID },
                    });
                    otpResendRef.current = otpResendRef.current + 1;
                  }}
                  otpresendCount={otpResendRef.current}
                />
              ) : (
                <ForgotPasswordFields
                  classes={classes}
                  loginState={loginState}
                  onSubmit={onSubmitHandel}
                />
              )}
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};
