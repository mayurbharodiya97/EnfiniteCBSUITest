import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { queryClient, ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import {
  Theme,
  Dialog,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  Typography,
  LinearProgress,
} from "@mui/material";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import {
  AddNewBenfiDetailFormMetadata,
  AddNewBenfiDetailGridMetadata,
} from "./metaData";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTable";
import { GradientButton } from "components/styledComponent/button";
import { Alert } from "components/common/alert";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { usePopupContext } from "components/custom/popupContext";
import { utilFunction } from "components/utils";
import { useCacheWithMutation } from "../DailyTransaction/TRNHeaderTabs/cacheMutate";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

export const AddNewBeneficiaryDetail: FC<{
  isOpen?: any;
  onClose?: any;
  isBenAuditTrailData?: any;
}> = ({ isOpen, onClose, isBenAuditTrailData }) => {
  const headerClasses = useTypeStyles();
  const isErrorFuncRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const previousRowData = useRef(null);
  const { MessageBox } = usePopupContext();
  const controllerRef = useRef<AbortController>();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getRtgsBenfDtlList"], () =>
    API.getRtgsBenfDtlList({
      COMP_CD: authState?.companyID,
      BRANCH_CD:
        isBenAuditTrailData?.BRANCH_CD ?? authState?.user?.branchCode ?? "",
      ACCT_TYPE: isBenAuditTrailData?.ACCT_TYPE ?? "",
      ACCT_CD:
        isBenAuditTrailData?.ACCT_CD.padStart(6, "0")?.padEnd(20, " ") ?? "",
      FLAG: "D",
    })
  );

  // const {
  //   clearCache: clearIfscBenAcCache,
  //   error: IfscBenAcErorr,
  //   data: IfscBenAcDetails,
  //   fetchData: fetchIfscBenAcData,
  //   isError: isIfscBenAcError,
  //   isLoading: isIfscBenAcLoading,
  // } = useCacheWithMutation("getIfscBenAcDetail", API.getIfscBenDetail);

  const getIfscBenAcDetail: any = useMutation(API.getIfscBenDetail, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },

    onSuccess: (data) => {
      if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Alert",
          message: data?.[0]?.O_MESSAGE,
        });
      }
    },
  });

  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries(["clearingBankMasterConfigDML"]);
  //   };
  // }, []);
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "_rowChanged") {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      const rowsData = data?.rows?.[0]?.data;
      console.log("rowsData", data, rowsData);
      if (
        Boolean(rowsData) &&
        JSON.stringify(rowsData) !== JSON.stringify(previousRowData?.current)
      ) {
        previousRowData.current = rowsData;
        // fetchIfscBenAcData({
        //   cacheId: rowsData?.TO_IFSCCODE,
        //   reqData: {
        //     IFSC_CODE: rowsData?.TO_IFSCCODE,
        //     ENTRY_TYPE: isBenAuditTrailData?.ENTRY_TYPE,
        //   },
        //   controllerFinal: controllerRef.current,
        // });
        getIfscBenAcDetail.mutate({
          IFSC_CODE: rowsData?.TO_IFSCCODE,
          ENTRY_TYPE: isBenAuditTrailData?.ENTRY_TYPE,
          // ,
        });
      }
    }
  }, []);
  // console.log("IfscBenAcDetails", IfscBenAcDetails);
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);
    data["EXCLUDE"] = Boolean(data["EXCLUDE"]) ? "Y" : "N";
    data["CTS"] = Boolean(data["CTS"]) ? "Y" : "N";

    isErrorFuncRef.current = {
      data: {
        ...data,
        _isNewRow: true,
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
      },
      displayData,
      endSubmit,
      setFieldError,
    };
    // mutation.mutate(isErrorFuncRef?.current?.data);
  };

  return (
    <>
      <Dialog
        key="ClearingBankMasterDialog"
        open={true}
        maxWidth="md"
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "5px" }}
        >
          <Toolbar className={headerClasses.root} variant={"dense"}>
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              List Of Beneficiary A/c of Ordering
            </Typography>
            <>
              <GradientButton
                onClick={onClose}
                color={"primary"}
                // disabled={isSubmitting}
              >
                Close
              </GradientButton>
            </>
          </Toolbar>
        </AppBar>
        <GridWrapper
          key={`AddNewBenfiDetailGrid${isLoading}`}
          finalMetaData={AddNewBenfiDetailGridMetadata as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          // ReportExportButton={true}
          actions={[]}
          setAction={setCurrentAction}
          loading={isLoading || isFetching}
          onlySingleSelectionAllow={true}
          refetchData={() => refetch()}
          isNewRowStyle={true}
          // defaultSelectedRowId={data?.length > 0 ? data?.[0]?.SR_NO : ""}
        />
        {getIfscBenAcDetail?.isError ? (
          // {isIfscBenAcError ? (
          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={getIfscBenAcDetail?.error_msg ?? "Unknow Error"}
                errorDetail={getIfscBenAcDetail?.error_detail ?? ""}
                // errorMsg={(IfscBenAcErorr as any)?.error_msg ?? "Unknow Error"}
                // errorDetail={(IfscBenAcErorr as any)?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        ) : getIfscBenAcDetail.isLoading ? (
          // ) : isIfscBenAcLoading ? (
          <LinearProgress color="secondary" />
        ) : (
          <LinearProgressBarSpacer />
        )}
        <FormWrapper
          key={`AddNewBenfiDetailForm${getIfscBenAcDetail?.isLoading}`}
          metaData={AddNewBenfiDetailFormMetadata as MetaDataType}
          // displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={getIfscBenAcDetail?.data?.[0]}
          hideHeader={true}
          formStyle={{
            background: "white",
          }}
        />
      </Dialog>
    </>
  );
};
