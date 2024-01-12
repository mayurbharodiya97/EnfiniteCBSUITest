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
        a.date1 = a.TRAN_DT?.substring(0, 10);
      });

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

//Operations
export const confirmScroll = async (reqData) => {
  console.log(reqData, "reqqq");

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONFIRMDAILYTRNDATA", {
      CONFIRMED: "Y",
      TRAN_CD: reqData?.TRAN_CD,
      COMP_CD: reqData?.COMP_CD,
    });
  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};