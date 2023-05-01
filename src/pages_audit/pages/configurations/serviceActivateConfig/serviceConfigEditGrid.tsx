import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import {
  ServiceActiveConfigViewGridMetaData,
  ServiceActiveConfigGridMetaData,
} from "./gridMetadata";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { useSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LoadingTextAnimation } from "components/common/loader";
import { Alert } from "components/common/alert";
import { ServiceConfigGridUpdate } from "./serviceConfigEdit";

const action: ActionTypes[] = [
  {
    actionName: "edit",
    actionLabel: "Edit",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "messages",
    actionLabel: "Messages",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
];
const action_edit: ActionTypes[] = [
  {
    actionName: "save",
    actionLabel: "Save",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "cancel",
    actionLabel: "Cancel",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "messages",
    actionLabel: "Messages",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
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
export const ServiceConfigGrid = () => {
  const isDataChangedRef = useRef(false);
  const isDataUpdateRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const [mode, SetMode] = useState("view");
  const [isopenConfirmation, SetConfirmation] = useState(false);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getServiceActiveConfigGridData"], () =>
    API.getServiceActiveConfigGridData()
  );
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getServiceActiveConfigGridData"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = false;
    }
  }, [navigate]);
  const onSubmitHandel = ({ data, mode, setServerError }) => {
    data.DETAILS_DATA["isNewRow"] = data?.DETAILS_DATA?.isNewRow?.map(
      (item) => {
        return {
          ...item,
          TRN_USER: Boolean(item?.TRN_USER) ? "Y" : "N",
          VIEW_USER: Boolean(item?.VIEW_USER) ? "Y" : "N",
        };
      }
    );
    data.DETAILS_DATA["isUpdatedRow"] = data?.DETAILS_DATA?.isUpdatedRow?.map(
      (item) => {
        return {
          ...item,
          TRN_USER: Boolean(item?.TRN_USER) ? "Y" : "N",
          VIEW_USER: Boolean(item?.VIEW_USER) ? "Y" : "N",
          _OLDROWVALUE: {
            ...item?._OLDROWVALUE,
            TRN_USER: Boolean(item?._OLDROWVALUE?.TRN_USER) ? "Y" : "N",
            VIEW_USER: Boolean(item?._OLDROWVALUE?.VIEW_USER) ? "Y" : "N",
          },
        };
      }
    );
    isDataUpdateRef.current = { data, mode, setServerError };
    SetConfirmation(true);
  };
  const GidData = useMemo(() => transformData(data), [data]);
  return (
    <>
      <Fragment>
        {isLoading || isFetching ? (
          <ServiceConfigGridUpdate
            key={"Loading-ServiceActiveConfigUpdate"}
            metadata={ServiceActiveConfigViewGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isLoading={isLoading}
            SetMode={SetMode}
          ></ServiceConfigGridUpdate>
        ) : isError ? (
          <ServiceConfigGridUpdate
            key={"Error-ServiceActiveConfigUpdate"}
            metadata={ServiceActiveConfigViewGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isError={isError}
            ErrorMessage={error?.error_msg ?? "Error"}
            SetMode={SetMode}
          ></ServiceConfigGridUpdate>
        ) : (
          <>
            <ServiceConfigGridUpdate
              key={"serviceConfig" + mode}
              metadata={
                mode === "edit"
                  ? ServiceActiveConfigGridMetaData
                  : ServiceActiveConfigViewGridMetaData
              }
              ClosedEventCall={ClosedEventCall}
              data={GidData}
              isEditableForm={true}
              mode={mode}
              //@ts-ignore
              actions={mode === "edit" ? action_edit : action}
              SetMode={SetMode}
              onSubmit={onSubmitHandel}
              isLoading={isLoading}
            ></ServiceConfigGridUpdate>
            {isopenConfirmation ? (
              <ConfirmServiceActiveConfig
                isOpen={isopenConfirmation}
                refetch={refetch}
                SetMode={SetMode}
                closeDialog={() => {
                  SetConfirmation(false);
                }}
                isDataUpdateRef={isDataUpdateRef}
              />
            ) : null}
          </>
        )}
      </Fragment>
    </>
  );
};

export const ServiceActiveConfigGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <ServiceConfigGrid />
    </ClearCacheProvider>
  );
};

export const ConfirmServiceActiveConfig = ({
  isOpen,
  refetch,
  SetMode,
  closeDialog,
  isDataUpdateRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useMutation(
    updateServiceConfigDataWrapperFn(API.updateServiceActiveDeactiveConfig),

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
          //   "Deleting..."
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
