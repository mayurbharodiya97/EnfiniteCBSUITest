import { Dialog, DialogActions } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import {
  scrollRegisterGridMetaData,
  snapShotGridMetaData,
} from "./gridMetadata";
import {
  ActionTypes,
  Alert,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
  LoaderPaperComponent,
  usePopupContext,
} from "@acuteinfo/common-base";
import { DateRetrievalDialog } from "components/common/custom/dateRetrievalPara";
import i18n from "components/multiLanguage/languagesConfiguration";
import { format } from "date-fns";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { getInwardChequeSignFormData } from "pages_audit/pages/operations/inwardClearing/api";
import { ChequeSignImage } from "pages_audit/pages/operations/inwardClearing/inwardClearingForm/chequeSignImage";
import { useStyles } from "pages_audit/style";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
  {
    actionName: "back-date",
    actionLabel: "BackDate",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
const scrollActions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const SnapShot = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [dateDialog, setDateDialog] = useState(false);
  const [isopenChequeImg, setOpenChequeImg] = useState(false);
  const reqDataRef = useRef<any>();
  const [imgData, setImgData] = useState();
  const [isopenReport, setIsopenReport] = useState(false);
  const [scrollRegisterData, setScrollRegisterData] = useState([]);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getSnapShotList", { reqData }], () =>
    API.getSnapShotList({
      A_COMP_CD: reqData?.COMP_CD ?? "",
      A_BRANCH_CD: reqData?.BRANCH_CD ?? "",
      A_ACCT_TYPE: reqData?.ACCT_TYPE ?? "",
      A_FROM_ACCT: reqData?.ACCT_CD ?? "",
      A_FR_DT: reqData?.FROM_DATE
        ? reqData?.FROM_DATE
        : format(oneMonthAgo, "dd-MMM-yyyy"),
      A_TO_DT: reqData?.TO_DATE
        ? reqData?.TO_DATE
        : format(new Date(), "dd-MMM-yyyy"),
      A_BASE_BRANCH: authState?.user?.baseBranchCode ?? "",
      A_USER_NM: authState?.user?.id ?? "",
      A_GD_DATE: authState?.workingDate ?? "",
      A_USER_LEVEL: authState?.role ?? "",
      A_SCREEN_REF: reqData?.SCREEN_REF ?? "",
      A_LANG: i18n.resolvedLanguage,
    })
  );
  const getDailyScrollRegister = useMutation(API.getDailyScrollRegister, {
    onSuccess: async (data: any, variables: any) => {
      setScrollRegisterData(data);
    },
    onError: (error: any, variables: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  });

  const getChequeImg: any = useMutation(getInwardChequeSignFormData, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      setImgData(data);
    },
  });

  const setCurrentAction = useCallback((data) => {
    let row = data?.rows?.[0]?.data;
    if (data?.name === "back-date") {
      setDateDialog(true);
    } else if (data?.name === "view-detail") {
      if (row?.SCROLL1 > 0) {
        setIsopenReport(true);
        scrollRegisterGridMetaData.gridConfig.gridLabel = `Scroll Register of ${row?.SCROLL1}`;
        getDailyScrollRegister.mutate({
          COMP_CD: reqData?.COMP_CD ?? "",
          BRANCH_CD: reqData?.BRANCH_CD ?? "",
          TO_DT: row?.TRN_DATE
            ? format(new Date(row?.TRN_DATE), "dd/MMM/yyyy")
            : "",
          SCROLL1: row?.SCROLL1 ?? "",
          AS_FLAG: row?.TYPE_CD ?? "",
        });
      }
    }
  }, []);
  const setScrollActions = useCallback((data) => {
    if (data?.name === "close") {
      setIsopenReport(false);
      setScrollRegisterData([]);
    }
  }, []);

  const classes = useStyles();
  const retrievalParaValues = (retrievalValues) => {
    setDateDialog(false);
    reqData.FROM_DATE = retrievalValues?.[0]?.value?.value ?? "";
    reqData.TO_DATE = retrievalValues?.[1]?.value?.value ?? "";
  };
  return (
    <>
      {isError || getChequeImg?.error ? (
        <Alert
          severity="error"
          errorMsg={
            error?.error_msg ||
            getChequeImg?.error?.error_msg ||
            "Unknown error occured"
          }
          errorDetail={
            error?.error_detail || getChequeImg?.error?.error_detail || ""
          }
        />
      ) : null}

      <GridWrapper
        key={`snapShotGridMetaData`}
        finalMetaData={snapShotGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        refetchData={() => refetch()}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
        disableMultipleRowSelect={false}
        variant={"standard"}
        enableExport={true}
        onClickActionEvent={(index, id, currentData) => {
          if (id === "CHEQUE_IMG") {
            setOpenChequeImg(true);
            reqDataRef.current = currentData;
            getChequeImg.mutate({
              ENTERED_COMP_CD: reqDataRef?.current?.ENTERED_COMP_CD ?? "",
              COMP_CD: reqData?.COMP_CD ?? "",
              BRANCH_CD: reqData?.BRANCH_CD ?? "",
              ACCT_TYPE: reqData?.ACCT_TYPE ?? "",
              ACCT_CD: reqData?.ACCT_CD ?? "",
              DAILY_TRN_CD: "",
              TRAN_CD: reqDataRef?.current?.REF_TRAN_CD ?? "",
              TRAN_DT: reqDataRef?.current?.TRAN_DT
                ? format(new Date(reqDataRef?.current?.TRAN_DT), "dd/MMM/yyyy")
                : "",
              TRAN_FLAG: "E",
              WITH_SIGN: "N",
              ENTERED_BY: "",
            });
          }
        }}
      />

      {dateDialog && (
        <DateRetrievalDialog
          classes={classes}
          open={dateDialog}
          handleClose={() => setDateDialog(false)}
          loginState={{}}
          retrievalParaValues={retrievalParaValues}
          defaultData={undefined}
        />
      )}
      {isopenReport && (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="md"
        >
          <GridWrapper
            key={`scrollRegisterGridMetaData`}
            finalMetaData={scrollRegisterGridMetaData as GridMetaDataType}
            data={scrollRegisterData ?? []}
            setData={() => null}
            loading={getDailyScrollRegister?.isLoading}
            refetchData={() => refetch()}
            actions={scrollActions}
            setAction={setScrollActions}
            enableExport={true}
          />
        </Dialog>
      )}
      {isopenChequeImg ? (
        <>
          <Dialog
            open={isopenChequeImg}
            PaperProps={{
              style: {
                width: "100%",
              },
            }}
            maxWidth="md"
          >
            {getChequeImg?.isLoading ? (
              <LoaderPaperComponent />
            ) : (
              <>
                <DialogActions>
                  <GradientButton onClick={() => setOpenChequeImg(false)}>
                    {t("Close")}
                  </GradientButton>
                </DialogActions>
                <ChequeSignImage imgData={imgData} />
              </>
            )}
          </Dialog>
        </>
      ) : null}
    </>
  );
};
