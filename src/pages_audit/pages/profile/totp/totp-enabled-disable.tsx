import { GradientButton } from "@acuteinfo/common-base";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import * as API from "../api";
import { PasswordVerifyMetaData } from "./metaData";
import { Alert, Transition } from "@acuteinfo/common-base";
import OTPInput from "otp-input-react";
import QRCode from "react-qr-code";
import { useStyles } from "../../../auth/style";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  AppBar,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContentText,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
interface UpdateTOTPAuthFnType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  userID?: any;
}
const updateTotpAuthFnWrapper =
  (updateTotpAuth) =>
  async ({ data, userID }: UpdateTOTPAuthFnType) => {
    return updateTotpAuth({ ...data, userID });
  };
interface UpdateTOTPAuthVerifyFnType {
  otpNumber?: string;
  secretToken?: string;
  userID?: string;
}
const updateTotpAuthVerifyFnWrapper =
  (updateTotpAuthVerify) =>
  async ({ userID, secretToken, otpNumber }: UpdateTOTPAuthVerifyFnType) => {
    return updateTotpAuthVerify({ userID, secretToken, otpNumber });
  };
const TotpEnbaledDisabled = ({ open, onClose, authFlag }) => {
  const { enqueueSnackbar } = useSnackbar();
  const authCtx = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const responseRef = useRef<any>(null);
  const failedCount = useRef(0);
  const inputButtonRef = useRef<any>(null);
  const [isQRVerifyFlow, setQRVerifyFlow] = useState(false);
  const [OTP, setOTP] = useState("");
  const [showPasswordTime, setShowPasswordTime] = useState(0);
  const showPassword = Date.now() < showPasswordTime;
  const [, forceUpdate] = useState<any | null>();
  const timerRef = useRef<any>(null);
  const classes = useStyles();
  const [isOTPError, setOTPError] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const onSubmitHandler = (data, displayData, endSubmit) => {
    mutation.mutate({
      data: { ...data, flag: authFlag },
      displayData,
      endSubmit,
      userID: authCtx?.authState?.user?.id,
    });
  };

  const mutation = useMutation(updateTotpAuthFnWrapper(API.updateTOTPAuth), {
    onError: (error: any, { endSubmit }) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      endSubmit(false, errorMsg, error?.error_detail ?? "");
    },
    onSuccess: (data, { endSubmit }) => {
      if (data?.[0]?.ERROR_CD && data?.[0]?.ERROR_CD !== "0") {
        endSubmit(false, data?.[0]?.ERROR_MSG ?? "Unknown Error occured");
        failedCount.current = failedCount.current + 1;
        if (failedCount.current >= 3) {
          enqueueSnackbar(data?.[0]?.ERROR_MSG, {
            variant: "error",
          });
          onClose(false, true);
        }
      } else {
        endSubmit(true, "");
        if (authFlag === "DISABLED") {
          enqueueSnackbar(data, {
            variant: "success",
          });
          onClose(true, false);
        } else {
          responseRef.current = data[0];
          failedCount.current = 0;
          setQRVerifyFlow(true);
        }
      }
    },
  });
  const mutationAuth = useMutation(
    updateTotpAuthVerifyFnWrapper(API.updateTOTPAuthVerify),
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        failedCount.current = failedCount.current + 1;
        if (failedCount.current >= 3) {
          enqueueSnackbar(errorMsg, {
            variant: "error",
          });
          onClose(false, true);
        }
      },
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        onClose(true, false);
      },
    }
  );
  const ClickEventHandler = () => {
    if (!Boolean(OTP) || OTP.length < 6) {
      setOTPError("Please enter a 6 digit OTP number");
    } else {
      setOTPError("");
      mutationAuth.mutate({
        otpNumber: OTP,
        secretToken: responseRef.current?.SECRET,
        userID: authCtx?.authState?.user?.id,
      });
    }
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        //@ts-ignore
        TransitionComponent={Transition}
        fullWidth={false}
      >
        {isQRVerifyFlow ? (
          <>
            <div style={{ width: "100%", height: "100%" }}>
              <div style={{ width: "97%", margin: "10px", marginRight: "0px" }}>
                <AppBar position="relative" color="secondary">
                  <Toolbar variant="dense">
                    <Typography component="div" variant="h6">
                      {t("EnabledAuth")}
                    </Typography>
                  </Toolbar>
                  {mutationAuth.isError ? (
                    <Alert
                      severity="error"
                      errorMsg={mutationAuth.error?.error_msg}
                      errorDetail={mutationAuth.error?.error_detail}
                    />
                  ) : null}
                </AppBar>
              </div>
              <Grid
                container
                style={{ marginRight: 29, marginLeft: 29, width: "84%" }}
                spacing={0}
              >
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <Typography component="div" variant="h6">
                    {t("TOTP_Note")}
                  </Typography>
                  <Typography component={"ol"} variant={"caption"}>
                    <Typography component={"li"}>{t("TOTP_Line1")}</Typography>
                    <Typography component={"li"}>{t("TOTP_Line2")}</Typography>
                    <Typography component={"li"}>{t("TOTP_Line3")}</Typography>
                    <Typography component={"li"}>{t("TOTP_Line4")}</Typography>
                    <Typography component={"li"}>{t("TOTP_Line5")}</Typography>
                  </Typography>
                  <hr style={{ margin: "10px 0 10px 0" }} />
                </Grid>
                <Grid item lg={5} md={5} xl={5} xs={5}>
                  <Card>
                    <CardActionArea>
                      <CardContent>
                        <div
                          style={{
                            minHeight: 200,
                            // minWidth: 200,
                            maxHeight: 250,
                            maxWidth: 280,
                            margin: 0,
                          }}
                        >
                          <QRCode
                            size={150}
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                              width: "100%",
                            }}
                            value={responseRef.current?.SECRET_QR ?? ""}
                            viewBox={`0 0 150 150`}
                          />
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item lg={7} md={7} xl={7} xs={7} style={{ padding: 10 }}>
                  <div
                    style={{
                      paddingTop: "27%",
                      height: "100%",
                    }}
                  >
                    <DialogContentText>{t("EnterOTP")}</DialogContentText>
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
                        disabled={mutationAuth.isLoading}
                        secure={!showPassword}
                        // className={classes.otpinputformauth}
                      />
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          if (!showPassword) {
                            setShowPasswordTime(Date.now() + 5000);
                            timerRef.current = setTimeout(
                              () => forceUpdate(Date.now()),
                              5000
                            );
                          } else if (showPassword) setShowPasswordTime(0);
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={mutationAuth.isLoading}
                        className={classes.ibtnvisible}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </div>
                    {Boolean(isOTPError) ? (
                      <Typography
                        component={"div"}
                        variant={"caption"}
                        style={{ color: "red" }}
                      >
                        {isOTPError}
                      </Typography>
                    ) : null}
                  </div>
                </Grid>
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <DialogActions>
                    <GradientButton
                      disabled={mutationAuth.isLoading}
                      onClick={() => {
                        onClose(false, false);
                      }}
                      endicon="CancelOutlined"
                      rotateIcon="scale(1.4) rotateY(360deg)"
                    >
                      {t("Close")}
                    </GradientButton>
                    <GradientButton
                      disabled={mutationAuth.isLoading}
                      endicon={
                        mutationAuth.isLoading ? undefined : "VerifiedUser"
                      }
                      rotateIcon="scale(1.4)"
                      onClick={ClickEventHandler}
                      ref={inputButtonRef}
                    >
                      {t("otp.VerifyOTP")}{" "}
                      {mutationAuth.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null}
                    </GradientButton>
                  </DialogActions>
                </Grid>
              </Grid>
            </div>
          </>
        ) : (
          <>
            <div style={{ minHeight: 180, minWidth: 500 }}>
              <FormWrapper
                key="passwordChange"
                metaData={PasswordVerifyMetaData as MetaDataType}
                initialValues={{}}
                onSubmitHandler={onSubmitHandler}
                displayMode={"new"}
                hideDisplayModeInTitle={true}
                formStyle={{
                  background: "white",
                  height: "auto",
                }}
                ref={formRef}
                hideHeader={false}
                containerstyle={{ padding: "11px" }}
              />
            </div>
            <DialogActions>
              <GradientButton
                disabled={mutation.isLoading}
                onClick={() => {
                  onClose(false, false);
                }}
                endicon="CancelOutlined"
                rotateIcon="scale(1.4) rotateY(360deg)"
              >
                {t("Close")}
              </GradientButton>
              <GradientButton
                disabled={mutation.isLoading}
                // endIcon={
                //   mutation.isLoading ? <CircularProgress size={20} /> : null
                // }
                onClick={(e) => {
                  formRef.current?.handleSubmit?.(e);
                }}
                endicon={mutation.isLoading ? undefined : "TaskAlt"}
                rotateIcon="scale(1.4) "
              >
                {t("Biometric.Verify")}{" "}
                {mutation.isLoading ? <CircularProgress size={20} /> : null}
              </GradientButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Fragment>
  );
};

export default TotpEnbaledDisabled;
