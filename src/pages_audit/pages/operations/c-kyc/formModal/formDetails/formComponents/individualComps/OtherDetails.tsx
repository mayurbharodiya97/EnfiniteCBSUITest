import React, {
  useState,
  useEffect,
  useRef,
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
} from "@mui/material";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import { other_details_meta_data } from "../../metadata/individual/otherdetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { CkycContext } from "../../../../CkycContext";
import { useTranslation } from "react-i18next";
import { AuthContext } from "pages_audit/auth";
import _ from "lodash";
import { other_details_legal_meta_data } from "../../metadata/legal/legalotherdetails";
import TabNavigate from "../TabNavigate";

const OtherDetails = () => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { authState } = useContext(AuthContext);
  const [isNextLoading, setIsNextLoading] = useState(false);
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
  const { t } = useTranslation();
  const OtherDTLFormRef = useRef<any>("");
  const [isOtherDetailsExpanded, setIsOtherDetailsExpanded] = useState(true);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const handleOtherDetailsExpand = () => {
    setIsOtherDetailsExpanded(!isOtherDetailsExpanded);
  };
  const otherDtlMetadata =
    state?.entityTypectx === "I"
      ? other_details_meta_data
      : other_details_legal_meta_data;

  useEffect(() => {
    let refs = [OtherDTLFormRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    // console.log("qweqweqweqwe", formStatus2)
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
      } else {
        handleCurrFormctx({
          currentFormSubmitted: null,
          isLoading: false,
        });
        setFormStatus([]);
        handleStepStatusctx({
          status: "error",
          coltabvalue: state?.colTabValuectx,
        });
      }
    }
  }, [formStatus]);

  const OtherDTLSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    // setIsNextLoading(true)
    if (data && !hasError) {
      let formFields = Object.keys(data); // array, get all form-fields-name
      formFields = formFields.filter(
        (field) => !field.includes("_ignoreField")
      ); // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]); // array, added distinct all form-field names
      const formData = _.pick(data, formFieldsRef.current);

      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
      let resData = formData;
      // if(Boolean(resData["POLITICALLY_CONNECTED"])) {
      //     resData["POLITICALLY_CONNECTED"] = "Y"
      // } else {
      //     resData["POLITICALLY_CONNECTED"] = "N"
      // }

      // if(Boolean(resData["BLINDNESS"])) {
      //     resData["BLINDNESS"] = "Y"
      // } else {
      //     resData["BLINDNESS"] = "N"
      // }

      // if(Boolean(resData["REFERRED_BY_STAFF"])) {
      //     resData["REFERRED_BY_STAFF"] = "Y"
      // } else {
      //     resData["REFERRED_BY_STAFF"] = "N"
      // }
      console.log(resData, "otherdtl", data);

      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "F",
        // REQ_CD: state?.req_cd_ctx,
        // SR_CD: "3",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      };
      newData["OTHER_DTL"] = {
        ...newData["OTHER_DTL"],
        ...resData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.OTHER_DTL
          ? _.uniq([...tabModifiedCols.OTHER_DTL, ...formFieldsRef.current])
          : _.uniq([...formFieldsRef.current]);
        tabModifiedCols = {
          ...tabModifiedCols,
          OTHER_DTL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      setFormStatus((old) => [...old, true]);
      // handleColTabChangectx(5)
      // handleColTabChangectx(state?.colTabValuectx+1)
      // handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
      // setIsNextLoading(false)
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    // setIsNextLoading(false)
    endSubmit(true);
  };
  const initialVal = useMemo(() => {
    return state?.formDatactx["OTHER_DTL"]
      ? state?.formDatactx["OTHER_DTL"]
      : !state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.retrieveFormDataApiRes["OTHER_DTL"]
        ? state?.retrieveFormDataApiRes["OTHER_DTL"]
        : {}
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [OtherDTLFormRef.current.handleSubmitError(e, "save", false)];
    handleSavectx(e, refs);
  };

  return (
    <Grid container rowGap={3}>
      {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Other Details {`(5/8)`}</Typography> */}
      {/* {isCustomerData ?  */}
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
            {t("OtherDetails")}
          </Typography>
          <IconButton onClick={handleOtherDetailsExpand}>
            {!isOtherDetailsExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>
        <Collapse in={isOtherDetailsExpanded}>
          <Grid item>
            <FormWrapper
              ref={OtherDTLFormRef}
              onSubmitHandler={OtherDTLSubmitHandler}
              key={"other-details-form-kyc" + initialVal}
              metaData={otherDtlMetadata as MetaDataType}
              displayMode={state?.formmodectx}
              // initialValues={state?.formDatactx["OTHER_DTL"] ?? {}}
              initialValues={initialVal}
              formStyle={{}}
              hideHeader={true}
            />
          </Grid>
        </Collapse>
      </Grid>
      {/* : null} */}
      {/* </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null} */}
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default OtherDetails;
