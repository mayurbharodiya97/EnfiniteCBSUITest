import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { CkycContext } from "../../CkycContext";
import { PopupRequestWrapper } from "components/custom/popupMessage";

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
      loading={{}}
      // loading={{ Yes: getData?.isLoading, No: false }}
      open={open}
    />
  );
};
