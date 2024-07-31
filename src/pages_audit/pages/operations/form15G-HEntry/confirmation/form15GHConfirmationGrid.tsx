import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import { queryClient } from "cache";
import * as API from "../api";
import { Form15GHEntryGridMetaData } from "../gridMetaData";
import { Form15GHEntryWrapper } from "../form";

const Actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const Form15GHConfirmationGrid = ({ screenFlag }) => {
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getForm15GHConfirmationDetail", authState?.user?.branchCode], () =>
    API.getForm15GHConfirmationDetail({
      enterCompanyID: authState?.companyID ?? "",
      enterBranchCode: authState?.user?.branchCode ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getForm15GHConfirmationDetail",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-details") {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const handleDialogClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`form15GHEntryGrid` + screenFlag}
        finalMetaData={Form15GHEntryGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => {}}
        loading={isLoading || isFetching}
        actions={Actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <Form15GHEntryWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
              screenFlag={screenFlag}
              dataRefetch={refetch}
            />
          }
        />
      </Routes>
    </>
  );
};
