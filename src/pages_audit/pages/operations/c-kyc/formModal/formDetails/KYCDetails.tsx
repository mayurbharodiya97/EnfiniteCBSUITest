import { useRef, useState, useEffect, useContext, useMemo } from "react";
import {
  Grid,
  Typography,
  Divider,
  Skeleton,
  Collapse,
  IconButton,
  Button,
} from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import {
  kyc_legal_proof_of_add_meta_data,
  kyc_proof_of_address_meta_data,
  kyc_proof_of_identity_meta_data,
} from "./metadata/individual/kycdetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { DocumentGridMetaData } from "./metadata/individual/personaldetails";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../CkycContext";
import { company_info_meta_data } from "./metadata/legal/legalcompanyinfo";
import _ from "lodash";

const KYCDetails = ({
  isCustomerData,
  setIsCustomerData,
  isLoading,
  setIsLoading,
  displayMode,
}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  //  const myGridRef = useRef<any>(null);
  const { t } = useTranslation();
  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handleStepStatusctx,
    handleModifiedColsctx
  } = useContext(CkycContext);
  const [isPoIExpanded, setIsPoIExpanded] = useState(true);
  const [isPoAExpanded, setIsPoAExpanded] = useState(true);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const KyCPoIFormRef = useRef<any>("");
  const KyCPoAFormRef = useRef<any>("");
  const NextBtnRef = useRef<any>("");
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [currentTabFormData, setCurrentTabFormData] = useState({
    proof_of_identity: {},
    proof_of_address: {},
  });

  const [gridData, setGridData] = useState<any>([
    {
      SR_NO: "",
      document: "",
      Submit: "",
      Doc_No: "",
      valid_till_date: "",
      entered_date: "",
    },
    {
      SR_NO: "",
      document: "",
      Submit: "",
      Doc_No: "",
      valid_till_date: "",
      entered_date: "",
    },
  ]);

  const handlePoIExpand = () => {
    setIsPoIExpanded(!isPoIExpanded);
  };
  const handlePoAExpand = () => {
    setIsPoAExpanded(!isPoAExpanded);
  };

  const POIMetadata = state?.entityTypectx === "I" 
    ? kyc_proof_of_identity_meta_data 
    : company_info_meta_data
  // const POIMetadata = company_info_meta_data
  const POAMetadata = state?.entityTypectx === "I" 
    ? kyc_proof_of_address_meta_data 
    : kyc_legal_proof_of_add_meta_data

  const PoISubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    setIsNextLoading(true);

    if (data && !hasError) {

      let formFields = Object.keys(data) // array, get all form-fields-name 
      formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
      const formData = _.pick(data, formFieldsRef.current)

      setCurrentTabFormData((formData) => ({
        ...formData,
        proof_of_identity: data,
      }));
      let newData = state?.formDatactx;
      newData["PERSONAL_DETAIL"] = { ...newData["PERSONAL_DETAIL"], ...formData };
      handleFormDataonSavectx(newData);
      // if(state?.isFreshEntryctx) {
        handleStepStatusctx({ status: "", coltabvalue: state?.colTabValuectx });
        KyCPoAFormRef.current.handleSubmitError(NextBtnRef.current, "save");
      // }
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
    }
    setIsNextLoading(false);
    endSubmit(true)
  };
  const PoASubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    setIsNextLoading(true);
    if (data && !hasError) {
      let formFields = Object.keys(data) // array, get all form-fields-name 
      formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
      const formData = _.pick(data, formFieldsRef.current)


      setCurrentTabFormData((formData) => ({
        ...formData,
        proof_of_address: data,
      }));

      let newData = state?.formDatactx;
      newData["PERSONAL_DETAIL"] = { ...newData["PERSONAL_DETAIL"], ...formData };
      handleFormDataonSavectx(newData);
      if(!state?.isFreshEntryctx) {
        // on edit/view
        let tabModifiedCols:any = state?.modifiedFormCols
        let updatedCols = tabModifiedCols.PERSONAL_DETAIL ? _.uniq([...tabModifiedCols.PERSONAL_DETAIL, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])
        tabModifiedCols = {
          ...tabModifiedCols,
          PERSONAL_DETAIL: [...updatedCols]
        }
        handleModifiedColsctx(tabModifiedCols)        
      } 
      // else {
        handleColTabChangectx(2);
        handleStepStatusctx({
          status: "completed",
          coltabvalue: state?.colTabValuectx,
        });
      // }
      // setIsNextLoading(false)
    } else
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
    endSubmit(true);
    setIsNextLoading(false);
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

  //    useEffect(() => {
  //     console.log("asdfweafdw",currentTabFormData)
  //    }, [currentTabFormData])
  return (
    <Grid
      container
      rowGap={3}
      // sx={{backgroundColor: "#eee"}}
    >
      {/* <Typography variant={"h6"}>Personal Details</Typography> */}
      {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>KYC Details {`(2/8)`}</Typography> */}
      <Grid container>
        {/* <Grid item xs='auto'>
                    <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>KYC Details {`(2/8)`}</Typography>
                </Grid> */}
      </Grid>
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
          <Grid item>
            {/* <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>KYC Details</Typography> */}
            <Grid
              container
              item
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography sx={{ color: "var(--theme-color3)" }} variant={"h6"}>
                {state?.entityTypectx === "I"  ? t("ProofOfIdentity") : "Company Info"}
              </Typography>
              <IconButton onClick={handlePoIExpand}>
                {!isPoIExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Grid>
          </Grid>
          <Collapse in={isPoIExpanded}>
            <Grid item xs={12}>
              <FormWrapper
                ref={KyCPoIFormRef}
                onSubmitHandler={PoISubmitHandler}
                // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                initialValues={initialVal}
                displayMode={displayMode}
                key={"poi-form-kyc" + initialVal}
                metaData={POIMetadata as MetaDataType}
                formStyle={{}}
                hideHeader={true}
              />
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
            <Typography sx={{ color: "var(--theme-color3)" }} variant={"h6"}>
              {t("ProofOfAddress")}
            </Typography>
            <IconButton onClick={handlePoAExpand}>
              {!isPoAExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Grid>
          <Collapse in={isPoAExpanded}>
            <Grid item>
              <FormWrapper
                ref={KyCPoAFormRef}
                onSubmitHandler={PoASubmitHandler}
                // initialValues={state?.formDatactx["PERSONAL_DETAIL"] ?? {}}
                initialValues={initialVal}
                displayMode={displayMode}
                key={"poa-form-kyc" + initialVal}
                metaData={POAMetadata as MetaDataType}
                formStyle={{}}
                hideHeader={true}
              />
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

      {isCustomerData && false ? (
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
          <Grid item>
            <Typography
              sx={{ color: "var(--theme-color3)" }}
              gutterBottom={true}
              variant={"h6"}
            >
              {t("Documents")}
            </Typography>
          </Grid>
          <Grid container item>
            <Grid item xs={12} sx={{ backgroundColor: "#eee" }}>
              <GridWrapper
                key={`idtpChargeConfigGrid`}
                finalMetaData={DocumentGridMetaData as GridMetaDataType}
                data={gridData}
                setData={setGridData}
                // loading={isLoading || isFetching}
                // actions={actions}
                // setAction={setCurrentAction}
                // refetchData={() => refetch()}
                // ref={myGridRef}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : isLoading ? (
        <Skeleton
          variant="rounded"
          animation="wave"
          height="300px"
          width="100%"
        ></Skeleton>
      ) : null}

      <Grid container item sx={{ justifyContent: "flex-end" }}>
        <Button
          sx={{ mr: 2, mb: 2 }}
          color="secondary"
          variant="contained"
          disabled={isNextLoading}
          onClick={(e) => {
            handleColTabChangectx(0);
          }}
        >
          {t("Previous")}
        </Button>
        {state?.isFreshEntryctx && <Button
          sx={{ mr: 2, mb: 2 }}
          color="secondary"
          variant="contained"
          disabled={isNextLoading}
          onClick={(e) => {
            NextBtnRef.current = e;
            KyCPoIFormRef.current.handleSubmitError(e, "save");
          }}
        >
          {t("Save & Next")}
        </Button>}

        {!state?.isFreshEntryctx && <Button
          sx={{ mr: 2, mb: 2 }}
          color="secondary"
          variant="contained"
          disabled={isNextLoading}
          onClick={(e) => {
            // Promise.all([KyCPoIFormRef.current.handleSubmitError(e, "save"), KyCPoAFormRef.current.handleSubmitError(e, "save")])
            NextBtnRef.current = e;
            KyCPoIFormRef.current.handleSubmitError(e, "save");
          }}
        >
          {t("Update & Next")}
        </Button>}
      </Grid>
    </Grid>
  );
};

export default KYCDetails;
