import {
  Fragment,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { productaccess } from "./metaData/metaDataGrid";
import * as API from "./api/api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { useNavigate } from "react-router-dom";
import { SecurityContext } from "../context/SecuityForm";

import {
  extractGridMetaData,
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

export const ProductAccess = forwardRef<any, any>(
  ({ defaultView, username }, ref) => {
    const Username = username?.USER_NAME;
    const { authState } = useContext(AuthContext);
    const { userState, dispatchCommon, updateoldData2 } =
      useContext(SecurityContext);
    const [gridData, setGridData] = useState<any>([]);
    const [grid1Data, setGrid1Data] = useState<any>([]);
    const [combinedData, setCombinedData] = useState<any>([]);
    const [rowsData, setRowsData] = useState<any>([]);
    const navigate = useNavigate();

    const {
      data: mainData,
      isLoading,
      isFetching,
      refetch,
    } = useQuery<any, any>(
      ["getNewUserProductAccess"],
      () =>
        API.getNewUserProductAccess({
          base_branch_cd: authState?.user?.baseBranchCode,
          base_comp_cd: authState?.baseCompanyID,
        }),
      { enabled: defaultView === "new" }
    );

    const {
      data: populateData,
      isLoading: loading,
      isFetching: fetching,
      refetch: Refetch,
    } = useQuery<any, any>(
      ["getproductaccess", Username],
      () => API.getproductaccess({ userid: Username }),
      { enabled: defaultView === "edit" || defaultView === "view" }
    );

    const mutation = useMutation(API.getNewUserProductAccess, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occurred";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: (data) => {
        setGrid1Data(data);
        dispatchCommon("commonType", {
          initPopulateData2: data,
        });
      },
    });
    useEffect(() => {
      if (defaultView === "new") {
        if (userState?.grid3?.DETAILS_DATA?.isNewRow?.length > 0) {
          const contextGrid = userState.grid3.DETAILS_DATA.isNewRow;
          const updatedData = mainData.map((item) => {
            const contextItem = contextGrid.find(
              (gridItem) => gridItem.ACCT_TYPE === item.ACCT_TYPE
            );
            return contextItem
              ? { ...item, ACCESS: contextItem.ACCESS === "Y" ? true : "N" }
              : item;
          });
          setGridData(updatedData);
        } else {
          setGridData(mainData);
        }
      }
    }, [mainData, userState, defaultView]);
    useEffect(() => {
      if (
        defaultView === "edit" ||
        (defaultView === "view" && userState?.initPopulateData2)
      ) {
        setGrid1Data(userState?.initPopulateData2);
      }
    }, [userState?.initPopulateData1, defaultView]);
    useEffect(() => {
      if (populateData) {
        updateoldData2(populateData);
      }
    }, [populateData, grid1Data]);
    useEffect(() => {
      if (defaultView === "edit" || defaultView === "view") {
        if (populateData && grid1Data) {
          setGridData(populateData);
          updateoldData2(populateData);

          const updatedGrid1Data = grid1Data.map((gridItem) => ({
            ...gridItem,
            ACCESS: gridItem.ACCESS === "Y" ? true : false,
          }));
          let filteredGrid1Data = updatedGrid1Data.filter(
            (gridItem) =>
              !populateData.some(
                (dataItem) => dataItem.ACCT_TYPE === gridItem.ACCT_TYPE
              )
          );
          filteredGrid1Data = filteredGrid1Data.map((row) => ({
            ...row,
            _isNewRow: true,
          }));
          const combinedData = [...populateData, ...filteredGrid1Data];
          setGridData(combinedData);
          setCombinedData(combinedData);
        }
      }
    }, [populateData, grid1Data, defaultView]);

    useEffect(() => {
      if (
        defaultView === "edit" ||
        (defaultView === "view" &&
          (userState?.grid3?.isUpdatedRow?.length > 0 ||
            userState?.grid3?.isNewRow?.length > 0 ||
            userState?.grid3?.isDeleteRow?.length > 0))
      ) {
        const contextGrid = [
          ...(userState?.grid3?.isNewRow || []),
          ...(userState?.grid3?.isUpdatedRow || []),
          ...(userState?.grid3?.isDeleteRow || []),
        ];
        const updatedData = combinedData.map((item) => {
          const contextItem = contextGrid.find(
            (gridItem) => gridItem.ACCT_TYPE === item.ACCT_TYPE
          );
          return contextItem
            ? { ...item, ACCESS: contextItem.ACCESS === "Y" }
            : item;
        });
        setGridData(updatedData);
      }
    }, [
      combinedData,
      userState?.grid3?.isNewRow,
      userState?.grid3?.isUpdatedRow,
      userState?.grid3?.isDeleteRow,
      defaultView,
    ]);
    useEffect(() => {
      if (
        defaultView === "new" &&
        userState?.grid3?.DETAILS_DATA?.isNewRow?.length > 0
      ) {
        const contextGrid = userState?.grid3?.DETAILS_DATA?.isNewRow;
        const updatedData = mainData.map((item) => {
          const contextItem = contextGrid.find(
            (gridItem) => gridItem.ACCT_TYPE === item.ACCT_TYPE
          );
          if (contextItem) {
            return {
              ...item,
              ACCESS: contextItem.ACCESS === "Y" ? true : "N",
            };
          }
          return item;
        });
        setGridData(updatedData);
      }
    }, [mainData, userState?.grid3?.isNewRow, defaultView]);

    const setCurrentAction = useCallback(
      (data) => {
        if (data.name === "populate") {
          setRowsData(data?.rows);
          mutation.mutate({
            base_branch_cd: authState?.user?.baseBranchCode,
            base_comp_cd: authState?.baseCompanyID,
          });
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      },
      [navigate, mutation, authState]
    );

    return (
      <Fragment>
        <GridWrapper
          key={`userAccessbranch`}
          finalMetaData={
            extractGridMetaData(productaccess, defaultView) as GridMetaDataType
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
