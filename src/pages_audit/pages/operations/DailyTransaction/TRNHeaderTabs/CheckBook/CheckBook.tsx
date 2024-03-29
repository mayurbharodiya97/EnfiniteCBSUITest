import { Fragment, useEffect, useRef, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { JointDetailIssueEntry } from "./metaData";
import { CheckBookGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { Button, Grid, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export const CheckBook = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const myGridRef = useRef<any>(null);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [sumAmt, setSumAmt] = useState(0);
  const [sumChqNo, setSumChqNo] = useState(0);

  const getCheckDetailsList = useMutation(API.getCheckDetailsList, {
    onSuccess: (data) => {
      let sum = 0;
      let sum2 = 0;
      data &&
        data?.map((a) => {
          if (Number(a.AMOUNT)) {
            sum = sum + Number(a.AMOUNT);
          }
          if (Number(a.CHEQUE_TOTAL)) {
            sum2 = sum2 + Number(a.CHEQUE_TOTAL);
          }
        });
      setSumAmt(sum);
      setSumChqNo(sum2);
      setRows(data);
    },
    onError: (error) => {},
  });
  // const getCheckDetailsList = useMutation(API.getCheckDetailsList, {
  //   onSuccess: (data) => {
  //     console.log(data, " check detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD &&
  //     getCheckDetailsList.mutate(tempStore.accInfo);
  // }, [tempStore]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getCheckDetailsList", { reqData }], () =>
    API.getCheckDetailsList(reqData)
  );
  console.log(data, "data!");

  const getTodayClearing = useMutation(API.getTodayClearing, {
    onSuccess: (data) => {
      const obj = [...rows];
      setRows(obj);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const getReturnHistory = useMutation(API.getReturnHistory, {
    onSuccess: (data) => {
      const obj = [...rows];
      setRows(obj);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  const handleTodayClearing = () => {
    getTodayClearing.mutate(tempStore?.accInfo);
  };
  const handleReturnHistory = () => {
    let obj = { ...tempStore?.accInfo, authState };
    getReturnHistory.mutate(obj);
  };
  return (
    <>
      {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <GridWrapper
        key={`CheckBookGridMetaData`}
        finalMetaData={CheckBookGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        refetchData={() => {}}
        ref={myGridRef}
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
        <Grid item sx={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleTodayClearing()}
          >
            Today Clearing
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleReturnHistory()}
          >
            CHQ Return History
          </Button>
        </Grid>
        <Grid item sx={{ display: "flex", gap: "1rem" }}>
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            Toatal Charge: ₹ {sumAmt}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            Total Chq No: {sumChqNo}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
