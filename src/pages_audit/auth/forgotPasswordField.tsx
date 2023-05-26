import { Fragment, useState, useEffect, useRef } from "react";
import { TextField } from "components/styledComponent/textfield";
import { GradientButton } from "components/styledComponent/button";
import {
  CircularProgress,
  FormHelperText,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordFields = ({ classes, loginState, onSubmit }) => {
  const [input, setInput] = useState({
    userName: "",
    mobileno: "",
    password: "",
    confirmpassword: "",
  });
  const inputRef = useRef<any>(null);
  const inputPassRef = useRef<any>(null);
  const inputButtonRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === "userName" && value) {
      loginState.isUsernameError = false;
    }
    if (name === "mobileno" && value) {
      value = value.replace(/\D/g, "");
      if (Boolean(value)) {
        loginState.isMobileError = false;
      }
    }
    setInput((values) => ({ ...values, [name]: value }));
  };
  useEffect(() => {
    if (loginState.workingState === 1) {
      setTimeout(() => {
        inputPassRef?.current?.focus?.();
      }, 2000);
    }
  }, [loginState.workingState]);
  return (
    <Fragment>
      <div className={classes.formWrap}>
        <TextField
          autoFocus={true}
          label={"User ID"}
          placeholder="Enter User ID"
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
          disabled={
            loginState.loading
              ? true
              : loginState.workingState === 0
              ? false
              : true
          }
          autoComplete="off"
          ref={inputRef}
          inputProps={{ maxLength: 16 }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              inputButtonRef?.current?.click?.();
            }
          }}
          style={{ paddingBottom: "8px" }}
        />
        {loginState.workingState === 0 ? (
          <TextField
            label={"Mobile No."}
            placeholder="Enter Mobile No."
            fullWidth
            type={"text"}
            name="mobileno"
            value={input.mobileno || ""}
            onChange={handleChange}
            error={loginState.isMobileError}
            helperText={
              loginState.isMobileError ? loginState.userMessageforMobileno : ""
            }
            InputLabelProps={{ shrink: true }}
            disabled={
              loginState.loading
                ? true
                : loginState.workingState === 0
                ? false
                : true
            }
            autoComplete="off"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                inputButtonRef?.current?.click?.();
              }
            }}
            inputProps={{ maxLength: 13 }}
            style={{ paddingBottom: "8px" }}
          />
        ) : null}
        {loginState.workingState === 1 ? (
          <>
            <TextField
              autoFocus={true}
              label={"Password"}
              placeholder="Enter Password"
              fullWidth
              type={"password"}
              name="password"
              value={input.password || ""}
              onChange={handleChange}
              error={loginState.isPasswordError}
              helperText={
                loginState.isPasswordError
                  ? loginState.userMessageforPassword
                  : ""
              }
              InputLabelProps={{ shrink: true }}
              disabled={loginState.loading}
              autoComplete="off"
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
              inputProps={{ maxLength: 16 }}
              style={{ paddingBottom: "8px" }}
            />
            <TextField
              label={"Confirm Password"}
              placeholder="Enter Confirm Password"
              fullWidth
              type={"password"}
              name="confirmpassword"
              value={input.confirmpassword || ""}
              onChange={handleChange}
              error={loginState.isConfirmPasswordError}
              helperText={
                loginState.isConfirmPasswordError
                  ? loginState.userMessageforconfirmPassword
                  : ""
              }
              InputLabelProps={{ shrink: true }}
              disabled={loginState.loading}
              autoComplete="off"
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
              inputProps={{ maxLength: 16 }}
              style={{ paddingBottom: "8px" }}
            />
          </>
        ) : null}
        {/* {loginState.isApiError ? (
          <FormHelperText style={{ color: "red" }}>
            {loginState.apierrorMessage}
          </FormHelperText>
        ) : null} */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <div
            style={{
              flex: "auto",
              textAlign: "center",
              marginTop: "5px",
              marginBottom: "17px",
            }}
          >
            <div>
              <GradientButton
                style={{ borderRadius: "10px", marginRight: "5px" }}
                // fullWidth

                disabled={loginState.loading}
                onClick={() => {
                  navigate("login");
                }}
                // style={{ marginRight: "5px" }}
              >
                Back to Login
              </GradientButton>

              <GradientButton
                style={{ borderRadius: "10px" }}
                disabled={loginState.loading}
                endIcon={
                  loginState.loading ? <CircularProgress size={20} /> : null
                }
                onClick={() => {
                  onSubmit(input, loginState.workingState);
                }}
                ref={inputButtonRef}
              >
                Next
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
