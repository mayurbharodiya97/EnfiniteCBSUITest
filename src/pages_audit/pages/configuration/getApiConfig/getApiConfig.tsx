import React, { useCallback, useContext, useEffect, useRef } from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { getApiGridMetaData } from "./getApiGridMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ClearCacheContext, queryClient } from "cache";
import { GetApiForm } from "./getApiFormData/getApiForm";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const GetApiConfig = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { getEntries } = useContext(ClearCacheContext);
  const isDataChangedRef = useRef(false);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDynamicApiList"], () => API.getDynamicApiList());

  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getDynamicApiList"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    if (isDataChangedRef.current === true) {
      // isDataChangedRef.current = true;
      refetch();
      // isDataChangedRef.current = false;
    }
    navigate(".");
  }, [navigate]);

  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  return (
    <>
      <GridWrapper
        key={"dynGridConfigGrid"}
        finalMetaData={getApiGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        // ref={myGridRef}
        // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
      />

      <Routes>
        <Route
          path="add/*"
          element={
            <GetApiForm
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              //   defaultView={"add"}
            />
          }
        />
        {/* <Route
          path="view-details/*"
          element={
            <DynamicGridConfigWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"view"}
            />
          }
        /> */}
      </Routes>
    </>
  );
};
