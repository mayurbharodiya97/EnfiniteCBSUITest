import { ClearCacheContext, ClearCacheProvider, queryClient } from "cache";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import * as API from "./api";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ParametersGridMetaData } from "./gridMetadata";
import { useNavigate } from "react-router-dom";
import { EditDetail } from "./editDetail";
import { useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";

const actions: ActionTypes[] = [
  {
    actionName: "global",
    actionLabel: "Global Level",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
    shouldExclude: (rows) => {
      return false;
    },
  },
  {
    actionName: "edit-detail",
    actionLabel: "Edit Details",
    multiple: false,
    rowDoubleClick: true,
  },
];

const Parameters = () => {
  const navigate = useNavigate();
  const authState = useContext(AuthContext);
  const [rowsData, setRowsData] = useState([]);
  const myGridRef = useRef<any>(null);
  const [acctOpen, setAcctOpen] = useState(false);
  const [paraType, setParaType] = useState("H");
  const { getEntries } = useContext(ClearCacheContext);
  const [componentToShow, setComponentToShow] = useState("");
  const [actionMenu, setActionMenu] = useState(actions);
  const setCurrentAction = useCallback(async (data) => {
    if (data.name === "global") {
      setActionMenu((values) =>
        values.map((item) =>
          item.actionName === "global"
            ? { ...item, actionName: "hopara", actionLabel: "HO Level" }
            : item
        )
      );
      setParaType("G");
    } else if (data.name === "hopara") {
      setActionMenu((values) =>
        values.map((item) =>
          item.actionName === "hopara"
            ? { ...item, actionName: "global", actionLabel: "Global Level" }
            : item
        )
      );
      setParaType("H");
    } else if (data.name === "edit-detail") {
      setComponentToShow("editDetail");
      setAcctOpen(true);
      setRowsData(data?.rows);
    } else {
      navigate(data?.name, { state: data?.rows });
    }
  }, [navigate]);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<any, any>(
    ["getParametersGridData", paraType],
    () => API.getParametersGridData(paraType)
  );

  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getParametersGridData", paraType]);
    };
  }, [getEntries, paraType]);

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={"parametersGrid" + paraType}
        finalMetaData={ParametersGridMetaData as GridMetaDataType}
        data={data ?? []}
        actions={authState.authState.user.branchCode!==authState.authState.user.baseBranchCode?[]:actionMenu}
        setAction={setCurrentAction}
        setData={() => null}
        loading={isLoading || isFetching}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      {componentToShow === "editDetail" ? (
        <EditDetail
          rowsData={rowsData}
          open={acctOpen}
          onClose={() => setAcctOpen(false)}
        />
      ) : null}
    </Fragment>
  );
};

const ParametersGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <Parameters />
    </ClearCacheProvider>
  );
};

export default ParametersGridWrapper;
