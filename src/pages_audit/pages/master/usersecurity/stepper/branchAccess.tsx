import {
  Fragment,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { userAccessbranch } from "./metaData/metaDataGrid";
import * as API from "./api/api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { useNavigate } from "react-router-dom";
import { SecurityContext } from "../context/SecuityForm";

import {
  extractGridMetaData,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "populate",
    actionLabel: "Populate",
    multiple: undefined,
    alwaysAvailable: true,
    rowDoubleClick: false,
  },
];

const BranchAccessRights = forwardRef<any, any>(
  ({ defaultView, username }, ref) => {
    const { authState } = useContext(AuthContext);
    const { userState, dispatchCommon, updateoldData1 } =
      useContext(SecurityContext);
    let Username = username?.USER_NAME;
    const [gridData, setGridData] = useState<any>([]);
    const [grid1Data, setGrid1Data] = useState<any>([]);
    const [combinedData, setCombinedData] = useState<any>([]);
    const navigate = useNavigate();
    const {
      data: mainData,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useQuery<any, any>(["getNewUserBranchAccess"], () => {
      if (defaultView === "new") {
        return API.getNewUserBranchAccess({
          comp_cd: authState?.companyID,
        });
      }
    });
    const {
      data: populateData,
      isLoading: loading,
      isFetching: fetching,
      refetch: Refetch,
    } = useQuery<any, any>(["getUserAccessBranch", Username], () => {
      if (defaultView === "edit" || defaultView === "view") {
        return API.getUserAccessBranch({
          userid: Username,
        });
      }
    });
    const mutation = useMutation(API.getNewUserBranchAccess, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: (data) => {
        setGrid1Data(data);
        dispatchCommon("commonType", {
          initPopulateData1: data,
        });
      },
    });

    // For showing Updated Grid Data in New Mode.
    useEffect(() => {
      if (
        defaultView === "new" &&
        userState?.grid2?.DETAILS_DATA?.isNewRow?.length > 0
      ) {
        const contextGrid = userState?.grid2?.DETAILS_DATA?.isNewRow;
        const updatedData = mainData.map((item) => {
          const contextItem = contextGrid.find(
            (gridItem) => gridItem.BRANCH_CD === item.BRANCH_CD
          );
          const loginAccessValue = contextItem
            ? contextItem.LOGIN_ACCESS === "Y"
            : false;
          const reportAccessValue = contextItem
            ? contextItem.REPORT_ACCESS === "Y"
            : false;
          return {
            ...item,
            LOGIN_ACCESS: loginAccessValue,
            REPORT_ACCESS: reportAccessValue,
          };
        });
        setGridData(updatedData);
      } else {
        setGridData(mainData);
      }
    }, [mainData, userState?.grid2?.DETAILS_DATA?.isNewRow, defaultView]);

    // For showing Populate Data when user come after save.
    useEffect(() => {
      if (
        defaultView === "edit" ||
        (defaultView === "view" && userState?.initPopulateData1)
      ) {
        setGrid1Data(userState?.initPopulateData1);
      }
    }, [userState?.initPopulateData1, defaultView]);

    // Saving Updated API response of Existing User for Edit Mode.
    useEffect(() => {
      if (populateData) {
        updateoldData1(populateData);
      }
    }, [populateData, grid1Data]);

    // For Combine API response data and Populated response data  and show combined data on grid Edit and View Mode.
    useEffect(() => {
      if (defaultView === "edit" || defaultView === "view") {
        if (populateData && grid1Data) {
          setGridData(populateData);
          updateoldData1(populateData);

          const updatedGrid1Data = grid1Data.map((gridItem) => ({
            ...gridItem,
            BRANCH_CD: gridItem.BRANCH_CD,
            LOGIN_ACCESS: gridItem.LOGIN_ACCESS === "Y" ? true : false,
            REPORT_ACCESS: gridItem.REPORT_ACCESS === "Y" ? true : false,
          }));

          let filteredGrid1Data = updatedGrid1Data.filter(
            (gridItem) =>
              !populateData.some(
                (dataItem) => dataItem.BRANCH_NM === gridItem.BRANCH_NM
              )
          );

          filteredGrid1Data = filteredGrid1Data.map((row) => ({
            ...row,
            _isNewRow: true,
          }));
          const combined = [...populateData, ...filteredGrid1Data];
          setGridData(combined);
          setCombinedData(combined);
        }
      }
    }, [populateData, grid1Data, defaultView]);

    // For getting Previous Saved Records from Context in Edit and View Mode.
    useEffect(() => {
      if (
        (defaultView === "edit" || defaultView === "view") &&
        (userState?.grid2?.isUpdatedRow?.length > 0 ||
          userState?.grid2?.isNewRow?.length > 0)
      ) {
        const contextGrid = [
          ...(userState?.grid2?.isNewRow || []),
          ...(userState?.grid2?.isUpdatedRow || []),
        ];
        const updatedData = combinedData.map((item) => {
          const contextItem = contextGrid.find(
            (gridItem) => gridItem.BRANCH_CD === item.BRANCH_CD
          );
          let loginAccessValues = item.LOGIN_ACCESS;
          let reportAccessValues = item.REPORT_ACCESS;
          if (contextItem) {
            loginAccessValues =
              contextItem?.LOGIN_ACCESS === "Y" ||
              contextItem?.LOGIN_ACCESS === true
                ? true
                : false;
            reportAccessValues =
              contextItem?.REPORT_ACCESS === "Y" ||
              contextItem?.REPORT_ACCESS === true
                ? true
                : false;
          }
          return {
            ...item,
            LOGIN_ACCESS: loginAccessValues,
            REPORT_ACCESS: reportAccessValues,
          };
        });
        setGridData(updatedData);
      }
    }, [
      combinedData,
      userState?.grid2?.isNewRow,
      userState?.grid2?.isUpdatedRow,
      defaultView,
    ]);
    const setCurrentAction = useCallback(
      (data) => {
        if (data.name === "populate") {
          mutation.mutate({ comp_cd: authState?.companyID });
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      },
      [navigate]
    );
    return (
      <Fragment>
        <GridWrapper
          key={`userAccessbranch`}
          finalMetaData={
            extractGridMetaData(
              userAccessbranch,
              defaultView
            ) as GridMetaDataType
          }
          data={gridData || []}
          actions={defaultView === "edit" ? actions : []}
          setAction={setCurrentAction}
          loading={
            fetching ||
            loading ||
            mutation?.isLoading ||
            isLoading ||
            isFetching
          }
          setData={setGridData}
          refetchData={() => {
            refetch();
            Refetch();
          }}
          ref={ref}
        />
      </Fragment>
    );
  }
);

export default BranchAccessRights;
