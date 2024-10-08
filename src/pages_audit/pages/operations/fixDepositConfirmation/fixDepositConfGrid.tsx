import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as API from "./api";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
import { useQuery } from "react-query";
import { FDConfirmationGridMetaData } from "./gridMetadata";
import { FDConfirmationFormWrapper } from "./form/fixDepositConfForm";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const FDConfirmationGrid = () => {
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-details") {
        {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      }
    },
    [navigate]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFdConfirmationData", authState?.user?.branchCode], () =>
    API.getFdConfirmationData({
      BRANCH_CD: authState?.user?.branchCode ?? "",
      COMP_CD: authState?.companyID ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getFdConfirmationData",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

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
        key={`fixDepositConfirmationGrid`}
        finalMetaData={FDConfirmationGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => {}}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <FDConfirmationFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
            />
          }
        />
      </Routes>
    </>
  );
};
