import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Transition } from "pages_audit/common";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { useContext, useEffect, useRef, useState } from "react";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "../api";
import { ClearCacheContext, queryClient } from "cache";
import { useSnackbar } from "notistack";
import { CreateDetailsRequestData, utilFunction } from "components/utils";
import { FromSourceConfigSubDtlGridMetaData } from "./metadata";
export const useDialogStyles = makeStyles({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
});
export const FromSourceConfigSubDetailGrid = ({
  isOpen,
  formMode,
  onClose,
  reqDataRef,
}) => {
  const classes = useDialogStyles();
  const [girdData, setGridData] = useState<any>([]);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFromSourceConfigSubDtlGridData", { ...reqDataRef.current }], () =>
    API.getFromSourceConfigSubDtlGridData({ ...reqDataRef.current })
  );
  const mutation = useMutation(API.updateFromSourceConfigSubDetailData, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      onClose();
    },
  });
  useEffect(() => {
    return () => {
      // let entries = getEntries() as any[];
      // entries.forEach((one) => {
      //   queryClient.removeQueries(one);
      // });
      queryClient.removeQueries([
        "getFromSourceConfigSubDtlGridData",
        { ...reqDataRef.current },
      ]);
    };
  }, [getEntries]);
  console.log(">>reqDataRef", reqDataRef);
  useEffect(() => {
    if (Array.isArray(data)) {
      setGridData(data);
    } else {
      setGridData([]);
    }
  }, [data]);
  const AddNewRow = async () => {
    let { hasError, data: dataold } = await myGridRef.current?.validate();
    if (hasError === true) {
      if (dataold) {
        setGridData(dataold);
      }
    } else {
      let TotalRowData = girdData.reduce((accu, item) => {
        if (Boolean(item._hidden)) {
          return accu;
        }
        return accu + 1;
      }, 0);
      // if (TotalRowData >= 6) {
      //   enqueueSnackbar("Up to six rows are allowed to be added.", {
      //     variant: "warning",
      //   });
      // } else {
      setGridData((old) => {
        if (!Array.isArray(old)) {
          return [
            {
              ...reqDataRef.current,
              DB_COLUMN: reqDataRef.current?.DB_COLUMN,
              DESCRIPTION: reqDataRef.current?.DESCRIPTION,
              DB_VALUE: "",
              id: 1,
              LINE_ID: 1,
              _isNewRow: true,
            },
          ];
        } else {
          let lineID = utilFunction.GetMaxCdForDetails(old, "LINE_ID");
          const myNewRowObj = {
            ...reqDataRef.current,
            DB_COLUMN: reqDataRef.current?.DB_COLUMN,
            DESCRIPTION: reqDataRef.current?.DESCRIPTION,
            DB_VALUE: "",
            id: lineID,
            LINE_ID: String(lineID),
            _isNewRow: true,
          };
          return [...old, myNewRowObj];
        }
      });
      // }
    }
  };
  const onSaveRecord = async () => {
    let { hasError, data: dataold } = await myGridRef.current?.validate();
    if (hasError === true) {
      if (dataold) {
        setGridData(dataold);
      }
    } else {
      let result = myGridRef?.current?.cleanData?.();
      if (!Array.isArray(result)) {
        result = [result];
      }
      let finalResult = result.filter(
        (one) => !(Boolean(one?._hidden) && Boolean(one?._isNewRow))
      );
      if (finalResult.length === 0) {
        onClose();
      } else {
        finalResult = CreateDetailsRequestData(finalResult);
        if (
          finalResult?.isDeleteRow?.length === 0 &&
          finalResult?.isNewRow?.length === 0 &&
          finalResult?.isUpdatedRow?.length === 0
        ) {
          onClose();
        } else {
          let reqData = {
            _isNewRow: false,
            _UPDATEDCOLUMNS: [],
            _OLDROWVALUE: {},
            ...reqDataRef.current,
            DETAILS_DATA: finalResult,
          };
          mutation.mutate({ data: reqData });
        }
      }
    }
  };
  return (
    <Dialog
      open={isOpen}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "50%",
        },
      }}
      maxWidth="md"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "10px" }}>
        {isLoading || isFetching ? (
          <LoaderPaperComponent />
        ) : isError ? (
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? "Error"}
            errorDetail={error?.error_detail ?? ""}
            color="error"
          />
        ) : mutation.isError ? (
          <Alert
            severity="error"
            errorMsg={mutation.error?.error_msg ?? "Error"}
            errorDetail={mutation.error?.error_detail ?? ""}
            color="error"
          />
        ) : null}

        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "10px" }}
        >
          <Toolbar variant="dense">
            <Typography
              className={classes.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              From Source Key Value Configuration
            </Typography>
            {isLoading || isFetching || isError ? null : (
              <>
                <Button
                  onClick={AddNewRow}
                  color="primary"
                  disabled={mutation.isLoading}
                >
                  Add
                </Button>
                <Button
                  onClick={onSaveRecord}
                  color="primary"
                  disabled={mutation.isLoading}
                  endIcon={
                    mutation.isLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  Save
                </Button>
              </>
            )}
            <Button
              onClick={onClose}
              color="primary"
              disabled={mutation.isLoading}
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <GridWrapper
          key={"operatorMasterSpecialAmount"}
          finalMetaData={FromSourceConfigSubDtlGridMetaData as GridMetaDataType}
          data={girdData}
          setData={setGridData}
          loading={isLoading || isFetching || isError}
          actions={[]}
          setAction={() => {}}
          refetchData={refetch}
          ref={myGridRef}
        />
      </div>
    </Dialog>
  );
};
