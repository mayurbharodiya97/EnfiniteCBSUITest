import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import { queryClient } from "cache";
import { Form15GHEntryGridMetaData } from "./gridMetaData";
import { Form15GHEntryWrapper } from "./form/form15G-HEntry";
import * as API from "./api";
import { RetrievalParametersFormWrapper } from "./form/retrieveDataForm";

const Actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "retrieve",
    actionLabel: "Retrieve",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "view-all",
    actionLabel: "ViewAll",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

export const Form15GHEntryGrid = ({ zoneTranType }) => {
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const [gridData, setGridData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const initialRender = useRef(true);
  const [newDataRetrieved, setNewDataRetrieved] = useState<(() => void) | null>(
    null
  );

  const {
    data: formData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    ["getForm15GHDetail", authState?.user?.branchCode],
    () =>
      API.getForm15GHDetail({
        workingDate: authState?.workingDate ?? "",
        enterCompanyID: authState?.companyID ?? "",
        enterBranchCode: authState?.user?.branchCode ?? "",
      })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getForm15GHDetail",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "add") {
        navigate(data?.name, {
          state: [],
        });
      } else if (data?.name === "retrieve") {
        navigate(data?.name);
      } else if (data?.name === "view-all") {
        refetch();
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (location.pathname === "/cbsenfinity/operation/form-15g-h-entry") {
        navigate("add");
      }
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (formData && !isLoading && !isFetching) {
      setGridData(formData);
    }
  }, [formData, isLoading, isFetching]);

  const handleDataRetrieved = (newData) => {
    setGridData(newData);
    navigate(".");
  };
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
        key={`form15GHEntryGrid` + gridData}
        finalMetaData={Form15GHEntryGridMetaData as GridMetaDataType}
        data={gridData ?? []}
        setData={setGridData}
        loading={isLoading || isFetching}
        actions={Actions}
        setAction={setCurrentAction}
        // refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <Form15GHEntryWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
              zoneTranType={zoneTranType}
              dataRefetch={refetch}
            />
          }
        />
        <Route
          path="add/*"
          element={
            <Form15GHEntryWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
              zoneTranType={zoneTranType}
              dataRefetch={refetch}
            />
          }
        />
        <Route
          path="retrieve/*"
          element={
            <RetrievalParametersFormWrapper
              closeDialog={handleDialogClose}
              onDataRetrieved={handleDataRetrieved}
              zoneTranType={zoneTranType}
              dataRefetch={refetch}
            />
          }
        />
      </Routes>
    </>
  );
};
