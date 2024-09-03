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

  const handleButtonClick = async (id: string) => {
    let event: any = { preventDefault: () => {} };
    if (id === "NEW_DATE_BTN") {
      setCalcSwitch("D");
      setFormKey(Date.now());
    } else if (id === "NEW_PERIOD_BTN") {
      setCalcSwitch("P");
      setFormKey(Date.now());
    }
  };

  return (
    <>
      <FormWrapper
        key={formKey}
        metaData={extractMetaData(metaData, formMode) as MetaDataType}
        displayMode={formMode}
        onSubmitHandler={() => {}}
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
