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
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  attest_history_meta_data,
  attestation_detail_meta_data,
} from "../../metadata/individual/attestationdetails";
import { CkycContext } from "../../../../CkycContext";
import { useTranslation } from "react-i18next";
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import _ from "lodash";
import { CustomerSaveDialog } from "../../../dialog/CustomerSave";
import TabNavigate from "../TabNavigate";
import {
  utilFunction,
  Alert,
  GridWrapper,
  GridMetaDataType,
  PopupRequestWrapper,
  FormWrapper,
  MetaDataType,
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

const AttestationDetails = ({ onFormClose, onUpdateForm }) => {
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [historyDialog, setHistoryDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [saveSuccessDialog, setSaveSuccessDialog] = useState<boolean>(false);
  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleUpdatectx,
    handleCurrentFormRefctx,
    handleSavectx,
    handleCurrFormctx,
    handleReqCDctx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const AttestationDTLFormRef = useRef<any>("");
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const [docValidateDialog, setDocValidateDialog] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<any>("");
  const [reqCD, setReqCD] = useState<any>(null);
  const onCloseSearchDialog = () => {
    setHistoryDialog(false);
  };
  const onCloseUpdateDialog = () => {
    setUpdateDialog(false);
    setIsUpdated(false);
  };
  const onCloseSaveSuccessDialog = () => {
    setSaveSuccessDialog(false);
  };

  useEffect(() => {
    let refs = [AttestationDTLFormRef];
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

  // attest.history
  const {
    data: historyData,
    isError: isHistoryDataError,
    isLoading: isHistoryDataLoading,
    error,
    refetch: historyDataRefetch,
  } = useQuery<any, any>(["getAttestHistory", state?.customerIDctx], () =>
    API.getAttestHistory({
      COMP_CD: authState?.companyID ?? "",
      // BRANCH_CD: authState?.user?.branchCode ?? "",
      CUSTOMER_ID: state?.customerIDctx,
    })
  );

  // get attest. form data
  const {
    data: attestData,
    isError: isAttestDataError,
    isLoading: isAttestDataLoading,
    error: attestDataError,
    refetch: attestDataRefetch,
  } = useQuery<any, any>(["getAttestData", state?.customerIDctx], () =>
    API.getAttestData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      CUSTOMER_ID: state?.customerIDctx,
      USER_NAME: authState?.user?.id ?? "",
    })
  );

  const docValidationMutation: any = useMutation(API.validateDocData, {
    onSuccess: (data) => {
      // console.log("qwiwuiefhqioweuhfd", data?.[0]?.MESSAGE)
      if (data?.[0]?.MESSAGE) {
        setDocValidateDialog(true);
        setErrMsg(data?.[0]?.MESSAGE);
      } else {
        onSave();
      }
    },
    onError: (error: any) => {
      setFormStatus((old) => [...old, false]);
    },
  });

  const mutation: any = useMutation(API.SaveEntry, {
    onSuccess: (data) => {
      // console.log("data on save", data)
      if (data?.[0]?.REQ_CD) {
        if (!Number.isNaN(data?.[0]?.REQ_CD)) {
          setReqCD(parseInt(data?.[0]?.REQ_CD));
          handleReqCDctx(parseInt(data?.[0]?.REQ_CD));
          setFormStatus((old) => [...old, true]);
          setSaveSuccessDialog(true);
        }
        // handleReqCDctx(data?.[0]?.REQ_CD)
        // handleColTabChangectx(state?.colTabValuectx+1)
      }
    },
    onError: (error: any) => {
      setFormStatus((old) => [...old, false]);
    },
  });

  const AttestationDTLSubmitHandler = (
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
      // formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
      formFieldsRef.current = [...formFields]; // array, added distinct all form-field names

      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
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
      };
      let newData = state?.formDatactx;
      newData["ATTESTATION_DTL"] = {
        ...newData["ATTESTATION_DTL"],
        ...data,
        ...commonData,
      };
      handleFormDataonSavectx(newData);

      // handleColTabChangectx(state?.colTabValuectx+1)
      handleStepStatusctx({
        status: "completed",
        coltabvalue: state?.colTabValuectx,
      });

      // handleColTabChangectx(7)

      // setIsNextLoading(false)
      if (!state?.isFreshEntryctx && !state?.isDraftSavedctx) {
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.ATTESTATION_DTL
          ? _.uniq([
              ...tabModifiedCols.ATTESTATION_DTL,
              ...formFieldsRef.current,
            ])
          : _.uniq([...formFieldsRef.current]);
        tabModifiedCols = {
          ...tabModifiedCols,
          ATTESTATION_DTL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
        // if() {
        //     setAlertOnUpdate
        // } else {

        // }
        // setUpdateDialog(true)
        // updateMutation.mutate()
      }
      // if(!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
      //     setFormStatus(old => [...old, true])
      // } else {
      if (state?.isFreshEntryctx || state?.isDraftSavedctx) {
        // console.log("acdsvq currentFormctx mutateeee...", state?.steps)
        // if(state?.req_cd_ctx) {}
        // /customerServiceAPI/VALIDATEDOCDATA
        let submittedDoc = state?.formDatactx["DOC_MST"]?.["doc_mst_payload"];
        if (Array.isArray(submittedDoc)) {
          submittedDoc = submittedDoc?.map((docRow) => {
            return docRow?.TEMPLATE_CD ?? "";
          });
          submittedDoc = submittedDoc.toString();
        }

        let docValidatePayload = {
          PAN_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PAN_NO ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.PAN_NO ?? "",
          UNIQUE_ID: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.UNIQUE_ID ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.UNIQUE_ID ?? "",
          ELECTION_CARD_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                ?.ELECTION_CARD_NO ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.ELECTION_CARD_NO ?? "",
          NREGA_JOB_CARD: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                ?.NREGA_JOB_CARD ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.NREGA_JOB_CARD ?? "",
          PASSPORT_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PASSPORT_NO ??
              ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.PASSPORT_NO ?? "",
          DRIVING_LICENSE_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                ?.DRIVING_LICENSE_NO ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.DRIVING_LICENSE_NO ?? "",
          TEMPLATE_CD: submittedDoc ?? "", //temp
          CUST_TYPE: state?.entityTypectx ?? "",
          // PAN_NO: "DWIPP9643D",
          // UNIQUE_ID: "123123123123",
          // ELECTION_CARD_NO: "",
          // NREGA_JOB_CARD: "",
          // PASSPORT_NO: "",
          // DRIVING_LICENSE_NO: "",
          // CUST_TYPE: state?.entityTypectx,
        };
        docValidationMutation.mutate(docValidatePayload);
      } else {
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
    // setIsNextLoading(false)
  };

  // const initialVal = useMemo(() => {
  //     return state?.isFreshEntryctx
  //             ? state?.formDatactx["ATTESTATION_DTL"]
  //                 ? state?.formDatactx["ATTESTATION_DTL"]
  //                 : {}
  //             : state?.retrieveFormDataApiRes
  //                 ? state?.retrieveFormDataApiRes["ATTESTATION_DTL"]
  //                 : {}
  // }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes])
  const initialVal = useMemo(() => {
    return state?.isFreshEntryctx
      ? attestData
        ? { ...state?.formDatactx["ATTESTATION_DTL"], ...attestData?.[0] }
        : state?.formDatactx["ATTESTATION_DTL"]
      : state?.retrieveFormDataApiRes
      ? attestData
        ? {
            ...state?.retrieveFormDataApiRes["ATTESTATION_DTL"],
            ...attestData?.[0],
          }
        : state?.retrieveFormDataApiRes["ATTESTATION_DTL"]
      : null;
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes, attestData]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [
      AttestationDTLFormRef.current.handleSubmitError(e, "save", false),
    ];
    handleSavectx(e, refs);
  };

  const onSave = () => {
    if (state?.isFreshEntryctx || state?.isDraftSavedctx) {
      let data = {
        CUSTOMER_ID: state?.customerIDctx,
        CUSTOMER_TYPE: state?.entityTypectx,
        CATEGORY_CD: state?.categoryValuectx,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        ACCT_TYPE: state?.accTypeValuectx,
        KYC_NUMBER: state?.kycNoValuectx,
        CONSTITUTION_TYPE: state?.constitutionValuectx,
        IsNewRow:
          state?.isFreshEntryctx || state?.isDraftSavedctx ? true : false,
        REQ_CD: state?.req_cd_ctx,
        formData: state?.formDatactx,
        isDraftSaved: state?.isDraftSavedctx,
        updated_tab_format: {},
      };
      if (state?.isDraftSavedctx) {
        let oldFormData = _.pick(
          state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {},
          state?.modifiedFormCols["PERSONAL_DETAIL"] ?? []
        );
        let newFormData = _.pick(
          state?.formDatactx["PERSONAL_DETAIL"] ?? {},
          state?.modifiedFormCols["PERSONAL_DETAIL"] ?? []
        );
        let upd = utilFunction.transformDetailsData(newFormData, oldFormData);
        let updated_tabs = Object.keys(state?.modifiedFormCols ?? {});
        // console.log("weuifhwiuefhupdated_tabs", updated_tabs, Array.isArray(updated_tabs), updated_tabs.includes("PERSONAL_DETAIL"), updated_tabs["PERSONAL_DETAIL"])
        if (
          Array.isArray(updated_tabs) &&
          updated_tabs.includes("PERSONAL_DETAIL")
        ) {
          let updated_tab_format: any = {};
          updated_tab_format["PERSONAL_DETAIL"] = {
            ...upd,
            ..._.pick(
              state?.formDatactx["PERSONAL_DETAIL"],
              upd._UPDATEDCOLUMNS
            ),
            // ...other_data
            // IsNewRow: (state?.req_cd_ctx && state?.isDraftSavedctx) ? true : false,
            IsNewRow:
              state?.req_cd_ctx && state?.isDraftSavedctx ? false : true,
            REQ_CD: state?.req_cd_ctx ?? "",
            COMP_CD: authState?.companyID ?? "",
          };
          data["updated_tab_format"] = updated_tab_format;
          // console.log("on final saveeee", updated_tab_format)
        }
      }
      mutation.mutate(data);
    }
  };

  // useEffect(() => {
  //     if(!isAttestDataLoading && attestData) {
  //         console.log("attst data..", attestData)
  //         let newData = state?.formDatactx
  //     }
  // }, [isAttestDataLoading, attestData])

  const retrieveonupdate: any = useMutation(API.getCustomerDetailsonEdit, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  return (
    <Grid
      container
      rowGap={3}
      // sx={{backgroundColor: "#eee"}}
    >
      {mutation.isError ? (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      ) : retrieveonupdate.isError ? (
        <Alert
          severity={retrieveonupdate.error?.severity ?? "error"}
          errorMsg={
            retrieveonupdate.error?.error_msg ?? "Something went to wrong.."
          }
          errorDetail={retrieveonupdate.error?.error_detail}
          color="error"
        />
      ) : docValidationMutation.isError ? (
        <Alert
          severity={docValidationMutation.error?.severity ?? "error"}
          errorMsg={
            docValidationMutation.error?.error_msg ??
            "Something went to wrong.."
          }
          errorDetail={docValidationMutation.error?.error_detail}
          color="error"
        />
      ) : null}
      {/* <Typography sx={{color:"var(--theme-color3)"}} variant={"h6"}>Attestation Details {`(8/8)`}</Typography> */}
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
          item
          container
          direction={"row"}
          style={{ justifyContent: "space-between" }}
        >
          <Typography
            sx={{ color: "var(--theme-color3)", pl: 2, pt: "6px" }}
            variant={"h6"}
          >
            {t("AttestationDetails")}
          </Typography>
          {/* <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>{t("AttestationDetails")}</Typography> */}
          {!state?.isFreshEntryctx && !state?.isDraftSavedctx && (
            <Button
              sx={{ mr: 2, mt: "6px" }}
              color="secondary"
              variant="contained"
              size="small"
              onClick={() => {
                // historyDataRefetch()
                if (!isHistoryDataLoading && historyData) {
                  // console.log("attst data..", historyData)
                  setHistoryDialog(true);
                }
              }}
            >
              History
            </Button>
          )}
        </Grid>
        <Grid container item>
          <Grid item xs={12}>
            <FormWrapper
              ref={AttestationDTLFormRef}
              onSubmitHandler={AttestationDTLSubmitHandler}
              // initialValues={state?.formDatactx["ATTESTATION_DTL"] ?? {}}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              key={"att-details-form-kyc" + initialVal}
              metaData={attestation_detail_meta_data as MetaDataType}
              formStyle={{}}
              hideHeader={true}
            />
          </Grid>
        </Grid>
      </Grid>
      {/* : null} */}
      {/* </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null} */}
      <TabNavigate
        handleSave={
          state?.formmodectx !== "new" && !state?.isDraftSavedctx
            ? onUpdateForm
            : handleSave
        }
        displayMode={state?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
      {historyDialog && (
        <AttestHistory
          open={historyDialog}
          onClose={onCloseSearchDialog}
          data={historyData}
          isLoading={isHistoryDataLoading}
        />
      )}

      {/* {updateDialog && <ConfirmUpdateDialog 
                open={updateDialog} 
                onClose={onCloseUpdateDialog} 
                mutationFormDTL={retrieveonupdate}
                // data={historyData} 
                // isLoading={!isUpdated} 
                // setIsLoading={setIsUpdated}
                // mt={updateMutation}
            />} */}

      {saveSuccessDialog && (
        <CustomerSaveDialog
          open={saveSuccessDialog}
          onClose={onCloseSaveSuccessDialog}
          onFormClose={onFormClose}
          // reqCD={reqCD}
          // data={historyData}
          // isLoading={!isUpdated}
          // setIsLoading={setIsUpdated}
          // mt={updateMutation}
        />
      )}

      {docValidateDialog && (
        <PopupRequestWrapper
          MessageTitle={"ALERT"}
          Message={errMsg}
          onClickButton={async (rows, buttonNames, ...others) => {
            // console.log(rows, "kjefeiwqf", buttonNames)
            if (buttonNames === "Yes") {
              setDocValidateDialog(false);
              onSave();
            } else if (buttonNames === "No") {
              setDocValidateDialog(false);
              setFormStatus((old) => [...old, false]);
            }
          }}
          buttonNames={["Yes", "No"]}
          rows={[]}
          // Commented Temporary
          // loading={{ Yes: mutation.isLoading }}
          // loading={{ Yes: getData?.isLoading, No: false }}
          open={docValidateDialog}
        />
      )}
    </Grid>
  );
};

const AttestHistory = ({ open, onClose, isLoading, data }) => {
  const setCurrentAction = useCallback((data) => {
    if (data.name === "close") {
      onClose();
    }
  }, []);
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{
        style: {
          minWidth: "70%",
          width: "80%",
        },
      }}
    >
      <GridWrapper
        key={`AttestHistoryGrid`}
        finalMetaData={attest_history_meta_data as GridMetaDataType}
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

export default AttestationDetails;
