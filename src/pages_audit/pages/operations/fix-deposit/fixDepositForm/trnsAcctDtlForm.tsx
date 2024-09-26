import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext } from "react";
import { TransferAcctDetailFormMetadata } from "./metaData/trnsAcctDtlMetaData";
import { InitialValuesType } from "packages/form";
import { usePopupContext } from "components/custom/popupContext";
import { FDContext } from "../context/fdContext";

export const TransferAcctDetailForm = forwardRef<any, any>(
  ({ onSubmitHandler }, ref) => {
    const { FDState } = useContext(FDContext);
    const { MessageBox } = usePopupContext();

    return (
      <Fragment>
        <FormWrapper
          key={
            "TransferAcctDetail" + FDState?.sourceAcctFormData?.TRNDTLS?.length
          }
          // metaData={MobileAppReviewMetaData}
          metaData={TransferAcctDetailFormMetadata as MetaDataType}
          initialValues={
            {
              ...FDState?.sourceAcctFormData,
              TOTAL_FD_AMOUNT: FDState?.fdDetailFormData?.TOTAL_FD_AMOUNT,
            } as InitialValuesType
          }
          onSubmitHandler={onSubmitHandler}
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
