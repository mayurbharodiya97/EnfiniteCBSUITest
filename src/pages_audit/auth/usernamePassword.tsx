import { Fragment, useState, useEffect, useRef } from "react";
import { TextField } from "components/styledComponent/textfield";
import { GradientButton } from "components/styledComponent/button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
export const UsernamePasswordField = ({
  classes,
  loginState,
  verifyUsernamePassword,
}) => {
  const [input, setInput] = useState({ userName: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "userName" && value) {
      loginState.isUsernameError = false;
    }
    if (name === "password" && value) {
      loginState.isPasswordError = false;
    }
    setInput((values) => ({ ...values, [name]: value }));
  };
  const inputRef = useRef<any>(null);
  const inputPassRef = useRef<any>(null);
  const inputButtonRef = useRef<any>(null);
  useEffect(() => {
    if (loginState.isUsernameError) {
      setTimeout(() => {
        inputRef?.current?.focus?.();
      }, 1000);
    } else if (loginState.isPasswordError) {
      setTimeout(() => {
        inputPassRef?.current?.focus?.();
      }, 1000);
    }
  }, [loginState.isUsernameError, loginState.isPasswordError]);
  // useEffect(() => {
  //   if (loginState?.otpmodelClose ?? false) {
  //     setInput((values) => ({ ...values, password: "" }));
  //     setTimeout(() => {
  //       inputPassRef?.current?.focus?.();
  //     }, 1500);
  //   }
  // }, [loginState.otpmodelClose]);
  return (
    <Fragment>
      <Container maxWidth="xs">
        <Grid alignItems="center" style={{ paddingTop: "20px" }}>
          <div
            style={{
              color: "#000000 !important",
              fontSize: "30px",
              fontWeight: "600",
              // fontFamily: "Poppins",
              alignItems: "center",
              fontStyle: "normal",
              lineHeight: "150%",
            }}
          >
            <h3>Sign In</h3>
          </div>
          <div
            className=""
            style={{
              color: "#949597",
              fontSize: "18px",
              fontWeight: "400",
              // fontFamily: "Poppins",
              alignItems: "center",
              fontStyle: "normal",
              lineHeight: "33px",
              width: "360px",
            }}
          >
            Please provide your email and password
          </div>
          <div className={classes.formWrap}>
            <TextField
              autoFocus={true}
              label={"User ID"}
              placeholder="User ID"
              style={{
                marginTop: "21px",
                marginBottom: "17px",
              }}
              fullWidth
              type={"text"}
              name="userName"
              value={input.userName || ""}
              onChange={handleChange}
              error={loginState.isUsernameError}
              helperText={
                loginState.isUsernameError
                  ? loginState.userMessageforusername
                  : ""
              }
              InputLabelProps={{ shrink: true }}
              disabled={loginState.loading}
              autoComplete="off"
              ref={inputRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  inputButtonRef?.current?.click?.();
                }
              }}
              inputProps={{
                maxLength: "16",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                marginTop: "8px",
              }}
            >
              <TextField
                key="employee"
                label="Password"
                placeholder="Enter Password"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={handleChange}
                error={loginState.isPasswordError}
                helperText={
                  loginState.isPasswordError
                    ? loginState.userMessageforpassword
                    : ""
                }
                disabled={loginState.loading}
                ref={inputPassRef}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    inputButtonRef?.current?.click?.();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((old) => !old)}
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={loginState.loading}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ maxLength: "16" }}
              />
            </div>
            <div style={{ marginTop: "20px", display: "flex" }}>
              <div style={{ flex: "auto", textAlign: "end" }}>
                <a href="forgotpassword">Forgot Password</a>
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex" }}>
              {/* <div style={{ flex: "auto", textAlign: "end" }}>
            <a href="forgotpassword">Forgot Password</a>
          </div> */}

              <div
                style={{
                  flex: "auto",
                  textAlign: "center",
                  marginTop: "5px",
                  marginBottom: "17px",
                }}
              >
                <GradientButton
                  style={{ borderRadius: "10px" }}
                  fullWidth
                  disabled={loginState.loading}
                  endIcon={
                    loginState.loading ? <CircularProgress size={20} /> : null
                  }
                  onClick={() =>
                    verifyUsernamePassword(
                      (input.userName || "").toLowerCase(),
                      input.password
                    )
                  }
                  ref={inputButtonRef}
                >
                  Next
                </GradientButton>
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </Fragment>
  );
};
