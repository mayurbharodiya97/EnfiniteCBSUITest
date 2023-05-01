import { ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import { useEffect, useContext, useRef, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { ServiceConfigDetailGridMetaData } from "./gridMetadata";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { ServiceConfigGridUpdate } from "./serviceConfigDetailEdit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Transition } from "pages_audit/common/transition";
import { useSnackbar } from "notistack";
import { LoadingTextAnimation } from "components/common/loader";
import { Alert } from "components/common/alert";
import { format } from "date-fns";
const actions: ActionTypes[] = [
  {
    actionName: "Add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "save",
    actionLabel: "Save",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
interface updateServiceConfigDataType {
  data: any;
  mode?: string;
  setServerError?: any;
}

const updateServiceConfigDataWrapperFn =
  (updateServiceConfig) =>
  async ({ data }: updateServiceConfigDataType) => {
    return updateServiceConfig(data);
  };
const transformData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((one, index) => ({
      ...one,
      id: index,
      _hidden: false,
      _isNewRow: false,
    }));
  } else {
    return data;
  }
};
export const ServiceConfigDetail = ({ ClosedEventCall }) => {
  const { getEntries } = useContext(ClearCacheContext);
  const { state: rows }: any = useLocation();
  const [isopenConfirmation, SetConfirmation] = useState(false);
  const isDataUpdateRef = useRef<any>(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getServiceConfigDetailGridData", rows[0]?.data?.TRN_TYPE, "R"], () =>
    API.getServiceConfigDetailGridData({
      trnType: rows[0]?.data?.TRN_TYPE,
      configType: "R",
    })
  );

  const onSubmitHandel = ({ data, mode, setServerError }) => {
    data.DETAILS_DATA["isNewRow"] = data?.DETAILS_DATA?.isNewRow?.map(
      (item) => {
        return {
          ...item,
          FROM_DT: format(item?.FROM_DT, "dd/MM/yyyy HH:mm:ss"),
          TO_DT: format(item?.TO_DT, "dd/MM/yyyy HH:mm:ss"),
          ACTIVE:
            item?.ACTIVE === "N" ? "N" : Boolean(item?.ACTIVE) ? "Y" : "N",
        };
      }
    );
    data.DETAILS_DATA["isUpdatedRow"] = data?.DETAILS_DATA?.isUpdatedRow?.map(
      (item) => {
        return {
          ...item,
          ACTIVE:
            item?.ACTIVE === "N" ? "N" : Boolean(item?.ACTIVE) ? "Y" : "N",
          _OLDROWVALUE: {
            ...item?._OLDROWVALUE,
            ACTIVE:
              item?._OLDROWVALUE?.ACTIVE === "N"
                ? "N"
                : Boolean(item?._OLDROWVALUE?.ACTIVE)
                ? "Y"
                : "N",
          },
        };
      }
    );
    isDataUpdateRef.current = { data, mode, setServerError };
    SetConfirmation(true);
  };
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries([
        "getServiceConfigDetailGridData",
        rows[0]?.data?.TRN_TYPE,
        "R",
      ]);
    };
  }, [getEntries]);
  const GidData = useMemo(() => transformData(data), [data]);
  // const metaData = useMemo(() => {
  //   return extractGridMetaData(ServiceConfigDetailGridMetaData, "edit");
  // }, []);
  return (
    <>
      <div style={{ padding: "9px" }}>
        {isLoading || isFetching ? (
          <ServiceConfigGridUpdate
            key={"Loading-CustomerLimitDetailsUpdate"}
            metadata={ServiceConfigDetailGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isLoading={isLoading}
            onSubmit={onSubmitHandel}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </ServiceConfigGridUpdate>
        ) : isError ? (
          <ServiceConfigGridUpdate
            key={"Error-CustomerLimitDetailsUpdate"}
            metadata={ServiceConfigDetailGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isError={isError}
            ErrorMessage={error?.error_msg ?? "Error"}
            onSubmit={onSubmitHandel}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </ServiceConfigGridUpdate>
        ) : (
          <ServiceConfigGridUpdate
            key={"edit"}
            metadata={ServiceConfigDetailGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={GidData}
            // actions={actions}
            isEditableForm={true}
            mode={"edit"}
            //@ts-ignore
            actions={actions}
            trnType={rows[0]?.data?.TRN_TYPE ?? ""}
            onSubmit={onSubmitHandel}
          >
            {({
              handelCloseEvent,
              handleSubmit,
              classes,
              handelActionEvent,
            }) => <></>}
          </ServiceConfigGridUpdate>
        )}
        {isopenConfirmation ? (
          <ConfirmServiceActiveConfigDetails
            isOpen={isopenConfirmation}
            refetch={refetch}
            SetMode={(flag) => {}}
            closeDialog={() => {
              SetConfirmation(false);
            }}
            isDataUpdateRef={isDataUpdateRef}
          />
        ) : null}
      </div>
    </>
  );
};

export const ServiceActiveConfigDetail = ({ ClosedEventCall }) => {
  const classes = useDialogStyles();
  return (
    <Dialog
      open={true}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "75%",
          // minHeight: "60vh",
          // height: "70vh",
        },
      }}
      maxWidth="lg"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <ServiceConfigDetail ClosedEventCall={ClosedEventCall} />
    </Dialog>
  );
};
export const ConfirmServiceActiveConfigDetails = ({
  isOpen,
  refetch,
  SetMode,
  closeDialog,
  isDataUpdateRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useMutation(
    updateServiceConfigDataWrapperFn(
      API.updateServiceActiveDeactiveConfigDetails
    ),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        refetch();
        SetMode("view");
        closeDialog();
      },
    }
  );
  const UpdateServiceConfig = () => {
    let { data, mode, setServerError } = isDataUpdateRef.current;
    mutation.mutate({ data, mode, setServerError });
  };
  return (
    <Dialog open={isOpen} maxWidth="sm">
      <DialogTitle>Do you want to Update Service?</DialogTitle>
      <DialogContent>
        {mutation.isLoading ? (
          <LoadingTextAnimation key={"loaderforDeleteing"} text="Updating..." />
        ) : mutation.isError ? (
          <Alert
            severity="error"
            // I suspect this, mutation.error?.error_msg is misspelt. Try errorMessage
            errorMsg={mutation.error?.error_msg ?? "Unknown Error occured"}
            errorDetail={mutation.error?.error_detail ?? ""}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="secondary"
          disabled={mutation.isLoading}
        >
          No
        </Button>
        <Button
          onClick={UpdateServiceConfig}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
