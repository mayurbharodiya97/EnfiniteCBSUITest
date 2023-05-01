import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import { TextField } from "components/styledComponent/textfield";
import { GradientButton } from "components/styledComponent/button";
import { Fragment, useRef, useState } from "react";
import { Transition } from "pages_audit/common/transition";
import { utilFunction } from "components/utils/utilFunctions";
import { ResetPassword } from "./api";
import { useSnackbar } from "notistack";

export const PasswordRotation = ({
  classes,
  open,
  username,
  accessToken,
  tokenType,
  handleClose,
}) => {
  const inputButtonRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [input, setInput] = useState({
    userName: username,
    oldpassword: "",
    password: "",
    confirmpassword: "",
  });
  const [pwdReset, setPasswordReset] = useState({
    isError: false,
    errorMessage: "",
    isLoading: false,
    isoldPwdError: false,
    oldpassworderror: "",
    isnewpwdError: false,
    newpassworderror: "",
    isconfirmnewpwdError: false,
    confirmnewpassworderror: "",
  });
  const handleCloseEvent = () => {
    handleClose("");
  };
  const ClickEventHandler = async () => {
    let isError = false;
    let setPwdData = {
      isError: false,
      errorMessage: "",
      isLoading: false,
      isoldPwdError: false,
      oldpassworderror: "",
      isnewpwdError: false,
      newpassworderror: "",
      isconfirmnewpwdError: false,
      confirmnewpassworderror: "",
    };
    if (!Boolean(input.oldpassword)) {
      setPwdData.isoldPwdError = true;
      setPwdData.oldpassworderror = "Current Password is required.";
      isError = true;
    }
    let pwdData = utilFunction.ValidatePassword(input.password);
    if (Boolean(pwdData)) {
      setPwdData.isnewpwdError = true;
      setPwdData.newpassworderror = pwdData;
      isError = true;
    }
    if (
      Boolean(input.oldpassword) &&
      Boolean(input.password) &&
      input.oldpassword === input.password
    ) {
      setPwdData.isnewpwdError = true;
      setPwdData.newpassworderror =
        "The new password cannot be the same as the old password";
      isError = true;
    }
    if (!Boolean(input.confirmpassword)) {
      setPwdData.isconfirmnewpwdError = true;
      setPwdData.confirmnewpassworderror = "Confirm new password is required.";
      isError = true;
    } else if (
      Boolean(input.password) &&
      input.password !== input.confirmpassword
    ) {
      setPwdData.isconfirmnewpwdError = true;
      setPwdData.confirmnewpassworderror =
        "New Password and Confirm Password did not matched";
      isError = true;
    }
    if (isError) {
      setPasswordReset(setPwdData);
    } else {
      setPasswordReset((values) => ({ ...values, isLoading: true }));
      let response = await ResetPassword(
        input.userName,
        input.oldpassword,
        input.password,
        accessToken,
        tokenType
      );
      setPasswordReset((values) => ({ ...values, isLoading: false }));
      if (response.status === "0") {
        enqueueSnackbar("Password successfully changed.", {
          variant: "success",
        });
        handleClose("0");
      } else {
        setPasswordReset((values) => ({
          ...values,
          isError: true,
          errorMessage: response.message,
        }));
      }
    }
  };
  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === "oldpassword" && Boolean(value)) {
      setPasswordReset((values) => ({ ...values, isoldPwdError: false }));
    } else if (name === "password" && Boolean(value)) {
      setPasswordReset((values) => ({ ...values, isnewpwdError: false }));
    } else if (name === "confirmpassword" && Boolean(value)) {
      setPasswordReset((values) => ({
        ...values,
        isconfirmnewpwdError: false,
      }));
    }
    setInput((values) => ({ ...values, [name]: value }));
  };
  return (
    <Fragment>
      <Dialog
        fullWidth={false}
        //@ts-ignore
        TransitionComponent={Transition}
        open={open}
        PaperProps={{
          style: {
            width: "60vh",
            minWidth: "50vh",
          },
        }}
      >
        <DialogTitle>Password Rotation</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Please Verify OTP</DialogContentText> */}
          <div>
            <TextField
              label={"Username"}
              placeholder="Enter Username"
              fullWidth
              type={"text"}
              name="userName"
              value={input.userName || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={true}
              autoComplete="off"
              inputProps={{ maxLength: 16 }}
              style={{ paddingBottom: "8px" }}
            />
            <TextField
              autoFocus={true}
              label={"Current Password"}
              placeholder="Enter Current Password"
              fullWidth
              type={"password"}
              name="oldpassword"
              value={input.oldpassword || ""}
              onChange={handleChange}
              error={pwdReset.isoldPwdError}
              helperText={
                pwdReset.isoldPwdError ? pwdReset.oldpassworderror : ""
              }
              InputLabelProps={{ shrink: true }}
              disabled={pwdReset.isLoading}
              autoComplete="off"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  inputButtonRef?.current?.click?.();
                }
              }}
              inputProps={{ maxLength: 16 }}
              style={{ paddingBottom: "8px" }}
            />
            <TextField
              label={"New Password"}
              placeholder="Enter New Password"
              fullWidth
              type={"password"}
              name="password"
              value={input.password || ""}
              onChange={handleChange}
              error={pwdReset.isnewpwdError}
              helperText={
                pwdReset.isnewpwdError ? pwdReset.newpassworderror : ""
              }
              InputLabelProps={{ shrink: true }}
              disabled={pwdReset.isLoading}
              autoComplete="off"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  inputButtonRef?.current?.click?.();
                }
              }}
              inputProps={{ maxLength: 16 }}
              style={{ paddingBottom: "8px" }}
            />
            <TextField
              label={"Confirm New Password"}
              placeholder="Enter confirm new password"
              fullWidth
              type={"password"}
              name="confirmpassword"
              value={input.confirmpassword || ""}
              onChange={handleChange}
              error={pwdReset.isconfirmnewpwdError}
              helperText={
                pwdReset.isconfirmnewpwdError
                  ? pwdReset.confirmnewpassworderror
                  : ""
              }
              InputLabelProps={{ shrink: true }}
              disabled={pwdReset.isLoading}
              autoComplete="off"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  inputButtonRef?.current?.click?.();
                }
              }}
              inputProps={{ maxLength: 16 }}
              style={{ paddingBottom: "8px" }}
            />
            {pwdReset.isError ? (
              <FormHelperText style={{ color: "red" }}>
                {pwdReset.errorMessage}
              </FormHelperText>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions className={classes.verifybutton}>
          <GradientButton
            disabled={pwdReset.isLoading}
            endIcon={pwdReset.isLoading ? <CircularProgress size={20} /> : null}
            onClick={ClickEventHandler}
            ref={inputButtonRef}
          >
            Ok
          </GradientButton>
          <GradientButton
            disabled={pwdReset.isLoading}
            onClick={handleCloseEvent}
          >
            Cancel
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
