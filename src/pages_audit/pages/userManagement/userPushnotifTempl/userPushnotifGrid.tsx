import { ClearCacheContext, queryClient } from "cache";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { UserPushnotifGridMetaData } from "./gridMetadata";
import { useNavigate, Routes, Route } from "react-router-dom";
import { UserPushnotifDetails } from "./crud";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
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
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: true,
    alwaysAvailable: true,
  },
];
interface updateUserPushnotifDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  setLoading?: any;
}
const updateUserPushnotifDetailsDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateUserPushnotifDataType) => {
    return updateMasterData(data);
  };

export const UserPushnotifGridWrapper = () => {
  const navigate = useNavigate();
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const isDataChangedRef = useRef(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getUserPushnotifGridData"], () => API.getUserPushnotifGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      queryClient.removeQueries(["getUserPushnotifGridData"]);
    };
  }, [getEntries]);
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "delete") {
        setIsOpenDeleteDialog(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };

  const mutation = useMutation(
    updateUserPushnotifDetailsDataWrapperFn(
      API.updateUserPushnotifMasterDetailData
    ),
    {
      onSuccess: (data) => {
        enqueueSnackbar("Record Updated successfully.", {
          variant: "success",
        });
        refetch();
        onActionCancel();
      },
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(true, errorMsg, error?.error_detail ?? "");
      },
    }
  );

  const onPopupYes = (rows) => {
    mutation.mutate({
      data: {
        TRAN_CD: rows?.[0]?.data?.TRAN_CD ?? "",
        _isDeleteRow: true,
        DETAILS_DATA: {
          isDeleteRow: [],
          isNewRow: [],
          isUpdatedRow: [],
        },
      },
    });
  };

  const onActionCancel = () => {
    setIsOpenDeleteDialog(false);
  };

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
        key={`UserPushnotifGrid`}
        finalMetaData={UserPushnotifGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      <Routes>
        {
          <Route
            path="add"
            element={
              <UserPushnotifDetails
                isDataChangedRef={isDataChangedRef}
                ClosedEventCall={handleDialogClose}
                defaultmode={"add"}
              />
            }
          />
        }
        <Route
          path="view-details"
          element={
            <UserPushnotifDetails
              isDataChangedRef={isDataChangedRef}
              ClosedEventCall={handleDialogClose}
              defaultmode={"view"}
            />
          }
        />
      </Routes>
      {isOpenDeleteDialog && (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to delete this request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenDeleteDialog}
          loading={mutation.isLoading}
        />
      )}
    </Fragment>
  );
};
