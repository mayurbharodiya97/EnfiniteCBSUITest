import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import * as APIDTL from "./fileconfigMasterForm/api";
import { FileconfigMasterGridMetaData } from "./gridMetadata";
import { useSnackbar } from "notistack";
import { FileconfigMasterFormWrapper } from "./fileconfigMasterForm";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
const actions: ActionTypes[] = [
  {
    actionName: "edit-detail",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
];
interface updateAUTHDetailDataType {
  data: any;
  displayData?: any;
  endSubmit?: any;
  setFieldError?: any;
}

const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({ data }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData({ data });
  };
export const FileconfigMaster = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const isDeleteDataRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isDelete, SetDelete] = useState(false);
  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        SetDelete(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFileconfigMasterGridData"], () => API.getFileconfigMasterGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getFileconfigMasterGridData"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`FileconfigMasterGrid`}
        finalMetaData={FileconfigMasterGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      <Routes>
        <Route
          path="edit-detail/*"
          element={
            <FileconfigMasterFormWrapper
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
              formView="edit"
            />
          }
        />
        <Route
          path="add/*"
          element={
            <FileconfigMasterFormWrapper
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
              formView="new"
            />
          }
        />
      </Routes>
      {isDelete ? (
        <DeleteFileconfigMaster
          closeDialog={() => {
            if (isDataChangedRef.current === true) {
              refetch();
              isDataChangedRef.current = false;
            }
            SetDelete(false);
          }}
          isDataChangedRef={isDataChangedRef}
          rows={isDeleteDataRef.current}
        />
      ) : null}
    </Fragment>
  );
};

export const FileconfigMasterGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <FileconfigMaster />
    </ClearCacheProvider>
  );
};

const DeleteFileconfigMaster = ({ closeDialog, isDataChangedRef, rows }) => {
  const { enqueueSnackbar } = useSnackbar();
  // const { authState } = useContext(AuthContext);
  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(APIDTL.updFileconfigMasterFormData),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        isDataChangedRef.current = true;
        enqueueSnackbar("Records successfully deleted", {
          variant: "success",
        });
        closeDialog();
      },
    }
  );
  const onDeleteEvent = () => {
    mutation.mutate({ data: { ...rows?.data, _isDeleteRow: true } });
  };
  return (
    <Dialog open={true} maxWidth="sm">
      <DialogTitle>Would you like to delete the selected record?</DialogTitle>
      <DialogContent>
        {mutation.isLoading ? (
          "Deleting..."
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
          onClick={onDeleteEvent}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
