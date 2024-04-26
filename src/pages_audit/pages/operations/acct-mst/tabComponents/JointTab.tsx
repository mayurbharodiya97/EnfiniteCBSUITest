import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { AcctMSTContext } from "../AcctMSTContext";
import { joint_tab_metadata } from "../tabMetadata/jointTabMetadata";
import { AuthContext } from "pages_audit/auth";
import TabNavigate from "../TabNavigate";
import _ from "lodash";

const JointTab = () => {
  const { AcctMSTState, handleCurrFormctx, handleSavectx, handleStepStatusctx, handleFormDataonSavectx, handleModifiedColsctx } = useContext(AcctMSTContext);
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const onSubmitPDHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let formFields = Object.keys(data) // array, get all form-fields-name 
      formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
      const formData = _.pick(data, formFieldsRef.current)





      let newData = AcctMSTState?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: "",
        BRANCH_CD: "",
        REQ_FLAG: "",
        REQ_CD: "",
        // SR_CD: "",
      };
      newData["JOINT_ACCOUNT_DTL"] = {
        ...newData["JOINT_ACCOUNT_DTL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if(!AcctMSTState?.isFreshEntryctx || AcctMSTState?.fromctx === "new-draft") {
        let tabModifiedCols:any = AcctMSTState?.modifiedFormCols
        let updatedCols = tabModifiedCols.JOINT_ACCOUNT_DTL ? _.uniq([...tabModifiedCols.JOINT_ACCOUNT_DTL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])

        tabModifiedCols = {
          ...tabModifiedCols,
          JOINT_ACCOUNT_DTL: [...updatedCols]
        }
        handleModifiedColsctx(tabModifiedCols)
      }
      // handleStepStatusctx({ status: "", coltabvalue: state?.colTabValuectx });
      setFormStatus(old => [...old, true])
      // if(state?.isFreshEntry) {
        // PODFormRef.current.handleSubmitError(NextBtnRef.current, "save");
      // }
      // setIsNextLoading(false)
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: AcctMSTState?.colTabValuectx,
      });
      // setIsNextLoading(false);
      setFormStatus(old => [...old, false])
    }
    endSubmit(true);
  };
  const initialVal: any = {};

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

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        key={"pd-form-kyc" + initialVal}
        ref={formRef}
        metaData={joint_tab_metadata as MetaDataType}
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

export default JointTab;
