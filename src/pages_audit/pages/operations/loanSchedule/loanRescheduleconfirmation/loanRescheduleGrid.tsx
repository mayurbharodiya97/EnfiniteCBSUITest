import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { LoanRescheduleGridMetadata } from "./gridMetadata";
import { getRescheduleConfData } from "../api";
import { LoanRescheduleConfForm } from "./loanRescheduleConfForm";
import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const LoanRescheduleConfirmationGrid = () => {
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const [gridData, setGridData] = useState<any>([]);

  const navigate = useNavigate();

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

  const { isLoading, isFetching, isError, error, refetch } = useQuery<any, any>(
    ["getRescheduleConfData", authState?.user?.branchCode],
    () =>
      getRescheduleConfData({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
      }),
    {
      onSuccess(data) {
        if (Array.isArray(data) && data.length > 0) {
          const updatedData = data.map((item) => ({
            ...item,
            INT_RATE: Number(item?.INT_RATE ?? 0).toFixed(2),
          }));
          setGridData(updatedData);
        } else {
          setGridData([]);
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getRescheduleConfData",
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
        key={`LoanRescheduleConfirmationGrid`}
        finalMetaData={LoanRescheduleGridMetadata as GridMetaDataType}
        data={gridData ?? []}
        setData={setGridData}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <LoanRescheduleConfForm
              closeDialog={handleDialogClose}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
    </>
  );
};
