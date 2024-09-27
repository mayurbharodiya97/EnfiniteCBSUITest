import * as React from "react";
import { CkycContext } from "../../CkycContext";
import { PopupRequestWrapper } from "@acuteinfo/common-base";

export const CloseFormDialog = ({ open, onClose, closeForm }) => {
  const { state, handleUpdatectx, handleFormModalClosectx } =
    React.useContext(CkycContext);
  return (
    <PopupRequestWrapper
      MessageTitle={"CONFIRM"}
      Message={"Your Changes will be Lost."}
      onClickButton={(rows, buttonNames, ...others) => {
        // console.log(rows, "kjefeiwqf", buttonNames)
        if (buttonNames === "Ok") {
          handleFormModalClosectx();
          onClose();
          closeForm();
        } else if (buttonNames === "Cancel") {
          onClose();
        }
      }}
      buttonNames={["Ok", "Cancel"]}
      rows={[]}
      // Commented Temporary
      // loading={{ Yes: true }}
      // loading={{ Yes: getData?.isLoading, No: false }}
      open={open}
    />
  );
};
