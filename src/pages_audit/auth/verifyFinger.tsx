import { Fragment } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GradientButton } from "components/styledComponent/button";
import Typography from "@material-ui/core/Typography";
import FingerprintSharpIcon from "@mui/icons-material/FingerprintSharp";
import * as API from "./api";
import { TextField } from "@material-ui/core";
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
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
              marginBottom: "55px",
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
              Biomatrix Authentication
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
              Kindly place you finger on biomatrix machine
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
              <FingerprintSharpIcon
                sx={{
                  fontSize: "80px",
                  color: "#949597",
                  // width: "5em",
                  // border: "1px solid #1AA748",
                  // boxShadow: "0 0 0 1px #1AA748 inset, 0 0 0 2px #1AA748 inset",
                  // borderRadius: "50%",
                  display: "flex",
                  margin: "0 auto",
                  "&:after": {
                    borderBottom: "2px solid #26A456",
                    color: "#1AA748",
                  },
                }}
                className={
                  loginState?.isBiometricError ? classes.FingerIcon : null
                }
              />
            </div>
            <div className={classes.biometric}>
              <TextField
                key="biometric"
                name="biometric"
                hidden={true}
                style={{
                  // marginTop: "-20px",
                  width: "40%",
                  display: "flex",
                  margin: "0 auto",
                  top: "20px",
                  // background: "#1AA748",
                  // borderRadius: "5%",
                  // height: "3px",
                }}
                error={loginState.isBiometricError}
                helperText={
                  loginState.isBiometricError ? loginState.userMessage : ""
                }
                disabled={true}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "28px 0 0 0",
              gap: "10px",
              padding: "10px",
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
                Next
              </GradientButton>
            </Container>
          </div>
        </Grid>
      </Container>
    </Fragment>
  );
};
