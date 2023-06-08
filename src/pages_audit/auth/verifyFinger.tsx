import { Fragment, useState } from "react";
import { GradientButton } from "components/styledComponent/button";
import FingerprintSharpIcon from "@mui/icons-material/FingerprintSharp";
import * as API from "./api";
import { CircularProgress, Container, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import "./verify.css";
export const VerifyFinger = ({ classes, loginState, verifyFinger }) => {
  return (
    <Fragment>
      <Container maxWidth="xs">
        <Grid alignItems="center">
          <div
            style={{
              marginRight: "25px",
              width: "102%",
              // marginBottom: "55px",
            }}
          >
            {/* <Typography variant="h6" color="primary">
          Hi{`, ${loginState?.fullname ?? ""}`}
        </Typography> */}
            <br />
            <div
              style={{
                color: "#000000",
                fontSize: "34px",
                fontWeight: "600",
                // fontFamily: "Poppins",
                alignItems: "center",
                fontStyle: "normal",
                lineHeight: "150%",
                marginBottom: "10px",
              }}
            >
              Biometrix Authentication
            </div>
            <div
              style={{
                color: "#949597",
                fontSize: "18px",
                fontWeight: "400",
                // fontFamily: "Poppins",
                alignItems: "center",
                fontStyle: "normal",
                lineHeight: "33px",
                // marginBottom: "10px",
              }}
            >
              Kindly place you finger on biometrix machine
            </div>
            <br />
            <Typography variant="h5" style={{ color: "#000000" }}>
              Hi Leo{`, ${loginState?.fullname ?? ""}`}
            </Typography>
            <br />
            <div
              className={
                loginState?.isBiometricError
                  ? classes.eFingerUi
                  : classes.fingerUi
              }
            >
              <div className="spinner-wrap">
                <FingerprintSharpIcon
                  sx={{
                    fontSize: "80px",
                    opacity: "0.4",
                    borderRadius: "50%",
                    display: "flex",
                    margin: "0 auto",
                    "&:after": {
                      borderBottom: "2px solid #26A456",
                    },
                  }}
                  className={
                    loginState?.isBiometricError ? classes.FingerIcon : null
                  }
                  color={loginState?.isBiometricError ? "error" : "inherit"}
                />
                {loginState?.isScanning ? (
                  <>
                    <div
                      className="spinner-item"
                      style={{
                        border: loginState?.isScanning
                          ? "1px solid #949597"
                          : " 1px solid red",
                      }}
                    ></div>
                    <div
                      className="spinner-item spinner-item--2"
                      style={{
                        border: loginState?.isScanning
                          ? "1px solid #949597"
                          : "1px solid red",
                      }}
                    ></div>
                    <div
                      className="spinner-item spinner-item--3"
                      style={{
                        border: loginState?.isScanning
                          ? "1px solid #949597"
                          : "1px solid red",
                      }}
                    ></div>
                  </>
                ) : null}
              </div>
            </div>

            <div className={classes.biometric}>
              <div style={{ marginTop: "50px" }}>
                <div className={loginState.isScanning ? "progress" : "hide"}>
                  <div
                    className="bar"
                    style={{ width: loginState.isScanning ? "30%" : "0%" }}
                  ></div>
                </div>
                <h3
                  style={{
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "space-around",
                    color: loginState?.isBiometricError
                      ? "rgb(255 0 0 / 65%)"
                      : "inherit",
                  }}
                >
                  {loginState?.isBiometricError
                    ? loginState?.userMessage
                    : loginState?.loading
                    ? "Loading..."
                    : loginState?.isScanning
                    ? "Scanning..."
                    : null}
                </h3>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "38px 0 0 0",
              gap: "10px",
              // padding: "10px",
            }}
          >
            <GradientButton
              style={{
                borderRadius: loginState.loading ? "50%" : "10px",
                height: loginState.loading ? "40px" : "100%",
                width: loginState.loading ? "0px" : "90%",
                minWidth: loginState.loading ? "40px" : "80px",
              }}
              disabled={loginState.loading}
              onKeyDown={(e) => e.keyCode === 13 && verifyFinger}
              onClick={verifyFinger}
              className={classes.otpButtons}
            >
              {loginState.loading ? (
                <CircularProgress
                  size={25}
                  thickness={4.6}
                  style={{ color: "#fff" }}
                />
              ) : (
                "Verify"
              )}
            </GradientButton>
          </div>
        </Grid>
      </Container>
    </Fragment>
  );
};
