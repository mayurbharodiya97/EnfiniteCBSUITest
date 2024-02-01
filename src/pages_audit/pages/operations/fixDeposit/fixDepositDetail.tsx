import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext } from "react";
import { FixDepositDetailFormMetadata } from "./metaData";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { FixDepositContext } from "./fixDepositContext";

export const FixDepositDetailForm = forwardRef<any, any>(({}, ref) => {
  const { fdState, updateFDDetailsFormData, setActiveStep } =
    useContext(FixDepositContext);

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
        initialValues={
          {
            FDDTL: [
              {
                FD_NO: "",
              },
            ],
          } as InitialValuesType
        }
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
      />
    </Fragment>
  );
});
