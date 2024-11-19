import { UserSecurity } from "./metaDataGrid";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import * as API from "./api";
import { Typography } from "@mui/material";
import { SecurityContextWrapper } from "./context/SecuityForm";
import Steppers from "./stepper/stepper";

import {
  ClearCacheContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
import { t } from "i18next";

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
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getSecurityUserGrid"], () => API.getSecurityUserGrid());
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "add") {
        navigate(data.name);
      } else if (data.name === "edit") {
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
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
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
    </Fragment>
  );
};

const UserSecurityWrapper = () => {
  return (
    <SecurityContextWrapper>
      <Routes>
        <Route path="add" element={<Steppers defaultView={"new"} />} />
        <Route path="edit" element={<Steppers defaultView={"edit"} />} />
        <Route path="/*" element={<Securityuser />} />
      </Routes>
    </SecurityContextWrapper>
  );
};

export default UserSecurityWrapper;
