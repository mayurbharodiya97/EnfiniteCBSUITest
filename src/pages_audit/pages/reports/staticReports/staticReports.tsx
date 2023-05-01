import Report from "components/report";
import * as API from "./api";
import { accountDeletionMetaData } from "./metaData/accountDeletion";
import { loginHistoryMetaData } from "./metaData/loginHistory";
import { passwordChangeHistoryMetaData } from "./metaData/passwordChangeHistory";
import { registrationCustomerMetaData } from "./metaData/registrationCustomer";
import { userActivityMetaData } from "./metaData/userActivity";

export const StaticAdminUserReports = ({ screenFlag }) => {
  let dataFetcher;
  let metaData;
  if (screenFlag === "REGISTRATIONCUSTRPT") {
    dataFetcher = API.getDateRetrievalReportData;
    metaData = registrationCustomerMetaData;
  } else if (screenFlag === "ACCTDELETIONRPT") {
    dataFetcher = API.getDateRetrievalReportData;
    metaData = accountDeletionMetaData;
  } else if (screenFlag === "PASSCHANGEHISTRPT") {
    dataFetcher = API.getDateRetrievalReportData;
    metaData = passwordChangeHistoryMetaData;
  } else if (screenFlag === "LOGINHISTORYRPT") {
    dataFetcher = API.getDateUserNameRetrievalReportData;
    metaData = loginHistoryMetaData;
  } else if (screenFlag === "USERACTIVITYRPT") {
    dataFetcher = API.getDateUserNameRetrievalReportData;
    metaData = userActivityMetaData;
  }

  return (
    <>
      <Report
        key={"reportID" + screenFlag}
        reportID={screenFlag}
        reportName={screenFlag}
        dataFetcher={dataFetcher}
        metaData={metaData}
        disableFilters
        maxHeight={window.innerHeight - 250}
        title={metaData.title}
        options={{
          disableGroupBy: metaData.disableGroupBy,
        }}
        hideFooter={metaData.hideFooter}
        hideAmountIn={metaData.hideAmountIn}
        retrievalType={metaData.retrievalType}
        initialState={{
          groupBy: metaData?.groupBy ?? [],
        }}
      />
    </>
  );
};
