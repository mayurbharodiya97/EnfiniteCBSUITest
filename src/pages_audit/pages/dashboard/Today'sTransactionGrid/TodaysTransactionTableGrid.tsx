import GridWrapper from "components/dataTableStatic";
import { TodaysTransactionTableGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import { useQuery } from "react-query";
import * as API from "../api";
import { useCallback, useContext, useEffect } from "react";
import { AuthContext } from "pages_audit/auth";
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
const TodaysTransactionTableGrid = ({ mutation }) => {
  const { authState } = useContext(AuthContext);

  const setCurrentAction = useCallback((data) => {
    // console.log(">>data", data);
  }, []);
  return (
    <>
      <GridWrapper
        key={`TodaysTransactionTableGrid`}
        finalMetaData={TodaysTransactionTableGridMetaData as GridMetaDataType}
        data={mutation?.data ?? []}
        setData={() => null}
        // actions={actions}
        // setAction={setCurrentAction}
        headerToolbarStyle={{
          backgroundColor: "var(--theme-color2)",
          color: "black",
        }}
        loading={mutation.isLoading || mutation.isFetching}
      />
    </>
  );
};

export const TodaysTransactionTableGridWrapper = ({ mutation }) => {
  return (
    <ClearCacheProvider>
      <TodaysTransactionTableGrid mutation={mutation} />
    </ClearCacheProvider>
  );
};
