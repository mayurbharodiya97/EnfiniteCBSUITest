import { ClearCacheProvider } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData } from "components/utils";
import { useContext, useRef, useState, useEffect } from "react";
import { metaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";

const FdInterestCalculator = () => {
  const [formMode, setFormMode] = useState("add");
  const [calcSwitch, setCalcSwitch] = useState("P");
  const { authState } = useContext(AuthContext);
  const [formKey, setFormKey] = useState(Date.now());
  const formRef = useRef<any>();
  const handleButtonClick = async (id: string) => {
    let event: any = { preventDefault: () => {} };
    if (id === "NEW_DATE_BTN") {
      setCalcSwitch("D");
      setFormKey(Date.now());
    } else if (id === "NEW_PERIOD_BTN") {
      setCalcSwitch("P");
      setFormKey(Date.now());
    } else if (id === "CAL_COMPARE_SHEET_BTN") {
      let event: any = { preventDefault: () => {} };
      formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    }
  };

  return (
    <>
      <FormWrapper
        key={formKey}
        ref={formRef}
        metaData={extractMetaData(metaData, formMode) as MetaDataType}
        displayMode={formMode}
        onSubmitHandler={(data) => {
          console.log(data);
          if (data?.CALCSWITCH === "S") {
          }
        }}
        initialValues={{
          COMP_CD: authState.companyID,
          BRANCH_CD: authState.user.branchCode,
          CALCSWITCH: calcSwitch,
        }}
        onFormButtonClickHandel={handleButtonClick} // Updated handler
        formStyle={{
          background: "white",
        }}
      ></FormWrapper>
    </>
  );
};

export const FdInterestCalculatorMain = () => {
  return (
    <ClearCacheProvider>
      <FdInterestCalculator />
    </ClearCacheProvider>
  );
};
