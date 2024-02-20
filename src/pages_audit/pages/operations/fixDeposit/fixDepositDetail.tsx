import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext } from "react";
import { FixDepositDetailFormMetadata } from "./metaData/fdDetailMetaData";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { FixDepositContext } from "./fixDepositContext";
import { AuthContext } from "pages_audit/auth";

export const FixDepositDetailForm = forwardRef<any, any>(({}, ref) => {
  const { fdState, updateFDDetailsFormData, setActiveStep } =
    useContext(FixDepositContext);
  const { MessageBox } = useContext(AuthContext);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    updateFDDetailsFormData(data);
    setActiveStep(fdState.activeStep + 1);
  };
  return (
    <Fragment>
      <FormWrapper
        key={"FixDepositDetail"}
        // metaData={MobileAppReviewMetaData}
        metaData={FixDepositDetailFormMetadata as MetaDataType}
        initialValues={fdState?.fdDetailFormData as InitialValuesType}
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
        ref={ref}
        formState={{ MessageBox: MessageBox }}
      />
    </Fragment>
  );
});
