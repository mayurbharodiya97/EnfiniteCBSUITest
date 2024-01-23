import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef } from "react";
import { FixDepositFormMetadata } from "./metaData";
import { InitialValuesType, SubmitFnType } from "packages/form";

export const DetailForm = forwardRef<any, any>(({ onSubmitHandler }, ref) => {
  return (
    <Fragment>
      <FormWrapper
        key={"FixDepositDetail"}
        // metaData={MobileAppReviewMetaData}
        metaData={FixDepositFormMetadata as MetaDataType}
        initialValues={{} as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        hideHeader={true}
        formStyle={{
          background: "white",
          // height: "56vh",
          // overflowY: "auto",
          // overflowX: "hidden",
          padding: "10px",
          border: "1px solid var(--theme-color4)",
          borderRadius: "10px",
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
        ref={ref}
      />
    </Fragment>
  );
});
