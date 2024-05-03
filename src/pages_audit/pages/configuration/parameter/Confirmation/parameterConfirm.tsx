import { useRef, Fragment, useState, useContext, useCallback, } from "react";
import { ParameterConfirmGridMetaData } from "./gridMetadata";
import * as API from "./api"
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { Alert } from "components/common/alert";

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

const ParameterConfirmGridWrapper = () => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([])
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const { authState } = useContext(AuthContext);
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      let check = data?.rows[0]?.data?.LAST_ENTERED_BY;
      if (data.name === "accept") {
        if (
          (check || "").toLowerCase() ===
          (authState?.user?.id || "").toLowerCase()
        ) {
          enqueueSnackbar("You can not accept your own entry.", {
            variant: "warning",
          });
        } else {
          setIsOpenAccept(true);
        }
      } else if (data.name === "reject") {
        if (
          (check || "").toLowerCase() ===
          (authState?.user?.id || "").toLowerCase()
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
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getParameterConfirmGridData"], () => {
    if (authState?.role < "4") {
      return null;
    } else {
      return API.getParameterConfirm({ comp_cd: authState.companyID, branch_cd: authState?.user?.branchCode })}});
  const result = useMutation(API.confirmStatus, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      refetch();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
      console.log(">>>", error?.error_msg)
    },
    onSettled: () => {
      onActionCancel();
    },
  });
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
  };
  const onRejectPopupYes = (rows) => {
    result.mutate({
      confirmed: "R",
      comp_cd: rows[0]?.data?.COMP_CD ?? "",
      remarks: rows[0]?.data?.REMARKS ?? "",
      para_cd: rows[0]?.data?.PARA_CD ?? "",
      branch_cd: rows[0]?.data?.BRANCH_CD ?? "",
    });
  };
  const onAcceptPopupYes = (rows) => {
    result.mutate({
      confirmed: "Y",
      comp_cd: rows[0]?.data?.COMP_CD ?? "",
      remarks: rows[0]?.data?.REMARKS ?? "",
      para_cd: rows[0]?.data?.PARA_CD ?? "",
      branch_cd: rows[0]?.data?.BRANCH_CD ?? "",
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
        key={`parameterConfirmGrid`}
        finalMetaData={ParameterConfirmGridMetaData as GridMetaDataType}
        data={data ?? []}
        actions={actions}
        setData={() => null}
        ReportExportButton={true}
        setAction={setCurrentAction}
        loading={isLoading || isFetching}
        refetchData={() => refetch()}
        ref={myGridRef}
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

export default ParameterConfirmGridWrapper