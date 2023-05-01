import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { TagAccountsGridMetaData, TagCardsGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery, useMutation } from "react-query";
import * as API from "./api";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { useSnackbar } from "notistack";

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

export const TagAccountForm = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState({});
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      let confirmed = data?.rows[0]?.data?.CONFIRMED;
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
          setIsOpenAccept(true);
        } else if (data.name === "reject") {
          setIsOpenReject(true);
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
  >(["getTagAcctCardGridData", "N", "A"], () =>
    API.getTagAcctCardGridData({ confirmed: "ALL", flag: "A" })
  );
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  };
  const result = useMutation(API.getTagAcceptRejectGridData, {
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

      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getTagAcctCardGridData", "N", "A"]);
    };
  }, [getEntries]);

  const yesDialogRef = (val, rows) => {
    result.mutate({
      confirmed: "Y",
      trancd: rows[0]?.data?.TRAN_CD ?? "",
      remarks: val,
    });
  };
  const rejectDialogRef = (val, rows) => {
    result.mutate({
      confirmed: "R",
      trancd: rows[0]?.data?.TRAN_CD ?? "",
      remarks: val,
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
        key={`tagAccountGrid`}
        finalMetaData={TagAccountsGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
        defaultFilter={[
          {
            id: "STATUS",
            value: {
              columnName: "Status",
              condition: "equal",
              value: "Pending",
            },
          },
        ]}
      />
      <RemarksAPIWrapper
        TitleText={"Accept Remarks"}
        onActionNo={() => onActionCancel()}
        onActionYes={yesDialogRef}
        isLoading={result.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenAccept}
        rows={rowData}
      />
      <RemarksAPIWrapper
        TitleText={"Rejection Remarks"}
        onActionNo={() => onActionCancel()}
        onActionYes={rejectDialogRef}
        isLoading={result.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenReject}
        rows={rowData}
      />
    </Fragment>
  );
};

export const TagCardForm = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const [rowData, setRowData] = useState({});
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      let confirmed = data?.rows[0]?.data?.CONFIRMED;
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
          setIsOpenAccept(true);
        } else if (data.name === "reject") {
          setIsOpenReject(true);
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
  >(["getTagAcctCardGridData", "ALL", "C"], () =>
    API.getTagAcctCardGridData({ confirmed: "ALL", flag: "C" })
  );

  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  };
  const result = useMutation(API.getTagAcceptRejectGridData, {
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

      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getTagAcctCardGridData", "ALL", "C"]);
    };
  }, [getEntries]);
  const yesDialogRef = (val, rows) => {
    result.mutate({
      confirmed: "Y",
      trancd: rows[0]?.data?.TRAN_CD ?? "",
      remarks: val,
    });
  };
  const rejectDialogRef = (val, rows) => {
    result.mutate({
      confirmed: "R",
      trancd: rows[0]?.data?.TRAN_CD ?? "",
      remarks: val,
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
        key={`tagCardGrid`}
        finalMetaData={TagCardsGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
        defaultFilter={[
          {
            id: "STATUS",
            value: {
              columnName: "Status",
              condition: "equal",
              value: "Pending",
            },
          },
        ]}
      />
      <RemarksAPIWrapper
        TitleText={"Accept Remarks"}
        onActionNo={() => onActionCancel()}
        onActionYes={yesDialogRef}
        isLoading={result.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenAccept}
        rows={rowData}
      />
      <RemarksAPIWrapper
        TitleText={"Rejection Remarks"}
        onActionNo={() => onActionCancel()}
        onActionYes={rejectDialogRef}
        isLoading={result.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenReject}
        rows={rowData}
      />
    </Fragment>
  );
};
