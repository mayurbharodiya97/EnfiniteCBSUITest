import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { DynFormGridMetaData } from "./gridMetadata";
import { AuthContext } from "pages_audit/auth";
import { DynamicFormMetadataWrapper } from "./dynFormMetadataConfigCrud/DynFormMetadataConfig";
// import { DynamicFormMetadataWrapper } from "./dynamicMetadataConfig/DynFormMetadataConfig";
// import {
//   AddDynamicReportConfigWrapper,
//   ViewEditDynamicReportConfigWrapper,
// } from "./dynamicReportConfigCrud";
//import { ReleaseUsersAPIWrapper } from "../releaseUsers";
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
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const DynFormMetadataConfig = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const [actionMenu, setActionMenu] = useState(actions);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "global") {
        setActionMenu((values: any) => {
          return values.map((item) => {
            if (item.actionName === "global") {
              return { ...item, actionName: "hopara", actionLabel: "HO Level" };
            } else {
              return item;
            }
          });
          //return { ...value };
        });
      } else if (data.name === "hopara") {
        setActionMenu((values: any) => {
          return values.map((item) => {
            if (item.actionName === "hopara") {
              return {
                ...item,
                actionName: "global",
                actionLabel: "Global Level",
              };
            } else {
              return item;
            }
          });
        });
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDynMetadataGridConfigData"], () =>
    API.getDynMetadataGridConfigData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
    })
  );
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getDynMetadataGridConfigData"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      myGridRef.current?.refetch?.();
      isDataChangedRef.current = false;
    }
  }, [navigate]);

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
        key={"DynFormGridMetaData"}
        finalMetaData={DynFormGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actionMenu}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
        // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
      />
      <Routes>
        <Route
          path="add/*"
          element={
            <DynamicFormMetadataWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
            />
          }
        />
        {/* <Route
          path="delete"
          element={
            <DeleteSchemeMasterWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
            />
          }
        /> */}
        <Route
          path="view-details/*"
          element={
            <DynamicFormMetadataWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"view"}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

// export const ParametersGridWrapper = () => {
//   return (
//     <ClearCacheProvider>
//       <DynamicReportConfig />
//     </ClearCacheProvider>
//   );
// };
