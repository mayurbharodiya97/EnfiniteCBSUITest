import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Skeleton,
  IconButton,
  Collapse,
  CircularProgress,
} from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import {
  personal_detail_prefix_data,
  personal_other_detail_meta_data,
} from "../../metadata/individual/personaldetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import _ from "lodash";
import { AuthContext } from "pages_audit/auth";
// import { format } from 'date-fns';
import * as API from "../../../../api"
import { useMutation } from "react-query";
import { SearchListdialog } from "../legalComps/EntityDetails";
import { GradientButton } from "components/styledComponent/button";
import TabNavigate from "../TabNavigate";
const PersonalDetails = ({
  isCustomerData,
  setIsCustomerData,
  isLoading,
  setIsLoading,
  displayMode
}) => {
  const { t } = useTranslation();
  const PDFormRef = useRef<any>("");
  const PODFormRef = useRef<any>("");
  const NextBtnRef = useRef<any>("");
  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handleStepStatusctx,
    handleEditFormDatactx,
    handleModifiedColsctx,
    handleCurrentFormRefctx,
    handleSavectx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isPDExpanded, setIsPDExpanded] = useState(true);
  const [isOtherPDExpanded, setIsOtherPDExpanded] = useState(true);
  const [acctName, setAcctName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<any[]>([])
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const handlePDExpand = () => {
    setIsPDExpanded(!isPDExpanded);
  };
  const handleOtherPDExpand = () => {
    setIsOtherPDExpanded(!isOtherPDExpanded);
  };
  const mutation: any = useMutation(API.getRetrieveData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  const onCloseSearchDialog = () => {
    setDialogOpen(false)
  }

  useEffect(() => {
    let refs = [PDFormRef, PODFormRef]
    handleCurrentFormRefctx(refs)
  }, [])


  // useEffect(() => {
  //     console.log("... personal details", isCustomerData)
  //     passDataFromPersonalDetails(isCustomerData)
  // }, [isCustomerData])
  const onSubmitPDHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    // console.log("hasErrorhasError", hasError, data)
    setIsNextLoading(true);
    // console.log("qweqweqwesdcas", data, displayData, actionFlag)
    if (data && !hasError) {
      let formFields = Object.keys(data) // array, get all form-fields-name 
      formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
      const formData = _.pick(data, formFieldsRef.current)





      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: "",
        BRANCH_CD: "",
        REQ_FLAG: "",
        REQ_CD: "",
        // SR_CD: "",
      };
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      // handleStepStatusctx({ status: "", coltabvalue: state?.colTabValuectx });
      setFormStatus(old => [...old, Promise.resolve(1)])
      // if(state?.isFreshEntry) {
        // PODFormRef.current.handleSubmitError(NextBtnRef.current, "save");
      // }
      // setIsNextLoading(false)
    } else {
      // handleStepStatusctx({
      //   status: "error",
      //   coltabvalue: state?.colTabValuectx,
      // });
      setIsNextLoading(false);
    }
    endSubmit(true);
  };
  const onSubmitPODHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    setIsNextLoading(true);
    // console.log("qweqweqwe", data)
    // if(Boolean(data["BIRTH_DT"])) {
    //     data["BIRTH_DT"] = format(new Date(data["BIRTH_DT"]), "dd-MMM-yyyy")
    // }
    if (data && !hasError) {

      let formFields = Object.keys(data) // array, get all form-fields-name 
      formFields = formFields.filter(field => !field.includes("_ignoreField") && field !== "AGE") // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
      const formData = _.pick(data, formFieldsRef.current)

      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: "",
        BRANCH_CD: "",
        REQ_FLAG: "",
        REQ_CD: "",
        // SR_CD: "",
      };
      newData["PERSONAL_DETAIL"] = { ...newData["PERSONAL_DETAIL"], ...formData, ...commonData };
      handleFormDataonSavectx(newData);
      // handleColTabChangectx(1)

      if(!state?.isFreshEntryctx) {
        // let oldFormData = _.pick(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}, formFieldsRef.current)
        // let newFormData = _.pick(state?.formDatactx["PERSONAL_DETAIL"] ?? {}, formFieldsRef.current)
        // let upd = utilFunction.transformDetailsData(newFormData, oldFormData);
        // console.log("pod.", upd)
        // console.log("pod. old", oldFormData)
        // console.log("pod. new", newFormData)

        // let updateFormData:any = state?.updateFormDatactx
        let tabModifiedCols:any = state?.modifiedFormCols

        // for storing tab-wise updated cols
        // let updatedCols = tabModifiedCols.PERSONAL_DETAIL ? _.uniq([...tabModifiedCols.PERSONAL_DETAIL, ...upd._UPDATEDCOLUMNS]) : _.uniq([...upd._UPDATEDCOLUMNS])
        let updatedCols = tabModifiedCols.PERSONAL_DETAIL ? _.uniq([...tabModifiedCols.PERSONAL_DETAIL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])

        tabModifiedCols = {
          ...tabModifiedCols,
          PERSONAL_DETAIL: [...updatedCols]
        }
        // handleEditFormDatactx(updateFormData, tabModifiedCols)
        // handleModifiedColsctx(tabModifiedCols)
      } else {
        // handleStepStatusctx({
        //   status: "completed",
        //   coltabvalue: state?.colTabValuectx,
        // });
      }
      setFormStatus(old => [...old, Promise.resolve(1)])
      // handleColTabChangectx(state?.colTabValuectx + 1);
      // setIsNextLoading(false)
    } else {
      // handleStepStatusctx({
      //   status: "error",
      //   coltabvalue: state?.colTabValuectx,
      // });
      // formStatusRef.current = [...formStatusRef.current, Promise.reject(1)]
    }
    setIsNextLoading(false);
    endSubmit(true);
  };

  const initialVal = useMemo(() => {
    return state?.isFreshEntryctx
      ? state?.formDatactx["PERSONAL_DETAIL"]
        ? state?.formDatactx["PERSONAL_DETAIL"]
        : {}
      : state?.retrieveFormDataApiRes
      ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  // useEffect(() => {
  //     console.log("state?.isFreshEntryctx",state?.isFreshEntryctx)
  // }, [state?.isFreshEntryctx])

  useEffect(() => {
    // console.log("evalSave formStatuse", formStatus)
    if(formStatus.length === 2) {
      // console.log("evalSave if pro length",formStatus.length)
      Promise.all(formStatus)
      .then(res => {
        // console.log("evalSave in success ",res)
        handleStepStatusctx({
          status: "completed",
          coltabvalue: state?.colTabValuectx,
        });
        handleColTabChangectx(state?.colTabValuectx + 1);
      })
      .catch(err => {
        console.log("evalSave in catch", err.message)
      })
    } else {
      // console.log("evalSave pro length else",formStatus.length)
      if(formStatus.length>0) {
        handleStepStatusctx({
          status: "error",
          coltabvalue: state?.colTabValuectx,
        })
      }
    }
    setFormStatus([])
  }, [formStatus.length])

  // const evalSave = (e) => {
  //   // PDFormRef.current.handleSubmitError(e, "save", false)
  //   // PODFormRef.current.handleSubmitError(e, "save", false)
  //   console.log("evalSave kiuiwehfiuwehfwef", formStatus)
  //   Promise.all([PDFormRef.current.handleSubmitError(e, "save", false), PODFormRef.current.handleSubmitError(e, "save", false)])
  //   .then((response) => {
  //     console.log("evalSave in success ", response)
  //   }).catch(err => {
  //     console.log("evalSave out catch", err.message)
  //   })
  // }

  const handleSave = (e) => {
    const refs = [PDFormRef.current.handleSubmitError(e, "save", false), PODFormRef.current.handleSubmitError(e, "save", false)]
    handleSavectx(e, refs)
  } 


  return (
    <Grid
      container
      rowGap={3}
      // sx={{backgroundColor: "#eee"}}
    >
      {isCustomerData ? (
        <Grid
          sx={{
            backgroundColor: "var(--theme-color2)",
            padding: (theme) => theme.spacing(1),
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "20px",
          }}
          container
          item
          xs={12}
          direction={"column"}
        >
          <Grid
            container
            item
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              sx={{ color: "var(--theme-color3)", pl: 2 }}
              variant={"h6"}
            >
              {t("PersonalDetails")}
            </Typography>
            <IconButton onClick={handlePDExpand}>
              {!isPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Grid>
          <Collapse in={isPDExpanded}>
            <Grid item>
              <FormWrapper
                ref={PDFormRef}
                onSubmitHandler={onSubmitPDHandler}
                // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                initialValues={initialVal}
                key={"pd-form-kyc" + initialVal}
                metaData={personal_detail_prefix_data as MetaDataType}
                formStyle={{}}
                hideHeader={true}
                displayMode={displayMode}
                controlsAtBottom={false}
                onFormButtonClickHandel={(fieldID, dependentFields) => {
                  // console.log("form button clicked...", fieldID, dependentFields, dependentFields?.ACCT_NM?.value, typeof dependentFields?.ACCT_NM?.value)
                  if(fieldID === "SEARCH_BTN_ignoreField" && dependentFields?.ACCT_NM?.value) {
                      if(dependentFields?.ACCT_NM?.value.trim().length>0) {
                          if(acctName !== dependentFields?.ACCT_NM?.value.trim()) {
                              setAcctName(dependentFields?.ACCT_NM?.value.trim())
                              let data = {
                                  COMP_CD: authState?.companyID ?? "",
                                  SELECT_COLUMN: {
                                      ACCT_NM: dependentFields?.ACCT_NM?.value.trim()
                                  }
                              }
                              mutation.mutate(data)
                          }
                          setDialogOpen(true)
                      }
                  }
                }}
              >
                {/* {({isSubmitting, handleSubmit}) => {
                                console.log("isSubmitting, handleSubmit", isSubmitting)
                                return <Button color="secondary" onClick={handleSubmit}>Save</Button>
                            }} */}
                {/* <p>Controll Components</p> */}
              </FormWrapper>
            </Grid>
          </Collapse>
        </Grid>
      ) : isLoading ? (
        <Skeleton
          variant="rounded"
          animation="wave"
          height="220px"
          width="100%"
        ></Skeleton>
      ) : null}

      {isCustomerData ? (
        <Grid
          sx={{
            backgroundColor: "var(--theme-color2)",
            padding: (theme) => theme.spacing(1),
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "20px",
          }}
          container
          item
          xs={12}
          direction={"column"}
        >
          <Grid
            container
            item
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              sx={{ color: "var(--theme-color3)", pl: 2 }}
              variant={"h6"}
            >
              {t("OtherPersonalDetails")}
            </Typography>
            <IconButton onClick={handleOtherPDExpand}>
              {!isOtherPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Grid>
          <Collapse in={isOtherPDExpanded}>
            {/* <Grid container item> */}
            <Grid item>
              <FormWrapper
                ref={PODFormRef}
                key={"pod-form-kyc" + initialVal}
                metaData={personal_other_detail_meta_data as MetaDataType}
                // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                initialValues={initialVal}
                displayMode={displayMode}
                formStyle={{}}
                hideHeader={true}
                onSubmitHandler={onSubmitPODHandler}
              />
            </Grid>
            {/* </Grid> */}
          </Collapse>
        </Grid>
      ) : isLoading ? (
        <Skeleton
          variant="rounded"
          animation="wave"
          height="300px"
          width="100%"
        ></Skeleton>
    ) : null}
      <TabNavigate handleSave={handleSave} displayMode={displayMode ?? "new"} isNextLoading={isNextLoading ?? false} />

        {dialogOpen && <SearchListdialog 
            open={dialogOpen} 
            onClose={onCloseSearchDialog} 
            data={mutation?.data} 
            isLoading={mutation?.isLoading} 
        />}
    </Grid>
  );
};

export default PersonalDetails;
