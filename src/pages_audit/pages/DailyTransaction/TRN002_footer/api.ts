import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

const arr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "OCT",
  "NOV",
  "DEC",
];

let today = new Date();
let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

let date = day + "/" + arr[month] + "/" + year;
let date2 = day + "-" + arr[month] + "-" + year;

export const getTRN002List = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRNCNFF2", {
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const confirmScroll = async (reqData) => {
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
