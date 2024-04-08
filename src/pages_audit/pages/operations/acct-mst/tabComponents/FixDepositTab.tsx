import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useContext, useMemo, useRef } from "react";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import { fixDeposit_tab_metadata } from "../tabMetadata/fixDepositMetadata";

const FixDepositTab = () => {
  const { AcctMSTState } = useContext(AcctMSTContext);
  const formRef = useRef<any>(null);
  const onSubmitPDHandler = () => {};
  const initialVal:any= {}

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onSubmitPDHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        key={"pd-form-kyc" + initialVal}
        metaData={fixDeposit_tab_metadata as MetaDataType}
        formStyle={{}}
        formState={{GPARAM155: AcctMSTState?.gparam155 }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
      ></FormWrapper>
    </Grid>
  );
};

export default FixDepositTab;
