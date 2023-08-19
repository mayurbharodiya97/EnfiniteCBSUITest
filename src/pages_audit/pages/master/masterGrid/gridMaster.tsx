import { GridMetaDataType } from "components/dataTable/types";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ClearCacheContext, ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
// import { Alert } from "reactstrap";
import { TradeMasterGridMetaData } from "../masterGridMetadata/tradeMaster";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query";

import { Alert } from "components/common/alert";
import { ListPopupMessageWrapper } from "components/dashboard/messageBox/listPopupBox/listPopupBox";
import { TradeMasterViewDetails } from "../masterViewDetails/tradeMaster/tradeMasterViewDetails";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const TradeMasterGrid = ({
  screenFlag,
  isAddButton,
  isDeleteButton,
}) => {
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const isDataChangedRef = useRef(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const { id } = useParams();
  // console.log("id", id);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMasterDetailsgridData"], () =>
    API.getMasterDetailsgridData({
      screenFlag,
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getMasterDetailsgridData",
        {
          screenFlag,
          userID: authState?.user?.id ?? "",
          // transactionID: data?.transactionID,
        },
      ]);
    };
  }, []);

  // Assuming actionMenu already contains some actions
  let actionMenu = [...actions];

  // Function to check if an action already exists in the actionMenu
  function isActionExists(actionName) {
    return actionMenu.some((action) => action.actionName === actionName);
  }

  if (Boolean(isAddButton) && !isActionExists("add")) {
    actionMenu.push({
      actionName: "add",
      actionLabel: "Add",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    });
  }

  if (Boolean(isDeleteButton) && !isActionExists("delete")) {
    actionMenu.push({
      actionName: "delete",
      actionLabel: "Delete",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    });
  }

  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  // const setCurrentAction = useCallback(
  //   (data) => {
  //     if (data.name === "add") {
  //       setIsOpenSave(true);
  //       // setRowsData(data?.rows);
  //     } else if (data.name === "view-details") {
  //       setIsOpenSave(true);
  //       setRowsData(data?.rows);
  //     } else {
  //       navigate(data?.name, {
  //         state: data?.rows,
  //       });
  //     }
  //   },
  //   [navigate]
  // );

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
    // setIsOpenSave(false);
  };

  let gridMetaData = TradeMasterGridMetaData;
  // if (screenFlag === "") {
  //   gridMetaData;
  // } else if (screenFlag === "") {
  //   gridMetaData;
  // } else if (screenFlag === "") {
  //   gridMetaData;
  // } else if (screenFlag === "") {
  //   gridMetaData;
  // } else if (screenFlag === "") {
  //   gridMetaData;
  // } else if (screenFlag === "") {
  //   gridMetaData;
  // }
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}

      <GridWrapper
        key={`MasterGrid`}
        finalMetaData={gridMetaData as unknown as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actionMenu}
        setAction={setCurrentAction}
        refetchData={() => refetch()}

        // ref={myGridRef}
      />
      {/* {actionMenu?.[1]?.actionName === "add" ? (
        <>
          {isOpenSave ? (
            <MasterViewDetails
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              formView={"view"}
              open={undefined}
            />
          ) : null}
        </>
      ) : null} */}
      {/* {actionMenu?.[1]?.actionName === "add" ? (
        <>
          {screenFlag === "TradeMaster" ? (
            <>
              {isOpenSave ? (
                <MasterViewDetails
                  isDataChangedRef={isDataChangedRef}
                  closeDialog={handleDialogClose}
                  open={undefined}
                  rowsData={rowsData}
                  formView="new"
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
      {actionMenu?.[0]?.actionName === "view-details" ? (
        <>
          {screenFlag === "TradeMaster" ? (
            <>
              {isOpenSave ? (
                <MasterViewDetails
                  isDataChangedRef={isDataChangedRef}
                  closeDialog={handleDialogClose}
                  formView="view"
                  open={undefined}
                  rowsData={rowsData}
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null} */}
      <Routes>
        <Route
          path="view-details/*"
          element={
            screenFlag === "TradeMaster" ? (
              <>
                <TradeMasterViewDetails
                  isDataChangedRef={isDataChangedRef}
                  closeDialog={handleDialogClose}
                  formView="edit"
                />
              </>
            ) : screenFlag === "" ? (
              <></>
            ) : screenFlag === "" ? (
              <></>
            ) : (
              <></>
            )
          }
        />
        <Route
          path="add/*"
          element={
            screenFlag === "TradeMaster" ? (
              <>
                <TradeMasterViewDetails
                  isDataChangedRef={isDataChangedRef}
                  closeDialog={handleDialogClose}
                  formView="new"
                />
              </>
            ) : screenFlag === "" ? (
              <></>
            ) : screenFlag === "" ? (
              <></>
            ) : (
              <></>
            )
          }
        />
      </Routes>
    </Fragment>
  );
};
export const TradeMasterGridForm = ({
  screenFlag,
  isAddButton,
  isDeleteButton,
}) => {
  return (
    <ClearCacheProvider>
      <TradeMasterGrid
        screenFlag={screenFlag}
        isAddButton={isAddButton}
        isDeleteButton={isDeleteButton} // key={screenFlag + ""}
        // screenFlag={screenFlag}
      />
    </ClearCacheProvider>
  );
};
