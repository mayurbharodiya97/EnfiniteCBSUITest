import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment } from "react";
import { FixDepositDetailFormMetadata } from "./metaData";
import { InitialValuesType } from "packages/form";

export const FixDepositDetailForm = () => {
  return (
    <Fragment>
      <FormWrapper
        key={"FixDepositDetail"}
        // metaData={MobileAppReviewMetaData}
        metaData={FixDepositDetailFormMetadata as MetaDataType}
        initialValues={
          {
            FDDTL: [
              {
                FD_NO: "",
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
