import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getAccInfo = async (...reqData) => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETJOINTDETILSLIST", {
  //     USER_NAME: reqData?.[3]?.user.id ?? "",
  //   });
  // if (status === "0") {
  //   let responseData = data;
  //   console.log(responseData, "responseData GETJOINTDETILSLIST");
  //   if (Array.isArray(responseData)) {
  //     responseData = responseData.map(({ CODE, DESCRIPTION }) => {
  //       return {
  //         value: CODE,
  //         label: CODE + "-" + DESCRIPTION,
  //       };
  //     });
  //   }
  //   return responseData;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }

  return {
    data: {
      personalInfo: {},
      balanceInfo: {},
      loanInfo: {},
    },
  };
};
