import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CkycContext } from "../../CkycContext";
import { PopupRequestWrapper } from "@acuteinfo/common-base";

export const PreventUpdateDialog = ({ open, onClose }) => {
  const {
    onFinalUpdatectx,
    handleCurrFormctx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
  } = React.useContext(CkycContext);
  const onDialogClose = () => {
    onFinalUpdatectx(false);
    handleCurrFormctx({
      currentFormSubmitted: null,
    });
    handleFormDataonSavectx({});
    handleModifiedColsctx({});
    onClose();
  };
  return (
    <PopupRequestWrapper
      MessageTitle={"Update Required"}
      Message={
        <>
          <p>You have not made any changes yet.</p>
          <p>Please kindly make any changes and update.</p>
        </>
      }
      onClickButton={(rows, buttonNames) => {
        if (buttonNames === "Close") {
          onDialogClose();
        }
      }}
      buttonNames={["Close"]}
      rows={[]}
      // Commented Temporary
      // loading={{}}
      // loading={{ Yes: getData?.isLoading, No: false }}
      open={open}
    />
  );
};
