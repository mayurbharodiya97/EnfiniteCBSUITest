import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { AcctMSTContext } from "../../AcctMSTContext";
import { AuthContext } from "pages_audit/auth";
import { guarantorjoint_tab_metadata } from "../../tabMetadata/guarantorJointMetadataa";
import TabNavigate from "../../TabNavigate";
import _ from "lodash";

const GuarantorJointTab = () => {
  const { 
    AcctMSTState, 
    handleCurrFormctx, 
    handleSavectx, 
    handleStepStatusctx,
    handleFormDataonSavectx,
    handleModifiedColsctx 
  } = useContext(AcctMSTContext);
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

  const onFormSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if(data && !hasError) {
      let newData = AcctMSTState?.formDatactx
      if(data?.JOINT_GUARANTOR_DTL) {
        let filteredCols:any[]=[]
        filteredCols = Object.keys(data.JOINT_GUARANTOR_DTL[0])
        filteredCols = filteredCols.filter(field => !field.includes("_ignoreField"))
        if(AcctMSTState?.isFreshEntryctx) {
          filteredCols = filteredCols.filter(field => !field.includes("SR_CD"))
        }
        let newFormatOtherAdd = data?.JOINT_GUARANTOR_DTL?.map((formRow, i) => {
          let formFields = Object.keys(formRow)
          formFields = formFields.filter(field => !field.includes("_ignoreField"))
          const formData = _.pick(data?.JOINT_GUARANTOR_DTL[i], formFields)
          return {...formData, j_type: "G"};
        })
        newData["JOINT_GUARANTOR_DTL"] = [...newFormatOtherAdd]
        handleFormDataonSavectx(newData)
        if(!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols:any = AcctMSTState?.modifiedFormCols
          tabModifiedCols = {
              ...tabModifiedCols,
              JOINT_GUARANTOR_DTL: [...filteredCols]
          }
          handleModifiedColsctx(tabModifiedCols)
        }
      } else {
        newData["JOINT_GUARANTOR_DTL"] = []
        handleFormDataonSavectx(newData)
        if(!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols:any = AcctMSTState?.modifiedFormCols
          tabModifiedCols = {
            ...tabModifiedCols,
            JOINT_GUARANTOR_DTL: []
          }
          handleModifiedColsctx(tabModifiedCols)
        }  
      }
      setFormStatus(old => [...old, true])
    } else {
      handleStepStatusctx({status: "error", coltabvalue: AcctMSTState?.colTabValuectx})
      setFormStatus(old => [...old, false])
    }
    endSubmit(true)
  }

  const initialVal = useMemo(() => {
    return (
      AcctMSTState?.isFreshEntryctx
        ? AcctMSTState?.formDatactx["JOINT_GUARANTOR_DTL"]?.length >0
          ? {JOINT_GUARANTOR_DTL: [...AcctMSTState?.formDatactx["JOINT_GUARANTOR_DTL"] ?? []]}
          : {JOINT_GUARANTOR_DTL: [{}]}
        : AcctMSTState?.formDatactx["JOINT_GUARANTOR_DTL"]
          ? {JOINT_GUARANTOR_DTL: [...AcctMSTState?.formDatactx["JOINT_GUARANTOR_DTL"] ?? []]}
          : {JOINT_GUARANTOR_DTL: [...AcctMSTState?.retrieveFormDataApiRes["JOINT_GUARANTOR_DTL"] ?? []]}
    )
  }, [
    AcctMSTState?.isFreshEntryctx, 
    AcctMSTState?.retrieveFormDataApiRes["JOINT_GUARANTOR_DTL"],
    AcctMSTState?.formDatactx["JOINT_GUARANTOR_DTL"]
  ])
  
  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        key={"pd-form-kyc" + initialVal}
        ref={formRef}
        metaData={guarantorjoint_tab_metadata as MetaDataType}
        onSubmitHandler={onFormSubmitHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
      ></FormWrapper>
      <TabNavigate handleSave={handleSave} displayMode={AcctMSTState?.formmodectx ?? "new"} isNextLoading={isNextLoading} />
    </Grid>
  );
};

export default GuarantorJointTab;
