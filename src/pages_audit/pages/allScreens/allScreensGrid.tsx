import { ClearCacheProvider, ClearCacheContext } from "cache";
import { Fragment, useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import { AllScreensGridMetaData } from "./gridMetadata";
import { AuthContext } from "pages_audit/auth";
import { utilFunction } from "components/utils/utilFunctions";
const actions: ActionTypes[] = [
  {
    actionName: "allScreens",
    actionLabel: "Release",
    multiple: true,
    rowDoubleClick: true,
  },
];
export const ReleaseUsers = () => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const result: any = {};
  const allScreenData = useMemo(() => {
    let responseData = utilFunction.GetAllChieldMenuData(
      authState.menulistdata,
      true
    );
    return responseData;
  }, [authState.menulistdata]);
  const setCurrentAction = useCallback(
    (data) => {
      if ((data?.name ?? "") === "allScreens") {
        let path = data?.rows?.[0]?.data?.href;
        if (Boolean(path)) {
          navigate("../" + path);
        }
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  // const result = useQuery<any, any>(["getAllScreensGridData"], () =>
  //   API.getAllScreensGridData()
  // );
  // const handleDialogClose = () => {
  //   navigate(".");
  //   if (isDataChangedRef.current === true) {
  //     myGridRef.current?.refetch?.();
  //     isDataChangedRef.current = false;
  //   }
  // };
  // useEffect(() => {
  //   return () => {
  //     let entries = getEntries() as any[];
  //     entries.forEach((one) => {
  //       queryClient.removeQueries(one);
  //     });
  //     queryClient.removeQueries(["getPartnerGridData"]);
  //   };
  // }, [getEntries]);
  //result.isError = true;
  //result.error.error_msg = "Something went to wrong..";
  return (
    <Fragment>
      {result.isError && (
        <Alert
          severity="error"
          errorMsg={result.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={result.error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`allScreensGrid`}
        finalMetaData={AllScreensGridMetaData as GridMetaDataType}
        data={allScreenData}
        setData={() => null}
        loading={false}
        actions={actions}
        setAction={setCurrentAction}
        ref={myGridRef}
      />
    </Fragment>
  );
};

export const AllScreensGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <ReleaseUsers />
    </ClearCacheProvider>
  );
};
