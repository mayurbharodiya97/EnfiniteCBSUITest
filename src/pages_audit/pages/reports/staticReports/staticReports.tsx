import Report from "components/report";
import * as API from "../api";
import { accountDeletionMetaData } from "./metaData/accountDeletion";
import { adminUserActivityMetaData } from "./metaData/adminPanelUserActivity";
import { appUsageHistoryMetaData } from "./metaData/adminUserapplicationHistory";
import { useState } from "react";
import { StaticAdminUserDetailsReports } from "./reportDetailsData/staticReportsDetails";
import { format } from "date-fns";
import { TrnParticularsDetailsReports } from "./trnParticulars/trnParticulars";
import { communMasterConfig } from "./metaData/comonMSTDetail";

export const StaticAdminUserReports = ({ screenFlag, subScreenFlag = "" }) => {
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const [isOpenTrnParticular, setIsOpenTrnParticular] = useState<any>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [buttonName, setButtonName] = useState<any>({});
  let metaData;
  let otherAPIRequestPara;
  // let apiURL = "reportServiceAPI/";
  let apiURL = "enfinityCommonServiceAPI/GETDYNAMICDATA/";

  if (screenFlag === "ACCOUNTDELETION") {
    metaData = accountDeletionMetaData;
  } else if (screenFlag === "ADMINUSERACTIVITY") {
    metaData = adminUserActivityMetaData;
  } else if (screenFlag === "USERTBGLOG") {
    metaData = appUsageHistoryMetaData;
  } else if (screenFlag === "GETPROPMISCDATA") {
    metaData = communMasterConfig;
  }
  // UTILITYBILLRPT
  return (
    <>
      <Report
        key={"reportID" + screenFlag + subScreenFlag}
        reportID={apiURL + screenFlag}
        reportName={screenFlag}
        dataFetcher={API.getReportData}
        metaData={metaData}
        disableFilters
        maxHeight={window.innerHeight - 310}
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
        onClickActionEvent={(index, id, data) => {
          if (id === "TRN_PARTICULARS") {
            let rowData = {
              A_TRN_DT: format(
                new Date(data?.TRAN_DT) ?? new Date(),
                "dd/MM/yyyy HH:mm:ss"
              ),
              A_USER_ID: data?.USER_NAME ?? "",
              A_FROM_SOURCE: data?.APP_INDICATOR ?? "",
              A_FROM_ACCT: data?.FROM_ACCT_NO ?? "",
              A_TO_ACCT: data?.TO_ACCT_NO ?? "",
              A_TRN_TYPE: data?.ORG_TRN_TYPE ?? "",
              A_MOBILE_NO: data?.MOBILE_NO ?? "",
              REMARKS: data?.REMARKS ?? "",
              A_REF_NO: data?.REF_NO ?? "",
              A_CATEGORY_ID: data?.CATEGORY_ID ?? "",
              A_SUB_CATEGORY_ID: data?.SUB_CATEGORY_ID ?? "",
              A_BILLER_ID: data?.BILLER_ID ?? "",
              A_BILL_NO: data?.BILL_NO ?? "",
            };
            setIsOpenTrnParticular(true);
            setSelectedRow(rowData);
            setButtonName(id);
          } else {
            if (typeof index !== "undefined" && typeof id !== "undefined") {
              setSelectedRow(data);
              setIsOpenSave(true);
              setButtonName(id);
            }
          }
        }}
        autoFetch={metaData?.autoFetch ?? true}
        otherAPIRequestPara={otherAPIRequestPara}
      />
      {isOpenSave ? (
        <StaticAdminUserDetailsReports
          screenFlag={screenFlag}
          rows={selectedRow}
          open={isOpenSave}
          onClose={() => setIsOpenSave(false)}
          buttonNames={buttonName}
        />
      ) : isOpenTrnParticular ? (
        <TrnParticularsDetailsReports
          rows={selectedRow}
          open={isOpenTrnParticular}
          onClose={() => setIsOpenTrnParticular(false)}
        />
      ) : null}
    </>
  );
};
