import { Transition } from "pages_audit/common";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { useContext, useEffect, useRef, useState } from "react";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { ClearCacheContext, queryClient } from "cache";
import { useSnackbar } from "notistack";
import { CreateDetailsRequestData, utilFunction } from "components/utils";
import { FieldComponentGridMetaData } from "./metaData";
import { makeStyles } from "@mui/styles";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Theme,
  Dialog,
  Button,
} from "@mui/material";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
export const useDialogStyles = makeStyles((theme: Theme) => ({
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
}));
interface updateAUTHDetailDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}
const updateAUTHDetailDataWrapperFn =
  (insertFormData) =>
  async ({ data }: updateAUTHDetailDataType) => {
    return insertFormData(data);
  };
export const FieldComponentGrid = ({
  isOpen,
  formMode,
  onClose,
  reqDataRef,
}) => {
  const classes = useDialogStyles();
  const [gridData, setGridData] = useState<any>([]);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getGridFieldComponentData", { ...reqDataRef.current }], () =>
    API.getGridFieldComponentData({ ...reqDataRef.current })
  );
  console.log("reqDataRef", reqDataRef);
  const mutation = useMutation(API.dynamiPropsConfigDML, {
    onError: (error: any, { endSubmit }) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      endSubmit(false, errorMsg, error?.error_detail ?? "");
      enqueueSnackbar(errorMsg, { variant: "error" });
      onActionCancel();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });

      onClose();
    },
  });

  useEffect(() => {
    if (Array.isArray(data)) {
      setGridData(data);
    } else {
      setGridData([]);
    }
  }, [data]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getGridFieldComponentData"]);
    };
  }, []);

  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate(rows);
  };
  const onSaveRecord = async () => {
    console.log(">>datadata", data);
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
      result = result.map((item) => ({
        BRANCH_CD: item?.BRANCH_CD,
        COMP_CD: item?.COMP_CD,
        DOC_CD: item?.DOC_CD,
        LINE_ID: item?.LINE_ID,
        PROPS_ID: item?.PROPS_ID,
        PROPS_VALUE: item?.PROPS_VALUE,
        SR_CD: item?.SR_CD,
        _isNewRow: true,
      }));
      console.log("result", result);
      let finalResult = result.filter(
        (one) => !(Boolean(one?._isNewRow) && Boolean(one?._isTouchedCol))
      );
      if (finalResult.length === 0) {
        onClose();
      } else {
        finalResult = CreateDetailsRequestData(finalResult);
        console.log("finalResult", finalResult);
        if (
          finalResult?.isDeleteRow?.length === 0 &&
          finalResult?.isNewRow?.length === 0 &&
          finalResult?.isUpdatedRow?.length === 0
        ) {
          onClose();
        } else {
          isErrorFuncRef.current = {
            data: {
              _isNewRow: true,
              DETAILS_DATA: finalResult,
            },
          };
          setIsOpenSave(true);
          // mutation.mutate({ data: reqData });
        }
      }
    }
  };
  // const onSaveRecord = async () => {
  //   let { hasError, data: dataold } = await myGridRef.current?.validate(true);
  //   if (hasError === true) {
  //     if (dataold) {
  //       setGridData(dataold);
  //     }
  //   } else {
  //     let result = myGridRef?.current?.cleanData?.();
  //     console.log("result", result);
  //     if (!Array.isArray(result)) {
  //       result = [result];
  //     }

  //     isErrorFuncRef.current = {
  //       data: {
  //         ...result,
  //       },
  //     };
  //   }

  //   setIsOpenSave(true);
  //   // mutation.mutate({
  //   //   TEMPLATE_LIST: gridData.map((data) => {
  //   //     return {
  //   //       ...data,
  //   //       TEMPLATE_TRAN_CD: trancd ?? "",
  //   //       DB_COLUMN: dbcolumn ?? "",
  //   //     };
  //   //   }),

  //   // });
  // };

  return (
    <Dialog
      open={isOpen}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="md"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "10px" }}>
        {/* {isLoading || isFetching ? (
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
        ) : null} */}

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
              {"Props Configuration" +
                " For " +
                reqDataRef.current?.FIELD_NAME ?? ""}
            </Typography>
            {/* {isLoading || isFetching || isError ? null : ( */}
            <>
              <Button
                onClick={onSaveRecord}
                color="primary"
                // disabled={mutation.isLoading}
                // endIcon={
                //   mutation.isLoading ? <CircularProgress size={20} /> : null
                // }
              >
                Save
              </Button>
            </>
            {/* )} */}
            <Button
              onClick={onClose}
              color="primary"
              // disabled={mutation.isLoading}
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <GridWrapper
          key={"tenureTypeTenures"}
          finalMetaData={FieldComponentGridMetaData as GridMetaDataType}
          data={gridData}
          setData={setGridData}
          // loading={isLoading || isFetching || isError}
          actions={[]}
          setAction={() => {}}
          // refetchData={refetch}
          ref={myGridRef}
        />
        {isOpenSave ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Do you want to save this Request?"
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={isErrorFuncRef.current?.data}
            open={isOpenSave}
            // loading={mutation.isLoading}
          />
        ) : null}
      </div>
    </Dialog>
  );
};
