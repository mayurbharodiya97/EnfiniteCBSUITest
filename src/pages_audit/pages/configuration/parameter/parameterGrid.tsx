import { ClearCacheProvider, queryClient } from "cache";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import * as API from "./api";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ParametersGridMetaData } from "./gridMetadata";
import { useNavigate } from "react-router-dom";
import  EditDetail  from "./editParaDetails/editDetail";
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
  const {authState} = useContext(AuthContext);
  const [rowsData, setRowsData] = useState([]);
  const myGridRef = useRef<any>(null);
  const [acctOpen, setAcctOpen] = useState(false);
  const [paraType, setParaType] = useState("H");
  // const [conf_type, setConf_Type] = useState("H");
  const [componentToShow, setComponentToShow] = useState("");
  const [actionMenu, setActionMenu] = useState(actions);
  const setCurrentAction = useCallback(async (data) => {
    if (data.name === "global") {
      setActionMenu((values) =>
        values.map((item) =>
          item.actionName === "global"
            ? { ...item, actionName: "ho", actionLabel: "HO Level" }
            : item
        )
      );
      setParaType("G");
    } else if (data.name === "ho") {
      setActionMenu((values) =>
        values.map((item) =>
          item.actionName === "ho"
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
    () => API.getParametersGridData({
        para_type: paraType, 
        comp_cd: authState?.companyID, 
        branch_cd: authState.user.branchCode,
        conf_type: "A"
      })
  );

  useEffect(() => {
    if (paraType === "H") {
      ParametersGridMetaData.gridConfig.gridLabel="Parameter Master [Global Level]"
    } else if (paraType === "G") {
      ParametersGridMetaData.gridConfig.gridLabel="Parameter Master [HO Level]"
    }
  }, [paraType]);
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
        ReportExportButton={true}
        actions={authState.user.branchCode!==authState.user.baseBranchCode?[]:actionMenu}
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
          refetch={refetch}
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
