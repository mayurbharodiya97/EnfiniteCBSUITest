import * as API from "pages_audit/pages/reports/api";
import { detailMetadata01 } from "./createMetadata/detailMetadata01";
import { DetailMaster } from "./detailmaster";
import { detailMetadata002 } from "./createMetadata/detailMetadata002";

export const DetailMastersData = ({ screenFlag, subScreenFlag = "" }) => {
  let metaData;
  let otherAPIRequestPara;

  if (screenFlag === "ACCOUNTDELETION") {
    // metaData = accountDeletionMetaData;
  } else if (screenFlag === "GETCHEQUEBOOK") {
    metaData = detailMetadata01;
  } else if (screenFlag === "GETACCTINQUIRY") {
    metaData = detailMetadata002;
  }
  // UTILITYBILLRPT

  return (
    <>
      <DetailMaster
        key={"reportID" + screenFlag + subScreenFlag}
        reportID={screenFlag}
        // reportName={screenFlag}
        dataFetcher={API.getReportData}
        metaData={metaData}
        // disableFilters
        // maxHeight={window.innerHeight - 310}
        // title={metaData.title}
        // options={{
        //   disableGroupBy: metaData.disableGroupBy,
        // }}
        // hideFooter={metaData.hideFooter}
        // hideAmountIn={metaData.hideAmountIn}
        // retrievalType={metaData.retrievalType}
        // initialState={{
        //   groupBy: metaData?.groupBy ?? [],
        // }}
        autoFetch={metaData?.autoFetch ?? true}
        otherAPIRequestPara={otherAPIRequestPara}
      />
    </>
  );
};
