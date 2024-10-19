import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { Box, Dialog } from "@mui/material";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { releaseGridMetaData } from "./metadata";
import ReleaseSubGrid from "./releaseSubGrid";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";

const actions: ActionTypes[] = [
  {
    actionName: "cancle",
    actionLabel: "Cancel",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "release",
    actionLabel: "Release",
    multiple: true,
    rowDoubleClick: true,
  },
];

const ReleaseMainGrid = ({ setOpenGrid }) => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const reqObject = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };
  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchMainGrid,
    error,
    isError,
  } = useQuery<any, any>(["releaseMainData", { ...reqObject }], () =>
    API?.getReleaseGridData({ ...reqObject })
  );

  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "cancle") {
        setOpenGrid(false);
      }
      navigate(data?.name, {
        state: data?.rows[0]?.data,
      });
    },
    [actions, navigate]
  );

  const handleRlsSubgridClose = () => {
    navigate(".");
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["releaseMainData", { ...reqObject }]);
    };
  }, []);

  return (
    <>
      <Box margin={"0px 16px"}>
        {isError ? (
          <Fragment>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </Fragment>
        ) : null}
        <GridWrapper
          key={`releaseGridMetaData`}
          finalMetaData={releaseGridMetaData as GridMetaDataType}
          data={data ?? []}
          loading={isLoading || isFetching}
          setData={() => {}}
          actions={actions}
          setAction={setCurrentAction}
          hideHeader={false}
          controlsAtBottom={true}
          refetchData={() => refetchMainGrid()}
        />
      </Box>

      <Routes>
        <Route
          path="release/*"
          element={
            <ReleaseSubGrid
              handleRlsSubClose={handleRlsSubgridClose}
              refetchMainGrid={refetchMainGrid}
            />
          }
        />
      </Routes>
    </>
  );
};

export default ReleaseMainGrid;
