import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { SourceParentGridMetaData } from "./gridMetadata";
import { SourceParentGridUpdate } from "./sourceParentEdit";

const actions: ActionTypes[] = [
  {
    actionName: "Add",
    actionLabel: "Add",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "save",
    actionLabel: "Save",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const transformData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((one, index) => ({
      ...one,
      id: index,
      _hidden: false,
      _isNewRow: false,
    }));
  } else {
    return data;
  }
};
export const SourceParentGrid = () => {
  const isDataChangedRef = useRef(false);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getSourceParentGridData"], () => API.getSourceParentGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getSourceParentGridData"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = false;
    }
  }, [navigate]);
  const GidData = useMemo(() => transformData(data), [data]);
  return (
    <>
      <Fragment>
        {isLoading ? (
          <SourceParentGridUpdate
            key={"Loading-SourceParentUpdate"}
            metadata={SourceParentGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isLoading={isLoading}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </SourceParentGridUpdate>
        ) : isError ? (
          <SourceParentGridUpdate
            key={"Error-SourceParentUpdate"}
            metadata={SourceParentGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isError={isError}
            ErrorMessage={error?.error_msg ?? "Error"}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </SourceParentGridUpdate>
        ) : (
          <SourceParentGridUpdate
            key={"edit"}
            metadata={SourceParentGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={GidData}
            // actions={actions}
            isEditableForm={true}
            mode={"edit"}
            //@ts-ignore
            actions={actions}
          >
            {({
              handelCloseEvent,
              handleSubmit,
              classes,
              handelActionEvent,
            }) => <></>}
          </SourceParentGridUpdate>
        )}
        {/* <Routes>
          <Route
            path="view-details"
            element={<SourceParentConfigDetail trnType={""} configType={""} />}
          />
        </Routes> */}
      </Fragment>
    </>
  );
};

export const SourceParentGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <SourceParentGrid />
    </ClearCacheProvider>
  );
};
