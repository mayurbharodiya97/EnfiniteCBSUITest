import { Fragment, useState, useEffect, useRef } from "react";
import { TextField } from "components/styledComponent/textfield";
import { GradientButton } from "components/styledComponent/button";
import { CircularProgress, FormHelperText } from "@mui/material";

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
          <div>
            <GradientButton
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
    </Fragment>
  );
};
