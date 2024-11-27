import {
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  Fragment,
} from "react";
import {
  Grid,
  Typography,
  Divider,
  Skeleton,
  Collapse,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  kyc_legal_proof_of_add_meta_data,
  kyc_proof_of_address_meta_data,
  kyc_proof_of_identity_meta_data,
} from "./metadata/individual/kycdetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
import { DocumentGridMetaData } from "./metadata/individual/personaldetails";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../CkycContext";
import { company_info_meta_data } from "./metadata/legal/legalcompanyinfo";
import _ from "lodash";
import { AuthContext } from "pages_audit/auth";
import TabNavigate from "./formComponents/TabNavigate";
import {
  usePopupContext,
  MetaDataType,
  GridWrapper,
  GridMetaDataType,
  FormWrapper,
} from "@acuteinfo/common-base";
import { format } from "date-fns";

const KYCDetails = () => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  //  const myGridRef = useRef<any>(null);
  const { t } = useTranslation();
  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleCurrentFormRefctx,
    handleSavectx,
    handleCurrFormctx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
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
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const { MessageBox } = usePopupContext();

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

  useEffect(() => {
    let refs = [KyCPoIFormRef, KyCPoAFormRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);
  useEffect(() => {
    // console.log("qweqweqweqwe", formStatus)
    if (
      Boolean(
        state?.currentFormctx.currentFormRefctx &&
          state?.currentFormctx.currentFormRefctx.length > 0
      ) &&
      Boolean(formStatus && formStatus.length > 0)
    ) {
      if (
        state?.currentFormctx.currentFormRefctx.length === formStatus.length
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
            coltabvalue: state?.colTabValuectx,
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

  const POIMetadata =
    state?.entityTypectx === "I"
      ? kyc_proof_of_identity_meta_data
      : company_info_meta_data;
  // const POIMetadata = company_info_meta_data
  const POAMetadata =
    state?.entityTypectx === "I"
      ? kyc_proof_of_address_meta_data
      : kyc_legal_proof_of_add_meta_data;

  const PoISubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    // setIsNextLoading(true);

    if (data && !hasError) {
      let formFields = Object.keys(data); // array, get all form-fields-name
      formFields = formFields.filter(
        (field) => !field.includes("_ignoreField")
      ); // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]); // array, added distinct all form-field names
      let formData: any = _.pick(data, formFieldsRef.current);
      const dateFields: string[] = [
        "PASSPORT_ISSUE_DT",
        "PASSPORT_EXPIRY_DT",
        "DRIVING_LICENSE_ISSUE_DT",
        "DRIVING_LICENSE_EXPIRY_DT",
        "COMMENCEMENT_DT",
        "LIQUIDATION_DT",
      ];
      dateFields.forEach((field) => {
        if (Object.hasOwn(formData, field)) {
          formData[field] = Boolean(formData[field])
            ? format(new Date(formData[field]), "dd/MM/yyyy")
            : "";
        }
      });
      // setCurrentTabFormData((formData) => ({
      //   ...formData,
      //   proof_of_identity: data,
      // }));
      let newData = state?.formDatactx;
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx || state?.fromctx === "new-draft") {
        // on edit/view
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.PERSONAL_DETAIL
          ? _.uniq([
              ...tabModifiedCols.PERSONAL_DETAIL,
              ...formFieldsRef.current,
            ])
          : _.uniq([...formFieldsRef.current]);
        tabModifiedCols = {
          ...tabModifiedCols,
          PERSONAL_DETAIL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      // if(state?.isFreshEntryctx) {
      setFormStatus((old) => [...old, true]);
      // handleStepStatusctx({ status: "", coltabvalue: state?.colTabValuectx });
      // KyCPoAFormRef.current.handleSubmit(NextBtnRef.current, "save");
      // }
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    // setIsNextLoading(false);
    endSubmit(true);
  };
  const PoASubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    // console.log("qekdiwqeydwyegdwef", data)
    // setIsNextLoading(true);
    if (data && !hasError) {
      let formFields = Object.keys(data); // array, get all form-fields-name
      formFields = formFields.filter(
        (field) =>
          !(
            field.includes("_ignoreField") ||
            field.includes("DISTRICT_NM") ||
            field.includes("LOC_DISTRICT_NM")
          )
      ); // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]); // array, added distinct all form-field names
      let formData = _.pick(data, formFieldsRef.current);
      formData.SAME_AS_PER = Boolean(formData.SAME_AS_PER) ? "Y" : "N";

      // setCurrentTabFormData((formData) => ({
      //   ...formData,
      //   proof_of_address: data,
      // }));

      let newData = state?.formDatactx;
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx || state?.fromctx === "new-draft") {
        // on edit/view
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.PERSONAL_DETAIL
          ? _.uniq([
              ...tabModifiedCols.PERSONAL_DETAIL,
              ...formFieldsRef.current,
            ])
          : _.uniq([...formFieldsRef.current]);
        tabModifiedCols = {
          ...tabModifiedCols,
          PERSONAL_DETAIL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      // else {
      // handleColTabChangectx(2);
      // handleStepStatusctx({
      //   status: "completed",
      //   coltabvalue: state?.colTabValuectx,
      // });
      setFormStatus((old) => [...old, true]);
      // }
      // setIsNextLoading(false)
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
    // setIsNextLoading(false);
  };

  const initialVal = useMemo(() => {
    return state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.formDatactx["PERSONAL_DETAIL"]
      : state?.formDatactx["PERSONAL_DETAIL"]
      ? {
          ...(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}),
          CONTACT1:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT1 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT1 || ""),
          CONTACT2:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT2 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT2 || ""),
          CONTACT3:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT3 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT3 || ""),
          CONTACT4:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT4 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT4 || ""),
          CONTACT5:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT5 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT5 || ""),
          PAN_NO:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_PAN_NO ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PAN_NO || ""),
          ...(state?.formDatactx["PERSONAL_DETAIL"] ?? {}),
        }
      : {
          ...(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}),
          CONTACT1:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT1 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT1 || ""),
          CONTACT2:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT2 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT2 || ""),
          CONTACT3:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT3 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT3 || ""),
          CONTACT4:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT4 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT4 || ""),
          CONTACT5:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT5 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT5 || ""),
          PAN_NO:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_PAN_NO ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PAN_NO || ""),
        };
  }, [
    state?.isFreshEntryctx,
    state?.isDraftSavedctx,
    state?.retrieveFormDataApiRes,
  ]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [
      KyCPoIFormRef.current.handleSubmit(e, "save", false),
      KyCPoAFormRef.current.handleSubmit(e, "save", false),
    ];
    handleSavectx(e, refs);
  };

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
      {/* {isCustomerData ? ( */}
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
            <Typography
              sx={{ color: "var(--theme-color3)", pl: 2 }}
              variant={"h6"}
            >
              {state?.entityTypectx === "I"
                ? t("ProofOfIdentity")
                : "Company Info"}
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
              displayMode={state?.formmodectx}
              key={"poi-form-kyc" + initialVal}
              metaData={POIMetadata as MetaDataType}
              formStyle={{}}
              hideHeader={true}
              formState={{
                COMP_CD: authState?.companyID ?? "",
                CUSTOMER_ID: state?.customerIDctx ?? "",
                REQ_FLAG:
                  state?.isFreshEntryctx || state?.isDraftSavedctx ? "F" : "E",
                RESIDENCE_STATUS:
                  state?.formDatactx["PERSONAL_DETAIL"]?.RESIDENCE_STATUS ?? "",
                TIN_ISSUING_COUNTRY: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? "",
                TIN: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]?.TIN ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.TIN ?? "",
                MessageBox: MessageBox,
              }}
              setDataOnFieldChange={async (action, payload) => {
                // console.log(payload, "wekjukfhwiuefadw", action)
                // const result = payload;
                if (
                  Boolean(payload) &&
                  (action === "PAN_NO" ||
                    action === "UNIQUE_ID" ||
                    action === "ELECTION_CARD_NO" ||
                    action === "PASSPORT_NO" ||
                    action === "DRIVING_LICENSE_NO")
                ) {
                  const buttonName = await MessageBox({
                    messageTitle: "Duplicate Value",
                    message: payload ?? "No Message",
                    buttonNames: ["Ok"],
                    icon: "WARNING",
                  });
                }
              }}
            />
          </Grid>
        </Collapse>
      </Grid>
      {/* ) : null} */}
      {/* ) : isLoading ? (
        <Skeleton
          variant="rounded"
          animation="wave"
          height="220px"
          width="100%"
        ></Skeleton>
      ) : null} */}

      {/* {isCustomerData ? ( */}
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
              displayMode={state?.formmodectx}
              key={"poa-form-kyc" + initialVal}
              metaData={POAMetadata as MetaDataType}
              formStyle={{}}
              hideHeader={true}
              formState={{
                COMP_CD: authState?.companyID ?? "",
                CUSTOMER_ID: state?.customerIDctx ?? "",
                REQ_FLAG:
                  state?.isFreshEntryctx || state?.isDraftSavedctx ? "F" : "E",
              }}
              setDataOnFieldChange={async (action, payload) => {
                if (Boolean(payload) && action === "CONTACT2") {
                  const buttonName = await MessageBox({
                    messageTitle: "Duplicate Value",
                    message: payload ?? "No Message",
                    buttonNames: ["Ok"],
                    icon: "WARNING",
                  });
                }
              }}
            />
          </Grid>
        </Collapse>
      </Grid>
      {/* ) : null} */}
      {/* ) : isLoading ? (
        <Skeleton
          variant="rounded"
          animation="wave"
          height="220px"
          width="100%"
        ></Skeleton>
      ) : null} */}

      {false ? (
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
      ) : null}
      {/* ) : isLoading ? (
        <Skeleton
          variant="rounded"
          animation="wave"
          height="300px"
          width="100%"
        ></Skeleton>
      ) : null} */}
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default KYCDetails;
