import { useReducer, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login.png";

import { useStyles } from "./style";
import { UsernamePasswordField } from "./usernamePassword";
import { AuthContext } from "./authContext";
import logo from "../../assets/images/logo.jpg";
import { OTPModel } from "./otpPopup";
import { veirfyUsernameandPassword, verifyOTP } from "./api";
import { useSnackbar } from "notistack";
import { PasswordRotation } from "./pwdRotation";
import { VerifyFinger } from "./verifyFinger";

import * as API from "./api";
import { matchFinger } from "./biometric";
import { Grid } from "@mui/material";
import { Container } from "@mui/material";
import { BankDetails } from "./bankDetails";
import { useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { utilFunction } from "components/utils";
const inititalState = {
  username: "",
  firstName: "",
  lastName: "",
  loading: false,
  otploading: false,
  isError: false,
  isUsernameError: false,
  isPasswordError: false,
  userMessage: "",
  OtpuserMessage: "",
  userMessageforpassword: "",
  userMessageforusername: "",
  currentFlow: "username",
  transactionID: "",
  access_token: "",
  token_type: "",
  otpmodelClose: false,
  verifyThrough: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "inititateUserNameVerification":
    case "inititatePasswordVerification":
    case "inititateUserFingerVerification":
    case "inititateOTPVerification": {
      return {
        ...state,
        loading: true,
        isError: false,
        isUsernameError: false,
        isPasswordError: false,
        isOTPError: false,
        isBiometricError: false,
        userMessage: "",
      };
    }
    case "usernameandpasswordrequired": {
      return {
        ...state,
        loading: false,
        isError: true,
        isUsernameError: true,
        isPasswordError: true,
        otploading: false,
        userMessage: action?.payload?.error,
        userMessageforpassword: action?.payload?.errorPassword,
        userMessageforusername: action?.payload?.errorUsername,
        username: "",
        transactionID: "",
      };
    }
    case "passwordVerificationFailure":
      return {
        ...state,
        loading: false,
        isError: true,
        isUsernameError: false,
        isPasswordError: true,
        otploading: false,
        userMessage: action?.payload?.error,
        userMessageforpassword: action?.payload?.errorPassword,
        username: "",
        transactionID: "",
      };
    case "usernameVerificationFailure": {
      return {
        ...state,
        loading: false,
        isError: true,
        isUsernameError: true,
        isPasswordError: false,
        otploading: false,
        userMessage: action?.payload?.error,
        userMessageforusername: action?.payload?.errorUsername,
        username: "",
        transactionID: "",
      };
    }
    case "inititatePasswordVerification": {
      return {
        ...state,
        loading: true,
        isError: false,
        isUsernameError: false,
        isPasswordError: false,
        otploading: false,
        userMessage: "",
        userMessageforusername: "",
        userMessageforpassword: "",
        username: "",
        transactionID: "",
        access_token: "",
      };
    }
    case "passwordRotation": {
      return {
        ...state,
        loading: false,
        username: action?.payload?.username,
        access_token: action?.payload?.access_token,
        token_type: action?.payload?.token_type,
      };
    }
    case "passwordRotationsuccess": {
      return {
        ...state,
        loading: false,
        otpmodelClose: Boolean(action?.payload?.otpmodelclose),
      };
    }
    case "passwordVerificationSuccessful": {
      return {
        ...state,
        loading: false,
        otploading: false,
        transactionID: action?.payload?.transactionID,
        username: action?.payload?.username,
        OtpuserMessage: "",
        access_token: action?.payload?.access_token,
        token_type: action?.payload?.token_type,
        otpmodelClose: false,
        currentFlow: "OTP",
        verifyThrough: action?.payload?.verifyThrough,
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
    case "biometricVerificationFailure":
      return {
        ...state,
        loading: false,
        isError: true,
        isBiometricError: true,
        userMessage: action?.payload?.error,
      };
    case "biometricVerificationSuccessful":
      return {
        ...state,
        loading: false,
        isError: false,
        isBiometricError: false,
        state: action.payload,
      };
    case "OTPVerificationComplate": {
      return {
        ...state,
        loading: false,
        otploading: false,
        OtpuserMessage: "",
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
    case "backToUsernameVerification": {
      return inititalState;
    }
    default: {
      return state;
    }
  }
};

export const AuthLoginController = () => {
  const { isLoggedIn, login } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  const [loginState, dispath] = useReducer(reducer, inititalState);
  const [open, setOpen] = useState(false);
  const [openpwdreset, setOpenPwdReset] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const failureCount = useRef(0);
  const [dashboardLogoURL, setDashboardLogoURL] = useState<any | null>(null);
  const urlObj = useRef<any>(null);
  // const [image, setImage] = useState<any>(null);
  // let path = require("assets/sound/successSound.mp3").default;
  // let audio = new Audio(path);
  // console.log(audio);
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/audit", { replace: true });
    }
  }, [navigate, isLoggedIn]);

  const {
    data: imageData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getLoginImageData"], () => API.getLoginImageData());

  useEffect(() => {
    if (Boolean(imageData?.[0]?.DASHBOARD_APP_LOGO)) {
      let blob = utilFunction.base64toBlob(imageData?.[0]?.DASHBOARD_APP_LOGO);
      urlObj.current =
        typeof blob === "object" && Boolean(blob)
          ? URL.createObjectURL(blob)
          : "";
      setDashboardLogoURL(urlObj.current);
    }
  }, [imageData]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLoginImageData"]);
    };
  }, []);
  const verifyUsernamePassword = async (username, password) => {
    if (Boolean(username) && Boolean(password)) {
      dispath({ type: "inititatePasswordVerification" });
      const { status, data, message, responseType, access_token } =
        await veirfyUsernameandPassword(username, password);
      if (status === "0" && responseType === "S") {
        dispath({
          type: "passwordRotation",
          payload: {
            username: username,
            access_token: access_token?.access_token,
            token_type: access_token?.token_type,
          },
        });
        setOpenPwdReset(true);
      } else if (status === "0") {
        dispath({
          type: "passwordVerificationSuccessful",
          payload: {
            transactionID: data?.REQUEST_CD,
            username: username,
            access_token: access_token?.access_token,
            token_type: access_token?.token_type,
            verifyThrough: data?.VERIFY_THROUGH,
          },
        });
        setOpen(true);
      } else {
        dispath({
          type: "passwordVerificationFailure",
          payload: { error: message, errorPassword: message },
        });
      }
    } else if (!Boolean(username) && !Boolean(password)) {
      dispath({
        type: "usernameandpasswordrequired",
        payload: {
          error: "Username and Password is a required",
          errorUsername: "Username is a required",
          errorPassword: "Password is a required",
        },
      });
    } else if (!Boolean(username)) {
      dispath({
        type: "usernameVerificationFailure",
        payload: {
          error: "Username is a required",
          errorUsername: "Username is a required",
        },
      });
    } else {
      dispath({
        type: "passwordVerificationFailure",
        payload: {
          error: "Password is a required",
          errorPassword: "Password is a required",
        },
      });
    }
  };
  const VerifyOTP = async (OTPNumber) => {
    if (Boolean(OTPNumber) && OTPNumber.toString().length === 6) {
      dispath({ type: "inititateOTPVerification" });
      const { status, data, message } = await verifyOTP(
        loginState.transactionID,
        loginState.username,
        OTPNumber,
        loginState.access_token,
        loginState.token_type
      );

      if (status === "0") {
        // try {
        //   audio.play();
        // } catch (error) {
        //   console.log(error);
        // }
        dispath({ type: "OTPVerificationComplate" });
        login(data);
      } else if (status === "999") {
        dispath({
          type: "OTPVerificationFailed",
          payload: { error: message, otpmodelclose: true },
        });
        enqueueSnackbar(message, { variant: "error" });
      } else {
        dispath({
          type: "OTPVerificationFailed",
          payload: { error: message, otpmodelclose: false },
        });
      }
    } else {
      dispath({
        type: "OTPVerificationFailed",
        payload: { error: "Please enter a 6 digit OTP number" },
      });
    }
  };

  const handlePasswordRotationClose = (flag) => {
    if (flag === "0") {
      dispath({
        type: "passwordRotationsuccess",
        payload: { otpmodelclose: true },
      });
    }
    setOpenPwdReset(false);
  };
  const changeUserName = () => {
    dispath({
      type: "backToUsernameVerification",
    });
  };
  const verifyFinger = async () => {
    dispath({ type: "inititateUserFingerVerification" });
    try {
      const fingerResponse = await API.capture();
      if (fingerResponse?.ErrorCode === "0") {
        const result = await API.verifyUserFinger(
          loginState.username,
          loginState.token
        );
        if (result.status === "success") {
          const promise: any = await matchFinger(
            result.data,
            fingerResponse.IsoTemplate
          );
          if (promise.status) {
            dispath({ type: "biometricVerificationSuccessful" });
            login({
              username: loginState.username,
              token: loginState.token,
              role: loginState.role,
              roleName: loginState.roleName,
              isLoggedIn: false,
              fullname: loginState.fullname,
              branch: loginState.branch,
              branchCode: loginState.branchCode,
              lastLogin: loginState.lastLogin,
              access: loginState.accessBranch,
              bankName: loginState.bankName,
              menurights: result.data,
            });
            await API.biometricStatusUpdate(
              loginState.username,
              loginState.token,
              "S"
            );
          } else {
            failureCount.current = failureCount.current + 1;
            dispath({
              type: "biometricVerificationFailure",
              payload: {
                error: "Finger Not Match.Please Try Again",
              },
            });
            await API.biometricStatusUpdate(
              loginState.username,
              loginState.token,
              "F"
            );
            if (failureCount.current >= 3) changeUserName();
          }
        } else {
          dispath({
            type: "biometricVerificationFailure",
            payload: {
              error: result?.data?.errorMessage ?? "Unknown error occured",
            },
          });
        }
      } else {
        dispath({
          type: "biometricVerificationFailure",
          payload: {
            error: fingerResponse?.ErrorMessage ?? "MFS100 Not Found",
          },
        });
      }
    } catch (e: any) {
      dispath({
        type: "biometricVerificationFailure",
        payload: {
          error: e?.message ?? "Unknown error occured",
        },
      });
    }
  };
  return (
    <>
      <Grid container style={{ height: "100vh", overflow: "hidden" }}>
        <BankDetails imageData={imageData} />
        <Grid item xs={11} md={6} lg={6} sm={6}>
          {isLoading || isFetching ? (
            <LoaderPaperComponent />
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              padding={"31px"}
            >
              <img
                src={Boolean(dashboardLogoURL) ? dashboardLogoURL : ""}
                alt="Logo"
              />
            </Grid>
          )}
          {loginState.currentFlow === "username" ? (
            <UsernamePasswordField
              key="username"
              classes={classes}
              loginState={loginState}
              verifyUsernamePassword={verifyUsernamePassword}
            />
          ) : (
            <>
              {loginState.verifyThrough === "O" ? (
                <OTPModel
                  key="otp"
                  classes={classes}
                  loginState={loginState}
                  VerifyOTP={VerifyOTP}
                  previousStep={changeUserName}
                  OTPError={loginState?.OtpuserMessage ?? ""}
                  setOTPError={(error) => {
                    dispath({
                      type: "OTPVerificationFailed",
                      payload: { error: error },
                    });
                  }}
                  open={undefined}
                  handleClose={undefined}
                />
              ) : (
                <VerifyFinger
                  key="biometric"
                  classes={classes}
                  loginState={loginState}
                  verifyFinger={verifyFinger}
                  previousStep={changeUserName}
                />
              )}
            </>
          )}
        </Grid>
      </Grid>
      {/* {openpwdreset ? (
          //   <PasswordRotation
          //     classes={classes}
          //     open={openpwdreset}
          //     username={loginState.username}
          //     accessToken={loginState.access_token}
          //     tokenType={loginState.token_type}
          //     handleClose={handlePasswordRotationClose}
          //   />
          // ) : null} */}
    </>
  );
};
