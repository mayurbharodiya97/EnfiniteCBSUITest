import { ClearCacheProvider } from "cache";
import { useMutation } from "react-query";
import { Fragment, useRef, useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import {
  BeforeReleaseUsersGridMetaData,
  ReleaseUserGridMetaData,
} from "./gridMetadata";
import { ReleaseUsersAPIWrapper } from "../releaseUsers";
import { FormComponentView } from "components/formcomponent";
import { ReleaseUserFilterForm } from "./metaData";
import { FilterFormMetaType } from "components/formcomponent/filterform";
const actions: ActionTypes[] = [
  {
    actionName: "releaseUsers",
    actionLabel: "Release",
    multiple: true,
    rowDoubleClick: false,
  },
];
export const ReleaseUsers = () => {
  const isDataChangedRef = useRef(false);
  const isRequestDataRef = useRef<any>(null);
  const myGridRef = useRef<any>(null);
  const navigate = useNavigate();
  const [blockType, setBlockType] = useState("AFTER");
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const result = useMutation(API.getReleaseUsersGridData, {
    onSuccess: (response: any) => {},
    onError: (error: any) => {},
  });

  const ClickEventManage = useCallback(
    (colomnValue, initialVisibleColumn) => {
      setBlockType(colomnValue?.release_type);
      let reqData = {
        block_type: colomnValue?.release_type ?? "",
        type: colomnValue?.block_type ?? "",
      };
      isRequestDataRef.current = reqData;
      result.mutate(reqData);
    },
    [result]
  );
  const RefreshDataEvent = () => {
    if (isRequestDataRef.current !== null) {
      result.mutate(isRequestDataRef.current);
    }
  };
  const handleDialogClose = () => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      RefreshDataEvent();
      isDataChangedRef.current = false;
    }
  };

  // useEffect(() => {
  //   return () => {};
  // }, [blockType]);
  return (
    <Fragment>
      {result.isError && (
        <Alert
          severity="error"
          errorMsg={result.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={result.error?.error_detail}
          color="error"
        />
      )}
      <FormComponentView
        key={"customerSearching "}
        finalMetaData={ReleaseUserFilterForm as FilterFormMetaType}
        onAction={ClickEventManage}
        loading={result.isLoading}
        data={[]}
      ></FormComponentView>
      <GridWrapper
        key={`releaseUsersGrid-` + blockType}
        finalMetaData={
          blockType === "BEFOR"
            ? BeforeReleaseUsersGridMetaData
            : (ReleaseUserGridMetaData as GridMetaDataType)
        }
        data={result.data ?? []}
        setData={() => null}
        loading={result.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => RefreshDataEvent()}
        ref={myGridRef}
      />
      <Routes>
        <Route
          path="releaseUsers"
          element={
            <ReleaseUsersAPIWrapper
              handleDialogClose={handleDialogClose}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

export const ReleaseUsersGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <ReleaseUsers />
    </ClearCacheProvider>
  );
};
