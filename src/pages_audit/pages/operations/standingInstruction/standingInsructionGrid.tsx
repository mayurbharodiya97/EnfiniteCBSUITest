import { Fragment, useContext, useEffect, useState } from "react";
import { useRef, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { standingInsructionGridMetaData } from "./gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { usePopupContext } from "components/custom/popupContext";
import { StandingInstructionFormWrapper } from "./standingInstructionTemplate";
import { ClearCacheProvider, queryClient } from "cache";
import SIAsExcutedGrid from "./siAsExcuted";
import SearchGrid from "./searchGrid";
import AddSubData from "./addSubdata";

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
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },

  {
    actionName: "search",
    actionLabel: "Search",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "si-as-executed",
    actionLabel: "SI as Executed",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const StandingInstructionGrid = () => {
  const authController = useContext(AuthContext);
  const isDataChangedRef = useRef(false);
  const isDeleteDataRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [opens, setOpens] = useState(false);
  // const [viewDetailData, setViewDetailData] = useState(null);
  // const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  // const { state: rows } = useLocation();
  // const tranCd = rows?.[0]?.data?.TRAN_CD;
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "Delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        const btnName = await MessageBox({
          message: "Are you sure to delete selected row?",
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          // loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          //   deleteMutation.mutate({
          //     ...isDeleteDataRef.current?.data,
          //     _isDeleteRow: true,
          //   });
        }
      }
      // if (data?.name === "view-details") {
      //   setViewDetailData(data?.rows?.[0]);
      //   setIsViewDetailOpen(true); // Open the StadingInstructionViewData
      // } else {
      //   setIsViewDetailOpen(false); // Close the StadingInstructionViewData for other actions
      // }
      if (data?.name === "si-as-executed" || data?.name === "search" || data?.name === "view-details") {
        setOpens(true);
      }
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate, MessageBox]
  );
  const { data, isLoading, isFetching, isError, error, refetch: mainRefetch } = useQuery<
    any,
    any
  >(["getStandingInstructionData"], () =>
    API.getStandingInstructionData({
      companyID: authController?.authState?.companyID,
      branchCode: authController?.authState?.user?.branchCode,
    })
  );
  useEffect(() => {
    navigate("add");
  }, []);

  const ClosedEventCall = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      mainRefetch();
      isDataChangedRef.current = false;
    }
    // setIsViewDetailOpen(false);
    navigate(".");
  };
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getStandingInstructionData"]);
    };
  }, []);
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
        key={"standingInsructionGridMetaData"}
        finalMetaData={standingInsructionGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => mainRefetch()}
      />
      {/* {isViewDetailOpen && <StadingInstructionViewData />} */}
      <Routes>
        <Route
          path="add/*"
          element={
            <StandingInstructionFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
              data={data}
            />
          }
        />

        <Route
          path="si-as-executed"
          element={<SIAsExcutedGrid open={opens} onClose={() => setOpens(false)} />}
        />
        <Route
          path="search"
          element={<SearchGrid open={opens} onClose={() => setOpens(false)} />}
        />
        <Route
          path="view-details"
          element={<AddSubData open={opens} onClose={() => setOpens(false)} mainRefetch={mainRefetch} />}
        />
      </Routes>
    </Fragment>
  );
};

export const StandingInstructionGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <StandingInstructionGrid />
    </ClearCacheProvider>
  );
};
