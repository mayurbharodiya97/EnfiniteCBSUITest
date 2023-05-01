import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
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
import { ParametersGridMetaData } from "./gridMetadata";
import { useSnackbar } from "notistack";
import { ParaDetailEditWrapper } from "./editParaDetail";
//import { ReleaseUsersAPIWrapper } from "../releaseUsers";
const actions: ActionTypes[] = [
  {
    actionName: "global",
    actionLabel: "Global Level",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
    shouldExclude: (rows) => {
      return true;
    },
  },
  {
    actionName: "edit-detail",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const Parameters = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const [actionMenu, setActionMenu] = useState(actions);
  const [paraType, setParaType] = useState("H");
  const navigate = useNavigate();
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
        setParaType("G");
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
        setParaType("H");
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
  >(["getParametersGridData", paraType], () =>
    API.getParametersGridData(paraType)
  );
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getParametersGridData", paraType]);
    };
  }, [getEntries, paraType]);

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
        key={"parametersGrid" + paraType}
        finalMetaData={ParametersGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actionMenu}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      <Routes>
        <Route
          path="edit-detail/*"
          element={
            <ParaDetailEditWrapper
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

export const ParametersGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <Parameters />
    </ClearCacheProvider>
  );
};
