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
import { useTranslation } from "react-i18next";

export const ForgotPasswordFields = ({ classes, loginState, onSubmit }) => {
  const [input, setInput] = useState({
    userName: loginState.workingState === 1 ? loginState?.username : "",
    mobileno: "",
    password: "",
    confirmpassword: "",
  });
  const inputRef = useRef<any>(null);
  const inputPassRef = useRef<any>(null);
  const inputButtonRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<any>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          label={t("UserID")}
          placeholder={String(t("UserID"))}
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
            label={t("MobileNo")}
            placeholder="Enter Mobile No."
            // placeholder={String(t("EnterMobileNo"))}
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
              label={t("Password")}
              placeholder="Enter Password"
              fullWidth
              type={showPassword ? "text" : "password"}
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
              label={t("ConfirmPassword")}
              placeholder={String(t("EnterConfirmPassword"))}
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
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
                      onClick={() => setShowConfirmPassword((old) => !old)}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={loginState.loading}
                    >
                      {showConfirmPassword ? (
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
                starticon={"West"}
                rotateIcon="scale(1.4) rotateX(360deg)"
              >
                {t("backtologin")}
              </GradientButton>

              <GradientButton
                style={{ borderRadius: "10px" }}
                disabled={loginState.loading}
                onClick={() => {
                  onSubmit(input, loginState.workingState);
                  console.log("input", input, loginState.workingState);
                }}
                ref={inputButtonRef}
                endicon={
                  loginState.loading ? <CircularProgress size={20} /> : "East"
                }
                rotateIcon="scale(1.4) rotateX(360deg)"
              >
                {t("Next")}
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
