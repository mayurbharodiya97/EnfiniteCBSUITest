import { useContext, useMemo, useRef } from "react";
import { Grid } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { AcctMSTContext } from "../AcctMSTContext";
import { AuthContext } from "pages_audit/auth";
import { guardianjoint_tab_metadata } from "../tabMetadata/guardianlJointMetadata";

const GuardianJointTab = () => {
  const { AcctMSTState } = useContext(AcctMSTContext);
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const onSubmitPDHandler = () => {};
  const initialVal: any = {};

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        key={"pd-form-kyc" + initialVal}
        ref={formRef}
        metaData={guardianjoint_tab_metadata as MetaDataType}
        onSubmitHandler={onSubmitPDHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        formState={{COMP_CD: authState?.companyID ?? "", CUSTOMER_ID: AcctMSTState?.customerIDctx ?? "", REQ_FLAG: (AcctMSTState?.isFreshEntryctx || AcctMSTState?.isDraftSavedctx) ? "F" : "E"}}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
      ></FormWrapper>
    </Grid>
  );
};

export default GuardianJointTab;
