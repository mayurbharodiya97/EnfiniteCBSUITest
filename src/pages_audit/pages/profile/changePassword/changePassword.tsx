import { Fragment, useRef, useContext } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { PasswordChangeMetaData } from "./metaData";
import * as API from "../api";
import { CircularProgress, Dialog } from "@mui/material";
import { Transition } from "pages_audit/common";
import { GradientButton } from "components/styledComponent/button";
import { DialogActions } from "@mui/material";

interface UpdatePasswordFnType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  userID?: any;
}

const updatePasswordFnWrapper =
  (updatePassword) =>
  async ({ data, userID }: UpdatePasswordFnType) => {
    return updatePassword({ ...data, userID });
  };

export const ChangePassword = ({ onClose, showProfile }) => {
  const { enqueueSnackbar } = useSnackbar();
  const authCtx = useContext(AuthContext);
  const formRef = useRef<any>(null);

  const onSubmitHandler = (data, displayData, endSubmit) => {
    mutation.mutate({
      data,
      displayData,
      endSubmit,
      userID: authCtx?.authState?.user?.id,
    });
  };

  const mutation = useMutation(
    updatePasswordFnWrapper(API.changeEmployeePassword),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        endSubmit(true, "");
        enqueueSnackbar("Password changed successfully", {
          variant: "success",
        });
        onClose();
      },
    }
  );

  return (
    <Fragment>
      <Dialog
        open={showProfile}
        //@ts-ignore
        TransitionComponent={Transition}
        fullWidth={false}
      >
        {/* <DialogContent> */}
        <FormWrapper
          key="passwordChange"
          metaData={PasswordChangeMetaData as MetaDataType}
          initialValues={{}}
          onSubmitHandler={onSubmitHandler}
          displayMode={"new"}
          hideDisplayModeInTitle={true}
          formStyle={{
            background: "white",
            height: "auto",
          }}
          ref={formRef}
          hideHeader={false}
          containerstyle={{ padding: "11px" }}
        />
        {/* </DialogContent> */}
        <DialogActions>
          <GradientButton disabled={mutation.isLoading} onClick={onClose}>
            Close
          </GradientButton>
          <GradientButton
            disabled={mutation.isLoading}
            endIcon={mutation.isLoading ? <CircularProgress size={20} /> : null}
            onClick={(e) => {
              formRef.current?.handleSubmit?.(e);
            }}
          >
            Change Password
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
