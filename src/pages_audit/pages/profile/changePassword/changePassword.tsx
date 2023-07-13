import { Fragment, useRef, useContext } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { PasswordChangeMetaData } from "./metaData";
import * as API from "../api";
import { Box, CircularProgress, Dialog } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SyncLockIcon from "@mui/icons-material/SyncLock";

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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleNavigate = () => {
    navigate("/cbsenfinity/login");
  };
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
        console.log(error, "<<<errrorr");
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: (data, { endSubmit }) => {
        endSubmit(true, "");
        enqueueSnackbar("Password changed successfully", {
          variant: "success",
        });
        handleNavigate();
      },
    }
  );

  return (
    <Fragment>
      <Box sx={{ width: 370, margin: "auto" }}>
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
          hideHeader={true}
          containerstyle={{ padding: "11px" }}
        />
        <DialogActions>
          <GradientButton
            disabled={mutation.isLoading}
            startIcon={<SyncLockIcon />}
            endIcon={mutation.isLoading ? <CircularProgress size={20} /> : null}
            onClick={(e) => {
              formRef.current?.handleSubmit?.(e);
            }}
          >
            {t("profile.ChangePassword")}
          </GradientButton>
        </DialogActions>
      </Box>
    </Fragment>
  );
};
