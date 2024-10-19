import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { snapShotGridMetaData } from "./gridMetadata";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { Dialog, DialogActions, Grid } from "@mui/material";
//date
import { useStyles } from "pages_audit/style";
import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  GradientButton,
  LoaderPaperComponent,
} from "@acuteinfo/common-base";
import { DateRetrievalDialog } from "components/common/custom/dateRetrievalPara";
import { format } from "date-fns";
import { ChequeSignImage } from "pages_audit/pages/operations/inwardClearing/inwardClearingForm/chequeSignImage";
import { getInwardChequeSignFormData } from "pages_audit/pages/operations/inwardClearing/api";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
  {
    actionName: "back-date",
    actionLabel: "Back Date",
    multiple: false,
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

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getSnapShotList", { reqData }], () => API.getSnapShotList(reqData));

  const getChequeImg: any = useMutation(getInwardChequeSignFormData, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      setImgData(data);
    },
  });

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    if (data.name === "back-date") {
      setDateDialog(true);
    } else if (data.name === "view-detail") {
      setIsopenReport(true);
    }
  }, []);

  const classes = useStyles();
  const retrievalParaValues = (retrievalValues) => {
    setDateDialog(false);
    reqData.FROM_DATE = retrievalValues[0]?.value?.value;
    reqData.TO_DATE = retrievalValues[1]?.value?.value;
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
                    Close
                  </GradientButton>
                </DialogActions>
                <ChequeSignImage imgData={imgData} isVisibleSign={false} />
              </>
            )}
          </Dialog>
        </>
      ) : null}
    </>
  );
};
