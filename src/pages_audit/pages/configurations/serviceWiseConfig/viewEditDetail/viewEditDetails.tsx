import {
  FC,
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useQuery, useMutation } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Dialog from "@mui/material/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import { useLocation, useNavigate } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "./api";
import { ServiceWiseConfigMetadata } from "./metaData";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { FromSourceMetaData } from "./fromSourceMetaData";
import { AmountLabelsGridWrapper } from "../amountLabels";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { TranParticularsWrapper } from "../tranParticulers";
import { ObjectMappingKeys } from "components/utils";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";

const ServiceWiseConfigViewEdit: FC<{
  moduleType: any;
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: string;
  setEditFormStateFromInitValues?: any;
  readOnly?: boolean;
  tran_cd: string;
  rowsdata?: any;
}> = ({
  moduleType,
  isDataChangedRef,
  closeDialog,
  defaultView = "edit",
  readOnly = false,
  tran_cd,
  setEditFormStateFromInitValues,
  rowsdata,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  //const [tranParticulars, setTranParticulars] = useState<any>(null);
  const [isAmountLabelOpen, setAmountLabelOpen] = useState(false);
  const [isTranPerticulerDialog, setTranPerticulerDialog] = useState({
    open: false,
    buttonName: "",
    defaultMode: "edit",
  });
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const isSubmitEventRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const isDetailFormRef = useRef<any>(null);
  const isTranparticularRef = useRef<any>(null);

  const result = useQuery(["getServiceConfigFormData", tran_cd], () =>
    API.getServiceConfigFormData(tran_cd)
  );
  const saveMutation = useMutation(API.saveServiceWiseConfigReq, {
    onSuccess: (response: any, { setLocalLoader }) => {
      enqueueSnackbar(response, { variant: "success" });
      setLocalLoader(false);
      closeDialog();
    },
    onError: (error: any, { setLocalLoader }) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
      setLocalLoader(
        false,
        error?.error_msg ?? "error",
        error?.error_details ?? ""
      );
    },
    onSettled: () => {
      onActionCancel();
    },
  });

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    //endSubmit(true);
    isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
    isDetailFormRef.current?.handleSubmit(isSubmitEventRef.current, "save");
  };
  const onSubmitHandlerDTL: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    //endSubmit(true);
    //isErrorFuncRef.current?.endSubmit(true);
    let finalResponse = submitDataJson(isErrorFuncRef.current?.data, {
      ...data,
      ...isTranparticularRef.current,
    });
    const setLocalLoader = (
      isLoader = true,
      error_msg = "",
      error_details = ""
    ) => {
      endSubmit(!isLoader);
      isErrorFuncRef.current?.endSubmit(!isLoader, error_msg, error_details);
    };
    saveMutation.mutate({ responseData: finalResponse, setLocalLoader });
  };
  const submitDataJson = (mstData, dtlData) => {
    const detailDataFinacle: any = {};
    const detailDataAbabil: any = {};
    const detailDataTranzware: any = {};

    for (let key of Object.keys(dtlData)) {
      var lastStr = key.split("_").pop();
      if (lastStr === "0") {
        let keyData = key || "";
        detailDataFinacle[
          keyData.length > 2
            ? keyData.substring(0, keyData.length - 2)
            : keyData
        ] = dtlData[key];
      } else if (lastStr === "1") {
        let keyData = key || "";
        detailDataAbabil[
          keyData.length > 2
            ? keyData.substring(0, keyData.length - 2)
            : keyData
        ] = dtlData[key];
      } else if (lastStr === "2") {
        let keyData = key || "";
        detailDataTranzware[
          keyData.length > 2
            ? keyData.substring(0, keyData.length - 2)
            : keyData
        ] = dtlData[key];
      }
    }
    let startTime = "";
    if (mstData?.START_TIME) {
      startTime = format(new Date(mstData?.START_TIME), "dd-MMM-yyyy HH:mm:ss");
    }
    let endTime = "";
    if (mstData?.START_TIME) {
      endTime = format(new Date(mstData?.END_TIME), "dd-MMM-yyyy HH:mm:ss");
    }
    mstData["START_TIME"] = startTime;
    mstData["END_TIME"] = endTime;
    mstData["FINACLEDATA"] = detailDataFinacle;
    mstData["ABABILDATA"] = detailDataAbabil;
    mstData["TRANZWAREDATA"] = detailDataTranzware;
    return mstData;
  };
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getServiceConfigFormData", tran_cd]);
      queryClient.removeQueries(["getTranParticularKeys"]);
    };
  }, [moduleType, tran_cd]);

  const dataUniqueKey = `${result.dataUpdatedAt}`;
  const loading = result.isLoading || result.isFetching;
  let isError = result.isError;
  //@ts-ignore
  let errorMsg = `${result.error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";

  let formEditData = [];
  if (
    result.isSuccess &&
    Array.isArray(result.data) &&
    result.data.length > 0
  ) {
    formEditData = Object.assign({}, result.data[0]);
  }
  let formDTLEditData = [];
  if (
    result.isSuccess &&
    Array.isArray(result.data) &&
    result.data.length > 0
  ) {
    formDTLEditData = Object.assign({}, result.data?.[0]?.SERVICE_DTL?.[0]);
  }
  useEffect(() => {
    isTranparticularRef.current = ObjectMappingKeys(
      formDTLEditData,
      "TRN_PERTICULERS_0",
      "TRN_PERTICULERS2_0",
      "ABABIL_TRN_PERTICULERS_0",
      "ABABIL_TRN_PERTICULERS2_0",
      "TRANZWARE_TRN_PERTICULERS_0",
      "TRANZWARE_TRN_PERTICULERS2_0",
      "TRN_PERTICULERS_1",
      "TRN_PERTICULERS2_1",
      "ABABIL_TRN_PERTICULERS_1",
      "ABABIL_TRN_PERTICULERS2_1",
      "TRANZWARE_TRN_PERTICULERS_1",
      "TRANZWARE_TRN_PERTICULERS2_1",
      "TRN_PERTICULERS_2",
      "TRN_PERTICULERS2_2",
      "ABABIL_TRN_PERTICULERS_2",
      "ABABIL_TRN_PERTICULERS2_2",
      "TRANZWARE_TRN_PERTICULERS_2",
      "TRANZWARE_TRN_PERTICULERS2_2"
    );
  }, [result.data]);

  let viewEditMetaData: MetaDataType = {} as MetaDataType;
  let viewEditDTLMetaData: MetaDataType = {} as MetaDataType;

  if (result.isSuccess) {
    const formStateFromInitValues =
      typeof setEditFormStateFromInitValues === "function"
        ? setEditFormStateFromInitValues(result.data[0])
        : undefined;
    viewEditMetaData = cloneDeep(ServiceWiseConfigMetadata) as MetaDataType;

    viewEditMetaData.form.formState = {
      formCode: viewEditMetaData.form.name,
      ...formStateFromInitValues,
    };
    viewEditMetaData.form.name = `${viewEditMetaData.form.name}-edit`;
    if (viewEditMetaData?.form?.render?.renderType === "stepper") {
      viewEditMetaData.form.render.renderType = "tabs";
    }
  }

  const confirmMutation = useMutation(API.confirmServiceWiseConfigReq, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      closeDialog();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
      onActionCancel();
    },
    onSettled: () => {
      onActionCancel();
    },
  });
  const onAcceptPopupYes = (rows) => {
    confirmMutation.mutate({
      confirmed: "Y",
      trancd: rows?.TRAN_CD ?? "",
    });
  };
  const onRejectPopupYes = (rows) => {
    confirmMutation.mutate({
      confirmed: "R",
      trancd: rows?.TRAN_CD ?? "",
    });
  };
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
  };
  const ClosedEventCall = useCallback(() => {
    setAmountLabelOpen(false);
    setTranPerticulerDialog({ open: false, buttonName: "", defaultMode: "" });
  }, [navigate]);
  const onFormButtonClickHandel = (id) => {
    setTranPerticulerDialog({
      open: true,
      buttonName: id,
      defaultMode: "edit",
    });
  };
  const onConfirmFormButtonClickHandel = (id) => {
    setTranPerticulerDialog({
      open: true,
      buttonName: id,
      defaultMode: "view",
    });
  };
  const onSaveTranParticulars = (tranParticulars) => {
    console.log(
      isTranPerticulerDialog,
      tranParticulars,
      isTranPerticulerDialog.buttonName === "TRAN_PARTICULARS_BTN_0"
    );
    if (isTranPerticulerDialog.buttonName === "TRAN_PARTICULARS_BTN_0") {
      isTranparticularRef.current = {
        ...isTranparticularRef.current,
        TRN_PERTICULERS_0: tranParticulars?.finacle1,
        TRN_PERTICULERS2_0: tranParticulars?.finacle2,
        ABABIL_TRN_PERTICULERS_0: tranParticulars?.ababil1,
        ABABIL_TRN_PERTICULERS2_0: tranParticulars?.ababil2,
        TRANZWARE_TRN_PERTICULERS_0: tranParticulars?.tranzware1,
        TRANZWARE_TRN_PERTICULERS2_0: tranParticulars?.tranzware1,
      };
      // setTranParticulars((values) => ({
      //   ...values,
      //   TRN_PERTICULERS_0: tranParticulars?.finacle1,
      //   TRN_PERTICULERS2_0: tranParticulars?.finacle2,
      //   ABABIL_TRN_PERTICULERS_0: tranParticulars?.ababil1,
      //   ABABIL_TRN_PERTICULERS2_0: tranParticulars?.ababil2,
      //   TRANZWARE_TRN_PERTICULERS_0: tranParticulars?.tranzware1,
      //   TRANZWARE_TRN_PERTICULERS2_0: tranParticulars?.tranzware1,
      // }));
    } else if (isTranPerticulerDialog.buttonName === "TRAN_PARTICULARS_BTN_1") {
      isTranparticularRef.current = {
        ...isTranparticularRef.current,
        TRN_PERTICULERS_1: tranParticulars?.finacle1,
        TRN_PERTICULERS2_1: tranParticulars?.finacle2,
        ABABIL_TRN_PERTICULERS_1: tranParticulars?.ababil1,
        ABABIL_TRN_PERTICULERS2_1: tranParticulars?.ababil2,
        TRANZWARE_TRN_PERTICULERS_1: tranParticulars?.tranzware1,
        TRANZWARE_TRN_PERTICULERS2_1: tranParticulars?.tranzware1,
      };
    } else if (isTranPerticulerDialog.buttonName === "TRAN_PARTICULARS_BTN_2") {
      isTranparticularRef.current = {
        ...isTranparticularRef.current,
        TRN_PERTICULERS_2: tranParticulars?.finacle1,
        TRN_PERTICULERS2_2: tranParticulars?.finacle2,
        ABABIL_TRN_PERTICULERS_2: tranParticulars?.ababil1,
        ABABIL_TRN_PERTICULERS2_2: tranParticulars?.ababil2,
        TRANZWARE_TRN_PERTICULERS_2: tranParticulars?.tranzware1,
        TRANZWARE_TRN_PERTICULERS2_2: tranParticulars?.tranzware1,
      };
    }
    ClosedEventCall();
  };
  const renderResult = loading ? (
    <>
      <LoaderPaperComponent />
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : isError === true ? (
    <>
      <span>{errorMsg}</span>
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : defaultView === "confirm" ? (
    <>
      <FormWrapper
        key={`${dataUniqueKey}-${defaultView}`}
        metaData={viewEditMetaData as MetaDataType}
        initialValues={formEditData as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={"view"}
        formStyle={{
          background: "white",
          height: "calc(43vh - 48px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Button
          onClick={() => {
            setIsOpenAccept(true);
          }}
          color={"primary"}
        >
          Accept
        </Button>
        <Button
          onClick={() => {
            setIsOpenReject(true);
          }}
          color={"primary"}
        >
          Revert
        </Button>
        {typeof closeDialog === "function" ? (
          <Button onClick={closeDialog} color={"primary"}>
            Close
          </Button>
        ) : null}
      </FormWrapper>
      <FormWrapper
        //@ts-ignore
        metaData={FromSourceMetaData as MetaDataType}
        initialValues={formDTLEditData as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        controlsAtBottom={true}
        formStyle={{
          background: "white",
          height: "calc(43vh - 48px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        hideHeader={true}
        displayMode={"view"}
        onFormButtonClickHandel={onConfirmFormButtonClickHandel}
      ></FormWrapper>
      {isOpenAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to accept this Request?"
          onActionYes={(rowVal) => onAcceptPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={formEditData}
          open={isOpenAccept}
          loading={result.isLoading}
        />
      ) : null}
      {isOpenReject ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to revert this request?"
          onActionYes={(rowVal) => onRejectPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={formEditData}
          open={isOpenReject}
          loading={result.isLoading}
        />
      ) : null}
      {isTranPerticulerDialog.open ? (
        <TranParticularsWrapper
          open={isTranPerticulerDialog.open}
          handleDialogClose={ClosedEventCall}
          isDataChangedRef={isDataChangedRef}
          onSaveData={onSaveTranParticulars}
          description={result?.data?.[0]?.TRN_TYPE ?? ""}
          rowsdata={isTranparticularRef.current}
          buttonName={isTranPerticulerDialog.buttonName}
          defaultMode={isTranPerticulerDialog.defaultMode}
        />
      ) : null}
    </>
  ) : defaultView === "edit" ? (
    <>
      <FormWrapper
        key={`${dataUniqueKey}-${defaultView}`}
        metaData={viewEditMetaData as MetaDataType}
        initialValues={formEditData as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        // displayMode={formMode}
        formStyle={{
          background: "white",
          height: "calc(43vh - 48px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                setAmountLabelOpen(true);
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Amount Label
            </Button>
            <Button
              onClick={(event) => {
                isSubmitEventRef.current = event;
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </Button>
            <Button
              onClick={closeDialog}
              color={"primary"}
              disabled={isSubmitting}
            >
              Close
            </Button>
            {/* <Button
            onClick={moveToViewMode}
            disabled={isSubmitting}
																		  
            color={"primary"}
          >
            Cancel
          </Button> */}
          </>
        )}
      </FormWrapper>
      <FormWrapper
        //@ts-ignore
        metaData={FromSourceMetaData as MetaDataType}
        initialValues={formDTLEditData as InitialValuesType}
        onSubmitHandler={onSubmitHandlerDTL}
        controlsAtBottom={true}
        formStyle={{
          background: "white",
          height: "calc(43vh - 48px)",
          overflowY: "auto",
          overflowX: "hidden",
          // padding: "24px",
        }}
        hideHeader={true}
        ref={isDetailFormRef}
        onFormButtonClickHandel={onFormButtonClickHandel}
      >
        {/* {({ isSubmitting, handleSubmit }) => {
          return (
            <>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                Submit
              </Button>
            </>
          );
        }} */}
      </FormWrapper>
      {isAmountLabelOpen ? (
        <AmountLabelsGridWrapper
          open={isAmountLabelOpen}
          closeDialog={() => {
            ClosedEventCall();
          }}
          rowData={rowsdata}
        />
      ) : null}
      {isTranPerticulerDialog.open ? (
        <TranParticularsWrapper
          open={isTranPerticulerDialog.open}
          handleDialogClose={ClosedEventCall}
          isDataChangedRef={isDataChangedRef}
          onSaveData={onSaveTranParticulars}
          description={result?.data?.[0]?.TRN_TYPE ?? ""}
          rowsdata={isTranparticularRef.current}
          buttonName={isTranPerticulerDialog.buttonName}
          defaultMode={isTranPerticulerDialog.defaultMode}
        />
      ) : null}
    </>
  ) : null;
  return renderResult;
};

export const ServiceConfigEditViewWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  moduleType,
  defaultView = "edit",
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      // entries.forEach((one) => {
      //   queryClient.removeQueries(one);
      // });
    };
  }, [getEntries]);

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            minHeight: "80vh",
            height: "100vh",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <ServiceWiseConfigViewEdit
          tran_cd={rows[0]?.data.TRAN_CD + ""}
          moduleType={moduleType}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          readOnly={false}
          rowsdata={rows}
          defaultView={defaultView}
        />
      </Dialog>
    </>
  );
};
