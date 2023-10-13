import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import { Fragment, useEffect, useContext, useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { DynamicDropdownConfigGridMData } from "./gridMetadata";

import { AuthContext } from "pages_audit/auth";
import { DynamicDropdownConfigWrapper } from "./dynamicDropdownConfig/DynDropdownConfig";

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
export const DynamicDropdownConfig = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  // const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
  //   any,
  //   any
  // >(["getDynamicGridConfigGridData"], () =>
  //   API.getDynamicGridConfigGridData({
  //     COMP_CD: authState?.companyID ?? "",
  //     BRANCH_CD: authState?.user?.branchCode ?? "",
  //   })
  // );
  // useEffect(() => {
  //   return () => {
  //     let entries = getEntries() as any[];
  //     if (Array.isArray(entries) && entries.length > 0) {
  //       entries.forEach((one) => {
  //         queryClient.removeQueries(one);
  //       });
  //     }
  //     queryClient.removeQueries(["getDynamicGridConfigGridData"]);
  //   };
  // }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      // refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  return (
    <Fragment>
      {/* {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )} */}

      <GridWrapper
        key={"dynGridConfigGrid"}
        finalMetaData={DynamicDropdownConfigGridMData as GridMetaDataType}
        data={
          // data ??
          []
        }
        setData={() => null}
        // loading={
        //   []
        //   // isLoading || isFetching
        // }
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => null}
        ref={myGridRef}
        // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
      />
      <Routes>
        <Route
          path="add/*"
          element={
            <DynamicDropdownConfigWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <DynamicDropdownConfigWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"view"}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
