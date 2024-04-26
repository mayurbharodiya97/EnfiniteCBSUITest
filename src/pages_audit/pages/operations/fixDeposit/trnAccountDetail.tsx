import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext } from "react";
import { TransferAcctDetailFormMetadata } from "./metaData/transferAcctMetaData";
import { InitialValuesType } from "packages/form";
import { FixDepositContext } from "./fixDepositContext";
import { usePopupContext } from "components/custom/popupContext";

export const TransferAcctDetailForm = forwardRef<any, any>(
  ({ onSubmitHandler, setDataOnFieldChange }, ref) => {
    const { fdState } = useContext(FixDepositContext);
    const { MessageBox } = usePopupContext();

    return (
      <Fragment>
        <FormWrapper
          key={
            "TransferAcctDetail" + fdState?.sourceAcctFormData?.TRNDTLS?.length
          }
          // metaData={MobileAppReviewMetaData}
          metaData={TransferAcctDetailFormMetadata as MetaDataType}
          initialValues={
            {
              ...fdState?.sourceAcctFormData,
              TOTAL_FD_AMOUNT: fdState?.fdDetailFormData?.TOTAL_FD_AMOUNT,
            } as InitialValuesType
          }
          onSubmitHandler={onSubmitHandler}
          setDataOnFieldChange={setDataOnFieldChange}
          hideHeader={true}
          formStyle={{
            background: "white",
            padding: "5px",
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
