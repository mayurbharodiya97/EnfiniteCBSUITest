import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Skeleton,
  IconButton,
  Collapse,
  Dialog,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import { entity_detail_legal_meta_data } from "../../metadata/legal/legalentitydetails";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "../../../../api";
import { ckyc_retrieved_meta_data } from "pages_audit/pages/operations/c-kyc/metadata";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
// import { format } from 'date-fns';
import {
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
const actions = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const EntityDetails = () => {
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const PDFormRef = useRef<any>("");
  const PODFormRef = useRef<any>("");
  const NextBtnRef = useRef<any>("");
  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleCurrentFormRefctx,
    handleSavectx,
    handleCurrFormctx,
    handleApiRes,
  } = useContext(CkycContext);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isPDExpanded, setIsPDExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [acctName, setAcctName] = useState("");
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const handlePDExpand = () => {
    setIsPDExpanded(!isPDExpanded);
  };

  const mutation: any = useMutation(API.getRetrieveData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  //   useEffect(() => {
  //     console.log("asdasdasdas", mutation)
  //   }, [mutation.data])

  const onCloseSearchDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    let refs = [PDFormRef];
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
          let newTabs = state?.tabsApiResctx;
          if (Array.isArray(newTabs) && newTabs.length > 0) {
            newTabs = newTabs.map((tab) => {
              if (tab.TAB_NAME === "NRI Details") {
                if (
                  state?.formDatactx.PERSONAL_DETAIL["RESIDENCE_STATUS"] ===
                    "02" ||
                  state?.formDatactx.PERSONAL_DETAIL["RESIDENCE_STATUS"] ===
                    "03"
                ) {
                  return { ...tab, isVisible: false };
                } else {
                  return { ...tab, isVisible: true };
                }
              } else {
                return tab;
              }
            });
            handleApiRes(newTabs);
          }
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
    // setIsNextLoading(true)
    // console.log("qweqweqwesdcas", data, displayData, actionFlag)
    if (data && !hasError) {
      let formFields = Object.keys(data); // array, get all form-fields-name
      formFields = formFields.filter(
        (field) => !field.includes("_ignoreField")
      ); // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]); // array, added distinct all form-field names
      const formData = _.pick(data, formFieldsRef.current);

      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "",
        // REQ_CD: state?.req_cd_ctx,
        // SR_CD: "3",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        ENTRY_TYPE: "1",
      };
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...data,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx) {
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
      setFormStatus((old) => [...old, true]);
      // handleColTabChangectx(state?.colTabValuectx+1)
      // handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
      // PODFormRef.current.handleSubmitError(NextBtnRef.current, "save")
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
    return state?.isFreshEntryctx
      ? state?.formDatactx["PERSONAL_DETAIL"]
        ? state?.formDatactx["PERSONAL_DETAIL"]
        : {}
      : state?.retrieveFormDataApiRes
      ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [PDFormRef.current.handleSubmitError(e, "save", false)];
    handleSavectx(e, refs);
  };

  // useEffect(() => {
  //     console.log("state?.isFreshEntryctx",state?.isFreshEntryctx)
  // }, [state?.isFreshEntryctx])
  return (
    <Grid
      container
      rowGap={3}
      // sx={{backgroundColor: "#eee"}}
    >
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
            {t("EntityDetails")}
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
              metaData={entity_detail_legal_meta_data as MetaDataType}
              formStyle={{}}
              formState={{
                TIN_ISSUING_COUNTRY: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? "",
                TIN: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]?.TIN ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.TIN ?? "",
              }}
              hideHeader={true}
              // displayMode={"new"}
              displayMode={state?.formmodectx}
              controlsAtBottom={false}
              onFormButtonClickHandel={(fieldID, dependentFields) => {
                // console.log("form button clicked...", fieldID, dependentFields, dependentFields?.SURNAME?.value, typeof dependentFields?.SURNAME?.value)
                if (
                  fieldID === "SEARCH_BTN_ignoreField" &&
                  dependentFields?.SURNAME?.value
                ) {
                  if (dependentFields?.SURNAME?.value.trim().length > 0) {
                    if (acctName !== dependentFields?.SURNAME?.value.trim()) {
                      setAcctName(dependentFields?.SURNAME?.value.trim());
                      let data = {
                        COMP_CD: authState?.companyID ?? "",
                        SELECT_COLUMN: {
                          ACCT_NM: dependentFields?.SURNAME?.value.trim(),
                        },
                      };
                      mutation.mutate(data);
                    }
                    setDialogOpen(true);
                  }
                }
                // let event: any = { preventDefault: () => {} };
                // formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
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
      {/* : null} */}
      {/* </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null} */}

      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />

      {dialogOpen && (
        <SearchListdialog
          open={dialogOpen}
          onClose={onCloseSearchDialog}
          data={mutation?.data}
          isLoading={mutation?.isLoading}
        />
      )}
    </Grid>
  );
};

export const SearchListdialog = ({ open, onClose, data, isLoading }) => {
  const setCurrentAction = useCallback((data) => {
    if (data.name === "close") {
      onClose();
    }
  }, []);

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      // onClose={onClose}
      PaperProps={{
        style: {
          minWidth: "70%",
          width: "80%",
        },
      }}
    >
      <GridWrapper
        key={`SearchListGrid`}
        finalMetaData={ckyc_retrieved_meta_data as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading}
        actions={actions}
        setAction={setCurrentAction}
        // refetchData={() => refetch()}
        // ref={myGridRef}
      />
    </Dialog>
  );
};

export default EntityDetails;
