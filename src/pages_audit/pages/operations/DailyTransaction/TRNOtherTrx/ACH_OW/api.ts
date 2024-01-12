import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getACH_OWList = async (reqData) => {
  console.log(reqData, "reqData");
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNACHOTWDTLTAB", {
      BRANCH_CD: reqData.BRANCH_CD,
      COMP_CD: reqData.COMP_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD,

      ENT_COMP_CD: reqData.COMP_CD,
      ENT_BRANCH_CD: reqData.BRANCH_CD,
      TRAN_CD: reqData.TRAN_CD,
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};