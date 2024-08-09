import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import { queryClient } from "cache";
import * as API from "../api";
import { PositivePayEntryGridMetaData } from "../gridMetadata";
import { PositivePayEntryFormWrapper } from "../form";

const Actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const PositivePayConfirmationGrid = ({ screenFlag }) => {
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getPositivePayConfirmationDetail", authState?.user?.branchCode], () =>
    API.getPositivePayCnfDtl({
      enterCompanyID: authState?.companyID ?? "",
      enterBranchCode: authState?.user?.branchCode ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getPositivePayConfirmationDetail",
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
        key={`positivePayConfirmationGrid`}
        finalMetaData={PositivePayEntryGridMetaData as GridMetaDataType}
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
            <PositivePayEntryFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
              screenFlag={screenFlag}
            />
          }
        />
      </Routes>
    </>
  );
};
