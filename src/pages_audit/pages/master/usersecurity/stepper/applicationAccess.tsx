import { Fragment, forwardRef, useCallback, useContext, useEffect, useState } from "react";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import * as API from "./api/api";
import { applicationAccess } from "./metaData/metaDataGrid";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { SecurityContext } from "../context/SecuityForm";
import { extractGridMetaData } from "components/utils";

const actions: ActionTypes[] = [
  {
    actionName: "populate",
    actionLabel: "Populate",
    multiple: undefined,
    alwaysAvailable: true,
    rowDoubleClick: false,
  },
];


const NewApplicationAccess = forwardRef<any, any>(({ defaultView, username }, ref) => {
  const Username = username?.USER_NAME;
  const [gridData, setGridData] = useState<any>([]);
  const [grid1Data, setGrid1Data] = useState<any>([]);
  const [combinedData, setCombinedData] = useState<any>([]);
  const { userState, updateoldData, dispatchCommon } = useContext(SecurityContext);
  const navigate = useNavigate();
  
  // Get API for New User.
  const { data: newData, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getnewapplicationaccess"], () => {
    if (defaultView === "new") {
      return API.getnewapplicationaccess({ userid: "" });
    }
  });

  // Get API for Existing User.
  const { data: applicationData, isLoading: loading, isFetching: fetching, refetch: Refetch } = useQuery(
    ["getapplicationaccess", Username],
    () => {
      if (defaultView === "edit" || defaultView === "view") {
        return API.getapplicationaccess({ userid: Username });
      }
    }
  );

  // Get API for Populate Data
  const mutation = useMutation(API.getnewapplicationaccess, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
    },
    onSuccess: (data) => {
      setGrid1Data(data);
      dispatchCommon("commonType", { initPopulateData: data });
    },
  });
// For getting Previous Saved Records from Context in New Mode.
  useEffect(() => {
    if (defaultView === "new" && userState?.grid1?.DETAILS_DATA?.isNewRow?.length > 0) {
      const contextGrid = userState?.grid1?.DETAILS_DATA?.isNewRow;
      const updatedData = newData.map((item) => {
        const contextItem = contextGrid.find((gridItem) => gridItem.APP_TRAN_CD === item.TRAN_CD);
        const loginAccessValue = contextItem ? contextItem.LOGIN_ACCESS === "Y" : false;
        return { ...item, LOGIN_ACCESS: loginAccessValue };
      });
      setGridData(updatedData);
    } else {
      setGridData(newData);
    }
  }, [newData, userState?.grid1?.DETAILS_DATA?.isNewRow, defaultView]);

  // Saving Populate Data on Context Edit Mode 
  useEffect(() => {
    if (defaultView === "edit" || defaultView === "view" && userState?.initPopulateData) {
      setGrid1Data(userState.initPopulateData);
    }
  }, [userState?.initPopulateData, defaultView]);

  // Saving Updated API response of Existing User for Edit Mode.
  useEffect(() => {
    if (applicationData) {
      updateoldData(applicationData);
    }
  }, [applicationData, grid1Data]);

  // For Combine API response data and Populated response data Edit and View Mode.
  useEffect(() => {
    if (defaultView === "edit" || defaultView === "view") {
      if (applicationData && grid1Data) {
        setGridData(applicationData);
        updateoldData(applicationData);

        const updatedGrid1Data = grid1Data.map((gridItem) => ({
          ...gridItem,
          APP_TRAN_CD: gridItem.TRAN_CD,
          LOGIN_ACCESS: gridItem.LOGIN_ACCESS === "Y" ? true : false,
        }));

        let filteredGrid1Data = updatedGrid1Data.filter(
          (gridItem) => !applicationData.some((dataItem) => dataItem.APP_NM === gridItem.APP_NM)
        );

        filteredGrid1Data = filteredGrid1Data.map((row) => ({ ...row, _isNewRow: true }));
        const combined = [...applicationData, ...filteredGrid1Data];
        setGridData(combined);
        setCombinedData(combined);
      }
    }
  }, [applicationData, grid1Data, userState?.initPopulateData, defaultView]);

  // For getting Previous Saved Records from Context in Edit and View Mode.
  useEffect(() => {
    if (
      (defaultView === "edit" || defaultView === "view") &&
      (userState?.grid1?.isUpdatedRow?.length > 0 || userState?.grid1?.isNewRow?.length > 0 || userState?.grid1?.isDeleteRow?.length > 0)
    ) {
      const contextGrid = [
        ...(userState?.grid1?.isNewRow || []),
        ...(userState?.grid1?.isUpdatedRow || []),
        ...(userState?.grid1?.isDeleteRow || []),
      ];
      const updatedData = combinedData.map((item) => {
        const contextItem = contextGrid.find((gridItem) => gridItem.APP_TRAN_CD === item.APP_TRAN_CD);
        return contextItem
          ? { ...item, LOGIN_ACCESS: contextItem.LOGIN_ACCESS === "Y" }
          : item;
      });
      setGridData(updatedData);
    }
  }, [combinedData, userState?.grid1?.isNewRow, userState?.grid1?.isUpdatedRow, userState?.grid1?.isDeleteRow, defaultView]);

  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "populate") {
        mutation.mutate({ userid: "" });
      } else {
        navigate(data.name, { state: data.rows });
      }
    },
    [navigate]
  );

  return (
    <Fragment>
      <GridWrapper
        key={`userAccessbranch`}
        finalMetaData={extractGridMetaData(applicationAccess, defaultView) as GridMetaDataType}
        actions={defaultView === "edit" ? actions : []}
        setAction={setCurrentAction}
        data={gridData || []}
        loading={fetching || loading || mutation?.isLoading || isLoading || isFetching}
        setData={setGridData}
        hideHeader={true}
        ref={ref}
        refetchData={() => {
          refetch();
          Refetch();
        }}
      />
    </Fragment>
  );
});

export default NewApplicationAccess;
