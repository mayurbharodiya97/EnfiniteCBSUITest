import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { AcctMSTContext } from "../AcctMSTContext";
import { AuthContext } from "pages_audit/auth";
import { introductorjoint_tab_metadata } from "../tabMetadata/introductorJointMetadata";
import TabNavigate from "../TabNavigate";

const IntroductorJointTab = () => {
  const { AcctMSTState, handleCurrFormctx, handleSavectx, handleStepStatusctx } = useContext(AcctMSTContext);
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([])
  const onSubmitPDHandler = () => {};

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    })
    const refs = [formRef.current.handleSubmitError(e, "save", false)]
    handleSavectx(e, refs)
  }

  useEffect(() => {
    let refs = [formRef]
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: AcctMSTState?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    })
  }, [])
  useEffect(() => {
    if(Boolean(AcctMSTState?.currentFormctx.currentFormRefctx && AcctMSTState?.currentFormctx.currentFormRefctx.length>0) && Boolean(formStatus && formStatus.length>0)) {
      if(AcctMSTState?.currentFormctx.currentFormRefctx.length === formStatus.length) {
        setIsNextLoading(false)
        let submitted;
        submitted = formStatus.filter(form => !Boolean(form))
        if(submitted && Array.isArray(submitted) && submitted.length>0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: AcctMSTState?.colTabValuectx,
          })
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        })
        setFormStatus([])
      }
    }
  }, [formStatus])

  const initialVal = useMemo(() => {
    return (
      AcctMSTState?.isFreshEntryctx
        ? AcctMSTState?.formDatactx["INTRODUCTORY_DTL"] ?? {INTRODUCTORY_DTL: [{}]}
        : AcctMSTState?.formDatactx["INTRODUCTORY_DTL"]
          ? {...AcctMSTState?.retrieveFormDataApiRes["INTRODUCTORY_DTL"] ?? {}, ...AcctMSTState?.formDatactx["INTRODUCTORY_DTL"] ?? {}}
          : {...AcctMSTState?.retrieveFormDataApiRes["INTRODUCTORY_DTL"] ?? {}}
    )
  }, [
    AcctMSTState?.isFreshEntryctx, 
    AcctMSTState?.retrieveFormDataApiRes,
    AcctMSTState?.formDatactx["INTRODUCTORY_DTL"]
  ])

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        key={"pd-form-kyc" + initialVal}
        ref={formRef}
        metaData={introductorjoint_tab_metadata as MetaDataType}
        onSubmitHandler={onSubmitPDHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        formState={{COMP_CD: authState?.companyID ?? "", CUSTOMER_ID: AcctMSTState?.customerIDctx ?? "", REQ_FLAG: (AcctMSTState?.isFreshEntryctx || AcctMSTState?.isDraftSavedctx) ? "F" : "E"}}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
      ></FormWrapper>
      <TabNavigate handleSave={handleSave} displayMode={AcctMSTState?.formmodectx ?? "new"} isNextLoading={isNextLoading} />
    </Grid>
  );
};

export default IntroductorJointTab;
