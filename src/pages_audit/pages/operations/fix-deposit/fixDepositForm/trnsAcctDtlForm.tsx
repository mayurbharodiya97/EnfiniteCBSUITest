import { Fragment, forwardRef, useContext } from "react";
import { TransferAcctDetailFormMetadata } from "./metaData/trnsAcctDtlMetaData";
import {
  usePopupContext,
  InitialValuesType,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
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
