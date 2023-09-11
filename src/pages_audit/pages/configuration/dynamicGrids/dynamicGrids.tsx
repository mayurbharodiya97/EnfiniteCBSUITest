import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { Fragment, useContext, useEffect, useMemo } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
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

  const result = useQueries([
    {
      queryKey: ["getDynamicGridMetaData", docID],
      queryFn: () =>
        API.getDynamicGridMetaData({
          docID,
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
        }),
    },
    {
      queryKey: ["getDynActionButtonData"],
      queryFn: () =>
        API.getDynActionButtonData({
          DOC_CD: result[0].data.docID || "",
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
        }),
    },
  ]);
  console.log("result[0].data", result[0].data?.docID);
  console.log(
    "result[1].data",
    result[1].data?.map((key) => {
      console.log("key", key);
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
    if (result[0].data?.docID || "" === null) {
      const mutationArguments: any = {
        doccd: result[0].data?.docID || "",
        companyID: authState?.companyID ?? "",
        branchID: authState?.user?.branchCode ?? "",
        customerID: "2",
      };
      mutation.mutate(mutationArguments);
    }
  }, [result[0].data?.docID]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicGridMetaData"]);
      queryClient.removeQueries(["getDynGridData", result[0].data?.docID]);
    };
  }, []);
  let errorMsg = `${result[0].error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";
  return (
    <>
      {result[0].isLoading || result[0].isFetching ? (
        <LoaderPaperComponent />
      ) : result[0].isError ? (
        <Alert
          severity="error"
          errorMsg={errorMsg}
          errorDetail={""}
          color="error"
        />
      ) : (
        <>
          <GridWrapper
            key={`DynamicGrid` + docID}
            finalMetaData={result[0].data as GridMetaDataType}
            data={mutation.data ?? []}
            setData={() => null}
            loading={mutation.isLoading}
            refetchData={() => result[0].refetch()}
          />
        </>
      )}
    </>
  );
};
