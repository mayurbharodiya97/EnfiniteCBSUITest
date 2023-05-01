import { useRef, Fragment, useEffect, useContext, useCallback } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { queryClient, ClearCacheContext } from "cache";
import { useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import GridWrapper from "components/dataTableStatic";
import {
  AddUniversityMasterWrapper,
  DeleteUniversityMasterWrapper,
  ViewEditUniversityMasterWrapper,
} from "./universityMaster";

import * as API from "./api";
import { OtherEntityMastersGridMetaData } from "./gridMetaData";
import { ClubMasterFormWrapper } from "./clubMaster/clubMasterForm";
import { InsuMasterFormWrapper } from "./insuranceMaster";
import { UtilMasterFormWrapper } from "./utilityMaster";
import { ClubMemberListMasterWrapper } from "./clubMaster";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const OtherEntityMasters = ({ entityType }) => {
  const navigate = useNavigate();
  const { getEntries } = useContext(ClearCacheContext);
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const myGridNameRef = useRef("");
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getMastersGridData", entityType]);
      queryClient.removeQueries(["GetClubMemberData"]);
    };
  }, [getEntries]);

  const { refetch, data, isLoading, isFetching, isError, error } = useQuery(
    ["getMastersGridData", entityType],
    () => API.getMastersGridData(entityType)
  );
  //console.log(data, isLoading, isFetching, isError, error);
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
  let reqerror =
    typeof error === "object"
      ? { ...error }
      : { severity: undefined, error_msg: "", error_detail: "" };
  // Change Screen Title
  if (entityType === "U") {
    OtherEntityMastersGridMetaData.gridConfig.gridLabel = "University Master";
  } else if (entityType === "C") {
    OtherEntityMastersGridMetaData.gridConfig.gridLabel = "Club Master";
  } else if (entityType === "P") {
    OtherEntityMastersGridMetaData.gridConfig.gridLabel = "Utility Master";
  }
  useEffect(() => {
    if (entityType === "C") {
      actions.push({
        actionName: "view-member-details",
        actionLabel: "Member Details",
        multiple: false,
        rowDoubleClick: false,
      });
      myGridNameRef.current = "Club";
    }
  }, []);
  //console.log(entityType, actions);
  return (
    <Fragment>
      {isError === true ? (
        <Alert
          severity={reqerror?.severity ?? "error"}
          errorMsg={reqerror?.error_msg ?? "Error"}
          errorDetail={reqerror?.error_detail ?? ""}
        />
      ) : null}
      <GridWrapper
        key={"otherEntityGrid" + entityType + "" + myGridNameRef.current}
        //@ts-ignore
        finalMetaData={OtherEntityMastersGridMetaData}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        loading={isLoading || isFetching}
        refetchData={refetch}
        ref={myGridRef}
      />
      <Routes>
        <Route
          path="add"
          element={
            entityType === "U" ? (
              <AddUniversityMasterWrapper
                isDataChangedRef={isDataChangedRef}
                closeDialog={handleDialogClose}
              />
            ) : entityType === "C" ? (
              <ClubMasterFormWrapper
                isDataChangedRef={isDataChangedRef}
                handleDialogClose={handleDialogClose}
                formView={"add"}
              />
            ) : entityType === "I" ? (
              <InsuMasterFormWrapper
                isDataChangedRef={isDataChangedRef}
                handleDialogClose={handleDialogClose}
                formView={"add"}
              />
            ) : entityType === "P" ? (
              <UtilMasterFormWrapper
                isDataChangedRef={isDataChangedRef}
                handleDialogClose={handleDialogClose}
                formView={"add"}
              />
            ) : (
              <></>
            )
          }
        />
        <Route
          path="delete"
          element={
            entityType === "U" ? (
              <DeleteUniversityMasterWrapper
                isDataChangedRef={isDataChangedRef}
                closeDialog={handleDialogClose}
              />
            ) : entityType === "C" ? (
              <></>
            ) : (
              <></>
            )
          }
        />
        <Route
          path="view-details/*"
          element={
            entityType === "U" ? (
              <ViewEditUniversityMasterWrapper
                isDataChangedRef={isDataChangedRef}
                closeDialog={handleDialogClose}
                defaultView={"view"}
              />
            ) : entityType === "C" ? (
              <ClubMasterFormWrapper
                isDataChangedRef={isDataChangedRef}
                handleDialogClose={handleDialogClose}
                formView={"edit"}
              />
            ) : entityType === "I" ? (
              <InsuMasterFormWrapper
                isDataChangedRef={isDataChangedRef}
                handleDialogClose={handleDialogClose}
                formView={"edit"}
              />
            ) : entityType === "P" ? (
              <UtilMasterFormWrapper
                isDataChangedRef={isDataChangedRef}
                handleDialogClose={handleDialogClose}
                formView={"edit"}
              />
            ) : (
              <></>
            )
          }
        />
        <Route
          path="view-member-details/*"
          element={
            entityType === "C" ? (
              <ClubMemberListMasterWrapper
                isDataChangedRef={isDataChangedRef}
                handleDialogClose={handleDialogClose}
              />
            ) : (
              <></>
            )
          }
        />
      </Routes>
    </Fragment>
  );
};
