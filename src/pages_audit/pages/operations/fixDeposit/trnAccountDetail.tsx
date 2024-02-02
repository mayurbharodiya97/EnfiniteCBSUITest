import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment } from "react";
import { TransferAcctDetailFormMetadata } from "./metaData/transferAcctMetaData";
import { InitialValuesType } from "packages/form";

export const TransferAcctDetailForm = () => {
  return (
    <Fragment>
      <FormWrapper
        key={"TransferAcctDetail"}
        // metaData={MobileAppReviewMetaData}
        metaData={TransferAcctDetailFormMetadata as MetaDataType}
        initialValues={
          {
            TRNDTLS: [
              {
                ACCT_NAME: "",
              },
            ],
          } as InitialValuesType
        }
        onSubmitHandler={() => {}}
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
      />
    </Fragment>
  );
};
