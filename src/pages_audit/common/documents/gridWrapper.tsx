import {
  useContext,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  Fragment,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { useQueries } from "react-query";
import { ClearCacheContext, cacheWrapperKeyGen } from "cache";
import { ActionTypes, GridMetaDataType } from "components/dataTable";
import { DOCCRUDContext } from "./context";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import Alert from "@mui/material/Alert";

type GridWrapperType = {
  actions: ActionTypes[];
  setAction: any;
  transformData?: any;
  defaultSortOrder?: any;
  defaultGroupBy?: any;
};

export const MyGridWrapper = forwardRef<any, GridWrapperType>(
  (
    {
      actions,
      setAction,
      transformData = (data) => data,
      defaultSortOrder,
      defaultGroupBy,
    },
    ref
  ) => {
    const { addEntry } = useContext(ClearCacheContext);
    const { getDocumentsGridData, getDocumentListingGridMetaData, context } =
      useContext(DOCCRUDContext);
    const docType = context.docCategory.filter((one) => one.primary === true)[0]
      .type;
    const wrapperKey = useRef<any>(null);
    if (wrapperKey.current === null) {
      wrapperKey.current = cacheWrapperKeyGen(
        Object.values(getDocumentsGridData.args)
      );
    }
    useEffect(() => {
      addEntry(["getDocumentListingGridMetaData", context.refID, docType]);
      addEntry(["getDocumentsGridData", wrapperKey.current, docType]);
    }, [addEntry, context, docType]);

    useImperativeHandle(ref, () => ({
      refetch: () => result[0].refetch(),
    }));

    const result = useQueries([
      {
        queryKey: ["getDocumentsGridData", wrapperKey.current, docType],
        queryFn: () =>
          getDocumentsGridData.fn(getDocumentsGridData.args)(docType),
      },
      {
        queryKey: ["getDocumentListingGridMetaData", context.refID, docType],
        queryFn: () =>
          getDocumentListingGridMetaData.fn(
            getDocumentListingGridMetaData.args
          )(docType),
      },
    ]);

    const renderResult =
      result[1].isLoading || result[1].isFetching ? (
        <LoaderPaperComponent />
      ) : result[1].isError ? (
        <span>
          {
            //@ts-ignore
            result[1]?.error?.error_msg ?? "Unknown Error occured"
          }
        </span>
      ) : (
        <Fragment>
          {result[0].isError ? (
            <Alert severity="error">
              {
                //@ts-ignore
                result[0]?.error?.error_msg ?? "Unknown Error occured"
              }
            </Alert>
          ) : null}
          <GridWrapper
            key={`listingDocuments`}
            data={transformData(result[0].data ?? [])}
            finalMetaData={result[1].data as GridMetaDataType}
            setData={() => null}
            actions={actions}
            setAction={setAction}
            loading={result[0].isFetching || result[0].isLoading}
            refetchData={() => result[0].refetch()}
            defaultSortOrder={defaultSortOrder}
            defaultGroupBy={defaultGroupBy}
          />
        </Fragment>
      );
    return renderResult;
  }
);
MyGridWrapper.displayName = "MyGridWrapper";

//If need to coloreize Data wrap Data in this function
// const ColorizeData = (data) => {
//   if (Array.isArray(data) && data.length > 0) {
//     data = data.map((one) => {
//       if (one.status === "Pending") {
//         return { ...one, _rowColor: "rgb(232, 244, 253)" };
//       } else if (one.status === "Rejected") {
//         return { ...one, _rowColor: "rgb(253, 236, 234)" };
//       } else if (one.status === "Verified") {
//         return { ...one, _rowColor: "rgb(237, 247, 237)" };
//       } else {
//         return one;
//       }
//     });
//   }
//   return data;
// };
