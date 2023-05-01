import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { PrimaryIDChangeGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery, useMutation } from "react-query";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";

const actions: ActionTypes[] = [
  {
    actionName: "accept",
    actionLabel: "Accept",
    multiple: false,
    rowDoubleClick: false,
    shouldExclude: (data, authDetails) => {
      if (Array.isArray(data) && data.length > 0) {
        if (
          data[0]?.data?.CONFIRMED === "R" ||
          data[0]?.data?.CONFIRMED === "Y"
        ) {
          return true;
        }
      }
      return false;
    },
  },
  {
    actionName: "reject",
    actionLabel: "Reject",
    multiple: false,
    rowDoubleClick: false,
    shouldExclude: (data, authDetails) => {
      if (Array.isArray(data) && data.length > 0) {
        if (
          data[0]?.data?.CONFIRMED === "R" ||
          data[0]?.data?.CONFIRMED === "Y"
        ) {
          return true;
        }
      }
      return false;
    },
  },
];

export const PrimaryIDChangeConfirm = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState({});
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const navigate = useNavigate();
  const authController = useContext(AuthContext);
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      let confirmed = data?.rows[0]?.data?.CONFIRMED;
      let enteredBy = data?.rows[0]?.data?.ENTERED_BY;
      if (confirmed === "Y") {
        enqueueSnackbar("Request has been already accepted.", {
          variant: "warning",
        });
      } else if (confirmed === "R") {
        enqueueSnackbar("Request has been already rejected.", {
          variant: "warning",
        });
      } else {
        if (data.name === "accept") {
          if (
            (enteredBy || "").toLowerCase() ===
            (authController?.authState?.user?.id || "").toLowerCase()
          ) {
            enqueueSnackbar("You can not accept your own entry.", {
              variant: "warning",
            });
          } else {
            setIsOpenAccept(true);
          }
        } else if (data.name === "reject") {
          if (
            (enteredBy || "").toLowerCase() ===
            (authController?.authState?.user?.id || "").toLowerCase()
          ) {
            enqueueSnackbar("You can not reject your own entry.", {
              variant: "warning",
            });
          } else {
            setIsOpenReject(true);
          }
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      }
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getPrimaryIDConfirmGridData"], () => API.getPrimaryIDConfirmGridData());
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  };
  const result = useMutation(API.confirmPrimaryIDChangeReq, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      refetch();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
    },
    onSettled: () => {
      onActionCancel();
    },
  });
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];

      // entries.forEach((one) => {
      //   queryClient.removeQueries(one);
      // });
      queryClient.removeQueries(["getPrimaryIDConfirmGridData"]);
    };
  }, [getEntries]);

  const onAcceptPopupYes = (rows) => {
    result.mutate({
      confirmed: "Y",
      trancd: rows[0]?.data?.TRAN_CD ?? "",
    });
  };
  const onRejectPopupYes = (rows) => {
    result.mutate({
      confirmed: "R",
      trancd: rows[0]?.data?.TRAN_CD ?? "",
    });
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
        key={`primaryIDConfirmGrid`}
        finalMetaData={PrimaryIDChangeGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
        // defaultFilter={[
        //   {
        //     id: "STATUS",
        //     value: {
        //       columnName: "Status",
        //       condition: "equal",
        //       value: "Pending",
        //     },
        //   },
        // ]}
      />
      {isOpenAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to accept this Request?"
          onActionYes={(rowVal) => onAcceptPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenAccept}
          loading={result.isLoading}
        />
      ) : null}
      {isOpenReject ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to reject this Request?"
          onActionYes={(rowVal) => onRejectPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenReject}
          loading={result.isLoading}
        />
      ) : null}
    </Fragment>
  );
};
