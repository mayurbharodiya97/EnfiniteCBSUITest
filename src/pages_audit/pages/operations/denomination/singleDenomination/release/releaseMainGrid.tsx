import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
  utilFunction,
} from "@acuteinfo/common-base";
import { Box, Dialog } from "@mui/material";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { releaseGridMetaData } from "./metadata";
import ReleaseSubGrid from "./releaseSubGrid";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";
import { useCacheWithMutation } from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/cacheMutate";
import * as CommonAPI from "../../api";
import DailyTransTabs from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs";
import { enqueueSnackbar } from "notistack";
const actions: ActionTypes[] = [
  {
    actionName: "cancle",
    actionLabel: "Cancel",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "release",
    actionLabel: "Release",
    multiple: true,
    rowDoubleClick: true,
  },
];

const ReleaseMainGrid = ({ setOpenGrid }) => {
  const [cardTabsReq, setCardTabsReq] = useState({});
  const [cardDetails, setCardDetails] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const currentPath = useLocation()?.pathname;
  const controllerRef = useRef<AbortController>();

  const reqObject = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };
  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    setData: setTabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  } = useCacheWithMutation("releaseMainData", CommonAPI.getTabsByParentType);

  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchMainGrid,
    error,
    isError,
  } = useQuery<any, any>(["releaseMainData", { ...reqObject }], () =>
    API?.getReleaseGridData({ ...reqObject })
  );

  const getCarousalCards = useMutation(CommonAPI.getCarousalCards, {
    onSuccess: (data) => {
      setCardDetails(data);
    },
    onError: (error: any) => {
      if (
        error?.error_msg !==
        "Timeout : Your request has been timed out or has been cancelled by the user."
      ) {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      }
      setCardDetails([]);
    },
  });

  const setCurrentAction = useCallback(
    (data) => {
      let row = data?.rows[0]?.data;
      if (data?.name === "_rowChanged") {
        let obj: any = {
          COMP_CD: row?.COMP_CD,
          ACCT_TYPE: row?.ACCT_TYPE,
          ACCT_CD: row?.ACCT_CD,
          PARENT_TYPE: row?.PARENT_TYPE ?? "",
          PARENT_CODE: row?.PARENT_CODE ?? "",
          BRANCH_CD: row?.BRANCH_CD,
        };
        setCardTabsReq(obj);
        let reqData = {
          COMP_CD: obj?.COMP_CD,
          ACCT_TYPE: obj?.ACCT_TYPE,
          BRANCH_CD: obj?.BRANCH_CD,
        };
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        // Create a new AbortController
        controllerRef.current = new AbortController();
        fetchTabsData({
          cacheId: reqData?.ACCT_TYPE,
          reqData: reqData,
          controllerFinal: controllerRef.current,
        });
        getCarousalCards.mutate({
          reqData: obj,
          controllerFinal: controllerRef.current,
        });
      } else if (data?.name === "cancle") {
        setOpenGrid(false);
      } else if (data?.name === "release") {
        navigate(data?.name, {
          state: data?.rows[0]?.data,
        });
      }
    },
    [actions, navigate]
  );

  const handleRlsSubgridClose = () => {
    navigate(".");
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["releaseMainData", { ...reqObject }]);
    };
  }, []);

  return (
    <>
      <Box margin={"0px 16px"}>
        <DailyTransTabs
          heading={utilFunction.getDynamicLabel(
            currentPath,
            authState?.menulistdata,
            true
          )}
          tabsData={tabsDetails}
          cardsData={cardDetails}
          reqData={cardTabsReq}
        />
        {isError ? (
          <Fragment>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </Fragment>
        ) : null}
        <GridWrapper
          key={`releaseGridMetaData` + isLoading}
          finalMetaData={releaseGridMetaData as GridMetaDataType}
          data={data ?? []}
          loading={
            isLoading ||
            isFetching ||
            isTabsLoading ||
            getCarousalCards?.isLoading
          }
          setData={() => {}}
          actions={actions}
          setAction={setCurrentAction}
          hideHeader={false}
          controlsAtBottom={true}
          refetchData={() => refetchMainGrid()}
          disableMultipleRowSelect={true}
          enableExport={true}
          defaultSelectedRowId={data?.length > 0 ? data?.[0]?.MCT_TRAN_CD : ""}
        />
      </Box>

      <Routes>
        <Route
          path="release/*"
          element={
            <ReleaseSubGrid
              handleRlsSubClose={handleRlsSubgridClose}
              refetchMainGrid={refetchMainGrid}
            />
          }
        />
      </Routes>
    </>
  );
};

export default ReleaseMainGrid;
