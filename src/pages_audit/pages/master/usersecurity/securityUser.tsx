import { UserSecurity } from "./metaDataGrid";
import { GridMetaDataType } from "components/dataTableStatic";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import * as API from "./api"
import { Typography } from "@mui/material";
import { ClearCacheContext, queryClient } from "cache";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
    rowDoubleClick: false,
  },
  {
    actionName: "edit",
    actionLabel: "Edit Detail",
    multiple: false,
    alwaysAvailable: false,
    rowDoubleClick: true,
  },
];

const Securityuser = () => {
  const navigate = useNavigate();
  const { getEntries } = useContext(ClearCacheContext);
  const [rowData, setRowsData] = useState<any>([])
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<any, any>(
    ["getSecurityUserGrid"],
    () => API.getSecurityUserGrid()
  );
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "add") {
        navigate(data.name);
      } else if (data.name === "edit") {
        setRowsData(data?.rows);
        navigate(data.name, {
          state: data?.rows,
        });
      } else {
        navigate(data?.name);
      }
    },
    [navigate]
  );
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getSecurityUserGrid"]);
    };
  }, [getEntries]);
  return (
    <Fragment>
      <GridWrapper
        key={`UserGroupGrid`}
        finalMetaData={UserSecurity as GridMetaDataType}
        data={data || []}
        actions={actions}
        loading={isFetching || isLoading}
        setData={() => null}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Typography sx={{ fontWeight: "bold", color: "rgb(152 59 70 / 61%)", marginLeft: "460px", marginTop: "-36.2px" }} variant="subtitle1">
        Double click or right click for Edit-Detail.
      </Typography>
    </Fragment>
  );
};

export default Securityuser;
