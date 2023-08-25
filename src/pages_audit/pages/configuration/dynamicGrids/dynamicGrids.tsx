import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { Fragment, useContext, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useLocation, useParams } from "react-router-dom";
import { queryClient } from "cache";
import { Alert } from "reactstrap";
import { LoaderPaperComponent } from "components/common/loaderPaper";

interface updateAUTHDetailDataType {
  doccd: any;
  companyID: any;
  branchID: any;
  customerID: any;
}
const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({
    doccd,
    companyID,
    branchID,
    customerID,
  }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData({ doccd, companyID, branchID, customerID });
  };
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
  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.getDynGridData),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {},
    }
  );

  useEffect(() => {
    if (metaData?.docID || "" === null) {
      const mutationArguments: any = {
        doccd: metaData?.docID || "",
        companyID: authState?.companyID ?? "",
        branchID: authState?.user?.branchCode ?? "",
        customerID: "2",
      };
      mutation.mutate(mutationArguments);
    }
  }, [metaData?.docID]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicGridMetaData"]);
      queryClient.removeQueries(["getDynGridData", metaData?.docID]);
    };
  }, []);
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
            data={mutation.data ?? []}
            setData={() => null}
            loading={mutation.isLoading}
            refetchData={() => refetch()}
          />
        </>
      )}
    </>
  );
};
