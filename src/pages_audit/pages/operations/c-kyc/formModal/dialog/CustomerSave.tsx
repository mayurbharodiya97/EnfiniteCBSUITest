import React, { useContext, useRef } from "react";
import { CkycContext } from "../../CkycContext";
import { MessageBoxWrapper } from "@acuteinfo/common-base";

export const CustomerSaveDialog = ({ open, onClose, onFormClose }) => {
  const { state, handleFormModalClosectx, handleCurrFormctx } =
    useContext(CkycContext);
  return (
    <MessageBoxWrapper
      // MessageTitle={"SUCCESS"}
      validMessage={
        `New Request ID created Successfully : ${state?.req_cd_ctx ?? ""}` ??
        "No Message"
      }
      onActionYes={() => {
        handleCurrFormctx({
          currentFormSubmitted: null,
          isLoading: false,
        });
        handleFormModalClosectx();
        onFormClose();
      }}
      rows={[]}
      // buttonNames={["OK"]}
      isOpen={open}
      onActionNo={() => {}}
    />
  );
};
