import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Grid, Skeleton, Typography } from "@mui/material";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import { nri_detail_meta_data } from "../../metadata/individual/nridetails";
import { CkycContext } from "../../../../CkycContext";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import TabNavigate from "../TabNavigate";

const NRIDetails = () => {
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
  const NRIDTLFormRef = useRef<any>("");
  const { authState } = useContext(AuthContext);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [formStatus, setFormStatus] = useState<any[]>([]);
  useEffect(() => {
    let refs = [NRIDTLFormRef];
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
      }
    }
  }, [formStatus]);

  const NRIDTLSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    let formFields = Object.keys(data); // array, get all form-fields-name
    formFieldsRef.current = [...formFields]; // array, added distinct all form-field names

    // setIsNextLoading(true)
    // console.log("qweqweqwe", data)
    if (data && !hasError) {
      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
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
      let newData = state?.formDatactx;
      newData["NRI_DTL"] = { ...newData["NRI_DTL"], ...data, ...commonData };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.NRI_DTL
          ? _.uniq([...tabModifiedCols.NRI_DTL, ...formFieldsRef.current])
          : _.uniq([...formFieldsRef.current]);
        tabModifiedCols = {
          ...tabModifiedCols,
          NRI_DTL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      setFormStatus((old) => [...old, true]);
      // handleColTabChangectx(7)
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
    endSubmit(true);
    // setIsNextLoading(false)
  };
  const initialVal = useMemo(() => {
    return state?.formDatactx["NRI_DTL"]
      ? state?.formDatactx["NRI_DTL"]
      : !state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.retrieveFormDataApiRes["NRI_DTL"]
        ? state?.retrieveFormDataApiRes["NRI_DTL"]
        : {}
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [NRIDTLFormRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };

  return (
    <Grid
      container
      rowGap={3}
      // sx={{backgroundColor: "#eee"}}
    >
      {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>NRI Details {`(7/8)`}</Typography> */}
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
            sx={{ color: "var(--theme-color3)", pl: 2, pt: "6px" }}
            variant={"h6"}
          >
            {t("NRIDetails")}
          </Typography>
        </Grid>
        <Grid container item>
          <Grid item xs={12}>
            <FormWrapper
              ref={NRIDTLFormRef}
              onSubmitHandler={NRIDTLSubmitHandler}
              key={"nri-details-form-kyc" + initialVal}
              metaData={nri_detail_meta_data as MetaDataType}
              // initialValues={state?.formDatactx["NRI_DTL"] ?? {}}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              formStyle={{}}
              hideHeader={true}
            />
          </Grid>
        </Grid>
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

export default NRIDetails;
