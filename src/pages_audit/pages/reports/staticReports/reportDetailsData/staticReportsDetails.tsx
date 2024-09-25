// import { Dialog } from "@material-ui/core";
import * as API from "../../api";
import { fundTrfSubDetailsMetaData } from "./metadata/fundTrfSubDetails";
import { merchantRevSubDetailsMetaData } from "./metadata/merchantRevSubDetail";
import {
  schduleDetailMetaData,
  schedulePaymentDetailMetaData,
} from "./metadata/scheduledetail";
import { useState } from "react";
import { format } from "date-fns";
// import { constructInitialValue } from "components/dynamicForm/utils/constructINITValues";
import { ScheduleDetailReports } from "./scheduledetailAPIResponse/scheduleDtlAPIResponse";
import { virtualSubDetailsMetaData } from "./metadata/virtualSubDetails";
import { Dialog } from "@mui/material";
import { ReportGrid } from "@acuteinfo/common-base";

export const StaticAdminUserDetailsReports = ({
  screenFlag,
  onClose,
  buttonNames,
  rows,
  open = false,
}) => {
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [isOpenSchedule, setIsOpenSchedule] = useState<any>(false);

  const [buttonName, setButtonName] = useState<any>({});
  let metaData;
  let reportID;
  let otherAPIRequestPara;

  let apiURL = "reportServiceAPI/";
  if (buttonNames === "API_RESPONSE") {
    if (screenFlag === "FUNDTRANSACTIONRPTNEW") {
      metaData = fundTrfSubDetailsMetaData;
      reportID = "FUNDTRANSFERDTL";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "MERCHANTREVERSETRN") {
      metaData = merchantRevSubDetailsMetaData;
      reportID = "MERCHANTPAYMENTDTL";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "VIRTUALCARDREQRPT") {
      metaData = virtualSubDetailsMetaData;
      reportID = "VIRTUALCARDREQDTLRPT";
      otherAPIRequestPara = { TRAN_CD: rows?.TRAN_CD };
    }
  } else if (buttonNames === "DETAIL_RESPONSE") {
    if (screenFlag === "GETSCHDPAYRPT") {
      metaData = schduleDetailMetaData;
      reportID = "GETSCHDPAYDTLRPT";
      apiURL = "commonServiceAPI/GETDYNAMICDATA/";
      otherAPIRequestPara = { TRAN_CD: rows?.TRAN_CD };
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
  return (
    <>
      <Dialog fullWidth={false} maxWidth={"md"} open={open}>
        <div style={{ padding: "10px", margin: "5px" }}>
          <ReportGrid
            key={"ReportDetail" + reportID}
            // reportID={'reportServiceAPI/' + reportID}
            reportID={apiURL + reportID}
            reportName={reportID}
            dataFetcher={API.getReportData}
            metaData={metaData}
            maxHeight={window.innerHeight - 250}
            title={metaData?.title ?? ""}
            options={{
              disableGroupBy: metaData?.disableGroupBy ?? "",
            }}
            hideFooter={metaData?.hideFooter ?? ""}
            hideAmountIn={metaData?.hideAmountIn ?? ""}
            retrievalType={metaData?.retrievalType ?? ""}
            initialState={{
              groupBy: metaData?.groupBy ?? [],
            }}
            onClose={onClose}
            otherAPIRequestPara={otherAPIRequestPara}
            autoFetch={metaData?.autoFetch ?? true}
            onClickActionEvent={(index, id, data) => {
              if (id === "API_RESPONSE") {
                let rowData = {
                  A_SR_CD: data?.SR_CD ?? "",
                  A_TRAN_CD: data?.TRAN_CD ?? "",
                  FROM_ACCT_NO: data?.FROM_ACCT_NO ?? "",
                  TO_BEN_NO: data?.TO_BEN_NO ?? "",
                  CUSTOM_USER_NM: rows?.CUSTOM_USER_NM ?? "",
                  TRN_TYPE: rows?.TRN_TYPE ?? "",
                };
                setIsOpenSchedule(true);
                setSelectedRow(rowData);
                setButtonName(id);
              }
            }}
          />
          {isOpenSchedule ? (
            <ScheduleDetailReports
              rows={selectedRow}
              open={isOpenSchedule}
              onClose={() => setIsOpenSchedule(false)}
              screenFlag={screenFlag}
              buttonNames={buttonNames}
            />
          ) : null}
        </div>
      </Dialog>
    </>
  );
};
