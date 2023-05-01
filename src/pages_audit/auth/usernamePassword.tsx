import { Fragment, useState, useEffect, useRef } from "react";
import { TextField } from "components/styledComponent/textfield";
import { GradientButton } from "components/styledComponent/button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CircularProgress, IconButton, InputAdornment } from "@mui/material";
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
  useEffect(() => {
    if (loginState?.otpmodelClose ?? false) {
      setInput((values) => ({ ...values, password: "" }));
      setTimeout(() => {
        inputPassRef?.current?.focus?.();
      }, 1500);
    }
  }, [loginState.otpmodelClose]);
  return (
    <Fragment>
      <div className="text">Login with your userID and Password</div>
      <div className={classes.formWrap}>
        <TextField
          autoFocus={true}
          label={"Username"}
          placeholder="Enter Username"
          fullWidth
          type={"text"}
          name="userName"
          value={input.userName || ""}
          onChange={handleChange}
          error={loginState.isUsernameError}
          helperText={
            loginState.isUsernameError ? loginState.userMessageforusername : ""
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
          inputProps={{ maxLength: "16" }}
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
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: "16" }}
          />
        </div>
        <div style={{ marginTop: "20px", display: "flex" }}>
          {/* <div style={{ flex: "auto" }}>
            <a href="forgotpassword">Forgot Password</a>
          </div> */}

          <div style={{ flex: "auto", textAlign: "end" }}>
            <GradientButton
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
              Login
            </GradientButton>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
