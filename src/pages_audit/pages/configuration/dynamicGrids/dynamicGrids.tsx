import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { Fragment, useContext, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useParams } from "react-router-dom";
import { queryClient } from "cache";
import { Alert } from "reactstrap";
import { LoaderPaperComponent } from "components/common/loaderPaper";

export const DynamicGrids = () => {
  const { authState } = useContext(AuthContext);
  const { id } = useParams();
  const docID = id;
  // const docID = useMemo(() => {
  //   try {
  //     return atob(String(id));
  //   } catch (err) {
  //     console.log(err);
  //     return id;
  //   }
  // }, [id]);

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
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicGridMetaData"]);
    };
  }, []);
  // console.log(">>metaData", metaData);
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
            key={`DynamicGrid` + docID}
            finalMetaData={metaData as GridMetaDataType}
            data={[]}
            setData={() => null}
            loading={isLoading || isFetching}
            refetchData={() => refetch()}
          />
        </>
      )}
    </>
  );
};
