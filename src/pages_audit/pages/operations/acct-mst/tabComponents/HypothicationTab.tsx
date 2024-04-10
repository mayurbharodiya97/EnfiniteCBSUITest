import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useContext, useMemo, useRef } from "react";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import { hypothication_metadata } from "../tabMetadata/hypoMetadata";

const HypothicationTab = () => {
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
        metaData={hypothication_metadata as MetaDataType}
        formStyle={{}}
        formState={{GPARAM155: AcctMSTState?.gparam155 }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
      ></FormWrapper>
    </Grid>
  );
};

export default HypothicationTab;
