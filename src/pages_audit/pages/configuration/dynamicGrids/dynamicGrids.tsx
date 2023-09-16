import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useCallback, useContext, useEffect, useRef } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { queryClient } from "cache";
import { Alert } from "reactstrap";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { ActionTypes } from "components/dataTable";
import { DynamicFormWrapper } from "../dynamicFormWrapper/dynamicFormwrapper";

interface updateAUTHDetailDataType {
  DOC_CD: any;
  COMP_CD: any;
  BRANCH_CD: any;
}
const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({ DOC_CD, COMP_CD, BRANCH_CD }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData({ DOC_CD, COMP_CD, BRANCH_CD });
  };
const actions: ActionTypes[] = [];
export const DynamicGrids = () => {
  const { authState } = useContext(AuthContext);
  const isDataChangedRef = useRef(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const docID = id;

  const {
    data: metaData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getDynamicGridMetaData", docID], () =>
    API.getDynamicGridMetaData({
      docID,
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
    })
  );

  const docCd = metaData?.DOC_CD ?? "";
  const result = useQueries([
    {
      queryKey: ["getDynGridData", docCd],
      queryFn: () =>
        API.getDynGridData({
          doccd: docCd || "",
          companyID: authState?.companyID ?? "",
          branchID: authState?.user?.branchCode ?? "",
          customerID: "2",
          TRAN_CD: "86",
        }),
    },
  ]);
  const loading = result[0].isLoading || result[0].isFetching;
  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.getDynActionButtonData),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {},
    }
  );

  useEffect(() => {
    if (!mutation?.isLoading) {
      const newActions = (mutation?.data || []).map((item) => {
        return {
          actionName: item.actionName,
          actionLabel: item.actionLabel,
          multiple:
            item?.actionLabel === "Add"
              ? (item.multiple = undefined)
              : item.multiple,
          rowDoubleClick: item.rowDoubleClick,
          alwaysAvailable: item.alwaysAvailable,
        };
      });

      actions.length = 0;
      actions.push(...newActions);
    }
  }, [actions, mutation?.data]);

  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
  useEffect(() => {
    if (docCd || "" === null) {
      const mutationArguments: any = {
        DOC_CD: docCd || "",
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
      };
      mutation.mutate(mutationArguments);
    }
  }, [docCd]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicGridMetaData", docID]);
      queryClient.removeQueries(["getDynGridData"]);
    };
  }, [docID]);

  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : isError ? (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Error"}
          errorDetail={""}
          color="error"
        />
      ) : (
        <>
          <GridWrapper
            key={`DynamicGrid` + docID + actions}
            finalMetaData={metaData as GridMetaDataType}
            data={result[0].data ?? []}
            setData={() => null}
            loading={loading}
            actions={actions}
            setAction={setCurrentAction}
            refetchData={() => result[0].refetch()}

            // ref={myGridRef}
          />
        </>
      )}

      <Routes>
        {(mutation?.data || []).map((item) => (
          <Route
            key={item.actionName}
            path={`/${item.actionName}`}
            element={
              <DynamicFormWrapper
                handleDialogClose={handleDialogClose}
                isDataChangedRef={isDataChangedRef}
                data={item}
                docID={docID}
              />
            }
          />
        ))}
      </Routes>
    </>
  );
};
