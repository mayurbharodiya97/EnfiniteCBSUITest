import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

//List
export const getTRN002List = async (reqData) => {
  //view all
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRNCNFF2", {
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;

    responseData &&
      responseData.map((a, i) => {
        a.index = i;
        a.account1 = a.ACCT_TYPE + a.TYPE_NM;
        a.trx1 = a.TYPE_CD + a.TYPE_CD_DESC;
        a.sdc1 = a.SDC + a.SDC_DESC;
        a.time = a?.ENTERED_DATE.split(" ")[1].substring(0, 5);
        a.status = a.CONFIRMED == "0" ? "Pending" : "Confirmed";

        // if (a?.CONFIRMED === "0") {
        //   a._rowColor = "rgb(152 59 70 / 61%)";
        // }
        if (a?.CONFIRMED === "Y") {
          a._rowColor = "rgb(9 132 3 / 51%)";
        }
      });

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

//Operations
export const confirmScroll = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONFIRMDAILYTRNDATA", {
      CONFIRMED: "Y",
      CONFIRM_FLAG: "Y",
      TRAN_CD: reqData?.TRAN_CD,
      COMP_CD: reqData?.COMP_CD,
      ENTERED_COMP_CD: reqData?.ENTERED_COMP_CD,
      ENTERED_BRANCH_CD: reqData?.ENTERED_BRANCH_CD,
      SCROLL1: reqData?.SCROLL1,
    });
  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
