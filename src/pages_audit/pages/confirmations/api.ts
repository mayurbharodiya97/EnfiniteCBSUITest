import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getConfirmationGridData = async (apiReqPara) => {
  let APIURL;
  let parameters = {};
  if (apiReqPara?.screenFlag === "chequebookCFM") {
    APIURL = "GETCHQCNFDATADISP";
    parameters = {
      FROM_DATE: apiReqPara?.FROM_DATE ?? apiReqPara?.workingDate,
      TO_DATE: apiReqPara?.TO_DATE ?? apiReqPara?.workingDate,
      FLAG: apiReqPara?.FLAG ?? "",
    };
  } else if (apiReqPara?.screenFlag === "limitCFM") {
    APIURL = "GETLMTCNFDATADISP";
  } else if (apiReqPara?.screenFlag === "stockCFM") {
    APIURL = "GETSTOCKCNFDATADISP";
  } else if (apiReqPara?.screenFlag === "stopPaymentCFM") {
    APIURL = "GETSTOPCNFDATADISP";
  } else if (apiReqPara?.screenFlag === "lienCFM") {
    APIURL = "GETLIENCNFDATADISP";
  }

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(APIURL, {
      ...parameters,
      COMP_CD: apiReqPara?.COMP_CD,
      BRANCH_CD: apiReqPara?.BRANCH_CD,
    });
  if (status === "0") {
    // return data;
    return data.map((item) => {
      //chequeboook
      item.SERVICE_TAX = item.SERVICE_TAX
        ? parseFloat(item.SERVICE_TAX).toFixed(2)
        : "0.00";
      item.FULL_ACCT_NO =
        item.BRANCH_CD + " " + item.ACCT_TYPE + " " + item.ACCT_CD;
      item.CHEQUE_SERIES = item.CHEQUE_FROM + " - " + item.CHEQUE_TO;

      //limit
      item.INT_RATE = item.INT_RATE
        ? parseFloat(item.INT_RATE).toFixed(2)
        : "0.00";
      item.PENAL_RATE = item.PENAL_RATE
        ? parseFloat(item.PENAL_RATE).toFixed(2)
        : "0.00";
      item.AD_HOC_LIMIT_FLG =
        item.AD_HOC_LIMIT_FLG === "N"
          ? "Normal Limit"
          : item.AD_HOC_LIMIT_FLG === "A"
          ? "Ad-Hoc Limit"
          : null;
      item.STATUS_FLAG =
        item.STATUS_FLAG === "A"
          ? "Active"
          : item.STATUS_FLAG === "E"
          ? "Expired"
          : null;

      //stock
      item.STOCK_VALUE = item.STOCK_VALUE
        ? parseFloat(item.STOCK_VALUE).toFixed(2)
        : "0.00";
      item.MARGIN = item.MARGIN ? parseFloat(item.MARGIN).toFixed(2) : "0.00";
      item.DRAWING_POWER = item.DRAWING_POWER
        ? parseFloat(item.DRAWING_POWER).toFixed(2)
        : "0.00";

      //stopPayment
      item.CHEQUE_FROM_TO = item.CHEQUE_FROM + " - " + item.CHEQUE_TO;

      //lien
      item.PARENT_CD_NM = item.PARENT_CD + " - " + item.LEAN_NM;
      item.LIEN_STATUS =
        item.LIEN_STATUS === "A"
          ? "Active"
          : item.LIEN_STATUS === "E"
          ? "Expired"
          : null;
      return item;
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
