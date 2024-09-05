import { ClearCacheProvider } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData } from "components/utils";
import { useContext, useRef, useState } from "react";
import { metaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";

const FdInterestCalculator = ()=>{
  const [formMode, setFormMode] = useState("add");
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
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
          initialValues={{
            COMP_CD: authState.companyID,
            BRANCH_CD: authState.user.branchCode,
            CALCSWITCH:"P"
          }}
          onFormButtonClickHandel={async (id) => {
            let event: any = { preventDefault: () => { } };
            if(id==="NEW_DATE_BTN")
            {
              formRef?.current?.handleFormReset(event, "Reset");
            }
            else if(id==="NEW_PERIOD_BTN")
            {
              formRef?.current?.handleFormReset(event, "Reset");
            }
          }}
          formStyle={{
            background: "white",
          }}
          ref={formRef}
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

  
  