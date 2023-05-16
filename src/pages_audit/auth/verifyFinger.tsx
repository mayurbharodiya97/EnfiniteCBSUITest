import { Fragment } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GradientButton } from "components/styledComponent/button";
import Typography from "@material-ui/core/Typography";
import FingerprintSharpIcon from "@mui/icons-material/FingerprintSharp";
import * as API from "./api";
import { TextField } from "@material-ui/core";
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
import "./verify.css";
export const VerifyFinger = ({
  classes,
  loginState,
  verifyFinger,
  previousStep,
}) => {
  return (
    <Fragment>
      <Container maxWidth="xs">
        <Grid alignItems="center">
          <div
            // className={classes.formWrap}
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
                {/* <img src="assets/img/scnner.png" alt="" className="image" /> */}
                <FingerprintSharpIcon
                  sx={{
                    fontSize: "80px",
                    //color: "#949597",
                    opacity: "0.4",
                    // width: "5em",
                    // border: "1px solid #949597",
                    // boxShadow: "0 0 0 1px #1AA748 inset, 0 0 0 2px #1AA748 inset",
                    borderRadius: "50%",
                    display: "flex",
                    margin: "0 auto",
                    "&:after": {
                      borderBottom: "2px solid #26A456",
                      //color: "#1AA748",
                    },
                  }}
                  className={
                    loginState?.isBiometricError ? classes.FingerIcon : null
                  }
                  color={loginState?.isBiometricError ? "error" : "inherit"}
                />
                <div
                  className="spinner-item"
                  style={{
                    border: loginState?.isBiometricError
                      ? "1px solid red"
                      : "1px solid #949597",
                  }}
                ></div>
                <div
                  className="spinner-item spinner-item--2"
                  style={{
                    border: loginState?.isBiometricError
                      ? "1px solid red"
                      : "1px solid #949597",
                  }}
                ></div>
                <div
                  className="spinner-item spinner-item--3"
                  style={{
                    border: loginState?.isBiometricError
                      ? "1px solid red"
                      : "1px solid #949597",
                  }}
                ></div>
              </div>
            </div>

            <div className={classes.biometric}>
              <div style={{ marginTop: "50px" }}>
                <div className="progress">
                  <div className="bar"></div>
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
                    ? "Scanning..."
                    : "Loading..."}
                </h3>
              </div>
              {/* <TextField
                key="biometric"
                name="biometric"
                // hidden={true}
                style={{
                  // marginTop: "-20px",
                  width: "40%",
                  display: "flex",
                  margin: "0 auto",
                  top: "20px",
                  // background: "#1AA748",
                  borderRadius: "5%",
                  // height: "3px",
                }}
                error={loginState.isBiometricError}
                helperText={
                  loginState.isBiometricError ? loginState.userMessage : ""
                }
                disabled={true}
              /> */}
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
            {/* <GradientButton onClick={previousStep} fullWidth>
          <div
            style={{
              transform: "scale(1.1)",
              margin: "0px 8px -6px -9px",
            }}
          ></div>
          Change Username
        </GradientButton> */}
            <Container maxWidth="sm">
              <GradientButton
                disabled={loginState.loading}
                endIcon={
                  loginState.loading ? (
                    <CircularProgress size={20} style={{ color: "#fff" }} />
                  ) : null
                }
                onKeyDown={(e) => e.keyCode === 13 && verifyFinger}
                fullWidth
                onClick={verifyFinger}
                size="large"
                className={classes.otpButtons}
              >
                Verify
              </GradientButton>
            </Container>
          </div>
        </Grid>
      </Container>
    </Fragment>
  );
};
