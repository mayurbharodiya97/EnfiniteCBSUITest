import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useContext, useMemo, useRef } from "react";
import { main_tab_metadata } from "../tabMetadata/mainTabMetadata";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";

const MainTab = () => {
  const { AcctMSTState } = useContext(AcctMSTContext);
  const formRef = useRef<any>(null);
  const onSubmitPDHandler = () => {};
  // const initialVal = useMemo(() => {
  //   return AcctMSTState?.isFreshEntryctx
  //     ? AcctMSTState?.formDatactx["PERSONAL_DETAIL"]
  //       ? AcctMSTState?.formDatactx["PERSONAL_DETAIL"]
  //       : {}
  //     : AcctMSTState?.retrieveFormDataApiRes
  //     ? AcctMSTState?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
  //     : {};
  // }, [AcctMSTState?.isFreshEntryctx, AcctMSTState?.retrieveFormDataApiRes]);
  const initialVal:any= {}

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onSubmitPDHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        key={"pd-form-kyc" + initialVal}
        metaData={main_tab_metadata as MetaDataType}
        formStyle={{}}
        formState={{PARAM320: AcctMSTState?.param320 }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
        // onFormButtonClickHandel={(fieldID, dependentFields) => {
        //     // console.log("form button clicked...", fieldID, dependentFields, dependentFields?.ACCT_NM?.value, typeof dependentFields?.ACCT_NM?.value)
        //     if(fieldID === "SEARCH_BTN_ignoreField" && dependentFields?.ACCT_NM?.value) {
        //         if(dependentFields?.ACCT_NM?.value.trim().length>0) {
        //             if(acctName !== dependentFields?.ACCT_NM?.value.trim()) {
        //                 setAcctName(dependentFields?.ACCT_NM?.value.trim())
        //                 let data = {
        //                     COMP_CD: authState?.companyID ?? "",
        //                     SELECT_COLUMN: {
        //                         ACCT_NM: dependentFields?.ACCT_NM?.value.trim()
        //                     }
        //                 }
        //                 mutation.mutate(data)
        //             }
        //             setDialogOpen(true)
        //         }
        //     }
        // }}
      ></FormWrapper>
    </Grid>
  );
};

export default MainTab;
