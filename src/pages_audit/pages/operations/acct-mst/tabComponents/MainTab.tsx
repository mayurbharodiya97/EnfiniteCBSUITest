import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { main_tab_metadata } from "../tabMetadata/mainTabMetadata";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import TabNavigate from "../TabNavigate";
import _ from "lodash";
import { usePopupContext } from "components/custom/popupContext";

const MainTab = () => {
  const { AcctMSTState, handlecustomerIDctx, handleCurrFormctx, handleStepStatusctx, handleFormDataonSavectx, handleModifiedColsctx, handleSavectx } = useContext(AcctMSTContext);
  const { MessageBox } = usePopupContext();
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const formRef = useRef<any>(null);
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

  // const initialVal = useMemo(() => {
  //   return AcctMSTState?.isFreshEntryctx
  //     ? AcctMSTState?.formDatactx["PERSONAL_DETAIL"]
  //       ? AcctMSTState?.formDatactx["PERSONAL_DETAIL"]
  //       : {}
  //     : AcctMSTState?.retrieveFormDataApiRes
  //     ? AcctMSTState?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
  //     : {};
  // }, [AcctMSTState?.isFreshEntryctx, AcctMSTState?.retrieveFormDataApiRes]);
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
    // return () => {
    //   handleCurrFormctx({
    //     currentFormRefctx: [],
    //     currentFormSubmitted: null,
    //     colTabValuectx: null,
    //   })
    // }
  }, [])

  useEffect(() => {
    // console.log("qweqweqweqwe", formStatus)
    if(Boolean(AcctMSTState?.currentFormctx.currentFormRefctx && AcctMSTState?.currentFormctx.currentFormRefctx.length>0) && Boolean(formStatus && formStatus.length>0)) {
      if(AcctMSTState?.currentFormctx.currentFormRefctx.length === formStatus.length) {
        setIsNextLoading(false)
        let submitted;
        submitted = formStatus.filter(form => !Boolean(form))
        if(submitted && Array.isArray(submitted) && submitted.length>0) {
          submitted = false;
        } else {
          submitted = true;
          let newTabs = AcctMSTState?.tabsApiResctx;          
          // if(Array.isArray(newTabs) && newTabs.length>0) {
          //   newTabs = newTabs.map(tab => {
          //     if(tab.TAB_NAME === "NRI Details") {
          //       if(AcctMSTState?.formDatactx.PERSONAL_DETAIL["RESIDENCE_STATUS"] === "02" ||
          //       AcctMSTState?.formDatactx.PERSONAL_DETAIL["RESIDENCE_STATUS"] === "03") {
          //           return {...tab, isVisible: false}
          //       } else {
          //         return {...tab, isVisible: true}
          //       }
          //     } else {
          //       return tab;
          //     }
          //   })
          //   handleApiRes(newTabs)
          // }
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
        ref={formRef}
        onSubmitHandler={onSubmitPDHandler}
        initialValues={initialVal}
        key={"acct-mst-main-form" + initialVal}
        metaData={main_tab_metadata as MetaDataType}
        formStyle={{}}
        formState={{
          PARAM320: AcctMSTState?.param320, 
          ACCT_TYPE: AcctMSTState?.accTypeValuectx,
          MessageBox: MessageBox,
          handlecustomerIDctx: handlecustomerIDctx
        }}
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
      <TabNavigate handleSave={handleSave} displayMode={AcctMSTState?.formmodectx ?? "new"} isNextLoading={isNextLoading} />
    </Grid>
  );
};

export default MainTab;
