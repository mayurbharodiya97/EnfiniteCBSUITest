import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { denoTableMetadata } from "./metadata";
import { useRef } from "react";

const SingleDeno = () => {
  const denoForWrapperRef = useRef<any>("");

  const handleSubmit = () => {
    // console.log("it's work!!");
  };

  return (
    <>
      {" "}
      <FormWrapper
        ref={denoForWrapperRef}
        onSubmitHandler={handleSubmit}
        initialValues={{}}
        // initialValues={{ DEC_DATE: "abababab" }}
        key={"single-deno"}
        metaData={denoTableMetadata as MetaDataType}
        formStyle={{}}
        hideHeader={true}
      />
    </>
  );
};

export default SingleDeno;
