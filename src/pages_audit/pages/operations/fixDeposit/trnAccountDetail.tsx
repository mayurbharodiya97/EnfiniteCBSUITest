import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext } from "react";
import { TransferAcctDetailFormMetadata } from "./metaData/transferAcctMetaData";
import { InitialValuesType } from "packages/form";
import { FixDepositContext } from "./fixDepositContext";
import { usePopupContext } from "components/custom/popupContext";

export const TransferAcctDetailForm = forwardRef<any, any>(
  ({ onSubmitHandler }, ref) => {
    const { fdState } = useContext(FixDepositContext);
    const { MessageBox } = usePopupContext();
    return (
      <Fragment>
        <FormWrapper
          key={"TransferAcctDetail"}
          // metaData={MobileAppReviewMetaData}
          metaData={TransferAcctDetailFormMetadata as MetaDataType}
          initialValues={fdState?.sourceAcctFormData as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          hideHeader={true}
          formStyle={{
            background: "white",
            paddingTop: "0px",
            // height: "30vh",
            // overflowY: "auto",
            // overflowX: "hidden",
            border: "1px solid var(--theme-color4)",
            borderRadius: "10px",
          }}
          formState={{ MessageBox: MessageBox }}
          ref={ref}
        />
      </Fragment>
    );
  }
);
