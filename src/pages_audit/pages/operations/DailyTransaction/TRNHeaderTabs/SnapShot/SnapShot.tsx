import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Mutation, useMutation, useQuery } from "react-query";
import { snapShotGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { useSnackbar } from "notistack";
import { Button, Grid, Typography } from "@mui/material";
//date
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { format } from "date-fns";
import { DateRetrievalDialog } from "components/custom/dateRetrievalPara";
import { useStyles } from "pages_audit/style";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "Back Date",
    multiple: false,
    // rowDoubleClick: true,
    alwaysAvailable: true,
  },
];
export const SnapShot = ({ reqData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [dateDialog, setDateDialog] = useState(false);
  const [prevDate, setPrevDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(new Date());
  const [dataRow, setDataRow] = useState<any>({});
  const [credit, setCredit] = useState<any>(0);
  const [debit, setDebit] = useState<any>(0);

  // api define
  const getSnapShotList = useMutation(API.getSnapShotList, {
    onSuccess: (data) => {
      console.log(data, " getSnapShotList detailssss");
      let debSum = 0;
      let credSum = 0;

      data?.map((a, i) => {
        debSum = debSum + Number(a?.debit1);
        credSum = credSum + Number(a?.credit1);
      });

      console.log(credSum, debSum, "aaa");
      setCredit(credSum?.toFixed(2));
      setDebit(debSum?.toFixed(2));
      setRows(data);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  console.log(rows, "rows");
  const handleGetSnapshot = (prevDate, nextDate) => {
    let obj = reqData;
    obj.FROM_DATE = prevDate;
    obj.TO_DATE = nextDate;
    getSnapShotList.mutate(obj);
  };

  useEffect(() => {
    reqData?.ACCT_CD && handleGetSnapshot("", "");
    setCredit("0.00");
    setDebit("0.00");
  }, [reqData]);

  // const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
  //   any,
  //   any
  // >(["getSnapShotList"], () => API.getSnapShotList(reqData));

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    setDataRow(row);

    if (data.name === "view-detail") {
      console.log("heloooo");
      setDateDialog(true);
    }
  }, []);

  const classes = useStyles();
  const retrievalParaValues = (retrievalValues) => {
    setDateDialog(false);
    setCredit("0.00");
    setDebit("0.00");
    console.log(retrievalValues, "retrievalValues");
    handleGetSnapshot(
      retrievalValues[0]?.value?.value,
      retrievalValues[1]?.value?.value
    );
  };
  return (
    <>
      {getSnapShotList.isError ? (
        <Alert
          severity="error"
          errorMsg={getSnapShotList.error?.error_msg ?? "Unknown error occured"}
          errorDetail={getSnapShotList.error?.error_detail ?? ""}
        />
      ) : null}

      <GridWrapper
        key={`snapShotGridMetaData`}
        finalMetaData={snapShotGridMetaData as GridMetaDataType}
        data={rows ?? []}
        setData={() => null}
        loading={getSnapShotList?.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
        onlySingleSelectionAllow={false}
        isNewRowStyle={true}
        ReportExportButton={true}
      />
      <Grid
        item
        xs={12}
        sm={12}
        sx={{
          position: "relative",
          top: "-3rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div></div>
        <div></div>

        <Grid item sx={{ display: "flex", gap: "5rem" }}>
          <div> Credit : ₹ {credit} </div>
          <div>Debit : ₹ {debit}</div>
        </Grid>
      </Grid>

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
    </>
  );
};
