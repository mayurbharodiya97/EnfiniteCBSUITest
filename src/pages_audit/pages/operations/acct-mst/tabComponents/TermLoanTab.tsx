import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import { termLoan_metadata } from "../tabMetadata/termLoanMetadata";
import TabNavigate from "../TabNavigate";
import _ from "lodash";

const TermLoanTab = () => {
  const { AcctMSTState, handleCurrFormctx, handleSavectx, handleStepStatusctx, handleFormDataonSavectx, handleModifiedColsctx } = useContext(AcctMSTContext);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update

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

  const onFormSubmitHandler = (
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
      newData["MAIN_DETAIL"] = {
        ...newData["MAIN_DETAIL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if(!AcctMSTState?.isFreshEntryctx) {
        let tabModifiedCols:any = AcctMSTState?.modifiedFormCols
        let updatedCols = tabModifiedCols.MAIN_DETAIL ? _.uniq([...tabModifiedCols.MAIN_DETAIL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])

        tabModifiedCols = {
          ...tabModifiedCols,
          MAIN_DETAIL: [...updatedCols]
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

  const initialVal = useMemo(() => {
    return (
      AcctMSTState?.isFreshEntryctx
        ? AcctMSTState?.formDatactx["MAIN_DETAIL"]
        : AcctMSTState?.formDatactx["MAIN_DETAIL"]
          ? {...AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"] ?? {}, ...AcctMSTState?.formDatactx["MAIN_DETAIL"] ?? {}}
          : {...AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"] ?? {}}
    )
  }, [
    AcctMSTState?.isFreshEntryctx, 
    AcctMSTState?.retrieveFormDataApiRes, 
    AcctMSTState?.formDatactx["MAIN_DETAIL"]
  ])

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onFormSubmitHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        key={"acct-tab-term-loan-form" + initialVal}
        metaData={termLoan_metadata as MetaDataType}
        formStyle={{}}
        formState={{GPARAM155: AcctMSTState?.gparam155 }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
      ></FormWrapper>
      <TabNavigate handleSave={handleSave} displayMode={AcctMSTState?.formmodectx ?? "new"} isNextLoading={isNextLoading} />
    </Grid>
  );
};

export default TermLoanTab;
