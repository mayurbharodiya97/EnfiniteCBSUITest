import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { AccountDeletionReqGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import * as API from "./api";
import { RemarksAPIWrapper } from "components/custom/Remarks";

const actions: ActionTypes[] = [
  {
    actionName: "accept",
    actionLabel: "Accept",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "reject",
    actionLabel: "Reject",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const AccountDeletionReqWrapper = ({ screenFlag }) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const [rowData, setRowData] = useState({});
  const [isOpenAcceptRemark, setIsOpenAcceptRemark] = useState(false);
  const [isOpenRejectRemark, setIsOpenRejectRemark] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "accept") {
        setIsOpenAcceptRemark(true);
      } else if (data.name === "reject") {
        setIsOpenRejectRemark(true);
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
  >(["getAccountDeletionReqGridData", screenFlag], () =>
    API.getAccountDeletionReqGridData(screenFlag)
  );

  // const result = useMutation(API.deleteBillerConfigConfirm, {
  //   onSuccess: (response: any) => {
  //     enqueueSnackbar(response, { variant: "success" });
  //     onActionCancel();
  //   },
  //   onError: (error: any) => {
  //     enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
  //   },
  //   onSettled: () => {
  //     onActionCancel();
  //   },
  // });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getAccountDeletionReqGridData", screenFlag]);
    };
  }, [getEntries, screenFlag]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
  }, [navigate]);

  const onAcceptRematk = (rows) => {
    // result.mutate({
    //   categoryID: rows?.[0]?.data?.CATEGORY_ID ?? "",
    //   subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID ?? "",
    //   billerID: rows?.[0]?.data?.BILLER_ID ?? "",
    // });
  };
  const onRejectRematk = (rows) => {
    // result.mutate({
    //   categoryID: rows?.[0]?.data?.CATEGORY_ID ?? "",
    //   subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID ?? "",
    //   billerID: rows?.[0]?.data?.BILLER_ID ?? "",
    // });
  };

  const onActionCancel = () => {
    setIsOpenAcceptRemark(false);
    setIsOpenRejectRemark(false);
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
        key={`accountDeletionGrid`}
        finalMetaData={AccountDeletionReqGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />

      {isOpenAcceptRemark ? (
        <RemarksAPIWrapper
          TitleText={"Accept Remarks"}
          onActionNo={() => onActionCancel()}
          onActionYes={onAcceptRematk}
          // isLoading={result.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isOpenAcceptRemark}
          rows={rowData}
        />
      ) : null}
      {isOpenRejectRemark ? (
        <RemarksAPIWrapper
          TitleText={"Reject Remarks"}
          onActionNo={() => onActionCancel()}
          onActionYes={onRejectRematk}
          // isLoading={result.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isOpenRejectRemark}
          rows={rowData}
        />
      ) : null}
    </Fragment>
  );
};
