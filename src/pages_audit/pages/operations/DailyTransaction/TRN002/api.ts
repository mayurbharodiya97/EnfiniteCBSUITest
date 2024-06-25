import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { format } from "date-fns"; //format(new Date(), "dd/MMM/yyyy")

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
        a.account1 = a.ACCT_TYPE;
        a.trx1 = a.TYPE_CD;
        a.sdc1 = a.SDC;
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
      SCROLL1: reqData?.scrollNo ?? "",
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      TYPE_CD: reqData?.TYPE_CD,
      AMOUNT: reqData?.AMOUNT,
      SCREEN_REF: "ETRN/002",
    });
  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

//validate
export const getConfirmDataValidation = async (reqData) => {
  console.log(reqData, "reqData VALIDATECONFRIMEDDATA");

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATECONFRIMEDDATA", {
      BRANCH_CD: reqData?.BRANCH_CD,
      COMP_CD: reqData?.COMP_CD,
      TYPE_CD: reqData?.TYPE_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      TRAN_CD: reqData?.TRAN_CD,
      CHEQUE_NO: reqData?.CHEQUE_NO, //33
      CHEQUE_DT: format(new Date(reqData?.TRAN_DT), "dd/MMM/yyyy"), //06/Mar/2024
      OP_DATE: format(new Date(reqData?.TRAN_DT), "dd/MMM/yyyy"),
      ENTERED_COMP_CD: reqData?.ENTERED_COMP_CD,
      ENTERED_BRANCH_CD: reqData?.ENTERED_BRANCH_CD,
      AMOUNT: reqData?.AMOUNT,
      ENTERED_BY: reqData?.ENTERED_BY,
      STATUS: reqData?.status,

      INST_DUE_DT: "10-APR-2024",
      CUSTOMER_ID: "10",
      AVALIABLE_BAL: "1000",
      SHADOW_CL: "10",
      HOLD_BAL: "10",
      LEAN_AMT: "10",
      AGAINST_CLEARING: "10",
      MIN_BALANCE: "1000",
      CONF_BAL: "100",
      TRAN_BAL: "100",
      UNCL_BAL: "10",
      LIMIT_AMOUNT: "100",
      DRAWING_POWER: "",
      OD_APPLICABLE: "",
      TYPE: "C",
    });
  if (status === "0") {
    let responseData = data;
    console.log("no errrr");
    return responseData[0];
  } else {
    console.log("errrr");
    throw DefaultErrorObject(message, messageDetails);
  }
};
