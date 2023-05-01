import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { BillerFieldsGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { BillerFieldOptions } from "./fieldOptions";

const actions: ActionTypes[] = [
  {
    actionName: "options",
    actionLabel: "Options",
    multiple: false,
    rowDoubleClick: true,
    shouldExclude: (data, authDetails) => {
      if (Array.isArray(data) && data.length > 0) {
        if (data[0]?.data?.OPTIONS === "N") {
          return true;
        }
      }
      return false;
    },
  },
];

export const BillerFields = ({
  billerData,
  rows: rowDataParent,
  ClosedEventCall,
}) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const [rowData, setRowData] = useState({});
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "options") {
        setIsOpenOptions(true);
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
  >(["getBillerFieldsGridData"], () =>
    API.getBillerFieldsGridData({
      categoryID: billerData?.CATEGORY_ID ?? "",
      subCategoryID: billerData?.SUB_CATEGORY_ID ?? "",
      billerID: billerData?.BILLER_ID ?? "",
    })
  );

  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries(["getBillerFieldsGridData"]);
  //   };
  // }, [getEntries]);

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
        key={`BillerFieldsGrid`}
        finalMetaData={BillerFieldsGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      {isOpenOptions ? (
        <BillerFieldOptions
          open={isOpenOptions}
          closeDialog={() => {
            setIsOpenOptions(false);
            ClosedEventCall(rowDataParent);
          }}
          fieldRowData={rowData}
        />
      ) : null}
      {/* <Routes>
        <Route
          path="options/*"
          element={
            <BillerFieldOptions
              closeDialog={() => {
                ClosedEventCall(rowDataParent);
              }}
              fieldRowData={rowData}
            />
          }
        />
      </Routes> */}
    </Fragment>
  );
};
