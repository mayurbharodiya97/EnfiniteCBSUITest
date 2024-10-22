import { ReportGrid } from "@acuteinfo/common-base";
import Dialog from "@mui/material/Dialog";
import * as API from "../../api";
import { fundTrfSubDetailsMetaData } from "./metadata/fundTrfSubDetails";
import { merchantRevSubDetailsMetaData } from "./metadata/merchantRevSubDetail";
import { schduleDetailMetaData } from "./metadata/scheduledetail";
import { useMemo, useState } from "react";
import { ScheduleDetailReports } from "./scheduledetailAPIResponse/scheduleDtlAPIResponse";
import { virtualSubDetailsMetaData } from "./metadata/virtualSubDetails";
import { utilityBillPayAPIResMetaData } from "./metadata/utilityBillPayAPIResponse";
import { applyForFixedDepositeMetaData } from "./metadata/applyForFixedDeposite";
import { cardPaayDetailMetaData } from "./metadata/cardPaymentDetail";
import { InsurancePrimiDetailMetaData } from "./metadata/insurancePremimumPaymentDetail";
import { format } from "date-fns";
import { mobEmailUpdLogDetailsMetaData } from "./metadata/mobEmailUpdLogDetails";
import { useTranslation } from "react-i18next";
function isValidDate(dateString) {
  if (/^\d+$/.test(dateString)) {
    return false;
  }
  const date: any = new Date(dateString);
  return !isNaN(date) && dateString.trim() !== "";
}

export const StaticAdminUserDetailsReports = ({
  screenFlag,
  onClose,
  buttonNames,
  rows,
  open = false,
}) => {
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [isOpenSchedule, setIsOpenSchedule] = useState<any>(false);
  const { t } = useTranslation();
  let selectedKeys;

  if (buttonNames === "SCHEDULE_RESPONSE")
    selectedKeys = [
      "CUSTOM_USER_NM",
      "TRAN_DT",
      "LAST_PROCESS_DT",
      "TRN_TYPE",
      "STATUS",
      "TRN_STATUS",
      "PAYMENT_FREQUENCY",
      "PAYMENT_TYPE",
      "NO_OF_PAYMENT",
    ];
  else if (buttonNames === "API_RESPONSE")
    selectedKeys = [
      "USER_NAME",
      "TRN_TYPE",
      "TRAN_TYPE",
      "FROM_ACCT_NO",
      "TO_ACCT_NO",
      "TRN_STATUS",
      "STATUS",
    ];

  const columnLabel = useMemo(() => {
    return rows._metaData.reduce((accu, item) => {
      return { ...accu, [item?.accessor]: item?.columnName };
    }, {});
  }, []);

  const defaultFilter = useMemo(() => {
    return Object.entries(rows)
      .filter(([key]) => selectedKeys.includes(key))
      .map(([key, value]) => {
        return {
          id: key,
          value: {
            columnName: columnLabel[key] ?? key,
            value: isValidDate(value)
              ? format(new Date(String(value)), "dd/MM/yyyy HH:mm:ss")
              : value,
          },
        };
      });
  }, [rows, columnLabel, selectedKeys]);

  defaultFilter.sort((a, b) => {
    const indexA = selectedKeys.indexOf(a.id);
    const indexB = selectedKeys.indexOf(b.id);

    return indexA - indexB;
  });

  // const [buttonName, setButtonName] = useState<any>({});
  let metaData;
  let reportID;
  let otherAPIRequestPara;

  let apiURL = "reportServiceAPI/";
  if (buttonNames === "API_RESPONSE") {
    if (screenFlag === "FUNDTRANSACTIONRPTNEW") {
      metaData = fundTrfSubDetailsMetaData;
      reportID = "FUNDTRANSFERDTL";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "PAYGATEWAY") {
      metaData = merchantRevSubDetailsMetaData;
      reportID = "MERCHANTPAYMENTDTL";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "VIRTUALCARDREQRPT") {
      metaData = virtualSubDetailsMetaData;
      reportID = "VIRTUALCARDREQDTLRPT";
      otherAPIRequestPara = { TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "UTILITYBILLRPT") {
      metaData = utilityBillPayAPIResMetaData;
      reportID = "UTILITYBILLDTL";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "FDDEPOSITEREQ") {
      metaData = applyForFixedDepositeMetaData;
      reportID = "FDDEPOSITEDTL";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "CARDPAYTRN") {
      metaData = cardPaayDetailMetaData;
      reportID = "CARDPAYDETAIL";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "INSURANCEPAYTRNRPT") {
      metaData = InsurancePrimiDetailMetaData;
      reportID = "INSURANCEPAYDTLRPT";
      otherAPIRequestPara = { A_TRAN_CD: rows?.TRAN_CD };
    } else if (screenFlag === "GETSMSEMAILUPDFRMCITYTOUCHRPT") {
      metaData = mobEmailUpdLogDetailsMetaData;
      reportID = "GETSMSEMAILUPDFRMCITYDTLRPT";
      apiURL = "commonServiceAPI/GETDYNAMICDATA/";
      otherAPIRequestPara = { TRAN_CD: rows?.TRAN_CD };
    }
  } else if (buttonNames === "SCHEDULE_RESPONSE") {
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
            // disableFilters
            maxHeight={window.innerHeight - 280}
            title={t(metaData?.title ?? "")}
            defaultFilter={[...(rows?.__queryFilters ?? []), ...defaultFilter]}
            hideStatusBar={true}
            options={{
              disableGroupBy: metaData?.disableGroupBy ?? "",
            }}
            hideFooter={metaData?.hideFooter ?? ""}
            hideAmountIn={metaData?.hideAmountIn ?? ""}
            hideShowFiltersSwitch={metaData?.hideShowFiltersSwitch ?? false}
            retrievalType={metaData?.retrievalType ?? ""}
            initialState={{
              groupBy: metaData?.groupBy ?? [],
            }}
            // screenFlag={reportID}
            onClose={onClose}
            // buttonNames={buttonNames}
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
                // setButtonName(id);
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
