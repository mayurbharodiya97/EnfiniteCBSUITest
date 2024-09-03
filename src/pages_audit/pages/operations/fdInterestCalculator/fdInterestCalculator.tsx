import { ClearCacheProvider } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData } from "components/utils";
import { useState } from "react";
import { metaData } from "./metaData";

const FdInterestCalculator = ()=>{
  const [formMode, setFormMode] = useState("add");

    return(
        <>
         <FormWrapper
          key={"modeMasterForm" + formMode}
          metaData={
            extractMetaData(
             metaData,
              formMode
            ) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={()=>{}}
          initialValues={{}}
          formStyle={{
            background: "white",
          }}
        >
       
        </FormWrapper>
        </>
    )
}

export const FdInterestCalculatorMain = () => {
    return (
      <ClearCacheProvider>
        <FdInterestCalculator />
      </ClearCacheProvider>
    );
  };

  
  