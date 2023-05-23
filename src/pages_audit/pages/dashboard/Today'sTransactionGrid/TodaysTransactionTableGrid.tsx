import GridWrapper from "components/dataTableStatic";
import { TodaysTransactionTableGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider } from "cache";
import { useQuery } from "react-query";
import * as API from "../api";
import { useCallback } from "react";

// const actions: ActionTypes[] = [
//   {
//     actionName: "See All",
//     actionLabel: "See all",
//     multiple: undefined,
//     rowDoubleClick: false,
//     actionTextColor: "var(--theme-color3)",
//     alwaysAvailable: true,
//     actionBackground: "inherit",
//   },
// ];

const TodaysTransactionTableGrid = () => {
  const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
    ["TodaysTransactionTableGrid"],
    () => API.TodaysTransactionTableGrid()
  );

  const setCurrentAction = useCallback((data) => {
    // console.log(">>data", data);
  }, []);
  return (
    <>
      <GridWrapper
        key={`quickAccessGrid`}
        finalMetaData={TodaysTransactionTableGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        // actions={actions}
        // setAction={setCurrentAction}
        headerToolbarStyle={{
          backgroundColor: "var(--theme-color2)",
          color: "black",
        }}
      />
    </>
  );
};

export const TodaysTransactionTableGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <TodaysTransactionTableGrid />
    </ClearCacheProvider>
  );
};
