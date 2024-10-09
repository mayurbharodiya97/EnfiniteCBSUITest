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
  {
    actionName: "viewAll",
    actionLabel: "View All",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
    shouldExclude: (rows) => {
      return false;
    },
  },
];

export const FDConfirmationGrid = () => {
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const [actionMenu, setActionMenu] = useState(actions);
  const [displayAction, setDisplayAction] = useState("P");
  const [gridData, setGridData] = useState([]);

  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    ["getFdConfirmationData", authState?.user?.branchCode],
    () =>
      API.getFdConfirmationData({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
      }),
    {
      onSuccess: async (data) => {
        if (Boolean(displayAction) && displayAction === "V") {
          setGridData(data);
        } else if (Boolean(displayAction) && displayAction === "P") {
          const filterData = data.filter((item) => item.CONFIRMED !== "Y");
          setGridData(filterData);
        } else {
          setGridData(data);
        }
      },
    }
  );

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-details") {
        {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      } else if (data?.name === "viewAll") {
        setActionMenu((values) =>
          values.map((item) =>
            item.actionName === "viewAll"
              ? { ...item, actionName: "pending", actionLabel: "Pending" }
              : item
          )
        );
        setDisplayAction("V");
        refetch();
      } else if (data?.name === "pending") {
        refetch();
        setActionMenu((values) =>
          values.map((item) =>
            item.actionName === "pending"
              ? { ...item, actionName: "viewAll", actionLabel: "view All" }
              : item
          )
        );
        setDisplayAction("P");
      }
    },
    [navigate]
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
        key={`fixDepositConfirmationGrid` + displayAction + gridData}
        finalMetaData={FDConfirmationGridMetaData as GridMetaDataType}
        data={gridData ?? []}
        setData={setGridData}
        loading={isLoading || isFetching}
        actions={actionMenu}
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
