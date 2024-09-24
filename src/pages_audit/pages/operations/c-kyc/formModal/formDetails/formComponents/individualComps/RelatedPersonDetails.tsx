import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Grid,
  Typography,
  Skeleton,
  Collapse,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { related_person_detail_data } from "../../metadata/individual/relatedpersondetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import { AuthContext } from "pages_audit/auth";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
import {
  MessageBoxWrapper,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
const RelatedPersonDetails = () => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
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
  const RelPersonFormRef = useRef<any>("");
  const [isRelatedPDExpanded, setIsRelatedPDExpanded] = useState(true);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const handleRelatedPDExpand = () => {
    setIsRelatedPDExpanded(!isRelatedPDExpanded);
  };
  useEffect(() => {
    let refs = [RelPersonFormRef];
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

  const RelPersonSubmitHandler2 = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "F",
        // REQ_CD: state?.req_cd_ctx,
        // SR_CD: "3",
        CONFIRMED: "N",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        ACTIVE: "Y",
      };
      // "new entry" && "minor customer" && "no row with guardian type"
      if (
        state?.isFreshEntryctx &&
        state?.formDatactx["PERSONAL_DETAIL"]?.LF_NO === "M" &&
        !(
          Array.isArray(data.RELATED_PERSON_DTL) &&
          data.RELATED_PERSON_DTL?.filter(
            (row) => row?.RELATED_PERSON_TYPE === "1 "
          )?.length > 0
        )
      ) {
        handleStepStatusctx({
          status: "error",
          coltabvalue: state?.colTabValuectx,
        });
        setOpen(true);
        setFormStatus((old) => [...old, false]);
      } else {
        if (data.RELATED_PERSON_DTL) {
          let filteredCols: any[] = [];
          filteredCols = Object.keys(data.RELATED_PERSON_DTL[0]);
          filteredCols = filteredCols.filter(
            (field) => !field.includes("_ignoreField")
          );
          if (state?.isFreshEntryctx) {
            filteredCols = filteredCols.filter(
              (field) => !field.includes("SR_CD")
            );
          }

          let newFormatRelPerDtl = data.RELATED_PERSON_DTL.map((formRow, i) => {
            let formFields = Object.keys(formRow);
            formFields = formFields.filter(
              (field) => !field.includes("_ignoreField")
            );
            formFields = formFields.filter(
              (field) => !field.includes("_ignoreField")
            );
            // console.log("reltedaw formFields 2", formFields)
            // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
            formFields = formFields.filter(
              (field) => !field.includes("_ignoreField")
            );
            // console.log("reltedaw formFields 2", formFields)
            // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
            const formData = _.pick(data.RELATED_PERSON_DTL[i], formFields);
            // console.log("reltedaw formData", formData)
            return { ...formData, ...commonData };
          });
          newData["RELATED_PERSON_DTL"] = [...newFormatRelPerDtl];
          handleFormDataonSavectx(newData);
          if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
            let tabModifiedCols: any = state?.modifiedFormCols;
            tabModifiedCols = {
              ...tabModifiedCols,
              RELATED_PERSON_DTL: [...filteredCols],
            };
            handleModifiedColsctx(tabModifiedCols);
          }
        } else {
          newData["RELATED_PERSON_DTL"] = [];
          handleFormDataonSavectx(newData);
          if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
            let tabModifiedCols: any = state?.modifiedFormCols;
            tabModifiedCols = {
              ...tabModifiedCols,
              RELATED_PERSON_DTL: [],
            };
            handleModifiedColsctx(tabModifiedCols);
          }
        }
        setFormStatus((old) => [...old, true]);
      }
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };

  const initialVal = useMemo(() => {
    return state?.formDatactx["RELATED_PERSON_DTL"]
      ? { RELATED_PERSON_DTL: state?.formDatactx["RELATED_PERSON_DTL"] }
      : !state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"]
        ? {
            RELATED_PERSON_DTL:
              state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"],
          }
        : {}
      : { RELATED_PERSON_DTL: [{}] };
  }, [
    state?.isFreshEntryctx,
    state?.isDraftSavedctx,
    state?.retrieveFormDataApiRes,
  ]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [RelPersonFormRef.current.handleSubmitError(e, "save", false)];
    handleSavectx(e, refs);
  };

  return (
    <Grid
      container
      rowGap={3}
      // sx={{backgroundColor: "#eee"}}
    >
      {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Details of Related Person {`(4/8)`}</Typography> */}
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
            {t("DetailsOfRelatedPerson")}
          </Typography>
          <IconButton onClick={handleRelatedPDExpand}>
            {!isRelatedPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>
        <Collapse in={isRelatedPDExpanded}>
          <Grid item>
            <FormWrapper
              ref={RelPersonFormRef}
              onSubmitHandler={RelPersonSubmitHandler2}
              // initialValues={state?.formDatactx["RELATED_PERSON_DTL"] ?? {}}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              key={"new-form-in-kyc"}
              metaData={related_person_detail_data as MetaDataType}
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
      {/* as per old base of cbs */}
      {/* 
            <MessageBoxWrapper
                MessageTitle={"Data Validation Failed"}
                Message={`In case of Minor KYC at least one Related Person should have as a 'Guardian of Minor'` ?? "No Message"}
                onClickButton={() => setOpen(false)}
                rows={[]}
                buttonNames={["OK"]}
                open={open}
            /> */}
      {/* as per npm common base package */}

      <MessageBoxWrapper
        validMessage={
          `In case of Minor KYC at least one Related Person should have as a 'Guardian of Minor'` ??
          "No Message"
        }
        onActionYes={() => setOpen(false)}
        rows={[]}
        onActionNo={() => {}}
        isOpen={open}
      />
    </Grid>
  );
};

export default RelatedPersonDetails;
