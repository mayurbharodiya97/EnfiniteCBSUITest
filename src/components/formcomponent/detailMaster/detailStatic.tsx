import * as API from "pages_audit/pages/reports/api";
import { chequebookEntryMetadata } from "./createMetadata/chequebookEntry";
import { DetailMaster } from "./detailmaster";
import { limitEntryMetadata } from "./createMetadata/limitEntry";
import { lienEntryMetadata } from "./createMetadata/lienEntry";
import { stockEntryMetadata } from "./createMetadata/stockEntry";
import { stopPaymentEntryMetadata } from "./createMetadata/stopPaymentEntry";
import { createContext, useContext, useState } from "react";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const DetailMastersData = ({ screenFlag, subScreenFlag = "" }) => {
  let metaData;
  let otherAPIRequestPara;

  if (screenFlag === "GETCHEQUEBOOK") {
    metaData = chequebookEntryMetadata;
  } else if (screenFlag === "GETLIMITENTRY") {
    metaData = limitEntryMetadata;
  } else if (screenFlag === "GETLIENENTRY") {
    metaData = lienEntryMetadata;
  } else if (screenFlag === "GETSTOCKENTRY") {
    metaData = stockEntryMetadata;
  } else if (screenFlag === "GETSTOPPAYMENTENTRY") {
    metaData = stopPaymentEntryMetadata;
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
        autoFetch={metaData?.autoFetch ?? true}
        otherAPIRequestPara={otherAPIRequestPara}
      />
    </>
  );
};
// export const DetailDataContext: any = createContext({
//   GetApidetailData: () => true,
// });

// export const DetailDataProvider: any = ({ children }) => {
//   const [detailData, setDetailData] = useState<any>(null);

//   const GetApidetailData: any = async ({ reportID, otherAPIRequestPara }) => {
//     console.log("<<<detailData1", detailData);
//     const { data, status, message, messageDetails } =
//       await AuthSDK.internalFetcher(reportID, {
//         ...otherAPIRequestPara,
//       });
//     if (status === "0") {
//       // return setNewData(data);
//       return setDetailData(data);
//     } else {
//       throw DefaultErrorObject(message, messageDetails);
//     }
//   };

//   return (
//     <DetailDataContext.Provider
//       value={{ detailData, setDetailData, GetApidetailData }}
//     >
//       {children}
//     </DetailDataContext.Provider>
//   );
// };
