import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import { advConnfig_tab_metadata } from "../tabMetadata/advConfigMetadata";
import TabNavigate from "../TabNavigate";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
const AdvConfigTab = () => {
  const {
    AcctMSTState,
    handleCurrFormctx,
    handleSavectx,
    handleStepStatusctx,
  } = useContext(AcctMSTContext);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const onSubmitPDHandler = () => {};
  const initialVal: any = {};

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [formRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };
  useEffect(() => {
    let refs = [formRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: AcctMSTState?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (
      Boolean(
        AcctMSTState?.currentFormctx.currentFormRefctx &&
          AcctMSTState?.currentFormctx.currentFormRefctx.length > 0
      ) &&
      Boolean(formStatus && formStatus.length > 0)
    ) {
      if (
        AcctMSTState?.currentFormctx.currentFormRefctx.length ===
        formStatus.length
      ) {
        setIsNextLoading(false);
        let submitted;
        submitted = formStatus.filter((form) => !Boolean(form));
        if (submitted && Array.isArray(submitted) && submitted.length > 0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: AcctMSTState?.colTabValuectx,
          });
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        });
        setFormStatus([]);
      }
    }
  }, [formStatus]);

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onSubmitPDHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        key={"pd-form-kyc" + initialVal}
        metaData={advConnfig_tab_metadata as MetaDataType}
        formStyle={{}}
        formState={{ GPARAM155: AcctMSTState?.gparam155 }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
      ></FormWrapper>
      <TabNavigate
        handleSave={handleSave}
        displayMode={AcctMSTState?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default AdvConfigTab;
