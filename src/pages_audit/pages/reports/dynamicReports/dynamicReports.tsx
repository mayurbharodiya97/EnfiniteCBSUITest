import Report from "components/report";
import { getDateRetrievalReportData } from "../staticReports/api";
import { useLocation } from "react-router-dom";
import * as API from "../api";
import { useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";

export const DynamicReports = () => {
  const location = useLocation();
  const { search } = location;
  let params = new URLSearchParams(search);
  const reportID = params.get("reportID");
  const { data, isLoading, isFetching, isError, error } = useQuery<any, any>(
    ["getDynamicReportMetaData", reportID],
    () => API.getDynamicReportMetaData(reportID)
  );

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
        <Report
          reportID={reportID}
          reportName={"reportID-" + reportID}
          dataFetcher={getDateRetrievalReportData}
          metaData={data}
          disableFilters
          maxHeight={window.innerHeight - 250}
          title={data.title}
          options={{
            disableGroupBy: data.disableGroupBy,
          }}
          hideFooter={data.hideFooter}
          hideAmountIn={data.hideAmountIn}
          retrievalType={data.retrievalType}
        />
      )}
    </>
  );
};
