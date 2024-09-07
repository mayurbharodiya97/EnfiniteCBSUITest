import {
  useContext,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { useQueries } from "react-query";
import { ClearCacheContext } from "cache";
import { ActionTypes, GridMetaDataType } from "components/dataTable";
import { CRUDContext } from "./context";
import { cacheWrapperKeyGen } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";

type GridWrapperType = {
  actions: ActionTypes[];
  setAction: any;
};

export const MyGridWrapper = forwardRef<any, GridWrapperType>(
  ({ actions, setAction }, ref) => {
    const { addEntry } = useContext(ClearCacheContext);
    const { getGridFormData, getGridFormMetaData, context } =
      useContext(CRUDContext);
    const wrapperKey = useRef<any>(null);
    if (wrapperKey.current === null) {
      wrapperKey.current = cacheWrapperKeyGen(
        Object.values(getGridFormData.args)
      );
    }
    const result = useQueries([
      {
        queryKey: ["getGridFormMetaData", wrapperKey.current],
        queryFn: () => getGridFormMetaData.fn(getGridFormMetaData.args)(),
      },
      {
        queryKey: ["getStaticGridData", wrapperKey.current],
        queryFn: () => getGridFormData.fn(getGridFormData.args)(),
      },
    ]);
    useEffect(() => {
      addEntry(["getGridFormMetaData", wrapperKey.current]);
      addEntry(["getStaticGridData", wrapperKey.current]);
    }, [addEntry]);
    useImperativeHandle(ref, () => ({
      refetch: () => result[1].refetch(),
    }));
    const loading = result[0].isLoading || result[0].isFetching;

    let isError = result[0].isError || result[1].isError;
    //@ts-ignore
    let errorMsg = `${result[0].error?.error_msg} ${result[1].error?.error_msg}`
      .trimStart()
      .trimEnd();
    errorMsg = !Boolean(errorMsg) ? "unknown error occured" : errorMsg;
    const renderResult = loading ? (
      <LoaderPaperComponent />
    ) : isError === true ? (
      <span>{errorMsg}</span>
    ) : (
      <GridWrapper
        key={`staticGridData-${wrapperKey.current}`}
        finalMetaData={result[0].data as GridMetaDataType}
        data={result[1].data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setAction}
        loading={result[1].isLoading || result[1].isFetching}
        gridProps={context}
      />
    );
    return renderResult;
  }
);
MyGridWrapper.displayName = "MyGridWrapper";
