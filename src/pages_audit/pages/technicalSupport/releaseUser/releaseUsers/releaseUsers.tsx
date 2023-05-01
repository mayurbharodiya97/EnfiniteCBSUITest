import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { GradientButton } from "components/styledComponent/button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useState, useContext } from "react";
import { useStyles } from "pages_audit/auth/style";
import { AuthSDK } from "registry/fns/auth";
import { AuthContext } from "pages_audit/auth";
export const ReleaseUsersAPIWrapper = ({
  handleDialogClose,
  isDataChangedRef,
}) => {
  const authController = useContext(AuthContext);
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const VerifyBtn = async () => {
    const UserListData = rows.map((item) => {
      return {
        RELEASE_TYPE: item?.data?.BLOCK_TYPE ?? "",
        TYPE: item?.data?.LOCK_TYPE ?? "",
        USER_NM: item?.data?.USER_NAME ?? "",
        ACCT_NO: item?.data?.ENC_ACCT_NO ?? "",
      };
    });
    setLoading(true);
    const { status, message } = await AuthSDK.internalFetcher(
      "USERRELEASE",
      {
        REL_BY: authController.authState.user.id,
        REL_MACHINE: "test",
        RELEASE_USER_LIST: UserListData,
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
    setLoading(false);
    if (status === "0") {
      enqueueSnackbar(message, {
        variant: "success",
      });
      isDataChangedRef.current = true;
    } else {
      enqueueSnackbar(message, {
        variant: "error",
      });
    }
    handleDialogClose();
  };
  return (
    <>
      <Dialog fullWidth={false} open={true}>
        <DialogTitle className={classes.dialogTitleClass}>
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ color: "black", marginTop: "8px", marginBottom: "6px" }}
          >
            Are you sure you want to release{" "}
            {rows.length === 1 ? "this user" : "these users"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.verifybutton}>
          <GradientButton
            endIcon={loading ? <CircularProgress size={20} /> : null}
            onClick={VerifyBtn}
          >
            Yes
          </GradientButton>
          <GradientButton disabled={loading} onClick={handleDialogClose}>
            No
          </GradientButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
